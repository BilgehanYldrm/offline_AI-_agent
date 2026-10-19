"""Compatibility entrypoint: uvicorn ai_search:app --host 127.0.0.1."""
from backend.app import app  # noqa: F401
