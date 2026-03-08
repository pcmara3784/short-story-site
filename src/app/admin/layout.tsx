import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSignOut from "@/components/admin/AdminSignOut";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Login page renders without the admin chrome
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <header className="bg-[var(--color-ink)] text-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold tracking-wide opacity-80">
              Admin
            </span>
            <nav className="flex gap-5">
              <Link
                href="/admin"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/stories"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Stories
              </Link>
              <Link
                href="/admin/genres"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Genres
              </Link>
              <Link
                href="/admin/bio"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Author Bio
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              View site ↗
            </Link>
            <AdminSignOut />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
