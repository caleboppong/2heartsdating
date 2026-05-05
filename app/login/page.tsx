"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setMessage("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-[#101B3D]">Welcome Back</h1>

        <p className="mb-6 mt-2 text-slate-600">
          Login to your account.
        </p>

        <input
          className="mb-4 w-full rounded-xl border px-4 py-3"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="mb-2 w-full rounded-xl border px-4 py-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-4 text-right">
          <Link
            href="/reset-password"
            className="text-sm font-semibold text-pink-600"
          >
            Forgot password?
          </Link>
        </div>

        <button className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white">
          Login
        </button>

        {message && (
          <p className="mt-4 text-sm text-slate-700">{message}</p>
        )}

        <p className="mt-6 text-sm">
          No account yet?{" "}
          <Link href="/signup" className="font-semibold text-pink-600">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
