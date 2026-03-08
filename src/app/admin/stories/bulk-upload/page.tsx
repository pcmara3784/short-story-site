import { prisma } from "@/lib/prisma";
import BulkUploadClient from "@/components/admin/BulkUploadClient";

export default async function BulkUploadPage() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Story Upload</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a single Word document containing multiple stories. The system will detect each story, then show you a preview to confirm before importing.
        </p>
      </div>

      <div className="mb-8 bg-[var(--color-parchment)] border border-[var(--color-border)] rounded-sm px-5 py-4 max-w-2xl">
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">Document formatting guide</p>
        <ul className="text-sm text-[var(--color-ink-muted)] space-y-1.5 list-disc list-inside">
          <li>Start each story with a <strong>Heading 1</strong> style for the title (Home → Styles → Heading 1)</li>
          <li>On the first line after the title, write <code className="bg-[var(--color-parchment-dark)] px-1 rounded text-xs">Genre: Fantasy</code> (optional)</li>
          <li>The story body follows immediately — no extra separators needed</li>
          <li>Use <strong>bold</strong> and <em>italic</em> formatting freely — they&apos;ll be preserved</li>
        </ul>
      </div>

      <BulkUploadClient genres={genres} />
    </div>
  );
}
