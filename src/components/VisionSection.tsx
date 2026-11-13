import React from 'react';

export const VisionSection: React.FC = () => {
  const pillars = [
    {
      index: '01.',
      title: 'Three Parallel Lenses',
      status: 'Core Framework',
      description:
        'Every future title maps simultaneously to Sacred Lore, Scientific Cosmology, and Historical Record—keeping traditional reverence and scholarly clarity side by side.',
    },
    {
      index: '02.',
      title: 'Comics & Graphic Novels',
      status: 'In Planning',
      description:
        'We are carefully outlining original comic chapters and character arcs before release. Visuals, art direction, and community galleries will open once the slate is finalized.',
    },
    {
      index: '03.',
      title: 'Scalable Streaming Future',
      status: 'Long-Term Horizon',
      description:
        'Built from the ground up as a dark-mode digital home designed to expand naturally from illustrated comics into motion series and full-scale streaming.',
    },
  ];

  return (
    <section id="vision-section" className="scroll-mt-16 py-20 sm:py-28 border-b border-stone-800/70 bg-[#090807]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-medium tracking-wider uppercase text-amber-400/90">
            Studio Direction
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-100 tracking-tight text-balance">
            Minimal Today. Built for Scale Tomorrow.
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            Our content slate is still in planning. Here is the simple foundation guiding
            SanatanVerse as we prepare our first releases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-stone-800/80">
          {pillars.map((pillar) => (
            <div key={pillar.index} className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-mono tabular-nums text-amber-400">{pillar.index}</span>
                <span aria-hidden="true">·</span>
                <span>{pillar.status}</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-100">
                {pillar.title}
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
