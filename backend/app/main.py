from fastapi import FastAPI

app = FastAPI(title="NewsLens API")


@app.get("/health")
def health_check():
    return {"status": "ok"}
