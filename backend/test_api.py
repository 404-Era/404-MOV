import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import (
    health_check,
    get_movies,
    get_movie_detail,
    movie_roulette,
    record_telemetry,
    TelemetryEvent,
    format_telemetry_line
)

import asyncio

def run_tests():
    # 1. Health check
    h = health_check()
    assert h["status"] == "online"
    assert h["zero_audio_compliant"] is True
    print("[PASS] Health check passed:", h)

    # 2. Movies default (strict 3-5 limit)
    m_def = get_movies(limit=4)
    assert 3 <= m_def["count"] <= 5
    assert len(m_def["results"]) == m_def["count"]
    print(f"[PASS] Default movies count: {m_def['count']} (Strictly 3-5 Anti-Analysis Paralysis)")

    # 3. Filter by duration
    m_dur = get_movies(duration="under-90", limit=4)
    assert 3 <= m_dur["count"] <= 5
    print(f"[PASS] Duration filter 'under-90': {m_dur['count']} results")

    # 4. Filter by vibe
    m_vibe = get_movies(vibe="Adrenaline Rush", limit=4)
    assert 3 <= m_vibe["count"] <= 5
    print(f"[PASS] Vibe filter 'Adrenaline Rush': {m_vibe['count']} results")

    # 5. Dedicated Movie Hub Detail
    m_det = get_movie_detail("severance")
    assert m_det["id"] == "severance"
    assert "ratingsMatrix" in m_det
    assert "whereToWatch" in m_det
    assert len(m_det["whereToWatch"]["directStreams"]) > 0
    assert len(m_det["whereToWatch"]["familyVersions"]) > 0
    assert len(m_det["whereToWatch"]["officialServices"]) > 0
    assert len(m_det["videoEssays"]) > 0
    assert len(m_det["similarVibesExpanded"]) == 3
    print("[PASS] Movie Hub detail for 'severance' verified: 3 watch tabs & 3 similar vibe movies")

    # 6. Mode 3 Roulette
    r = movie_roulette()
    assert "cure" in r
    assert "id" in r["cure"]
    print(f"[PASS] Mode 3 Roulette cure: {r['cure']['title']}")

    # 7. Telemetry logging
    event = TelemetryEvent(
        timestamp="2026-10-27T21:00:00.000Z",
        event_type="SEARCH_QUERY",
        component="SearchBar / Mascot",
        details={"query": "cyberpunk", "mode": "mode1", "resultsCount": 4}
    )
    res = asyncio.run(record_telemetry(event))
    assert res["status"] == "recorded"
    print("[PASS] Telemetry logging standard verified")

if __name__ == "__main__":
    run_tests()
    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")
