"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-parchment)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[var(--color-ink)]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Sign in to manage your stories
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-parchment-dark)] border border-[var(--color-border)] rounded-sm p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-muted)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-amber)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-muted)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-parchment)] px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-amber)]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[var(--color-amber)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink)] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
