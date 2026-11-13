import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Search,
  Filter,
  BookOpen,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { TimelineEvent, TimelineEra, TimelineTrack, EvidenceLabel } from '../types/index.ts';
import {
  filterTimelineEvents,
  getEvidenceLabelMeta,
  formatTimelineDateDisplay,
} from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';

interface TimelineExplorerProps {
  eras: TimelineEra[];
  events: TimelineEvent[];
  onSelectEvent?: (event: TimelineEvent) => void;
}

export const TimelineExplorer: React.FC<TimelineExplorerProps> = ({
  eras,
  events,
}) => {
  const [activeTrack, setActiveTrack] = useState<TimelineTrack>('all');
  const [selectedEraId, setSelectedEraId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvidenceLabel, setSelectedEvidenceLabel] = useState<EvidenceLabel | 'all'>('all');
  const [activeEventModal, setActiveEventModal] = useState<TimelineEvent | null>(null);

  const filteredEvents = filterTimelineEvents(events, {
    track: activeTrack,
    eraId: selectedEraId,
    searchQuery,
    evidenceLabel: selectedEvidenceLabel,
  });

  const evidenceLabelsList: EvidenceLabel[] = [
    'Well established',
    'Estimated date',
    'Traditional chronology',
    'Textual evidence',
    'Debated',
    'Unverified claim',
  ];

  return (
    <section id="timeline-section" className="py-16 sm:py-24 border-b border-stone-800 bg-[#0c0b09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 font-serif">
            <span>Division P0 Core Project</span>
            <span aria-hidden="true">·</span>
            <span>The Sanatan Timeline</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
                Cosmic Origins Through Living Traditions
              </h2>
              <p className="mt-2 text-sm sm:text-base text-stone-400 max-w-3xl">
                An interactive chronology connecting sacred, scientific, and historical evidence.
                Our editorial constitution rigorously distinguishes traditional timelines from
                archaeological carbon dating.
              </p>
            </div>

            {/* Track Switcher (Functional Segmented Control) */}
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl shrink-0">
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All Synchronized Tracks
              </button>
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('sacred');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'sacred'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sacred Chronology
              </button>
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('historical');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'historical'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Historical & Epigraphic
              </button>
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('scientific');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'scientific'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Scientific / Cosmology
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Era Navigation Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
            <span>Filter by Historical Era ({eras.length} Classical Epochs)</span>
            {selectedEraId !== 'all' && (
              <button
                onClick={() => setSelectedEraId('all')}
                className="text-amber-400 hover:underline"
              >
                Reset Era Filter
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => {
                soundEffects.playPanelSwoosh();
                setSelectedEraId('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                selectedEraId === 'all'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              All Eras
            </button>
            {eras.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setSelectedEraId(era.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-all flex items-center gap-1.5 ${
                  selectedEraId === era.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <span>{era.name}</span>
                <span className="text-[10px] text-stone-500 font-serif">({era.sanskritName})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by deity, scripture, event, or archaeological site (e.g. Krishna, Rigveda, Rakhigarhi)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Evidence Label Filter */}
          <div className="md:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={selectedEvidenceLabel}
              onChange={(e) => {
                setSelectedEvidenceLabel(e.target.value as EvidenceLabel | 'all');
                soundEffects.playPanelSwoosh();
              }}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              aria-label="Filter by Evidence Label"
            >
              <option value="all">All Evidence Standards</option>
              {evidenceLabelsList.map((label) => (
                <option key={label} value={label}>
                  Evidence: {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>
              Showing <strong className="text-amber-400">{filteredEvents.length}</strong> verified timeline records
            </span>
            <span className="text-[11px] text-stone-500">
              Citations verified per Master Brand Blueprint Stage 7
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800/80 space-y-3">
              <ShieldAlert className="w-8 h-8 text-amber-500/60 mx-auto" />
              <h3 className="font-serif text-lg font-medium text-stone-300">No events found matching your criteria</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try clearing the search query or switching to 'All Synchronized Tracks' to view more entries.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEraId('all');
                  setSelectedEvidenceLabel('all');
                  setActiveTrack('all');
                }}
                className="mt-2 px-4 py-2 text-xs bg-stone-800 text-stone-200 rounded-lg hover:bg-stone-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const dateDisplay = formatTimelineDateDisplay(event, activeTrack);
                const labelMeta = getEvidenceLabelMeta(event.evidenceLabel);

                return (
                  <div
                    key={event.id}
                    className="flex flex-col justify-between rounded-xl p-5 bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 group"
                  >
                    <div className="space-y-3">
                      {/* Top Metadata: Era & Track */}
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-400">
                        <span className="font-serif text-amber-400">{event.eraName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
                          {event.track}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                          {event.title}
                        </h3>
                        {event.sanskritTitle && (
                          <div className="text-xs text-stone-400 font-serif mt-0.5">
                            {event.sanskritTitle}
                          </div>
                        )}
                      </div>

                      {/* Primary & Secondary Dates */}
                      <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-400">Timeframe:</span>
                          <span className="font-medium text-stone-200">{dateDisplay.primaryDate}</span>
                        </div>
                        {dateDisplay.secondaryDate && (
                          <div className="text-[11px] text-stone-500">
                            {dateDisplay.secondaryDate}
                          </div>
                        )}
                      </div>

                      {/* Evidence Badge (Clean unboxed style or quiet outline) */}
                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded border font-medium ${labelMeta.color}`}
                          title={labelMeta.definition}
                        >
                          {event.evidenceLabel}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {event.sources.length} cited {event.sources.length === 1 ? 'source' : 'sources'}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                        {event.summary}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-4 border-t border-stone-800/60 mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{event.sources[0]?.title || 'Scripture'}</span>
                      </div>

                      <button
                        onClick={() => {
                          soundEffects.playPanelSwoosh();
                          setActiveEventModal(event);
                        }}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Full Evidence</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Event Evidence Drawer Modal */}
        {activeEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-serif mb-1">
                    <span>{activeEventModal.eraName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase font-mono">{activeEventModal.track} Track</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {activeEventModal.title}
                  </h3>
                  {activeEventModal.sanskritTitle && (
                    <div className="text-sm text-stone-400 font-serif mt-1">
                      {activeEventModal.sanskritTitle}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveEventModal(null)}
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
                  aria-label="Close Event Modal"
                >
                  ✕
                </button>
              </div>

              {/* Evidence Taxonomy Ribbon */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getEvidenceLabelMeta(activeEventModal.evidenceLabel).color}`}>
                    Evidence Standard: {activeEventModal.evidenceLabel}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {getEvidenceLabelMeta(activeEventModal.evidenceLabel).definition}
                </p>
              </div>

              {/* Chronological Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 font-medium">Traditional Sacred Dating:</span>
                  <div className="font-serif text-amber-300 font-semibold mt-1">
                    {activeEventModal.traditionalDate}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 font-medium">Historical / Carbon Range:</span>
                  <div className="font-mono text-cyan-300 font-semibold mt-1">
                    {activeEventModal.historicalDateRange}
                  </div>
                </div>
              </div>

              {/* Full Detailed Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-serif">
                  Detailed Scholarly Analysis
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activeEventModal.fullExplanation}
                </p>
              </div>

              {/* Cultural Significance */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-semibold text-amber-400 font-serif">
                  Cultural Significance & Philosophy
                </span>
                <p className="text-xs text-stone-300">
                  {activeEventModal.culturalSignificance}
                </p>
              </div>

              {/* Source References & Bibliography (Mandatory Field from PDF Blueprint) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-serif">
                  Verified Source References ({activeEventModal.sources.length})
                </h4>
                <div className="space-y-2">
                  {activeEventModal.sources.map((src, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-stone-200">
                          {src.title} {src.author && <span className="text-stone-400 font-normal">by {src.author}</span>}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono mt-0.5">{src.citation}</div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 text-amber-400 border border-stone-700">
                        {src.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Entities */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <span className="text-xs text-stone-500">Related Entities:</span>
                <div className="flex flex-wrap gap-2">
                  {activeEventModal.relatedEntities.map((ent, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded bg-stone-800 text-stone-300">
                      {ent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
