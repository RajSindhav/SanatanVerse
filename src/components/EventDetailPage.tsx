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
      ? 'text-amber-400'
      : event.track === 'scientific'
      ? 'text-sky-400'
      : 'text-emerald-400';

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
    <article className="py-12 sm:py-16 bg-[#090807] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Breadcrumb & Same-Era Track Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-300 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chronological Overview</span>
          </button>

          {eraRecord && (
            <div className="flex items-center gap-1 p-1 bg-[#11100e] border border-stone-800 rounded-lg self-start sm:self-auto">
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
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'text-stone-400 hover:text-stone-100'
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
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <span className={`font-medium uppercase tracking-wider ${trackColorClass}`}>
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
                <span className="font-serif text-stone-300">{event.sanskritTitle}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100 tracking-tight leading-[1.15] text-balance">
            {event.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-3xl">
            <GlossaryText text={event.summary} />
          </p>
        </header>

        {/* Accession & Classification Grid (Data Type, Chronology, Evidence) */}
        <section
          aria-label="Chronological Classification"
          className="rounded-xl bg-[#11100e] border border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-800/80"
        >
          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-500">Data Type</div>
            <div className="text-sm font-medium text-stone-100">{dataTypeMeta.dataType}</div>
            <div className="text-xs text-stone-400">{dataTypeMeta.methodology}</div>
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-500">Primary Chronology</div>
            <div className="text-sm font-medium text-stone-100 tabular-nums">
              {dateDisplay.primaryDate}
            </div>
            {dateDisplay.secondaryDate && (
              <div className="text-xs text-stone-400 tabular-nums">{dateDisplay.secondaryDate}</div>
            )}
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-500">Evidence Label</div>
            <div className="text-sm font-medium text-amber-300">{event.evidenceLabel}</div>
            <div className="text-xs text-stone-400">{evidenceMeta.definition}</div>
          </div>

          <div className="p-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-stone-500">
              Text / Stratigraphic Layer
            </div>
            <div className="text-sm font-medium text-stone-100 tabular-nums">
              {event.textCompositionDate || event.historicalDateRange || 'Documented Horizon'}
            </div>
            <div className="text-xs text-stone-500">Cross-track reference preserved</div>
          </div>
        </section>

        {/* Uncertainty & Methodology Transparency */}
        <section className="p-6 rounded-xl bg-[#11100e] border border-stone-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-amber-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Uncertainty &amp; Methodological Note</span>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">{uncertaintyText}</p>
        </section>

        {/* Main Explanation & Significance */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-2">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                Detailed Record
              </h2>
              <p className="text-base text-stone-300 leading-[1.75] max-w-2xl">
                <GlossaryText text={event.fullExplanation} />
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-stone-800/80">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                Cultural Significance
              </h2>
              <p className="text-base text-stone-300 leading-[1.75] max-w-2xl">
                <GlossaryText text={event.culturalSignificance} />
              </p>
            </div>

            {/* Comics & Other Media Designed for This Topic */}
            <div className="space-y-4 pt-6 border-t border-stone-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                    Comics &amp; Other Media ({(mediaByTopic[event.id] || []).length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTopicMedia(event, true)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Comic / Media</span>
                </button>
              </div>

              {(mediaByTopic[event.id] || []).length === 0 ? (
                <div className="p-6 rounded-xl bg-[#11100e] border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-stone-400">
                    No comics or multimedia releases have been attached to this topic yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenTopicMedia(event, true)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 border border-stone-700 text-stone-100 hover:border-amber-400 whitespace-nowrap self-start"
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
                        className="rounded-xl bg-[#11100e] border border-stone-800/80 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-colors"
                      >
                        <div>
                          <div className="aspect-[16/9] bg-[#090807] border-b border-stone-800/80 overflow-hidden">
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
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950/60 to-stone-950">
                                <BookOpen className="w-7 h-7 text-amber-400/70" />
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
                              <span className="text-amber-400 font-medium">{item.mediaType}</span>
                              {item.issueNumber && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono">{item.issueNumber}</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span>{item.status}</span>
                            </div>

                            <h3 className="font-serif text-base font-medium text-stone-100 leading-snug">
                              {item.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed line-clamp-2">
                              {item.synopsis}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-3 border-t border-stone-800/60 flex items-center justify-between text-xs">
                          <span className="text-stone-500">
                            {item.comicPanels.length}{' '}
                            {item.comicPanels.length === 1 ? 'panel' : 'panels'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenTopicMedia(event)}
                            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
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
            <div className="space-y-4 pt-6 border-t border-stone-800/80">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                  Source References &amp; Bibliography
                </h2>
              </div>

              <ol className="divide-y divide-stone-800/70 border border-stone-800/80 rounded-xl bg-[#11100e]">
                {event.sources.map((src, idx) => (
                  <li key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-stone-100">
                        <span className="font-mono tabular-nums text-amber-400/90 mr-2">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {src.title}
                        {src.author && (
                          <span className="text-stone-400 font-normal"> — {src.author}</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400 pl-7">{src.citation}</div>
                    </div>

                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0 text-xs text-stone-500">
                      <span className="capitalize">{src.type} source</span>
                      {src.link && (
                        <a
                          href={src.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
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

          {/* Right Margin: Related People, Texts, Places & Concepts */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[#11100e] border border-stone-800/80 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Related Entities
                </div>
                <p className="text-xs text-stone-500">
                  People, texts, places &amp; concepts. Click any item to filter the timeline.
                </p>
              </div>

              <ul className="divide-y divide-stone-800/60">
                {event.relatedEntities.map((entity) => (
                  <li key={entity}>
                    <button
                      onClick={() => onSearchEntity(entity)}
                      className="w-full py-2.5 text-left text-sm text-stone-200 hover:text-amber-300 transition-colors flex items-center justify-between group"
                    >
                      <span>{entity}</span>
                      <span className="text-xs text-stone-500 group-hover:text-amber-300">
                        Filter →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {eraRecord && (
              <div className="p-6 rounded-xl bg-[#11100e] border border-stone-800/80 space-y-3">
                <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Tri-Perspective Convergence
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <GlossaryText text={eraRecord.convergenceHighlight} />
                </p>
              </div>
            )}
          </aside>
        </section>

        {/* Correction & Feedback Mechanism */}
        <section className="pt-8 border-t border-stone-800/80 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Scholarly Review
            </div>
            <h2 className="font-serif text-2xl font-semibold text-stone-100">
              Submit a Correction or Feedback
            </h2>
            <p className="text-sm text-stone-400">
              Notice a date discrepancy, missing primary citation, or translation nuance? Share a
              correction or suggested bibliography entry for this record.
            </p>
          </div>

          <form
            onSubmit={handleFeedbackSubmit}
            noValidate
            className="p-6 sm:p-8 rounded-xl bg-[#11100e] border border-stone-800/80 space-y-5 max-w-3xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Correction Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Chronology / Date Correction">Chronology / Date Correction</option>
                  <option value="Source / Bibliography Addition">Source / Bibliography Addition</option>
                  <option value="Evidence / Uncertainty Label">Evidence / Uncertainty Label</option>
                  <option value="Sanskrit / Spelling Refinement">Sanskrit / Spelling Refinement</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Contributor Email (Optional)
                </label>
                <input
                  type="email"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                {formErrors.contributorEmail && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.contributorEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Proposed Correction or Feedback
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe what should be updated or clarified..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
              />
              {formErrors.note && (
                <p className="text-xs text-rose-400 mt-1">{formErrors.note}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Suggested Primary Source / Citation (Optional)
              </label>
              <input
                type="text"
                value={suggestedSource}
                onChange={(e) => setSuggestedSource(e.target.value)}
                placeholder="e.g. Epigraphia Indica Vol. VI, or BORI Critical Edition verse"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Correction / Feedback'}
              </button>

              {lastSubmittedId && (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Recorded ({lastSubmittedId}). Thank you for improving the archive.</span>
                </div>
              )}

              {submitError && (
                <div className="text-xs text-rose-400">{submitError}</div>
              )}
            </div>
          </form>

          {/* Previously Submitted Notes for This Event */}
          {submittedNotes.length > 0 && (
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Recent Community Notes ({submittedNotes.length})
              </div>
              <div className="divide-y divide-stone-800/70 border border-stone-800/80 rounded-xl bg-[#11100e]">
                {submittedNotes.map((item) => (
                  <div key={item.id} className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="text-amber-300 font-medium">{item.category}</span>
                      <span className="font-mono tabular-nums text-stone-500">{item.id}</span>
                    </div>
                    <p className="text-sm text-stone-200">{item.note}</p>
                    {item.suggestedSource && (
                      <div className="text-xs text-stone-400">
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
