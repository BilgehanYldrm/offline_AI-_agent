"""Optional SQLite search tool; not part of the HTTP retrieval path."""
import sqlite3
from database_prep import DB_NAME


def afet_veritabaninda_ara(anahtar_kelime, db_path=DB_NAME):
    # Read-only mode avoids accidentally creating an empty DB in a different cwd.
    with sqlite3.connect(f'{db_path.as_uri()}?mode=ro', uri=True) as connection:
        rows = connection.execute(
            'SELECT metin_parcasi FROM kaynak_dokumanlar WHERE metin_parcasi LIKE ? LIMIT 2',
            ('%' + anahtar_kelime + '%',),
        ).fetchall()
    if not rows:
        return 'Yerel dokümanlarda bilgi bulunamadı.'
    return '\n\n'.join(f'[Kaynak Parça {i + 1}]: {row[0]}' for i, row in enumerate(rows))


if __name__ == '__main__':
    print(afet_veritabaninda_ara('ilk yardım'))
