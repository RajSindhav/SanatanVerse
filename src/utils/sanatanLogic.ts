import { TimelineEvent, TimelineTrack, EvidenceLabel, BlueprintTask } from '../types/index.ts';

export interface TimelineFilterOptions {
  track: TimelineTrack;
  eraId?: string;
  searchQuery?: string;
  evidenceLabel?: EvidenceLabel | 'all';
}

/**
 * Filter timeline events based on track, era, search terms, and evidence labels
 */
export function filterTimelineEvents(
  events: TimelineEvent[],
  options: TimelineFilterOptions
): TimelineEvent[] {
  return events.filter((event) => {
    // 1. Track filter
    if (options.track !== 'all' && event.track !== options.track) {
      return false;
    }

    // 2. Era filter
    if (options.eraId && options.eraId !== 'all' && event.eraId !== options.eraId) {
      return false;
    }

    // 3. Evidence label filter
    if (options.evidenceLabel && options.evidenceLabel !== 'all' && event.evidenceLabel !== options.evidenceLabel) {
      return false;
    }

    // 4. Search query
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchSanskrit = event.sanskritTitle ? event.sanskritTitle.toLowerCase().includes(q) : false;
      const matchSummary = event.summary.toLowerCase().includes(q);
      const matchExplanation = event.fullExplanation.toLowerCase().includes(q);
      const matchEntities = event.relatedEntities.some((entity) => entity.toLowerCase().includes(q));
      const matchSources = event.sources.some(
        (src) => src.title.toLowerCase().includes(q) || (src.author && src.author.toLowerCase().includes(q))
      );

      if (!matchTitle && !matchSanskrit && !matchSummary && !matchExplanation && !matchEntities && !matchSources) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Return evidence badge style details and definitions
 */
export function getEvidenceLabelMeta(label: EvidenceLabel): {
  color: string;
  definition: string;
  severity: 'high' | 'medium' | 'contextual';
} {
  switch (label) {
    case 'Well established':
      return {
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
        definition: 'Supported by strong, converging archaeological, epigraphic or textual evidence.',
        severity: 'high'
      };
    case 'Estimated date':
      return {
        color: 'text-amber-300 border-amber-500/30 bg-amber-950/30',
        definition: 'Evidence supports a verifiable chronological range, but the exact date is uncertain.',
        severity: 'medium'
      };
    case 'Traditional chronology':
      return {
        color: 'text-orange-400 border-orange-500/30 bg-orange-950/30',
        definition: 'A date or cosmic sequence attributed to a specified tradition, Purana or astrological marker.',
        severity: 'contextual'
      };
    case 'Textual evidence':
      return {
        color: 'text-cyan-300 border-cyan-500/30 bg-cyan-950/30',
        definition: 'A source text is documented and verified; the narrated event itself requires separate assessment.',
        severity: 'medium'
      };
    case 'Debated':
      return {
        color: 'text-rose-400 border-rose-500/30 bg-rose-950/30',
        definition: 'Material scholarly disagreement or unresolved multi-disciplinary evidence exists.',
        severity: 'medium'
      };
    case 'Unverified claim':
      return {
        color: 'text-stone-400 border-stone-600 bg-stone-900/40',
        definition: 'Insufficient primary or secondary evidence to present as historically established.',
        severity: 'contextual'
      };
  }
}

/**
 * Calculate progress metrics across the Master Brand Blueprint tasks
 */
export function calculateBlueprintProgress(tasks: BlueprintTask[]) {
  const total = tasks.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      planned: 0,
      completionRate: 0,
      byPriority: {
        P0: { total: 0, completed: 0, rate: 0 },
        P1: { total: 0, completed: 0, rate: 0 },
        P2: { total: 0, completed: 0, rate: 0 },
        P3: { total: 0, completed: 0, rate: 0 },
      }
    };
  }

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const planned = tasks.filter((t) => t.status === 'planned').length;

  const priorities: Array<'P0' | 'P1' | 'P2' | 'P3'> = ['P0', 'P1', 'P2', 'P3'];
  const byPriority: Record<string, { total: number; completed: number; rate: number }> = {};

  for (const p of priorities) {
    const pTasks = tasks.filter((t) => t.priority === p);
    const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
    byPriority[p] = {
      total: pTasks.length,
      completed: pCompleted,
      rate: pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0,
    };
  }

  return {
    total,
    completed,
    inProgress,
    planned,
    completionRate: Math.round((completed / total) * 100),
    byPriority: byPriority as Record<'P0' | 'P1' | 'P2' | 'P3', { total: number; completed: number; rate: number }>
  };
}

export interface ArtworkFormInput {
  title: string;
  artistName: string;
  artistHandle: string;
  artistLocation: string;
  medium: string;
  theme: string;
  description: string;
  promptOrTechnique: string;
}

/**
 * Validate community artwork submissions
 */
export function validateArtworkSubmission(data: ArtworkFormInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Artwork title must be at least 3 characters.';
  }

  if (!data.artistName || data.artistName.trim().length < 2) {
    errors.artistName = 'Creator name is required (at least 2 characters).';
  }

  if (!data.artistHandle || !data.artistHandle.trim().startsWith('@')) {
    errors.artistHandle = 'Social handle must begin with @ (e.g. @artist).';
  }

  if (!data.medium || data.medium.trim().length === 0) {
    errors.medium = 'Please select a creative medium.';
  }

  if (!data.theme || data.theme.trim().length === 0) {
    errors.theme = 'Please select a sacred theme or deity.';
  }

  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Please provide a descriptive overview (at least 15 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats date presentation strictly honoring the SanatanVerse Blueprint:
 * Distinguishes traditional chronology from scientific/historical chronology
 */
export function formatTimelineDateDisplay(
  event: TimelineEvent,
  activeTrack: TimelineTrack
): { primaryDate: string; secondaryDate?: string; badgeLabel: string } {
  if (activeTrack === 'sacred') {
    return {
      primaryDate: event.traditionalDate,
      secondaryDate: event.historicalDateRange ? `Historical: ${event.historicalDateRange}` : undefined,
      badgeLabel: 'Sacred Chronology'
    };
  }

  if (activeTrack === 'historical') {
    return {
      primaryDate: event.historicalDateRange || 'Archaeologically Inferred',
      secondaryDate: `Traditional: ${event.traditionalDate}`,
      badgeLabel: 'Historical Track'
    };
  }

  if (activeTrack === 'scientific') {
    return {
      primaryDate: event.historicalDateRange || 'Cosmic Epoch',
      secondaryDate: `Textual Reference: ${event.traditionalDate}`,
      badgeLabel: 'Cosmological / Scientific'
    };
  }

  // All tracks
  return {
    primaryDate: event.traditionalDate,
    secondaryDate: event.historicalDateRange ? `Historical: ${event.historicalDateRange}` : undefined,
    badgeLabel: `${event.track.toUpperCase()} TRACK`
  };
}

export interface ParallelEraFilterOptions {
  eraId?: string;
  searchQuery?: string;
  perspectiveHighlight?: 'all' | 'sacred' | 'scientific' | 'historical';
  contentStatusFilter?: 'all' | 'Published Now' | 'In Production' | 'Next in Pipeline';
}

/**
 * Filter parallel era records
 */
export function filterParallelEras<T extends {
  era: { id: string; name: string; sanskritName: string };
  sacredPointOfView: TimelineEvent;
  scientificPointOfView: TimelineEvent;
  historicalPointOfView: TimelineEvent;
  publishedContent: { title: string; releaseStatus: string; synopsis: string };
  convergenceHighlight: string;
}>(
  records: T[],
  options: ParallelEraFilterOptions
): T[] {
  return records.filter((item) => {
    // 1. Era ID filter
    if (options.eraId && options.eraId !== 'all' && item.era.id !== options.eraId) {
      return false;
    }

    // 2. Content status filter
    if (options.contentStatusFilter && options.contentStatusFilter !== 'all' && item.publishedContent.releaseStatus !== options.contentStatusFilter) {
      return false;
    }

    // 3. Search query
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchEra = item.era.name.toLowerCase().includes(q) || item.era.sanskritName.toLowerCase().includes(q);
      const matchConvergence = item.convergenceHighlight.toLowerCase().includes(q);
      const matchSacred = item.sacredPointOfView.title.toLowerCase().includes(q) || item.sacredPointOfView.summary.toLowerCase().includes(q);
      const matchSci = item.scientificPointOfView.title.toLowerCase().includes(q) || item.scientificPointOfView.summary.toLowerCase().includes(q);
      const matchHist = item.historicalPointOfView.title.toLowerCase().includes(q) || item.historicalPointOfView.summary.toLowerCase().includes(q);
      const matchContent = item.publishedContent.title.toLowerCase().includes(q) || item.publishedContent.synopsis.toLowerCase().includes(q);

      if (!matchEra && !matchConvergence && !matchSacred && !matchSci && !matchHist && !matchContent) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Metadata and style definitions for the 3 parallel perspectives
 */
export function getPerspectiveMeta(perspective: 'sacred' | 'scientific' | 'historical'): {
  title: string;
  sanskritKicker: string;
  tagline: string;
  themeColor: string;
  borderColor: string;
  badgeBg: string;
  accentText: string;
  methodology: string;
} {
  switch (perspective) {
    case 'sacred':
      return {
        title: 'Sacred Point of View',
        sanskritKicker: 'श्रुति, स्मृति एवं पौराणिक कालक्रम',
        tagline: 'Cosmic cycles, Mahayugas, divine avatars & traditional dates',
        themeColor: '#ea580c',
        borderColor: 'border-orange-500/40',
        badgeBg: 'bg-orange-950/40',
        accentText: 'text-orange-400',
        methodology: 'Rooted in Vedic Samhitas, Puranic genealogies, Surya Siddhanta, and oral parampara.'
      };
    case 'scientific':
      return {
        title: 'Scientific / Cosmological Point of View',
        sanskritKicker: 'वैज्ञानिक एवं खगोलभौतिकी दृष्टिकोण',
        tagline: 'Big Bang, stellar nucleosynthesis, Earth geology & palaeontology',
        themeColor: '#0284c7',
        borderColor: 'border-sky-500/40',
        badgeBg: 'bg-sky-950/40',
        accentText: 'text-sky-400',
        methodology: 'Rooted in astrophysics, radiocarbon/argon dating, paleoclimate cores, and ancient DNA.'
      };
    case 'historical':
      return {
        title: 'Historical & Epigraphic Point of View',
        sanskritKicker: 'ऐतिहासिक एवं पुरातात्विक साक्ष्य',
        tagline: 'Archaeological strata, Brahmi inscriptions, copper plates & philology',
        themeColor: '#10b981',
        borderColor: 'border-emerald-500/40',
        badgeBg: 'bg-emerald-950/40',
        accentText: 'text-emerald-400',
        methodology: 'Ground-truthed via ASI excavations, epigraphy (e.g. Aihole, Heliodorus, Ashoka), and numismatics.'
      };
  }
}

export interface KaalChakraCoordinates {
  currentGregorianYear: number;
  kaliYugaElapsedYears: number;
  kaliYugaRemainingYears: number;
  kaliYugaPercentElapsed: number;
  brahmaYear: number;
  kalpaName: string;
  kalpaDay: number;
  manvantaraName: string;
  manvantaraNumber: number;
  totalManvantaras: number;
  mahayugaNumber: number;
  currentYuga: string;
  yugaPada: number;
  currentMuhurta: {
    name: string;
    sanskritName: string;
    significance: string;
    window: string;
    isAuspicious: boolean;
  };
  microUnits: {
    muhurtaIndex: number;
    kalaIndex: number;
    kashthaIndex: number;
    nimeshaElapsedToday: number;
  };
}

/**
 * Calculate Vedic cosmic coordinates (Kaal Chakra) for any given Gregorian Date
 */
export function calculateKaalChakraCoordinates(date: Date = new Date()): KaalChakraCoordinates {
  const currentYear = date.getFullYear();
  // Kali Yuga epoch traditionally calculated as starting midnight 17/18 Feb 3102 BCE
  const kaliYugaElapsedYears = 3101 + currentYear;
  const kaliYugaTotalYears = 432000;
  const kaliYugaRemainingYears = Math.max(0, kaliYugaTotalYears - kaliYugaElapsedYears);
  const kaliYugaPercentElapsed = Number(((kaliYugaElapsedYears / kaliYugaTotalYears) * 100).toFixed(4));

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;

  // 1 Ahoratra (24h) = 30 Muhurtas (48 mins each)
  const muhurtaIndex = Math.min(29, Math.floor(totalSecondsToday / (48 * 60)));
  const secondsIntoMuhurta = totalSecondsToday % (48 * 60);
  const kalaIndex = Math.floor(secondsIntoMuhurta / 96);
  const kashthaIndex = Math.floor((secondsIntoMuhurta % 96) / 3.2);
  const nimeshaElapsedToday = Math.floor(totalSecondsToday / (16 / 75));

  const muhurta = getCurrentMuhurta(hours, minutes);

  return {
    currentGregorianYear: currentYear,
    kaliYugaElapsedYears,
    kaliYugaRemainingYears,
    kaliYugaPercentElapsed,
    brahmaYear: 51,
    kalpaName: 'Shweta Varaha Kalpa (श्वेतवाराह कल्प)',
    kalpaDay: 1,
    manvantaraName: 'Vaivasvata Manvantara (वैवस्वत मन्वन्तर)',
    manvantaraNumber: 7,
    totalManvantaras: 14,
    mahayugaNumber: 28,
    currentYuga: 'Kali Yuga (कलियुग)',
    yugaPada: 1,
    currentMuhurta: muhurta,
    microUnits: {
      muhurtaIndex: muhurtaIndex + 1,
      kalaIndex,
      kashthaIndex,
      nimeshaElapsedToday
    }
  };
}

/**
 * Determine the specific Vedic Muhurta for a given 24h hour and minute
 */
export function getCurrentMuhurta(hours: number, minutes: number): {
  name: string;
  sanskritName: string;
  significance: string;
  window: string;
  isAuspicious: boolean;
} {
  const totalMinutes = hours * 60 + minutes;

  // 04:00 - 04:48 -> Brahma Muhurta
  if (totalMinutes >= 240 && totalMinutes < 288) {
    return {
      name: 'Brahma Muhurta',
      sanskritName: 'ब्रह्म मुहूर्त',
      significance: 'Peak Sattva time; highest cosmic receptivity for meditation and creative insight.',
      window: '04:00 – 04:48',
      isAuspicious: true
    };
  }
  // 04:48 - 05:36 -> Ushas / Samudra
  if (totalMinutes >= 288 && totalMinutes < 336) {
    return {
      name: 'Ushas Muhurta',
      sanskritName: 'उषस् मुहूर्त',
      significance: 'Dawn twilight; awakening of Prana energy across terrestrial biomes.',
      window: '04:48 – 05:36',
      isAuspicious: true
    };
  }
  // 05:36 - 06:24 -> Vijaya / Surya Udaya
  if (totalMinutes >= 336 && totalMinutes < 384) {
    return {
      name: 'Vijaya Muhurta (Dawn)',
      sanskritName: 'विजय मुहूर्त',
      significance: 'Dawn sunrise; invokes victory, clarity of intent, and divine illumination.',
      window: '05:36 – 06:24',
      isAuspicious: true
    };
  }
  // 11:36 - 12:24 -> Abhijit Muhurta
  if (totalMinutes >= 696 && totalMinutes < 744) {
    return {
      name: 'Abhijit Muhurta',
      sanskritName: 'अभिजित् मुहूर्त',
      significance: 'Midday meridian; cuts through all inauspicious astrological doshas.',
      window: '11:36 – 12:24',
      isAuspicious: true
    };
  }
  // 17:36 - 18:24 -> Godhuli / Sandhya
  if (totalMinutes >= 1056 && totalMinutes < 1104) {
    return {
      name: 'Godhuli Sandhya',
      sanskritName: 'गोधूलि वेला',
      significance: 'Sunset transition; evening contemplation, lamp lighting, and gratitude.',
      window: '17:36 – 18:24',
      isAuspicious: true
    };
  }
  // 23:36 - 00:24 -> Nishita Muhurta
  if (totalMinutes >= 1416 || totalMinutes < 24) {
    return {
      name: 'Nishita Muhurta',
      sanskritName: 'निशीथ मुहूर्त',
      significance: 'Midnight Shiva / Rudra consciousness; deep introspection and dissolution of ego.',
      window: '23:36 – 00:24',
      isAuspicious: true
    };
  }

  // General daytime / nighttime muhurta
  if (totalMinutes >= 384 && totalMinutes < 696) {
    return {
      name: 'Sangava Muhurta',
      sanskritName: 'साङ्गव मुहूर्त',
      significance: 'Morning solar radiance; optimal for focused scholarly research and production.',
      window: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      isAuspicious: true
    };
  }

  if (totalMinutes >= 744 && totalMinutes < 1056) {
    return {
      name: 'Aparahna Muhurta',
      sanskritName: 'अपराह्ण मुहूर्त',
      significance: 'Afternoon solar path; balance of intellect and steady execution.',
      window: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      isAuspicious: true
    };
  }

  return {
    name: 'Sayana / Ratri Muhurta',
    sanskritName: 'रात्रौ विश्रान्ति मुहूर्त',
    significance: 'Night cycle of rejuvenation, dream state contemplation, and subtle renewal.',
    window: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    isAuspicious: true
  };
}

export interface ConvergenceInsight {
  eraIndex: number;
  percentageHarmonic: number;
  convergenceStatus: 'High Harmonic Concordance' | 'Strong Interdisciplinary Agreement' | 'Textual & Environmental Concordance' | 'Active Multidisciplinary Research';
  coreInsight: string;
  sacredAnchor: string;
  scienceAnchor: string;
  archaeologyAnchor: string;
}

/**
 * Return computed convergence matrix metrics for an epoch (0 to 9)
 */
export function calculateConvergenceIndex(eraIndex: number): ConvergenceInsight {
  const insights: ConvergenceInsight[] = [
    {
      eraIndex: 0,
      percentageHarmonic: 94,
      convergenceStatus: 'High Harmonic Concordance',
      coreInsight: 'Nasadiya Sukta (Rigveda 10.129) anticipates quantum vacuum states: neither non-existence nor existence existed prior to cosmic emergence.',
      sacredAnchor: 'Hiranyagarbha & Nasadiya Sukta (10.129)',
      scienceAnchor: 'Big Bang inflation (13.80 ± 0.02 Ga) & CMB radiation',
      archaeologyAnchor: 'Vedic oral transmission linguistic dating (1500–1200 BCE)'
    },
    {
      eraIndex: 1,
      percentageHarmonic: 96,
      convergenceStatus: 'High Harmonic Concordance',
      coreInsight: 'Surya Siddhanta and Vishnu Purana compute 1 Kalpa as 4.32 billion solar years, within 5% of radiometric age of Earth (4.54 Ga).',
      sacredAnchor: '1 Kalpa = 1,000 Chaturyugas = 4.32 Billion Years',
      scienceAnchor: 'Radiometric U-Pb zircon dating of Earth (4.54 Ga)',
      archaeologyAnchor: 'Astronomical constants preserved across Surya Siddhanta manuscripts'
    },
    {
      eraIndex: 2,
      percentageHarmonic: 91,
      convergenceStatus: 'Strong Interdisciplinary Agreement',
      coreInsight: 'Dashavatara sequential order (Matsya → Kurma → Varaha → Narasimha → Vamana → Parashurama → Rama) mirrors aquatic, amphibian, terrestrial, anthropoid, and civilized evolutionary stages.',
      sacredAnchor: 'Matsya, Kurma & Varaha cosmic redemptions',
      scienceAnchor: 'Cambrian explosion & terrestrial tetrapod colonization',
      archaeologyAnchor: 'Gupta-era Udayagiri Varaha relief (c. 401 CE)'
    },
    {
      eraIndex: 3,
      percentageHarmonic: 89,
      convergenceStatus: 'Strong Interdisciplinary Agreement',
      coreInsight: 'Toba supereruption (74 ka) bottleneck aligns with Manu’s ark saving genetic seed stock and Seven Rishis during planetary inundation.',
      sacredAnchor: 'Satyavrata Manu & the Saptarishi ark during Pralaya',
      scienceAnchor: 'Toba bottleneck (c. 74,000 BP) & Ice Age coastal rise',
      archaeologyAnchor: 'Jwalapuram Middle Palaeolithic stone tools beneath Toba ash layer'
    },
    {
      eraIndex: 4,
      percentageHarmonic: 93,
      convergenceStatus: 'Textual & Environmental Concordance',
      coreInsight: 'Rigvedic Nadistuti (RV 10.75) places the mighty Saraswati between Yamuna and Sutlej. ISRO satellite imagery confirmed massive paleochannels.',
      sacredAnchor: 'Nadistuti Sukta: "Ambitame Naditame Devitame Saraswati"',
      scienceAnchor: 'ISRO / BARC satellite radar paleochannel mapping (3-12 km wide)',
      archaeologyAnchor: 'Over 1,200 Harappan sites located along dry Ghaggar-Hakra bed'
    },
    {
      eraIndex: 5,
      percentageHarmonic: 88,
      convergenceStatus: 'Textual & Environmental Concordance',
      coreInsight: 'Rama Sethu limestone shoals between Rameswaram and Talaimannar sit on marine Pleistocene ridge, confirmed by geological remote sensing.',
      sacredAnchor: 'Valmiki Ramayana Yuddha Kanda (Nala Sethu)',
      scienceAnchor: 'Marine bathymetry & carbon-dating of coral sand barrier (c. 7000–5000 BP)',
      archaeologyAnchor: 'Epigraphic and temple records of accessible land-bridge until 1480 cyclone'
    },
    {
      eraIndex: 6,
      percentageHarmonic: 86,
      convergenceStatus: 'Active Multidisciplinary Research',
      coreInsight: 'Aihole 634 CE inscription synchronizes Kali Yuga year 3735 with Saka 556, anchoring Kurukshetra battle to 3102 BCE tradition.',
      sacredAnchor: '3102 BCE Kali Yuga ingress & astronomical conjunctions',
      scienceAnchor: 'Planetarium retrograde planetary software retrocalculations',
      archaeologyAnchor: 'Aihole Meguti temple inscription & Sinauli royal chariots (c. 1900 BCE)'
    },
    {
      eraIndex: 7,
      percentageHarmonic: 87,
      convergenceStatus: 'Active Multidisciplinary Research',
      coreInsight: 'Marine archaeology off the coast of Dwarka (Dr. S.R. Rao) revealed submerged sandstone bastions, stone anchors, and submerged structures.',
      sacredAnchor: 'Mausala Parva description of Dwarka submergence',
      scienceAnchor: 'Mid-Holocene marine transgression curves along Gujarat coast',
      archaeologyAnchor: 'Submerged stone jetties, circular bastions & 3-hole triangular anchors'
    },
    {
      eraIndex: 8,
      percentageHarmonic: 95,
      convergenceStatus: 'High Harmonic Concordance',
      coreInsight: 'Brahmi rock edicts of Ashoka and Heliodorus pillar at Vidisha (113 BCE) demonstrate continuous Sanskrit/Prakrit epigraphic veneration of Vasudeva-Krishna.',
      sacredAnchor: 'Bhagavata tradition & Upanishadic Darshanas',
      scienceAnchor: 'Carbon-14 dated stratigraphic layers across Northern Black Polished Ware',
      archaeologyAnchor: 'Heliodorus Pillar inscription dedicating Garuda-dhvaja to Vasudeva'
    },
    {
      eraIndex: 9,
      percentageHarmonic: 98,
      convergenceStatus: 'High Harmonic Concordance',
      coreInsight: 'Sanskrit grammatical structure formalized by Panini (Ashtadhyayi) forms the exact precursor to Backus-Naur Form (BNF) in modern computer science.',
      sacredAnchor: 'Panini’s Shiva Sutras & phonological algebraic rules',
      scienceAnchor: 'Formal language theory, BNF grammar & AI computational linguistics',
      archaeologyAnchor: 'Direct manuscripts preserved in Sharada, Devanagari, and Grantha'
    }
  ];

  const safeIndex = Math.max(0, Math.min(eraIndex, insights.length - 1));
  return insights[safeIndex];
}

export interface LivePulseItem {
  id: string;
  userName: string;
  location: string;
  action: string;
  target: string;
  timestamp: string;
  iconType: 'reader' | 'scholar' | 'artist' | 'archivist';
}

/**
 * Procedurally generates realistic live community activity items
 */
export function generateLivePulseActivity(tickIndex: number): LivePulseItem {
  const activities: Array<{
    userName: string;
    location: string;
    action: string;
    target: string;
    iconType: 'reader' | 'scholar' | 'artist' | 'archivist';
  }> = [
    {
      userName: 'Aarav M.',
      location: 'Bengaluru, India',
      action: 'unlocked Chapter 3 of',
      target: 'Kurukshetra: Vortex of the 18 Days',
      iconType: 'reader'
    },
    {
      userName: 'Dr. Evelyn Carter',
      location: 'Oxford, UK',
      action: 'cited Epigraphic Proof on',
      target: 'Aihole 634 CE Inscription in Epoch 6',
      iconType: 'archivist'
    },
    {
      userName: 'Tanvi Sharma',
      location: 'Varanasi, India',
      action: 'submitted new artwork',
      target: 'Tandava of Nataraja (4K Vector)',
      iconType: 'artist'
    },
    {
      userName: 'Vikramaditya S.',
      location: 'New York, USA',
      action: 'tested Kalpa correlation with',
      target: '4.54 Ga Earth Age on Convergence Dial',
      iconType: 'scholar'
    },
    {
      userName: 'Kavita Nair',
      location: 'Thiruvananthapuram, India',
      action: 'activated Founder Patron Pass for',
      target: 'Kodanda: The Celestial Bow',
      iconType: 'reader'
    },
    {
      userName: 'Prof. Rajeshwar Jha',
      location: 'Pune, India',
      action: 'verified textual citation in',
      target: 'Surya Siddhanta Chapter 1 shlokas',
      iconType: 'scholar'
    },
    {
      userName: 'Siddharth Rao',
      location: 'Singapore',
      action: 'shared motion comic teaser for',
      target: 'Rudra: The First Flame',
      iconType: 'artist'
    }
  ];

  const item = activities[tickIndex % activities.length];
  return {
    id: `pulse-${tickIndex}-${Date.now()}`,
    ...item,
    timestamp: 'Just now'
  };
}

/**
 * Handle panel live reactions with immutable record update
 */
export function recordPanelReaction(
  currentReactions: Record<string, number>,
  reactionType: 'divine' | 'astra' | 'evidence' | 'wisdom'
): Record<string, number> {
  return {
    ...currentReactions,
    [reactionType]: (currentReactions[reactionType] || 0) + 1
  };
}

export interface ChronologicalEventEntry extends TimelineEvent {
  eraNumber: number;
  eraRange: string;
}

/**
 * Flatten ParallelEraRecord entries into a sorted chronological list of TimelineEvents
 * preserving eraNumber and eraRange metadata
 */
export function flattenParallelErasToEvents<
  T extends {
    era: { approximateRange: string };
    eraNumber: number;
    sacredPointOfView: TimelineEvent;
    scientificPointOfView: TimelineEvent;
    historicalPointOfView: TimelineEvent;
  }
>(parallelEras: T[]): ChronologicalEventEntry[] {
  const ordered: ChronologicalEventEntry[] = [];
  const sorted = [...parallelEras].sort((a, b) => a.eraNumber - b.eraNumber);

  for (const record of sorted) {
    const baseMeta = {
      eraNumber: record.eraNumber,
      eraRange: record.era.approximateRange,
    };
    ordered.push({ ...record.sacredPointOfView, ...baseMeta });
    ordered.push({ ...record.scientificPointOfView, ...baseMeta });
    ordered.push({ ...record.historicalPointOfView, ...baseMeta });
  }

  return ordered;
}

/**
 * Return structured Data Type classification for an event track
 */
export function getDataTypeLabel(track: 'sacred' | 'scientific' | 'historical'): {
  shortLabel: string;
  dataType: string;
  methodology: string;
} {
  if (track === 'sacred') {
    return {
      shortLabel: 'Sacred',
      dataType: 'Traditional & Scriptural Chronology',
      methodology: 'Derived from Vedic, Puranic, and Itihasa textual lineages.'
    };
  }
  if (track === 'scientific') {
    return {
      shortLabel: 'Scientific',
      dataType: 'Empirical & Cosmological Observation',
      methodology: 'Grounded in radiometric dating, astrophysics, genetics, and Earth science.'
    };
  }
  return {
    shortLabel: 'Historical',
    dataType: 'Archaeological & Epigraphic Record',
    methodology: 'Established via material stratigraphy, stone inscriptions, and philology.'
  };
}

/**
 * Return explicit uncertainty & calibration note for any timeline event
 */
export function getUncertaintySummary(event: TimelineEvent): string {
  if (event.uncertaintyNotes && event.uncertaintyNotes.trim().length > 0) {
    return event.uncertaintyNotes;
  }
  switch (event.evidenceLabel) {
    case 'Well established':
      return 'Core material or empirical findings are well corroborated; finer sub-period bounds remain subject to ongoing fieldwork.';
    case 'Estimated date':
      return 'Chronological window reflects current scholarly consensus estimates rather than an exact single-year date.';
    case 'Traditional chronology':
      return 'Reflects traditional sacred cycles and Puranic/astronomical conventions rather than carbon-dated material chronology.';
    case 'Textual evidence':
      return 'Documented within surviving manuscripts and oral recensions; textual redaction strata may span multiple centuries.';
    case 'Debated':
      return 'Active multidisciplinary scholarly discussion exists across textual interpretation, archaeo-astronomy, and stratigraphy.';
    case 'Unverified claim':
      return 'Requires additional peer-reviewed or primary textual verification before formal chronological placement.';
  }
}

export interface CorrectionFeedbackInput {
  eventId: string;
  category: string;
  note: string;
  suggestedSource?: string;
  contributorEmail?: string;
}

/**
 * Validate event correction / feedback submission
 */
export function validateCorrectionFeedback(input: CorrectionFeedbackInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.eventId || input.eventId.trim().length === 0) {
    errors.eventId = 'Target event ID is missing.';
  }

  if (!input.category || input.category.trim().length === 0) {
    errors.category = 'Please select a feedback category.';
  }

  if (!input.note || input.note.trim().length < 10) {
    errors.note = 'Please describe the correction or feedback (at least 10 characters).';
  }

  if (
    input.contributorEmail &&
    input.contributorEmail.trim().length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contributorEmail.trim())
  ) {
    errors.contributorEmail = 'Please enter a valid email address or leave this field blank.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}



