"use client";

import { useRef, useState } from "react";

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success"; fileName: string; wordCount: number; warnings: string[] }
  | { status: "error"; message: string };

type Props = {
  onExtracted: (html: string) => void;
};

export default function DocxUploader({ onExtracted }: Props) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      setState({ status: "error", message: "Please choose a .docx file." });
      return;
    }

    setState({ status: "uploading" });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-docx", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setState({ status: "error", message: data.error ?? "Upload failed." });
      return;
    }

    onExtracted(data.html);
    setState({
      status: "success",
      fileName: file.name,
      wordCount: data.wordCount,
      warnings: data.warnings ?? [],
    });

    // Reset input so the same file can be re-uploaded if needed
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-sm border border-dashed border-[var(--color-border)] bg-[var(--color-parchment)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">
            Upload from Word (.docx)
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Formatting like italics, bold, and paragraph breaks will be
            preserved. The original file is archived automatically.
          </p>
        </div>

        <label className="flex-shrink-0 cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            disabled={state.status === "uploading"}
            className="sr-only"
          />
          <span
            className={`inline-block rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
              state.status === "uploading"
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-[var(--color-amber)] text-[var(--color-amber)] hover:bg-[var(--color-amber)] hover:text-white cursor-pointer"
            }`}
          >
            {state.status === "uploading" ? "Extracting…" : "Choose .docx file"}
          </span>
        </label>
      </div>

      {/* Status messages */}
      {state.status === "success" && (
        <div className="mt-3 rounded-sm bg-green-50 border border-green-200 px-4 py-2.5 text-sm">
          <p className="font-semibold text-green-700">
            ✓ Extracted from {state.fileName}
          </p>
          <p className="text-green-600 text-xs mt-0.5">
            ~{state.wordCount.toLocaleString()} words — content loaded into the
            editor below. Review it before saving.
          </p>
          {state.warnings.length > 0 && (
            <details className="mt-1.5">
              <summary className="text-xs text-yellow-600 cursor-pointer hover:underline">
                {state.warnings.length} formatting note
                {state.warnings.length !== 1 ? "s" : ""} from Word
              </summary>
              <ul className="mt-1 text-xs text-yellow-600 list-disc list-inside space-y-0.5">
                {state.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-3 rounded-sm bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
          {state.message}
        </div>
      )}
    </div>
  );
}
