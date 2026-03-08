export default function StoriesLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-9 w-48 bg-[var(--color-parchment-dark)] rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-[var(--color-parchment-dark)] rounded animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2 mb-10">
        {[80, 60, 72, 68].map((w, i) => (
          <div
            key={i}
            className="h-7 bg-[var(--color-parchment-dark)] rounded-full animate-pulse"
            style={{ width: w }}
          />
        ))}
      </div>

      <div className="divider mb-10">
        <span className="text-sm text-[var(--color-amber-light)]">✦</span>
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--color-parchment)] border border-[var(--color-border)] rounded-sm p-5 space-y-3"
          >
            <div className="h-4 w-16 bg-[var(--color-parchment-dark)] rounded-full animate-pulse" />
            <div className="h-5 w-3/4 bg-[var(--color-parchment-dark)] rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[var(--color-parchment-dark)] rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-[var(--color-parchment-dark)] rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-[var(--color-parchment-dark)] rounded animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-[var(--color-parchment-dark)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
