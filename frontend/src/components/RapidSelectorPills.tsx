import React from 'react';
import { Telemetry } from '../services/telemetry';

interface RapidSelectorProps {
  duration: string | null;
  onDurationSelect: (dur: string | null) => void;
  vibe: string | null;
  onVibeSelect: (vibe: string | null) => void;
  onSolve: () => void;
  isLoading: boolean;
}

export const RapidSelectorPills: React.FC<RapidSelectorProps> = ({
  duration,
  onDurationSelect,
  vibe,
  onVibeSelect,
  onSolve,
  isLoading
}) => {
  const handleDurationClick = (id: string) => {
    const nextVal = duration === id ? null : id;
    onDurationSelect(nextVal);
    Telemetry.filterSelect('duration', nextVal || 'none', { duration: nextVal, vibe });
  };

  const handleVibeClick = (id: string) => {
    const nextVal = vibe === id ? null : id;
    onVibeSelect(nextVal);
    Telemetry.filterSelect('vibe', nextVal || 'none', { duration, vibe: nextVal });
  };

  const handleSolveClick = () => {
    Telemetry.filterSelect('action_button', 'Solve My 404', { duration, vibe });
    onSolve();
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-3 px-2 select-none flex justify-center">
      {/* Rapid Selector Pills: Apple Frosted Glass Style */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm">
        {/* Under 90 mins */}
        <button
          type="button"
          onClick={() => handleDurationClick('under-90')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            duration === 'under-90'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.25)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Under 90 mins
        </button>

        {/* 2h Standard */}
        <button
          type="button"
          onClick={() => handleDurationClick('2h-standard')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            duration === '2h-standard'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.25)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          2h Standard
        </button>

        {/* Miniseries */}
        <button
          type="button"
          onClick={() => handleDurationClick('miniseries')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            duration === 'miniseries'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.25)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Miniseries
        </button>

        {/* Adrenaline Rush */}
        <button
          type="button"
          onClick={() => handleVibeClick('Adrenaline Rush')}
          className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
            vibe === 'Adrenaline Rush'
              ? 'bg-[#00FFA3]/15 border border-[#00FFA3] text-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.25)] font-semibold'
              : 'apple-glass-pill text-[#8F9CA8] hover:text-[#EDEDED]'
          }`}
        >
          Adrenaline Rush
        </button>

        {/* Solve My 404 Glowing Apple Glass Pill Button */}
        <button
          type="button"
          onClick={handleSolveClick}
          disabled={isLoading}
          className="ml-1 px-5 py-1.5 rounded-full apple-glass-green text-xs md:text-sm tracking-normal cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Calibrating...' : 'Solve My 404'}
        </button>
      </div>
    </div>
  );
};
