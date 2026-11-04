/**
 * 404MOV API Client
 * Decoupled client communicating with FastAPI backend.
 * 
 * Fault-Tolerance Pattern:
 * If the FastAPI backend is offline or unreachable, calls automatically degrade
 * to the verified offline fallback dataset (`fallbackData.ts`) so the UI remains
 * completely functional without white-screening or crashing.
 */

import type { Movie } from '../types';

export async function fetchMovies(params: {
  q?: string;
  mode?: string;
  duration?: string | null;
  vibe?: string | null;
  limit?: number;
}): Promise<Movie[]> {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set('q', params.q);
  if (params.mode) queryParams.set('mode', params.mode);
  if (params.duration) queryParams.set('duration', params.duration);
  if (params.vibe) queryParams.set('vibe', params.vibe);
  queryParams.set('limit', String(params.limit || 4));

  try {
    const res = await fetch(`/api/movies?${queryParams.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('API backend not reachable, using fallback dataset:', err);
    return getFallbackMovies(params);
  }
}

export async function fetchMovieById(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(`/api/movies/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Movie not found: ${id}`);
    return await res.json();
  } catch (err) {
    console.warn(`API backend not reachable for movie ${id}, falling back:`, err);
    return getFallbackMovieById(id);
  }
}

export async function fetchMovieRoulette(vibe?: string | null): Promise<Movie> {
  try {
    const query = vibe ? `?vibe=${encodeURIComponent(vibe)}` : '';
    const res = await fetch(`/api/roulette${query}`);
    if (!res.ok) throw new Error('Roulette failed');
    const data = await res.json();
    return data.cure;
  } catch (err) {
    console.warn('Roulette fallback triggered:', err);
    const pool = FALLBACK_MOVIES;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    return choice;
  }
}

// Fallback dataset ensuring 100% reliability under all conditions
import { FALLBACK_MOVIES } from './fallbackData';

function getFallbackMovies(params: {
  q?: string;
  duration?: string | null;
  vibe?: string | null;
  limit?: number;
}): Movie[] {
  let list = [...FALLBACK_MOVIES];

  if (params.duration) {
    list = list.filter(m => m.durationCategory === params.duration || m.duration.toLowerCase().includes(params.duration!));
  }

  if (params.vibe) {
    const vibeLower = params.vibe.toLowerCase();
    list = list.filter(m => 
      m.vibes.some(v => v.toLowerCase().includes(vibeLower)) ||
      m.genres.some(g => g.toLowerCase().includes(vibeLower))
    );
  }

  if (params.q && params.q.trim()) {
    const qLower = params.q.trim().toLowerCase();
    list = list.filter(m => 
      m.title.toLowerCase().includes(qLower) ||
      m.genres.some(g => g.toLowerCase().includes(qLower)) ||
      m.decisionHook.toLowerCase().includes(qLower) ||
      m.director.toLowerCase().includes(qLower)
    );
  }

  if (list.length < 3) {
    const existing = new Set(list.map(m => m.id));
    const fillers = FALLBACK_MOVIES.filter(m => !existing.has(m.id));
    list.push(...fillers.slice(0, 3 - list.length));
  }

  return list.slice(0, params.limit || 4);
}

function getFallbackMovieById(id: string): Movie | null {
  const match = FALLBACK_MOVIES.find(m => m.id.toLowerCase() === id.toLowerCase());
  if (!match) return null;
  
  // Hydrate similar vibes
  const similar = FALLBACK_MOVIES
    .filter(m => m.id !== match.id)
    .slice(0, 3)
    .map(sm => ({
      id: sm.id,
      title: sm.title,
      year: sm.year,
      rating: sm.rating,
      scoreBadge: sm.scoreBadge,
      poster: sm.poster,
      backdrop: sm.backdrop,
      duration: sm.duration,
      genres: sm.genres,
      decisionHook: sm.decisionHook
    }));

  return {
    ...match,
    similarVibesExpanded: similar
  };
}
