# NewsLens Architecture

## Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + Python
- Agent: LangGraph
- LLM: OpenAI API
- News Search: Tavily
- Database: PostgreSQL + pgvector
- Communication: REST API

## Flow

User → Next.js → FastAPI → LangGraph Agent
→ Tavily/Search → Source Processing → LLM Analysis
→ Structured News Briefing → Next.js
