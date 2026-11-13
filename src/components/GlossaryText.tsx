import React, { useMemo, useState, useRef } from 'react';
import { SANATAN_GLOSSARY, GlossaryTerm } from '../data/glossaryData.ts';
import { tokenizeGlossaryText } from '../utils/glossaryParser.ts';
import { useGlossary } from '../context/GlossaryContext.tsx';

interface GlossaryTermTokenProps {
  text: string;
  entry: GlossaryTerm;
}

const TOOLTIP_WIDTH = 288;

const GlossaryTermToken: React.FC<GlossaryTermTokenProps> = ({ text, entry }) => {
  const { setHoveredTerm, setPinnedTerm, pinnedTerm } = useGlossary();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeBelow: boolean }>({
    top: 0,
    left: 16,
    placeBelow: false,
  });
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isPinned = pinnedTerm?.id === entry.id;

  const updateTooltipPosition = () => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const placeBelow = rect.top < 210;
    const centeredLeft = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    const clampedLeft = Math.max(
      12,
      Math.min(centeredLeft, window.innerWidth - TOOLTIP_WIDTH - 12)
    );
    setCoords({
      top: placeBelow ? rect.bottom + 8 : rect.top - 8,
      left: clampedLeft,
      placeBelow,
    });
  };

  const handleOpen = () => {
    updateTooltipPosition();
    setIsOpen(true);
    setHoveredTerm(entry);
  };

  const handleClose = () => {
    setIsOpen(false);
    setHoveredTerm(null);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (isPinned) {
      setPinnedTerm(null);
    } else {
      setPinnedTerm(entry);
      setHoveredTerm(entry);
    }
  };

  return (
    <span className="relative inline">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        onClick={handleTogglePin}
        aria-describedby={isOpen ? `glossary-tip-${entry.id}` : undefined}
        className={`inline p-0 bg-transparent text-left [font:inherit] leading-[inherit] border-b border-dotted transition-colors cursor-help focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b45309] rounded-xs ${
          isPinned
            ? 'border-[#b45309] text-[#92400e] bg-[#f4e4c5]'
            : 'border-[#b45309]/60 text-[#342516] hover:border-[#b45309] hover:text-[#92400e]'
        }`}
      >
        {text}
      </button>

      {isOpen && (
        <span
          id={`glossary-tip-${entry.id}`}
          role="tooltip"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${TOOLTIP_WIDTH}px`,
          }}
          className={`pointer-events-none fixed z-50 max-w-[calc(100vw-24px)] p-3.5 rounded-xl bg-[#fbf7ee] border border-[#d6bd93] shadow-[0_14px_34px_rgba(24,18,8,0.22)] text-left block ${
            coords.placeBelow ? '' : '-translate-y-full'
          }`}
        >
          <span className="flex items-baseline justify-between gap-2 mb-1">
            <span className="font-serif text-sm font-semibold text-[#92400e]">
              {entry.term}
            </span>
            <span className="text-[11px] font-serif text-[#6f5d47] shrink-0">
              {entry.sanskrit}
            </span>
          </span>
          <span className="block text-[11px] uppercase tracking-wider text-[#8a7558] mb-1.5">
            {entry.category}
          </span>
          <span className="block text-xs text-[#4e4030] leading-relaxed font-sans font-normal">
            {entry.definition}
          </span>
          <span className="block text-[10px] text-[#7a6449] mt-2 pt-1.5 border-t border-[#ebdcb9]">
            {isPinned ? 'Pinned in glossary bar · Click to unpin' : 'Click term to pin in glossary bar'}
          </span>
        </span>
      )}
    </span>
  );
};

interface GlossaryTextProps {
  text: string;
}

export const GlossaryText: React.FC<GlossaryTextProps> = ({ text }) => {
  const { isGlossaryEnabled } = useGlossary();

  const segments = useMemo(() => {
    if (!isGlossaryEnabled) return null;
    return tokenizeGlossaryText(text, SANATAN_GLOSSARY);
  }, [text, isGlossaryEnabled]);

  if (!isGlossaryEnabled || !segments) {
    return <>{text}</>;
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'term' ? (
          <GlossaryTermToken
            key={`${segment.entry.id}-${index}`}
            text={segment.value}
            entry={segment.entry}
          />
        ) : (
          <React.Fragment key={index}>{segment.value}</React.Fragment>
        )
      )}
    </>
  );
};
