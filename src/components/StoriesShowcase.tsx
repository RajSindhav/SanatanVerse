import React from 'react';
import { BookOpen, Sparkles, Star, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { ComicSeries } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { MythicArtworkSvg } from './MythicArtworkSvg.tsx';

interface StoriesShowcaseProps {
  seriesList: ComicSeries[];
  onOpenSeriesReader: (seriesId: string) => void;
}

export const StoriesShowcase: React.FC<StoriesShowcaseProps> = ({
  seriesList,
  onOpenSeriesReader,
}) => {
  return (
    <section id="comics-section" className="py-16 sm:py-24 border-b border-stone-800 bg-[#0c0b09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 font-serif">
              <BookOpen className="w-4 h-4" />
              <span>Division P1 · SanatanVerse Stories</span>
              <span aria-hidden="true">·</span>
              <span>Illustrated Epics & Motion Webtoons</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              Mythology Reimagined for the Modern Graphic Novel Era
            </h2>
            <p className="text-sm sm:text-base text-stone-400 max-w-2xl">
              From the cosmic Tandava to the chariots of Kurukshetra, read panel-by-panel or continuous
              vertical scroll with authentic Sanskrit annotations and sound effects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Attributed Scriptural Citations Included</span>
            </span>
          </div>
        </div>

        {/* Featured Stories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seriesList.map((series, idx) => (
            <div
              key={series.id}
              className={`rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-xl ${
                idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
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
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Badge top */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-amber-500/30 uppercase">
                    {series.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[10px] text-stone-300">
                    {series.status}
                  </span>
                </div>

                {/* Bottom stats on visual */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
                  <span className="font-serif text-amber-300 font-semibold">{series.sanskritTitle}</span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{series.rating}</span>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-xs text-stone-400 italic">
                    "{series.tagline}"
                  </p>
                  <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                    {series.synopsis}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {series.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-mono">
                    {series.durationOrPages}
                  </span>
                  <button
                    onClick={() => {
                      soundEffects.playPanelSwoosh();
                      onOpenSeriesReader(series.id);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-md shadow-amber-500/10 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Interactive</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
