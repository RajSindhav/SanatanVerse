import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle, BookOpen, ExternalLink, Plus, Film, ArrowRight } from 'lucide-react';
import { ParallelEraRecord, TimelineEvent } from '../types/index.ts';
import {
  getEvidenceLabelMeta,
  getDataTypeLabel,
  getUncertaintySummary,
  formatTimelineDateDisplay,
  validateCorrectionFeedback,
} from '../utils/sanatanLogic.ts';
import { useCatalog } from '../context/CatalogContext.tsx';
import { COVER_PRESET_IMAGES } from '../utils/coverArt.ts';
import { GlossaryText } from './GlossaryText.tsx';

interface FeedbackEntry {
  id: string;
  eventId: string;
  category: string;
  note: string;
  suggestedSource?: string;
  submittedAt: string;
}

interface EventDetailPageProps {
  event: TimelineEvent;
  eraRecord?: ParallelEraRecord;
  onBack: () => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onSearchEntity: (entity: string) => void;
  onOpenTopicMedia: (topic: TimelineEvent, startInComposer?: boolean) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  eraRecord,
  onBack,
  onSelectEvent,
  onSearchEntity,
  onOpenTopicMedia,
}) => {
  const { mediaByTopic } = useCatalog();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [category, setCategory] = useState<string>('Chronology / Date Correction');
  const [note, setNote] = useState<string>('');
  const [suggestedSource, setSuggestedSource] = useState<string>('');
  const [contributorEmail, setContributorEmail] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedNotes, setSubmittedNotes] = useState<FeedbackEntry[]>([]);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLastSubmittedId(null);
    setSubmitError(null);
    setFormErrors({});

    const storageKey = `sanatanverse_feedback_${event.id}`;
    const readLocalNotes = (): FeedbackEntry[] => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
      } catch {
        return [];
      }
    };

    let active = true;
    fetch(`/api/feedback?eventId=${encodeURIComponent(event.id)}`)
      .then(async (res) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        if (!res.ok || !isJson) {
          return { items: readLocalNotes() };
        }
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.items)) {
          setSubmittedNotes(data.items);
        }
      })
      .catch(() => {
        if (active) {
          setSubmittedNotes(readLocalNotes());
        }
      });

    return () => {
      active = false;
    };
  }, [event.id]);

  const dataTypeMeta = getDataTypeLabel(event.track);
  const evidenceMeta = getEvidenceLabelMeta(event.evidenceLabel);
  const dateDisplay = formatTimelineDateDisplay(event, event.track);
  const uncertaintyText = getUncertaintySummary(event);

  const trackColorClass =
    event.track === 'sacred'
      ? 'text-[#a63d08]'
      : event.track === 'scientific'
      ? 'text-[#155e75]'
      : 'text-[#0f6b52]';

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCorrectionFeedback({
      eventId: event.id,
      category,
      note,
      suggestedSource,
      contributorEmail,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    const saveLocalEntry = () => {
      const fallbackEntry: FeedbackEntry = {
        id: `COR-${Math.floor(1000 + Math.random() * 9000)}`,
        eventId: event.id,
        category,
        note: note.trim(),
        suggestedSource: suggestedSource.trim() || undefined,
        submittedAt: new Date().toISOString(),
      };
      try {
        const storageKey = `sanatanverse_feedback_${event.id}`;
        const existingRaw = localStorage.getItem(storageKey);
        const existing: FeedbackEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(storageKey, JSON.stringify([fallbackEntry, ...existing].slice(0, 25)));
      } catch {
        // Ignore storage quota errors
      }
      return fallbackEntry;
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          category,
          note,
          suggestedSource,
          contributorEmail,
        }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      if (!isJson || response.status === 404 || response.status === 405) {
        const localEntry = saveLocalEntry();
        setSubmittedNotes((prev) => [localEntry, ...prev]);
        setLastSubmittedId(localEntry.id);
        setNote('');
        setSuggestedSource('');
        setContributorEmail('');
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.entry) {
        throw new Error(data.error || 'Unable to submit feedback.');
      }

      setSubmittedNotes((prev) => [data.entry, ...prev]);
      setLastSubmittedId(data.entry.id);
      setNote('');
      setSuggestedSource('');
      setContributorEmail('');
    } catch (err: unknown) {
      if (err instanceof TypeError || (err instanceof SyntaxError)) {
        const localEntry = saveLocalEntry();
        setSubmittedNotes((prev) => [localEntry, ...prev]);
        setLastSubmittedId(localEntry.id);
        setNote('');
        setSuggestedSource('');
        setContributorEmail('');
      } else {
        setSubmitError(err instanceof Error ? err.message : 'Unable to submit correction.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="py-12 sm:py-16 bg-[#f3ead8] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Breadcrumb & Same-Era Track Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dcc8a4]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5a4b38] hover:text-[#92400e] transition-colors whitespace-nowrap shrink-0 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45309] rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chronological Overview</span>
          </button>

          {eraRecord && (
            <div className="flex items-center gap-1 p-1 bg-[#e8dac0] border border-[#d4bd95] rounded-lg self-start sm:self-auto">
              {(
                [
                  { key: 'sacred', label: 'Sacred View', target: eraRecord.sacredPointOfView },
                  { key: 'scientific', label: 'Scientific View', target: eraRecord.scientificPointOfView },
                  { key: 'historical', label: 'Historical View', target: eraRecord.historicalPointOfView },
                ] as const
              ).map((tab) => {
                const isActive = event.track === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => onSelectEvent(tab.target)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1b2744] text-[#fcf7ec] font-semibold shadow-xs'
                        : 'text-[#5a4b38] hover:text-[#231b12]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Title & Editorial Metadata */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6f5d47]">
            <span className={`font-semibold uppercase tracking-wider ${trackColorClass}`}>
              {dataTypeMeta.shortLabel} Track
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {eraRecord ? `Epoch ${String(eraRecord.eraNumber).padStart(2, '0')} · ` : ''}
              {event.eraName}
            </span>
            {event.sanskritTitle && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-serif text-[#3e3121]">{event.sanskritTitle}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#231b12] tracking-tight leading-[1.15] text-balance">
            {event.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4e4030] leading-relaxed max-w-3xl">
            <GlossaryText text={event.summary} />
          </p>
        </header>

        {/* Accession & Classification Grid */}
        <section
          aria-label="Chronological Classification"
          className="rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-[0_6px_22px_-8px_rgba(74,47,16,0.10)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5d6ba]"
        >
          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#8a7558] font-medium">Data Type</div>
            <div className="text-sm font-semibold text-[#231b12]">{dataTypeMeta.dataType}</div>
            <div className="text-xs text-[#5a4b38]">{dataTypeMeta.methodology}</div>
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#8a7558] font-medium">Primary Chronology</div>
            <div className="text-sm font-semibold text-[#231b12] tabular-nums">
              {dateDisplay.primaryDate}
            </div>
            {dateDisplay.secondaryDate && (
              <div className="text-xs text-[#5a4b38] tabular-nums">{dateDisplay.secondaryDate}</div>
            )}
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#8a7558] font-medium">Evidence Label</div>
            <div className="text-sm font-semibold text-[#b45309]">{event.evidenceLabel}</div>
            <div className="text-xs text-[#5a4b38]">{evidenceMeta.definition}</div>
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#8a7558] font-medium">
              Text / Stratigraphic Layer
            </div>
            <div className="text-sm font-semibold text-[#231b12] tabular-nums">
              {event.textCompositionDate || event.historicalDateRange || 'Documented Horizon'}
            </div>
            <div className="text-xs text-[#7a6449]">Cross-track reference preserved</div>
          </div>
        </section>

        {/* Uncertainty & Methodology Transparency */}
        <section className="p-6 rounded-xl bg-[#f5ebd8] border border-[#d6bd93] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#92400e]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Uncertainty &amp; Methodological Note</span>
          </div>
          <p className="text-sm text-[#4a3b2c] leading-relaxed max-w-3xl">{uncertaintyText}</p>
        </section>

        {/* Main Explanation & Significance */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-2">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#231b12]">
                Detailed Record
              </h2>
              <p className="text-base text-[#3b2f22] leading-[1.75] max-w-2xl">
                <GlossaryText text={event.fullExplanation} />
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#dcc8a4]">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#231b12]">
                Cultural Significance
              </h2>
              <p className="text-base text-[#3b2f22] leading-[1.75] max-w-2xl">
                <GlossaryText text={event.culturalSignificance} />
              </p>
            </div>

            {/* Comics & Other Media Designed for This Topic */}
            <div className="space-y-4 pt-6 border-t border-[#dcc8a4]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#b45309]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#231b12]">
                    Comics &amp; Other Media ({(mediaByTopic[event.id] || []).length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTopicMedia(event, true)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] shadow-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Comic / Media</span>
                </button>
              </div>

              {(mediaByTopic[event.id] || []).length === 0 ? (
                <div className="p-6 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-[#5a4b38]">
                    No comics or multimedia releases have been attached to this topic yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenTopicMedia(event, true)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#f5ecda] border border-[#d4bd95] text-[#231b12] hover:border-[#b45309] whitespace-nowrap self-start"
                  >
                    Create First Issue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(mediaByTopic[event.id] || []).map((item) => {
                    const coverMeta = COVER_PRESET_IMAGES[item.coverPreset];
                    const coverFailed = imgErrors[item.id];
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#b45309]/50 transition-colors"
                      >
                        <div>
                          <div className="aspect-[16/9] bg-[#1b2744] border-b border-[#dcc8a4] overflow-hidden">
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
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b2744] to-[#2c3d63]">
                                <BookOpen className="w-7 h-7 text-[#f4c86a]" />
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6f5d47]">
                              <span className="text-[#92400e] font-semibold">{item.mediaType}</span>
                              {item.issueNumber && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono">{item.issueNumber}</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span>{item.status}</span>
                            </div>

                            <h3 className="font-serif text-base font-medium text-[#231b12] leading-snug">
                              {item.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-[#554736] leading-relaxed line-clamp-2">
                              {item.synopsis}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-3 border-t border-[#e5d6ba] bg-[#f5ecda] flex items-center justify-between text-xs">
                          <span className="text-[#6f5d47]">
                            {item.comicPanels.length}{' '}
                            {item.comicPanels.length === 1 ? 'panel' : 'panels'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenTopicMedia(event)}
                            className="inline-flex items-center gap-1 text-[#b45309] hover:text-[#92400e] font-semibold"
                          >
                            <span>Read / Edit Studio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Source References & Bibliography */}
            <div className="space-y-4 pt-6 border-t border-[#dcc8a4]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#b45309]" />
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#231b12]">
                  Source References &amp; Bibliography
                </h2>
              </div>

              <ol className="divide-y divide-[#e5d6ba] border border-[#dcc8a4] rounded-xl bg-[#fbf7ee] shadow-xs">
                {event.sources.map((src, idx) => (
                  <li key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-[#231b12]">
                        <span className="font-mono tabular-nums text-[#b45309] mr-2">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {src.title}
                        {src.author && (
                          <span className="text-[#6f5d47] font-normal"> — {src.author}</span>
                        )}
                      </div>
                      <div className="text-xs text-[#5a4b38] pl-7">{src.citation}</div>
                    </div>

                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0 text-xs text-[#6f5d47]">
                      <span className="capitalize">{src.type} source</span>
                      {src.link && (
                        <a
                          href={src.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#b45309] hover:text-[#92400e] font-medium inline-flex items-center gap-1"
                        >
                          <span>Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Margin */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#6f5d47]">
                  Related Entities
                </div>
                <p className="text-xs text-[#7a6449]">
                  People, texts, places &amp; concepts. Click any item to filter the timeline.
                </p>
              </div>

              <ul className="divide-y divide-[#ebdcb9]">
                {event.relatedEntities.map((entity) => (
                  <li key={entity}>
                    <button
                      onClick={() => onSearchEntity(entity)}
                      className="w-full py-2.5 text-left text-sm text-[#3e3121] hover:text-[#92400e] transition-colors flex items-center justify-between group"
                    >
                      <span>{entity}</span>
                      <span className="text-xs text-[#8c775a] group-hover:text-[#b45309]">
                        Filter →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {eraRecord && (
              <div className="p-6 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#6f5d47]">
                  Tri-Perspective Convergence
                </div>
                <p className="text-xs sm:text-sm text-[#4e4030] leading-relaxed">
                  <GlossaryText text={eraRecord.convergenceHighlight} />
                </p>
              </div>
            )}
          </aside>
        </section>

        {/* Correction & Feedback Mechanism */}
        <section className="pt-8 border-t border-[#dcc8a4] space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#b45309]">
              Scholarly Review
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#231b12]">
              Submit a Correction or Feedback
            </h2>
            <p className="text-sm text-[#5a4b38]">
              Notice a date discrepancy, missing primary citation, or translation nuance? Share a
              correction or suggested bibliography entry for this record.
            </p>
          </div>

          <form
            onSubmit={handleFeedbackSubmit}
            noValidate
            className="p-6 sm:p-8 rounded-xl bg-[#fbf7ee] border border-[#dcc8a4] shadow-xs space-y-5 max-w-3xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                  Correction Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-sm text-[#231b12] focus:outline-none focus:border-[#b45309]"
                >
                  <option value="Chronology / Date Correction">Chronology / Date Correction</option>
                  <option value="Source / Bibliography Addition">Source / Bibliography Addition</option>
                  <option value="Evidence / Uncertainty Label">Evidence / Uncertainty Label</option>
                  <option value="Sanskrit / Spelling Refinement">Sanskrit / Spelling Refinement</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                  Contributor Email (Optional)
                </label>
                <input
                  type="email"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309]"
                />
                {formErrors.contributorEmail && (
                  <p className="text-xs text-rose-700 mt-1">{formErrors.contributorEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                Proposed Correction or Feedback
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe what should be updated or clarified..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309]"
              />
              {formErrors.note && (
                <p className="text-xs text-rose-700 mt-1">{formErrors.note}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3e3121] mb-1.5">
                Suggested Primary Source / Citation (Optional)
              </label>
              <input
                type="text"
                value={suggestedSource}
                onChange={(e) => setSuggestedSource(e.target.value)}
                placeholder="e.g. Epigraphia Indica Vol. VI, or BORI Critical Edition verse"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#fffdf8] border border-[#d5bf97] text-sm text-[#231b12] placeholder:text-[#8d795e] focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-[#b45309] text-[#fffaf0] hover:bg-[#92400e] shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Correction / Feedback'}
              </button>

              {lastSubmittedId && (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Recorded ({lastSubmittedId}). Thank you for improving the archive.</span>
                </div>
              )}

              {submitError && (
                <div className="text-xs text-rose-700">{submitError}</div>
              )}
            </div>
          </form>

          {/* Previously Submitted Notes for This Event */}
          {submittedNotes.length > 0 && (
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#6f5d47]">
                Recent Community Notes ({submittedNotes.length})
              </div>
              <div className="divide-y divide-[#e5d6ba] border border-[#dcc8a4] rounded-xl bg-[#fbf7ee] shadow-xs">
                {submittedNotes.map((item) => (
                  <div key={item.id} className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#6f5d47]">
                      <span className="text-[#b45309] font-semibold">{item.category}</span>
                      <span className="font-mono tabular-nums text-[#8a7558]">{item.id}</span>
                    </div>
                    <p className="text-sm text-[#3e3121]">{item.note}</p>
                    {item.suggestedSource && (
                      <div className="text-xs text-[#7a6449]">
                        Citation: {item.suggestedSource}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
};
