import test from 'node:test';
import assert from 'node:assert/strict';
import { SANATAN_GLOSSARY } from '../data/glossaryData.ts';
import {
  tokenizeGlossaryText,
  extractUniqueGlossaryTerms,
} from './glossaryParser.ts';

test('tokenizeGlossaryText matches whole words and preserves original casing', () => {
  const input = 'Krishna teaches Nishkama Karma and Dharma amidst Kurukshetra.';
  const segments = tokenizeGlossaryText(input, SANATAN_GLOSSARY);

  const terms = segments.filter((s) => s.type === 'term');
  assert.equal(terms.length, 3);
  assert.equal(terms[0].value, 'Nishkama Karma');
  assert.equal(terms[0].type === 'term' && terms[0].entry.id, 'nishkama-karma');
  assert.equal(terms[1].value, 'Dharma');
  assert.equal(terms[2].value, 'Kurukshetra');
  assert.equal(segments.map((s) => s.value).join(''), input);
});

test('tokenizeGlossaryText does not falsely match partial substrings inside larger words', () => {
  const input = 'The Ramayana speaks of Maya and Kalpas across Yugas.';
  const segments = tokenizeGlossaryText(input, SANATAN_GLOSSARY);
  const matchedValues = segments
    .filter((s) => s.type === 'term')
    .map((s) => s.value);

  // "Maya" must match standalone "Maya", NOT inside "Ramayana"
  assert.deepEqual(matchedValues, ['Maya', 'Kalpas', 'Yugas']);
});

test('tokenizeGlossaryText prefers longest multi-word match before single-word match', () => {
  const input = 'Kali Yuga begins after Dvapara and Mahapralaya follows a Kalpa.';
  const segments = tokenizeGlossaryText(input, SANATAN_GLOSSARY);
  const matchedIds = segments
    .filter((s) => s.type === 'term')
    .map((s) => (s.type === 'term' ? s.entry.id : ''));

  assert.deepEqual(matchedIds, ['kali-yuga', 'dvapara', 'mahapralaya', 'kalpa']);
});

test('extractUniqueGlossaryTerms deduplicates repeated terms across descriptions', () => {
  const found = extractUniqueGlossaryTerms(
    [
      'One Kalpa spans 1,000 Mahayugas. Brahman is infinite.',
      'In another kalpa, Brahman and Atman remain non-dual.',
    ],
    SANATAN_GLOSSARY
  );

  const ids = found.map((t) => t.id);
  assert.deepEqual(ids, ['kalpa', 'mahayuga', 'brahman', 'atman']);
});
