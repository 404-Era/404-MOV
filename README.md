# 404MOV - Rapid Movie Decision Platform

<div align="center">

### Anti-Analysis Paralysis • Cyberpunk Console

[![GitHub Organization](https://img.shields.io/badge/Organization-404--Era-FCEE09?style=for-the-badge&logo=github&logoColor=black)](https://github.com/404-Era)
[![React 19](https://img.shields.io/badge/React-19.3-00FFA3?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ⚡ Overview

**404MOV** is an anti-analysis-paralysis movie recommendation platform. Instead of overwhelming users with endless rows of filler content, 404MOV locks in strictly **3 to 5 curated, high-caliber recommendations** matching the user's intent.

---

## 🌟 Key Features

- **3 Search Modes:**
  - `Mode 1: Title Search`: Exact title, director, and keyword match.
  - `Mode 2: Vibe & Mood`: Natural semantic mood query (e.g. *"mind-bending neon noir"*).
  - `Mode 3: 404 Brain Not Found`: Special triage modal featuring **Instant Cinema Roulette** (1 guaranteed masterclass pick).
- **3-Click Rapid Selectors:** Instant duration (`Under 90 mins`, `2h Standard`, `Miniseries`) and vibe filters (`Adrenaline Rush`, `Mind-Bending`, `Cozy & Light`, `Dark & Deep`).
- **Spotlight Grid (Prime Video Model):** Clean 2:3 vertical posters that smoothly scale ~40% into 16:9 cinematic hover previews without shifting layout.
- **Dedicated Movie Hub (`/movie/:id`):** Opens in a separate tab with aggregated ratings (IMDb, Rotten Tomatoes, Metacritic), video essays, similar vibes, and 3 structured watch tabs (Direct 4K/1080p, Family-Friendly Edits, Official Platforms).
- **Roman Carax Cyber-Mascot:** Interactive anime camera operator that responds to cursor movement and search focus.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (v3.10+) & **pip**

### 1. Clone the Repository
```bash
git clone https://github.com/404-Era/404-MOV.git
cd 404-MOV
```

### 2. Run the Backend (FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the API server (http://127.0.0.1:8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 3. Run the Frontend (React + Vite)
In a new terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server (http://127.0.0.1:5173)
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## 📂 Project Structure

```text
404mov/
├── backend/            # FastAPI Python REST API & movie database
│   ├── main.py         # API endpoints & search heuristics
│   ├── test_api.py     # Automated backend test suite
│   ├── requirements.txt
│   └── data/           # Curated movie catalog & metadata
├── frontend/           # React 19 + TypeScript + Vite Single Page App
│   ├── src/
│   │   ├── components/ # Modular UI components (SearchBar, SpotlightCard, etc.)
│   │   ├── pages/      # HomePage & MovieHubPage
│   │   └── services/   # REST client, telemetry, & watchlist storage
│   └── public/         # Production assets & isolated character WebP
├── media/              # Master reference media footage (1.mp4)
├── scripts/            # Asset pipeline & extraction utilities
├── requirements.txt    # Global Python requirements
└── README.md
```

---

## 🧪 Testing & Verification

```bash
# Run backend test suite
python backend/test_api.py

# Run frontend build
cd frontend && npm run build
```

---

## 🏢 Organization & License

Maintained by **[404-Era](https://github.com/404-Era)**.  
Built for film lovers who value their time.  
**404MOV: Stop Searching. Start Watching.**
