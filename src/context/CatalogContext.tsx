import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { PARALLEL_ERA_RECORDS, TIMELINE_ERAS } from '../data/mockSanatanData.ts';
import { TOPIC_MEDIA_SEEDS } from '../data/topicMediaSeeds.ts';
import {
  SourceReference,
  TimelineEvent,
  TopicMediaItem,
} from '../types/index.ts';
import {
  buildSafeFirestoreId,
  collectAllTopics,
  groupTopicMediaByTopic,
  mergeTopicMediaCollections,
  NewMediaInput,
  NewTopicInput,
  parseCommaSeparatedEntities,
  validateNewMediaInput,
  validateNewTopicInput,
} from '../utils/comicStudioLogic.ts';
import { useAuth } from './AuthContext.tsx';

interface CatalogContextValue {
  customTopics: TimelineEvent[];
  allTopics: Array<TimelineEvent & { eraNumber: number; eraRange: string }>;
  allMedia: TopicMediaItem[];
  mediaByTopic: Record<string, TopicMediaItem[]>;
  catalogLoading: boolean;
  catalogError: string | null;
  addTopicAsAdmin: (input: NewTopicInput) => Promise<TimelineEvent>;
  addMediaToTopic: (input: NewMediaInput) => Promise<TopicMediaItem>;
  deleteTopicAsAdmin: (topicId: string) => Promise<void>;
  deleteMediaItem: (mediaId: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function getTrackVisualTheme(track: 'sacred' | 'scientific' | 'historical') {
  if (track === 'sacred') {
    return {
      accentColor: '#ea580c',
      bgGradient: 'from-orange-950',
      badgeStyle: 'border-orange-500/40 text-orange-300',
    };
  }
  if (track === 'scientific') {
    return {
      accentColor: '#0284c7',
      bgGradient: 'from-sky-950',
      badgeStyle: 'border-sky-500/40 text-sky-300',
    };
  }
  return {
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950',
    badgeStyle: 'border-emerald-500/40 text-emerald-300',
  };
}

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [customTopics, setCustomTopics] = useState<TimelineEvent[]>([]);
  const [liveMedia, setLiveMedia] = useState<TopicMediaItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let topicsLoaded = false;
    let mediaLoaded = false;

    const markLoaded = () => {
      if (topicsLoaded && mediaLoaded) {
        setCatalogLoading(false);
      }
    };

    const unsubTopics = onSnapshot(
      collection(db, 'topics'),
      (snapshot) => {
        const items: TimelineEvent[] = snapshot.docs.map((snap) => {
          const d = snap.data();
          const track = (d.track as 'sacred' | 'scientific' | 'historical') || 'sacred';
          return {
            id: String(d.id || snap.id),
            title: String(d.title || ''),
            sanskritTitle: typeof d.sanskritTitle === 'string' ? d.sanskritTitle : undefined,
            eraId: String(d.eraId || 'cosmic-origins'),
            eraName: String(d.eraName || 'Cosmic Origins'),
            track,
            traditionalDate: String(d.traditionalDate || ''),
            historicalDateRange: String(d.historicalDateRange || ''),
            textCompositionDate:
              typeof d.textCompositionDate === 'string' ? d.textCompositionDate : undefined,
            evidenceLabel: d.evidenceLabel || 'Traditional chronology',
            uncertaintyNotes:
              typeof d.uncertaintyNotes === 'string' ? d.uncertaintyNotes : undefined,
            summary: String(d.summary || ''),
            fullExplanation: String(d.fullExplanation || ''),
            culturalSignificance: String(d.culturalSignificance || ''),
            relatedEntities: Array.isArray(d.relatedEntities) ? d.relatedEntities.map(String) : [],
            sources: Array.isArray(d.sources) ? (d.sources as SourceReference[]) : [],
            visualTheme: getTrackVisualTheme(track),
            isCustomTopic: true,
            createdBy: typeof d.createdBy === 'string' ? d.createdBy : undefined,
          };
        });
        setCustomTopics(items);
        topicsLoaded = true;
        markLoaded();
      },
      (err) => {
        console.warn('Topics listener warning:', err.message);
        setCatalogError(err.message);
        topicsLoaded = true;
        markLoaded();
      }
    );

    const unsubMedia = onSnapshot(
      collection(db, 'topicMedia'),
      (snapshot) => {
        const items: TopicMediaItem[] = snapshot.docs.map((snap) => {
          const d = snap.data();
          return {
            id: String(d.id || snap.id),
            topicId: String(d.topicId || ''),
            track: (d.track as 'sacred' | 'scientific' | 'historical') || 'sacred',
            title: String(d.title || ''),
            sanskritTitle: typeof d.sanskritTitle === 'string' ? d.sanskritTitle : undefined,
            mediaType: d.mediaType || 'Comic Issue',
            status: d.status || 'Planned',
            issueNumber: typeof d.issueNumber === 'string' ? d.issueNumber : undefined,
            creatorName: String(d.creatorName || ''),
            synopsis: String(d.synopsis || ''),
            durationOrLength:
              typeof d.durationOrLength === 'string' ? d.durationOrLength : undefined,
            coverPreset: d.coverPreset || 'sacred-cosmos',
            externalUrl: typeof d.externalUrl === 'string' ? d.externalUrl : undefined,
            comicPanels: Array.isArray(d.comicPanels) ? d.comicPanels : [],
            isSeeded: false,
            createdBy: typeof d.createdBy === 'string' ? d.createdBy : undefined,
          };
        });
        setLiveMedia(items);
        mediaLoaded = true;
        markLoaded();
      },
      (err) => {
        console.warn('TopicMedia listener warning:', err.message);
        setCatalogError(err.message);
        mediaLoaded = true;
        markLoaded();
      }
    );

    return () => {
      unsubTopics();
      unsubMedia();
    };
  }, []);

  const allTopics = useMemo(
    () => collectAllTopics(PARALLEL_ERA_RECORDS, customTopics),
    [customTopics]
  );

  const allMedia = useMemo(
    () => mergeTopicMediaCollections(TOPIC_MEDIA_SEEDS, liveMedia),
    [liveMedia]
  );

  const mediaByTopic = useMemo(() => groupTopicMediaByTopic(allMedia), [allMedia]);

  const addTopicAsAdmin = async (input: NewTopicInput): Promise<TimelineEvent> => {
    if (!user || !user.emailVerified || !isAdmin) {
      throw new Error('Only verified administrators can add new timeline topics.');
    }

    const validation = validateNewTopicInput(input);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || 'Invalid topic fields.';
      throw new Error(firstError);
    }

    const matchedEra = TIMELINE_ERAS.find((e) => e.id === input.eraId);
    const eraName = matchedEra ? matchedEra.name : input.eraId;
    const topicId = buildSafeFirestoreId(`topic-${input.track}`, input.title);
    const entities = parseCommaSeparatedEntities(input.relatedEntitiesText);

    const sourceEntry: SourceReference = {
      title: input.sourceTitle.trim(),
      type: input.track === 'sacred' ? 'scripture' : 'primary',
      citation: input.sourceCitation.trim(),
      ...(input.sourceAuthor?.trim() ? { author: input.sourceAuthor.trim() } : {}),
    };

    const docPayload: Record<string, unknown> = {
      id: topicId,
      title: input.title.trim(),
      eraId: input.eraId.trim(),
      eraName,
      track: input.track,
      traditionalDate: input.traditionalDate.trim(),
      historicalDateRange: input.historicalDateRange.trim(),
      evidenceLabel: input.evidenceLabel,
      summary: input.summary.trim(),
      fullExplanation: input.fullExplanation.trim(),
      culturalSignificance: input.culturalSignificance.trim(),
      relatedEntities: entities,
      sources: [sourceEntry],
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (input.sanskritTitle?.trim()) {
      docPayload.sanskritTitle = input.sanskritTitle.trim();
    }
    if (input.textCompositionDate?.trim()) {
      docPayload.textCompositionDate = input.textCompositionDate.trim();
    }
    if (input.uncertaintyNotes?.trim()) {
      docPayload.uncertaintyNotes = input.uncertaintyNotes.trim();
    }

    try {
      await setDoc(doc(db, 'topics', topicId), docPayload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `topics/${topicId}`);
    }

    return {
      id: topicId,
      title: input.title.trim(),
      sanskritTitle: input.sanskritTitle?.trim() || undefined,
      eraId: input.eraId.trim(),
      eraName,
      track: input.track,
      traditionalDate: input.traditionalDate.trim(),
      historicalDateRange: input.historicalDateRange.trim(),
      textCompositionDate: input.textCompositionDate?.trim() || undefined,
      evidenceLabel: input.evidenceLabel,
      uncertaintyNotes: input.uncertaintyNotes?.trim() || undefined,
      summary: input.summary.trim(),
      fullExplanation: input.fullExplanation.trim(),
      culturalSignificance: input.culturalSignificance.trim(),
      relatedEntities: entities,
      sources: [sourceEntry],
      visualTheme: getTrackVisualTheme(input.track),
      isCustomTopic: true,
      createdBy: user.uid,
    };
  };

  const addMediaToTopic = async (input: NewMediaInput): Promise<TopicMediaItem> => {
    if (!user || !user.emailVerified) {
      throw new Error('Please sign in with Google to add comics or media to a topic.');
    }

    const validation = validateNewMediaInput(input);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] || 'Invalid media fields.';
      throw new Error(firstError);
    }

    const mediaId = buildSafeFirestoreId(`media-${input.track}`, input.title);
    const cleanedPanels = input.comicPanels.map((p, idx) => ({
      panelNumber: idx + 1,
      sceneTitle: p.sceneTitle.trim(),
      caption: p.caption.trim(),
      ...(p.dialogue?.trim() ? { dialogue: p.dialogue.trim() } : {}),
    }));

    const docPayload: Record<string, unknown> = {
      id: mediaId,
      topicId: input.topicId.trim(),
      track: input.track,
      title: input.title.trim(),
      mediaType: input.mediaType,
      status: input.status,
      creatorName: input.creatorName.trim(),
      synopsis: input.synopsis.trim(),
      coverPreset: input.coverPreset,
      comicPanels: cleanedPanels,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (input.sanskritTitle?.trim()) {
      docPayload.sanskritTitle = input.sanskritTitle.trim();
    }
    if (input.issueNumber?.trim()) {
      docPayload.issueNumber = input.issueNumber.trim();
    }
    if (input.durationOrLength?.trim()) {
      docPayload.durationOrLength = input.durationOrLength.trim();
    }
    if (input.externalUrl?.trim()) {
      docPayload.externalUrl = input.externalUrl.trim();
    }

    try {
      await setDoc(doc(db, 'topicMedia', mediaId), docPayload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `topicMedia/${mediaId}`);
    }

    return {
      id: mediaId,
      topicId: input.topicId.trim(),
      track: input.track,
      title: input.title.trim(),
      sanskritTitle: input.sanskritTitle?.trim() || undefined,
      mediaType: input.mediaType,
      status: input.status,
      issueNumber: input.issueNumber?.trim() || undefined,
      creatorName: input.creatorName.trim(),
      synopsis: input.synopsis.trim(),
      durationOrLength: input.durationOrLength?.trim() || undefined,
      coverPreset: input.coverPreset,
      externalUrl: input.externalUrl?.trim() || undefined,
      comicPanels: cleanedPanels,
      isSeeded: false,
      createdBy: user.uid,
    };
  };

  const deleteTopicAsAdmin = async (topicId: string) => {
    if (!user || !isAdmin) {
      throw new Error('Only administrators can delete topics.');
    }
    try {
      await deleteDoc(doc(db, 'topics', topicId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `topics/${topicId}`);
    }
  };

  const deleteMediaItem = async (mediaId: string) => {
    if (!user) {
      throw new Error('Sign in required to delete a custom comic or media entry.');
    }
    try {
      await deleteDoc(doc(db, 'topicMedia', mediaId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `topicMedia/${mediaId}`);
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        customTopics,
        allTopics,
        allMedia,
        mediaByTopic,
        catalogLoading,
        catalogError,
        addTopicAsAdmin,
        addMediaToTopic,
        deleteTopicAsAdmin,
        deleteMediaItem,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used inside CatalogProvider.');
  }
  return ctx;
}
