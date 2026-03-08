"use client";

import { togglePublished } from "@/lib/actions/stories";
import { useTransition } from "react";

type Props = { id: string; published: boolean };

export default function PublishToggle({ id, published }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => togglePublished(id, published))}
      disabled={isPending}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50 ${
        published
          ? "border-green-300 text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          : "border-yellow-300 text-yellow-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
      }`}
      title={published ? "Click to unpublish" : "Click to publish"}
    >
      {isPending ? "…" : published ? "Unpublish" : "Publish"}
    </button>
  );
}
