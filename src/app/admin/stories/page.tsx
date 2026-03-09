import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminStoryList from "@/components/admin/AdminStoryList";

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    include: { genres: { include: { genre: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
          <p className="mt-1 text-sm text-gray-500">{stories.length} total</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/stories/bulk-upload"
            className="rounded-sm border border-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-[var(--color-amber)] hover:bg-[var(--color-amber)] hover:text-white transition-colors"
          >
            Bulk Upload
          </Link>
          <Link
            href="/admin/stories/new"
            className="rounded-sm bg-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors"
          >
            + New Story
          </Link>
        </div>
      </div>

      <AdminStoryList stories={stories} />
    </div>
  );
}
