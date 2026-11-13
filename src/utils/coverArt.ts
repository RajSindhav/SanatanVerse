import sacredCosmosImg from '../assets/images/comic_sacred_cosmos_1794561399187.jpg';
import scientificNebulaImg from '../assets/images/comic_scientific_nebula_1794561400007.jpg';
import historicalTempleImg from '../assets/images/comic_historical_temple_1794561401423.jpg';
import { CoverPreset } from '../types/index.ts';

export const COVER_PRESET_IMAGES: Record<CoverPreset, { src: string; label: string; alt: string }> = {
  'sacred-cosmos': {
    src: sacredCosmosImg,
    label: 'Sacred Cosmology Ink',
    alt: 'Luminous golden cosmic Hiranyagarbha orb and Vedic mandala artwork',
  },
  'scientific-nebula': {
    src: scientificNebulaImg,
    label: 'Astronomical Astrolabe',
    alt: 'Gold ink astronomical astrolabe and spiral galaxy scientific illustration',
  },
  'historical-temple': {
    src: historicalTempleImg,
    label: 'Epigraphic Sandstone',
    alt: 'Monolithic carved stone temple and Brahmi inscription stele illuminated by torchlight',
  },
};

export function getDefaultCoverPresetForTrack(
  track: 'sacred' | 'scientific' | 'historical'
): CoverPreset {
  if (track === 'sacred') return 'sacred-cosmos';
  if (track === 'scientific') return 'scientific-nebula';
  return 'historical-temple';
}
