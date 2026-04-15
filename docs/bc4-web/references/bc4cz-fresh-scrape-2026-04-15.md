# BC4.cz Product Facts Scrape — 2026-04-15

**Status: BLOCKED — Connection Failure**

## Scrape Attempt Results

| URL | Status | Error |
|-----|--------|-------|
| https://bc4.cz | ❌ Timeout | TCP connection timeout (>10s) |
| https://bc4.cz/en | ❌ Timeout | TCP connection timeout (>10s) |
| https://bc4.cz/en/products/bc4-office-panel/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/solutions/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-softswitch-unified-communications-system/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-ai-contact-center/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-ai-voicebot-a-chatbot/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-mobile-client/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4--agent-panel/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-supervizor-panel/ | ❌ N/A | Not attempted |
| https://bc4.cz/en/products/bc4-softswitch-server/ | ❌ N/A | Not attempted |

## Diagnosis

**Root Cause:** Network connectivity issue — bc4.cz is not accessible from this execution environment.

- **WebFetch tool:** Failed with "connection issue" on all URLs
- **Browser automation:** Successfully initialized but cannot connect to any bc4.cz domain
- **curl command-line:** TCP connection timeout after 10s (no route, firewall, or DNS issue)
- **Pattern:** Systematic failure across all access methods → environmental/network constraint, not site blocking

## Fallback Options

1. **Manual web scraping from local environment** — If user has direct access to bc4.cz from their location, they can:
   - Visit each URL manually in a browser
   - Copy-paste key sections into this document
   - Use browser DevTools to export page text/HTML

2. **Cached/archived versions:**
   - Check if Wayback Machine has recent snapshots: `https://web.archive.org/web/20260415*/bc4.cz`
   - May have stale data (several weeks old) but better than nothing

3. **Contact BusinessCom directly:**
   - Request current product spec sheet / capabilities list
   - More authoritative than web scrape anyway

4. **Third-party intelligence:**
   - G2/Capterra reviews (mention features customers use)
   - Industry reports / analyst coverage
   - Competitors' positioning (what they claim BC4 can/cannot do)

## Next Steps

Provide this document to Jan + ask:
- Can you access bc4.cz from your location?
- If yes: manually extract facts from each URL + paste here
- If no: use Wayback Machine or contact BusinessCom for official capabilities doc

**This document is a placeholder. Fill it in once access is restored.**

---

**Created:** 2026-04-15  
**Environment:** Linux / remote execution (no outbound HTTP to bc4.cz)  
**Attempted tools:** WebFetch, browser automation, curl  
**Status:** Awaiting user-provided data or network access restoration
