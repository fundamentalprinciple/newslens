"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowBriefing(false);

    console.log("News query:", query);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowBriefing(true);
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">NewsLens</div>
        <button className="text-sm text-zinc-500 transition hover:text-zinc-950">
          About
        </button>
      </nav>

      <section className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium text-zinc-500">
          AI-powered news intelligence
        </p>

        <h1 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl">
          Understand the news.
          <br />
          <span className="text-zinc-400">Not just the headlines.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">
          Explore what happened, what is verified, where sources disagree, and
          what context you need to understand the story.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 w-full">
          <div className="flex w-full items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-sm focus-within:border-zinc-400">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to understand?"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-zinc-400"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>

        {showBriefing && (
          <div className="mt-8 w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-left">
            <p className="text-sm font-medium text-zinc-500">
              NewsLens Briefing
            </p>
            <h2 className="mt-2 text-xl font-semibold">{query}</h2>
            <p className="mt-3 text-sm text-zinc-500">
              Your evidence-based briefing will appear here.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Latest AI news", "India economy", "Climate change"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950"
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
