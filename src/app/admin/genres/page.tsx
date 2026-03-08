import { prisma } from "@/lib/prisma";
import { createGenre, deleteGenre } from "@/lib/actions/genres";
import DeleteGenreButton from "@/components/admin/DeleteGenreButton";

export default async function AdminGenresPage() {
  const genres = await prisma.genre.findMany({
    include: { _count: { select: { stories: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add or remove genre tags. Changes appear immediately on the site.
        </p>
      </div>

      {/* Add genre form */}
      <form
        action={createGenre}
        className="flex gap-3 mb-8"
      >
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

      {/* Genre list */}
      {genres.length === 0 ? (
        <p className="text-sm text-gray-400">No genres yet. Add one above.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <span className="font-medium text-gray-900">{genre.name}</span>
                <span className="ml-3 text-xs text-gray-400">
                  {genre._count.stories}{" "}
                  {genre._count.stories === 1 ? "story" : "stories"}
                </span>
                <span className="ml-3 text-xs text-gray-400 font-mono">
                  /{genre.slug}
                </span>
              </div>
              <DeleteGenreButton
                id={genre.id}
                name={genre.name}
                storyCount={genre._count.stories}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
