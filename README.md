# 404MOV - Rapid Movie Decision Platform

> **Status:** Visuals & Architecture Locked  
> **Constraint:** 100% Silent Architecture (Zero-Audio Constraint)  
> **Philosophy:** Anti-Analysis Paralysis — Maximum 3 to 5 curated movie results at any time.

---

## 1. Overview & System Philosophy

**404MOV** (strictly written continuously without spaces) is not a conventional endless streaming catalog or database. It is a **Rapid Movie Decision Engine** designed specifically to eradicate **Analysis Paralysis**—the exhausting phenomenon where viewers spend 45+ minutes wandering through algorithms and catalogs only to end up frustrated.

At any given moment, 404MOV curates and locks in strictly **3 to 5 uncompromising, high-caliber recommendations** matching the user's intent.

### Zero-Audio Architecture (100% Silent)
In accordance with system specifications:
- Absolutely **NO** `<audio>` HTML elements.
- Absolutely **NO** Web Audio API (`AudioContext`, `createGain`, etc.).
- Absolutely **NO** audio files (`.mp3`, `.wav`, `.ogg`).
- Absolutely **NO** speaker, volume, or sound toggle icons anywhere in the user interface.

---

## 2. Cyber Radar Visual Identity & Design Tokens

| Token Name | Hex / CSS Value | Application |
|---|---|---|
| **Obsidian Matte** | `#0A0B0E` | Main matte background with subtle micro-grain noise overlay |
| **Cyber Yellow** | `#FCEE09` | Exclusive angular brand logo (`404MOV`) and Mode 3 highlights |
| **Radar Cyber-Green** | `#00FFA3` / `#10E7B2` | Camera monitor screen, `Execute` button, and `Solve My 404` CTA |
| **Frosted Surface** | `rgba(18, 22, 28, 0.72)` | Interactive cards and search bar with `backdrop-filter: blur(16px)` |
| **Refined Hover Border** | `rgba(255, 255, 255, 0.18)` | Minimal 1px border and `0 14px 35px rgba(0,0,0,0.8)` shadow (No AI-slop neon) |
| **Typography Contrast** | `#EDEDED` / `#8F9CA8` | Matte white titles, cool gray metadata and technical tags |

### Brand Logo Glitch Mechanic
The `404MOV` logo (fixed at `top: 1.5rem; left: 2rem`) is clean, sharp, and stable **95% of the time**. Every 4.5 seconds, a 200ms micro-pixel horizontal displacement and slice glitch triggers via pure CSS keyframes (`microGlitch`), inspired by the sharp geometry of official cyberpunk typography.

---

## 3. Mascot Mechanics: Roman Carax (Cyberpunk Camera Operator)

Roman Carax is rendered as a clean, high-precision vector anime mascot holding a handheld cyber-camera:
1. **Viewport Clearance & Safe Zone:**
   - Hair top maintains at least 24px clearance from the header (never clips out of viewport).
   - Torso emerges naturally directly behind the search input, hands resting on top of the search container.
2. **Idle State:** Gentle organic breathing motion (`carax-breathing`), natural blinking every 4.2s (`carax-blink`), and a circular green radar grid sweeping continuously (`radar-sweep-normal`).
3. **Cursor Tracking:** Head and camera lens smoothly tilt and follow mouse movement constrained to a safe **±15 degree** radius.
4. **Search Typing State:** When the search input is focused, the camera lens tilts down toward the text box and the radar rotation speed doubles (`radar-sweep-fast`).
5. **Scan Trigger:** On search execution or pill clicks, a targeting reticle locks onto the camera monitor screen (`reticle-lock-anim`) before rendering filtered results.

---

## 4. Decision Hub & Spotlight Grid (Prime Video Model)

- **Search & 3 Modes:**
  - `Mode 1: Title Search`: Exact title, director, and keyword match.
  - `Mode 2: Vibe & Mood`: Natural semantic mood query.
  - `Mode 3: 404 Brain Not Found`: Special triage modal featuring **Instant Cinema Roulette** (1 guaranteed masterclass pick) and **3-Click Rapid Vibe Triage**.
- **Rapid Selector Pills:**
  - Duration: `Under 90 mins`, `2h Standard`, `Miniseries`
  - Vibe: `Adrenaline Rush`, `Mind-Bending`, `Cozy & Light`, `Dark & Deep`
  - Primary Action Button: `Solve My 404` (Highlighted in `#00FFA3`).
- **Spotlight Grid (Prime Video Hover Interaction):**
  - **Default State:** Pristine 2:3 vertical posters showing title, release year, and score badge.
  - **Hover State:** Smooth 300ms cubic-bezier transition scaling the card up by ~40% above neighboring cards. Morphs to a wide 16:9 cinematic backdrop shot, runtime, maturity rating, genres, and a sharp 1-sentence decision hook ("Why it fits your vibe").
  - **Primary CTA:** `Where to Watch & Details ↗` which triggers navigation to `/movie/:id` in a **NEW BROWSER TAB (`target="_blank"`)**, keeping the search context intact in the original tab.
  - **Quick Bookmark:** Instant watchlist storage via `localStorage` (Zero login friction).

---

## 5. Dedicated Movie Hub Page (`/movie/:id`)

Opens in a separate browser tab (`target="_blank"`) to preserve search parameters:
1. **Cinematic Hero:** Full-width dimmed backdrop, key art poster, release date, runtime, rating, director, cast, and decision hook.
2. **Aggregated Ratings Matrix:** Verified scores from **IMDb**, **Rotten Tomatoes**, and **Metacritic** with percentage progress bars.
3. **Where to Watch Hub (Structured 3 Tabs):**
   - **Direct & Uncensored Streams:** Direct downloads and streaming servers categorized by resolution (**4K UHD Remux**, **1080p Web-DL**, **720p Mobile**) with file sizes, audio specs (Dolby Atmos / DTS-HD), subtitles, and mirror nodes.
   - **Family / Censored Versions:** Filtered/edited streaming links suitable for family viewing with clear editorial notes on adjustments made.
   - **Official Streaming Services:** Direct links to Netflix, Prime Video, Apple TV+, Max, Hulu with pricing tiers and quality specs.
4. **Video Essays & Critical Reviews:** Curated video breakdowns (Thomas Flight, StudioBinder, Every Frame a Painting, etc.) and quotes from verified film critics.
5. **Similar Vibes Radar:** Exactly 3 immediate alternative recommendations sharing similar themes.

---

## 6. Telemetry Logging Standard

Every user interaction produces a structured console log adhering to:
```
[TIMESTAMP] [EVENT_TYPE] | Component -> Details
```

### Covered Standard Events:
- `SEARCH_QUERY`: Logged on query execution and real-time mascot reticle calibration.
- `FILTER_SELECT`: Logged on clicking duration pills, vibe pills, or `Solve My 404`.
- `HOVER_CARD_EXPAND`: Logged when a card scales 40% into 16:9 Prime Video preview mode.
- `OPEN_MOVIE_TAB`: Logged when navigating to `/movie/:id` in a new browser tab.
- `DOWNLOAD_SOURCE_CLICK`: Logged on clicking direct streams, family versions, or official provider links.

A live telemetry drawer is built into the bottom-right corner of the UI to inspect and copy telemetry logs in real time.

---

## 7. Running the Application

### Backend (FastAPI Python)
```bash
# From workspace root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### Frontend (React + Vite + Tailwind CSS)
```bash
# In frontend directory
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend URL:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
