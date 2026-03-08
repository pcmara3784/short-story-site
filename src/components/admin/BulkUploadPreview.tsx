"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ParsedStory } from "@/app/api/bulk-upload/route";
import { bulkImport } from "@/lib/actions/bulk-import";

type Genre = { id: string; name: string; slug: string };

type StoryRow = ParsedStory & {
  selected: boolean;
  resolvedGenreId: string | null;
  duplicateAction: "skip" | "overwrite";
};

type Props = {
  stories: ParsedStory[];
  genres: Genre[];
  onReset: () => void;
};

export default function BulkUploadPreview({ stories, genres, onReset }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const [rows, setRows] = useState<StoryRow[]>(() =>
    stories.map((s) => {
      // Try to match detected genre label to an existing genre
      const matchedGenre = s.genreLabel
        ? genres.find(
            (g) =>
              g.name.toLowerCase() === s.genreLabel!.toLowerCase() ||
              g.slug === s.genreLabel!.toLowerCase()
          )
        : null;

      return {
        ...s,
        selected: s.confidence === "clean" && !s.isDuplicate,
        resolvedGenreId: matchedGenre?.id ?? null,
        duplicateAction: "skip",
      };
    })
  );

  function updateRow(tempId: string, patch: Partial<StoryRow>) {
    setRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r))
    );
  }

  function toggleAll(checked: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  }

  const selectedCount = rows.filter((r) => r.selected).length;
  const reviewCount = rows.filter((r) => r.confidence === "review").length;
  const duplicateCount = rows.filter((r) => r.isDuplicate).length;

  async function handleImport() {
    const toImport = rows
      .filter((r) => r.selected)
      .map((r) => ({
        title: r.title,
        genreId: r.resolvedGenreId,
        content: r.content,
        duplicateAction: r.isDuplicate ? r.duplicateAction : undefined,
        existingId: r.existingId,
      }));

    startTransition(async () => {
      const res = await bulkImport(toImport);
      setResult(res);
    });
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center space-y-4">
          <p className="text-4xl">✓</p>
          <h2 className="text-xl font-bold text-gray-900">Import complete</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold text-green-700">{result.imported}</span> stories imported as drafts</p>
            {result.skipped > 0 && (
              <p><span className="font-semibold text-yellow-700">{result.skipped}</span> duplicates skipped</p>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="text-left bg-red-50 border border-red-200 rounded-sm p-3 text-xs text-red-700 space-y-1">
              <p className="font-semibold">Errors:</p>
              {result.errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
          <p className="text-xs text-gray-400">
            All imported stories are saved as <strong>drafts</strong>. Review each one, add a proper blurb, and publish when ready.
          </p>
          <button
            onClick={() => router.push("/admin/stories")}
            className="inline-block rounded-sm bg-[var(--color-amber)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors"
          >
            Go to Story List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-3 text-sm">
          <span className="text-gray-700 font-semibold">{rows.length} stories detected</span>
          {reviewCount > 0 && (
            <span className="text-yellow-600">⚠ {reviewCount} need review</span>
          )}
          {duplicateCount > 0 && (
            <span className="text-orange-600">⊕ {duplicateCount} duplicates</span>
          )}
        </div>
        <button
          onClick={onReset}
          className="ml-auto text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Upload different file
        </button>
      </div>

      {/* Story rows */}
      <div className="space-y-3 mb-8">
        {/* Select all */}
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={selectedCount === rows.length}
            onChange={(e) => toggleAll(e.target.checked)}
            className="accent-[var(--color-amber)]"
          />
          Select all / deselect all
        </label>

        {rows.map((row) => (
          <div
            key={row.tempId}
            className={`bg-white border rounded-sm p-4 ${
              !row.selected ? "opacity-50" : ""
            } ${
              row.confidence === "review"
                ? "border-yellow-300"
                : row.isDuplicate
                ? "border-orange-300"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={row.selected}
                onChange={(e) => updateRow(row.tempId, { selected: e.target.checked })}
                className="accent-[var(--color-amber)] mt-1 flex-shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {row.confidence === "review" && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                      ⚠ Review — {row.reviewReason}
                    </span>
                  )}
                  {row.isDuplicate && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                      Duplicate title
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">
                    ~{row.wordCount.toLocaleString()} words
                  </span>
                </div>

                {/* Title */}
                <div>
                  <label className="admin-label">Title</label>
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => updateRow(row.tempId, { title: e.target.value })}
                    className="admin-input"
                    placeholder="Story title"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="admin-label">
                    Genre
                    {row.genreLabel && !genres.find((g) => g.name.toLowerCase() === row.genreLabel!.toLowerCase()) && (
                      <span className="ml-2 text-xs font-normal text-orange-500 normal-case tracking-normal">
                        "{row.genreLabel}" not found — select manually
                      </span>
                    )}
                  </label>
                  <select
                    value={row.resolvedGenreId ?? ""}
                    onChange={(e) => updateRow(row.tempId, { resolvedGenreId: e.target.value || null })}
                    className="admin-input"
                  >
                    <option value="">Uncategorized</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Duplicate resolution */}
                {row.isDuplicate && (
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`dup-${row.tempId}`}
                        checked={row.duplicateAction === "skip"}
                        onChange={() => updateRow(row.tempId, { duplicateAction: "skip" })}
                        className="accent-[var(--color-amber)]"
                      />
                      Skip (keep existing)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`dup-${row.tempId}`}
                        checked={row.duplicateAction === "overwrite"}
                        onChange={() => updateRow(row.tempId, { duplicateAction: "overwrite" })}
                        className="accent-[var(--color-amber)]"
                      />
                      Overwrite existing
                    </label>
                  </div>
                )}

                {/* Excerpt */}
                <p className="text-xs text-gray-400 italic border-l-2 border-gray-100 pl-2">
                  {row.excerpt || <span className="text-red-400">No content detected</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleImport}
          disabled={selectedCount === 0 || isPending}
          className="rounded-sm bg-[var(--color-amber)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
        >
          {isPending ? "Importing…" : `Import ${selectedCount} ${selectedCount === 1 ? "story" : "stories"}`}
        </button>
        <p className="text-xs text-gray-400">
          All stories will be saved as <strong>drafts</strong> — you can review and publish them individually.
        </p>
      </div>
    </div>
  );
}
