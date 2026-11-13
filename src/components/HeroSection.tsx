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

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.14,
      speedY: (Math.random() - 0.5) * 0.14,
      color: Math.random() > 0.35 ? '#f59e0b' : '#a8a29e',
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

  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32 border-b border-stone-800/70 bg-[#090807]"
    >
      {/* Subtle drifting starfield */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-45"
        aria-hidden="true"
      />

      {/* Restrained radial warm glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[380px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
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
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="text-amber-400 font-medium">SanatanVerse</span>
              <span aria-hidden="true">·</span>
              <span>Ancient Wisdom. Timeless Stories.</span>
              <span aria-hidden="true">·</span>
              <span>In Planning</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-stone-100 leading-[1.12] text-balance">
              Three Parallel Timelines. One Eternal Story.
            </h1>

            <p className="text-base sm:text-lg text-stone-400 leading-relaxed max-w-xl">
              From the birth of the cosmos to the modern era, we are mapping Sanatan Dharma
              simultaneously through Sacred Lore, Science, and History. Stories and visual
              comics are currently being planned.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreTimeline}
                className="px-6 py-3 rounded-lg font-semibold text-sm bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <span>Explore the 3 Timelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWaitlist}
                className="px-5 py-3 rounded-lg font-medium text-sm text-stone-300 border border-stone-800 hover:border-stone-600 hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                Follow Launch Updates
              </button>
            </div>
          </motion.div>

          {/* Right Column: Minimal Tri-Track Cosmic Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Concentric rotating orbital rings for the 3 parallel perspectives */}
              <svg
                viewBox="0 0 360 360"
                className="w-full h-full"
                aria-label="Three concentric orbital tracks representing Sacred, Scientific, and Historical timelines"
              >
                <defs>
                  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                    <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#090807" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="180" cy="180" r="145" fill="url(#coreGlow)" />

                {/* Outer Track: Historical Record */}
                <g className="origin-center animate-[spin_75s_linear_infinite]">
                  <circle
                    cx="180"
                    cy="180"
                    r="160"
                    fill="none"
                    stroke="#292524"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="160"
                    fill="none"
                    stroke="#34d399"
                    strokeOpacity="0.45"
                    strokeWidth="1.25"
                    strokeDasharray="60 320"
                    strokeLinecap="round"
                  />
                  <circle cx="180" cy="20" r="3" fill="#34d399" fillOpacity="0.8" />
                </g>

                {/* Middle Track: Scientific Cosmology */}
                <g className="origin-center animate-[spin_52s_linear_infinite_reverse]">
                  <circle
                    cx="180"
                    cy="180"
                    r="122"
                    fill="none"
                    stroke="#292524"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="122"
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.45"
                    strokeWidth="1.25"
                    strokeDasharray="48 260"
                    strokeLinecap="round"
                  />
                  <circle cx="302" cy="180" r="3" fill="#38bdf8" fillOpacity="0.8" />
                </g>

                {/* Inner Track: Sacred Lore */}
                <g className="origin-center animate-[spin_36s_linear_infinite]">
                  <circle
                    cx="180"
                    cy="180"
                    r="84"
                    fill="none"
                    stroke="#44403c"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="84"
                    fill="none"
                    stroke="#f59e0b"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                    strokeDasharray="42 200"
                    strokeLinecap="round"
                  />
                  <circle cx="180" cy="96" r="3.5" fill="#fbbf24" />
                </g>

                {/* Center Sanctuary */}
                <circle
                  cx="180"
                  cy="180"
                  r="40"
                  fill="#11100e"
                  stroke="#f59e0b"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              </svg>

              {/* Center Om glyph */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="font-serif text-3xl sm:text-4xl text-amber-400/95 leading-none">
                  ॐ
                </span>
              </div>

              {/* Quiet orbital legend below emblem */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] text-stone-500 whitespace-nowrap">
                <span className="text-amber-400/90">Sacred</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-400/90">Science</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400/90">History</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
