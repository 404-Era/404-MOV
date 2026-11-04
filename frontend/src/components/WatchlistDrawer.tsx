import React, { useState, useEffect } from 'react';
import { Bookmark, X, ExternalLink, Trash2, Star } from 'lucide-react';
import type { Movie } from '../types';
import { getWatchlist, toggleWatchlistMovie } from '../services/watchlist';
import { Telemetry } from '../services/telemetry';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({ isOpen, onClose }) => {
  const [list, setList] = useState<Movie[]>(() => getWatchlist());

  useEffect(() => {
    const handleUpdate = () => {
      setList(getWatchlist());
    };

    window.addEventListener('404mov_watchlist_updated', handleUpdate);
    return () => window.removeEventListener('404mov_watchlist_updated', handleUpdate);
  }, []);

  const handleRemove = (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlistMovie(movie);
    setList(getWatchlist());
  };

  const handleOpenMovie = (movie: Movie) => {
    Telemetry.openMovieTab(movie.id, movie.title, 'WatchlistDrawer');
    window.open(`/movie/${movie.id}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0F1217] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/8">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-[#00FFA3]" />
              <h3 className="font-mono font-bold text-sm text-[#EDEDED] uppercase tracking-wider">
                Saved Watchlist ({list.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-[#8F9CA8] hover:text-[#EDEDED] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List items */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {list.length === 0 ? (
              <div className="py-16 text-center text-[#8F9CA8] text-xs font-mono">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <span>NO SAVED MOVIES YET</span>
                <p className="mt-1 text-[11px] text-[#8F9CA8]/60">
                  Click the bookmark icon on any card to save it for quick reference.
                </p>
              </div>
            ) : (
              list.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMovie(m)}
                  className="group p-2.5 rounded-xl bg-[#161B22] border border-white/8 hover:border-white/20 transition-all cursor-pointer flex items-center space-x-3"
                >
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="w-12 h-16 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#EDEDED] truncate group-hover:text-[#00FFA3] transition-colors">
                      {m.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8F9CA8] mt-0.5">
                      <span>{m.year}</span>
                      <span>•</span>
                      <span className="flex items-center text-[#00FFA3]">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {m.scoreBadge.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleRemove(m, e)}
                      title="Remove"
                      className="p-1.5 rounded-lg text-[#8F9CA8] hover:text-red-400 hover:bg-white/6 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ExternalLink className="w-4 h-4 text-[#8F9CA8] group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/8 text-center text-[10px] font-mono text-[#8F9CA8]">
          <span>Saved in LocalStorage • Zero Account Required</span>
        </div>
      </div>
    </div>
  );
};
