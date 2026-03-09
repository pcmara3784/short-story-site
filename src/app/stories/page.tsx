import { prisma } from "@/lib/prisma";
import type { Genre, StoryGenre } from "@/generated/prisma/client";
import StoryCard from "@/components/StoryCard";
import GenreFilter from "@/components/GenreFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story Library",
  description: "Browse all short stories — filter by genre to find your next read.",
};

type Props = {
  searchParams: Promise<{ genre?: string }>;
};

export default async function StoriesPage({ searchParams }: Props) {
  const { genre } = await searchParams;

  const [stories, genres] = await Promise.all([
    prisma.story.findMany({
      where: {
        published: true,
        ...(genre
          ? { genres: { some: { genre: { slug: genre } } } }
          : {}),
      },
      include: {
        genres: { include: { genre: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.genre.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-[var(--color-ink)] mb-2">
          Story Library
        </h1>
        <p className="text-[var(--color-ink-muted)]">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
          {genre ? ` in ${genres.find((g: Genre) => g.slug === genre)?.name ?? genre}` : " and counting"}
        </p>
      </div>

      {/* Genre filter */}
      <div className="mb-10">
        <GenreFilter genres={genres} active={genre ?? null} />
      </div>

      {/* Divider */}
      <div className="divider mb-10">
        <span className="text-sm text-[var(--color-amber-light)]">✦</span>
      </div>

      {/* Story grid */}
      {stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-[family-name:var(--font-serif)] text-2xl text-[var(--color-ink-muted)] italic">
            No stories here yet.
          </p>
          <p className="mt-2 text-sm text-[var(--color-amber-light)]">Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              title={story.title}
              slug={story.slug}
              blurb={story.blurb}
              genres={story.genres.map((sg: StoryGenre & { genre: Genre }) => ({
                name: sg.genre.name,
                slug: sg.genre.slug,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
