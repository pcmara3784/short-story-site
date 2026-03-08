import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";
import PublishToggle from "@/components/admin/PublishToggle";

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    include: { genres: { include: { genre: true } } },
    orderBy: { createdAt: "desc" },
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

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-sm">
          <p className="text-gray-500">No stories yet.</p>
          <Link
            href="/admin/stories/new"
            className="mt-4 inline-block text-sm text-[var(--color-amber)] hover:underline"
          >
            Add your first story →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex items-start justify-between gap-4 px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">
                    {story.title}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      story.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {story.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 truncate">
                  {story.blurb}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {story.genres.map((sg) => (
                    <span
                      key={sg.genre.id}
                      className="text-[10px] text-[var(--color-amber)] bg-[var(--color-amber-pale)] border border-[var(--color-border)] rounded-full px-2 py-0.5"
                    >
                      {sg.genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <PublishToggle id={story.id} published={story.published} />
                <Link
                  href={`/admin/stories/${story.id}/edit`}
                  className="text-sm text-gray-600 hover:text-[var(--color-amber)] transition-colors"
                >
                  Edit
                </Link>
                <DeleteStoryButton id={story.id} title={story.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
