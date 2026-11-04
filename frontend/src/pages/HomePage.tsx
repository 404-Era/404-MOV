import React, { useState, useEffect, useCallback } from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { HeroVideoBackdrop } from '../components/HeroVideoBackdrop';
import { SearchBar } from '../components/SearchBar';
import { RapidSelectorPills } from '../components/RapidSelectorPills';
import { SpotlightGrid } from '../components/SpotlightGrid';
import { BrainNotFoundModal } from '../components/BrainNotFoundModal';
import { WatchlistDrawer } from '../components/WatchlistDrawer';
import { TelemetryDrawer } from '../components/TelemetryDrawer';
import type { Movie, DecisionMode } from '../types';
import { fetchMovies } from '../services/api';
import { Telemetry } from '../services/telemetry';
import { getWatchlist } from '../services/watchlist';
import { FALLBACK_MOVIES } from '../services/fallbackData';
import { Bookmark } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<DecisionMode>('mode2');
  const [duration, setDuration] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>(FALLBACK_MOVIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Drawers & Modals
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Update watchlist count
  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };
    updateCount();
    window.addEventListener('404mov_watchlist_updated', updateCount);
    return () => window.removeEventListener('404mov_watchlist_updated', updateCount);
  }, []);

  // Fetch full catalog for all rows on mount
  useEffect(() => {
    fetchMovies({ limit: 20 }).then((res) => {
      if (res && res.length > 0) {
        setAllMovies(res);
      }
    });
  }, []);

  // Is user actively searching or filtering?
  const isFiltered = Boolean((query && query.trim()) || duration || vibe);

  // Search execution helper
  const executeSearch = useCallback(async (
    targetQuery = query,
    targetMode = mode,
    targetDuration = duration,
    targetVibe = vibe
  ) => {
    setIsLoading(true);

    try {
      const results = await fetchMovies({
        q: targetQuery,
        mode: targetMode,
        duration: targetDuration,
        vibe: targetVibe,
        limit: 10
      });

      setMovies(results);
      Telemetry.searchQuery(targetQuery, targetMode, results.length);
    } catch (err) {
      console.error('Search execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, mode, duration, vibe]);

  // Initial load
  useEffect(() => {
    executeSearch('', 'mode2', null, null);
  }, []);

  // Mode change handler
  const handleModeChange = (newMode: DecisionMode) => {
    setMode(newMode);
    if (newMode === 'mode3') {
      setIsBrainModalOpen(true);
    } else {
      executeSearch(query, newMode, duration, vibe);
    }
  };

  const handleDurationSelect = (newDur: string | null) => {
    setDuration(newDur);
    executeSearch(query, mode, newDur, vibe);
  };

  const handleVibeSelect = (newVibe: string | null) => {
    setVibe(newVibe);
    executeSearch(query, mode, duration, newVibe);
  };

  const handleResetFilters = () => {
    setQuery('');
    setDuration(null);
    setVibe(null);
    setMode('mode2');
    executeSearch('', 'mode2', null, null);
  };

  const activeFilterCount = (duration ? 1 : 0) + (vibe ? 1 : 0) + (query ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#EDEDED] relative selection:bg-[#00FFA3] selection:text-[#0A0B0E]">
      {/* Background grain */}
      <div className="cyber-noise" />

      {/* Top Ambient Green Aura (Light-green ambient glow throughout site - NOT plain black) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-[#00FFA3]/8 blur-[130px] pointer-events-none rounded-full z-0" />
      <div className="fixed top-1/3 -left-40 w-[500px] h-[400px] bg-[#00FFA3]/4 blur-[120px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-1/4 -right-40 w-[600px] h-[500px] bg-[#10E7B2]/4 blur-[140px] pointer-events-none rounded-full z-0" />

      {/* 1. Pure Vector Cyberpunk 404MOV Logo (Infinite Crisp Resolution) */}
      <BrandLogo onClick={handleResetFilters} />

      {/* Top-Right Header: Apple Frosted Glass Watchlist Pill & Avatar */}
      <div className="fixed top-5 right-7 z-40 flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setIsWatchlistOpen(true)}
          className="px-4 py-2 rounded-full apple-glass-pill text-xs font-sans text-[#EDEDED] flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
          title="Open Watchlist"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#00FFA3]" />
          <span>Watchlist</span>
          {watchlistCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#00FFA3] text-[#0A0B0E] font-bold text-[10px] ml-1">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Character Avatar */}
        <div 
          onClick={() => setIsWatchlistOpen(true)}
          className="w-9 h-9 rounded-full overflow-hidden border border-white/16 shadow-lg cursor-pointer hover:border-[#00FFA3] transition-colors"
          title="Profile & Watchlist"
        >
          <img
            src="/assets/avatar.png"
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <main className="pt-16 md:pt-20 px-4 flex flex-col items-center relative z-20">
        {/* ================= HERO SEARCH SECTION (UNIFIED CYBERPUNK CONSOLE) ================= */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
          {/* 1. Seamless Character Video: Emerge naturally integrated directly above search console */}
          <div className="w-full flex justify-center items-center pointer-events-none select-none z-10 bg-transparent border-0 outline-none shadow-none -mb-3 sm:-mb-4">
            <HeroVideoBackdrop isTyping={isTyping} />
          </div>

          {/* 2. Search Bar: Positioned at character's console with Apple Liquid Glass styling */}
          <div className="w-full relative z-20">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onExecute={() => executeSearch()}
              isTyping={isTyping}
              onFocusChange={setIsTyping}
              mode={mode}
              onModeChange={handleModeChange}
            />
          </div>

          {/* 3. Rapid Selector 3-click pills & Solve My 404 underneath */}
          <div className="w-full relative z-20 mt-3.5">
            <RapidSelectorPills
              duration={duration}
              onDurationSelect={handleDurationSelect}
              vibe={vibe}
              onVibeSelect={handleVibeSelect}
              onSolve={() => executeSearch()}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 4. Multiple Curated Video Shelves / Rows */}
        <SpotlightGrid
          movies={movies}
          allMovies={allMovies}
          isLoading={isLoading}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      </main>

      {/* Mode 3: 404 Brain Not Found Modal */}
      <BrainNotFoundModal
        isOpen={isBrainModalOpen}
        onClose={() => setIsBrainModalOpen(false)}
      />

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />

      {/* Telemetry Live Feed Drawer */}
      <TelemetryDrawer />
    </div>
  );
};
