"""Compatibility entrypoint: uvicorn ajan_sistemi:app --host 127.0.0.1."""
from backend.app import app  # noqa: F401
