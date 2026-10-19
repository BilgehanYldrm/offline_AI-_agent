# Portfolio presentation and 30-day plan

## CV entry (English)

**Afette El Ele — Local Disaster-Preparedness Prototype**  
React, TypeScript, Python, FastAPI, SQLite, GitHub Actions

- Developed a multilingual preparedness dashboard backed by a local Turkish document-retrieval API, preserving source passages and returning an explicit no-match result for unsupported questions.
- Separated API validation, retrieval rules and frontend transport; added input limits, request timeouts, restricted development origins and repeatable SQLite ingestion.
- Added backend, client and browser regression tests and an automated test/build workflow; documented offline boundaries and clearly distinguished sample coordination screens from working integrations.

Use the optional Sentence Transformers adapter as a design discussion, not as a claim of measured model accuracy. Attach the repository and PR as evidence. Update test counts only after confirming the current CI run.

## LinkedIn project description (English)

Afette El Ele is my software engineering portfolio project exploring local access to disaster-preparedness information. It combines a React/TypeScript dashboard with a Python/FastAPI document-retrieval service. The default assistant searches a bundled Turkish corpus without a cloud AI key and returns the original passage with its source title.

My engineering focus is making the prototype easier to verify: clear component boundaries, explicit failure states, regression tests, reproducible setup and CI. The repository documents which parts work locally and which are demonstrations. Maps and coordination data are samples; the project is not connected to emergency responders and is not a clinically validated product.

The next milestone is a reviewed source corpus and a held-out retrieval evaluation set before benchmarking an optional local embedding model.

## Interview talking points

| Question | Evidence-based explanation |
| --- | --- |
| Is this a generative AI agent? | No. The active application retrieves source text. There is an optional embedding adapter and separate historical model experiments. |
| Why two retrieval modes? | A lightweight default is reproducible without a model download. Semantic retrieval is optional and requires explicit local setup and evaluation. |
| What failure did tests reveal? | An old nested snapshot broke typechecking, one assembly point used the wrong city field, and one routing target did not match its document title. |
| What was unsafe about the fallback? | Returning the first passage for unknown questions looked like a relevant answer. An explicit no-match response makes the limitation visible. |
| How did you avoid regressions? | Retained the UI and endpoint aliases, tested the real API from the browser, and kept changes on a review branch. |
| What remains? | Corpus review, model evaluation, finer UI decomposition, accessibility coverage and public-hosting safeguards. |

Before an interview, reproduce the setup yourself and be able to explain each changed module. Describe AI-assisted work honestly; do not claim authorship or performance results you cannot substantiate.

## 30-day execution plan

| Days | Deliverable | Evidence |
| --- | --- | --- |
| 1–5 | Review and understand this PR; reproduce setup on your Windows laptop | CI result, local walkthrough, annotated architecture |
| 6–10 | Curate document provenance and permissions; obtain qualified review of medical material | Source register, reviewed corrections, explicit limitations |
| 11–15 | Create a held-out Turkish query set including negative/mixed-topic cases; evaluate candidate local model | Dataset, model/version/hardware, accuracy and abstention measurements |
| 16–20 | Extract map/preparation/logistics views and expand accessibility + interaction tests | Small PRs with regression coverage |
| 21–25 | Define offline requirements, then implement and test the selected strategy | Network-disabled reload test and documented supported scope |
| 26–30 | Record a short local demo, revise CV/LinkedIn, rehearse technical explanation | Demo video, verified project bullets and interview notes |

Do not add invented user counts, accuracy percentages, latency claims or production-impact metrics. Publish benchmark numbers only with a repeatable method, dataset and hardware context.
