"""Deterministic document retrieval with optional, explicitly configured embeddings."""
from dataclasses import dataclass
import json
from pathlib import Path
import re
from typing import Protocol
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DOCUMENT = ROOT / 'data' / 'ornek_ilkyardım.txt'
NO_MATCH = 'Yerel dokümanlarda bu soruyla ilgili bir eşleşme bulunamadı. Lütfen sorunuzu daha açık yazın.'


def normalize(text: str) -> str:
    text = text.translate(str.maketrans('Iİı', 'iii')).lower()
    return ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c))


@dataclass(frozen=True)
class DocumentBlock:
    title: str
    body: str


@dataclass(frozen=True)
class SearchResult:
    answer: str
    method: str
    source: str | None = None
    score: float | None = None


class SemanticSearch(Protocol):
    def best_match(self, question: str) -> tuple[int, float]: ...


def load_blocks(path: Path) -> tuple[DocumentBlock, ...]:
    text = path.read_text(encoding='utf-8')
    matches = re.findall(r'^===\s*([^=\n]+?)\s*===\s*\n(.*?)(?=^===|\Z)', text, re.MULTILINE | re.DOTALL)
    blocks = tuple(DocumentBlock(title.strip(), body.strip()) for title, body in matches if body.strip())
    if not blocks:
        raise ValueError('Knowledge document must contain non-empty === TITLE === blocks.')
    return blocks


class RetrievalService:
    def __init__(self, blocks: tuple[DocumentBlock, ...], semantic: SemanticSearch | None = None, threshold: float = 0.65):
        if not blocks:
            raise ValueError('At least one document block is required.')
        self.blocks = blocks
        self.semantic = semantic
        self.threshold = threshold
        self.rules = json.loads((Path(__file__).parent / 'topics.json').read_text(encoding='utf-8'))

    def search(self, question: str) -> SearchResult:
        query = normalize(question.strip())
        if not query:
            return SearchResult(NO_MATCH, 'no_match')
        for rule in self.rules:
            # Match word starts rather than arbitrary substrings ("selam" is not "sel").
            for term in rule['terms']:
                term = normalize(term)
                suffix = r'\b' if term in {'sel', 'kan', 'sok', 'kes', 'kop'} else r'\w*'
                if re.search(r'\b' + re.escape(term) + suffix, query):
                    for block in self.blocks:
                        if normalize(rule['title']) == normalize(block.title):
                            return self._result(block, 'keyword')
        if self.semantic:
            index, score = self.semantic.best_match(question)
            if 0 <= index < len(self.blocks) and self.threshold <= score <= 1.0:
                return self._result(self.blocks[index], 'semantic', score)
        return SearchResult(NO_MATCH, 'no_match')

    @staticmethod
    def _result(block: DocumentBlock, method: str, score: float | None = None) -> SearchResult:
        return SearchResult(f'=== {block.title} ===\n\n{block.body}', method, block.title, score)


class LocalSentenceSearch:
    """Loads only a local model directory; no request-time downloads or generation."""
    def __init__(self, model_path: str, blocks: tuple[DocumentBlock, ...]):
        path = Path(model_path).expanduser().resolve()
        if not path.is_dir():
            raise ValueError('SEMANTIC_MODEL_PATH must point to an existing local model directory.')
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(str(path), local_files_only=True)
        self.embeddings = self.model.encode([b.title for b in blocks], normalize_embeddings=True)

    def best_match(self, question: str) -> tuple[int, float]:
        vector = self.model.encode(question, normalize_embeddings=True)
        scores = self.embeddings @ vector
        index = int(scores.argmax())
        return index, float(scores[index])
