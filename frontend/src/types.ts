/**
 * 404MOV Core Type Definitions
 */

export interface RatingsMatrix {
  imdb: {
    score: string;
    votes: string;
    percentage: number;
  };
  rottenTomatoes: {
    score: string;
    status: string;
    audience: string;
  };
  metacritic: {
    score: string;
    label: string;
    percentage: number;
  };
}

export interface DirectStreamSource {
  id: string;
  resolution: string; // e.g., '4K UHD Remux', '1080p Web-DL', '720p Mobile'
  format: string; // 'MKV / HEVC Dolby Vision', 'MP4 / H.265'
  size: string; // '26.4 GB', '6.8 GB'
  audio: string; // 'Dolby Atmos 7.1', '5.1 Surround'
  subtitles: string[];
  server: string;
  speed: string;
  downloadUrl: string;
  streamUrl: string;
}

export interface FamilyStreamSource {
  id: string;
  title: string;
  notes: string;
  resolution: string;
  size: string;
  streamUrl: string;
}

export interface OfficialServiceSource {
  name: string;
  plan: string;
  quality: string;
  url: string;
}

export interface WhereToWatchData {
  directStreams: DirectStreamSource[];
  familyVersions: FamilyStreamSource[];
  officialServices: OfficialServiceSource[];
}

export interface VideoEssay {
  title: string;
  creator: string;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  summary: string;
}

export interface CriticalReview {
  critic: string;
  publication: string;
  quote: string;
  score: string;
}

export interface SimilarMovieVibe {
  id: string;
  title: string;
  year: number;
  rating: string;
  scoreBadge: number;
  poster: string;
  fallbackPoster?: string;
  backdrop: string;
  fallbackBackdrop?: string;
  duration: string;
  genres: string[];
  decisionHook: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  duration: string;
  durationCategory: 'under-90' | '2h-standard' | 'miniseries';
  rating: string;
  scoreBadge: number;
  poster: string;
  backdrop: string;
  fallbackPoster?: string;
  fallbackBackdrop?: string;
  genres: string[];
  vibes: string[];
  decisionHook: string;
  synopsis: string;
  director: string;
  cast: string[];
  ratingsMatrix: RatingsMatrix;
  trailer?: {
    youtubeId: string;
    title: string;
    runtime: string;
  };
  whereToWatch: WhereToWatchData;
  videoEssays: VideoEssay[];
  criticalReviews: CriticalReview[];
  similarVibes: string[];
  similarVibesExpanded?: SimilarMovieVibe[];
}

export type DecisionMode = 'mode1' | 'mode2' | 'mode3';

export interface FilterState {
  mode: DecisionMode;
  query: string;
  duration: string | null; // 'under-90' | '2h-standard' | 'miniseries' | null
  vibe: string | null; // 'Adrenaline Rush' | 'Mind-Bending' | 'Cozy & Light' | 'Dark & Deep' | null
}
