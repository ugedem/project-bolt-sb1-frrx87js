// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define a type for JWT token
interface TokenType {
  id?: string;
  email?: string;
}

// Define a type for session user
interface UserSession {
  id: string;
  email: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found. Please sign up first.");
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        // Return user object compatible with NextAuth
        return { id: user.id.toString(), email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as TokenType).id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userSession = session.user as UserSession;
        userSession.id = (token as TokenType).id!;
      }
      return session;
    },
  },
};

// Create the NextAuth handler
const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
