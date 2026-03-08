"use client";

import { signOut } from "next-auth/react";

export default function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-xs text-white/50 hover:text-white/80 transition-colors"
    >
      Sign out
    </button>
  );
}
