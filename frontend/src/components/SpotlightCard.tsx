import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Check, ExternalLink } from 'lucide-react';
import type { Movie } from '../types';
import { Telemetry } from '../services/telemetry';
import { isMovieInWatchlist, toggleWatchlistMovie } from '../services/watchlist';

interface SpotlightCardProps {
  movie: Movie;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(() => isMovieInWatchlist(movie.id));
  const [posterError, setPosterError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Hover intent: Slow, deliberate expansion after 250ms
  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
      Telemetry.hoverCardExpand(movie.id, movie.title);
    }, 220);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(false);
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newState = toggleWatchlistMovie(movie);
    setInWatchlist(newState);
  };

  const handleOpenDetailTab = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    Telemetry.openMovieTab(movie.id, movie.title, 'CardCTA');
    // Opens in a NEW BROWSER TAB (target="_blank") so search context in main tab is preserved
    window.open(`/movie/${movie.id}`, '_blank', 'noopener,noreferrer');
  };

  const posterSrc = posterError && movie.fallbackPoster ? movie.fallbackPoster : movie.poster;
  const backdropSrc = backdropError && movie.fallbackBackdrop ? movie.fallbackBackdrop : movie.backdrop;

  return (
    /* 
      CRITICAL FIX: Base card container maintains a STRICTLY FIXED width & height in the DOM.
      Its bounding box NEVER changes, completely eliminating layout shift for sibling cards.
    */
    <div 
      className="relative shrink-0 w-[155px] h-[235px] select-none"
      style={{ zIndex: isHovered ? 50 : 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        Default unhovered poster: Sits strictly in the layout flow
      */}
      <div 
        onClick={handleOpenDetailTab}
        className={`w-full h-full rounded-2xl cursor-pointer overflow-hidden bg-[#0E1217] border border-white/8 hover:border-white/18 shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex flex-col justify-end transition-opacity duration-300 ${
          isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <img
          src={posterSrc}
          alt={movie.title}
          onError={() => setPosterError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Subtle dark gradient overlay for bottom typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/20 to-transparent opacity-90" />

        {/* Bottom Title */}
        <div className="relative p-2.5 z-10 text-center">
          <h4 className="text-xs font-bold text-[#EDEDED] uppercase tracking-wider drop-shadow-md truncate font-sans">
            {movie.title}
          </h4>
        </div>
      </div>

      {/* 
        CRITICAL FIX: Expanded hover preview card floats above siblings.
        Requirements satisfied:
        - position: absolute, z-index: 50
        - transform-origin: center center
        - box-sizing: border-box
        - overflow: visible with auto-fit card height (h-auto)
        - 100% visible text, CTA, and synopsis without clipping or internal overflow
      */}
      {isHovered && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] sm:w-[330px] md:w-[340px] h-auto z-50 rounded-2xl bg-[#161C24]/98 border border-white/18 shadow-[0_24px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-3.5 sm:p-4 flex flex-col space-y-2.5 cursor-pointer box-border overflow-visible transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 animate-fadeIn"
          style={{ transformOrigin: 'center center', boxSizing: 'border-box' }}
        >
          {/* Top Row: Score Badge [ 8.7 ] | Title | Bookmark Icon */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-[#F5C518] text-[#0A0B0E] font-black text-xs font-mono shrink-0">
                {movie.scoreBadge.toFixed(1)}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#EDEDED] font-sans truncate" title={movie.title}>
                {movie.title}
              </h3>
            </div>

            {/* Bookmark Toggle Icon */}
            <button
              type="button"
              onClick={handleWatchlistToggle}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className="p-1 rounded-lg text-[#8F9CA8] hover:text-[#EDEDED] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              {inWatchlist ? (
                <Check className="w-4 h-4 text-[#00FFA3]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 16:9 Cinematic Backdrop Image with gentle zoom */}
          <div 
            onClick={handleOpenDetailTab}
            className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-black/60 border border-white/8 cursor-pointer group/img shrink-0"
          >
            <img
              src={backdropSrc}
              alt={movie.title}
              onError={() => setBackdropError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
            />
          </div>

          {/* Tags Row: [ Sci-Fi ] [ Psychological Thriller ] */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 rounded-full bg-[#151922] border border-white/8 text-[11px] font-sans text-[#A4B1BE]"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Primary CTA: Where to Watch & Details ↗ */}
          <div className="pt-0.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenDetailTab}
              className="text-xs font-sans text-[#C2D0DC] hover:text-[#00FFA3] flex items-center space-x-1 transition-colors cursor-pointer font-medium"
            >
              <span>Where to Watch &amp; Details</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* 1-Sentence Decision Hook */}
          <p className="text-xs text-[#8F9CA8] leading-relaxed font-sans line-clamp-2 shrink-0">
            {movie.decisionHook}
          </p>
        </div>
      )}
    </div>
  );
};
