import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ExternalLink, 
  Download, 
  Play, 
  ShieldCheck, 
  Film, 
  Bookmark, 
  Check, 
  Tv, 
  Sparkles, 
  HardDrive, 
  Users, 
  Copy,
  Award
} from 'lucide-react';
import type { Movie } from '../types';
import { fetchMovieById } from '../services/api';
import { Telemetry } from '../services/telemetry';
import { isMovieInWatchlist, toggleWatchlistMovie } from '../services/watchlist';
import { BrandLogo } from '../components/BrandLogo';

interface MovieHubPageProps {
  movieId: string;
  onNavigateHome: () => void;
}

export const MovieHubPage: React.FC<MovieHubPageProps> = ({ movieId, onNavigateHome }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWatchTab, setActiveWatchTab] = useState<'direct' | 'family' | 'official'>('direct');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchMovieById(movieId).then((data) => {
      setMovie(data);
      if (data) {
        setInWatchlist(isMovieInWatchlist(data.id));
      }
      setIsLoading(false);
    });
    window.scrollTo(0, 0);
  }, [movieId]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    const newState = toggleWatchlistMovie(movie);
    setInWatchlist(newState);
  };

  const handleDownloadClick = (
    sourceType: 'DirectUncensored' | 'FamilyCensored' | 'OfficialService',
    resolution: string,
    fileSizeOrPlan: string,
    url: string
  ) => {
    if (!movie) return;
    Telemetry.downloadSourceClick(movie.id, sourceType, resolution, fileSizeOrPlan, url);
    // Open stream / download URL
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyStreamLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#00FFA3] border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-[#8F9CA8] tracking-widest uppercase">
          CALIBRATING CINEMATIC HUB DATA...
        </span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold font-mono text-[#FCEE09] mb-3">404 - MOVIE HUB NOT FOUND</h2>
        <p className="text-sm text-[#8F9CA8] mb-6">The specified cinematic profile could not be retrieved.</p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-2.5 rounded-xl bg-[#00FFA3] text-[#0A0B0E] font-mono font-bold text-sm cursor-pointer"
        >
          Return to 404MOV Decision Engine
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#EDEDED] relative selection:bg-[#00FFA3] selection:text-[#0A0B0E] pb-24">
      {/* Background grain */}
      <div className="cyber-noise" />

      {/* Brand Logo in top-left */}
      <BrandLogo onClick={onNavigateHome} />

      {/* Top Navbar Actions (Top-Right) */}
      <div className="fixed top-6 right-8 z-50 flex items-center space-x-3">
        <button
          type="button"
          onClick={handleWatchlistToggle}
          className={`px-4 py-2 rounded-xl backdrop-blur-md border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            inWatchlist
              ? 'bg-[#00FFA3] text-[#0A0B0E] border-[#00FFA3]'
              : 'bg-[#12161C]/80 text-[#EDEDED] border-white/10 hover:border-white/20'
          }`}
        >
          {inWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span>{inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </div>

      {/* ================= 1. CINEMATIC HERO ================= */}
      <div className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-end">
        {/* Full-width dimmed cinematic backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105"
          />
          {/* Subtle multi-stage cyber gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E] via-transparent to-[#0A0B0E]/60" />
        </div>

        {/* Hero Content Container */}
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-12 z-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-end">
            {/* 2:3 Key Art Poster */}
            <div className="w-44 md:w-56 lg:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border border-white/16 shadow-[0_25px_50px_rgba(0,0,0,0.9)] bg-[#12161C]">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta & Synopsis */}
            <div className="flex-1 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-[#00FFA3] text-[#0A0B0E] font-black flex items-center space-x-1 shadow-[0_0_12px_rgba(0,255,163,0.3)]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.scoreBadge.toFixed(1)} SCORE</span>
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-[#EDEDED]">
                  {movie.year}
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-[#EDEDED]">
                  {movie.duration}
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-[#EDEDED]">
                  {movie.rating}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#182128] border border-[#00FFA3]/40 text-[#00FFA3] font-semibold">
                  Zero Audio Clean Mode
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#EDEDED] tracking-tight font-['Orbitron',sans-serif] leading-tight">
                {movie.title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-md bg-[#161B22] border border-white/8 text-xs font-mono text-[#8F9CA8]"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* 1-Sentence Decision Hook */}
              <div className="p-3.5 rounded-xl bg-[#12161C]/90 border border-white/10 backdrop-blur-md max-w-3xl">
                <p className="text-sm md:text-base text-[#EDEDED] italic leading-relaxed">
                  "{movie.decisionHook}"
                </p>
              </div>

              {/* Synopsis */}
              <p className="text-xs md:text-sm text-[#8F9CA8] leading-relaxed max-w-3xl font-sans">
                {movie.synopsis}
              </p>

              {/* Credits */}
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#8F9CA8]">
                <div>
                  <span className="text-[#EDEDED] font-semibold">Director: </span>
                  <span>{movie.director}</span>
                </div>
                <div>
                  <span className="text-[#EDEDED] font-semibold">Cast: </span>
                  <span>{movie.cast.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hub Body */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-16">
        
        {/* ================= 2. AGGREGATED RATINGS MATRIX ================= */}
        <section>
          <div className="flex items-center space-x-2 mb-4 font-mono text-xs text-[#8F9CA8]">
            <Award className="w-4 h-4 text-[#00FFA3]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#EDEDED]">
              Aggregated Ratings Matrix (Triple Verified)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IMDb */}
            <div className="frosted-glass rounded-2xl p-5 border border-white/8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#F5C518] text-[#000000] font-black text-xs font-mono">
                  IMDb
                </span>
                <span className="text-[11px] font-mono text-[#8F9CA8]">
                  {movie.ratingsMatrix.imdb.votes}
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[#EDEDED] font-mono">
                  {movie.ratingsMatrix.imdb.score}
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#F5C518] h-full rounded-full"
                    style={{ width: `${movie.ratingsMatrix.imdb.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rotten Tomatoes */}
            <div className="frosted-glass rounded-2xl p-5 border border-white/8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#FA320A] text-white font-black text-xs font-mono">
                  ROTTEN TOMATOES
                </span>
                <span className="text-[11px] font-mono text-[#00FFA3]">
                  {movie.ratingsMatrix.rottenTomatoes.status}
                </span>
              </div>
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-[#EDEDED] font-mono">
                    {movie.ratingsMatrix.rottenTomatoes.score}
                  </span>
                  <span className="text-xs text-[#8F9CA8] font-mono">
                    Audience: {movie.ratingsMatrix.rottenTomatoes.audience}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#FA320A] h-full rounded-full"
                    style={{ width: `${movie.ratingsMatrix.rottenTomatoes.score}` }}
                  />
                </div>
              </div>
            </div>

            {/* Metacritic */}
            <div className="frosted-glass rounded-2xl p-5 border border-white/8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#00CE7A] text-[#000000] font-black text-xs font-mono">
                  METACRITIC
                </span>
                <span className="text-[11px] font-mono text-[#8F9CA8]">
                  {movie.ratingsMatrix.metacritic.label}
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[#EDEDED] font-mono">
                  {movie.ratingsMatrix.metacritic.score}
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#00CE7A] h-full rounded-full"
                    style={{ width: `${movie.ratingsMatrix.metacritic.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. WHERE TO WATCH HUB (STRUCTURED 3 TABS) ================= */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/8 pb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-[#00FFA3]" />
              <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-[#EDEDED] font-mono">
                Where to Watch &amp; Download Hub
              </h2>
            </div>

            {/* 3 Structured Tabs */}
            <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#12161C] border border-white/8 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveWatchTab('direct')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeWatchTab === 'direct'
                    ? 'bg-[#1F2733] text-[#00FFA3] font-bold shadow-sm'
                    : 'text-[#8F9CA8] hover:text-[#EDEDED]'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct &amp; Uncensored</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWatchTab('family')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeWatchTab === 'family'
                    ? 'bg-[#1F2733] text-[#00FFA3] font-bold shadow-sm'
                    : 'text-[#8F9CA8] hover:text-[#EDEDED]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Family / Censored</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWatchTab('official')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeWatchTab === 'official'
                    ? 'bg-[#1F2733] text-[#00FFA3] font-bold shadow-sm'
                    : 'text-[#8F9CA8] hover:text-[#EDEDED]'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Official Services</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Direct & Uncensored Streams */}
          {activeWatchTab === 'direct' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs font-mono text-[#8F9CA8] flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" />
                <span>Direct 10 Gbps Edge mirrors with multi-audio, HDR/Dolby Vision &amp; full CC subs</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {movie.whereToWatch.directStreams.map((s) => (
                  <div
                    key={s.id}
                    className="frosted-glass rounded-2xl p-4 md:p-5 border border-white/8 hover:border-white/18 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#00FFA3]/15 text-[#00FFA3] border border-[#00FFA3]/30 font-mono font-bold text-xs">
                          {s.resolution}
                        </span>
                        <span className="text-xs font-mono text-[#EDEDED] font-semibold">
                          {s.format}
                        </span>
                        <span className="text-xs font-mono text-[#8F9CA8]">
                          • {s.size}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8F9CA8]">
                        <span>Audio: <strong className="text-gray-300">{s.audio}</strong></span>
                        <span>•</span>
                        <span>Node: <strong className="text-gray-300">{s.server}</strong></span>
                        <span>•</span>
                        <span className="text-[#00FFA3]">{s.speed}</span>
                      </div>

                      <div className="text-[11px] font-mono text-[#8F9CA8]/70">
                        Subtitles: {s.subtitles.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyStreamLink(s.streamUrl, s.id)}
                        className="px-3 py-2 rounded-xl bg-white/6 hover:bg-white/12 text-[#EDEDED] text-xs font-mono border border-white/10 flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Copy direct stream URL"
                      >
                        {copiedLink === s.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#00FFA3]" />
                            <span className="text-[#00FFA3]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadClick('DirectUncensored', s.resolution, s.size, s.downloadUrl)}
                        className="px-4 py-2 rounded-xl bg-[#00FFA3] text-[#0A0B0E] font-mono font-bold text-xs flex items-center space-x-1.5 hover:bg-[#10E7B2] active:scale-95 transition-all shadow-[0_0_12px_rgba(0,255,163,0.3)] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Direct Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Family / Censored Versions */}
          {activeWatchTab === 'family' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs font-mono text-[#8F9CA8] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
                <span>Sanitized &amp; filtered cuts: Graphic violence or profanity adjusted without story loss</span>
              </div>

              {movie.whereToWatch.familyVersions.map((f) => (
                <div
                  key={f.id}
                  className="frosted-glass rounded-2xl p-5 border border-white/8 hover:border-white/18 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-md bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 font-mono font-bold text-xs">
                        {f.resolution}
                      </span>
                      <h4 className="text-sm font-bold text-[#EDEDED] font-mono">
                        {f.title}
                      </h4>
                      <span className="text-xs font-mono text-[#8F9CA8]">({f.size})</span>
                    </div>

                    <p className="text-xs text-[#8F9CA8] font-sans leading-relaxed">
                      {f.notes}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadClick('FamilyCensored', f.resolution, f.size, f.streamUrl)}
                    className="px-5 py-2.5 rounded-xl bg-[#00FFA3] text-[#0A0B0E] font-mono font-bold text-xs flex items-center space-x-2 hover:bg-[#10E7B2] transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Stream Family Cut</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Official Streaming Services */}
          {activeWatchTab === 'official' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs font-mono text-[#8F9CA8]">
                Direct licensed streaming providers with active distribution rights:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.whereToWatch.officialServices.map((o) => (
                  <div
                    key={o.name}
                    className="frosted-glass rounded-2xl p-5 border border-white/8 hover:border-white/18 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-[#EDEDED]">
                        {o.name}
                      </h4>
                      <p className="text-xs font-mono text-[#00FFA3]">
                        {o.plan}
                      </p>
                      <p className="text-[11px] font-mono text-[#8F9CA8]">
                        Quality: {o.quality}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadClick('OfficialService', o.quality, o.plan, o.url)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#00FFA3] hover:text-[#0A0B0E] text-[#EDEDED] font-mono font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer border border-white/10"
                    >
                      <span>Open Provider</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ================= 4. VIDEO ESSAYS & CRITICAL REVIEWS ================= */}
        <section>
          <div className="flex items-center space-x-2 mb-6 font-mono text-xs text-[#8F9CA8]">
            <Film className="w-4 h-4 text-[#00FFA3]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#EDEDED]">
              Critical Deconstructions &amp; Video Essays
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Essays */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#8F9CA8] uppercase tracking-wider">
                Curated Breakdown Analyses
              </h3>

              {movie.videoEssays.map((v) => (
                <div
                  key={v.youtubeId}
                  className="frosted-glass rounded-2xl p-4 border border-white/8 flex flex-col sm:flex-row gap-4 items-start"
                >
                  <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                      {v.duration}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm font-bold text-[#EDEDED] leading-snug">
                      {v.title}
                    </h4>
                    <p className="text-xs font-mono text-[#00FFA3]">
                      By {v.creator}
                    </p>
                    <p className="text-xs text-[#8F9CA8] font-sans line-clamp-2">
                      {v.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Critical Press Reviews */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-[#8F9CA8] uppercase tracking-wider">
                Critical Consensus
              </h3>

              {movie.criticalReviews.map((r, i) => (
                <div
                  key={i}
                  className="frosted-glass rounded-2xl p-4 md:p-5 border border-white/8 flex flex-col justify-between space-y-3"
                >
                  <p className="text-xs md:text-sm text-[#EDEDED]/90 italic font-sans leading-relaxed">
                    "{r.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/6 text-xs font-mono">
                    <div>
                      <strong className="text-[#EDEDED]">{r.critic}</strong>
                      <span className="text-[#8F9CA8]">, {r.publication}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#00FFA3]/15 text-[#00FFA3] font-bold">
                      {r.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. SIMILAR VIBES RADAR ================= */}
        <section className="pt-6 border-t border-white/8">
          <div className="flex items-center space-x-2 mb-6 font-mono text-xs text-[#8F9CA8]">
            <Sparkles className="w-4 h-4 text-[#FCEE09]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#EDEDED]">
              Similar Vibes Radar (3 Immediate Alternative Picks)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(movie.similarVibesExpanded || []).map((sm) => (
              <div
                key={sm.id}
                onClick={() => {
                  Telemetry.openMovieTab(sm.id, sm.title, 'SimilarVibesRadar');
                  window.open(`/movie/${sm.id}`, '_blank', 'noopener,noreferrer');
                }}
                className="group frosted-glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={sm.backdrop}
                    alt={sm.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161C] via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#00FFA3] font-bold flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{sm.scoreBadge.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-[#EDEDED] truncate mr-2 group-hover:text-[#00FFA3] transition-colors">
                      {sm.title}
                    </h4>
                    <span className="text-xs font-mono text-[#8F9CA8]">{sm.year}</span>
                  </div>

                  <p className="text-xs text-[#8F9CA8] italic line-clamp-2">
                    "{sm.decisionHook}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#00FFA3]">
                    <span>Inspect Hub</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
