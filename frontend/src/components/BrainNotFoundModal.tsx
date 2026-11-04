import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Dices, ArrowRight, RefreshCw, Star } from 'lucide-react';
import type { Movie } from '../types';
import { fetchMovieRoulette } from '../services/api';
import { Telemetry } from '../services/telemetry';

interface BrainNotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrainNotFoundModal: React.FC<BrainNotFoundModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'roulette' | 'wizard'>('roulette');
  const [rolling, setRolling] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Wizard state
  const [energy, setEnergy] = useState<string>('high');
  const [time, setTime] = useState<string>('any');
  const [flavor, setFlavor] = useState<string>('dark');

  useEffect(() => {
    if (isOpen) {
      triggerRoulette();
    }
  }, [isOpen]);

  const triggerRoulette = async (overrideVibe?: string) => {
    setRolling(true);
    Telemetry.rouletteTrigger(overrideVibe);

    try {
      const cure = await fetchMovieRoulette(overrideVibe);
      // Brief glitch delay for dramatic cyberpunk reveal
      setTimeout(() => {
        setSelectedMovie(cure);
        setRolling(false);
      }, 600);
    } catch {
      setRolling(false);
    }
  };

  const handleFinishWizard = () => {
    let vibe = 'Mind-Bending';
    if (energy === 'high') vibe = 'Adrenaline Rush';
    else if (energy === 'chill') vibe = 'Cozy & Light';
    else if (flavor === 'dark') vibe = 'Dark & Deep';

    triggerRoulette(vibe);
    setStep('roulette');
  };

  const handleOpenMovieTab = (movie: Movie) => {
    Telemetry.openMovieTab(movie.id, movie.title, 'Mode3BrainNotFoundModal');
    window.open(`/movie/${movie.id}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F1217] border border-white/14 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Cyberpunk Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FCEE09] via-[#00FFA3] to-[#FCEE09]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCEE09] animate-ping" />
            <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-[#FCEE09]">
              Mode 3: 404 Brain Not Found Protocol
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg bg-white/6 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setStep('roulette')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  step === 'roulette' ? 'bg-[#182128] text-[#00FFA3] font-bold' : 'text-[#8F9CA8]'
                }`}
              >
                Instant Cure
              </button>
              <button
                type="button"
                onClick={() => setStep('wizard')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  step === 'wizard' ? 'bg-[#182128] text-[#00FFA3] font-bold' : 'text-[#8F9CA8]'
                }`}
              >
                3-Click Triage
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8F9CA8] hover:text-[#EDEDED] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {step === 'roulette' ? (
          <div className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#EDEDED] mb-2 font-['Orbitron',sans-serif]">
                Analysis Paralysis Terminated.
              </h2>
              <p className="text-xs md:text-sm text-[#8F9CA8]">
                Stop browsing 400 titles. Here is your definitive, uncompromising cure:
              </p>
            </div>

            {rolling || !selectedMovie ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-[#00FFA3] animate-spin" />
                <span className="font-mono text-xs text-[#8F9CA8] tracking-widest uppercase">
                  CALIBRATING ALGORITHMIC SELECTION...
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-[#161B22] border border-white/12 p-4 md:p-5 flex flex-col md:flex-row gap-5 items-center">
                {/* Poster Preview */}
                <div className="w-36 md:w-44 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#8F9CA8] mb-1">
                      <span className="text-[#00FFA3] font-bold flex items-center space-x-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{selectedMovie.scoreBadge.toFixed(1)}</span>
                      </span>
                      <span>•</span>
                      <span>{selectedMovie.year}</span>
                      <span>•</span>
                      <span>{selectedMovie.duration}</span>
                      <span>•</span>
                      <span className="px-1 rounded bg-white/10 text-[10px]">{selectedMovie.rating}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-[#EDEDED]">
                      {selectedMovie.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedMovie.genres.map((g) => (
                        <span key={g} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/6 text-[#8F9CA8]">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                    <p className="text-xs text-[#EDEDED]/90 italic font-sans leading-relaxed">
                      "{selectedMovie.decisionHook}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMovieTab(selectedMovie)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#00FFA3] text-[#0A0B0E] font-mono font-bold text-xs md:text-sm flex items-center justify-center space-x-2 hover:bg-[#10E7B2] transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,255,163,0.3)]"
                    >
                      <span>Where to Watch & Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerRoulette()}
                      title="Roll another cure"
                      className="p-2.5 rounded-xl bg-white/8 hover:bg-white/14 text-[#EDEDED] border border-white/10 transition-colors cursor-pointer"
                    >
                      <Dices className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 3-Question Vibe Wizard */
          <div className="pt-6 space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-[#EDEDED] font-['Orbitron',sans-serif]">
                3-Step Rapid Vibe Triage
              </h2>
              <p className="text-xs text-[#8F9CA8]">
                Answer 3 quick micro-questions to lock down your exact craving.
              </p>
            </div>

            {/* Q1: Energy Level */}
            <div>
              <label className="block text-xs font-mono text-[#8F9CA8] mb-2">
                1. What is your current mental energy level?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'high', label: '⚡ High Octane Rush' },
                  { id: 'focus', label: '🧠 Deep Mindbender' },
                  { id: 'chill', label: '🛋️ Low Energy Cozy' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setEnergy(opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      energy === opt.id
                        ? 'bg-[#182128] border-[#00FFA3] text-[#00FFA3] font-bold'
                        : 'bg-white/4 border-white/8 text-[#8F9CA8] hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Time Window */}
            <div>
              <label className="block text-xs font-mono text-[#8F9CA8] mb-2">
                2. How much time are you willing to invest tonight?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'under-90', label: '⏱️ Under 90 mins' },
                  { id: '2h', label: '🎬 Standard 2 Hours' },
                  { id: 'any', label: '🍿 Mini Binge Series' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTime(opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      time === opt.id
                        ? 'bg-[#182128] border-[#00FFA3] text-[#00FFA3] font-bold'
                        : 'bg-white/4 border-white/8 text-[#8F9CA8] hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Flavor Tone */}
            <div>
              <label className="block text-xs font-mono text-[#8F9CA8] mb-2">
                3. What tonal flavor are you in the mood for?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'dark', label: '🌑 Dark, Dystopian & Cynical' },
                  { id: 'light', label: '✨ Clever, Sharp & Refreshing' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFlavor(opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      flavor === opt.id
                        ? 'bg-[#182128] border-[#00FFA3] text-[#00FFA3] font-bold'
                        : 'bg-white/4 border-white/8 text-[#8F9CA8] hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wizard Submit */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishWizard}
                className="w-full py-3 rounded-xl bg-[#00FFA3] text-[#0A0B0E] font-mono font-bold text-sm flex items-center justify-center space-x-2 hover:bg-[#10E7B2] transition-colors cursor-pointer shadow-[0_0_18px_rgba(0,255,163,0.35)]"
              >
                <span>Diagnose & Deliver My 1 Movie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
