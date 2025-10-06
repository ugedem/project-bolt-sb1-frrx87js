"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Simple client-side guard: checks localStorage "user" key.
 * If missing, redirects to /login.
 *
 * Usage: add <AuthGuard /> at the top of /app/dashboard/layout.tsx
 */

export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        router.push("/login");
      }
      // If you want a quick mock login for testing:
      // localStorage.setItem("user", JSON.stringify({ name: "Test User" }));
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  return null;
}
