import sqlite3
import pytest
from database_prep import metni_parcalara_bol, verileri_isle
from araclar import afet_veritabaninda_ara


def test_ingestion_is_idempotent_and_search_is_parameterized(tmp_path):
    source = tmp_path / 'data'
    source.mkdir()
    (source / 'sample.txt').write_text('deprem information', encoding='utf-8')
    db = tmp_path / 'test.db'
    assert verileri_isle(source, db) == 1
    assert verileri_isle(source, db) == 1
    with sqlite3.connect(db) as connection:
        assert connection.execute('SELECT COUNT(*) FROM kaynak_dokumanlar').fetchone()[0] == 1
    assert 'deprem information' in afet_veritabaninda_ara('deprem', db)
    assert 'deprem information' not in afet_veritabaninda_ara("' OR 1=1 --", db)


def test_chunk_size_validation():
    assert metni_parcalara_bol('one two three', 2) == ['one two', 'three']
    with pytest.raises(ValueError):
        metni_parcalara_bol('text', 0)
