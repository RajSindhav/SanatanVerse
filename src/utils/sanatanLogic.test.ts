import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterTimelineEvents,
  getEvidenceLabelMeta,
  calculateBlueprintProgress,
  validateArtworkSubmission,
  formatTimelineDateDisplay,
  getPerspectiveMeta,
  filterParallelEras,
  calculateKaalChakraCoordinates,
  getCurrentMuhurta,
  calculateConvergenceIndex,
  generateLivePulseActivity,
  recordPanelReaction,
  flattenParallelErasToEvents,
  getDataTypeLabel,
  getUncertaintySummary,
  validateCorrectionFeedback
} from './sanatanLogic.ts';
import { TimelineEvent, BlueprintTask } from '../types/index.ts';

const mockSampleEvents: TimelineEvent[] = [
  {
    id: 'evt-nasadiya',
    title: 'Nasadiya Sukta (Creation Hymn)',
    sanskritTitle: 'नासदीय सूक्त',
    eraId: 'cosmic-origins',
    eraName: 'Cosmic Origins',
    track: 'scientific',
    traditionalDate: 'Anadi (Eternal Beginning)',
    historicalDateRange: 'c. 1500–1200 BCE (Textual Composition)',
    evidenceLabel: 'Textual evidence',
    summary: 'The famous creation hymn questioning the origins of existence.',
    fullExplanation: 'Rigveda 10.129 contemplates what existed before existence and non-existence.',
    sources: [{ title: 'Rigveda Samhita', type: 'scripture', citation: 'Mandala 10, Sukta 129' }],
    relatedEntities: ['Brahman', 'Prajapati', 'Tapas'],
    culturalSignificance: 'Foundational Hindu cosmological inquiry.',
    visualTheme: { accentColor: '#f59e0b', bgGradient: 'from-amber-900', badgeStyle: 'border-amber-500' }
  },
  {
    id: 'evt-kurukshetra',
    title: 'The Great Kurukshetra War',
    sanskritTitle: 'कुरुक्षेत्र युद्ध',
    eraId: 'itihasa',
    eraName: 'Itihasa & Epic Traditions',
    track: 'sacred',
    traditionalDate: '3102 BCE (Kali Yuga cusp)',
    historicalDateRange: 'c. 1000–900 BCE (Late Vedic scholarly estimates)',
    evidenceLabel: 'Debated',
    summary: 'The 18-day battle between the Pandavas and Kauravas recorded in the Mahabharata.',
    fullExplanation: 'Detailed in the Mahabharata along with the Bhagavad Gita spoken on the battlefield.',
    sources: [{ title: 'Mahabharata', author: 'Vyasa', type: 'scripture', citation: 'Bhishma Parva' }],
    relatedEntities: ['Krishna', 'Arjuna', 'Bhishma', 'Karna'],
    culturalSignificance: 'Central philosophical pivot of Dharma and duty.',
    visualTheme: { accentColor: '#dc2626', bgGradient: 'from-red-900', badgeStyle: 'border-red-500' }
  },
  {
    id: 'evt-adi-shankara',
    title: 'Adi Shankara and Advaita Vedanta',
    sanskritTitle: 'आदि शङ्कर',
    eraId: 'classical-bhakti',
    eraName: 'Classical Religious & Intellectual Life',
    track: 'historical',
    traditionalDate: '509–477 BCE (Matha tradition)',
    historicalDateRange: 'c. 788–820 CE (Modern historical consensus)',
    evidenceLabel: 'Estimated date',
    summary: 'Consolidation of Advaita Vedanta philosophy and establishment of the four amnaya mathas.',
    fullExplanation: 'Extensive commentaries on the Prasthanatrayi unifying non-dualism.',
    sources: [{ title: 'Brahmasutra Bhashya', author: 'Adi Shankara', type: 'primary', citation: 'Chatussutri' }],
    relatedEntities: ['Advaita', 'Brahman', 'Maya', 'Upanishads'],
    culturalSignificance: 'Rejuvenated philosophical scholarship across South Asia.',
    visualTheme: { accentColor: '#d97706', bgGradient: 'from-amber-950', badgeStyle: 'border-amber-600' }
  }
];

test('filterTimelineEvents filters by track correctly', () => {
  const sacredOnly = filterTimelineEvents(mockSampleEvents, { track: 'sacred' });
  assert.equal(sacredOnly.length, 1);
  assert.equal(sacredOnly[0].id, 'evt-kurukshetra');

  const scientificOnly = filterTimelineEvents(mockSampleEvents, { track: 'scientific' });
  assert.equal(scientificOnly.length, 1);
  assert.equal(scientificOnly[0].id, 'evt-nasadiya');

  const allTracks = filterTimelineEvents(mockSampleEvents, { track: 'all' });
  assert.equal(allTracks.length, 3);
});

test('filterTimelineEvents filters by eraId', () => {
  const itihasaOnly = filterTimelineEvents(mockSampleEvents, { track: 'all', eraId: 'itihasa' });
  assert.equal(itihasaOnly.length, 1);
  assert.equal(itihasaOnly[0].id, 'evt-kurukshetra');
});

test('filterTimelineEvents searches title, entities, and sources', () => {
  const queryKrishna = filterTimelineEvents(mockSampleEvents, { track: 'all', searchQuery: 'krishna' });
  assert.equal(queryKrishna.length, 1);
  assert.equal(queryKrishna[0].id, 'evt-kurukshetra');

  const queryRigveda = filterTimelineEvents(mockSampleEvents, { track: 'all', searchQuery: 'rigveda' });
  assert.equal(queryRigveda.length, 1);
  assert.equal(queryRigveda[0].id, 'evt-nasadiya');

  const queryNonExistent = filterTimelineEvents(mockSampleEvents, { track: 'all', searchQuery: 'randomxyznotfound' });
  assert.equal(queryNonExistent.length, 0);
});

test('getEvidenceLabelMeta returns correct definition and badge color', () => {
  const meta = getEvidenceLabelMeta('Well established');
  assert.match(meta.definition, /converging archaeological/);
  assert.match(meta.color, /text-emerald/);

  const debatedMeta = getEvidenceLabelMeta('Debated');
  assert.match(debatedMeta.definition, /disagreement/);
  assert.match(debatedMeta.color, /text-rose/);
});

test('calculateBlueprintProgress computes completion percentages and priority breakdowns', () => {
  const tasks: BlueprintTask[] = [
    { id: '1', sectionNumber: 1, sectionTitle: 'Arch', title: 'Task 1', priority: 'P0', status: 'completed', details: '' },
    { id: '2', sectionNumber: 1, sectionTitle: 'Arch', title: 'Task 2', priority: 'P0', status: 'in-progress', details: '' },
    { id: '3', sectionNumber: 2, sectionTitle: 'Stories', title: 'Task 3', priority: 'P1', status: 'completed', details: '' },
    { id: '4', sectionNumber: 2, sectionTitle: 'Stories', title: 'Task 4', priority: 'P2', status: 'planned', details: '' },
  ];

  const progress = calculateBlueprintProgress(tasks);
  assert.equal(progress.total, 4);
  assert.equal(progress.completed, 2);
  assert.equal(progress.completionRate, 50);
  assert.equal(progress.byPriority.P0.total, 2);
  assert.equal(progress.byPriority.P0.completed, 1);
  assert.equal(progress.byPriority.P0.rate, 50);
  assert.equal(progress.byPriority.P1.rate, 100);
  assert.equal(progress.byPriority.P2.rate, 0);
});

test('validateArtworkSubmission enforces required form fields and rules', () => {
  const invalidResult = validateArtworkSubmission({
    title: '',
    artistName: 'R',
    artistHandle: 'invalidHandleNoAt',
    artistLocation: '',
    medium: '',
    theme: '',
    description: 'too short',
    promptOrTechnique: ''
  });

  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.title);
  assert.ok(invalidResult.errors.artistName);
  assert.ok(invalidResult.errors.artistHandle);
  assert.ok(invalidResult.errors.medium);
  assert.ok(invalidResult.errors.description);

  const validResult = validateArtworkSubmission({
    title: 'Rudra Tandava at Dawn',
    artistName: 'Arun Varma',
    artistHandle: '@arun_creates',
    artistLocation: 'Bengaluru, India',
    medium: 'Digital Painting',
    theme: 'Lord Shiva',
    description: 'A contemporary graphic illustration of the cosmic destruction and genesis dance.',
    promptOrTechnique: 'Procreate with custom gouache brushes and rim lighting'
  });

  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('formatTimelineDateDisplay distinguishes sacred and historical chronological tracks', () => {
  const event = mockSampleEvents[1]; // Kurukshetra
  const sacredDisplay = formatTimelineDateDisplay(event, 'sacred');
  assert.equal(sacredDisplay.primaryDate, '3102 BCE (Kali Yuga cusp)');
  assert.match(sacredDisplay.secondaryDate!, /Historical:/);

  const historicalDisplay = formatTimelineDateDisplay(event, 'historical');
  assert.match(historicalDisplay.primaryDate, /1000–900 BCE/);
  assert.match(historicalDisplay.secondaryDate!, /Traditional:/);
});

test('getPerspectiveMeta returns valid metadata for all 3 points of view', () => {
  const sacredMeta = getPerspectiveMeta('sacred');
  assert.equal(sacredMeta.title, 'Sacred Point of View');
  assert.match(sacredMeta.accentText, /text-orange/);

  const sciMeta = getPerspectiveMeta('scientific');
  assert.equal(sciMeta.title, 'Scientific / Cosmological Point of View');
  assert.match(sciMeta.accentText, /text-sky/);

  const histMeta = getPerspectiveMeta('historical');
  assert.equal(histMeta.title, 'Historical & Epigraphic Point of View');
  assert.match(histMeta.accentText, /text-emerald/);
});

test('filterParallelEras filters by era and search query across 3 perspectives', () => {
  const mockParallelRecord = {
    era: { id: 'cosmic-origins', name: 'Cosmic Origins', sanskritName: 'सृष्टि उत्पत्ति' },
    eraNumber: 1,
    convergenceHighlight: 'Carl Sagan noted the Kalpa matches the age of the Earth.',
    sacredPointOfView: mockSampleEvents[0],
    scientificPointOfView: mockSampleEvents[0],
    historicalPointOfView: mockSampleEvents[2],
    publishedContent: {
      id: 'pub-1',
      title: 'Rudra: The First Flame Episode 1',
      format: 'Motion Comic' as const,
      releaseStatus: 'Published Now' as const,
      publishedDate: 'October 2026',
      synopsis: 'Before space had boundaries.',
      primaryPerspective: 'tri-perspective' as const
    }
  };

  const filteredByEra = filterParallelEras([mockParallelRecord], { eraId: 'cosmic-origins' });
  assert.equal(filteredByEra.length, 1);

  const filteredByDifferentEra = filterParallelEras([mockParallelRecord], { eraId: 'itihasa' });
  assert.equal(filteredByDifferentEra.length, 0);

  const searchConvergence = filterParallelEras([mockParallelRecord], { searchQuery: 'Sagan' });
  assert.equal(searchConvergence.length, 1);

  const searchPublishedTitle = filterParallelEras([mockParallelRecord], { searchQuery: 'First Flame' });
  assert.equal(searchPublishedTitle.length, 1);
});

test('calculateKaalChakraCoordinates calculates Kali Yuga elapsed years and percentage', () => {
  const fixedDate = new Date(2026, 9, 27, 4, 15, 0); // 4:15 AM
  const coords = calculateKaalChakraCoordinates(fixedDate);

  // 3101 + 2026 = 5127
  assert.equal(coords.currentGregorianYear, 2026);
  assert.equal(coords.kaliYugaElapsedYears, 5127);
  assert.equal(coords.kaliYugaRemainingYears, 432000 - 5127);
  assert.ok(coords.kaliYugaPercentElapsed > 1.18 && coords.kaliYugaPercentElapsed < 1.19);
  assert.equal(coords.brahmaYear, 51);
  assert.equal(coords.manvantaraNumber, 7);
  assert.equal(coords.currentMuhurta.name, 'Brahma Muhurta');
  assert.equal(coords.currentMuhurta.isAuspicious, true);
});

test('getCurrentMuhurta identifies Brahma Muhurta, Abhijit Muhurta, and Nishita Muhurta correctly', () => {
  const brahma = getCurrentMuhurta(4, 30);
  assert.equal(brahma.name, 'Brahma Muhurta');
  assert.match(brahma.sanskritName, /ब्रह्म/);

  const abhijit = getCurrentMuhurta(12, 0);
  assert.equal(abhijit.name, 'Abhijit Muhurta');

  const nishita = getCurrentMuhurta(0, 10);
  assert.equal(nishita.name, 'Nishita Muhurta');
});

test('calculateConvergenceIndex returns harmonic percentage and anchors for all epochs', () => {
  const epoch0 = calculateConvergenceIndex(0);
  assert.equal(epoch0.eraIndex, 0);
  assert.equal(epoch0.percentageHarmonic, 94);
  assert.match(epoch0.coreInsight, /Nasadiya/);

  const epoch1 = calculateConvergenceIndex(1);
  assert.equal(epoch1.eraIndex, 1);
  assert.equal(epoch1.percentageHarmonic, 96);
  assert.match(epoch1.sacredAnchor, /4.32 Billion/);
});

test('generateLivePulseActivity returns dynamic live items with timestamps', () => {
  const item0 = generateLivePulseActivity(0);
  assert.ok(item0.userName);
  assert.ok(item0.location);
  assert.ok(item0.target);
  assert.equal(item0.timestamp, 'Just now');

  const item1 = generateLivePulseActivity(1);
  assert.notEqual(item0.userName, item1.userName);
});

test('recordPanelReaction increments reaction tally accurately', () => {
  const initial = { divine: 10, astra: 5, evidence: 8, wisdom: 12 };
  const updated = recordPanelReaction(initial, 'divine');
  assert.equal(updated.divine, 11);
  assert.equal(updated.astra, 5);

  const updatedAstra = recordPanelReaction(updated, 'astra');
  assert.equal(updatedAstra.astra, 6);
});

test('flattenParallelErasToEvents flattens eras in chronological order across all 3 tracks', () => {
  const flattened = flattenParallelErasToEvents([
    {
      era: { approximateRange: '4.5 Ga' },
      eraNumber: 2,
      sacredPointOfView: { ...mockSampleEvents[0], id: 's2', track: 'sacred' },
      scientificPointOfView: { ...mockSampleEvents[0], id: 'sci2', track: 'scientific' },
      historicalPointOfView: { ...mockSampleEvents[0], id: 'h2', track: 'historical' },
    },
    {
      era: { approximateRange: '13.8 Ga' },
      eraNumber: 1,
      sacredPointOfView: { ...mockSampleEvents[0], id: 's1', track: 'sacred' },
      scientificPointOfView: { ...mockSampleEvents[0], id: 'sci1', track: 'scientific' },
      historicalPointOfView: { ...mockSampleEvents[0], id: 'h1', track: 'historical' },
    },
  ]);

  assert.equal(flattened.length, 6);
  assert.equal(flattened[0].id, 's1');
  assert.equal(flattened[0].eraNumber, 1);
  assert.equal(flattened[3].id, 's2');
  assert.equal(flattened[3].eraNumber, 2);
});

test('getDataTypeLabel and getUncertaintySummary return transparent metadata', () => {
  const sacredType = getDataTypeLabel('sacred');
  assert.equal(sacredType.shortLabel, 'Sacred');
  assert.match(sacredType.dataType, /Traditional/);

  const customNote = getUncertaintySummary({
    ...mockSampleEvents[0],
    uncertaintyNotes: 'Custom radiocarbon uncertainty window.',
  });
  assert.equal(customNote, 'Custom radiocarbon uncertainty window.');

  const defaultNote = getUncertaintySummary({
    ...mockSampleEvents[1],
    uncertaintyNotes: undefined,
  });
  assert.match(defaultNote, /scholarly/i);
});

test('validateCorrectionFeedback validates note length and optional email format', () => {
  const invalid = validateCorrectionFeedback({
    eventId: 'sacred-era-1',
    category: 'Date Correction',
    note: 'short',
    contributorEmail: 'invalid-email',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.note);
  assert.ok(invalid.errors.contributorEmail);

  const valid = validateCorrectionFeedback({
    eventId: 'sacred-era-1',
    category: 'Missing Source',
    note: 'Consider adding Rigveda 10.129 verse 7 commentary from Sayana.',
    contributorEmail: 'reader@example.com',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});



