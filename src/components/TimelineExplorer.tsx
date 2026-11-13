import React, { useState } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  ChevronRight,
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
    <section id="timeline-section" className="py-16 sm:py-24 border-b border-[#dcc8a4] bg-[#f3ead8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#b45309] font-serif">
            <span>Division P0 Core Project</span>
            <span aria-hidden="true">·</span>
            <span>The Sanatan Timeline</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#231b12] tracking-tight">
                Cosmic Origins Through Living Traditions
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#5a4b38] max-w-3xl">
                An interactive chronology connecting sacred, scientific, and historical evidence.
                Our editorial constitution rigorously distinguishes traditional timelines from
                archaeological carbon dating.
              </p>
            </div>

            {/* Track Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#e8dac0] border border-[#d4bd95] rounded-xl shrink-0">
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('all');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'all'
                    ? 'bg-[#1b2744] text-[#fcf7ec] shadow-sm'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
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
                    ? 'bg-[#b45309] text-[#fffaf0] shadow-sm'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
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
                    ? 'bg-[#0f6b52] text-[#fffaf0] shadow-sm'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
                }`}
              >
                Historical &amp; Epigraphic
              </button>
              <button
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveTrack('scientific');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTrack === 'scientific'
                    ? 'bg-[#155e75] text-[#fffaf0] shadow-sm'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
                }`}
              >
                Scientific / Cosmology
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Era Navigation Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5a4b38] font-medium">
            <span>Filter by Historical Era ({eras.length} Classical Epochs)</span>
            {selectedEraId !== 'all' && (
              <button
                onClick={() => setSelectedEraId('all')}
                className="text-[#b45309] hover:underline"
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
                  ? 'bg-[#f4e4c5] border-[#b45309] text-[#92400e] font-semibold'
                  : 'bg-[#fbf7ee] border-[#dcc8a4] text-[#5a4b38] hover:border-[#b45309]/50 hover:text-[#231b12]'
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
                    ? 'bg-[#f4e4c5] border-[#b45309] text-[#92400e] font-semibold'
                    : 'bg-[#fbf7ee] border-[#dcc8a4] text-[#5a4b38] hover:border-[#b45309]/50 hover:text-[#231b12]'
                }`}
              >
                <span>{era.name}</span>
                <span className="text-[10px] text-[#8a7558] font-serif">({era.sanskritName})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-sm">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c775a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by deity, scripture, event, or archaeological site (e.g. Krishna, Rigveda, Rakhigarhi)..."
              className="w-full pl-10 pr-4 py-2 bg-[#fffdf8] border border-[#d5bf97] rounded-lg text-xs sm:text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309]"
            />
          </div>

          <div className="md:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8c775a] shrink-0" />
            <select
              value={selectedEvidenceLabel}
              onChange={(e) => {
                setSelectedEvidenceLabel(e.target.value as EvidenceLabel | 'all');
                soundEffects.playPanelSwoosh();
              }}
              className="w-full bg-[#fffdf8] border border-[#d5bf97] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#231b12] focus:outline-none focus:border-[#b45309]"
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
          <div className="flex items-center justify-between text-xs text-[#5a4b38]">
            <span>
              Showing <strong className="text-[#b45309]">{filteredEvents.length}</strong> verified timeline records
            </span>
            <span className="text-[11px] text-[#7a6449]">
              Citations verified per editorial standard
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#fbf7ee] border border-[#dcc8a4] space-y-3 shadow-sm">
              <ShieldAlert className="w-8 h-8 text-[#b45309] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#231b12]">No events found matching your criteria</h3>
              <p className="text-xs text-[#6f5d47] max-w-md mx-auto">
                Try clearing the search query or switching to &lsquo;All Synchronized Tracks&rsquo; to view more entries.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEraId('all');
                  setSelectedEvidenceLabel('all');
                  setActiveTrack('all');
                }}
                className="mt-2 px-4 py-2 text-xs bg-[#b45309] text-[#fffaf0] rounded-lg hover:bg-[#92400e]"
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
                    className="flex flex-col justify-between rounded-xl p-5 bg-[#fbf7ee] border border-[#dcc8a4] hover:border-[#b45309]/55 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#6f5d47]">
                        <span className="font-serif font-medium text-[#b45309]">{event.eraName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#6f5d47] font-mono">
                          {event.track}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#231b12] group-hover:text-[#92400e] transition-colors">
                          {event.title}
                        </h3>
                        {event.sanskritTitle && (
                          <div className="text-xs text-[#6f5d47] font-serif mt-0.5">
                            {event.sanskritTitle}
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#f5ecda] border border-[#dfd0b4] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#6f5d47]">Timeframe:</span>
                          <span className="font-medium text-[#231b12]">{dateDisplay.primaryDate}</span>
                        </div>
                        {dateDisplay.secondaryDate && (
                          <div className="text-[11px] text-[#6f5d47]">
                            {dateDisplay.secondaryDate}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded border font-medium ${labelMeta.color}`}
                          title={labelMeta.definition}
                        >
                          {event.evidenceLabel}
                        </span>
                        <span className="text-[11px] text-[#6f5d47]">
                          {event.sources.length} cited {event.sources.length === 1 ? 'source' : 'sources'}
                        </span>
                      </div>

                      <p className="text-xs text-[#4e4030] line-clamp-3 leading-relaxed">
                        {event.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#ebdcb9] mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#6f5d47]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{event.sources[0]?.title || 'Scripture'}</span>
                      </div>

                      <button
                        onClick={() => {
                          soundEffects.playPanelSwoosh();
                          setActiveEventModal(event);
                        }}
                        className="text-xs font-semibold text-[#b45309] hover:text-[#92400e] flex items-center gap-1 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141c31]/65 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-[#fbf7ee] border border-[#dcc8a4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_28px_64px_rgba(14,20,38,0.35)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-[#dcc8a4] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#b45309] font-serif font-medium mb-1">
                    <span>{activeEventModal.eraName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase font-mono">{activeEventModal.track} Track</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#231b12]">
                    {activeEventModal.title}
                  </h3>
                  {activeEventModal.sanskritTitle && (
                    <div className="text-sm text-[#6f5d47] font-serif mt-1">
                      {activeEventModal.sanskritTitle}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveEventModal(null)}
                  className="p-1.5 rounded-lg bg-[#efe3cc] text-[#5a4b38] hover:text-[#231b12] hover:bg-[#e5d4b3]"
                  aria-label="Close Event Modal"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f5ecda] border border-[#dcc8a4] space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getEvidenceLabelMeta(activeEventModal.evidenceLabel).color}`}>
                    Evidence Standard: {activeEventModal.evidenceLabel}
                  </span>
                </div>
                <p className="text-xs text-[#4e4030] mt-1">
                  {getEvidenceLabelMeta(activeEventModal.evidenceLabel).definition}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#f5ecda] border border-[#dcc8a4]">
                  <span className="text-[#6f5d47] font-medium">Traditional Sacred Dating:</span>
                  <div className="font-serif text-[#a63d08] font-semibold mt-1">
                    {activeEventModal.traditionalDate}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#f5ecda] border border-[#dcc8a4]">
                  <span className="text-[#6f5d47] font-medium">Historical / Carbon Range:</span>
                  <div className="font-mono text-[#155e75] font-semibold mt-1">
                    {activeEventModal.historicalDateRange}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6f5d47] font-serif">
                  Detailed Scholarly Analysis
                </h4>
                <p className="text-xs sm:text-sm text-[#3e3121] leading-relaxed">
                  {activeEventModal.fullExplanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4e4c5] border border-[#d6bd93] space-y-1">
                <span className="text-xs font-semibold text-[#92400e] font-serif">
                  Cultural Significance &amp; Philosophy
                </span>
                <p className="text-xs text-[#3e3121]">
                  {activeEventModal.culturalSignificance}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6f5d47] font-serif">
                  Verified Source References ({activeEventModal.sources.length})
                </h4>
                <div className="space-y-2">
                  {activeEventModal.sources.map((src, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#f5ecda] border border-[#dcc8a4] text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-[#231b12]">
                          {src.title} {src.author && <span className="text-[#6f5d47] font-normal">by {src.author}</span>}
                        </div>
                        <div className="text-[11px] text-[#6f5d47] font-mono mt-0.5">{src.citation}</div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#fffdf8] text-[#92400e] border border-[#d5bf97]">
                        {src.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#dcc8a4]">
                <span className="text-xs text-[#6f5d47]">Related Entities:</span>
                <div className="flex flex-wrap gap-2">
                  {activeEventModal.relatedEntities.map((ent, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded bg-[#efe3cc] text-[#3e3121]">
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
