import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreTimeline: () => void;
  onOpenWaitlist: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreTimeline,
  onOpenWaitlist,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 620);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.7 + 0.5,
      alpha: Math.random() * 0.45 + 0.16,
      speedX: (Math.random() - 0.5) * 0.14,
      speedY: (Math.random() - 0.5) * 0.14,
      color: Math.random() > 0.4 ? '#f3c668' : Math.random() > 0.5 ? '#ea8b38' : '#7cc4d9',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Precompute 12 lotus petals around (180, 180)
  const lotusPetals = Array.from({ length: 12 }, (_, idx) => idx * 30);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-16 pb-28 sm:py-28 lg:py-32 border-b-2 border-[#d4a84f]/35 bg-gradient-to-br from-[#141d34] via-[#1b2744] to-[#233154]"
    >
      {/* Subtle golden & sacred ember cosmic dust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-75"
        aria-hidden="true"
      />

      {/* Soft atmospheric Neelam twilight & warm Kesari temple glow */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-[#d9842b]/18 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 translate-x-1/4 w-[520px] h-[360px] bg-[#2f6f8e]/22 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Clean Typographic Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#cbbd9f]">
              <span className="text-[#f4c86a] font-semibold tracking-wider uppercase">
                SanatanVerse
              </span>
              <span aria-hidden="true" className="text-[#d4a84f]/60">·</span>
              <span>Ancient Wisdom. Timeless Stories.</span>
              <span aria-hidden="true" className="text-[#d4a84f]/60">·</span>
              <span>Interactive Chronology &amp; Comics</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-[#fcf7ec] leading-[1.12] text-balance">
              Three Parallel Timelines. One Eternal Story.
            </h1>

            <p className="text-base sm:text-lg text-[#dfd4bd] leading-relaxed max-w-xl">
              From the birth of the cosmos to the modern era, we are mapping Sanatan Dharma
              simultaneously through Sacred Lore, Science, and History—with original storyboards
              and visual comics anchored to every epoch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreTimeline}
                className="px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#f1c463] to-[#e09d34] text-[#181208] hover:from-[#f7d27d] hover:to-[#ebaa42] shadow-[0_6px_22px_rgba(229,169,60,0.28)] transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5cf76]"
              >
                <span>Explore the 3 Timelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWaitlist}
                className="px-5 py-3 rounded-lg font-medium text-sm text-[#f7ecd6] bg-[#223052]/80 border border-[#d4a84f]/40 hover:border-[#f4c86a] hover:bg-[#2a3b63] hover:text-white shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b34b]"
              >
                Follow Launch Updates
              </button>
            </div>
          </motion.div>

          {/* Right Column: Sacred Swarna Mandala & Tri-Track Cosmic Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              <svg
                viewBox="0 0 360 360"
                className="w-full h-full drop-shadow-[0_14px_38px_rgba(212,168,79,0.18)]"
                aria-label="Three concentric orbital tracks representing Sacred, Scientific, and Historical timelines around a golden mandala"
              >
                <defs>
                  <radialGradient id="sanatanCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f5c96b" stopOpacity="0.34" />
                    <stop offset="55%" stopColor="#d97706" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#1b2744" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="180" cy="180" r="152" fill="url(#sanatanCoreGlow)" />

                {/* Subtle Static 12-Petal Lotus & Octagram Yantra Frame */}
                <g opacity="0.28" stroke="#f3c668" fill="none">
                  {lotusPetals.map((deg) => (
                    <ellipse
                      key={deg}
                      cx="180"
                      cy="126"
                      rx="10"
                      ry="28"
                      strokeWidth="0.9"
                      transform={`rotate(${deg} 180 180)`}
                    />
                  ))}
                  <rect x="128" y="128" width="104" height="104" strokeWidth="0.8" />
                  <rect
                    x="128"
                    y="128"
                    width="104"
                    height="104"
                    strokeWidth="0.8"
                    transform="rotate(45 180 180)"
                  />
                </g>

                {/* Outer Track: Historical Record (Tulsi Jade) */}
                <g className="origin-center animate-[spin_75s_linear_infinite]">
                  <circle
                    cx="180"
                    cy="180"
                    r="160"
                    fill="none"
                    stroke="#d4a84f"
                    strokeOpacity="0.22"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="160"
                    fill="none"
                    stroke="#34d399"
                    strokeOpacity="0.78"
                    strokeWidth="2"
                    strokeDasharray="64 320"
                    strokeLinecap="round"
                  />
                  <circle cx="180" cy="20" r="4" fill="#34d399" />
                </g>

                {/* Middle Track: Scientific Cosmology (Ganga Sapphire) */}
                <g className="origin-center animate-[spin_52s_linear_infinite_reverse]">
                  <circle
                    cx="180"
                    cy="180"
                    r="122"
                    fill="none"
                    stroke="#d4a84f"
                    strokeOpacity="0.28"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="122"
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.82"
                    strokeWidth="2"
                    strokeDasharray="52 260"
                    strokeLinecap="round"
                  />
                  <circle cx="302" cy="180" r="4" fill="#38bdf8" />
                </g>

                {/* Inner Track: Sacred Lore (Kesari Gold) */}
                <g className="origin-center animate-[spin_36s_linear_infinite]">
                  <circle
                    cx="180"
                    cy="180"
                    r="84"
                    fill="none"
                    stroke="#d4a84f"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="84"
                    fill="none"
                    stroke="#fbbf24"
                    strokeOpacity="0.92"
                    strokeWidth="2.2"
                    strokeDasharray="44 200"
                    strokeLinecap="round"
                  />
                  <circle cx="180" cy="96" r="4.5" fill="#fbbf24" />
                </g>

                {/* Center Sanctum */}
                <circle
                  cx="180"
                  cy="180"
                  r="44"
                  fill="#18223b"
                  stroke="#f3c668"
                  strokeOpacity="0.75"
                  strokeWidth="1.5"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="38"
                  fill="none"
                  stroke="#f3c668"
                  strokeOpacity="0.3"
                  strokeWidth="0.75"
                />
              </svg>

              {/* Center Om glyph */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="font-serif text-3xl sm:text-4xl text-[#f7cf73] leading-none drop-shadow-[0_2px_10px_rgba(245,193,86,0.45)]">
                  ॐ
                </span>
              </div>

              {/* Quiet orbital legend below emblem */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] font-medium whitespace-nowrap">
                <span className="text-[#fbbf24]">Sacred</span>
                <span aria-hidden="true" className="text-[#d4a84f]/50">·</span>
                <span className="text-[#7dd3fc]">Science</span>
                <span aria-hidden="true" className="text-[#d4a84f]/50">·</span>
                <span className="text-[#6ee7b7]">History</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
