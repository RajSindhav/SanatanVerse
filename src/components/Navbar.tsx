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
    <header className="sticky top-0 z-40 w-full bg-[#162038]/95 backdrop-blur-md border-b border-[#d4a84f]/25 shadow-[0_6px_24px_-8px_rgba(14,20,38,0.45)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Sacred Wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="font-serif text-base sm:text-lg font-semibold tracking-wider text-[#f5cf76] hover:text-[#ffe19c] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b] rounded inline-flex items-center gap-2"
          aria-label="SanatanVerse Home"
        >
          <span className="text-[#e59838] text-lg leading-none" aria-hidden="true">ॐ</span>
          <span>SANATANVERSE</span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#e4d7be]">
          <button
            onClick={() => onNavigate('timelines')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#fff7e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b] rounded ${
              activeSection === 'timelines' ? 'text-[#f5cf76] font-semibold' : 'text-[#ddd0b8]'
            }`}
          >
            Timelines
          </button>

          <button
            onClick={() => onNavigate('comics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#fff7e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b] rounded ${
              activeSection === 'comics' ? 'text-[#f5cf76] font-semibold' : 'text-[#ddd0b8]'
            }`}
          >
            Comics
          </button>

          <button
            onClick={() => onNavigate('vision')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#fff7e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b] rounded ${
              activeSection === 'vision' ? 'text-[#f5cf76] font-semibold' : 'text-[#ddd0b8]'
            }`}
          >
            Vision
          </button>

          <button
            onClick={() => onNavigate('waitlist')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#fff7e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b] rounded ${
              activeSection === 'waitlist' ? 'text-[#f5cf76] font-semibold' : 'text-[#ddd0b8]'
            }`}
          >
            Early Access
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            onClick={onOpenWaitlist}
            className="px-4 py-2 text-xs font-semibold text-[#181208] bg-gradient-to-r from-[#f1c463] to-[#e09d34] hover:from-[#f7d27d] hover:to-[#ebaa42] rounded-lg shadow-[0_2px_12px_rgba(229,169,60,0.28)] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5cf76]"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </header>
  );
};
