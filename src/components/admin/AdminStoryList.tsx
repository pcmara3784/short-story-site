"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";
import PublishToggle from "@/components/admin/PublishToggle";

type Genre = { id: string; name: string };
type Story = {
  id: string;
  title: string;
  blurb: string;
  published: boolean;
  genres: { genre: Genre }[];
};

type Props = {
  stories: Story[];
};

export default function AdminStoryList({ stories }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.blurb.toLowerCase().includes(query.toLowerCase()) ||
          s.genres.some((sg) =>
            sg.genre.name.toLowerCase().includes(query.toLowerCase())
          )
      )
    : stories;

  return (
    <div>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, blurb, or genre…"
          className="admin-input max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-sm">
          <p className="text-gray-500 text-sm">
            {query ? `No stories match "${query}"` : "No stories yet."}
          </p>
          {!query && (
            <Link
              href="/admin/stories/new"
              className="mt-3 inline-block text-sm text-[var(--color-amber)] hover:underline"
            >
              Add your first story →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
          {filtered.map((story) => (
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

      {query && filtered.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          Showing {filtered.length} of {stories.length} stories
        </p>
      )}
    </div>
  );
}
