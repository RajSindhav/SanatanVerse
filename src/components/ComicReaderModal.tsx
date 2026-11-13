import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Volume2, Info, Compass, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { ComicSeries } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { MythicArtworkSvg } from './MythicArtworkSvg.tsx';

interface ComicReaderModalProps {
  seriesList: ComicSeries[];
  initialSeriesId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ComicReaderModal: React.FC<ComicReaderModalProps> = ({
  seriesList,
  initialSeriesId,
  isOpen,
  onClose,
}) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(initialSeriesId || seriesList[0]?.id || '');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'panel' | 'webtoon'>('panel');
  const [showLoreDrawer, setShowLoreDrawer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync initial series
  useEffect(() => {
    if (initialSeriesId) {
      setSelectedSeriesId(initialSeriesId);
      setActiveChapterIndex(0);
      setActivePanelIndex(0);
    }
  }, [initialSeriesId]);

  const currentSeries = seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];
  const currentChapter = currentSeries?.chapters[activeChapterIndex] || currentSeries?.chapters[0];
  const currentPanel = currentChapter?.panels[activePanelIndex] || currentChapter?.panels[0];

  // Keyboard navigation for panel mode
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextPanel();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activePanelIndex, currentChapter]);

  if (!isOpen || !currentSeries || !currentChapter) return null;

  const handleNextPanel = () => {
    if (activePanelIndex < currentChapter.panels.length - 1) {
      soundEffects.playPanelSwoosh();
      setActivePanelIndex((prev) => prev + 1);
    } else {
      soundEffects.playTempleBell();
    }
  };

  const handlePrevPanel = () => {
    if (activePanelIndex > 0) {
      soundEffects.playPanelSwoosh();
      setActivePanelIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 h-16 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between px-4 sm:px-6 z-20">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-amber-400 text-lg hidden sm:inline">
            SANATAN STORIES
          </span>
          <span className="text-stone-600 hidden sm:inline">/</span>

          {/* Series Dropdown */}
          <select
            value={selectedSeriesId}
            onChange={(e) => {
              setSelectedSeriesId(e.target.value);
              setActiveChapterIndex(0);
              setActivePanelIndex(0);
              soundEffects.playPanelSwoosh();
            }}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            aria-label="Select Comic Series"
          >
            {seriesList.map((series) => (
              <option key={series.id} value={series.id}>
                {series.title} ({series.sanskritTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-0.5 flex items-center text-xs">
            <button
              onClick={() => setViewMode('panel')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'panel' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Panel by Panel
            </button>
            <button
              onClick={() => setViewMode('webtoon')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'webtoon' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Continuous Flow
            </button>
          </div>

          {/* Scriptural Lore Toggle */}
          <button
            onClick={() => {
              setShowLoreDrawer(!showLoreDrawer);
              soundEffects.playAstraPulse();
            }}
            className={`p-2 rounded-lg border transition-colors ${
              showLoreDrawer
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Scriptural Citation & Lore"
            aria-label="Toggle Scriptural Lore Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors hidden md:block"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            aria-label="Close Comic Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Reader Viewport */}
      <div className="w-full h-full pt-16 flex overflow-hidden">
        {/* Left/Center Canvas */}
        <div className="flex-1 relative flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-8">
          {viewMode === 'panel' ? (
            /* Panel-by-Panel Mode */
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-auto">
              <div className="w-full bg-stone-900/90 rounded-2xl border border-stone-800 overflow-hidden shadow-2xl flex flex-col">
                {/* Visual Panel Art Box */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black">
                  <MythicArtworkSvg
                    preset={currentPanel.artSvgPreset}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {/* Sound Effect Comic Banner */}
                  {currentPanel.soundEffect && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-stone-950 px-3 py-1 font-black text-sm tracking-widest uppercase transform rotate-2 shadow-lg shadow-black/80">
                      {currentPanel.soundEffect}
                    </div>
                  )}

                  {/* Narration box at top */}
                  {currentPanel.narration && (
                    <div className="absolute top-4 left-4 max-w-md bg-stone-950/85 backdrop-blur-md border border-stone-700/80 p-3 rounded-lg text-xs sm:text-sm text-stone-200 font-serif italic shadow-lg">
                      "{currentPanel.narration}"
                    </div>
                  )}

                  {/* Dialogue Bubble at bottom */}
                  {currentPanel.dialogue && (
                    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-stone-900/95 backdrop-blur-md border border-amber-500/40 p-4 rounded-xl shadow-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase font-serif">
                          {currentPanel.speaker || 'LORE VOICE'}
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[10px] text-stone-400">{currentPanel.scripturalCitation}</span>
                      </div>
                      <p className="text-sm sm:text-base text-stone-100 font-medium">
                        "{currentPanel.dialogue}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation & Panel Bar */}
                <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
                  <button
                    onClick={handlePrevPanel}
                    disabled={activePanelIndex === 0}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 border border-stone-800 text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Panel</span>
                  </button>

                  <div className="text-xs text-stone-400 flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-semibold">
                      Panel {activePanelIndex + 1} of {currentChapter.panels.length}
                    </span>
                    <span>·</span>
                    <span>{currentChapter.title}</span>
                  </div>

                  <button
                    onClick={handleNextPanel}
                    disabled={activePanelIndex === currentChapter.panels.length - 1}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 text-stone-950 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next Panel</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Webtoon Continuous Vertical Scroll Mode */
            <div className="max-w-2xl mx-auto w-full space-y-8 py-4">
              <div className="text-center space-y-2 border-b border-stone-800 pb-6">
                <span className="text-xs text-amber-400 font-serif tracking-widest uppercase">
                  {currentSeries.sanskritTitle}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {currentChapter.title}
                </h2>
                <p className="text-xs text-stone-400">{currentChapter.synopsis}</p>
              </div>

              {currentChapter.panels.map((panel, idx) => (
                <div key={panel.id} className="rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl space-y-3 p-2">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                    <MythicArtworkSvg preset={panel.artSvgPreset} className="w-full h-full object-cover" />
                    {panel.soundEffect && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 px-2 py-0.5 text-xs font-black uppercase shadow">
                        {panel.soundEffect}
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    {panel.narration && (
                      <p className="text-xs text-stone-300 italic font-serif">"{panel.narration}"</p>
                    )}
                    {panel.dialogue && (
                      <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">{panel.speaker}</span>
                        <p className="text-sm text-stone-100 mt-0.5">"{panel.dialogue}"</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Panel #{idx + 1}</span>
                      <span className="text-stone-400">{panel.scripturalCitation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scriptural Lore & Source Attribution Sidebar Drawer */}
        {showLoreDrawer && (
          <aside className="w-80 lg:w-96 bg-stone-950 border-l border-stone-800 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Compass className="w-4 h-4" />
                <h3 className="font-serif font-bold text-sm tracking-wide">Scriptural Context</h3>
              </div>
              <button
                onClick={() => setShowLoreDrawer(false)}
                className="text-stone-400 hover:text-white"
                aria-label="Close Lore Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Panel Lore */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Active Scene</span>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {currentPanel.visualDescription}
                </p>
              </div>

              {currentPanel.loreNote && (
                <div className="p-3.5 rounded-lg bg-stone-900/90 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Traditional Hermeneutics</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentPanel.loreNote}
                  </p>
                </div>
              )}

              {currentPanel.scripturalCitation && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Primary Scripture Source</span>
                  <div className="mt-1 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-400 font-mono">
                    {currentPanel.scripturalCitation}
                  </div>
                </div>
              )}

              <div className="border-t border-stone-800 pt-4 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Series Metadata</span>
                <div className="text-xs space-y-1 text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Root Scripture:</span>
                    <span>{currentSeries.scripturalRoots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Age Rating:</span>
                    <span>{currentSeries.ageRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Editorial Standard:</span>
                    <span className="text-emerald-400">Zero Uncited Claims</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
