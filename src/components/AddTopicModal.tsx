import React, { useEffect, useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { EvidenceLabel } from '../types/index.ts';
import { TIMELINE_ERAS } from '../data/mockSanatanData.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useCatalog } from '../context/CatalogContext.tsx';
import { validateNewTopicInput } from '../utils/comicStudioLogic.ts';

interface AddTopicModalProps {
  isOpen: boolean;
  defaultTrack?: 'sacred' | 'scientific' | 'historical';
  defaultEraId?: string;
  onClose: () => void;
  onCreated?: (topicId: string) => void;
}

const EVIDENCE_OPTIONS: EvidenceLabel[] = [
  'Traditional chronology',
  'Well established',
  'Textual evidence',
  'Estimated date',
  'Debated',
  'Unverified claim',
];

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  defaultTrack = 'sacred',
  defaultEraId = 'cosmic-origins',
  onClose,
  onCreated,
}) => {
  const { isAdmin, user } = useAuth();
  const { addTopicAsAdmin } = useCatalog();

  const [track, setTrack] = useState<'sacred' | 'scientific' | 'historical'>(defaultTrack);
  const [eraId, setEraId] = useState<string>(defaultEraId);
  const [title, setTitle] = useState<string>('');
  const [sanskritTitle, setSanskritTitle] = useState<string>('');
  const [traditionalDate, setTraditionalDate] = useState<string>('');
  const [historicalDateRange, setHistoricalDateRange] = useState<string>('');
  const [textCompositionDate, setTextCompositionDate] = useState<string>('');
  const [evidenceLabel, setEvidenceLabel] = useState<EvidenceLabel>('Traditional chronology');
  const [summary, setSummary] = useState<string>('');
  const [fullExplanation, setFullExplanation] = useState<string>('');
  const [culturalSignificance, setCulturalSignificance] = useState<string>('');
  const [relatedEntitiesText, setRelatedEntitiesText] = useState<string>('');
  const [sourceTitle, setSourceTitle] = useState<string>('');
  const [sourceAuthor, setSourceAuthor] = useState<string>('');
  const [sourceCitation, setSourceCitation] = useState<string>('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setTrack(defaultTrack);
    setEraId(defaultEraId);
    setFormErrors({});
    setSubmitError(null);
  }, [isOpen, defaultTrack, defaultEraId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      sanskritTitle,
      eraId,
      track,
      traditionalDate,
      historicalDateRange,
      textCompositionDate,
      evidenceLabel,
      summary,
      fullExplanation,
      culturalSignificance,
      relatedEntitiesText,
      sourceTitle,
      sourceAuthor,
      sourceCitation,
    };

    const validation = validateNewTopicInput(payload);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await addTopicAsAdmin(payload);
      setTitle('');
      setSanskritTitle('');
      setTraditionalDate('');
      setHistoricalDateRange('');
      setTextCompositionDate('');
      setSummary('');
      setFullExplanation('');
      setCulturalSignificance('');
      setRelatedEntitiesText('');
      setSourceTitle('');
      setSourceAuthor('');
      setSourceCitation('');
      onCreated?.(created.id);
      onClose();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to save new timeline topic.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-topic-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#11100e] border border-stone-800 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-800/90 flex items-center justify-between bg-[#14120f]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 id="add-topic-modal-title" className="font-serif text-lg font-semibold text-stone-100">
              Add New Timeline Topic (Admin Only)
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Add Topic Modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!user || !isAdmin ? (
            <div className="p-6 rounded-xl bg-[#14120f] border border-stone-800 space-y-2 text-sm text-stone-300">
              <p className="font-semibold text-amber-400">Administrator Privileges Required</p>
              <p>
                Creating new topics across the Sacred, Scientific, and Historical timelines is
                restricted strictly to verified administrators.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Target Timeline Track *
                  </label>
                  <select
                    value={track}
                    onChange={(e) =>
                      setTrack(e.target.value as 'sacred' | 'scientific' | 'historical')
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="sacred">Sacred Track</option>
                    <option value="scientific">Scientific Track</option>
                    <option value="historical">Historical Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Chronological Era *
                  </label>
                  <select
                    value={eraId}
                    onChange={(e) => setEraId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {TIMELINE_ERAS.map((era, idx) => (
                      <option key={era.id} value={era.id}>
                        {String(idx + 1).padStart(2, '0')}. {era.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Samudra Manthan: Churning of the Cosmic Ocean"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.title && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Sanskrit / Scriptural Subtitle
                  </label>
                  <input
                    type="text"
                    value={sanskritTitle}
                    onChange={(e) => setSanskritTitle(e.target.value)}
                    placeholder="e.g. समुद्र मन्थन"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Traditional / Primary Chronology *
                  </label>
                  <input
                    type="text"
                    value={traditionalDate}
                    onChange={(e) => setTraditionalDate(e.target.value)}
                    placeholder="e.g. Satya Yuga / N/A"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.traditionalDate && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.traditionalDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Historical / Scientific Date Range *
                  </label>
                  <input
                    type="text"
                    value={historicalDateRange}
                    onChange={(e) => setHistoricalDateRange(e.target.value)}
                    placeholder="e.g. c. 800–300 BCE or 4.1 Billion Years Ago"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.historicalDateRange && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.historicalDateRange}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Evidence Label *
                  </label>
                  <select
                    value={evidenceLabel}
                    onChange={(e) => setEvidenceLabel(e.target.value as EvidenceLabel)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {EVIDENCE_OPTIONS.map((ev) => (
                      <option key={ev} value={ev}>
                        {ev}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Text / Stratigraphic Layer
                  </label>
                  <input
                    type="text"
                    value={textCompositionDate}
                    onChange={(e) => setTextCompositionDate(e.target.value)}
                    placeholder="e.g. Bhagavata Purana Skandha 8"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Summary (Timeline Card) *
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Concise editorial overview (10-500 chars)..."
                  className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                {formErrors.summary && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.summary}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Full Explanation *
                </label>
                <textarea
                  rows={3}
                  value={fullExplanation}
                  onChange={(e) => setFullExplanation(e.target.value)}
                  placeholder="Detailed scholarly or scriptural context for the Event Detail Page..."
                  className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                {formErrors.fullExplanation && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.fullExplanation}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Cultural Significance *
                </label>
                <textarea
                  rows={2}
                  value={culturalSignificance}
                  onChange={(e) => setCulturalSignificance(e.target.value)}
                  placeholder="Why this topic endures across tradition, philosophy, or research..."
                  className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                {formErrors.culturalSignificance && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.culturalSignificance}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Primary Source Title *
                  </label>
                  <input
                    type="text"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    placeholder="e.g. Bhagavata Purana"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.sourceTitle && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.sourceTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Source Author / Tradition
                  </label>
                  <input
                    type="text"
                    value={sourceAuthor}
                    onChange={(e) => setSourceAuthor(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Citation *
                  </label>
                  <input
                    type="text"
                    value={sourceCitation}
                    onChange={(e) => setSourceCitation(e.target.value)}
                    placeholder="e.g. Skandha 8, Ch. 7"
                    className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.sourceCitation && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.sourceCitation}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Related Entities (comma-separated)
                </label>
                <input
                  type="text"
                  value={relatedEntitiesText}
                  onChange={(e) => setRelatedEntitiesText(e.target.value)}
                  placeholder="e.g. Dharma, Kurma, Amrita, Vasuki"
                  className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {submitError && <p className="text-xs text-rose-400">{submitError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-stone-100 border border-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Topic...' : 'Create Timeline Topic'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
