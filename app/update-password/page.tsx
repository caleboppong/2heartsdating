"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully. You can now login.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <form onSubmit={handleUpdate} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[#101B3D]">Create New Password</h1>

        <input
          className="mb-4 mt-6 w-full rounded-xl border px-4 py-3"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white">
          Update Password
        </button>

        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}

        <Link href="/login" className="mt-6 block text-sm font-semibold text-pink-600">
          Back to Login
        </Link>
      </form>
    </main>
  );
}
