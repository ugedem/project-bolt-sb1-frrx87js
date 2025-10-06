// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./nextauth"; // <-- Correct path to nextauth.ts

/**
 * Get the current session on the server
 */
export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Check if the user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
