import json
import os
from typing import TypedDict

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

class Claim(TypedDict):
    claim: str
    context: str
    source_url: str
    source_title: str
    status: str


llm = ChatOpenAI(
    model="openai/gpt-4.1-nano",
    api_key=os.environ["AIPipe"],
    base_url="https://aipipe.org/openrouter/v1",
)


def extract_claims(article: dict) -> list[Claim]:
    prompt = f"""
Read the following news article and extract its significant factual claims.

Only extract claims that could later be independently verified.
Do not extract opinions, predictions, speculation, or vague statements.

Return ONLY valid JSON in this format:
[
  {{
    "claim": "specific factual claim",
    "context": "brief context needed to understand the claim"
  }}
]

Article title:
{article["title"]}

Article content:
{article["content"][:8000]}
"""

    response = llm.invoke(prompt)

    try:
        claims = json.loads(response.content)
    except json.JSONDecodeError:
        return []

    if not isinstance(claims, list):
        return []

    extracted_claims = []

    for item in claims:
        if not isinstance(item, dict):
            continue

        claim = item.get("claim")
        context = item.get("context")

        if not claim or not context:
            continue

        extracted_claims.append(
            {
                "claim": claim,
                "context": context,
                "source_url": article["url"],
                "source_title": article["title"],
                "status": "requires_investigation",
            }
        )

    return extracted_claims
