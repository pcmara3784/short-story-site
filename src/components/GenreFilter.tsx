import Link from "next/link";

type Props = {
  genres: { name: string; slug: string }[];
  active: string | null;
};

export default function GenreFilter({ genres, active }: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Link
        href="/stories"
        className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide border transition-colors ${
          !active
            ? "bg-[var(--color-amber)] text-white border-[var(--color-amber)]"
            : "bg-transparent text-[var(--color-ink-muted)] border-[var(--color-border)] hover:border-[var(--color-amber-light)] hover:text-[var(--color-amber)]"
        }`}
      >
        All
      </Link>

      {genres.map((g) => {
        const isActive = active === g.slug;
        return (
          <Link
            key={g.slug}
            href={`/stories?genre=${g.slug}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide border transition-colors ${
              isActive
                ? "bg-[var(--color-amber)] text-white border-[var(--color-amber)]"
                : "bg-transparent text-[var(--color-ink-muted)] border-[var(--color-border)] hover:border-[var(--color-amber-light)] hover:text-[var(--color-amber)]"
            }`}
          >
            {g.name}
          </Link>
        );
      })}
    </div>
  );
}
