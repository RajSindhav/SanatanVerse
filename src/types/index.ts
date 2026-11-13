export type EvidenceLabel = 
  | 'Well established' 
  | 'Estimated date' 
  | 'Traditional chronology' 
  | 'Textual evidence' 
  | 'Debated' 
  | 'Unverified claim';

export type TimelineTrack = 'all' | 'sacred' | 'historical' | 'scientific';

export interface SourceReference {
  title: string;
  author?: string;
  type: 'primary' | 'secondary' | 'scripture';
  citation: string;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  sanskritTitle?: string;
  eraId: string;
  eraName: string;
  track: 'sacred' | 'historical' | 'scientific';
  traditionalDate: string;
  historicalDateRange: string;
  textCompositionDate?: string;
  evidenceLabel: EvidenceLabel;
  uncertaintyNotes?: string;
  summary: string;
  fullExplanation: string;
  sources: SourceReference[];
  relatedEntities: string[];
  culturalSignificance: string;
  visualTheme: {
    accentColor: string;
    bgGradient: string;
    badgeStyle: string;
  };
  isCustomTopic?: boolean;
  createdBy?: string;
}

export type TopicMediaType =
  | 'Comic Issue'
  | 'Motion Comic'
  | 'Graphic Novel'
  | 'Concept Art'
  | 'Audio Narration'
  | 'Video Teaser'
  | 'Research Sourcebook';

export type TopicMediaStatus = 'Published' | 'In Production' | 'Planned' | 'Concept';

export type CoverPreset = 'sacred-cosmos' | 'scientific-nebula' | 'historical-temple';

export interface TopicComicPanel {
  panelNumber: number;
  sceneTitle: string;
  caption: string;
  dialogue?: string;
}

export interface TopicMediaItem {
  id: string;
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
  isSeeded?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface TimelineEra {
  id: string;
  name: string;
  sanskritName: string;
  approximateRange: string;
  description: string;
  eventCount?: number;
}

export interface EraPublishedContent {
  id: string;
  title: string;
  format: 'Motion Comic' | 'Graphic Novel' | 'Streaming Episode' | 'Research Sourcebook';
  releaseStatus: 'Published Now' | 'In Production' | 'Next in Pipeline';
  publishedDate: string;
  synopsis: string;
  primaryPerspective: 'sacred' | 'historical' | 'scientific' | 'tri-perspective';
}

export interface ParallelEraRecord {
  era: TimelineEra;
  eraNumber: number;
  convergenceHighlight: string;
  sacredPointOfView: TimelineEvent;
  scientificPointOfView: TimelineEvent;
  historicalPointOfView: TimelineEvent;
  publishedContent: EraPublishedContent;
}


export interface ComicPanel {
  id: string;
  panelNumber: number;
  visualDescription: string;
  speaker?: string;
  dialogue?: string;
  narration?: string;
  soundEffect?: string;
  loreNote?: string;
  scripturalCitation?: string;
  visualTone: 'cosmic-fire' | 'golden-dawn' | 'deep-astral' | 'sacred-river' | 'epic-battlefield';
  artSvgPreset: 'rudra' | 'rama' | 'arjuna' | 'hanuman' | 'ganga' | 'om' | 'chariot';
}

export interface ComicChapter {
  id: string;
  title: string;
  chapterNumber: number;
  duration: string;
  synopsis: string;
  panels: ComicPanel[];
}

export interface ComicSeries {
  id: string;
  title: string;
  sanskritTitle: string;
  tagline: string;
  synopsis: string;
  category: 'Motion Comic' | 'Graphic Novel' | 'Animated Teaser';
  status: 'Streaming Now' | 'In Production' | 'Preview Available';
  durationOrPages: string;
  ageRating: string;
  tags: string[];
  scripturalRoots: string;
  rating: number;
  views: string;
  accentColor: string;
  chapters: ComicChapter[];
}

export interface CommunityArtwork {
  id: string;
  title: string;
  artist: {
    name: string;
    handle: string;
    location: string;
  };
  medium: 'Digital Painting' | 'Motion Concept' | 'Ink & Traditional' | '3D Sculpture';
  theme: string;
  description: string;
  promptOrTechnique: string;
  likes: number;
  isLiked?: boolean;
  views: number;
  paletteColors: string[];
  dateAdded: string;
  featured: boolean;
  artStylePreset: 'durga' | 'shiva' | 'vishnu' | 'krishna' | 'surya' | 'ganesha' | 'hanuman' | 'rama' | 'rudra' | 'ganga' | 'om' | 'chariot';
}

export interface BlueprintTask {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'completed' | 'in-progress' | 'planned';
  details: string;
}
