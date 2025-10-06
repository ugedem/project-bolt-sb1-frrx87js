"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AtSignIcon, KeyIcon, AlertCircleIcon } from "lucide-react";
import { lusitana } from "../ui/fonts";
import AcmeLogo from "../ui/logo";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="relative mx-auto w-full max-w-[400px] space-y-4 p-4">
        {/* Header */}
        <div className="flex h-20 w-full items-end justify-center rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="rounded-lg bg-white px-6 pb-6 pt-8 shadow-md">
          <h1 className={`${lusitana.className} mb-4 text-2xl text-center text-gray-900`}>
            Log in to your account
          </h1>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-xs font-medium text-gray-900">
              Email
            </label>
            <div className="relative mt-1">
              <AtSignIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="peer block w-full rounded-md border border-gray-300 py-[9px] pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-medium text-gray-900">
              Password
            </label>
            <div className="relative mt-1">
              <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="peer block w-full rounded-md border border-gray-300 py-[9px] pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Log in"}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center space-x-1 text-red-600">
              <AlertCircleIcon className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Signup Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
