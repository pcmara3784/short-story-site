"use client";

import { useState, useTransition } from "react";
import { reorderGenres, deleteGenre } from "@/lib/actions/genres";

type Genre = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count: { stories: number };
};

type Props = {
  genres: Genre[];
};

export default function GenreList({ genres: initial }: Props) {
  const [genres, setGenres] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const next = [...genres];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setGenres(next);
    startTransition(() => reorderGenres(next.map((g) => g.id)));
  }

  function handleDelete(id: string) {
    startTransition(() => deleteGenre(id));
  }

  if (genres.length === 0) {
    return <p className="text-sm text-gray-400">No genres yet. Add one above.</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
      {genres.map((genre, i) => (
        <div key={genre.id} className="flex items-center gap-2 px-4 py-3">
          {/* Up/down controls */}
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={() => move(i, -1)}
              disabled={i === 0 || isPending}
              aria-label="Move up"
              className="text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed leading-none text-xs"
            >
              ▲
            </button>
            <button
              onClick={() => move(i, 1)}
              disabled={i === genres.length - 1 || isPending}
              aria-label="Move down"
              className="text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed leading-none text-xs"
            >
              ▼
            </button>
          </div>

          {/* Genre info */}
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-900">{genre.name}</span>
            <span className="ml-3 text-xs text-gray-400">
              {genre._count.stories}{" "}
              {genre._count.stories === 1 ? "story" : "stories"}
            </span>
            <span className="ml-3 text-xs text-gray-400 font-mono">
              /{genre.slug}
            </span>
          </div>

          {/* Delete */}
          <button
            onClick={() => {
              if (
                genre._count.stories > 0 &&
                !confirm(
                  `"${genre.name}" is used by ${genre._count.stories} ${genre._count.stories === 1 ? "story" : "stories"}. Delete anyway?`
                )
              )
                return;
              handleDelete(genre.id);
            }}
            disabled={isPending}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
