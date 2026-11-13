/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ParallelTimelineMatrix } from './components/ParallelTimelineMatrix.tsx';
import { EventDetailPage } from './components/EventDetailPage.tsx';
import { VisionSection } from './components/VisionSection.tsx';
import { WaitlistSection } from './components/WaitlistSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FounderPassModal } from './components/FounderPassModal.tsx';
import { DownloadZipModal } from './components/DownloadZipModal.tsx';
import { TopicMediaModal } from './components/TopicMediaModal.tsx';
import { AddTopicModal } from './components/AddTopicModal.tsx';
import { PersistentGlossaryDock } from './components/PersistentGlossaryDock.tsx';
import { GlossaryProvider } from './context/GlossaryContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CatalogProvider, useCatalog } from './context/CatalogContext.tsx';
import { PARALLEL_ERA_RECORDS } from './data/mockSanatanData.ts';
import { EvidenceLabel, TimelineEvent, TimelineTrack } from './types/index.ts';

function AppShell() {
  const { allTopics } = useCatalog();

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState<boolean>(false);
  const [isDownloadZipOpen, setIsDownloadZipOpen] = useState<boolean>(false);

  // Timeline & Comics studio view state
  const [activeTrack, setActiveTrack] = useState<TimelineTrack>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEraId, setSelectedEraId] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceLabel | 'all'>('all');
  const [timelineViewMode, setTimelineViewMode] = useState<'timeline' | 'comics'>('timeline');

  // Event detail page state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Topic Media Studio Modal & Admin Add Topic Modal
  const [mediaModalTopic, setMediaModalTopic] = useState<TimelineEvent | null>(null);
  const [mediaModalStartComposer, setMediaModalStartComposer] = useState<boolean>(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState<boolean>(false);
  const [addTopicDefaultTrack, setAddTopicDefaultTrack] = useState<
    'sacred' | 'scientific' | 'historical'
  >('sacred');
  const [addTopicDefaultEraId, setAddTopicDefaultEraId] = useState<string>('cosmic-origins');

  const selectedEvent = useMemo(
    () => (selectedEventId ? allTopics.find((e) => e.id === selectedEventId) || null : null),
    [selectedEventId, allTopics]
  );

  const selectedEventEra = useMemo(
    () =>
      selectedEvent
        ? PARALLEL_ERA_RECORDS.find((r) => r.era.id === selectedEvent.eraId)
        : undefined,
    [selectedEvent]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get('event');
      if (eventParam && allTopics.some((e) => e.id === eventParam)) {
        setSelectedEventId(eventParam);
      }
      if (params.get('download') === '1' || params.get('zip') === '1') {
        setIsDownloadZipOpen(true);
      }
      if (params.get('section') && !eventParam) {
        handleNavigate(params.get('section')!);
      }
    }
  }, [allTopics]);

  const updateUrlEventParam = (eventId: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (eventId) {
      url.searchParams.set('event', eventId);
    } else {
      url.searchParams.delete('event');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleSelectEvent = (event: TimelineEvent) => {
    setSelectedEventId(event.id);
    updateUrlEventParam(event.id);
  };

  const handleBackToOverview = () => {
    setSelectedEventId(null);
    updateUrlEventParam(null);
    setTimeout(() => {
      const el = document.getElementById('parallel-timeline-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleSearchEntityFromDetail = (entity: string) => {
    setTimelineViewMode('timeline');
    setActiveTrack('all');
    setSelectedEraId('all');
    setSelectedEvidence('all');
    setSearchQuery(entity);
    handleBackToOverview();
  };

  const handleOpenTopicMedia = (topic: TimelineEvent, startInComposer = false) => {
    setMediaModalTopic(topic);
    setMediaModalStartComposer(startInComposer);
  };

  const handleOpenAddTopicModal = (
    track: 'sacred' | 'scientific' | 'historical' = 'sacred',
    eraId = 'cosmic-origins'
  ) => {
    setAddTopicDefaultTrack(track);
    setAddTopicDefaultEraId(eraId);
    setIsAddTopicOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (selectedEventId) {
      setSelectedEventId(null);
      updateUrlEventParam(null);
    }

    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'comics') {
      setTimelineViewMode('comics');
    } else if (sectionId === 'timelines') {
      setTimelineViewMode('timeline');
    }

    const elementMap: Record<string, string> = {
      timelines: 'parallel-timeline-section',
      comics: 'parallel-timeline-section',
      'parallel-timeline': 'parallel-timeline-section',
      timeline: 'parallel-timeline-section',
      vision: 'vision-section',
      waitlist: 'waitlist-section',
    };

    setTimeout(() => {
      const targetEl = document.getElementById(elementMap[sectionId] || sectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <div className="min-h-screen bg-[#f3ead8] text-[#231b12] flex flex-col font-sans selection:bg-amber-200 selection:text-[#2c1906]">
      <Navbar
        activeSection={selectedEvent ? 'timelines' : activeSection}
        onNavigate={handleNavigate}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />

      <main className="flex-1">
        {selectedEvent ? (
          <EventDetailPage
            event={selectedEvent}
            eraRecord={selectedEventEra}
            onBack={handleBackToOverview}
            onSelectEvent={handleSelectEvent}
            onSearchEntity={handleSearchEntityFromDetail}
            onOpenTopicMedia={handleOpenTopicMedia}
          />
        ) : (
          <>
            <HeroSection
              onExploreTimeline={() => handleNavigate('timelines')}
              onOpenWaitlist={() => setIsWaitlistOpen(true)}
            />

            <ParallelTimelineMatrix
              parallelEras={PARALLEL_ERA_RECORDS}
              activeTrack={activeTrack}
              onTrackChange={setActiveTrack}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedEraId={selectedEraId}
              onEraChange={setSelectedEraId}
              selectedEvidence={selectedEvidence}
              onEvidenceChange={setSelectedEvidence}
              viewMode={timelineViewMode}
              onViewModeChange={setTimelineViewMode}
              onSelectEvent={handleSelectEvent}
              onOpenTopicMedia={handleOpenTopicMedia}
              onOpenAddTopicModal={handleOpenAddTopicModal}
            />

            <VisionSection />

            <WaitlistSection />
          </>
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenDownloadZip={() => setIsDownloadZipOpen(true)}
      />

      <PersistentGlossaryDock />

      <TopicMediaModal
        isOpen={Boolean(mediaModalTopic)}
        topic={mediaModalTopic}
        initialStartComposer={mediaModalStartComposer}
        onClose={() => setMediaModalTopic(null)}
        onSelectTopic={(t) => {
          setMediaModalTopic(t);
          setMediaModalStartComposer(false);
        }}
      />

      <AddTopicModal
        isOpen={isAddTopicOpen}
        defaultTrack={addTopicDefaultTrack}
        defaultEraId={addTopicDefaultEraId}
        onClose={() => setIsAddTopicOpen(false)}
        onCreated={() => setTimelineViewMode('timeline')}
      />

      <FounderPassModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />

      <DownloadZipModal
        isOpen={isDownloadZipOpen}
        onClose={() => setIsDownloadZipOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <GlossaryProvider>
          <AppShell />
        </GlossaryProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
