"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-6">Profile not found.</p>;
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow">
        <img
          src={
            profile.profile_photo_url ||
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2"
          }
          className="w-full h-80 object-cover rounded-xl mb-6"
        />

        <h1 className="text-3xl font-bold text-[#101B3D]">
          {profile.full_name}
        </h1>

        <p className="mt-2 text-slate-600">
          {profile.gender} • {profile.profession}
        </p>

        <p className="mt-2 text-slate-600">
          {profile.city}, {profile.country}
        </p>

        <p className="mt-2 text-slate-600">
          Religion: {profile.religion}
        </p>

        <p className="mt-6 text-slate-700">
          {profile.bio || "No bio provided."}
        </p>

        <button className="mt-8 w-full bg-pink-600 text-white py-3 rounded-xl font-bold">
          ❤️ Like
        </button>
      </div>
    </main>
  );
}
