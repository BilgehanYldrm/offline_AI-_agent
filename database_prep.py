"""Optional SQLite export. The HTTP retrieval API reads the source text directly."""
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parent
DB_NAME = ROOT / 'afet_bilgi.db'


def metni_parcalara_bol(metin, kelime_siniri=300):
    if kelime_siniri < 1:
        raise ValueError('Chunk size must be positive.')
    words = metin.split()
    return [' '.join(words[i:i + kelime_siniri]) for i in range(0, len(words), kelime_siniri)]


def verileri_isle(data_klasoru=ROOT / 'data', db_path=DB_NAME):
    data_dir = Path(data_klasoru)
    if not data_dir.is_dir():
        raise FileNotFoundError(data_dir)
    documents = []
    for path in sorted(data_dir.iterdir()):
        if path.suffix.lower() == '.txt':
            text = path.read_text(encoding='utf-8')
        elif path.suffix.lower() == '.pdf':
            from pypdf import PdfReader
            text = '\n'.join(page.extract_text() or '' for page in PdfReader(path).pages)
        else:
            continue
        documents.append((path.name, metni_parcalara_bol(text)))
    # Replace each source atomically; running the script twice cannot duplicate it.
    with sqlite3.connect(db_path) as connection:
        connection.execute('CREATE TABLE IF NOT EXISTS kaynak_dokumanlar (id INTEGER PRIMARY KEY, dosya_adi TEXT, metin_parcasi TEXT)')
        for name, chunks in documents:
            connection.execute('DELETE FROM kaynak_dokumanlar WHERE dosya_adi = ?', (name,))
            connection.executemany('INSERT INTO kaynak_dokumanlar (dosya_adi, metin_parcasi) VALUES (?, ?)', [(name, chunk) for chunk in chunks])
    return sum(len(chunks) for _, chunks in documents)


if __name__ == '__main__':
    print(f'Indexed {verileri_isle()} chunks.')
