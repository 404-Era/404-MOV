import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import type { DecisionMode } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onExecute: () => void;
  isTyping: boolean;
  onFocusChange: (focused: boolean) => void;
  mode: DecisionMode;
  onModeChange: (m: DecisionMode) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onExecute,
  onFocusChange,
  mode,
  onModeChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-20 relative flex flex-col items-center">
      {/* 1. Apple Liquid Glass Capsule Search Bar */}
      <div className="w-full relative">
        <div className="w-full rounded-full apple-liquid-glass px-5 py-2.5 flex items-center transition-all focus-within:border-white/25">
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, mood, or what you want..."
            className="w-full bg-transparent text-[#EDEDED] placeholder-[#8F9CA8]/70 text-sm md:text-base py-1 px-1 focus:outline-none font-sans"
          />

          {/* Search Icon */}
          <div className="text-[#8F9CA8] px-2 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>

          {/* Apple Luminous Glass Execute Button */}
          <button
            type="button"
            onClick={onExecute}
            className="ml-1 px-6 py-2 rounded-full apple-glass-green text-sm transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95"
          >
            Execute
          </button>
        </div>
      </div>

      {/* 2. Apple Frosted Glass Mode Selector Pills Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 text-xs md:text-sm font-sans">
        <button
          type="button"
          onClick={() => onModeChange('mode1')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            mode === 'mode1'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_16px_rgba(0,255,163,0.3)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Mode 1: Title Search
        </button>

        <button
          type="button"
          onClick={() => onModeChange('mode2')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            mode === 'mode2'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_16px_rgba(0,255,163,0.3)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Mode 2: Vibe &amp; Mood
        </button>

        <button
          type="button"
          onClick={() => onModeChange('mode3')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            mode === 'mode3'
              ? 'bg-[#FCEE09]/15 border border-[#FCEE09] text-[#FCEE09] shadow-[0_0_16px_rgba(252,238,9,0.3)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Mode 3: 404 Brain Not Found
        </button>
      </div>
    </div>
  );
};
