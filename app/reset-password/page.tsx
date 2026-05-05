"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Sending reset link...");

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/update-password`,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password reset link sent. Please check your email.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <form onSubmit={handleReset} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[#101B3D]">Reset Password</h1>
        <p className="mb-6 mt-2 text-slate-600">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          className="mb-4 w-full rounded-xl border px-4 py-3"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white">
          Send Reset Link
        </button>

        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}

        <p className="mt-6 text-sm">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-pink-600">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
