import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Sparkles, Volume2, Film, Tv, Flame, X } from 'lucide-react';
import { ComicSeries } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { MythicArtworkSvg } from './MythicArtworkSvg.tsx';

interface StudiosHubProps {
  seriesList: ComicSeries[];
  onOpenSeriesReader: (seriesId: string) => void;
}

export const StudiosHub: React.FC<StudiosHubProps> = ({
  seriesList,
  onOpenSeriesReader,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Motion Comic' | 'Graphic Novel' | 'Animated Teaser'>('all');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeTrailerSeries, setActiveTrailerSeries] = useState<ComicSeries | null>(null);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanatan_watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleWatchlist = (seriesId: string) => {
    soundEffects.playPanelSwoosh();
    let updated: string[];
    if (watchlist.includes(seriesId)) {
      updated = watchlist.filter((id) => id !== seriesId);
    } else {
      updated = [...watchlist, seriesId];
    }
    setWatchlist(updated);
    try {
      localStorage.setItem('sanatan_watchlist', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredSeries = selectedCategory === 'all'
    ? seriesList
    : seriesList.filter((s) => s.category === selectedCategory);

  const featuredFlagship = seriesList[1] || seriesList[0]; // Kurukshetra

  return (
    <section id="studios-section" className="py-16 sm:py-24 border-b border-stone-800 bg-[#080706]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 font-serif">
              <Film className="w-4 h-4" />
              <span>Division P2 · SanatanVerse Studios</span>
              <span aria-hidden="true">·</span>
              <span>Next-Gen Streaming Hub</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              Mythology Originals Built to Challenge the Giants
            </h2>
            <p className="text-sm sm:text-base text-stone-400 max-w-2xl">
              Engineered with high-fidelity 4K motion graphics, original classical sound design, and
              uncompromising narrative fidelity. Designed for scalable cloud streaming.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto shrink-0">
            {(['all', 'Motion Comic', 'Graphic Novel', 'Animated Teaser'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Originals' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Billboard Marquee (Netflix / Hotstar Caliber) */}
        {featuredFlagship && (
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-stone-950 shadow-2xl">
            {/* Visual Backing */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
              <MythicArtworkSvg
                preset="chariot"
                className="w-full h-full object-cover scale-105"
              />

              {/* Multi-tier gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent" />

              {/* Billboard Details */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-2xl space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[11px] tracking-wider uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    #1 Flagship Original
                  </span>
                  <span className="text-amber-400 font-mono text-xs">
                    4K ULTRA HD · DOLBY ATMOS
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-serif text-sm sm:text-base text-amber-400 tracking-wide">
                    {featuredFlagship.sanskritTitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
                    {featuredFlagship.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                  {featuredFlagship.synopsis}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      soundEffects.playPanelSwoosh();
                      onOpenSeriesReader(featuredFlagship.id);
                    }}
                    className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 hover:brightness-110 flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>Start Reading Episode 1</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playTempleBell();
                      setActiveTrailerSeries(featuredFlagship);
                    }}
                    className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Film className="w-4 h-4" />
                    <span>Watch Motion Teaser</span>
                  </button>

                  <button
                    onClick={() => toggleWatchlist(featuredFlagship.id)}
                    className="p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors"
                    aria-label="Add to Watchlist"
                    title={watchlist.includes(featuredFlagship.id) ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    {watchlist.includes(featuredFlagship.id) ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Series Horizontal Carousel Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-400" />
              <span>Sanatan Originals Roster</span>
            </h3>
            <span className="text-xs text-stone-400">
              {filteredSeries.length} Productions Catalogued
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSeries.map((series) => {
              const inWatchlist = watchlist.includes(series.id);

              return (
                <div
                  key={series.id}
                  className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 hover:border-amber-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-black overflow-hidden">
                    <MythicArtworkSvg
                      preset={
                        series.id === 'series-rudra'
                          ? 'rudra'
                          : series.id === 'series-ramayana'
                          ? 'rama'
                          : series.id === 'series-hanuman'
                          ? 'hanuman'
                          : series.id === 'series-ganga'
                          ? 'ganga'
                          : 'chariot'
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-90" />

                    {/* Top status */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                        {series.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(series.id);
                        }}
                        className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-stone-300 hover:text-white border border-stone-700"
                        aria-label="Toggle watchlist"
                      >
                        {inWatchlist ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Quick Stats on Art */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {series.rating}
                      </span>
                      <span>{series.views}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-stone-400 font-serif">
                        {series.sanskritTitle}
                      </div>
                      <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {series.title}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {series.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">
                        {series.durationOrPages}
                      </span>
                      <button
                        onClick={() => {
                          soundEffects.playPanelSwoosh();
                          onOpenSeriesReader(series.id);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Experience</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motion Teaser Simulator Modal */}
        {activeTrailerSeries && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-3xl bg-stone-950 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/9] bg-black">
                <MythicArtworkSvg
                  preset={
                    activeTrailerSeries.id === 'series-kurukshetra'
                      ? 'chariot'
                      : activeTrailerSeries.id === 'series-rudra'
                      ? 'rudra'
                      : 'rama'
                  }
                  className="w-full h-full object-cover animate-pulse"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-black/60 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-red-600 text-white rounded">
                        Teaser Preview
                      </span>
                      <span className="text-xs text-amber-400 font-mono">Audio Atmos Active</span>
                    </div>

                    <button
                      onClick={() => setActiveTrailerSeries(null)}
                      className="p-2 rounded-full bg-black/70 text-stone-300 hover:text-white"
                      aria-label="Close Teaser Modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {activeTrailerSeries.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                      "{activeTrailerSeries.tagline}"
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const id = activeTrailerSeries.id;
                          setActiveTrailerSeries(null);
                          onOpenSeriesReader(id);
                        }}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-stone-950" />
                        <span>Launch Full Reader</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
