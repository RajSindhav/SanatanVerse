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
        'Built from the ground up as a serene, modern digital home designed to expand naturally from illustrated comics into motion series and full-scale streaming.',
    },
  ];

  return (
    <section
      id="vision-section"
      className="scroll-mt-16 py-20 sm:py-28 border-b border-[#dcc8a4] bg-[#faf4e8]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#b45309]">
            Studio Direction
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#231b12] tracking-tight text-balance">
            Rooted in Heritage. Built for Generations.
          </h2>
          <p className="text-sm sm:text-base text-[#5a4b38] leading-relaxed">
            Our content slate is expanding with care. Here is the curatorial foundation guiding
            SanatanVerse as we prepare our upcoming comic volumes and series.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#dfd0b4]">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="p-6 rounded-xl bg-[#fbf7ee] border border-[#dfd0b4] shadow-[0_6px_22px_-8px_rgba(74,47,16,0.08)] space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-[#6f5d47]">
                <span className="font-mono tabular-nums font-semibold text-[#b45309]">
                  {pillar.index}
                </span>
                <span aria-hidden="true" className="text-[#c5af88]">·</span>
                <span className="uppercase tracking-wider text-[11px] font-medium">
                  {pillar.status}
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#231b12]">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#554736] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
