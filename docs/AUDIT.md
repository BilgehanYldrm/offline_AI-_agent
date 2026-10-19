# Engineering audit

Baseline: `fabfa3ea57ab98d74f16c195a4711b711588d739` (repository default branch at inspection).

## Scope

Inspected tracked source/configuration, root and nested Python implementations, the frontend's network and interaction paths, the archive inventory, sample SQLite contents and bundled assets. Compared the nested snapshot to root files. Assets were inventoried; this is not a medical-content or asset-license certification. Working-tree secret patterns were checked without printing candidate values; historical secret absence is not guaranteed.

## Baseline findings and changes

| Finding | Impact | Resolution / remaining boundary |
| --- | --- | --- |
| Nested project snapshot compiled with root | `npm run lint` failed on undefined `resetSim` in old copy | Removed inactive copy; explicitly scoped TypeScript inputs; historical content remains in Git |
| `test_model.py` contained merge markers | Invalid Python syntax | Preserved as `examples/foundry_catalog.py`, conflict resolved |
| Two divergent API implementations | Different behavior and unclear startup | One app factory and retrieval service; compatibility entrypoints retained |
| Unconditional model loading | Startup required heavy dependencies and possible download even for keyword queries | Default keyword mode; explicit optional local model directory |
| Arbitrary document folder search and Windows-specific path | Environment-dependent source selection | Explicit repository-relative corpus |
| Unknown query returned first passage | Irrelevant response presented as an answer | Explicit no-match result |
| `GELMELERİ` rule vs `GELMESİ` document | Intended topic was never found | Target fixed; all targets validated by test |
| Generic substring routing | False matches; specific topics shadowed | Turkish normalization, ordered rules and bounded matching; still heuristic |
| `border` instead of `city` in Bursa sample | City search could crash | Data moved to its own module; city field corrected; browser regression added |
| API key substitution in Vite | Environment secret could enter client output | Removed cloud-key definitions and unused cloud SDKs |
| Wildcard CORS with credentials | Overbroad browser access | Explicit loopback origins, no credentials; not a replacement for authentication |
| No query length or response validation | Invalid inputs and unsuccessful responses treated as normal | Pydantic schema, timeout, status check, client response validation |
| Queries printed to console | Potential sensitive text in logs | Removed application query logging |
| SQLite ingestion mutated DB on import and duplicated data | Non-repeatable tooling | Explicit function boundary, transaction and per-source replacement |
| CDN markers and remote font | Avoidable online dependencies | Bundled Leaflet markers; system font fallback |
| Simulated submissions/live labels | Misleading portfolio/product claims | Persistent multilingual demo notice; submission messages and main metrics labeled |
| No dependency/test/CI documentation | Difficult to reproduce | Python dependency groups, tests, CI, English README and setup guide |
| Initial npm audit: 10 findings (1 critical, 4 high, 5 moderate) | Dependency risk | Unused packages removed, compatible lockfile fixes applied; see verification below |

The original production Vite build succeeded, despite the failing typecheck. No baseline Python server could run in a clean environment without undeclared dependencies. Actual pre-existing model inference was not verified.

## Verification record

Local results: **39 backend tests, 5 client tests and 4 Chromium browser tests passed**. TypeScript checking, Ruff, Python compilation and production build passed. `npm audit` reported zero known vulnerabilities after cleanup. Python dependency auditing detected affected pytest/Starlette versions during preparation; they were upgraded before the final checks. The final `pip-audit -r requirements-dev.txt` reported zero known vulnerabilities. Optional semantic/PDF dependency groups were not included in that audit. See the PR's CI run for hosted verification.

The browser review also caught a cramped mobile header and an unsupported institution-integration claim; both were corrected. Screenshot checks were repeated after the fixes. Local checks cover Python parsing, routing, API schemas/aliases/CORS, SQLite idempotence and parameterization, frontend transport, TypeScript and the production build. Browser checks use a real local FastAPI process for document retrieval and block external HTTPS services.

The source corpus has 17 blocks. No model artifact is present, so optional semantic tests use controlled scores rather than proving actual inference quality. Browser speech, physical audio output, geolocation hardware, external websites, video playback and actual online tile rendering are not certified by automated smoke tests.

## Remaining work

- Large React view module; this PR extracts data and transport but does not claim a complete feature-module migration.
- Medical guidance, sample locations, asset attribution and licensing need qualified review.
- No authentication, durable multi-user state, real dispatch, live feeds or public-deployment hardening.
- No service worker, installed PWA, cached offline tiles or guaranteed offline speech recognition.
- Semantic cutoff is uncalibrated; no accuracy, latency or hardware benchmarks yet.
- Existing translated views include incomplete localization and some sample status wording; the persistent demo disclosure applies throughout.
- Python dependencies pin direct versions only; perform a fresh dependency review before public deployment.
- Build reports a large main chunk; feature-level lazy loading remains a follow-up.
