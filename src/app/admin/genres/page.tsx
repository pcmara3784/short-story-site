import { prisma } from "@/lib/prisma";
import { createGenre } from "@/lib/actions/genres";
import GenreList from "@/components/admin/GenreList";

export default async function AdminGenresPage() {
  const genres = await prisma.genre.findMany({
    include: { _count: { select: { stories: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add or remove genre tags. Use the arrows to set display order.
        </p>
      </div>

      {/* Add genre form */}
      <form action={createGenre} className="flex gap-3 mb-8">
        <input
          type="text"
          name="name"
          required
          className="admin-input flex-1"
          placeholder="e.g. Science Fiction"
        />
        <button
          type="submit"
          className="rounded-sm bg-[var(--color-amber)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors whitespace-nowrap"
        >
          Add Genre
        </button>
      </form>

      <GenreList genres={genres} />
    </div>
  );
}
