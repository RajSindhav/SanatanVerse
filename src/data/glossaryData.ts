export interface GlossaryTerm {
  id: string;
  term: string;
  aliases?: string[];
  sanskrit: string;
  transliteration?: string;
  category: 'Cosmology' | 'Philosophy' | 'Scripture' | 'Practice' | 'Lineage';
  definition: string;
}

export const SANATAN_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'nishkama-karma',
    term: 'Nishkama Karma',
    sanskrit: 'निष्काम कर्म',
    category: 'Philosophy',
    definition:
      'Selfless, dedicated action performed as duty without attachment to personal reward or outcome, taught in the Bhagavad Gita.',
  },
  {
    id: 'mahapralaya',
    term: 'Mahapralaya',
    sanskrit: 'महाप्रलय',
    category: 'Cosmology',
    definition:
      'The great cosmic dissolution at the end of a Brahma lifespan when the manifested universe returns to unmanifest potential.',
  },
  {
    id: 'prana-pratishtha',
    term: 'Prana Pratishtha',
    sanskrit: 'प्राण प्रतिष्ठा',
    category: 'Practice',
    definition:
      'Sacred consecration ceremony invoking divine vital presence into a temple murti or sanctuary.',
  },
  {
    id: 'vastu-purusha-mandala',
    term: 'Vastu Purusha Mandala',
    sanskrit: 'वास्तु पुरुष मण्डल',
    category: 'Practice',
    definition:
      'Sacred geometric grid underlying classical Hindu temple architecture, mapping cosmic order onto physical space.',
  },
  {
    id: 'tat-tvam-asi',
    term: 'Tat Tvam Asi',
    sanskrit: 'तत्त्वमसि',
    category: 'Philosophy',
    definition:
      '"That Thou Art" — one of the four great Upanishadic declarations (Mahavakyas) affirming the unity of Atman and Brahman.',
  },
  {
    id: 'surya-siddhanta',
    term: 'Surya Siddhanta',
    sanskrit: 'सूर्यसिद्धान्त',
    category: 'Scripture',
    definition:
      'Classical Sanskrit astronomical treatise calculating planetary orbits, eclipses, and vast cosmic time cycles.',
  },
  {
    id: 'bhagavad-gita',
    term: 'Bhagavad Gita',
    sanskrit: 'भगवद्गीता',
    category: 'Scripture',
    definition:
      '700-verse philosophical dialogue in the Mahabharata spoken by Krishna to Arjuna on duty, ethics, and Yoga.',
  },
  {
    id: 'harinama-sankirtana',
    term: 'Harinama Sankirtana',
    sanskrit: 'हरिनाम संकीर्तन',
    category: 'Practice',
    definition:
      'Communal devotional chanting and singing of divine names central to the Bhakti tradition.',
  },
  {
    id: 'prasthanatrayi',
    term: 'Prasthanatrayi',
    sanskrit: 'प्रस्थानत्रयी',
    category: 'Scripture',
    definition:
      'The three canonical textual pillars of Vedanta: the Principal Upanishads, the Brahma Sutras, and the Bhagavad Gita.',
  },
  {
    id: 'vishwaroopam',
    term: 'Vishwaroopam',
    sanskrit: 'विश्वरूपम्',
    category: 'Cosmology',
    definition:
      'The cosmic, all-encompassing universal form revealed by Krishna to Arjuna in Chapter 11 of the Bhagavad Gita.',
  },
  {
    id: 'hiranyagarbha',
    term: 'Hiranyagarbha',
    sanskrit: 'हिरण्यगर्भ',
    category: 'Cosmology',
    definition:
      '"Golden Womb" — Rigvedic cosmic principle representing the radiant primordial seed from which the universe unfolds.',
  },
  {
    id: 'apaurusheya',
    term: 'Apaurusheya',
    sanskrit: 'अपौरुषेय',
    category: 'Philosophy',
    definition:
      '"Not of human authorship" — classical view that Vedic truths are eternal cosmic principles discovered rather than invented.',
  },
  {
    id: 'mahayuga',
    term: 'Mahayuga',
    aliases: ['Mahayugas', 'Chaturyuga'],
    sanskrit: 'महायुग',
    category: 'Cosmology',
    definition:
      'A grand cycle of four ages (Satya, Treta, Dvapara, Kali) totaling 4.32 million solar years.',
  },
  {
    id: 'kali-yuga',
    term: 'Kali Yuga',
    sanskrit: 'कलियुग',
    category: 'Cosmology',
    definition:
      'The fourth and current cosmic age in Puranic chronology, traditionally anchored to 3102 BCE.',
  },
  {
    id: 'satya-yuga',
    term: 'Satya Yuga',
    sanskrit: 'सत्ययुग',
    category: 'Cosmology',
    definition:
      'The first golden age of truth and cosmic harmony in the four-age Yuga cycle.',
  },
  {
    id: 'dashavatara',
    term: 'Dashavatara',
    sanskrit: 'दशावतार',
    category: 'Cosmology',
    definition:
      'The ten primary incarnations of Vishnu descending across epochs to restore Dharma.',
  },
  {
    id: 'guru-shishya',
    term: 'Guru-Shishya',
    sanskrit: 'गुरु-शिष्य',
    category: 'Lineage',
    definition:
      'Direct personal lineage of transmission between spiritual teacher (Guru) and dedicated disciple (Shishya).',
  },
  {
    id: 'dvapara',
    term: 'Dvapara',
    sanskrit: 'द्वापर',
    category: 'Cosmology',
    definition:
      'The third cosmic age in Puranic time reckoning, preceding the transition to Kali Yuga.',
  },
  {
    id: 'kalpa',
    term: 'Kalpa',
    aliases: ['Kalpas'],
    sanskrit: 'कल्प',
    category: 'Cosmology',
    definition:
      'One cosmic day of Brahma spanning 1,000 Mahayugas (4.32 billion solar years), followed by an equally long night.',
  },
  {
    id: 'pralaya',
    term: 'Pralaya',
    sanskrit: 'प्रलय',
    category: 'Cosmology',
    definition:
      'Periodic cosmic dissolution or deluge marking the rest interval between cycles of creation.',
  },
  {
    id: 'srishti',
    term: 'Srishti',
    sanskrit: 'सृष्टि',
    category: 'Cosmology',
    definition:
      'Cosmic emanation or manifestation — the first phase of the threefold cycle alongside Sthiti and Samhara.',
  },
  {
    id: 'sthiti',
    term: 'Sthiti',
    sanskrit: 'स्थिति',
    category: 'Cosmology',
    definition:
      'Sustenance and maintenance of cosmic order across an active epoch.',
  },
  {
    id: 'samhara',
    term: 'Samhara',
    sanskrit: 'संहार',
    category: 'Cosmology',
    definition:
      'Cyclical withdrawal or dissolution returning manifested forms to their primal source.',
  },
  {
    id: 'brahman',
    term: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    category: 'Philosophy',
    definition:
      'The infinite, non-dual, unchanging ground of all existence and consciousness in Upanishadic thought.',
  },
  {
    id: 'atman',
    term: 'Atman',
    sanskrit: 'आत्मन्',
    category: 'Philosophy',
    definition:
      'The innermost immortal Self or pure witnessing consciousness within all beings.',
  },
  {
    id: 'dharma',
    term: 'Dharma',
    sanskrit: 'धर्म',
    category: 'Philosophy',
    definition:
      'That which upholds existence — cosmic order, ethical duty, justice, and harmony.',
  },
  {
    id: 'rta',
    term: 'Rta',
    sanskrit: 'ऋत',
    category: 'Cosmology',
    definition:
      'Early Rigvedic principle of natural, moral, and cosmic order governing stars, seasons, and truth.',
  },
  {
    id: 'advaita',
    term: 'Advaita',
    sanskrit: 'अद्वैत',
    category: 'Philosophy',
    definition:
      '"Not two" — the non-dual Vedantic philosophy teaching that Atman and Brahman are ultimately one.',
  },
  {
    id: 'maya',
    term: 'Maya',
    sanskrit: 'माया',
    category: 'Philosophy',
    definition:
      'The cosmic creative power that projects apparent multiplicity over underlying non-dual unity.',
  },
  {
    id: 'bhakti',
    term: 'Bhakti',
    sanskrit: 'भक्ति',
    category: 'Practice',
    definition:
      'Wholehearted loving devotion and personal connection with the Divine.',
  },
  {
    id: 'karma',
    term: 'Karma',
    sanskrit: 'कर्म',
    category: 'Philosophy',
    definition:
      'Intentional action and the universal law of moral cause and consequence.',
  },
  {
    id: 'tapas',
    term: 'Tapas',
    sanskrit: 'तपस्',
    category: 'Practice',
    definition:
      'Disciplined spiritual heat, deep meditative concentration, and creative intensity.',
  },
  {
    id: 'shruti',
    term: 'Shruti',
    sanskrit: 'श्रुति',
    category: 'Scripture',
    definition:
      '"That which is heard" — the primary Vedic revelations transmitted orally across generations.',
  },
  {
    id: 'parampara',
    term: 'Parampara',
    sanskrit: 'परम्परा',
    category: 'Lineage',
    definition:
      'An unbroken chain of transmission preserving sacred texts, philosophy, and oral recitation.',
  },
  {
    id: 'rishis',
    term: 'Rishis',
    aliases: ['Rishi'],
    sanskrit: 'ऋषि',
    category: 'Lineage',
    definition:
      'Vedic seers and sages who perceived sacred hymns (Mantras) in deep meditative insight.',
  },
  {
    id: 'yajnas',
    term: 'Yajnas',
    aliases: ['Yajna'],
    sanskrit: 'यज्ञ',
    category: 'Practice',
    definition:
      'Sacred Vedic fire offering symbolizing gratitude, cosmic reciprocity, and inward surrender.',
  },
  {
    id: 'upanishads',
    term: 'Upanishads',
    aliases: ['Upanishadic'],
    sanskrit: 'उपनिषद्',
    category: 'Scripture',
    definition:
      'Philosophical dialogues concluding the Vedas, inquiring into consciousness, Brahman, and liberation.',
  },
  {
    id: 'vedanta',
    term: 'Vedanta',
    sanskrit: 'वेदान्त',
    category: 'Philosophy',
    definition:
      '"Culmination of the Vedas" — philosophical schools grounded in the Upanishads, Gita, and Brahma Sutras.',
  },
  {
    id: 'puranas',
    term: 'Puranas',
    aliases: ['Puranic', 'Mahapuranas'],
    sanskrit: 'पुराण',
    category: 'Scripture',
    definition:
      'Encyclopedic sacred texts preserving cosmology, lineages, pilgrimage geography, and epic narratives.',
  },
  {
    id: 'rigveda',
    term: 'Rigveda',
    aliases: ['Rigvedic'],
    sanskrit: 'ऋग्वेद',
    category: 'Scripture',
    definition:
      'The oldest surviving Vedic collection of 1,028 hymns spanning cosmology, nature, and philosophy.',
  },
  {
    id: 'itihasa',
    term: 'Itihasa',
    sanskrit: 'इतिहास',
    category: 'Scripture',
    definition:
      '"Thus indeed it happened" — traditional classification encompassing the Ramayana and Mahabharata.',
  },
  {
    id: 'agamas',
    term: 'Agamas',
    aliases: ['Agama'],
    sanskrit: 'आगम',
    category: 'Scripture',
    definition:
      'Canonical manuals governing temple architecture, sacred geometry, liturgy, and yogic practice.',
  },
  {
    id: 'matsya',
    term: 'Matsya',
    sanskrit: 'मत्स्य',
    category: 'Cosmology',
    definition:
      'First of the Dashavatara; the horned fish guiding King Manu across the primordial flood.',
  },
  {
    id: 'varaha',
    term: 'Varaha',
    sanskrit: 'वराह',
    category: 'Cosmology',
    definition:
      'Third Dashavatara; the cosmic boar raising the submerged Earth from deep waters.',
  },
  {
    id: 'bhudevi',
    term: 'Bhudevi',
    sanskrit: 'भूदेवी',
    category: 'Cosmology',
    definition:
      'Sacred personification of Mother Earth in Hindu cosmology and iconography.',
  },
  {
    id: 'bhashyas',
    term: 'Bhashyas',
    aliases: ['Bhashya'],
    sanskrit: 'भाष्य',
    category: 'Scripture',
    definition:
      'Authoritative philosophical commentaries explaining foundational Sanskrit sutras.',
  },
  {
    id: 'sankirtana',
    term: 'Sankirtana',
    aliases: ['Kirtan'],
    sanskrit: 'संकीर्तन',
    category: 'Practice',
    definition:
      'Collective devotional singing and rhythmic chanting of sacred hymns.',
  },
  {
    id: 'abhangas',
    term: 'Abhangas',
    aliases: ['Abhanga'],
    sanskrit: 'अभङ्ग',
    category: 'Scripture',
    definition:
      'Devotional poetic hymns in Marathi associated with Bhakti saints like Sant Tukaram.',
  },
  {
    id: 'yugas',
    term: 'Yugas',
    aliases: ['Yuga'],
    sanskrit: 'युग',
    category: 'Cosmology',
    definition:
      'Cyclic world ages (Satya, Treta, Dvapara, Kali) marking the ebb and renewal of Dharma.',
  },
  {
    id: 'saraswati',
    term: 'Saraswati',
    sanskrit: 'सरस्वती',
    category: 'Cosmology',
    definition:
      'Celebrated Rigvedic river (Naditama) and deity symbolizing learning, music, and sacred speech (Vak).',
  },
  {
    id: 'vak',
    term: 'Vak',
    sanskrit: 'वाक्',
    category: 'Philosophy',
    definition:
      'Sacred speech and cosmic creative vibration articulated in Vedic philosophy.',
  },
  {
    id: 'svara',
    term: 'Svara',
    sanskrit: 'स्वर',
    category: 'Practice',
    definition:
      'Precision tonal pitch accent (Udatta, Anudatta, Svarita) preserving exact Vedic pronunciation.',
  },
  {
    id: 'udatta',
    term: 'Udatta',
    sanskrit: 'उदात्त',
    category: 'Practice',
    definition:
      'High-pitched Vedic recitation accent used in oral preservation.',
  },
  {
    id: 'anudatta',
    term: 'Anudatta',
    sanskrit: 'अनुदात्त',
    category: 'Practice',
    definition:
      'Low-pitched Vedic recitation accent marking tonal cadence.',
  },
  {
    id: 'svarita',
    term: 'Svarita',
    sanskrit: 'स्वरित',
    category: 'Practice',
    definition:
      'Falling/circumflex Vedic recitation pitch balancing Udatta and Anudatta.',
  },
  {
    id: 'ghana-patha',
    term: 'Ghana Patha',
    sanskrit: 'घनपाठ',
    category: 'Practice',
    definition:
      'Most intricate of the Vedic oral recitation permutations (Vikritis), interlocking words forward and backward.',
  },
  {
    id: 'pada-patha',
    term: 'Pada Patha',
    sanskrit: 'पदपाठ',
    category: 'Practice',
    definition:
      'Word-by-word analytical Vedic recitation mode isolating individual words from sandhi rules.',
  },
  {
    id: 'samhita',
    term: 'Samhita',
    aliases: ['Samhitas'],
    sanskrit: 'संहिता',
    category: 'Scripture',
    definition:
      'Primary continuous metrical hymn collection of each Veda.',
  },
  {
    id: 'integral-yoga',
    term: 'Integral Yoga',
    sanskrit: 'पूर्ण योग',
    category: 'Practice',
    definition:
      'Philosophical and spiritual synthesis articulated by Sri Aurobindo uniting inner realization with earthly transformation.',
  },
  {
    id: 'kurukshetra',
    term: 'Kurukshetra',
    sanskrit: 'कुरुक्षेत्र',
    category: 'Lineage',
    definition:
      'Sacred plains in northern India (Dharmakshetra) where the 18-day Mahabharata war and Bhagavad Gita dialogue occurred.',
  },
];
