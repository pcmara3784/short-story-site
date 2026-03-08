"use client";

import { deleteGenre } from "@/lib/actions/genres";

type Props = { id: string; name: string; storyCount: number };

export default function DeleteGenreButton({ id, name, storyCount }: Props) {
  async function handleDelete() {
    const warning =
      storyCount > 0
        ? `"${name}" is used by ${storyCount} ${storyCount === 1 ? "story" : "stories"}. Deleting it will remove the tag from those stories. Continue?`
        : `Delete genre "${name}"?`;

    if (!confirm(warning)) return;
    await deleteGenre(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 transition-colors"
    >
      Delete
    </button>
  );
}
