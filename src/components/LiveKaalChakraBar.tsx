/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Compass, Info, ChevronRight, X, Volume2 } from 'lucide-react';
import { calculateKaalChakraCoordinates, KaalChakraCoordinates } from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';

interface LiveKaalChakraBarProps {
  onExploreTimeline: () => void;
  onOpenOraclePrompt?: (promptText: string) => void;
}

export const LiveKaalChakraBar: React.FC<LiveKaalChakraBarProps> = ({
  onExploreTimeline,
  onOpenOraclePrompt
}) => {
  const [coords, setCoords] = useState<KaalChakraCoordinates>(() => calculateKaalChakraCoordinates());
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState<boolean>(false);
  const [liveSeconds, setLiveSeconds] = useState<number>(() => new Date().getSeconds());

  // Real-time tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCoords(calculateKaalChakraCoordinates(now));
      setLiveSeconds(now.getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnitClick = (unitName: string, promptQuery?: string) => {
    soundEffects.playAstraPulse();
    if (promptQuery && onOpenOraclePrompt) {
      onOpenOraclePrompt(promptQuery);
    }
  };

  const handleOpenMatrix = () => {
    soundEffects.playBell();
    setIsMatrixModalOpen(true);
  };

  return (
    <>
      {/* Ticking Live Cosmic Ribbon */}
      <section className="relative z-20 bg-stone-950/90 border-y border-amber-900/30 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Left: Live Harmonic Beacon & Current Cosmic Coordinate */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono tracking-wider font-semibold text-[11px] sm:text-xs uppercase">
                Kaal Chakra Live · 432 Hz
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-stone-300">
              <span className="text-amber-400 font-serif">श्वेतवाराह कल्प</span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400">Day 1 of Brahma's 51st Year</span>
              <span className="text-stone-600">|</span>
              <span className="text-amber-200">Vaivasvata Manvantara (7 of 14)</span>
            </div>
          </div>

          {/* Center: Kali Yuga Progress Tracker */}
          <div className="flex items-center gap-3 bg-stone-900/80 px-3 py-1 rounded-md border border-stone-800">
            <div className="flex items-center gap-1.5 text-orange-400">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '60s' }} />
              <span className="font-semibold text-stone-200 font-serif">KALI YUGA</span>
              <span className="text-stone-400 font-mono text-xs">
                Year {coords.kaliYugaElapsedYears.toLocaleString()} / 432,000
              </span>
            </div>

            {/* Visual Micro Progress Bar */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 sm:w-28 bg-stone-950 rounded-full h-1.5 overflow-hidden border border-amber-900/40">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                  style={{ width: `${Math.max(1.5, coords.kaliYugaPercentElapsed * 10)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-amber-400/80">
                {coords.kaliYugaPercentElapsed}%
              </span>
            </div>
          </div>

          {/* Right: Current Muhurta & Deep Matrix Trigger */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <button
              onClick={() => handleUnitClick(coords.currentMuhurta.name, `Explain ${coords.currentMuhurta.name} in Vedic astronomy`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900/90 border border-stone-700/60 hover:border-amber-500/50 hover:bg-stone-800 transition text-stone-200 group text-xs"
              title={coords.currentMuhurta.significance}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="font-medium text-amber-300">{coords.currentMuhurta.name}</span>
              <span className="text-stone-500 hidden sm:inline">({coords.currentMuhurta.window})</span>
            </button>

            <button
              onClick={handleOpenMatrix}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-medium transition text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cosmic Scale</span>
              <Info className="w-3 h-3 text-amber-400/70" />
            </button>
          </div>
        </div>
      </section>

      {/* Cosmic Scale & Fractal Time Matrix Modal */}
      {isMatrixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-950 border border-amber-900/50 rounded-xl p-6 sm:p-8 shadow-2xl text-stone-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>The Hindu Fractal Physics of Time · काल चक्र</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 mt-1">
                  From the Microscopic Truti to the 311 Trillion-Year Mahakalpa
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  Surya Siddhanta & Vishnu Purana define time from atomic duration to the expansion and contraction of universes.
                </p>
              </div>

              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Real-Time Live Cosmic Coordinate Card */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-500/30 mb-6">
              <div className="text-xs uppercase font-mono text-amber-400 tracking-wider mb-2">
                Current Universal Coordinate (Year {coords.currentGregorianYear} CE)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-stone-950/70 p-2.5 rounded border border-stone-800">
                  <div className="text-[11px] text-stone-400">Kalpa (Day of Brahma)</div>
                  <div className="font-semibold text-amber-300 font-serif">Shweta Varaha</div>
                  <div className="text-[10px] text-stone-500">Day 1 of 51st Brahma Year</div>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded border border-stone-800">
                  <div className="text-[11px] text-stone-400">Manvantara</div>
                  <div className="font-semibold text-amber-300 font-serif">Vaivasvata (7th)</div>
                  <div className="text-[10px] text-stone-500">7 of 14 Manvantaras</div>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded border border-stone-800">
                  <div className="text-[11px] text-stone-400">Yuga Cycle</div>
                  <div className="font-semibold text-orange-400 font-serif">Kali Yuga (Pada 1)</div>
                  <div className="text-[10px] text-stone-500">Year {coords.kaliYugaElapsedYears} elapsed</div>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded border border-stone-800">
                  <div className="text-[11px] text-stone-400">Active Muhurta</div>
                  <div className="font-semibold text-emerald-300 font-serif">{coords.currentMuhurta.name}</div>
                  <div className="text-[10px] text-stone-500">{coords.currentMuhurta.window}</div>
                </div>
              </div>
            </div>

            {/* Microscopic to Macroscopic Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Microscopic Units (Sub-Second to Daily) */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-2">
                  <span>1. Microscopic Units (अणु काल)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-200">1 Truti (त्रुटि)</span>
                      <p className="text-[11px] text-stone-400">Atomic slice; piercing of a lotus petal</p>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">29.62 microseconds</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-200">1 Nimesha (निमेष)</span>
                      <p className="text-[11px] text-stone-400">Natural blink of an eye (16/75 sec)</p>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">0.213 seconds</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-200">1 Kashtha (काष्ठा)</span>
                      <p className="text-[11px] text-stone-400">18 Nimeshas</p>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">3.2 seconds</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-200">1 Muhurta (मुहूर्त)</span>
                      <p className="text-[11px] text-stone-400">30 Kalas = 2 Nadikas</p>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">48 minutes</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-200">1 Ahoratra (अहोरात्र)</span>
                      <p className="text-[11px] text-stone-400">30 Muhurtas (One day and night)</p>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">24 solar hours</span>
                  </div>
                </div>
              </div>

              {/* Cosmic Units (Yugas, Kalpas & Mahakalpas) */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-2">
                  <span>2. Macroscopic Cosmic Units (महाकाल)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-orange-300">Kali Yuga (कलियुग)</span>
                      <p className="text-[11px] text-stone-400">Age of strife; 1,200 divine years</p>
                    </div>
                    <span className="font-mono text-amber-400 text-[11px]">432,000 solar years</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-orange-300">1 Mahayuga (चतुर्युग)</span>
                      <p className="text-[11px] text-stone-400">Satya (4) + Treta (3) + Dvapara (2) + Kali (1)</p>
                    </div>
                    <span className="font-mono text-amber-400 text-[11px]">4,320,000 solar years</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-orange-300">1 Manvantara (मन्वन्तर)</span>
                      <p className="text-[11px] text-stone-400">71 Mahayugas + Sandhya epoch</p>
                    </div>
                    <span className="font-mono text-amber-400 text-[11px]">306,720,000 solar years</span>
                  </div>

                  <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/40 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-amber-300">1 Kalpa (कल्प · 1 Day of Brahma)</span>
                      <p className="text-[11px] text-stone-300">1,000 Mahayugas = Modern Geological Age of Earth (4.54 Ga)</p>
                    </div>
                    <span className="font-mono text-emerald-300 text-[11px] font-bold">4.32 Billion Years</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="font-serif font-semibold text-purple-300">1 Mahakalpa (महाकल्प)</span>
                      <p className="text-[11px] text-stone-400">100 Years of Brahma (Lifespan of universal cosmos)</p>
                    </div>
                    <span className="font-mono text-purple-300 text-[11px] font-bold">311.04 Trillion Years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Call to Action */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-400">
                Astronomical calculations derived from Surya Siddhanta & NASA/JPL planetary ephemeris.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsMatrixModalOpen(false);
                    onExploreTimeline();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-stone-950 font-semibold rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
                >
                  <span>Scrub the 3 Parallel Timelines</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
