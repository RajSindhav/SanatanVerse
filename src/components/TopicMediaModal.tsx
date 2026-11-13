import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  Trash2,
  BookOpen,
  Film,
  LogIn,
} from 'lucide-react';
import {
  CoverPreset,
  TimelineEvent,
  TopicComicPanel,
  TopicMediaItem,
  TopicMediaStatus,
  TopicMediaType,
} from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useCatalog } from '../context/CatalogContext.tsx';
import { COVER_PRESET_IMAGES, getDefaultCoverPresetForTrack } from '../utils/coverArt.ts';
import { validateNewMediaInput } from '../utils/comicStudioLogic.ts';

interface TopicMediaModalProps {
  isOpen: boolean;
  topic: TimelineEvent | null;
  initialStartComposer?: boolean;
  onClose: () => void;
  onSelectTopic?: (topic: TimelineEvent) => void;
}

const MEDIA_TYPES: TopicMediaType[] = [
  'Comic Issue',
  'Motion Comic',
  'Graphic Novel',
  'Concept Art',
  'Audio Narration',
  'Video Teaser',
  'Research Sourcebook',
];

const MEDIA_STATUSES: TopicMediaStatus[] = [
  'Published',
  'In Production',
  'Planned',
  'Concept',
];

const COVER_PRESETS: CoverPreset[] = [
  'sacred-cosmos',
  'scientific-nebula',
  'historical-temple',
];

export const TopicMediaModal: React.FC<TopicMediaModalProps> = ({
  isOpen,
  topic,
  initialStartComposer = false,
  onClose,
  onSelectTopic,
}) => {
  const { user, isAdmin, signInWithGoogle, authError } = useAuth();
  const { allTopics, mediaByTopic, addMediaToTopic, deleteMediaItem } = useCatalog();

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [panelIdx, setPanelIdx] = useState<number>(0);
  const [showAllPanels, setShowAllPanels] = useState<boolean>(false);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Composer state
  const [title, setTitle] = useState<string>('');
  const [sanskritTitle, setSanskritTitle] = useState<string>('');
  const [mediaType, setMediaType] = useState<TopicMediaType>('Comic Issue');
  const [status, setStatus] = useState<TopicMediaStatus>('In Production');
  const [issueNumber, setIssueNumber] = useState<string>('');
  const [creatorName, setCreatorName] = useState<string>('');
  const [durationOrLength, setDurationOrLength] = useState<string>('');
  const [coverPreset, setCoverPreset] = useState<CoverPreset>('sacred-cosmos');
  const [synopsis, setSynopsis] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [panels, setPanels] = useState<TopicComicPanel[]>([
    { panelNumber: 1, sceneTitle: '', caption: '', dialogue: '' },
  ]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justAddedTitle, setJustAddedTitle] = useState<string | null>(null);

  const topicMediaList = useMemo(() => {
    if (!topic) return [];
    return mediaByTopic[topic.id] || [];
  }, [topic, mediaByTopic]);

  const activeMedia: TopicMediaItem | null = useMemo(() => {
    if (topicMediaList.length === 0) return null;
    return topicMediaList.find((m) => m.id === selectedMediaId) || topicMediaList[0];
  }, [topicMediaList, selectedMediaId]);

  useEffect(() => {
    if (!isOpen || !topic) return;
    setSelectedMediaId(topicMediaList[0]?.id || null);
    setPanelIdx(0);
    setShowAllPanels(false);
    setIsComposerOpen(initialStartComposer);
    setCoverPreset(getDefaultCoverPresetForTrack(topic.track));
    setCreatorName(user?.displayName || 'SanatanVerse Studios');
    setFormErrors({});
    setSubmitError(null);
    setJustAddedTitle(null);
  }, [isOpen, topic?.id, initialStartComposer]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !topic) return null;

  const trackLabel =
    topic.track === 'sacred'
      ? 'Sacred'
      : topic.track === 'scientific'
      ? 'Scientific'
      : 'Historical';

  const trackAccent =
    topic.track === 'sacred'
      ? 'text-amber-400'
      : topic.track === 'scientific'
      ? 'text-sky-400'
      : 'text-emerald-400';

  const activePanels = activeMedia?.comicPanels || [];
  const safePanelIdx = Math.min(panelIdx, Math.max(0, activePanels.length - 1));
  const currentPanel = activePanels[safePanelIdx] || null;

  const handleSelectMedia = (item: TopicMediaItem) => {
    setSelectedMediaId(item.id);
    setPanelIdx(0);
    setShowAllPanels(false);
    setIsComposerOpen(false);
  };

  const handleAddPanelRow = () => {
    if (panels.length >= 12) return;
    setPanels((prev) => [
      ...prev,
      { panelNumber: prev.length + 1, sceneTitle: '', caption: '', dialogue: '' },
    ]);
  };

  const handleRemovePanelRow = (index: number) => {
    if (panels.length <= 1) return;
    setPanels((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((p, idx) => ({ ...p, panelNumber: idx + 1 }))
    );
  };

  const handlePanelFieldChange = (
    index: number,
    field: 'sceneTitle' | 'caption' | 'dialogue',
    value: string
  ) => {
    setPanels((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, [field]: value } : p))
    );
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const payload = {
      topicId: topic.id,
      track: topic.track,
      title,
      sanskritTitle,
      mediaType,
      status,
      issueNumber,
      creatorName,
      synopsis,
      durationOrLength,
      coverPreset,
      externalUrl,
      comicPanels: panels,
    };

    const validation = validateNewMediaInput(payload);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await addMediaToTopic(payload);
      setJustAddedTitle(created.title);
      setSelectedMediaId(created.id);
      setIsComposerOpen(false);
      setTitle('');
      setSanskritTitle('');
      setIssueNumber('');
      setDurationOrLength('');
      setSynopsis('');
      setExternalUrl('');
      setPanels([{ panelNumber: 1, sceneTitle: '', caption: '', dialogue: '' }]);
      setPanelIdx(0);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to save comic or media item.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLiveItem = async (item: TopicMediaItem) => {
    try {
      await deleteMediaItem(item.id);
      if (selectedMediaId === item.id) {
        const remaining = topicMediaList.filter((m) => m.id !== item.id);
        setSelectedMediaId(remaining[0]?.id || null);
        setPanelIdx(0);
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to delete item.');
    }
  };

  const coverMeta = activeMedia ? COVER_PRESET_IMAGES[activeMedia.coverPreset] : null;
  const coverFailed = activeMedia ? imgErrors[activeMedia.id] : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-media-modal-title"
    >
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#11100e] border border-stone-800 shadow-2xl overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-[#14120f]">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span className={`font-medium uppercase tracking-wider ${trackAccent}`}>
                {trackLabel} Timeline
              </span>
              <span aria-hidden="true">·</span>
              <span>{topic.eraName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-stone-300">
                {topicMediaList.length} {topicMediaList.length === 1 ? 'comic / media' : 'comics & media'}
              </span>
            </div>
            <h2
              id="topic-media-modal-title"
              className="font-serif text-lg sm:text-xl font-semibold text-stone-100 truncate"
            >
              {topic.title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onSelectTopic && (
              <select
                value={topic.id}
                onChange={(e) => {
                  const found = allTopics.find((t) => t.id === e.target.value);
                  if (found) onSelectTopic(found);
                }}
                aria-label="Switch timeline topic"
                className="max-w-[210px] px-2.5 py-1.5 rounded-lg bg-[#090807] border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              >
                {allTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.track.charAt(0).toUpperCase() + t.track.slice(1)} · {t.title}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsComposerOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                isComposerOpen
                  ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isComposerOpen ? 'Back to Reader' : 'Add Comic / Media'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Comics & Media Studio"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {justAddedTitle && (
            <div className="px-4 py-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/70 text-xs text-emerald-300">
              Added <span className="font-semibold text-emerald-200">{justAddedTitle}</span> to{' '}
              {topic.title}. You can add additional comics or media to this same topic anytime.
            </div>
          )}

          {isComposerOpen ? (
            /* Add Multiple Comics / Media Composer */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-wider text-amber-400">
                  Comics &amp; Media Studio
                </div>
                <h3 className="font-serif text-xl font-medium text-stone-100">
                  Add Comic Issue or Media to &ldquo;{topic.title}&rdquo;
                </h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  Attach multiple comic issues, motion comics, graphic novels, concept art plates,
                  audio narrations, or teasers to any topic across all three timelines.
                </p>
              </div>

              {!user ? (
                <div className="p-6 rounded-xl bg-[#14120f] border border-stone-800 space-y-4">
                  <p className="text-sm text-stone-300">
                    Sign in with Google to design and publish comics or media items for this topic.
                  </p>
                  {authError && <p className="text-xs text-rose-400">{authError}</p>}
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in with Google</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateMedia} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Comic / Media Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Agni & The Dawn of Tapas"
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                      {formErrors.title && (
                        <p className="text-xs text-rose-400 mt-1">{formErrors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Sanskrit / Edition Subtitle
                      </label>
                      <input
                        type="text"
                        value={sanskritTitle}
                        onChange={(e) => setSanskritTitle(e.target.value)}
                        placeholder="Optional e.g. अग्नि गाथा"
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Media Format *
                      </label>
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value as TopicMediaType)}
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        {MEDIA_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Production Status *
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TopicMediaStatus)}
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        {MEDIA_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Issue / Edition Number
                      </label>
                      <input
                        type="text"
                        value={issueNumber}
                        onChange={(e) => setIssueNumber(e.target.value)}
                        placeholder="e.g. Issue #02 or Vol. 1"
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Duration / Length
                      </label>
                      <input
                        type="text"
                        value={durationOrLength}
                        onChange={(e) => setDurationOrLength(e.target.value)}
                        placeholder="e.g. 24 Pages or 8 min Motion"
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Creator / Studio Name *
                      </label>
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="SanatanVerse Studios"
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                      {formErrors.creatorName && (
                        <p className="text-xs text-rose-400 mt-1">{formErrors.creatorName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        External Stream / Gallery URL
                      </label>
                      <input
                        type="url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                      />
                      {formErrors.externalUrl && (
                        <p className="text-xs text-rose-400 mt-1">{formErrors.externalUrl}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Cover Art Direction
                      </label>
                      <select
                        value={coverPreset}
                        onChange={(e) => setCoverPreset(e.target.value as CoverPreset)}
                        className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        {COVER_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>
                            {COVER_PRESET_IMAGES[preset].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Synopsis &amp; Creative Notes *
                    </label>
                    <textarea
                      rows={3}
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                      placeholder="Describe the narrative arc, visual direction, or historical grounding..."
                      className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                    />
                    {formErrors.synopsis && (
                      <p className="text-xs text-rose-400 mt-1">{formErrors.synopsis}</p>
                    )}
                  </div>

                  {/* Storyboard Panels Builder */}
                  <div className="space-y-3 pt-2 border-t border-stone-800/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-stone-200">
                          Comic Storyboard Panels ({panels.length}/12)
                        </div>
                        <div className="text-xs text-stone-500">
                          Outline sequential scenes, captions, and character dialogue.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPanelRow}
                        disabled={panels.length >= 12}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-40 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Panel</span>
                      </button>
                    </div>

                    {formErrors.comicPanels && (
                      <p className="text-xs text-rose-400">{formErrors.comicPanels}</p>
                    )}

                    <div className="space-y-3">
                      {panels.map((panel, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-[#14120f] border border-stone-800 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs text-stone-400">
                            <span className="font-mono text-amber-400">
                              Panel {String(idx + 1).padStart(2, '0')}
                            </span>
                            {panels.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePanelRow(idx)}
                                className="text-stone-500 hover:text-rose-400 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={panel.sceneTitle}
                              onChange={(e) =>
                                handlePanelFieldChange(idx, 'sceneTitle', e.target.value)
                              }
                              placeholder="Scene title * (e.g. Dawn Over Kurukshetra)"
                              className="px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                            />
                            <input
                              type="text"
                              value={panel.dialogue || ''}
                              onChange={(e) =>
                                handlePanelFieldChange(idx, 'dialogue', e.target.value)
                              }
                              placeholder="Optional dialogue (e.g. ARJUNA: ...)"
                              className="px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={panel.caption}
                            onChange={(e) =>
                              handlePanelFieldChange(idx, 'caption', e.target.value)
                            }
                            placeholder="Visual description & narration caption *"
                            className="w-full px-3 py-2 rounded-lg bg-[#090807] border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {submitError && <p className="text-xs text-rose-400">{submitError}</p>}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsComposerOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-stone-100 border border-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Publishing to Archive...' : 'Publish Comic / Media'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : topicMediaList.length === 0 ? (
            <div className="p-10 rounded-xl bg-[#14120f] border border-stone-800 text-center space-y-4">
              <p className="text-sm text-stone-300">
                No comics or media have been designed for this topic yet.
              </p>
              <button
                onClick={() => setIsComposerOpen(true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Design First Comic or Media</span>
              </button>
            </div>
          ) : (
            /* Media Selector & Interactive Storyboard Reader */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: All Comics & Media for This Topic */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="uppercase tracking-wider font-medium">
                    Attached Editions ({topicMediaList.length})
                  </span>
                  <button
                    onClick={() => setIsComposerOpen(true)}
                    className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {topicMediaList.map((item) => {
                    const isSelected = activeMedia?.id === item.id;
                    const canDelete =
                      !item.isSeeded && user && (isAdmin || item.createdBy === user.uid);
                    const thumbMeta = COVER_PRESET_IMAGES[item.coverPreset];

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-colors p-3.5 flex gap-3.5 items-start cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a1712] border-amber-400/80'
                            : 'bg-[#14120f] border-stone-800/90 hover:border-stone-700'
                        }`}
                        onClick={() => handleSelectMedia(item)}
                      >
                        <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-[#090807] border border-stone-800">
                          {!imgErrors[item.id] && thumbMeta ? (
                            <img
                              src={thumbMeta.src}
                              alt={thumbMeta.alt}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                              }
                              className="w-full h-full object-cover scale-[1.06]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950/70 to-stone-950 text-amber-400/70">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-400">
                            <span className="text-amber-400 font-medium">{item.mediaType}</span>
                            {item.issueNumber && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{item.issueNumber}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{item.status}</span>
                          </div>

                          <h4 className="font-serif text-sm font-semibold text-stone-100 leading-snug">
                            {item.title}
                          </h4>

                          <div className="text-xs text-stone-500">
                            {item.creatorName}
                            {item.comicPanels.length > 0 &&
                              ` · ${item.comicPanels.length} ${
                                item.comicPanels.length === 1 ? 'panel' : 'panels'
                              }`}
                          </div>
                        </div>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDeleteLiveItem(item);
                            }}
                            title="Delete custom comic/media"
                            className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Comic Cover, Synopsis & Interactive Storyboard Reader */}
              {activeMedia && (
                <div className="lg:col-span-7 space-y-5">
                  <div className="rounded-xl bg-[#14120f] border border-stone-800 overflow-hidden">
                    <div className="relative aspect-[16/9] bg-[#090807] border-b border-stone-800/80 overflow-hidden">
                      {!coverFailed && coverMeta ? (
                        <img
                          src={coverMeta.src}
                          alt={coverMeta.alt}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImgErrors((prev) => ({ ...prev, [activeMedia.id]: true }))
                          }
                          className="w-full h-full object-cover scale-[1.06]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950/60 via-stone-950 to-black">
                          <Film className="w-10 h-10 text-amber-400/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14120f] via-[#14120f]/40 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300">
                          <span className="text-amber-400 font-medium">
                            {activeMedia.mediaType}
                          </span>
                          {activeMedia.issueNumber && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{activeMedia.issueNumber}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{activeMedia.status}</span>
                          {activeMedia.durationOrLength && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{activeMedia.durationOrLength}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100">
                          {activeMedia.title}
                        </h3>
                        {activeMedia.sanskritTitle && (
                          <div className="text-xs font-serif text-amber-300/90">
                            {activeMedia.sanskritTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-sm text-stone-300 leading-relaxed">
                        {activeMedia.synopsis}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 pt-2 border-t border-stone-800/70">
                        <span>Creator: {activeMedia.creatorName}</span>
                        {activeMedia.externalUrl && (
                          <a
                            href={activeMedia.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
                          >
                            <span>Open External Release</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Comic Storyboard Reader */}
                  <div className="rounded-xl bg-[#14120f] border border-stone-800 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-amber-400">
                        <Layers className="w-4 h-4" />
                        <span>
                          Storyboard Reader ({activePanels.length}{' '}
                          {activePanels.length === 1 ? 'Panel' : 'Panels'})
                        </span>
                      </div>

                      {activePanels.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setShowAllPanels((prev) => !prev)}
                          className="text-xs text-stone-400 hover:text-amber-300 transition-colors"
                        >
                          {showAllPanels ? 'Single Panel Mode' : 'View All Panels'}
                        </button>
                      )}
                    </div>

                    {activePanels.length === 0 ? (
                      <p className="text-xs sm:text-sm text-stone-400">
                        No storyboard panels attached to this media edition yet.
                      </p>
                    ) : showAllPanels ? (
                      <div className="space-y-3">
                        {activePanels.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-[#090807] border border-stone-800/90 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-amber-400">
                                Panel {String(p.panelNumber).padStart(2, '0')}
                              </span>
                              <span className="font-serif font-medium text-stone-200">
                                {p.sceneTitle}
                              </span>
                            </div>
                            <p className="text-sm text-stone-300 leading-relaxed">{p.caption}</p>
                            {p.dialogue && (
                              <div className="text-xs font-mono text-amber-200/90 bg-stone-900/70 px-3 py-2 rounded">
                                {p.dialogue}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      currentPanel && (
                        <div className="space-y-4">
                          <div className="p-5 rounded-lg bg-[#090807] border border-stone-800 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-amber-400">
                                Scene {safePanelIdx + 1} / {activePanels.length}
                              </span>
                              <span className="font-serif text-sm font-semibold text-stone-100">
                                {currentPanel.sceneTitle}
                              </span>
                            </div>
                            <p className="text-sm text-stone-300 leading-relaxed">
                              {currentPanel.caption}
                            </p>
                            {currentPanel.dialogue && (
                              <div className="text-xs font-mono text-amber-200/95 bg-[#14120f] border border-stone-800 px-3.5 py-2.5 rounded-lg">
                                {currentPanel.dialogue}
                              </div>
                            )}
                          </div>

                          {activePanels.length > 1 && (
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setPanelIdx((prev) =>
                                    prev > 0 ? prev - 1 : activePanels.length - 1
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 border border-stone-800 text-stone-200 hover:border-amber-400 inline-flex items-center gap-1"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Prev Panel</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPanelIdx((prev) =>
                                    prev < activePanels.length - 1 ? prev + 1 : 0
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 border border-stone-800 text-stone-200 hover:border-amber-400 inline-flex items-center gap-1"
                              >
                                <span>Next Panel</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
