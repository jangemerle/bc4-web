/**
 * Vite Plugin — Block Automated Fetches
 *
 * Detects bots, scrapers, and automated tools by User-Agent + behavior signals.
 * Returns 403 for blocked requests. Configurable via env var KVALT_BLOCK_BOTS.
 *
 * Enable:  KVALT_BLOCK_BOTS=true npm run dev
 * Disable: KVALT_BLOCK_BOTS=false npm run dev  (or just omit it)
 */

import type { Plugin, Connect } from 'vite';

// ─── Known bot User-Agent patterns ────────────────────────────────────────────
const BOT_PATTERNS = [
  // Search engine crawlers
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i,

  // AI / LLM crawlers
  /gptbot/i,
  /chatgpt/i,
  /claude/i,
  /anthropic/i,
  /ccbot/i,
  /perplexitybot/i,
  /bytespider/i,
  /cohere-ai/i,

  // Generic scrapers & tools
  /scrapy/i,
  /wget/i,
  /curl/i,
  /httpie/i,
  /python-requests/i,
  /python-urllib/i,
  /node-fetch/i,
  /axios/i,
  /got\//i,
  /undici/i,
  /java\//i,
  /libwww/i,
  /lwp-trivial/i,
  /php\//i,
  /ruby/i,

  // SEO / monitoring tools
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /rogerbot/i,
  /screaming frog/i,

  // Headless browsers (suspicious without JS execution)
  /headlesschrome/i,
  /phantomjs/i,

  // Generic bot indicators
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
];

// ─── Suspicious signals ───────────────────────────────────────────────────────
function isSuspicious(req: Connect.IncomingMessage): { blocked: boolean; reason: string } {
  const ua = req.headers['user-agent'] || '';

  // No User-Agent at all — very likely automated
  if (!ua || ua.trim() === '') {
    return { blocked: true, reason: 'missing-user-agent' };
  }

  // Match against known bot patterns
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(ua)) {
      return { blocked: true, reason: `bot-pattern: ${pattern.source}` };
    }
  }

  // Check for suspicious Accept headers (bots often don't send proper Accept)
  const accept = req.headers['accept'] || '';
  if (
    req.url &&
    !req.url.includes('.') && // not a static file request
    !accept.includes('text/html') &&
    !accept.includes('*/*') &&
    req.method === 'GET'
  ) {
    return { blocked: true, reason: 'suspicious-accept-header' };
  }

  return { blocked: false, reason: '' };
}

// ─── Plugin ───────────────────────────────────────────────────────────────────
export function blockBots(options?: {
  /** Override env check — force enable/disable */
  enabled?: boolean;
  /** Additional UA patterns to block */
  extraPatterns?: RegExp[];
  /** Paths to always allow (e.g. health checks) */
  allowPaths?: string[];
  /** Custom 403 response body */
  message?: string;
}): Plugin {
  const {
    allowPaths = ['/robots.txt', '/favicon.ico'],
    message = '🚫 Automated access is not permitted.',
  } = options ?? {};

  return {
    name: 'vite-block-bots',
    configureServer(server) {
      // Check env var — default to disabled
      const envEnabled = process.env.KVALT_BLOCK_BOTS === 'true';
      const isEnabled = options?.enabled ?? envEnabled;

      if (!isEnabled) {
        server.config.logger.info(
          '  🤖 Bot blocking: disabled (set KVALT_BLOCK_BOTS=true to enable)'
        );
        return;
      }

      server.config.logger.info('  🛡️  Bot blocking: enabled');

      server.middlewares.use((req, res, next) => {
        // Always allow certain paths
        if (req.url && allowPaths.some((p) => req.url!.startsWith(p))) {
          return next();
        }

        const { blocked, reason } = isSuspicious(req);

        if (blocked) {
          server.config.logger.warn(
            `  🚫 Blocked: ${req.headers['user-agent']?.slice(0, 80) || '(empty)'} — ${reason}`
          );
          res.statusCode = 403;
          res.setHeader('Content-Type', 'text/plain');
          res.end(message);
          return;
        }

        next();
      });
    },
  };
}
