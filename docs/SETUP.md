# Setup and troubleshooting

## Default local mode

Follow the root README. Use Node 22+ and Python 3.11/3.12. Run all commands from the repository root. `.venv`, `node_modules`, generated test reports and model directories are ignored by Git.

`requirements-dev.txt` installs the API and checks. For API-only use, install `requirements.txt`. Direct dependencies are pinned; Python transitive dependencies are resolved by pip and are not fully locked.

On Windows, if PowerShell blocks activation, call `.venv\Scripts\python.exe -m pip ...` and `.venv\Scripts\python.exe -m uvicorn ...` directly. For browser tests without activation:

```powershell
$env:PYTHON = "$PWD\.venv\Scripts\python.exe"
npm run test:e2e
```

On Linux/macOS:

```bash
PYTHON=.venv/bin/python npm run test:e2e
```

## Production build preview (local only)

The Vite development proxy is not a production backend. Configure the public API URL before building:

```bash
# Linux/macOS
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run build
```

```powershell
# Windows PowerShell
$env:VITE_API_BASE_URL = 'http://127.0.0.1:8000'
npm run build
```

Allow the preview origin in the backend environment, then restart the API:

```bash
CORS_ORIGINS=http://127.0.0.1:4173 python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
npm run preview -- --host 127.0.0.1
```

On PowerShell, use `$env:CORS_ORIGINS = 'http://127.0.0.1:4173'` before the uvicorn command. Backend environment variables are read from the process, **not automatically loaded from `.env` files**. Hosting publicly requires a separately reviewed same-origin reverse proxy, TLS and abuse controls; this change does not deploy anything.

## Optional local semantic model

The default is keyword retrieval. To enable the optional adapter:

1. Install `python -m pip install -r requirements-semantic.txt`.
2. Obtain a Sentence Transformers-compatible Turkish/multilingual model separately. Check its license, disk/RAM requirements and provenance. The previous code used `dbmdz/bert-base-turkish-cased`, which is not by itself an evaluated sentence-retrieval solution for this corpus.
3. Save the model to a local directory. Set `SEMANTIC_MODEL_PATH` to its absolute path, then restart the API.
4. Confirm `/health` reports `"mode": "semantic"`. Test held-out questions before making quality claims.

The application does not download models at startup or silently fall back if an explicitly configured model fails. This revision tests the semantic boundary with controlled scores; it does not certify an actual model or its performance.

## Optional SQLite export

```bash
# Only required for PDF input:
python -m pip install -r requirements-ingest.txt
python database_prep.py
python araclar.py
```

The bundled DB is legacy sample data; the API reads `data/ornek_ilkyardım.txt` directly. Ingestion is repeatable per source and regenerates the sample database. Do not put private documents into version control.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Assistant cannot connect | API running on 127.0.0.1:8000? `/health` succeeds? Dev server on port 3000? |
| 422 response | `soru` must be a nonblank string with at most 1000 characters; no extra fields |
| No matching document | Turkish keyword coverage is limited; inspect topic rules and the source corpus |
| Semantic startup fails | Existing local model path and optional dependencies; do not expect an automatic download |
| Blank map tiles offline | Expected: base tiles are external; sample search remains local |
| Voice unavailable | Browser/permission dependent; typed input remains available |
| Browser tests cannot launch | Run `npx playwright install --with-deps chromium` on supported Linux; install browser binaries on other platforms |
| Port already in use | Stop the old local process; Vite uses strict port 3000 to keep the API origin predictable |

## Screenshots

`npm run test:e2e` captures `docs/screenshots/dashboard.png`, `assistant.png` and `mobile.png` from the live local app. The API runs in keyword mode; no generated or mocked AI answer is used in the assistant screenshot. External HTTPS requests are blocked in these tests. Inspect screenshot diffs before committing newly generated captures.
