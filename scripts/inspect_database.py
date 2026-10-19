"""Inspect the optional generated SQLite corpus without exposing full passages."""
import sqlite3
from pathlib import Path


def main():
    path = Path(__file__).resolve().parents[1] / 'afet_bilgi.db'
    with sqlite3.connect(f'{path.as_uri()}?mode=ro', uri=True) as connection:
        for row in connection.execute('SELECT id, dosya_adi, length(metin_parcasi) FROM kaynak_dokumanlar LIMIT 3'):
            print(row)


if __name__ == '__main__':
    main()
