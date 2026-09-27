import os
import re
from typing import TypedDict
from dotenv import load_dotenv
from tavily import TavilyClient
from urllib.parse import urlparse
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph
from app.agent.extractor import ExtractedArticle, extract_article
from app.agent.claims import Claim, extract_claims

load_dotenv()

llm = ChatOpenAI(
    model="openai/gpt-4.1-nano",
    api_key=os.environ["AIPipe"],
    base_url="https://aipipe.org/openrouter/v1",
)

class SearchResult(TypedDict):
    title: str
    publisher: str
    published_date: str
    url: str
    snippet: str

class NewsSearchState(TypedDict):
	query: str
	search_queries: list[str]
	results: list[SearchResult]
	claims: list[Claim]

def search_news(state: NewsSearchState) -> NewsSearchState:
    client = TavilyClient(os.environ["TAVILY_API_KEY"])
    results = []

    for query in state["search_queries"]:
        response = client.search(
            query,
            topic="news",
            max_results=5,
        )

        results.extend(
            {
                "title": result["title"],
                "publisher": urlparse(result["url"]).netloc.removeprefix("www."),
                "published_date": result.get("published_date", ""),
                "url": result["url"],
                "snippet": result.get("content", ""),
            }
            for result in response["results"]
        )

    return {
        **state,
        "results": deduplicate_results(results),
    }

def deduplicate_results(results: list[SearchResult]) -> list[SearchResult]:
    seen_urls = set()
    unique_results = []

    for result in results:
        if result["url"] not in seen_urls:
            seen_urls.add(result["url"])
            unique_results.append(result)

    return unique_results

from datetime import date

def generate_search_queries(state: NewsSearchState) -> NewsSearchState:
    prompt = f"""
Generate 3 concise web search queries for this news topic.

Current date: {date.today().isoformat()}

User topic:
{state["query"]}

Rules:
- For "latest", "recent", "today", "this week", or similar requests, prioritize current news.
- Do not use an outdated year unless the user explicitly asks about that year.
- Include the current year when it improves search relevance.
- Keep each query concise and useful for finding recent reporting.
- Return only the 3 queries, one per line.
"""

    response = llm.invoke(prompt)

    queries = [
        re.sub(r"^\d+\.\s*", "", line.strip())
        for line in response.content.splitlines()
        if line.strip()
    ][:3]

    return {
        **state,
        "search_queries": queries,
    }

def extract_articles(state: NewsSearchState) -> NewsSearchState:
    extracted_results = [
        extract_article(result)
        for result in state["results"]
    ]

    return {
        **state,
        "results": extracted_results,
    }

def extract_article_claims(state: NewsSearchState) -> NewsSearchState:
    claims = []

    for article in state["results"]:
        if article["status"] == "extracted":
            claims.extend(extract_claims(article))

    return {
        **state,
        "claims": claims,
    }

builder = StateGraph(NewsSearchState)

builder.add_node("generate_queries", generate_search_queries)
builder.add_node("search_news", search_news)
builder.add_node("extract_articles", extract_articles)
builder.add_node("extract_claims", extract_article_claims)

builder.add_edge(START, "generate_queries")
builder.add_edge("generate_queries", "search_news")
builder.add_edge("search_news", "extract_articles")
builder.add_edge("extract_articles","extract_claims")

builder.add_edge("extract_claims",END)

news_search_graph = builder.compile()
