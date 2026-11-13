/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, BookOpen, ExternalLink, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { PARALLEL_ERA_RECORDS } from '../data/mockSanatanData.ts';
import { calculateConvergenceIndex, ConvergenceInsight } from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';

interface LiveConvergenceDialProps {
  onOpenContentReader: (contentId: string) => void;
  onAskOracle: (query: string, eraContext?: string) => void;
}

export const LiveConvergenceDial: React.FC<LiveConvergenceDialProps> = ({
  onOpenContentReader,
  onAskOracle,
}) => {
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(0);
  const [isPlayingAutoTour, setIsPlayingAutoTour] = useState<boolean>(false);
  const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentRecord = PARALLEL_ERA_RECORDS[activeEpochIndex] || PARALLEL_ERA_RECORDS[0];
  const convergenceInsight: ConvergenceInsight = calculateConvergenceIndex(activeEpochIndex);

  // Auto-tour cosmic glide mode
  useEffect(() => {
    if (isPlayingAutoTour) {
      tourIntervalRef.current = setInterval(() => {
        setActiveEpochIndex((prev) => {
          const nextIndex = (prev + 1) % PARALLEL_ERA_RECORDS.length;
          soundEffects.playBell();
          return nextIndex;
        });
      }, 4500);
    } else {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
        tourIntervalRef.current = null;
      }
    }

    return () => {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
      }
    };
  }, [isPlayingAutoTour]);

  const handleSelectEpoch = (index: number) => {
    soundEffects.playPanelSwoosh();
    setActiveEpochIndex(index);
    if (isPlayingAutoTour) {
      setIsPlayingAutoTour(false);
    }
  };

  const handleToggleAutoTour = () => {
    soundEffects.playAstraPulse();
    setIsPlayingAutoTour((prev) => !prev);
  };

  return (
    <div className="bg-stone-950/80 border border-amber-900/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '40s' }} />
            <span>Interactive Parallel Scrubber · त्रिकाल सामंजस्य</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            Live Epoch Dial: Creation to Modern Day
          </h3>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            Slide through 10 eras to watch the Sacred, Scientific, and Archaeological records update in synchronized real time.
          </p>
        </div>

        {/* Tour Control & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAutoTour}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-lg ${
              isPlayingAutoTour
                ? 'bg-amber-500 text-stone-950 shadow-amber-500/20'
                : 'bg-stone-900 border border-amber-500/30 text-amber-300 hover:bg-stone-800'
            }`}
          >
            {isPlayingAutoTour ? (
              <>
                <Pause className="w-4 h-4 fill-stone-950" />
                <span>Pause Auto-Tour</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-amber-300" />
                <span>Cosmic Auto-Tour</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSelectEpoch(0)}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
            title="Reset to Cosmic Origins"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fluid Epoch Scrubber Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
          <span>EPOCH {activeEpochIndex + 1} OF {PARALLEL_ERA_RECORDS.length}</span>
          <span className="text-amber-300 font-semibold">{currentRecord.era.name}</span>
          <span className="text-stone-500">{currentRecord.era.sanskritName}</span>
        </div>

        {/* Custom Slider Input */}
        <input
          type="range"
          min={0}
          max={PARALLEL_ERA_RECORDS.length - 1}
          value={activeEpochIndex}
          onChange={(e) => handleSelectEpoch(Number(e.target.value))}
          className="w-full h-2.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500 transition focus:outline-none border border-stone-800"
        />

        {/* Epoch Quick-Jump Badges */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mt-3">
          {PARALLEL_ERA_RECORDS.map((rec, idx) => {
            const isSelected = idx === activeEpochIndex;
            return (
              <button
                key={rec.era.id}
                onClick={() => handleSelectEpoch(idx)}
                className={`text-[11px] py-1.5 px-1 rounded-lg border text-center transition truncate font-mono ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/40'
                    : 'bg-stone-900/50 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
                title={rec.era.name}
              >
                {idx + 1}. {rec.era.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized 3-Column Holographic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        
        {/* Lens 1: Sacred Point of View */}
        <div className="p-5 rounded-xl bg-orange-950/20 border border-orange-500/30 backdrop-blur-sm relative flex flex-col justify-between group hover:border-orange-500/50 transition">
          <div className="absolute top-3 right-3 text-orange-400/40 group-hover:text-orange-400 transition font-serif text-lg">
            🕉️
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-orange-400 mb-1">
              Sacred Point of View
            </div>
            <h4 className="text-lg font-serif font-bold text-stone-100 mb-2">
              {currentRecord.sacredPointOfView.title}
            </h4>
            <div className="text-xs font-mono text-orange-300/80 mb-3">
              {currentRecord.sacredPointOfView.traditionalDate}
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
              {currentRecord.sacredPointOfView.summary}
            </p>
          </div>
          <div className="border-t border-orange-900/40 pt-3 text-[11px] text-orange-200/70 font-mono">
            Source: {currentRecord.sacredPointOfView.sources[0]?.title || 'Puranas & Samhitas'}
          </div>
        </div>

        {/* Lens 2: Scientific / Cosmological Point of View */}
        <div className="p-5 rounded-xl bg-sky-950/20 border border-sky-500/30 backdrop-blur-sm relative flex flex-col justify-between group hover:border-sky-500/50 transition">
          <div className="absolute top-3 right-3 text-sky-400/40 group-hover:text-sky-400 transition font-serif text-lg">
            🔬
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-sky-400 mb-1">
              Scientific & Cosmological
            </div>
            <h4 className="text-lg font-serif font-bold text-stone-100 mb-2">
              {currentRecord.scientificPointOfView.title}
            </h4>
            <div className="text-xs font-mono text-sky-300/80 mb-3">
              {currentRecord.scientificPointOfView.historicalDateRange || 'Cosmic Antiquity'}
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
              {currentRecord.scientificPointOfView.summary}
            </p>
          </div>
          <div className="border-t border-sky-900/40 pt-3 text-[11px] text-sky-200/70 font-mono">
            Method: Astrophysics, Radiometric Zircon Dating & Satellite Radar
          </div>
        </div>

        {/* Lens 3: Historical & Epigraphic Point of View */}
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-sm relative flex flex-col justify-between group hover:border-emerald-500/50 transition">
          <div className="absolute top-3 right-3 text-emerald-400/40 group-hover:text-emerald-400 transition font-serif text-lg">
            📜
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-emerald-400 mb-1">
              Historical & Archaeological
            </div>
            <h4 className="text-lg font-serif font-bold text-stone-100 mb-2">
              {currentRecord.historicalPointOfView.title}
            </h4>
            <div className="text-xs font-mono text-emerald-300/80 mb-3">
              {currentRecord.historicalPointOfView.historicalDateRange || 'Archaeologically Grounded'}
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
              {currentRecord.historicalPointOfView.summary}
            </p>
          </div>
          <div className="border-t border-emerald-900/40 pt-3 text-[11px] text-emerald-200/70 font-mono">
            Evidence: {currentRecord.historicalPointOfView.evidenceLabel}
          </div>
        </div>

      </div>

      {/* Convergence Synthesis Banner & Direct Publishing Action */}
      <div className="bg-gradient-to-r from-amber-950/40 via-stone-900/90 to-amber-950/40 border border-amber-500/30 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Harmonic Rating & Synthesis Insight */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {convergenceInsight.percentageHarmonic}% HARMONIC CONCORDANCE
            </span>
            <span className="text-xs text-stone-400 font-serif">
              {convergenceInsight.convergenceStatus}
            </span>
          </div>

          <p className="text-sm text-stone-200 leading-relaxed italic">
            "{convergenceInsight.coreInsight}"
          </p>
        </div>

        {/* Right: Published Content Card & Direct Launch */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onAskOracle(
              `Explain the convergence between sacred and scientific views in ${currentRecord.era.name}`,
              currentRecord.era.name
            )}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:text-amber-300 hover:border-amber-500/40 transition text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Consult AI Oracle</span>
          </button>

          <button
            onClick={() => onOpenContentReader(currentRecord.publishedContent.id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read: {currentRecord.publishedContent.title.split('Episode')[0].split(':')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
