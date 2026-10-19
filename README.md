# 🌍 Türkiye Afette El Ele — Offline AI Emergency Assistant

🌐 **Languages:** [English](README.md) | [Türkçe](README.tr.md)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Offline First](https://img.shields.io/badge/Architecture-Offline--First-success?style=for-the-badge)](#)

> Developed as part of the **Microsoft AI Innovators** program. An edge-ready, offline-first emergency assistant and decision-support system designed to operate on local hardware without internet or telecommunication infrastructure during disaster scenarios.

---

## 📌 Overview

During large-scale natural disasters (e.g., earthquakes, severe floods), central telecommunication infrastructure and cellular networks often collapse, leading to critical communication blackouts for search, rescue, and civilian first aid.

This system addresses this challenge through:
- **Zero Internet Dependency (Offline-First):** Executes on edge devices using local LLM inference engines (Ollama) to deliver actionable guidance completely off-grid.
- **RAG & Local Knowledge Retrieval:** Queries pre-indexed emergency protocols, assembly points, and medical first-aid manuals stored locally in SQLite.
- **Voice & Text Interaction:** Leverages Web Speech API for hands-free, voice-enabled interaction during high-stress emergency situations.

---

## 🛠️ System Architecture & Tech Stack

* **Frontend:** React, Vite, Web Speech API (Voice Recognition & Synthesis)
* **Backend:** FastAPI, Python, Uvicorn
* **Edge Inference:** Ollama (Llama 3 / Local Open-Weights LLMs)
* **Data Storage:** SQLite (`afet_bilgi.db`)

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* Python 3.10+
* [Ollama](https://ollama.ai/) installed locally

### 2. Prepare Local LLM
```bash
ollama run llama3:8b