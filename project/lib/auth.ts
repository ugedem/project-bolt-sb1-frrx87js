import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get current session
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Ensure user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
