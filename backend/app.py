"""FastAPI boundary: validation, lifecycle, CORS and backward-compatible routes."""
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from backend.retrieval import DEFAULT_DOCUMENT, LocalSentenceSearch, RetrievalService, load_blocks


class Question(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    soru: str = Field(min_length=1, max_length=1000)


class Answer(BaseModel):
    cevap: str
    response: str
    message: str
    method: str
    source: str | None
    score: float | None


def create_app(service: RetrievalService | None = None) -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if service is not None:
            app.state.retrieval = service
        else:
            blocks = load_blocks(DEFAULT_DOCUMENT)
            model_path = os.getenv('SEMANTIC_MODEL_PATH')
            semantic = LocalSentenceSearch(model_path, blocks) if model_path else None
            app.state.retrieval = RetrievalService(blocks, semantic)
        yield

    app = FastAPI(title='Afette El Ele — Local Retrieval API', version='0.1.0', lifespan=lifespan)
    origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000')
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in origins.split(',') if origin.strip()],
        allow_credentials=False,
        allow_methods=['POST', 'GET'],
        allow_headers=['Content-Type'],
    )

    @app.get('/health')
    def health(request: Request):
        engine = request.app.state.retrieval
        return {'status': 'ok', 'mode': 'semantic' if engine.semantic else 'keyword', 'documents': len(engine.blocks)}

    @app.post('/soru-sor', response_model=Answer)
    @app.post('/ask', response_model=Answer, include_in_schema=False)
    @app.post('/chat', response_model=Answer, include_in_schema=False)
    @app.post('/api/chat', response_model=Answer, include_in_schema=False)
    def ask(question: Question, request: Request):
        result = request.app.state.retrieval.search(question.soru)
        return Answer(cevap=result.answer, response=result.answer, message=result.answer,
                      method=result.method, source=result.source, score=result.score)

    return app


app = create_app()
