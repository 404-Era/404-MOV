import React from 'react';
import type { Movie } from '../types';
import { SpotlightCard } from './SpotlightCard';
import { Sparkles, Flame, Brain, Clock, ShieldCheck } from 'lucide-react';

interface SpotlightGridProps {
  movies: Movie[];
  allMovies: Movie[];
  isLoading: boolean;
  activeFilterCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const SpotlightGrid: React.FC<SpotlightGridProps> = ({
  movies,
  allMovies,
  isLoading,
  activeFilterCount,
  onResetFilters,
  isFiltered
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-10 px-4 space-y-10">
        {[1, 2, 3].map((row) => (
          <div key={row} className="space-y-3">
            <div className="h-5 bg-white/10 rounded w-48 animate-pulse" />
            <div className="flex items-center gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-[155px] aspect-[2/3] rounded-2xl bg-[#141A22]/60 border border-white/6 animate-pulse shrink-0"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Pre-filter catalog into thematic rows for several filled rows
  const adrenalineMovies = allMovies.filter(m => 
    m.vibes.includes('Adrenaline Rush') || m.genres.includes('Action') || m.genres.includes('Thriller')
  );

  const mindBendingMovies = allMovies.filter(m => 
    m.vibes.includes('Mind-Bending') || m.genres.includes('Mystery') || m.genres.includes('Psychological Thriller')
  );

  const miniseriesMovies = allMovies.filter(m => 
    m.durationCategory === 'miniseries' || m.vibes.includes('Dark & Deep')
  );

  const under90Movies = allMovies.filter(m => 
    m.durationCategory === 'under-90' || m.duration.includes('1h 2') || m.duration.includes('1h 3')
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 pb-24 space-y-12">
      {/* ================= DYNAMIC FILTERED ROW (WHEN USER IS SEARCHING/FILTERING) ================= */}
      {isFiltered && (
        <section className="space-y-3 relative">
          {/* Subtle Ambient Row Green Glow */}
          <div className="absolute -left-10 top-0 w-72 h-32 bg-[#00FFA3]/5 blur-3xl pointer-events-none rounded-full" />

          <div className="flex items-center justify-between border-b border-white/8 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
              <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
                Filtered Matches ({movies.length})
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-[#FCEE09] hover:underline cursor-pointer font-sans"
              >
                Reset Filters ({activeFilterCount})
              </button>
            )}
          </div>

          {movies.length > 0 ? (
            /* 
              Generous vertical padding (py-12/py-14) provides breathing room for the 
              hovered card's ~140% scale expansion, preventing vertical clipping by the 
              horizontal overflow container.
            */
            <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
              {movies.map((movie) => (
                <SpotlightCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl apple-liquid-glass text-center max-w-md mx-auto my-6">
              <p className="text-xs text-[#8F9CA8] mb-3">No movies matched this exact query combination.</p>
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-1.5 rounded-full apple-glass-green text-xs cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </section>
      )}

      {/* ================= ROW 1: TOP CURATED SPOTLIGHT ================= */}
      <section className="space-y-3 relative">
        <div className="absolute -left-12 top-0 w-80 h-36 bg-[#00FFA3]/6 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00FFA3]" />
            <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
              Top Curated Spotlight
            </h3>
          </div>
          <span className="text-xs text-[#8F9CA8] font-mono">5 Selections</span>
        </div>

        <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
          {allMovies.slice(0, 5).map((movie) => (
            <SpotlightCard key={`spotlight-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>

      {/* ================= ROW 2: HIGH-OCTANE ADRENALINE RUSH ================= */}
      <section className="space-y-3 relative">
        <div className="absolute -right-12 top-0 w-80 h-36 bg-[#00FFA3]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#FCEE09]" />
            <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
              High-Octane Adrenaline Rush
            </h3>
          </div>
          <span className="text-xs text-[#8F9CA8] font-mono">{adrenalineMovies.length} Selections</span>
        </div>

        <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
          {adrenalineMovies.map((movie) => (
            <SpotlightCard key={`adrenaline-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>

      {/* ================= ROW 3: MIND-BENDING & EXISTENTIAL PUZZLES ================= */}
      <section className="space-y-3 relative">
        <div className="absolute left-1/3 top-0 w-96 h-36 bg-[#00FFA3]/4 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-[#00FFA3]" />
            <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
              Mind-Bending &amp; Psychological Puzzles
            </h3>
          </div>
          <span className="text-xs text-[#8F9CA8] font-mono">{mindBendingMovies.length} Selections</span>
        </div>

        <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
          {mindBendingMovies.map((movie) => (
            <SpotlightCard key={`mindbend-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>

      {/* ================= ROW 4: DARK & DEEP MINISERIES MASTERCLASSES ================= */}
      <section className="space-y-3 relative">
        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
            <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
              Dark &amp; Deep Miniseries Masterclasses
            </h3>
          </div>
          <span className="text-xs text-[#8F9CA8] font-mono">{miniseriesMovies.length} Selections</span>
        </div>

        <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
          {miniseriesMovies.map((movie) => (
            <SpotlightCard key={`miniseries-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>

      {/* ================= ROW 5: FAST & COZY (UNDER 90 MINS) ================= */}
      <section className="space-y-3 relative">
        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#FCEE09]" />
            <h3 className="text-sm font-bold text-[#EDEDED] uppercase tracking-wider font-sans">
              Quick Bites: Under 90 Minutes
            </h3>
          </div>
          <span className="text-xs text-[#8F9CA8] font-mono">{under90Movies.length} Selections</span>
        </div>

        <div className="flex items-center gap-3.5 md:gap-4 overflow-x-auto no-scrollbar py-12 md:py-14 px-4 md:px-8">
          {under90Movies.map((movie) => (
            <SpotlightCard key={`under90-${movie.id}`} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};
