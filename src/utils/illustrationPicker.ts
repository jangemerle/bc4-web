/**
 * Illustration Picker — auto-matches illustrations to page content.
 *
 * Reads the catalog and scores each illustration against a set of keywords
 * (page title, topic, section names). Returns the best match.
 *
 * Usage:
 *   const match = pickIllustration(['email', 'notification', 'settings']);
 *   // → { file: 'envelope.png', name: 'Envelope', src: '/illustrations/envelope.png' }
 */

import catalog from '../../public/illustrations/_catalog.json';

export interface IllustrationMatch {
  file: string;
  name: string;
  src: string;
  score: number;
}

/**
 * Score an illustration against a set of keywords.
 * Matches against tags, context, and name.
 */
function score(
  illustration: (typeof catalog.illustrations)[number],
  keywords: string[],
): number {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  let total = 0;

  for (const kw of lowerKeywords) {
    // Tag match — strongest signal (3 points)
    if (illustration.tags.some((t) => t.includes(kw) || kw.includes(t))) {
      total += 3;
    }
    // Context match (2 points)
    if (illustration.context.toLowerCase().includes(kw)) {
      total += 2;
    }
    // Name match (1 point)
    if (illustration.name.toLowerCase().includes(kw)) {
      total += 1;
    }
  }

  return total;
}

/**
 * Pick the best illustration for the given keywords.
 * Returns null if no illustration scores above the threshold.
 */
export function pickIllustration(
  keywords: string[],
  threshold = 2,
): IllustrationMatch | null {
  if (!catalog.illustrations.length) return null;

  let best: IllustrationMatch | null = null;

  for (const ill of catalog.illustrations) {
    const s = score(ill, keywords);
    if (s >= threshold && (!best || s > best.score)) {
      best = {
        file: ill.file,
        name: ill.name,
        src: `/illustrations/${ill.file}`,
        score: s,
      };
    }
  }

  return best;
}

/**
 * Get all illustrations sorted by relevance to the keywords.
 */
export function rankIllustrations(
  keywords: string[],
): IllustrationMatch[] {
  return catalog.illustrations
    .map((ill) => ({
      file: ill.file,
      name: ill.name,
      src: `/illustrations/${ill.file}`,
      score: score(ill, keywords),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
