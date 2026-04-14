import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * ARES company lookup endpoint.
 *
 * GET /api/ares?ico=27426653 → { found: true, companyName: "BusinessCom a.s.", address: "..." }
 *
 * MVP implementace volá veřejné ARES API a vrací zjednodušený payload pro frontend.
 * Endpoint je idempotentní, cachuje výsledky 24h v Vercel edge cache.
 *
 * Bezpečnostní notes:
 *   - Rate limiting: TODO (Upstash Redis), pro MVP spoléháme na Vercel funkcí cache
 *   - Input validation: 8-digit IČ regex
 *   - No PII v logu (jen IČ, ne jméno firmy z odpovědi)
 */

interface AresResponse {
  found: boolean;
  companyName?: string;
  address?: string;
  error?: string;
}

const ARES_API_BASE = 'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty';
const ICO_REGEX = /^\d{8}$/;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Pouze GET
  if (req.method !== 'GET') {
    res.status(405).json({ found: false, error: 'Method not allowed' } satisfies AresResponse);
    return;
  }

  const ico = String(req.query.ico ?? '').trim();

  // Validace formátu
  if (!ICO_REGEX.test(ico)) {
    res.status(400).json({ found: false, error: 'IČ musí mít 8 číslic' } satisfies AresResponse);
    return;
  }

  // Cache 24h on edge
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  try {
    const response = await fetch(`${ARES_API_BASE}/${ico}`, {
      headers: { Accept: 'application/json' },
      // 5s timeout aby slow ARES nezablokoval frontend
      signal: AbortSignal.timeout(5000),
    });

    if (response.status === 404) {
      res.status(200).json({ found: false } satisfies AresResponse);
      return;
    }

    if (!response.ok) {
      console.error(`ARES API error: ${response.status} for IČ ${ico}`);
      res.status(502).json({ found: false, error: 'ARES service unavailable' } satisfies AresResponse);
      return;
    }

    const data = await response.json() as AresApiPayload;

    const companyName = data.obchodniJmeno ?? undefined;
    const address = formatAddress(data.sidlo);

    res.status(200).json({
      found: true,
      companyName,
      address,
    } satisfies AresResponse);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    console.error(`ARES lookup failed for ${ico}: ${isAbort ? 'timeout' : 'error'}`);
    res.status(502).json({
      found: false,
      error: isAbort ? 'ARES timeout' : 'ARES lookup failed',
    } satisfies AresResponse);
  }
}

// ─── ARES payload typing ──────────────────────────────────────────────────────

interface AresApiPayload {
  ico?: string;
  obchodniJmeno?: string;
  sidlo?: AresAddress;
}

interface AresAddress {
  nazevUlice?: string;
  cisloDomovni?: string | number;
  cisloOrientacni?: string | number;
  nazevObce?: string;
  psc?: string | number;
}

function formatAddress(sidlo: AresAddress | undefined): string | undefined {
  if (!sidlo) return undefined;
  const street = [sidlo.nazevUlice, [sidlo.cisloDomovni, sidlo.cisloOrientacni].filter(Boolean).join('/')]
    .filter(Boolean)
    .join(' ');
  const city = [sidlo.psc, sidlo.nazevObce].filter(Boolean).join(' ');
  return [street, city].filter(Boolean).join(', ');
}
