import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalStories, publishedStories, draftStories, totalGenres] =
    await Promise.all([
      prisma.story.count(),
      prisma.story.count({ where: { published: true } }),
      prisma.story.count({ where: { published: false } }),
      prisma.genre.count(),
    ]);

  const stats = [
    { label: "Published", value: publishedStories },
    { label: "Drafts", value: draftStories },
    { label: "Total Stories", value: totalStories },
    { label: "Genres", value: totalGenres },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here&apos;s what&apos;s in your library.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-sm px-5 py-4"
          >
            <p className="text-3xl font-bold text-[var(--color-ink)]">{value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-widest">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
        <Link
          href="/admin/stories/new"
          className="flex flex-col gap-1 bg-[var(--color-amber)] text-white rounded-sm px-5 py-4 hover:bg-[var(--color-ink)] transition-colors"
        >
          <span className="font-semibold">+ New Story</span>
          <span className="text-xs opacity-80">Add a story to your library</span>
        </Link>
        <Link
          href="/admin/genres"
          className="flex flex-col gap-1 bg-white border border-gray-200 text-gray-700 rounded-sm px-5 py-4 hover:border-[var(--color-amber)] transition-colors"
        >
          <span className="font-semibold">Manage Genres</span>
          <span className="text-xs text-gray-500">Add or remove genre tags</span>
        </Link>
      </div>
    </div>
  );
}
