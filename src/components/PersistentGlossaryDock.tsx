import React, { useState, useMemo, useEffect } from 'react';
import { BookMarked, Pin, PinOff, Search, X, Eye, EyeOff } from 'lucide-react';
import { SANATAN_GLOSSARY, GlossaryTerm } from '../data/glossaryData.ts';
import { useGlossary } from '../context/GlossaryContext.tsx';

export const PersistentGlossaryDock: React.FC = () => {
  const {
    hoveredTerm,
    lastInspectedTerm,
    pinnedTerm,
    isGlossaryEnabled,
    isIndexOpen,
    setPinnedTerm,
    toggleGlossaryEnabled,
    setIsIndexOpen,
  } = useGlossary();

  const [indexSearch, setIndexSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Display priority: live hovered term > pinned term > most recently inspected term
  const displayTerm: GlossaryTerm | null = hoveredTerm || pinnedTerm || lastInspectedTerm;
  const isPinned = Boolean(pinnedTerm && displayTerm && pinnedTerm.id === displayTerm.id);

  const filteredGlossary = useMemo(() => {
    const q = indexSearch.trim().toLowerCase();
    return SANATAN_GLOSSARY.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.sanskrit.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [indexSearch, selectedCategory]);

  useEffect(() => {
    if (!isIndexOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsIndexOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIndexOpen, setIsIndexOpen]);

  return (
    <>
      {/* Persistent Floating Bottom-Right Glossary Dock */}
      <aside
        aria-label="Persistent Sanskrit Glossary"
        className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto flex flex-col items-end gap-2 pointer-events-none"
      >
        {/* Active/Pinned Definition Inspector Card */}
        {displayTerm && isGlossaryEnabled && !isIndexOpen && (
          <div className="pointer-events-auto w-full sm:w-[340px] p-4 rounded-xl bg-[#14120f] border border-stone-700/90 shadow-2xl space-y-2 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-sm font-semibold text-amber-300">
                    {displayTerm.term}
                  </span>
                  <span className="font-serif text-xs text-stone-400">
                    {displayTerm.sanskrit}
                  </span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-stone-500">
                  {displayTerm.category}
                  {hoveredTerm?.id === displayTerm.id
                    ? ' · Hovering'
                    : isPinned
                    ? ' · Pinned'
                    : ' · Last Viewed'}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPinnedTerm(isPinned ? null : displayTerm)}
                  className={`p-1.5 rounded-md transition-colors ${
                    isPinned
                      ? 'text-amber-300 bg-amber-950/50 hover:bg-amber-900/50'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/70'
                  }`}
                  title={isPinned ? 'Unpin term' : 'Pin term'}
                  aria-label={isPinned ? 'Unpin glossary term' : 'Pin glossary term'}
                >
                  {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {displayTerm.definition}
            </p>
          </div>
        )}

        {/* Compact Persistent Control Strip */}
        <div className="pointer-events-auto inline-flex items-center gap-1 p-1 rounded-xl bg-[#14120f] border border-stone-700/90 shadow-xl text-xs">
          <button
            type="button"
            onClick={() => setIsIndexOpen(!isIndexOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-stone-200 hover:text-amber-300 hover:bg-stone-900 transition-colors whitespace-nowrap"
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            <span>Glossary ({SANATAN_GLOSSARY.length})</span>
          </button>

          <span className="h-4 w-px bg-stone-800" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleGlossaryEnabled}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors whitespace-nowrap"
            title={isGlossaryEnabled ? 'Disable inline highlights' : 'Enable inline highlights'}
          >
            {isGlossaryEnabled ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Highlights On</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                <span>Highlights Off</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Expandable Searchable Glossary Drawer / Index */}
      {isIndexOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
          onClick={() => setIsIndexOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Persistent Sanskrit Glossary Reference"
            className="w-full max-w-md h-full bg-[#0e0d0b] border-l border-stone-800 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-amber-400 font-medium">
                  Sanskrit &amp; Concept Reference
                </div>
                <h2 className="font-serif text-lg font-semibold text-stone-100">
                  Persistent Glossary ({filteredGlossary.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsIndexOpen(false)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/70 transition-colors"
                aria-label="Close Glossary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 border-b border-stone-800/80 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={indexSearch}
                  onChange={(e) => setIndexSearch(e.target.value)}
                  placeholder="Search Sanskrit terms or concepts..."
                  aria-label="Search glossary terms"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                {['all', 'Cosmology', 'Philosophy', 'Scripture', 'Practice', 'Lineage'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'text-stone-400 hover:text-stone-100 bg-stone-900/60'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms List */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-800/70">
              {filteredGlossary.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  No matching Sanskrit terms or concepts found.
                </div>
              ) : (
                filteredGlossary.map((item) => {
                  const pinned = pinnedTerm?.id === item.id;
                  return (
                    <div key={item.id} className="p-4 space-y-1.5 hover:bg-stone-900/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-sm font-semibold text-amber-300">
                            {item.term}
                          </span>
                          <span className="font-serif text-xs text-stone-400">
                            {item.sanskrit}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPinnedTerm(pinned ? null : item)}
                          className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                            pinned
                              ? 'bg-amber-400 text-stone-950 font-semibold'
                              : 'text-stone-400 hover:text-amber-300'
                          }`}
                        >
                          {pinned ? 'Pinned' : 'Pin'}
                        </button>
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-stone-500">
                        {item.category}
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
