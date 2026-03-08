import { prisma } from "@/lib/prisma";
import SingleUploadFlow from "@/components/admin/SingleUploadFlow";
import Link from "next/link";

export default async function NewStoryPage() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Story</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a .docx file — title and genre will be extracted automatically.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Prefer to type manually?{" "}
          <Link href="/admin/stories/new/manual" className="text-[var(--color-amber)] hover:underline">
            Use the full story form →
          </Link>
        </p>
      </div>
      <SingleUploadFlow genres={genres} />
    </div>
  );
}
