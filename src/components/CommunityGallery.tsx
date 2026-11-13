import React, { useState, useEffect } from 'react';
import {
  Heart,
  Palette,
  Upload,
  Eye,
  Sparkles,
  Share2,
  Check,
  X,
  Compass,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityArtwork } from '../types/index.ts';
import { validateArtworkSubmission, ArtworkFormInput } from '../utils/sanatanLogic.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { MythicArtworkSvg } from './MythicArtworkSvg.tsx';

interface CommunityGalleryProps {
  artworks: CommunityArtwork[];
  onArtworkCountChange?: (count: number) => void;
}

export const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  artworks: initialArtworks,
}) => {
  const [artworks, setArtworks] = useState<CommunityArtwork[]>(initialArtworks);
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const [activeArtworkModal, setActiveArtworkModal] = useState<CommunityArtwork | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ArtworkFormInput>({
    title: '',
    artistName: '',
    artistHandle: '@',
    artistLocation: '',
    medium: 'Digital Painting',
    theme: 'Lord Shiva',
    description: '',
    promptOrTechnique: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Load liked artworks from localStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('sanatan_liked_artworks');
      if (savedLikes) {
        const likedIds: string[] = JSON.parse(savedLikes);
        setArtworks((prev) =>
          prev.map((art) => ({
            ...art,
            isLiked: likedIds.includes(art.id),
          }))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLikeToggle = (artId: string) => {
    soundEffects.playAstraPulse();
    setArtworks((prev) => {
      const updated = prev.map((art) => {
        if (art.id === artId) {
          const isLiked = !art.isLiked;
          const likes = isLiked ? art.likes + 1 : art.likes - 1;
          return { ...art, isLiked, likes };
        }
        return art;
      });

      // Save to localStorage
      const likedIds = updated.filter((a) => a.isLiked).map((a) => a.id);
      localStorage.setItem('sanatan_liked_artworks', JSON.stringify(likedIds));

      return updated;
    });
  };

  const filteredArtworks = selectedMedium === 'all'
    ? artworks
    : artworks.filter((a) => a.medium === selectedMedium);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateArtworkSubmission(formData);
    if (!result.isValid) {
      setFormErrors(result.errors);
      return;
    }

    setFormErrors({});
    soundEffects.playTempleBell();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#eab308', '#ffffff'],
    });

    const newArt: CommunityArtwork = {
      id: `art-${Date.now()}`,
      title: formData.title,
      artist: {
        name: formData.artistName,
        handle: formData.artistHandle,
        location: formData.artistLocation || 'Global Sanatan Creator',
      },
      medium: formData.medium as CommunityArtwork['medium'],
      theme: formData.theme,
      description: formData.description,
      promptOrTechnique: formData.promptOrTechnique || 'Digital medium and conceptual styling.',
      likes: 1,
      isLiked: true,
      views: 12,
      paletteColors: ['#d97706', '#ea580c', '#451a03', '#1c1917'],
      dateAdded: 'Just now',
      featured: true,
      artStylePreset: formData.theme.toLowerCase().includes('shiva')
        ? 'shiva'
        : formData.theme.toLowerCase().includes('durga')
        ? 'durga'
        : formData.theme.toLowerCase().includes('hanuman')
        ? 'hanuman'
        : 'krishna',
    };

    setArtworks([newArt, ...artworks]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setFormData({
        title: '',
        artistName: '',
        artistHandle: '@',
        artistLocation: '',
        medium: 'Digital Painting',
        theme: 'Lord Shiva',
        description: '',
        promptOrTechnique: '',
      });
    }, 1800);
  };

  const handleCopyShare = (art: CommunityArtwork) => {
    navigator.clipboard?.writeText(
      `Check out "${art.title}" by ${art.artist.name} on SanatanVerse: https://sanatanverse.art`
    );
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="gallery-section" className="py-16 sm:py-24 border-b border-stone-800 bg-[#0a0908]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 font-serif">
              <Palette className="w-4 h-4" />
              <span>Division P2 · SanatanVerse World</span>
              <span aria-hidden="true">·</span>
              <span>Community Art Gallery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              Mythology Through Modern Artist Visions
            </h2>
            <p className="text-sm sm:text-base text-stone-400 max-w-2xl">
              A curated space for global concept artists, digital painters, and traditional illustrators
              interpreting the vast pantheon of Sanatan Dharma with honor and modern grandeur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEffects.playPanelSwoosh();
                setIsSubmitModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 hover:brightness-110 flex items-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit Your Artwork</span>
            </button>
          </div>
        </div>

        {/* Medium Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto w-fit">
          {['all', 'Digital Painting', 'Motion Concept', 'Ink & Traditional', '3D Sculpture'].map((med) => (
            <button
              key={med}
              onClick={() => {
                soundEffects.playPanelSwoosh();
                setSelectedMedium(med);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedMedium === med
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {med === 'all' ? 'All Mediums' : med}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              className="rounded-2xl overflow-hidden bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/50 transition-all hover:-translate-y-1 flex flex-col justify-between group shadow-lg"
            >
              {/* Artwork Box */}
              <div
                onClick={() => {
                  soundEffects.playPanelSwoosh();
                  setActiveArtworkModal(art);
                }}
                className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer"
              >
                <MythicArtworkSvg
                  preset={art.artStylePreset}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                {/* Medium Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                    {art.medium}
                  </span>
                </div>

                {/* Quick Info Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
                  <span className="font-serif text-amber-300 font-medium">{art.theme}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Eye className="w-3 h-3" />
                      {art.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 space-y-3">
                <div>
                  <h3
                    onClick={() => setActiveArtworkModal(art)}
                    className="font-serif text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {art.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                    <span className="text-stone-300 font-medium">{art.artist.name}</span>
                    <span className="text-amber-400 font-mono text-[11px]">{art.artist.handle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[11px] text-stone-500">{art.artist.location}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  {/* Upvote / Like Button */}
                  <button
                    onClick={() => handleLikeToggle(art.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                      art.isLiked
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                    }`}
                    aria-label={`Like artwork ${art.title}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${art.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span>{art.likes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyShare(art)}
                      className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 hover:text-white transition-colors"
                      title="Share Artwork"
                      aria-label="Share artwork link"
                    >
                      {copiedId === art.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playPanelSwoosh();
                        setActiveArtworkModal(art);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Lightbox Modal */}
        {activeArtworkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col md:flex-row">
              {/* Artwork side (Left) */}
              <div className="md:w-3/5 bg-black relative flex items-center justify-center p-4 sm:p-6 min-h-[300px]">
                <MythicArtworkSvg
                  preset={activeArtworkModal.artStylePreset}
                  className="w-full h-full max-h-[500px] object-contain rounded-lg"
                />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded bg-black/70 text-xs font-semibold text-amber-400 border border-amber-500/30">
                    {activeArtworkModal.medium}
                  </span>
                </div>
              </div>

              {/* Information side (Right) */}
              <div className="md:w-2/5 p-6 overflow-y-auto space-y-6 flex flex-col justify-between bg-stone-950 border-t md:border-t-0 md:border-l border-stone-800">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-serif text-amber-400 uppercase tracking-wider">
                        {activeArtworkModal.theme}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                        {activeArtworkModal.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveArtworkModal(null)}
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-white"
                      aria-label="Close Artwork Details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Artist Card */}
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-stone-200">
                        {activeArtworkModal.artist.name}
                      </div>
                      <div className="text-xs text-amber-400 font-mono">
                        {activeArtworkModal.artist.handle}
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {activeArtworkModal.artist.location}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Curatorial Notes</span>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {activeArtworkModal.description}
                    </p>
                  </div>

                  {/* Prompt & Technique Breakdown */}
                  <div className="space-y-1 p-3 rounded-lg bg-stone-900/60 border border-stone-800">
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Technique & Creation Specs
                    </span>
                    <p className="text-xs text-stone-400 leading-relaxed mt-1">
                      {activeArtworkModal.promptOrTechnique}
                    </p>
                  </div>

                  {/* Color Palette Swatch */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Extracted Palette</span>
                    <div className="flex gap-2">
                      {activeArtworkModal.paletteColors.map((col, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-md border border-stone-700 shadow"
                          style={{ backgroundColor: col }}
                          title={col}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => handleLikeToggle(activeArtworkModal.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      activeArtworkModal.isLiked
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeArtworkModal.isLiked ? 'fill-rose-400' : ''}`} />
                    <span>{activeArtworkModal.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => handleCopyShare(activeArtworkModal)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
                  >
                    Share Masterpiece
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Artwork Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Submit Artwork to SanatanVerse
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Showcase your creative devotion and visionary interpretation to thousands of mythology enthusiasts.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                  aria-label="Close Submit Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                  <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-emerald-200">
                    Artwork Successfully Published!
                  </h4>
                  <p className="text-xs text-stone-300">
                    Your piece is now live in the SanatanVerse World gallery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Artwork Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Rudra Tandava at the Edge of Time"
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.title && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Creator Info (2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Creator Name *
                      </label>
                      <input
                        type="text"
                        value={formData.artistName}
                        onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                        placeholder="e.g. Vikramaditya Sen"
                        className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                      {formErrors.artistName && (
                        <p className="text-[11px] text-rose-400 mt-1">{formErrors.artistName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Social Handle (@) *
                      </label>
                      <input
                        type="text"
                        value={formData.artistHandle}
                        onChange={(e) => setFormData({ ...formData, artistHandle: e.target.value })}
                        placeholder="@artist_profile"
                        className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                      {formErrors.artistHandle && (
                        <p className="text-[11px] text-rose-400 mt-1">{formErrors.artistHandle}</p>
                      )}
                    </div>
                  </div>

                  {/* Medium & Theme */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Creative Medium *
                      </label>
                      <select
                        value={formData.medium}
                        onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Digital Painting">Digital Painting</option>
                        <option value="Motion Concept">Motion Concept</option>
                        <option value="Ink & Traditional">Ink & Traditional</option>
                        <option value="3D Sculpture">3D Sculpture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Sacred Deity / Theme *
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Lord Shiva">Lord Shiva (Rudra / Nataraja)</option>
                        <option value="Maa Durga">Maa Durga (Mahishasuramardini)</option>
                        <option value="Shri Krishna">Shri Krishna (Charioteer / Vishwaroopam)</option>
                        <option value="Lord Hanuman">Lord Hanuman (Vayuputra)</option>
                        <option value="Shri Rama">Shri Rama (Maryada Purushottam)</option>
                        <option value="Vedic Cosmology">Vedic Cosmology (Nasadiya)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Artwork Description & Concept *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the philosophical symbolism, scene composition, and traditional elements..."
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.description && (
                      <p className="text-[11px] text-rose-400 mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Technique */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Software / Brushes / Technique (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.promptOrTechnique}
                      onChange={(e) => setFormData({ ...formData, promptOrTechnique: e.target.value })}
                      placeholder="e.g. Procreate with oil glaze brush, Blender 3D volumetric light"
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
                    >
                      Publish to Community Gallery
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
