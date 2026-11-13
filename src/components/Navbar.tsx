import React from 'react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenWaitlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenWaitlist,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090807]/90 backdrop-blur-md border-b border-stone-800/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="font-serif text-base sm:text-lg font-semibold tracking-wider text-stone-100 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          aria-label="SanatanVerse Home"
        >
          SANATANVERSE
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-stone-400">
          <button
            onClick={() => onNavigate('timelines')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${
              activeSection === 'timelines' ? 'text-amber-300' : 'text-stone-400'
            }`}
          >
            Timelines
          </button>

          <button
            onClick={() => onNavigate('comics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${
              activeSection === 'comics' ? 'text-amber-300' : 'text-stone-400'
            }`}
          >
            Comics
          </button>

          <button
            onClick={() => onNavigate('vision')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${
              activeSection === 'vision' ? 'text-amber-300' : 'text-stone-400'
            }`}
          >
            Vision
          </button>

          <button
            onClick={() => onNavigate('waitlist')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${
              activeSection === 'waitlist' ? 'text-amber-300' : 'text-stone-400'
            }`}
          >
            Early Access
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            onClick={onOpenWaitlist}
            className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </header>
  );
};
