/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Flame, Zap, Scroll, Eye, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { generateLivePulseActivity, LivePulseItem, recordPanelReaction } from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';

export const LivePulseFeed: React.FC = () => {
  const [pulseIndex, setPulseIndex] = useState<number>(0);
  const [currentPulse, setCurrentPulse] = useState<LivePulseItem>(() => generateLivePulseActivity(0));
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{
    divine: number;
    astra: number;
    evidence: number;
    wisdom: number;
  }>({
    divine: 1248,
    astra: 876,
    evidence: 942,
    wisdom: 1530,
  });
  const [lastReacted, setLastReacted] = useState<string | null>(null);

  // Rotate live activity every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => {
        const next = prev + 1;
        setCurrentPulse(generateLivePulseActivity(next));
        return next;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleReaction = (type: 'divine' | 'astra' | 'evidence' | 'wisdom') => {
    soundEffects.playAstraPulse();
    setReactions((prev) => recordPanelReaction(prev, type) as any);
    setLastReacted(type);
    setTimeout(() => setLastReacted(null), 1200);
  };

  return (
    <aside aria-label="Live Community Reader Pulse" className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-80">
      <div className="bg-stone-950/90 border border-amber-900/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs transition-all">
        
        {/* Ticker Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <div className="truncate">
              <span className="font-semibold text-amber-300">{currentPulse.userName} </span>
              <span className="text-stone-400 text-[11px]">({currentPulse.location}) </span>
              <span className="text-stone-300">{currentPulse.action} </span>
              <span className="text-amber-200 font-medium font-serif">{currentPulse.target}</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-900 shrink-0 transition"
            title={isExpanded ? 'Collapse Community Pulse' : 'Expand Live Reader Pulse'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Panel: Live Reader Reactions */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-stone-800/80 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-amber-400">Live Reader Resonance:</span>
              <span className="text-emerald-400 font-mono">1,400+ online</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              <button
                onClick={() => handleReaction('divine')}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-orange-950/40 border border-stone-800 hover:border-orange-500/40 transition flex flex-col items-center group relative"
              >
                <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] text-stone-300 font-mono">{reactions.divine.toLocaleString()}</span>
                <span className="text-[9px] text-stone-500">Divine</span>
                {lastReacted === 'divine' && (
                  <span className="absolute -top-3 text-[10px] font-bold text-orange-400 animate-bounce">+1</span>
                )}
              </button>

              <button
                onClick={() => handleReaction('astra')}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/40 transition flex flex-col items-center group relative"
              >
                <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] text-stone-300 font-mono">{reactions.astra.toLocaleString()}</span>
                <span className="text-[9px] text-stone-500">Astra</span>
                {lastReacted === 'astra' && (
                  <span className="absolute -top-3 text-[10px] font-bold text-amber-400 animate-bounce">+1</span>
                )}
              </button>

              <button
                onClick={() => handleReaction('evidence')}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-sky-950/40 border border-stone-800 hover:border-sky-500/40 transition flex flex-col items-center group relative"
              >
                <Scroll className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] text-stone-300 font-mono">{reactions.evidence.toLocaleString()}</span>
                <span className="text-[9px] text-stone-500">Evidence</span>
                {lastReacted === 'evidence' && (
                  <span className="absolute -top-3 text-[10px] font-bold text-sky-400 animate-bounce">+1</span>
                )}
              </button>

              <button
                onClick={() => handleReaction('wisdom')}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-purple-950/40 border border-stone-800 hover:border-purple-500/40 transition flex flex-col items-center group relative"
              >
                <Eye className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] text-stone-300 font-mono">{reactions.wisdom.toLocaleString()}</span>
                <span className="text-[9px] text-stone-500">Wisdom</span>
                {lastReacted === 'wisdom' && (
                  <span className="absolute -top-3 text-[10px] font-bold text-purple-400 animate-bounce">+1</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
