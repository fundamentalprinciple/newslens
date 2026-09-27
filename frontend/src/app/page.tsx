"use client";

import { FormEvent, useState } from "react";

type Article = {
  title: string;
  publisher: string;
  published_date: string;
  url: string;
  content: string;
  status: string;
};

type Claim = {
  claim: string;
  context: string;
  source_url: string;
  source_title: string;
  status: string;
};

type SearchResponse = {
  query: string;
  search_queries: string[];
  results: Article[];
  claims: Claim[];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [briefing, setBriefing] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setBriefing(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/news/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error("News search failed");
      }

      const data: SearchResponse = await response.json();
      setBriefing(data);
    } catch {
      setError(
        "Unable to reach the NewsLens backend. Make sure the API is running.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">NewsLens</div>
        <button className="text-sm text-zinc-500 transition hover:text-zinc-950">
          About
        </button>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-16 text-center">
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

        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-3xl">
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
              className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
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

        {error && (
          <div className="mt-6 w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
            {error}
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

        {briefing && (
          <section className="mt-16 w-full max-w-6xl text-left">
            <div className="border-b border-zinc-200 pb-8">
              <p className="text-sm font-medium text-zinc-500">
                NewsLens Briefing
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {briefing.query}
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-xl bg-zinc-100 px-4 py-3">
                  <p className="text-2xl font-semibold">
                    {briefing.results.length}
                  </p>
                  <p className="text-xs text-zinc-500">Sources analyzed</p>
                </div>

                <div className="rounded-xl bg-zinc-100 px-4 py-3">
                  <p className="text-2xl font-semibold">
                    {briefing.claims.length}
                  </p>
                  <p className="text-xs text-zinc-500">Claims extracted</p>
                </div>

                <div className="rounded-xl bg-zinc-100 px-4 py-3">
                  <p className="text-2xl font-semibold">
                    {briefing.search_queries.length}
                  </p>
                  <p className="text-xs text-zinc-500">Search angles</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Search coverage
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {briefing.search_queries.map((searchQuery) => (
                  <span
                    key={searchQuery}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600"
                  >
                    {searchQuery}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Sources</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Articles discovered and processed by NewsLens.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {briefing.results.map((article) => (
                    <article
                      key={article.url}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span className="font-medium text-zinc-600">
                          {article.publisher}
                        </span>

                        <span>•</span>

                        <span>
                          {article.published_date || "Date unavailable"}
                        </span>

                        <span>•</span>

                        <span className="rounded-full bg-zinc-100 px-2 py-1">
                          {article.status}
                        </span>
                      </div>

                      <h4 className="mt-3 text-lg font-semibold leading-7">
                        {article.title}
                      </h4>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                        {article.content}
                      </p>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-medium text-zinc-950 underline underline-offset-4"
                      >
                        Read source →
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <aside>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold">Claims</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Factual claims extracted from the reporting.
                  </p>
                </div>

                <div className="space-y-3">
                  {briefing.claims.slice(0, 12).map((claim, index) => (
                    <div
                      key={`${claim.source_url}-${index}`}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <p className="text-sm font-medium leading-6 text-zinc-900">
                        {claim.claim}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        Source: {claim.source_title}
                      </p>
                    </div>
                  ))}

                  {briefing.claims.length > 12 && (
                    <p className="pt-2 text-center text-xs text-zinc-400">
                      Showing 12 of {briefing.claims.length} extracted claims
                    </p>
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
