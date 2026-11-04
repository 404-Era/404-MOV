/**
 * 404MOV Telemetry Service
 * Adheres strictly to the production logging standard:
 * [TIMESTAMP] [EVENT_TYPE] | Component -> Details
 */

export type TelemetryEventType =
  | 'SEARCH_QUERY'
  | 'FILTER_SELECT'
  | 'HOVER_CARD_EXPAND'
  | 'OPEN_MOVIE_TAB'
  | 'DOWNLOAD_SOURCE_CLICK'
  | 'ROULETTE_TRIGGER'
  | 'WATCHLIST_TOGGLE'
  | 'TAB_SWITCH';

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  eventType: TelemetryEventType;
  component: string;
  details: Record<string, any>;
  rawLine: string;
}

// In-memory frontend log store for UI audit inspection
const localAuditLogs: TelemetryLogEntry[] = [];
type LogListener = (logs: TelemetryLogEntry[]) => void;
const listeners: Set<LogListener> = new Set();

export function subscribeTelemetry(listener: LogListener): () => void {
  listeners.add(listener);
  listener([...localAuditLogs]);
  return () => {
    listeners.delete(listener);
  };
}

export function logTelemetry(
  eventType: TelemetryEventType,
  component: string,
  details: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  
  // Format details into clean key=value string
  const detailsStr = Object.entries(details)
    .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(', ');

  const rawLine = `[${timestamp}] [${eventType}] | ${component} -> ${detailsStr}`;

  // 1. Mandatory console log output matching exact specification
  console.log(rawLine);

  // 2. Save in local audit log
  const entry: TelemetryLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    eventType,
    component,
    details,
    rawLine
  };

  localAuditLogs.unshift(entry);
  if (localAuditLogs.length > 200) {
    localAuditLogs.pop();
  }

  listeners.forEach(fn => fn([...localAuditLogs]));

  // 3. Fire-and-forget sync to backend API
  try {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp,
        event_type: eventType,
        component,
        details
      })
    }).catch(() => {
      // Silent fail if backend is unreachable, no crashing
    });
  } catch {
    // Silent
  }
}

// Quick helper methods for standard events
export const Telemetry = {
  searchQuery: (query: string, mode: string, resultCount?: number) => {
    logTelemetry('SEARCH_QUERY', 'SearchBar / Mascot', {
      query: query || '(empty)',
      mode,
      resultsCount: resultCount ?? 'pending'
    });
  },

  filterSelect: (filterCategory: string, value: string, activePills: Record<string, any>) => {
    logTelemetry('FILTER_SELECT', 'RapidSelectorPills', {
      category: filterCategory,
      selected: value,
      activeState: activePills
    });
  },

  hoverCardExpand: (movieId: string, title: string) => {
    logTelemetry('HOVER_CARD_EXPAND', 'SpotlightCard', {
      movieId,
      title,
      scale: '140%',
      viewMode: '16:9-backdrop'
    });
  },

  openMovieTab: (movieId: string, title: string, source: string = 'CardCTA') => {
    logTelemetry('OPEN_MOVIE_TAB', source, {
      movieId,
      title,
      target: '_blank',
      url: `/movie/${movieId}`
    });
  },

  downloadSourceClick: (
    movieId: string,
    sourceType: 'DirectUncensored' | 'FamilyCensored' | 'OfficialService',
    resolution: string,
    fileSizeOrPlan: string,
    targetUrl: string
  ) => {
    logTelemetry('DOWNLOAD_SOURCE_CLICK', 'WhereToWatchHub', {
      movieId,
      sourceType,
      resolution,
      fileSizeOrPlan,
      targetUrl
    });
  },

  rouletteTrigger: (vibe?: string) => {
    logTelemetry('ROULETTE_TRIGGER', 'Mode3Roulette', {
      vibe: vibe || 'random_masterpiece',
      trigger: 'Solve My 404'
    });
  },

  watchlistToggle: (movieId: string, title: string, action: 'add' | 'remove') => {
    logTelemetry('WATCHLIST_TOGGLE', 'SpotlightCard', {
      movieId,
      title,
      action
    });
  }
};
