"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/stories", label: "Stories" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Admin has its own nav
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-parchment)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide text-[var(--color-ink)] hover:text-[var(--color-amber)] transition-colors"
        >
          John Mara
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:block">
          <ul className="flex gap-7">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      active
                        ? "text-[var(--color-amber)] border-b border-[var(--color-amber)] pb-0.5"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-parchment)]">
          <ul className="px-6 py-3 space-y-1">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-[var(--color-amber)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
