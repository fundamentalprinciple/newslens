from typing import TypedDict
from urllib.request import Request, urlopen
import trafilatura


class ExtractedArticle(TypedDict):
    title: str
    publisher: str
    published_date: str
    url: str
    content: str
    status: str


def extract_article(result: dict) -> ExtractedArticle:
    url = result["url"]

    try:
        request = Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (compatible; NewsLens/1.0; "
                    "+https://github.com/fundamentalprinciple/newslens)"
                )
            },
        )

        with urlopen(request, timeout=10) as response:
            html = response.read()

        content = trafilatura.extract(
            html,
            include_comments=False,
            include_tables=False,
            include_links=False,
        )

        if not content or len(content.strip()) < 200:
            return {
                **result,
                "content": "",
                "status": "incomplete",
            }

        return {
            "title": result["title"],
            "publisher": result["publisher"],
            "published_date": result["published_date"],
            "url": url,
            "content": content.strip(),
            "status": "extracted",
        }

    except Exception:
        return {
            "title": result.get("title", ""),
            "publisher": result.get("publisher", ""),
            "published_date": result.get("published_date", ""),
            "url": url,
            "content": "",
            "status": "inaccessible",
        }
