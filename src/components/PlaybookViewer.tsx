import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Shield,
  Download,
  AlertTriangle,
  RefreshCw,
  Award,
} from 'lucide-react';
import { BlueprintTask } from '../types/index.ts';
import { calculateBlueprintProgress } from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';

interface PlaybookViewerProps {
  initialTasks: BlueprintTask[];
}

export const PlaybookViewer: React.FC<PlaybookViewerProps> = ({
  initialTasks,
}) => {
  const [tasks, setTasks] = useState<BlueprintTask[]>(initialTasks);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'P0' | 'P1' | 'P2' | 'P3'>('all');
  const [activeTab, setActiveTab] = useState<'checklist' | 'divisions' | 'constitution' | 'operating'>('checklist');

  // Load task statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanatan_blueprint_tasks');
      if (saved) {
        const savedMap: Record<string, BlueprintTask['status']> = JSON.parse(saved);
        setTasks((prev) =>
          prev.map((t) => ({
            ...t,
            status: savedMap[t.id] || t.status,
          }))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleTask = (taskId: string) => {
    soundEffects.playPanelSwoosh();
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus: BlueprintTask['status'] =
            t.status === 'completed'
              ? 'in-progress'
              : t.status === 'in-progress'
              ? 'planned'
              : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      });

      // Save to localStorage
      const statusMap: Record<string, string> = {};
      updated.forEach((t) => {
        statusMap[t.id] = t.status;
      });
      localStorage.setItem('sanatan_blueprint_tasks', JSON.stringify(statusMap));

      return updated;
    });
  };

  const handleResetChecklist = () => {
    setTasks(initialTasks);
    localStorage.removeItem('sanatan_blueprint_tasks');
    soundEffects.playTempleBell();
  };

  const progress = calculateBlueprintProgress(tasks);

  const filteredTasks = priorityFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.priority === priorityFilter);

  return (
    <section id="blueprint-section" className="py-16 sm:py-24 border-b border-stone-800 bg-[#090807]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 font-serif">
              <FileText className="w-4 h-4" />
              <span>SanatanVerse Master Brand Blueprint</span>
              <span aria-hidden="true">·</span>
              <span>Operating Playbook v1.0</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              The Architecture of a Global Mythological Brand
            </h2>
            <p className="text-sm sm:text-base text-stone-400 max-w-2xl">
              An editable, step-by-step operating roadmap to build a trustworthy knowledge,
              entertainment, and streaming powerhouse based on the official master document.
            </p>
          </div>

          {/* Download Blueprint PDF button referencing local asset */}
          <div className="flex items-center gap-3">
            <a
              href="/assets/aistudio/SanatanVerse_Master_Brand_Blueprint_Editable_Checklist_b02bfafc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 flex items-center gap-2 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Master Blueprint (PDF)</span>
            </a>
          </div>
        </div>

        {/* Blueprint Overview Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400">Total Playbook Tasks</span>
            <div className="text-2xl font-bold text-stone-100 font-mono">
              {progress.completed}/{progress.total}
            </div>
            <div className="w-full bg-stone-950 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.completionRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400">P0 Required Launch Gates</span>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {progress.byPriority.P0.completed}/{progress.byPriority.P0.total}
            </div>
            <span className="text-[11px] text-stone-500">
              {progress.byPriority.P0.rate}% Required Completed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400">P1 Quality & Content</span>
            <div className="text-2xl font-bold text-sky-400 font-mono">
              {progress.byPriority.P1.completed}/{progress.byPriority.P1.total}
            </div>
            <span className="text-[11px] text-stone-500">
              {progress.byPriority.P1.rate}% Content Quality Met
            </span>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400">Core Brand Principles</span>
            <div className="text-sm font-semibold text-emerald-400 font-serif pt-1">
              Honest Attribution
            </div>
            <span className="text-[11px] text-stone-500">
              Zero Uncited Claims Policy
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-800 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-stone-900 border-t-2 border-amber-500 text-amber-300'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Interactive Operational Checklist
          </button>
          <button
            onClick={() => setActiveTab('divisions')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'divisions'
                ? 'bg-stone-900 border-t-2 border-amber-500 text-amber-300'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Brand Architecture (6 Divisions)
          </button>
          <button
            onClick={() => setActiveTab('constitution')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'constitution'
                ? 'bg-stone-900 border-t-2 border-amber-500 text-amber-300'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Editorial & Research Constitution
          </button>
          <button
            onClick={() => setActiveTab('operating')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'operating'
                ? 'bg-stone-900 border-t-2 border-amber-500 text-amber-300'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Solo-Founder Operating System
          </button>
        </div>

        {/* Tab 1: Interactive Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Priority Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
                {(['all', 'P0', 'P1', 'P2', 'P3'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      soundEffects.playPanelSwoosh();
                      setPriorityFilter(p);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      priorityFilter === p
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {p === 'all' ? 'All Tasks' : p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetChecklist}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to Blueprint Defaults</span>
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in-progress';

                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-colors flex items-start gap-4 cursor-pointer group"
                  >
                    <button
                      className="mt-0.5 text-stone-500 group-hover:text-amber-400 transition-colors"
                      aria-label="Toggle task status"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-600" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400">
                          {task.sectionTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            task.priority === 'P0'
                              ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                              : task.priority === 'P1'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-stone-950 text-stone-400 border border-stone-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-stone-500">
                          Status: {task.status}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-semibold transition-colors ${
                          isCompleted ? 'text-stone-300 line-through' : 'text-stone-100 group-hover:text-amber-300'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {task.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 6 Divisions */}
        {activeTab === 'divisions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                division: 'SanatanVerse Timeline',
                purpose: 'Interactive sacred, historical and scientific chronology',
                priority: 'P0 Core Project',
                status: 'Live Interactive Feature',
                accent: 'border-amber-500/50',
              },
              {
                division: 'SanatanVerse Stories',
                purpose: 'Illustrated stories, motion webtoons, graphic novels and books',
                priority: 'P1',
                status: 'Pilot Chapters Ready',
                accent: 'border-orange-500/50',
              },
              {
                division: 'SanatanVerse Learn',
                purpose: 'Educational explanations, Sanskrit hermeneutics, and source guides',
                priority: 'P1',
                status: 'In Active Production',
                accent: 'border-sky-500/50',
              },
              {
                division: 'SanatanVerse Studios',
                purpose: '4K Animation, cinematic motion comics, and streaming series',
                priority: 'P2',
                status: 'Streaming Showcase Ready',
                accent: 'border-red-500/50',
              },
              {
                division: 'SanatanVerse World',
                purpose: 'Interactive experiences, mythology atlas, community art galleries',
                priority: 'P2',
                status: 'Live Community Gallery',
                accent: 'border-emerald-500/50',
              },
              {
                division: 'SanatanVerse Collectibles',
                purpose: 'Archival art prints, character cards, and Founder Pass',
                priority: 'P3',
                status: 'Founder Pass Open',
                accent: 'border-purple-500/50',
              },
            ].map((div, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-stone-900 border ${div.accent} space-y-3`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-semibold">{div.priority}</span>
                  <span className="text-[11px] text-emerald-400 font-medium">{div.status}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{div.division}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{div.purpose}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Editorial Constitution */}
        {activeTab === 'constitution' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
              <h3 className="font-serif text-lg font-bold text-amber-400">
                Founding Principles of SanatanVerse
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>Respect Hindu traditions and their profound regional diversity without dogmatic sectarian bias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>Distinguish sacred chronology from independently established historical and scientific carbon dating.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>Clearly label creative adaptations and fictional dramatizations from primary scripture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">4.</span>
                  <span>Attribute claims strictly to verifiable primary scriptures or peer-reviewed scholarship.</span>
                </li>
              </ul>
            </div>

            {/* Evidence Taxonomy Table */}
            <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
              <div className="p-4 bg-stone-900 border-b border-stone-800 font-serif font-bold text-sm text-stone-200">
                The 6-Tier Evidence Classification Matrix
              </div>
              <div className="divide-y divide-stone-800 text-xs">
                {[
                  { label: 'Well established', def: 'Supported by strong, converging archaeological or epigraphical evidence.' },
                  { label: 'Estimated date', def: 'Evidence supports a range, but the exact date is uncertain.' },
                  { label: 'Traditional chronology', def: 'A date or sequence attributed to a specified tradition or Purana.' },
                  { label: 'Textual evidence', def: 'A source is documented; the narrated event needs separate assessment.' },
                  { label: 'Debated', def: 'Material disagreement or unresolved multi-disciplinary evidence exists.' },
                  { label: 'Unverified claim', def: 'Insufficient evidence to present as historically established.' },
                ].map((row, i) => (
                  <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-semibold text-amber-300 font-mono w-48 shrink-0">{row.label}</span>
                    <span className="text-stone-400">{row.def}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Solo-Founder Operating System */}
        {activeTab === 'operating' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { block: 'Research Block', desc: 'Select topics, locate Sanskrit source texts, verify translations, extract claims.' },
              { block: 'Writing Block', desc: 'Draft graphic novel scripts, narrative storyboards, and timeline explainers.' },
              { block: 'Production Block', desc: 'Generate character designs, 4K motion layouts, and authentic acoustic soundscapes.' },
              { block: 'Development Block', desc: 'Maintain the high-performance Next.js/React streaming engine and timeline UI.' },
              { block: 'QA & Review Block', desc: 'Validate citation fields, conduct responsive checks, and verify rights registers.' },
              { block: 'Commercial Review', desc: 'Monitor reader engagement, unit economics, and community feedback.' },
            ].map((b, i) => (
              <div key={i} className="p-5 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                <span className="text-amber-400 font-mono text-xs font-semibold">Stage 0{i + 1}</span>
                <h4 className="font-serif font-bold text-stone-100">{b.block}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
