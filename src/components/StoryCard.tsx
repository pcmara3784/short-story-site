import Link from "next/link";

type Props = {
  title: string;
  slug: string;
  blurb: string;
  genres: { name: string; slug: string }[];
};

export default function StoryCard({ title, slug, blurb, genres }: Props) {
  return (
    <article className="group flex flex-col bg-[var(--color-parchment)] border border-[var(--color-border)] rounded-sm hover:border-[var(--color-amber-light)] hover:shadow-md transition-all duration-200">
      {/* Genre tags */}
      <div className="flex flex-wrap gap-1.5 px-5 pt-5">
        {genres.map((g) => (
          <span
            key={g.slug}
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-amber)] bg-[var(--color-amber-pale)] border border-[var(--color-border)] rounded-full px-2.5 py-0.5"
          >
            {g.name}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5">
        <h2 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-[var(--color-ink)] leading-snug mb-2 group-hover:text-[var(--color-amber)] transition-colors">
          {title}
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed flex-1">
          {blurb}
        </p>
        <Link
          href={`/stories/${slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-amber)] hover:text-[var(--color-ink)] transition-colors"
        >
          Read story
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}
