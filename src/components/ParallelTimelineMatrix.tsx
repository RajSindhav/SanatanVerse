import React, { useMemo, useState } from 'react';
import {
  Search,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Plus,
  LogIn,
  LogOut,
  ShieldCheck,
  Film,
  Trash2,
} from 'lucide-react';
import {
  EvidenceLabel,
  ParallelEraRecord,
  TimelineEvent,
  TimelineTrack,
  TopicMediaType,
} from '../types/index.ts';
import {
  filterTimelineEvents,
  getDataTypeLabel,
  formatTimelineDateDisplay,
} from '../utils/sanatanLogic.ts';
import { collectAllTopics, summarizeMediaCounts } from '../utils/comicStudioLogic.ts';
import { COVER_PRESET_IMAGES } from '../utils/coverArt.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useCatalog } from '../context/CatalogContext.tsx';
import { GlossaryText } from './GlossaryText.tsx';

interface ParallelTimelineMatrixProps {
  parallelEras: ParallelEraRecord[];
  activeTrack: TimelineTrack;
  onTrackChange: (track: TimelineTrack) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedEraId: string;
  onEraChange: (eraId: string) => void;
  selectedEvidence: EvidenceLabel | 'all';
  onEvidenceChange: (label: EvidenceLabel | 'all') => void;
  viewMode: 'timeline' | 'comics';
  onViewModeChange: (mode: 'timeline' | 'comics') => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onOpenTopicMedia: (topic: TimelineEvent, startInComposer?: boolean) => void;
  onOpenAddTopicModal: (track?: 'sacred' | 'scientific' | 'historical', eraId?: string) => void;
}

const EVIDENCE_OPTIONS: EvidenceLabel[] = [
  'Well established',
  'Estimated date',
  'Traditional chronology',
  'Textual evidence',
  'Debated',
  'Unverified claim',
];

const MEDIA_FORMAT_FILTERS: Array<'all' | TopicMediaType> = [
  'all',
  'Comic Issue',
  'Motion Comic',
  'Graphic Novel',
  'Concept Art',
  'Audio Narration',
  'Video Teaser',
  'Research Sourcebook',
];

export const ParallelTimelineMatrix: React.FC<ParallelTimelineMatrixProps> = ({
  parallelEras,
  activeTrack,
  onTrackChange,
  searchQuery,
  onSearchChange,
  selectedEraId,
  onEraChange,
  selectedEvidence,
  onEvidenceChange,
  viewMode,
  onViewModeChange,
  onSelectEvent,
  onOpenTopicMedia,
  onOpenAddTopicModal,
}) => {
  const { user, isAdmin, signInWithGoogle, signOutUser, authError } = useAuth();
  const { customTopics, mediaByTopic, allMedia, deleteTopicAsAdmin } = useCatalog();

  const [selectedMediaFormat, setSelectedMediaFormat] = useState<'all' | TopicMediaType>('all');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const combinedTopics = useMemo(
    () => collectAllTopics(parallelEras, customTopics),
    [parallelEras, customTopics]
  );

  const filteredEvents = useMemo(
    () =>
      filterTimelineEvents(combinedTopics, {
        track: activeTrack,
        eraId: selectedEraId,
        searchQuery,
        evidenceLabel: selectedEvidence,
      }),
    [combinedTopics, activeTrack, selectedEraId, searchQuery, selectedEvidence]
  );

  const matchingEventIds = useMemo(
    () => new Set(filteredEvents.map((e) => e.id)),
    [filteredEvents]
  );

  const topicsById = useMemo(() => {
    const map = new Map<string, TimelineEvent & { eraNumber: number; eraRange: string }>();
    for (const topic of combinedTopics) {
      map.set(topic.id, topic);
    }
    return map;
  }, [combinedTopics]);

  const visibleParallelEras = useMemo(() => {
    return parallelEras.filter((record) => {
      if (selectedEraId !== 'all' && record.era.id !== selectedEraId) {
        return false;
      }
      return combinedTopics.some(
        (evt) => evt.eraId === record.era.id && matchingEventIds.has(evt.id)
      );
    });
  }, [parallelEras, combinedTopics, selectedEraId, matchingEventIds]);

  const filteredComicsLibrary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allMedia.filter((item) => {
      if (activeTrack !== 'all' && item.track !== activeTrack) {
        return false;
      }
      if (selectedMediaFormat !== 'all' && item.mediaType !== selectedMediaFormat) {
        return false;
      }
      const parentTopic = topicsById.get(item.topicId);
      if (selectedEraId !== 'all' && parentTopic?.eraId !== selectedEraId) {
        return false;
      }
      if (q) {
        const hay = `${item.title} ${item.sanskritTitle || ''} ${item.synopsis} ${item.creatorName} ${
          parentTopic?.title || ''
        } ${item.mediaType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allMedia, activeTrack, selectedMediaFormat, selectedEraId, searchQuery, topicsById]);

  const overallMediaSummary = useMemo(() => summarizeMediaCounts(allMedia), [allMedia]);

  const hasActiveFilter =
    activeTrack !== 'all' ||
    selectedEraId !== 'all' ||
    selectedEvidence !== 'all' ||
    selectedMediaFormat !== 'all' ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    onTrackChange('all');
    onEraChange('all');
    onEvidenceChange('all');
    setSelectedMediaFormat('all');
    onSearchChange('');
  };

  const trackButtons: Array<{ id: TimelineTrack; label: string }> = [
    { id: 'all', label: 'All 3 Parallel' },
    { id: 'sacred', label: 'Sacred' },
    { id: 'scientific', label: 'Scientific' },
    { id: 'historical', label: 'Historical' },
  ];

  const getTrackAccent = (track: 'sacred' | 'scientific' | 'historical') => {
    if (track === 'sacred') return 'text-[#a63d08]';
    if (track === 'scientific') return 'text-[#155e75]';
    return 'text-[#0f6b52]';
  };

  const getTrackLabel = (track: 'sacred' | 'scientific' | 'historical') => {
    if (track === 'sacred') return 'Sacred';
    if (track === 'scientific') return 'Scientific';
    return 'Historical';
  };

  return (
    <section
      id="parallel-timeline-section"
      className="scroll-mt-16 py-16 sm:py-24 border-b border-[#dcc8a4] bg-[#f3ead8]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Museum Manuscript Header & Mode Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#b45309]">
              {viewMode === 'comics'
                ? 'Comics & Multimedia Across All 3 Tracks'
                : 'Chronological Overview & Comic Studio'}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#231b12] tracking-tight text-balance">
              {viewMode === 'comics'
                ? 'Comics & Media Catalog by Timeline'
                : 'Creation to Modern Day Across Three Tracks'}
            </h2>
            <p className="text-sm sm:text-base text-[#5a4b38] leading-relaxed">
              {viewMode === 'comics'
                ? `Explore ${overallMediaSummary.total} comics, motion issues, and media editions across Sacred, Scientific, and Historical topics—or add multiple new comics per topic.`
                : 'Switch between Sacred, Scientific, and Historical lenses, open Comics & Media attached to any topic, or inspect full evidence and source records.'}
            </p>
          </div>

          {/* Right Controls: View Switcher + Track Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-auto shrink-0 max-w-full">
            <div
              role="tablist"
              aria-label="Timeline or Comics Hub View"
              className="inline-flex items-center gap-1 p-1 bg-[#e8dac0] border border-[#d4bd95] rounded-lg shrink-0"
            >
              <button
                role="tab"
                aria-selected={viewMode === 'timeline'}
                onClick={() => onViewModeChange('timeline')}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'timeline'
                    ? 'bg-[#fbf7ee] text-[#231b12] font-semibold shadow-xs border border-[#d6bf97]'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
                }`}
              >
                Timeline Grid
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'comics'}
                onClick={() => onViewModeChange('comics')}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                  viewMode === 'comics'
                    ? 'bg-[#b45309] text-[#fffaf0] font-semibold shadow-xs'
                    : 'text-[#5a4b38] hover:text-[#231b12]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Comics Hub ({overallMediaSummary.total})</span>
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Timeline Track Switcher"
              className="inline-flex items-center gap-1 p-1 bg-[#e8dac0] border border-[#d4bd95] rounded-lg shrink-0 overflow-x-auto max-w-full"
            >
              {trackButtons.map((btn) => {
                const isSelected = activeTrack === btn.id;
                return (
                  <button
                    key={btn.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onTrackChange(btn.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45309] ${
                      isSelected
                        ? 'bg-[#1b2744] text-[#fcf7ec] font-semibold shadow-xs'
                        : 'text-[#5a4b38] hover:text-[#231b12]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean Studio & Admin Controls Strip */}
        <div className="px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-[0_4px_16px_-6px_rgba(74,47,16,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[#5a4b38]">
            <span className="text-[#231b12] font-semibold">
              {overallMediaSummary.comicCount} Comics · {overallMediaSummary.otherMediaCount} Other Media
            </span>
            <span aria-hidden="true" className="text-[#c5af88]">·</span>
            <span>{combinedTopics.length} Timeline Topics</span>
            {customTopics.length > 0 && (
              <>
                <span aria-hidden="true" className="text-[#c5af88]">·</span>
                <span className="text-[#b45309] font-medium">{customTopics.length} Custom Admin Topics</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {authError && <span className="text-rose-700">{authError}</span>}

            {isAdmin && (
              <button
                type="button"
                onClick={() =>
                  onOpenAddTopicModal(
                    activeTrack === 'all' ? 'sacred' : activeTrack,
                    selectedEraId === 'all' ? 'cosmic-origins' : selectedEraId
                  )
                }
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2.5">
                <span className="text-[#3e3121] inline-flex items-center gap-1.5">
                  {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#b45309]" />}
                  <span>
                    {isAdmin ? 'Admin' : 'Creator'}:{' '}
                    {user.displayName || user.email?.split('@')[0] || 'Signed In'}
                  </span>
                </span>
                {!isAdmin && (
                  <span className="text-[#8a7558] hidden sm:inline">
                    · New topics: Admin only
                  </span>
                )}
                <button
                  type="button"
                  onClick={signOutUser}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5a4b38] hover:text-[#231b12] border border-[#d6c098] hover:border-[#b45309]/50 bg-[#f5ecda] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#3e3121] hover:text-[#92400e] border border-[#d6c098] hover:border-[#b45309]/60 bg-[#f5ecda] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-[#b45309]" />
                <span>Studio Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Single-Row Search & Filter Bar */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-[0_4px_16px_-6px_rgba(74,47,16,0.08)] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#8c775a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                viewMode === 'comics'
                  ? 'Search comic titles, formats, creators, or topics...'
                  : 'Search events, people, texts, places, or sources...'
              }
              aria-label="Search timeline and comics"
              className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-xs sm:text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309] transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedEraId}
              onChange={(e) => onEraChange(e.target.value)}
              aria-label="Filter by chronological era"
              className="w-full px-3 py-2 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-xs sm:text-sm text-[#231b12] focus:outline-none focus:border-[#b45309]"
            >
              <option value="all">All Eras (01–10)</option>
              {parallelEras.map((record) => (
                <option key={record.era.id} value={record.era.id}>
                  {String(record.eraNumber).padStart(2, '0')}. {record.era.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            {viewMode === 'comics' ? (
              <select
                value={selectedMediaFormat}
                onChange={(e) =>
                  setSelectedMediaFormat(e.target.value as 'all' | TopicMediaType)
                }
                aria-label="Filter by media format"
                className="w-full px-3 py-2 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-xs sm:text-sm text-[#231b12] focus:outline-none focus:border-[#b45309]"
              >
                <option value="all">All Media Formats</option>
                {MEDIA_FORMAT_FILTERS.filter((f) => f !== 'all').map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedEvidence}
                onChange={(e) => onEvidenceChange(e.target.value as EvidenceLabel | 'all')}
                aria-label="Filter by evidence label"
                className="w-full px-3 py-2 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-xs sm:text-sm text-[#231b12] focus:outline-none focus:border-[#b45309]"
              >
                <option value="all">All Evidence Labels</option>
                {EVIDENCE_OPTIONS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-1 flex items-center justify-end">
            {hasActiveFilter ? (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#b45309] hover:text-[#92400e] whitespace-nowrap py-1.5 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45309]"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            ) : (
              <span className="text-xs font-mono tabular-nums text-[#6f5d47] whitespace-nowrap">
                {viewMode === 'comics'
                  ? `${filteredComicsLibrary.length} items`
                  : `${filteredEvents.length} entries`}
              </span>
            )}
          </div>
        </div>

        {/* View Mode 1: Comics & Multimedia Hub Across All 3 Timelines */}
        {viewMode === 'comics' ? (
          filteredComicsLibrary.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs text-center space-y-4">
              <p className="text-sm text-[#5a4b38]">
                No comics or media match your current track, era, or format filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComicsLibrary.map((item) => {
                const parentTopic = topicsById.get(item.topicId);
                const coverMeta = COVER_PRESET_IMAGES[item.coverPreset];
                const coverFailed = imgErrors[item.id];
                const topicMediaCount = (mediaByTopic[item.topicId] || []).length;

                return (
                  <article
                    key={item.id}
                    className="rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-[0_8px_24px_-8px_rgba(74,47,16,0.10)] overflow-hidden flex flex-col justify-between hover:border-[#b45309]/50 hover:shadow-[0_14px_30px_-8px_rgba(146,64,14,0.14)] transition-all"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#1b2744] border-b border-[#dcc8a4] overflow-hidden">
                        {!coverFailed && coverMeta ? (
                          <img
                            src={coverMeta.src}
                            alt={coverMeta.alt}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                            }
                            className="w-full h-full object-cover scale-[1.06]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b2744] to-[#2d3e66]">
                            <Film className="w-8 h-8 text-[#f4c86a]" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6f5d47]">
                          <span className={`font-semibold uppercase tracking-wider ${getTrackAccent(item.track)}`}>
                            {getTrackLabel(item.track)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#92400e] font-medium">{item.mediaType}</span>
                          {item.issueNumber && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{item.issueNumber}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{item.status}</span>
                        </div>

                        <h3 className="font-serif text-lg font-medium text-[#231b12] leading-snug">
                          {item.title}
                        </h3>

                        {parentTopic && (
                          <div className="text-xs text-[#6f5d47]">
                            Topic: {parentTopic.title}
                          </div>
                        )}

                        <p className="text-sm text-[#554736] leading-relaxed line-clamp-3">
                          {item.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-[#e5d6ba] bg-[#f5ecda] flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#6f5d47] truncate">
                        {item.comicPanels.length} panels · {topicMediaCount} on topic
                      </span>
                      {parentTopic && (
                        <button
                          onClick={() => onOpenTopicMedia(parentTopic)}
                          className="inline-flex items-center gap-1 text-[#b45309] hover:text-[#92400e] font-semibold whitespace-nowrap shrink-0"
                        >
                          <span>Open Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="p-12 rounded-2xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs text-center space-y-4">
            <p className="text-sm text-[#5a4b38]">
              No chronological entries match your current search or filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] transition-colors"
            >
              Clear Search &amp; Filters
            </button>
          </div>
        ) : activeTrack === 'all' ? (
          /* Mode A: Parallel 3-Track Chronological Overview */
          <div className="space-y-8">
            {visibleParallelEras.map((record) => {
              const trackColumns: Array<'sacred' | 'scientific' | 'historical'> = [
                'sacred',
                'scientific',
                'historical',
              ];

              return (
                <div
                  key={record.era.id}
                  className="rounded-2xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-[0_8px_28px_-8px_rgba(74,47,16,0.10)] overflow-hidden"
                >
                  {/* Era Row Header */}
                  <div className="px-6 py-4 bg-[#f2e7d2] border-b border-[#dcc8a4] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#b45309]">
                        {String(record.eraNumber).padStart(2, '0')}.
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#231b12]">
                        {record.era.name}
                      </h3>
                      <span className="text-xs font-serif text-[#786144]">
                        {record.era.sanskritName}
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#6f5d47]">
                      {record.era.approximateRange}
                    </span>
                  </div>

                  {/* 3 Hairline-Separated Parallel Perspectives */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#e5d6ba]">
                    {trackColumns.map((trackKey) => {
                      const trackEvents = combinedTopics.filter(
                        (e) => e.eraId === record.era.id && e.track === trackKey
                      );

                      return (
                        <div key={trackKey} className="divide-y divide-[#e5d6ba] flex flex-col">
                          {trackEvents.map((event) => {
                            const matches = matchingEventIds.has(event.id);
                            const dataMeta = getDataTypeLabel(trackKey);
                            const dateInfo = formatTimelineDateDisplay(event, trackKey);
                            const mediaCount = (mediaByTopic[event.id] || []).length;

                            return (
                              <div
                                key={event.id}
                                className={`p-6 flex-1 flex flex-col justify-between space-y-5 transition-opacity ${
                                  matches ? 'opacity-100' : 'opacity-40'
                                }`}
                              >
                                <div className="space-y-3">
                                  {/* Unboxed Metadata Line */}
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6f5d47]">
                                    <span
                                      className={`font-semibold uppercase tracking-wider ${getTrackAccent(
                                        trackKey
                                      )}`}
                                    >
                                      {dataMeta.shortLabel}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>{event.evidenceLabel}</span>
                                    {event.isCustomTopic && (
                                      <>
                                        <span aria-hidden="true">·</span>
                                        <span className="text-[#b45309] font-medium">Admin Topic</span>
                                      </>
                                    )}
                                  </div>

                                  <h4 className="font-serif text-base sm:text-lg font-medium text-[#231b12] leading-snug">
                                    {event.title}
                                  </h4>

                                  <div className="text-xs font-mono tabular-nums text-[#7a6449]">
                                    {dateInfo.primaryDate}
                                  </div>

                                  <p className="text-sm text-[#4e4030] leading-relaxed">
                                    <GlossaryText text={event.summary} />
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-[#ebdcb9] flex flex-wrap items-center justify-between gap-2 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => onOpenTopicMedia(event)}
                                    className="inline-flex items-center gap-1.5 text-[#5a4b38] hover:text-[#92400e] font-medium transition-colors whitespace-nowrap shrink-0"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-[#b45309]" />
                                    <span>Comics &amp; Media ({mediaCount})</span>
                                  </button>

                                  <div className="flex items-center gap-2.5">
                                    {event.isCustomTopic && isAdmin && (
                                      <button
                                        type="button"
                                        onClick={() => void deleteTopicAsAdmin(event.id)}
                                        title="Delete custom admin topic"
                                        className="text-[#8a7558] hover:text-rose-700 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => onSelectEvent(event)}
                                      className="inline-flex items-center gap-1 text-[#b45309] hover:text-[#92400e] font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
                                    >
                                      <span>Event Details</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Mode B: Single Switchable Chronological Track View */
          <div className="divide-y divide-[#e5d6ba] border border-[#dcc8a4] rounded-2xl bg-[#fbf7ee] shadow-[0_8px_28px_-8px_rgba(74,47,16,0.10)] overflow-hidden">
            {filteredEvents.map((event) => {
              const matchingEra = parallelEras.find((r) => r.era.id === event.eraId);
              const dataMeta = getDataTypeLabel(event.track);
              const dateInfo = formatTimelineDateDisplay(event, event.track);
              const mediaCount = (mediaByTopic[event.id] || []).length;

              return (
                <div
                  key={event.id}
                  className="p-6 sm:p-7 hover:bg-[#f5ecda] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5 max-w-3xl">
                    {/* Clean Unboxed Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6f5d47]">
                      <span className="font-mono tabular-nums text-[#7a6449]">
                        {matchingEra
                          ? `Epoch ${String(matchingEra.eraNumber).padStart(2, '0')}`
                          : event.eraName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold uppercase tracking-wider ${getTrackAccent(
                          event.track
                        )}`}
                      >
                        {dataMeta.shortLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#4e4030]">{event.evidenceLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-[#7a6449]">
                        {dateInfo.primaryDate}
                      </span>
                      {event.isCustomTopic && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#b45309] font-medium">Admin Topic</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#231b12]">
                      {event.title}
                    </h3>

                    <p className="text-sm text-[#4e4030] leading-relaxed">
                      <GlossaryText text={event.summary} />
                    </p>

                    <div className="text-xs text-[#7a6449] pt-1">
                      Related: {event.relatedEntities.slice(0, 4).join(' · ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenTopicMedia(event)}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#fffdf8] border border-[#d4bd95] text-[#3e3121] hover:border-[#b45309] hover:text-[#92400e] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Comics &amp; Media ({mediaCount})</span>
                    </button>

                    <button
                      onClick={() => onSelectEvent(event)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>View Event Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
