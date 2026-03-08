import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32 text-center">
      <p className="font-[family-name:var(--font-serif)] text-sm italic tracking-widest text-[var(--color-amber-light)] uppercase mb-4">
        404
      </p>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-[var(--color-ink)] mb-4">
        This page doesn&apos;t exist
      </h1>
      <p className="text-[var(--color-ink-muted)] text-lg mb-10 max-w-sm mx-auto">
        The story you&apos;re looking for may have moved, or perhaps it was never written.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/stories"
          className="inline-block rounded-sm bg-[var(--color-amber)] px-8 py-3 text-sm font-semibold text-white tracking-wide hover:bg-[var(--color-ink)] transition-colors"
        >
          Browse the Library
        </Link>
        <Link
          href="/"
          className="inline-block rounded-sm border border-[var(--color-border)] px-8 py-3 text-sm font-semibold text-[var(--color-ink-muted)] tracking-wide hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
