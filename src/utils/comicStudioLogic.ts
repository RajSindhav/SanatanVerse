import {
  CoverPreset,
  EvidenceLabel,
  ParallelEraRecord,
  TimelineEvent,
  TopicComicPanel,
  TopicMediaItem,
  TopicMediaStatus,
  TopicMediaType,
} from '../types/index.ts';

export const ADMIN_BOOTSTRAP_EMAIL = 'rajsindhav77@gmail.com';

export interface NewTopicInput {
  title: string;
  sanskritTitle?: string;
  eraId: string;
  track: 'sacred' | 'scientific' | 'historical';
  traditionalDate: string;
  historicalDateRange: string;
  textCompositionDate?: string;
  evidenceLabel: EvidenceLabel;
  uncertaintyNotes?: string;
  summary: string;
  fullExplanation: string;
  culturalSignificance: string;
  relatedEntitiesText: string;
  sourceTitle: string;
  sourceAuthor?: string;
  sourceCitation: string;
}

export interface NewMediaInput {
  topicId: string;
  track: 'sacred' | 'scientific' | 'historical';
  title: string;
  sanskritTitle?: string;
  mediaType: TopicMediaType;
  status: TopicMediaStatus;
  issueNumber?: string;
  creatorName: string;
  synopsis: string;
  durationOrLength?: string;
  coverPreset: CoverPreset;
  externalUrl?: string;
  comicPanels: TopicComicPanel[];
}

export function buildSafeFirestoreId(prefix: string, label: string, randomSuffix?: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'item';
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const suffix =
    randomSuffix || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const raw = `${cleanPrefix}-${slug || 'entry'}-${suffix}`;
  return raw.slice(0, 120);
}

export function parseCommaSeparatedEntities(raw: string, maxItems = 10): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, maxItems);
}

export function validateNewTopicInput(input: NewTopicInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length < 3 || input.title.trim().length > 160) {
    errors.title = 'Topic title must be between 3 and 160 characters.';
  }
  if (!input.eraId || input.eraId.trim().length < 2) {
    errors.eraId = 'Please select an era.';
  }
  if (!['sacred', 'scientific', 'historical'].includes(input.track)) {
    errors.track = 'Please select Sacred, Scientific, or Historical track.';
  }
  if (!input.traditionalDate || input.traditionalDate.trim().length === 0) {
    errors.traditionalDate = 'Traditional or primary date label is required.';
  }
  if (!input.historicalDateRange || input.historicalDateRange.trim().length === 0) {
    errors.historicalDateRange = 'Historical or scientific date range is required.';
  }
  if (!input.summary || input.summary.trim().length < 10 || input.summary.trim().length > 500) {
    errors.summary = 'Summary must be between 10 and 500 characters.';
  }
  if (
    !input.fullExplanation ||
    input.fullExplanation.trim().length < 10 ||
    input.fullExplanation.trim().length > 4000
  ) {
    errors.fullExplanation = 'Detailed explanation must be between 10 and 4000 characters.';
  }
  if (
    !input.culturalSignificance ||
    input.culturalSignificance.trim().length < 5 ||
    input.culturalSignificance.trim().length > 1200
  ) {
    errors.culturalSignificance = 'Cultural significance must be between 5 and 1200 characters.';
  }
  if (!input.sourceTitle || input.sourceTitle.trim().length < 2) {
    errors.sourceTitle = 'Primary source title is required.';
  }
  if (!input.sourceCitation || input.sourceCitation.trim().length < 2) {
    errors.sourceCitation = 'Primary source citation is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateNewMediaInput(input: NewMediaInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.topicId || input.topicId.trim().length < 3) {
    errors.topicId = 'A target timeline topic is required.';
  }
  if (!input.title || input.title.trim().length < 3 || input.title.trim().length > 160) {
    errors.title = 'Title must be between 3 and 160 characters.';
  }
  if (!input.creatorName || input.creatorName.trim().length < 2 || input.creatorName.trim().length > 100) {
    errors.creatorName = 'Creator or studio name must be between 2 and 100 characters.';
  }
  if (!input.synopsis || input.synopsis.trim().length < 10 || input.synopsis.trim().length > 2000) {
    errors.synopsis = 'Synopsis must be between 10 and 2000 characters.';
  }
  if (input.externalUrl && input.externalUrl.trim().length > 0) {
    const trimmed = input.externalUrl.trim();
    if (!/^https?:\/\/\S+$/i.test(trimmed)) {
      errors.externalUrl = 'External link must start with http:// or https://.';
    }
  }
  if (input.comicPanels.length > 12) {
    errors.comicPanels = 'Maximum 12 storyboard panels can be added per comic entry.';
  }
  for (const panel of input.comicPanels) {
    if (!panel.sceneTitle.trim() || !panel.caption.trim()) {
      errors.comicPanels = 'Each storyboard panel must include a scene title and caption.';
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Merge seeded topic media with live Firestore topic media records.
 * Live records override seeded items if matching IDs exist.
 */
export function mergeTopicMediaCollections(
  seeded: TopicMediaItem[],
  live: TopicMediaItem[]
): TopicMediaItem[] {
  const byId = new Map<string, TopicMediaItem>();
  for (const item of seeded) {
    byId.set(item.id, item);
  }
  for (const item of live) {
    byId.set(item.id, item);
  }
  return Array.from(byId.values());
}

/**
 * Group TopicMediaItems by topicId for O(1) lookup across all 3 timelines
 */
export function groupTopicMediaByTopic(
  items: TopicMediaItem[]
): Record<string, TopicMediaItem[]> {
  const grouped: Record<string, TopicMediaItem[]> = {};
  for (const item of items) {
    if (!grouped[item.topicId]) {
      grouped[item.topicId] = [];
    }
    grouped[item.topicId].push(item);
  }
  return grouped;
}

/**
 * Flatten base ParallelEraRecords + admin-added custom topics across all 3 tracks in chronological order
 */
export function collectAllTopics(
  parallelEras: ParallelEraRecord[],
  customTopics: TimelineEvent[]
): Array<TimelineEvent & { eraNumber: number; eraRange: string }> {
  const eraLookup = new Map<string, { eraNumber: number; eraRange: string }>();
  const baseTopics: Array<TimelineEvent & { eraNumber: number; eraRange: string }> = [];

  const sortedEras = [...parallelEras].sort((a, b) => a.eraNumber - b.eraNumber);
  for (const record of sortedEras) {
    const meta = { eraNumber: record.eraNumber, eraRange: record.era.approximateRange };
    eraLookup.set(record.era.id, meta);
    baseTopics.push({ ...record.sacredPointOfView, ...meta });
    baseTopics.push({ ...record.scientificPointOfView, ...meta });
    baseTopics.push({ ...record.historicalPointOfView, ...meta });
  }

  const existingIds = new Set(baseTopics.map((t) => t.id));
  const merged = [...baseTopics];

  for (const topic of customTopics) {
    if (existingIds.has(topic.id)) continue;
    const eraMeta = eraLookup.get(topic.eraId) || { eraNumber: 99, eraRange: topic.historicalDateRange };
    merged.push({ ...topic, ...eraMeta, isCustomTopic: true });
  }

  return merged;
}

/**
 * Summarize comic & media breakdown for a list of TopicMediaItem entries
 */
export function summarizeMediaCounts(items: TopicMediaItem[]): {
  total: number;
  comicCount: number;
  otherMediaCount: number;
} {
  let comicCount = 0;
  let otherMediaCount = 0;
  for (const item of items) {
    if (
      item.mediaType === 'Comic Issue' ||
      item.mediaType === 'Motion Comic' ||
      item.mediaType === 'Graphic Novel'
    ) {
      comicCount += 1;
    } else {
      otherMediaCount += 1;
    }
  }
  return {
    total: items.length,
    comicCount,
    otherMediaCount,
  };
}
