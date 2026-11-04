/**
 * 404MOV Watchlist Storage Service
 * LocalStorage powered zero-friction watchlist persistence.
 */

import type { Movie } from '../types';
import { Telemetry } from './telemetry';

const WATCHLIST_STORAGE_KEY = '404mov_watchlist_v1';

export function getWatchlist(): Movie[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load watchlist from localStorage:', err);
    return [];
  }
}

export function isMovieInWatchlist(movieId: string): boolean {
  const current = getWatchlist();
  return current.some(m => m.id === movieId);
}

export function toggleWatchlistMovie(movie: Movie): boolean {
  const current = getWatchlist();
  const exists = current.some(m => m.id === movie.id);
  let updated: Movie[];

  if (exists) {
    updated = current.filter(m => m.id !== movie.id);
    Telemetry.watchlistToggle(movie.id, movie.title, 'remove');
  } else {
    updated = [movie, ...current];
    Telemetry.watchlistToggle(movie.id, movie.title, 'add');
  }

  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom DOM event to synchronize watchlist state across disparate
    // components (SpotlightCard, WatchlistDrawer, Header badge) without heavy state libraries.
    window.dispatchEvent(new Event('404mov_watchlist_updated'));
  } catch (err) {
    console.error('Failed to save watchlist to localStorage:', err);
  }

  return !exists;
}
