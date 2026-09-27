# NewsLens Backend

## Development

Activate the virtual environment:

\`\`\`bash
source .venv/bin/activate
\`\`\`

Run the API:

\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

Health check:

\`\`\`bash
curl http://127.0.0.1:8000/health
\`\`\`
