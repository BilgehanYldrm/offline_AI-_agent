
import pytest

from backend.retrieval import DEFAULT_DOCUMENT, LocalSentenceSearch, RetrievalService, load_blocks, normalize


@pytest.fixture
def service():
    return RetrievalService(load_blocks(DEFAULT_DOCUMENT))


@pytest.mark.parametrize(('question', 'title'), [
    ('Deprem oluyor', 'DEPREM ANINDA'),
    ('deprem sonrası tahliye', 'DEPREM SONRASI'),
    ('elim kanıyor', 'HAFİF-ORTA'),
    ('kolum koptu', 'UZUV KOPMASI'),
    ('öksürerek kan geliyor', 'KUSARAK VEYA'),
    ('BURUN KANAMASI', 'BURUN KANAMASI'),
    ('İç kanama', 'İÇ KANAMA'),
    ('deprem çantası', 'DEPREM ÇANTASINDA'),
    ('kolumda çıkık', 'KIRIK VE ÇIKIK'),
    ('telefon iletişimi kesildi', 'HABERLEŞMENİN'),
    ('elektrik çarpması', 'ELEKTRİK ÇARPMASI'),
    ('sel tehlikesi', 'SU BASKINI'),
])
def test_specific_topic_routes(service, question, title):
    result = service.search(question)
    assert result.method == 'keyword'
    assert result.source.startswith(title)
    block = next(block for block in service.blocks if block.title == result.source)
    assert result.answer.endswith(block.body)


@pytest.mark.parametrize('question', ['', '   ', 'selam', 'futbol skoru', 'xyz123'])
def test_unknown_question_abstains(service, question):
    result = service.search(question)
    assert result.method == 'no_match'
    assert result.source is None
    assert service.blocks[0].body not in result.answer


def test_turkish_case_normalization():
    assert normalize('İÇ KANAMA') == normalize('iç kanama')


def test_empty_document_is_rejected(tmp_path):
    path = tmp_path / 'empty.txt'
    path.write_text('not a structured document')
    with pytest.raises(ValueError):
        load_blocks(path)


@pytest.mark.parametrize(('score', 'method'), [(0.2, 'no_match'), (0.8, 'semantic'), (float('nan'), 'no_match')])
def test_semantic_threshold(service, score, method):
    class FakeSemantic:
        def best_match(self, question):
            return 1, score
    service.semantic = FakeSemantic()
    assert service.search('unmatched query').method == method


def test_missing_model_fails_without_downloading(tmp_path):
    with pytest.raises(ValueError):
        LocalSentenceSearch(str(tmp_path / 'missing'), load_blocks(DEFAULT_DOCUMENT))


def test_all_routing_targets_exist(service):
    titles = {normalize(block.title) for block in service.blocks}
    assert all(normalize(rule['title']) in titles for rule in service.rules)
