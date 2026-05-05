"use client";

import { useState } from "react";

const plans = [
  {
    title: "Basic Plan",
    price: "£9",
    description: "Good for getting started.",
    key: "basic",
    features: ["Create profile", "Basic search", "Limited likes"],
  },
  {
    title: "Gold Plan",
    price: "£19",
    description: "Best for serious members.",
    key: "gold",
    featured: true,
    features: ["Unlimited search", "Messaging", "See who liked you"],
  },
  {
    title: "Platinum Plan",
    price: "£29",
    description: "Maximum visibility.",
    key: "platinum",
    features: ["Priority listing", "Advanced filters", "Verified badge request"],
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function subscribe(plan: "basic" | "gold" | "platinum") {
    setLoadingPlan(plan);
    setErrorMessage("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Stripe checkout failed");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoadingPlan("");
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-extrabold text-[#101B3D]">
          Choose Your Plan
        </h1>

        <p className="mt-3 text-slate-600">
          Upgrade your 2heartsdating experience.
        </p>

        {errorMessage && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-red-100 p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-2xl border p-8 shadow ${
                plan.featured
                  ? "bg-pink-600 text-white"
                  : "bg-white text-[#101B3D]"
              }`}
            >
              {plan.featured && (
                <p className="mb-3 font-bold">Most Popular</p>
              )}

              <h2 className="text-3xl font-bold">{plan.title}</h2>

              <p className="mt-3">{plan.description}</p>

              <p className="mt-5 text-5xl font-extrabold">
                {plan.price}
                <span className="text-base">/month</span>
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() =>
                  subscribe(plan.key as "basic" | "gold" | "platinum")
                }
                disabled={loadingPlan === plan.key}
                className={`mt-8 w-full rounded-xl px-8 py-3 font-bold ${
                  plan.featured
                    ? "bg-white text-pink-600"
                    : "bg-pink-600 text-white"
                }`}
              >
                {loadingPlan === plan.key
                  ? "Redirecting..."
                  : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
