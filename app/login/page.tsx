"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("john@tentwenty.com");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <h1 className="mb-8 text-2xl font-bold text-gray-900">Welcome back</h1>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="mb-6 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand/40"
            />
            Remember me
          </label>

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>
      </section>

      <section className="flex flex-1 items-center bg-brand px-10 py-16 text-white md:px-16">
        <div className="max-w-md">
          <h2 className="mb-5 text-3xl font-bold">ticktock</h2>
          <p className="text-base leading-relaxed text-white/85">
            Introducing ticktock, our cutting-edge timesheet web application designed
            to revolutionize how you manage employee work hours. With ticktock, you can
            effortlessly track and monitor employee attendance and productivity from
            anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </section>
    </main>
  );
}
