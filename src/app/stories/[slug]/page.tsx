import { prisma } from "@/lib/prisma";
import type { Genre, StoryGenre } from "@/generated/prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.story.findUnique({ where: { slug } });
  if (!story) return {};
  return {
    title: story.title,
    description: story.blurb,
    openGraph: {
      title: story.title,
      description: story.blurb,
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug, published: true },
    include: { genres: { include: { genre: true } } },
  });

  if (!story) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/stories"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-amber)] transition-colors mb-10"
      >
        ← Back to Library
      </Link>

      {/* Genre tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {story.genres.map((sg: StoryGenre & { genre: Genre }) => (
          <Link
            key={sg.genre.slug}
            href={`/stories?genre=${sg.genre.slug}`}
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-amber)] bg-[var(--color-amber-pale)] border border-[var(--color-border)] rounded-full px-2.5 py-0.5 hover:bg-[var(--color-amber)] hover:text-white transition-colors"
          >
            {sg.genre.name}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-[var(--color-ink)] leading-tight mb-6 sm:text-5xl">
        {story.title}
      </h1>

      {/* Blurb */}
      <p className="font-[family-name:var(--font-serif)] italic text-lg text-[var(--color-ink-muted)] leading-relaxed border-l-2 border-[var(--color-border)] pl-4 mb-10">
        {story.blurb}
      </p>

      {/* Divider */}
      <div className="divider mb-10">
        <span className="text-sm text-[var(--color-amber-light)]">✦</span>
      </div>

      {/* Story content */}
      <div
        className="story-content"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />

      {/* Author notes */}
      {story.authorNotes && (
        <>
          <div className="divider my-12">
            <span className="text-sm text-[var(--color-amber-light)]">✦</span>
          </div>
          <aside className="bg-[var(--color-parchment-dark)] border border-[var(--color-border)] rounded-sm px-6 py-5">
            <h2 className="font-[family-name:var(--font-serif)] text-sm font-semibold uppercase tracking-widest text-[var(--color-amber)] mb-3">
              Author&rsquo;s Note
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed italic">
              {story.authorNotes}
            </p>
          </aside>
        </>
      )}

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-amber)] hover:text-[var(--color-ink)] transition-colors"
        >
          ← Explore more stories
        </Link>
      </div>
    </article>
  );
}
