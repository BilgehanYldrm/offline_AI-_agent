# 🌍 Türkiye Afette El Ele — Çevrimdışı Acil Durum Yapay Zeka Asistanı

🌐 **Diller:** [English](README.md) | [Türkçe](README.tr.md)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Offline First](https://img.shields.io/badge/Mimari-Offline--First-success?style=for-the-badge)](#)

> **Microsoft AI Innovators** programı kapsamında geliştirilmiştir. Deprem veya altyapı çökmesi durumlarında telekomünikasyon ve internet kesintilerine rağmen **tamamen yerel donanım üzerinde** kesintisiz çalışabilen acil durum afet asistanı.

---

## 📌 Proje Hakkında

Büyük ölçekli afetlerde baz istasyonlarının çökmesi ve şebeke altyapılarının devre dışı kalması, arama-kurtarma ve sivil ilk yardım süreçlerinde hayati bilgi kopukluklarına yol açmaktadır.

Bu proje;
- **Sıfır İnternet Bağımlılığı (Offline-First):** Yerel cihaz donanımında çalışan lokal dil modelleri (LLM) ile şebekesiz ortamda akıllı rehberlik sağlar.
- **RAG & Yerel Bilgi Bankası:** SQLite üzerinde önceden indekslenmiş ilk yardım kılavuzları, toplanma alanları ve acil durum prosedürlerini anlık olarak sorgular.
- **Sesli ve Metin Tabanlı İletişim:** Web Speech API entegrasyonu sayesinde panik veya enkaz altında sesli komut alıp yanıt üretebilir.

---

## 🛠️ Sistem Mimarisi & Teknoloji Yığını

* **Frontend:** React, Vite, HTML5 Web Speech API
* **Backend:** FastAPI, Python, Uvicorn
* **Lokal Çıkarım (Local Inference):** Ollama (Llama 3 / Yerel Model)
* **Veri Yönetimi:** SQLite (`afet_bilgi.db`)

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Ön Gereksinimler
* Node.js (v18+)
* Python 3.10+
* [Ollama](https://ollama.ai/) (Lokal model çıkarımı için)

### 2. Modeli Hazırlama (Lokal LLM)
```bash
ollama run llama3:8b