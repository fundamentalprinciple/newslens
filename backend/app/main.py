from fastapi import FastAPI
from pydantic import BaseModel

from app.agent.graph import news_search_graph

app = FastAPI(title="NewsLens API")


class NewsQuery(BaseModel):
    query: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/news/search")
def search_news(query: NewsQuery):
    result = news_search_graph.invoke(
        {
            "query": query.query,
            "search_queries": [],
            "results": [],
        }
    )

    return {
        "query": result["query"],
        "search_queries": result["search_queries"],
        "results": result["results"],
    }
