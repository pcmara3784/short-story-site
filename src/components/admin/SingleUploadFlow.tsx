"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStory } from "@/lib/actions/stories";
import { slugify } from "@/lib/slugify";

type Genre = { id: string; name: string; slug: string };

type UploadResult = {
  html: string;
  title: string;
  genreLabel: string | null;
  wordCount: number;
  warnings: string[];
};

type Props = {
  genres: Genre[];
};

type State = "idle" | "uploading" | "confirming";

export default function SingleUploadFlow({ genres }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<State>("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation form state
  const [title, setTitle] = useState("");
  const [genreId, setGenreId] = useState<string>("");
  const [publish, setPublish] = useState(true);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setState("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-docx", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        setState("idle");
        return;
      }

      // Pre-populate fields
      setUploadResult(data);
      setTitle(data.title ?? "");

      // Match genre label to existing genre
      const matched = data.genreLabel
        ? genres.find(
            (g) =>
              g.name.toLowerCase() === data.genreLabel.toLowerCase() ||
              g.slug === data.genreLabel.toLowerCase()
          )
        : null;
      setGenreId(matched?.id ?? "");

      setState("confirming");
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  function handleReset() {
    setState("idle");
    setError(null);
    setUploadResult(null);
    setTitle("");
    setGenreId("");
    setPublish(true);
  }

  async function handlePublish() {
    if (!uploadResult) return;

    const slug = slugify(title || "untitled");
    const blurb = stripHtml(uploadResult.html).slice(0, 200).trimEnd() +
      (stripHtml(uploadResult.html).length > 200 ? "…" : "");

    const formData = new FormData();
    formData.append("title", title || "Untitled");
    formData.append("slug", slug);
    formData.append("blurb", blurb);
    formData.append("content", uploadResult.html);
    if (genreId) formData.append("genreIds", genreId);
    if (publish) formData.append("published", "on");

    setIsSaving(true);
    startTransition(async () => {
      try {
        await createStory(formData);
        // createStory redirects on success
      } catch {
        setError("Failed to save story. Please try again.");
        setIsSaving(false);
      }
    });
  }

  if (state === "idle") {
    return (
      <div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
            {error}
          </div>
        )}
        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[var(--color-border)] rounded-sm p-12 cursor-pointer hover:border-[var(--color-amber)] hover:bg-[var(--color-amber-pale)] transition-colors">
          <span className="text-3xl">📄</span>
          <span className="text-sm font-semibold text-gray-700">Click to upload a .docx file</span>
          <span className="text-xs text-gray-400">Title extracted from first line · Genre from "Genre: X" line</span>
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>
    );
  }

  if (state === "uploading") {
    return (
      <div className="flex items-center gap-3 p-8 text-sm text-gray-500">
        <span className="animate-spin">⏳</span> Parsing document…
      </div>
    );
  }

  if (state === "confirming" && uploadResult) {
    const wordCount = uploadResult.wordCount;

    return (
      <div className="max-w-xl space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
            {error}
          </div>
        )}

        {uploadResult.warnings.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-sm text-xs text-yellow-700 space-y-1">
            <p className="font-semibold">Conversion notes:</p>
            {uploadResult.warnings.map((w, i) => <p key={i}>{w}</p>)}
          </div>
        )}

        <div>
          <label className="admin-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-input"
            placeholder="Story title"
          />
        </div>

        <div>
          <label className="admin-label">
            Genre
            {uploadResult.genreLabel &&
              !genres.find((g) => g.name.toLowerCase() === uploadResult.genreLabel!.toLowerCase()) && (
                <span className="ml-2 text-xs font-normal text-orange-500 normal-case tracking-normal">
                  "{uploadResult.genreLabel}" not found — select manually
                </span>
              )}
          </label>
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className="admin-input"
          >
            <option value="">Uncategorized</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400 border-l-2 border-gray-100 pl-3 italic">
          {stripHtml(uploadResult.html).slice(0, 200).trimEnd()}
          {stripHtml(uploadResult.html).length > 200 ? "…" : ""}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 py-1 border-t border-gray-100">
          <span>~{wordCount.toLocaleString()} words</span>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="accent-[var(--color-amber)]"
          />
          <span className="font-medium text-gray-700">Publish immediately</span>
          <span className="text-gray-400">(uncheck to save as draft)</span>
        </label>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handlePublish}
            disabled={!title.trim() || isPending || isSaving}
            className="rounded-sm bg-[var(--color-amber)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving…" : publish ? "Publish Story" : "Save as Draft"}
          </button>
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Start over
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}
