"""
404MOV Backend API Service
FastAPI REST service powering the anti-analysis-paralysis movie decision engine.
Deterministic JSON responses, telemetry logging, and silent zero-audio architecture.
"""

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import datetime
import random
import sys
import os

# Add current directory to path for clean local imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data.movies import MOVIES_DATABASE

app = FastAPI(
    title="404MOV Decision Engine API",
    description="Anti-Analysis Paralysis Movie Recommendation Platform",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount project media folder if present
media_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "media")
if os.path.exists(media_folder):
    app.mount("/media", StaticFiles(directory=media_folder), name="media")

# In-memory telemetry log buffer
telemetry_logs: List[Dict[str, Any]] = []

class TelemetryEvent(BaseModel):
    timestamp: Optional[str] = None
    event_type: str
    component: str
    details: Dict[str, Any]

def format_telemetry_line(timestamp: str, event_type: str, component: str, details_str: str) -> str:
    return f"[{timestamp}] [{event_type}] | {component} -> {details_str}"

@app.on_event("startup")
async def startup_event():
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat()
    print(format_telemetry_line(ts, "SYSTEM_INIT", "CoreBackend", "404MOV Zero-Audio Engine Online"))

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "404MOV Decision Engine",
        "zero_audio_compliant": True,
        "database_movies_count": len(MOVIES_DATABASE)
    }

@app.post("/api/telemetry")
async def record_telemetry(event: TelemetryEvent):
    """
    Standard Telemetry logging endpoint:
    Outputs strictly formatted console logs:
    [TIMESTAMP] [EVENT_TYPE] | Component -> Details
    """
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    ts = event.timestamp or now
    details_summary = ", ".join(f"{k}={v}" for k, v in event.details.items())
    
    log_line = format_telemetry_line(ts, event.event_type, event.component, details_summary)
    print(log_line)
    
    entry = {
        "id": len(telemetry_logs) + 1,
        "timestamp": ts,
        "event_type": event.event_type,
        "component": event.component,
        "details": event.details,
        "raw_line": log_line
    }
    telemetry_logs.append(entry)
    if len(telemetry_logs) > 500:
        telemetry_logs.pop(0)
        
    return {"status": "recorded", "event": entry}

@app.get("/api/telemetry")
def get_telemetry_history(limit: int = 50):
    return {"logs": telemetry_logs[-limit:]}

@app.get("/api/movies")
def get_movies(
    q: Optional[str] = Query(None, description="Search term for title, mood, or keywords"),
    mode: Optional[str] = Query("mode1", description="mode1: Title, mode2: Vibe & Mood, mode3: Brain Not Found"),
    duration: Optional[str] = Query(None, description="Duration category: under-90, 2h-standard, miniseries"),
    vibe: Optional[str] = Query(None, description="Vibe filter: Adrenaline Rush, Mind-Bending, Cozy & Light, Dark & Deep"),
    limit: int = Query(4, ge=3, le=5, description="Anti-analysis paralysis constraint: strictly 3 to 5 results")
):
    """
    Delivers strictly 3 to 5 curated movie options to eliminate choice paralysis.
    """
    filtered = list(MOVIES_DATABASE)

    # Filter by duration if specified
    if isinstance(duration, str) and duration.strip():
        dur_norm = duration.strip().lower().replace(" ", "-")
        filtered = [m for m in filtered if m.get("durationCategory") == dur_norm or dur_norm in m.get("duration", "").lower()]

    # Filter by vibe if specified
    if isinstance(vibe, str) and vibe.strip():
        vibe_norm = vibe.strip().lower()
        filtered = [
            m for m in filtered 
            if any(vibe_norm in v.lower() for v in m.get("vibes", [])) or
               any(vibe_norm in g.lower() for g in m.get("genres", []))
        ]

    # Filter by query if present
    if isinstance(q, str) and q.strip():
        query_str = q.strip().lower()
        
        # Weighted relevance scoring: Prioritizes exact title matches, then mood/vibe,
        # followed by genre, synopsis decision hooks, and cast/director keywords.
        def match_score(m: Dict[str, Any]) -> int:
            score = 0
            # Title matches highest (weight: 10)
            if query_str in m["title"].lower():
                score += 10
            # Vibe matches (weight: 8)
            if any(query_str in v.lower() for v in m.get("vibes", [])):
                score += 8
            # Genre matches (weight: 5)
            if any(query_str in g.lower() for g in m.get("genres", [])):
                score += 5
            # Synopsis / Hook (weight: 4)
            if query_str in m.get("decisionHook", "").lower() or query_str in m.get("synopsis", "").lower():
                score += 4
            # Cast / Director (weight: 3)
            if query_str in m.get("director", "").lower() or any(query_str in c.lower() for c in m.get("cast", [])):
                score += 3
            return score

        scored = [(m, match_score(m)) for m in filtered]
        scored_filtered = [m for m, s in scored if s > 0]
        if scored_filtered:
            scored_filtered.sort(key=lambda item: match_score(item), reverse=True)
            filtered = scored_filtered
        else:
            # Fallback to general filtered if search didn't match directly
            pass

    # Anti-Analysis Paralysis Guarantee: Always return strictly 3 to 5 options.
    # If filters narrow results below 3, top-rated database items pad the list
    # so the user never faces an empty or solitary decision dead-end.
    if len(filtered) < 3:
        existing_ids = {m["id"] for m in filtered}
        fillers = [m for m in MOVIES_DATABASE if m["id"] not in existing_ids]
        filtered.extend(fillers[:(3 - len(filtered))])

    # Cap results strictly at the requested limit (defaults to 4, max 5)
    result_slice = filtered[:limit]

    return {
        "count": len(result_slice),
        "query": q,
        "mode": mode,
        "duration": duration,
        "vibe": vibe,
        "results": result_slice
    }

@app.get("/api/movies/{movie_id}")
def get_movie_detail(movie_id: str):
    """
    Dedicated Movie Hub endpoint.
    Retrieves full verified metadata, ratings matrix, structured download/stream tabs,
    video essays, and 3 similar vibe movies.
    """
    movie = next((m for m in MOVIES_DATABASE if m["id"].lower() == movie_id.lower()), None)
    if not movie:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_id}' not found in 404MOV database.")

    # Hydrate exactly 3 lightweight preview objects for the 'Similar Vibes Radar'
    # section of the Movie Hub, omitting bulky nested stream tables to keep payloads fast.
    similar_ids = movie.get("similarVibes", [])
    similar_movies = [m for m in MOVIES_DATABASE if m["id"] in similar_ids]
    if len(similar_movies) < 3:
        fillers = [m for m in MOVIES_DATABASE if m["id"] != movie["id"] and m["id"] not in [sm["id"] for sm in similar_movies]]
        similar_movies.extend(fillers[:(3 - len(similar_movies))])

    result = dict(movie)
    result["similarVibesExpanded"] = [
        {
            "id": sm["id"],
            "title": sm["title"],
            "year": sm["year"],
            "rating": sm["rating"],
            "scoreBadge": sm["scoreBadge"],
            "poster": sm["poster"],
            "fallbackPoster": sm.get("fallbackPoster"),
            "backdrop": sm["backdrop"],
            "fallbackBackdrop": sm.get("fallbackBackdrop"),
            "duration": sm["duration"],
            "genres": sm["genres"],
            "decisionHook": sm["decisionHook"]
        }
        for sm in similar_movies[:3]
    ]

    return result

@app.get("/api/roulette")
def movie_roulette(vibe: Optional[str] = None):
    """
    Mode 3: '404 Brain Not Found' instant cure.
    Selects 1 guaranteed cinema cure with high shock-and-awe value.
    """
    pool = MOVIES_DATABASE
    if vibe:
        vibe_pool = [m for m in pool if any(vibe.lower() in v.lower() for v in m.get("vibes", []))]
        if vibe_pool:
            pool = vibe_pool
    choice = random.choice(pool)
    return {
        "cure": choice,
        "message": "Brain freeze resolved. One singular masterclass movie selected to eliminate decision paralysis."
    }
