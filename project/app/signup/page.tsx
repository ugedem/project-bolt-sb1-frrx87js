"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AtSignIcon, KeyIcon, AlertCircleIcon } from "lucide-react";
import { lusitana } from "../ui/fonts";
import AcmeLogo from "../ui/logo";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error creating user");
      setIsPending(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`${lusitana.className} mb-3 text-2xl`}>
              Create your account
            </h1>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-900">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2"
                />
                <AtSignIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-xs font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2"
                />
                <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="mt-4 w-full">
              {isPending ? "Creating account..." : "Sign up"}
            </Button>

            {error && (
              <div className="flex items-center space-x-1 mt-2">
                <AlertCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
