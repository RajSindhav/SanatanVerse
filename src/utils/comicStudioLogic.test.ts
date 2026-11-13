import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSafeFirestoreId,
  collectAllTopics,
  groupTopicMediaByTopic,
  mergeTopicMediaCollections,
  parseCommaSeparatedEntities,
  summarizeMediaCounts,
  validateNewMediaInput,
  validateNewTopicInput,
} from './comicStudioLogic.ts';
import { ParallelEraRecord, TimelineEvent, TopicMediaItem } from '../types/index.ts';

test('buildSafeFirestoreId produces rules-compliant IDs matching ^[a-zA-Z0-9_-]+$', () => {
  const id = buildSafeFirestoreId('topic', 'Rgveda Mandala 10: Cosmic Creation!', 'abc1');
  assert.match(id, /^[a-zA-Z0-9_-]+$/);
  assert.ok(id.length >= 3 && id.length <= 128);
});

test('mergeTopicMediaCollections overrides seeded entries with live Firestore entries and keeps multiples per topic', () => {
  const seeded: TopicMediaItem[] = [
    {
      id: 'media-1',
      topicId: 'sacred-era-1',
      track: 'sacred',
      title: 'Seeded Issue #1',
      mediaType: 'Comic Issue',
      status: 'Published',
      creatorName: 'SanatanVerse Studios',
      synopsis: 'Cosmic origins comic issue.',
      coverPreset: 'sacred-cosmos',
      comicPanels: [],
      isSeeded: true,
    },
  ];
  const live: TopicMediaItem[] = [
    {
      id: 'media-1',
      topicId: 'sacred-era-1',
      track: 'sacred',
      title: 'Updated Issue #1',
      mediaType: 'Comic Issue',
      status: 'Published',
      creatorName: 'Raj',
      synopsis: 'Updated cosmic origins comic issue.',
      coverPreset: 'sacred-cosmos',
      comicPanels: [],
    },
    {
      id: 'media-2',
      topicId: 'sacred-era-1',
      track: 'sacred',
      title: 'Cosmic Chant Audio Concept',
      mediaType: 'Audio Narration',
      status: 'Concept',
      creatorName: 'Raj',
      synopsis: 'Spatial Rigvedic recitation score.',
      coverPreset: 'sacred-cosmos',
      comicPanels: [],
    },
  ];

  const merged = mergeTopicMediaCollections(seeded, live);
  assert.equal(merged.length, 2);
  const grouped = groupTopicMediaByTopic(merged);
  assert.equal(grouped['sacred-era-1'].length, 2);
  assert.equal(grouped['sacred-era-1'][0].title, 'Updated Issue #1');

  const summary = summarizeMediaCounts(grouped['sacred-era-1']);
  assert.equal(summary.total, 2);
  assert.equal(summary.comicCount, 1);
  assert.equal(summary.otherMediaCount, 1);
});

test('validateNewTopicInput enforces required chronological and citation constraints', () => {
  const bad = validateNewTopicInput({
    title: 'ab',
    eraId: '',
    track: 'sacred',
    traditionalDate: '',
    historicalDateRange: '',
    evidenceLabel: 'Traditional chronology',
    summary: 'too short',
    fullExplanation: 'short',
    culturalSignificance: 'no',
    relatedEntitiesText: '',
    sourceTitle: '',
    sourceCitation: '',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.title);
  assert.ok(bad.errors.summary);
  assert.ok(bad.errors.sourceTitle);

  const good = validateNewTopicInput({
    title: 'Purusha Sukta & Cosmic Yajna',
    eraId: 'cosmic-origins',
    track: 'sacred',
    traditionalDate: 'Anadi Vedic epoch',
    historicalDateRange: 'c. 1400–1100 BCE',
    evidenceLabel: 'Textual evidence',
    summary: 'Rigveda 10.90 envisions the universe emerging from a cosmic whole.',
    fullExplanation: 'Detailed inquiry into the Purusha Sukta hymn and its interconnected cosmic metaphor.',
    culturalSignificance: 'Foundational metaphor uniting social, ecological, and cosmic harmony.',
    relatedEntitiesText: 'Purusha, Rigveda, Yajna',
    sourceTitle: 'Rigveda Samhita',
    sourceCitation: 'Mandala 10, Sukta 90',
  });
  assert.equal(good.isValid, true);
  assert.deepEqual(parseCommaSeparatedEntities('Purusha, Rigveda, Yajna'), ['Purusha', 'Rigveda', 'Yajna']);
});

test('validateNewMediaInput rejects invalid URLs and incomplete comic panels', () => {
  const invalidPanel = validateNewMediaInput({
    topicId: 'sci-era-1',
    track: 'scientific',
    title: 'CMB Echoes Comic',
    mediaType: 'Comic Issue',
    status: 'Planned',
    creatorName: 'Studio Team',
    synopsis: 'Explores Cosmic Microwave Background through comic storytelling.',
    coverPreset: 'scientific-nebula',
    externalUrl: 'ftp://invalid.example.com',
    comicPanels: [{ panelNumber: 1, sceneTitle: '', caption: 'Missing title' }],
  });
  assert.equal(invalidPanel.isValid, false);
  assert.ok(invalidPanel.errors.externalUrl);
  assert.ok(invalidPanel.errors.comicPanels);

  const valid = validateNewMediaInput({
    topicId: 'sci-era-1',
    track: 'scientific',
    title: 'CMB Echoes Comic',
    mediaType: 'Comic Issue',
    status: 'In Production',
    creatorName: 'Studio Team',
    synopsis: 'Explores Cosmic Microwave Background through comic storytelling.',
    coverPreset: 'scientific-nebula',
    externalUrl: 'https://sanatanverse.example.com/cmb',
    comicPanels: [{ panelNumber: 1, sceneTitle: 'First Light', caption: '380,000 years post-inflation.' }],
  });
  assert.equal(valid.isValid, true);
});

test('collectAllTopics merges admin-added custom topics across tracks cleanly', () => {
  const dummyEvent = (id: string, track: 'sacred' | 'scientific' | 'historical'): TimelineEvent => ({
    id,
    title: `Event ${id}`,
    eraId: 'cosmic-origins',
    eraName: 'Cosmic Origins',
    track,
    traditionalDate: 'Ancient',
    historicalDateRange: 'Ancient',
    evidenceLabel: 'Well established',
    summary: 'Summary of timeline event for test verification.',
    fullExplanation: 'Detailed timeline explanation for automated tests.',
    sources: [],
    relatedEntities: [],
    culturalSignificance: 'Preserves perspective continuity.',
    visualTheme: { accentColor: '#f59e0b', bgGradient: '', badgeStyle: '' },
  });

  const baseEras: ParallelEraRecord[] = [
    {
      era: {
        id: 'cosmic-origins',
        name: 'Cosmic Origins',
        sanskritName: 'सृष्टि उत्पत्ति',
        approximateRange: '13.8 Ga / Anadi',
        description: 'Origins',
      },
      eraNumber: 1,
      convergenceHighlight: 'Convergence',
      sacredPointOfView: dummyEvent('sacred-era-1', 'sacred'),
      scientificPointOfView: dummyEvent('sci-era-1', 'scientific'),
      historicalPointOfView: dummyEvent('hist-era-1', 'historical'),
      publishedContent: {
        id: 'p1',
        title: 'Pilot',
        format: 'Motion Comic',
        releaseStatus: 'Published Now',
        publishedDate: '2026',
        synopsis: 'Pilot',
        primaryPerspective: 'tri-perspective',
      },
    },
  ];

  const customTopics: TimelineEvent[] = [
    { ...dummyEvent('topic-purusha-sukta', 'sacred'), isCustomTopic: true },
  ];

  const all = collectAllTopics(baseEras, customTopics);
  assert.equal(all.length, 4);
  assert.equal(all[3].isCustomTopic, true);
  assert.equal(all[3].eraNumber, 1);
});
