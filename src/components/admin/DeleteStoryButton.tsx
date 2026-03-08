"use client";

import { deleteStory } from "@/lib/actions/stories";

type Props = { id: string; title: string };

export default function DeleteStoryButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteStory(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-400 hover:text-red-600 transition-colors"
    >
      Delete
    </button>
  );
}
