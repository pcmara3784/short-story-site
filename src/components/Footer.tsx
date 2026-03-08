"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Admin has its own layout
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-parchment-dark)] mt-20">
      <div className="mx-auto max-w-4xl px-6 py-8 text-center">
        <p className="font-[family-name:var(--font-serif)] italic text-[var(--color-ink-muted)] text-sm">
          &ldquo;There is no greater agony than bearing an untold story inside you.&rdquo;
        </p>
        <p className="mt-2 text-xs text-[var(--color-amber-light)]">— Maya Angelou</p>
        <p className="mt-6 text-xs text-[var(--color-ink-muted)]">
          © {new Date().getFullYear()} John Mara. All stories are original works.
        </p>
      </div>
    </footer>
  );
}
