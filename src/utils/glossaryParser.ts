import { GlossaryTerm } from '../data/glossaryData.ts';

export type TextSegment =
  | { type: 'text'; value: string }
  | { type: 'term'; value: string; entry: GlossaryTerm };

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Tokenize arbitrary description prose into plain text segments and matched glossary terms.
 * Uses longest-match-first ordering and strict word boundaries so substrings (e.g. "Maya" inside "Ramayana")
 * are never falsely matched.
 */
export function tokenizeGlossaryText(
  text: string,
  glossary: GlossaryTerm[]
): TextSegment[] {
  if (!text || glossary.length === 0) {
    return text ? [{ type: 'text', value: text }] : [];
  }

  // Build map from lowercase surface form -> GlossaryTerm
  const lookup = new Map<string, GlossaryTerm>();
  const surfaceForms: string[] = [];

  for (const entry of glossary) {
    const candidates = [entry.term, ...(entry.aliases || [])];
    for (const candidate of candidates) {
      const normalized = candidate.trim().toLowerCase();
      if (normalized && !lookup.has(normalized)) {
        lookup.set(normalized, entry);
        surfaceForms.push(candidate.trim());
      }
    }
  }

  if (surfaceForms.length === 0) {
    return [{ type: 'text', value: text }];
  }

  // Sort longest first so multi-word phrases ("Nishkama Karma", "Kali Yuga") match before single words ("Karma", "Yuga")
  surfaceForms.sort((a, b) => b.length - a.length);

  const pattern = new RegExp(`\\b(${surfaceForms.map(escapeRegExp).join('|')})\\b`, 'gi');
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const matchIndex = match.index ?? 0;
    const matchedText = match[0];

    if (matchIndex > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, matchIndex),
      });
    }

    const entry = lookup.get(matchedText.toLowerCase());
    if (entry) {
      segments.push({
        type: 'term',
        value: matchedText,
        entry,
      });
    } else {
      segments.push({
        type: 'text',
        value: matchedText,
      });
    }

    lastIndex = matchIndex + matchedText.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Extract unique GlossaryTerm entries found inside one or more strings
 */
export function extractUniqueGlossaryTerms(
  texts: Array<string | undefined>,
  glossary: GlossaryTerm[]
): GlossaryTerm[] {
  const found = new Map<string, GlossaryTerm>();

  for (const text of texts) {
    if (!text) continue;
    const segments = tokenizeGlossaryText(text, glossary);
    for (const seg of segments) {
      if (seg.type === 'term' && !found.has(seg.entry.id)) {
        found.set(seg.entry.id, seg.entry);
      }
    }
  }

  return Array.from(found.values());
}
