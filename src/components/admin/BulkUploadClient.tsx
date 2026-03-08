"use client";

import { useRef, useState } from "react";
import type { ParsedStory } from "@/app/api/bulk-upload/route";
import BulkUploadPreview from "./BulkUploadPreview";

type Genre = { id: string; name: string; slug: string };
type Props = { genres: Genre[] };

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "done"; stories: ParsedStory[]; warnings: string[] }
  | { status: "error"; message: string };

export default function BulkUploadClient({ genres }: Props) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      setState({ status: "error", message: "Please choose a .docx file." });
      return;
    }

    setState({ status: "uploading" });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/bulk-upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setState({ status: "error", message: data.error ?? "Upload failed." });
      return;
    }

    setState({ status: "done", stories: data.stories, warnings: data.warnings });
    if (inputRef.current) inputRef.current.value = "";
  }

  if (state.status === "done") {
    return (
      <div>
        {state.warnings.length > 0 && (
          <details className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-sm px-4 py-2">
            <summary className="cursor-pointer font-semibold">
              {state.warnings.length} formatting note{state.warnings.length !== 1 ? "s" : ""} from Word
            </summary>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {state.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </details>
        )}
        <BulkUploadPreview
          stories={state.stories}
          genres={genres}
          onReset={() => setState({ status: "idle" })}
        />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="border-2 border-dashed border-[var(--color-border)] rounded-sm bg-[var(--color-parchment)] p-10 text-center">
        <p className="text-[var(--color-ink-muted)] mb-4">
          {state.status === "uploading" ? "Parsing document…" : "Choose your Word document to begin"}
        </p>

        <label className="cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFile}
            disabled={state.status === "uploading"}
            className="sr-only"
          />
          <span
            className={`inline-block rounded-sm border px-6 py-2.5 text-sm font-semibold transition-colors ${
              state.status === "uploading"
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-[var(--color-amber)] text-[var(--color-amber)] hover:bg-[var(--color-amber)] hover:text-white"
            }`}
          >
            {state.status === "uploading" ? "Parsing…" : "Choose .docx file"}
          </span>
        </label>

        {state.status === "error" && (
          <p className="mt-4 text-sm text-red-600">{state.message}</p>
        )}
      </div>
    </div>
  );
}
