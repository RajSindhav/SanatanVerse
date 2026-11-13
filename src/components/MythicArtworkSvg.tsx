import React from 'react';

interface MythicArtworkSvgProps {
  preset: 'rudra' | 'rama' | 'arjuna' | 'hanuman' | 'ganga' | 'om' | 'chariot' | 'durga' | 'shiva' | 'krishna' | 'vishnu' | 'surya' | 'ganesha';
  className?: string;
  glow?: boolean;
}

export const MythicArtworkSvg: React.FC<MythicArtworkSvgProps> = ({
  preset,
  className = 'w-full h-full object-cover',
}) => {
  switch (preset) {
    case 'rudra':
    case 'shiva':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Lord Shiva Rudra Cosmic Art">
            <defs>
              <radialGradient id="rudra-glow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#c2410c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="trishul-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Cosmic background stars */}
            <circle cx="120" cy="80" r="1.5" fill="#fef08a" opacity="0.6" />
            <circle cx="280" cy="140" r="2" fill="#fff" opacity="0.8" />
            <circle cx="650" cy="90" r="1.5" fill="#fef08a" opacity="0.7" />
            <circle cx="710" cy="220" r="2.5" fill="#fff" opacity="0.9" />
            <circle cx="200" cy="450" r="1.5" fill="#fef08a" opacity="0.5" />
            <circle cx="400" cy="260" r="220" fill="url(#rudra-glow)" />

            {/* Crescent Moon */}
            <path d="M 330 180 A 45 45 0 1 0 380 230 A 35 35 0 1 1 330 180" fill="#fef08a" opacity="0.9" />

            {/* Glowing Third Eye */}
            <ellipse cx="400" cy="270" rx="9" ry="22" fill="#ef4444" opacity="0.9" />
            <ellipse cx="400" cy="270" rx="4" ry="12" fill="#fef08a" />

            {/* Sacred Tripundra (Three horizontal ash lines) */}
            <path d="M 320 250 Q 400 245 480 250" stroke="#f5f5f4" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <path d="M 315 262 Q 400 257 485 262" stroke="#f5f5f4" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
            <path d="M 320 274 Q 400 269 480 274" stroke="#f5f5f4" strokeWidth="6" strokeLinecap="round" opacity="0.85" />

            {/* Matted locks (Jata) abstract flow */}
            <path d="M 280 280 C 200 220 180 340 100 360 C 220 400 260 360 300 320" fill="#1c1917" stroke="#d97706" strokeWidth="1.5" opacity="0.8" />
            <path d="M 520 280 C 600 220 620 340 700 360 C 580 400 540 360 500 320" fill="#1c1917" stroke="#d97706" strokeWidth="1.5" opacity="0.8" />

            {/* Divine Trishul (Trident) */}
            <g transform="translate(400, 320)">
              <line x1="0" y1="40" x2="0" y2="280" stroke="url(#trishul-gold)" strokeWidth="10" strokeLinecap="round" />
              {/* Central Prong */}
              <path d="M 0 -70 L 16 0 L 0 40 L -16 0 Z" fill="url(#trishul-gold)" />
              {/* Left Prong */}
              <path d="M 0 35 C -60 20 -80 -40 -65 -65 C -45 -10 -20 10 0 35" fill="url(#trishul-gold)" />
              {/* Right Prong */}
              <path d="M 0 35 C 60 20 80 -40 65 -65 C 45 -10 20 10 0 35" fill="url(#trishul-gold)" />
              {/* Damaru */}
              <polygon points="-30,100 30,100 0,125 -30,150 30,150 0,125" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
            </g>
          </svg>
        </div>
      );

    case 'rama':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Shri Rama Kodanda Bow Art">
            <defs>
              <radialGradient id="rama-aura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#78350f" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bow-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
            </defs>
            <circle cx="400" cy="300" r="260" fill="url(#rama-aura)" />
            {/* The Great Kodanda Bow Arc */}
            <path d="M 280 80 Q 560 300 280 520" fill="none" stroke="url(#bow-gold)" strokeWidth="16" strokeLinecap="round" />
            {/* Bowstring drawn tight */}
            <line x1="280" y1="80" x2="480" y2="300" stroke="#fef08a" strokeWidth="3" opacity="0.85" />
            <line x1="280" y1="520" x2="480" y2="300" stroke="#fef08a" strokeWidth="3" opacity="0.85" />
            {/* Celestial Arrow of Light */}
            <line x1="160" y1="300" x2="520" y2="300" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <polygon points="140,300 180,290 170,300 180,310" fill="#fef08a" />
            {/* Arrow feathering */}
            <path d="M 470 290 L 510 280 L 490 300 L 510 320 L 470 310 Z" fill="#eab308" />
            {/* Solar Ray Radiance */}
            <circle cx="400" cy="300" r="160" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12,12" opacity="0.5" />
            <circle cx="400" cy="300" r="90" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="6,6" opacity="0.4" />
          </svg>
        </div>
      );

    case 'arjuna':
    case 'chariot':
    case 'krishna':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Kurukshetra Chariot and Krishna Art">
            <defs>
              <radialGradient id="kurukshetra-sky" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#7f1d1d" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="chariot-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <circle cx="400" cy="200" r="300" fill="url(#kurukshetra-sky)" />
            {/* Sudarshana Chakra in sky */}
            <g transform="translate(400, 160)">
              <circle cx="0" cy="0" r="50" fill="none" stroke="#fef08a" strokeWidth="3" />
              <circle cx="0" cy="0" r="30" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6,6" />
              <path d="M -50 0 L 50 0 M 0 -50 L 0 50 M -35 -35 L 35 35 M -35 35 L 35 -35" stroke="#fef08a" strokeWidth="2" opacity="0.8" />
            </g>
            {/* The Great Chariot Wheel (Rath Chakra) */}
            <g transform="translate(400, 420)">
              <circle cx="0" cy="0" r="130" fill="none" stroke="url(#chariot-gold)" strokeWidth="18" />
              <circle cx="0" cy="0" r="35" fill="#f59e0b" stroke="#78350f" strokeWidth="6" />
              {/* 16 Spokes representing cosmic time and virtues */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                return (
                  <line
                    key={i}
                    x1="0"
                    y1="0"
                    x2={120 * Math.cos((angle * Math.PI) / 180)}
                    y2={120 * Math.sin((angle * Math.PI) / 180)}
                    stroke="url(#chariot-gold)"
                    strokeWidth="6"
                  />
                );
              })}
            </g>
            {/* Flag of Hanuman (Kapi Dhwaja) silhouette */}
            <path d="M 280 200 L 280 400" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <polygon points="280,200 180,240 280,280" fill="#ea580c" opacity="0.9" />
          </svg>
        </div>
      );

    case 'hanuman':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Lord Hanuman Art">
            <defs>
              <radialGradient id="hanuman-aura" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#9a3412" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gada-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <circle cx="400" cy="240" r="260" fill="url(#hanuman-aura)" />
            {/* Golden Gada (Mace) of Hanuman */}
            <g transform="translate(400, 300) rotate(-25)">
              <line x1="0" y1="-180" x2="0" y2="180" stroke="url(#gada-gold)" strokeWidth="14" strokeLinecap="round" />
              {/* Mace head */}
              <circle cx="0" cy="-140" r="55" fill="url(#gada-gold)" stroke="#fef08a" strokeWidth="4" />
              <path d="M -50 -140 Q 0 -210 50 -140" fill="none" stroke="#fef08a" strokeWidth="6" />
              <circle cx="0" cy="-140" r="25" fill="#78350f" />
            </g>
            {/* Mountain of Sanjeevani Silhouette held in left hand */}
            <polygon points="200,450 320,240 440,450" fill="#15803d" opacity="0.85" stroke="#4ade80" strokeWidth="3" />
            {/* Glowing Herb Specks on Mountain */}
            <circle cx="300" cy="320" r="5" fill="#fef08a" />
            <circle cx="340" cy="350" r="6" fill="#86efac" />
            <circle cx="280" cy="380" r="4" fill="#67e8f9" />
            <circle cx="360" cy="400" r="5" fill="#fef08a" />
          </svg>
        </div>
      );

    case 'ganga':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-cyan-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Ganga Descent Art">
            <defs>
              <linearGradient id="water-stream" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#0891b2" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Mountain Crags */}
            <polygon points="0,600 240,280 400,600" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
            <polygon points="360,600 560,220 800,600" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
            {/* Cascading Sacred River Torrents */}
            <path d="M 400 0 C 350 150 480 260 380 420 C 320 520 420 580 400 600" fill="none" stroke="url(#water-stream)" strokeWidth="34" strokeLinecap="round" />
            <path d="M 430 0 C 490 140 370 280 440 430 C 470 500 410 560 420 600" fill="none" stroke="#ecfeff" strokeWidth="12" strokeLinecap="round" opacity="0.85" />
            <path d="M 370 40 C 330 180 450 310 360 460" fill="none" stroke="#a5f3fc" strokeWidth="8" opacity="0.7" />
            {/* Spray droplets */}
            <circle cx="360" cy="430" r="6" fill="#ecfeff" />
            <circle cx="450" cy="440" r="5" fill="#a5f3fc" />
            <circle cx="390" cy="480" r="8" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'durga':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Maa Durga Art">
            <defs>
              <radialGradient id="durga-radiance" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#b91c1c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="260" r="260" fill="url(#durga-radiance)" />
            {/* Radiant Lotus Halo */}
            <circle cx="400" cy="260" r="160" fill="none" stroke="#f59e0b" strokeWidth="4" />
            {/* Ten radiating weapons representation */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i * 360) / 10 - 90;
              return (
                <line
                  key={i}
                  x1={400 + 70 * Math.cos((angle * Math.PI) / 180)}
                  y1={260 + 70 * Math.sin((angle * Math.PI) / 180)}
                  x2={400 + 190 * Math.cos((angle * Math.PI) / 180)}
                  y2={260 + 190 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              );
            })}
            {/* The Great Trident of Durga plunging downwards */}
            <line x1="400" y1="120" x2="400" y2="480" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" />
            <polygon points="400,80 418,130 400,150 382,130" fill="#fef08a" />
            <path d="M 400 140 C 360 120 340 70 350 50 C 370 90 385 110 400 140" fill="#fef08a" />
            <path d="M 400 140 C 440 120 460 70 450 50 C 430 90 415 110 400 140" fill="#fef08a" />
          </svg>
        </div>
      );

    case 'om':
    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-black ${className}`}>
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-label="Sacred Om Pranava Art">
            <defs>
              <radialGradient id="om-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="300" r="240" fill="url(#om-glow)" />
            {/* Cosmic Mandala rings */}
            <circle cx="400" cy="300" r="180" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="8,8" opacity="0.6" />
            <circle cx="400" cy="300" r="120" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.8" />
            {/* Stylized Om Symbol (ॐ) */}
            <text
              x="400"
              y="370"
              fontSize="210"
              fontWeight="bold"
              fill="#fef08a"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              style={{ filter: 'drop-shadow(0px 0px 18px rgba(245, 158, 11, 0.8))' }}
            >
              ॐ
            </text>
          </svg>
        </div>
      );
  }
};
