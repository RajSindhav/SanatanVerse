import React from 'react';
import { Download } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenDownloadZip: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDownloadZip,
}) => {
  return (
    <footer className="bg-[#090807] border-t border-stone-800/70 text-stone-400 text-xs pt-12 pb-24 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <button
            onClick={() => onNavigate('hero')}
            className="font-serif text-base font-semibold tracking-wider text-stone-100 hover:text-amber-300 transition-colors"
          >
            SANATANVERSE
          </button>
          <p className="text-stone-500">
            Ancient Wisdom. Timeless Stories. · © 2026 SanatanVerse
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
          <button
            onClick={() => onNavigate('timelines')}
            className="hover:text-stone-200 transition-colors whitespace-nowrap"
          >
            Timelines
          </button>
          <button
            onClick={() => onNavigate('vision')}
            className="hover:text-stone-200 transition-colors whitespace-nowrap"
          >
            Vision
          </button>
          <a
            href="/assets/aistudio/SanatanVerse_Master_Brand_Blueprint_Editable_Checklist_b02bfafc.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-200 transition-colors whitespace-nowrap"
          >
            Brand Blueprint (PDF)
          </a>
          <button
            onClick={onOpenDownloadZip}
            className="hover:text-amber-300 text-amber-400/90 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Source (.ZIP)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
