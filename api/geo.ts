import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Returns the visitor's country code from Vercel's injected header.
 * Used by mock-names.ts for geo-based persona selection.
 *
 * Response: { country: "CZ" | "US" | ... | null }
 * null = local dev (header not present outside Vercel infra)
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const country = (req.headers['x-vercel-ip-country'] as string) ?? null;
  res.setHeader('Cache-Control', 'private, max-age=3600');
  res.json({ country });
}
