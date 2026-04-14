#!/usr/bin/env python3
"""
Scrape Behance gallery pages using Apify content-crawler (playwright).
Extracts project images from HTML, saves to knowledge/design-inspiration/behance/.
"""

import json, os, re, sys, time, urllib.request
from pathlib import Path

API_BASE = "https://api.apify.com/v2"
ACTOR_ID = "apify~website-content-crawler"

BEHANCE_URLS = [
    ("lifeos-personal-ai-agents",       "https://www.behance.net/gallery/245997061/lifeOS-Personal-AI-Agents-App-UX-UI-Design"),
    ("serena-medical-healthcare",       "https://www.behance.net/gallery/226311719/Serena-Medical-Healthcare-App-UXUI-Design"),
    ("ozy-ai-hardware",                 "https://www.behance.net/gallery/246044411/OZY-AI-3D-Hardware-Design-UI-Visual-Identity"),
    ("m6-uxui-exhibition",              "https://www.behance.net/gallery/228756959/M6-UXUI-Exhibition"),
    ("esme-van-arden-uxui",             "https://www.behance.net/gallery/239209175/Esme-Van-Arden-UXUI"),
    ("wellness-aging-care-app",         "https://www.behance.net/gallery/242023175/UIUX-for-Wellness-Aging-Care-Mood-Meds-Tracking-app"),
    ("fluid-glass",                     "https://www.behance.net/gallery/245468841/Fluid-Glass"),
    ("aurum-fintech-website",           "https://www.behance.net/gallery/245059863/Aurum-Fintech-Marketing-Website"),
    ("alphane-labs",                    "https://www.behance.net/gallery/244697577/Alphane-Labs"),
    ("genlayer-brand-identity",         "https://www.behance.net/gallery/230820941/GenLayer-Brand-Identity"),
    ("the-software-house-website",      "https://www.behance.net/gallery/239835029/The-Software-House-Website"),
    ("n2w-branding-website",            "https://www.behance.net/gallery/235108327/N2W-Branding-Website"),
    ("stratum-ai-finance",              "https://www.behance.net/gallery/242751321/Stratum-AI-UXUI-Branding-for-Finance-Management"),
    ("dashline-website",                "https://www.behance.net/gallery/235856073/Dashline-Website"),
    ("bladygros",                       "https://www.behance.net/gallery/123591263/BladyGros"),
    ("jailhouse-lawyers-website",       "https://www.behance.net/gallery/226548265/The-History-of-Jailhouse-Lawyers-Website"),
]


def api_request(path, token, method="GET", data=None):
    url = f"{API_BASE}{path}?token={token}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())


def run_crawler(urls_with_slugs, token):
    """Crawl a batch of URLs, return list of (slug, html) tuples."""
    slug_map = {url: slug for slug, url in urls_with_slugs}
    start_urls = [{"url": url} for _, url in urls_with_slugs]

    input_data = {
        "startUrls": start_urls,
        "maxCrawlPages": len(start_urls),
        "crawlerType": "playwright:firefox",
        "proxyConfiguration": {"useApifyProxy": True},
        "saveHtml": True,
        "maxConcurrency": 3,
    }

    print(f"Starting crawler for {len(start_urls)} URLs...", flush=True)
    result = api_request(f"/acts/{ACTOR_ID}/runs", token, method="POST", data=input_data)
    run_id = result["data"]["id"]
    print(f"  Run: {run_id}", flush=True)

    for i in range(120):
        time.sleep(5)
        s = api_request(f"/actor-runs/{run_id}", token)
        status = s["data"]["status"]
        print(f"  [{i*5}s] {status}", flush=True)
        if status == "SUCCEEDED":
            break
        elif status in ("FAILED", "ABORTED", "TIMED-OUT"):
            print(f"  Run {status}", file=sys.stderr)
            return []

    ds = s["data"]["defaultDatasetId"]
    items = api_request(f"/datasets/{ds}/items?limit=50", token)

    results = []
    for item in items:
        page_url = item.get("url", "")
        html = item.get("html", "")
        slug = slug_map.get(page_url, "")
        if slug:
            results.append((slug, html))
    return results


def extract_images(html):
    """Extract unique high-res Behance project image URLs from HTML."""
    # Find all Behance CDN image URLs
    all_urls = re.findall(
        r'https?://mir-s3-cdn-cf\.behance\.net/project_modules/[^\s"\'<>]+',
        html
    )

    # Group by base image identity (strip the size prefix)
    # URL pattern: /project_modules/{size}/{hash}.{ext}
    best = {}
    for url in all_urls:
        # Normalize to extract base key
        clean = url.split('?')[0]  # strip query params
        # Extract the hash part (last path segment)
        parts = clean.split('/')
        if len(parts) < 2:
            continue
        filename = parts[-1]  # e.g. "57eb6e245468841.69afd9b9492be.jpg"
        size_prefix = parts[-2] if len(parts) >= 2 else ""

        # Prefer: max_3840 > fs > 1400 > others
        priority = {'max_3840_webp': 0, 'max_3840': 1, 'fs_webp': 2, 'fs': 3,
                    'max_1400_webp': 4, '1400_webp': 5, 'max_1200': 6}.get(size_prefix, 99)

        key = filename.split('.')[0]  # base hash
        if key not in best or priority < best[key][0]:
            best[key] = (priority, clean)

    # Return deduplicated best-resolution URLs
    return [url for _, url in sorted(best.values(), key=lambda x: x[0])]


def is_likely_ui(url):
    """Skip avatars, profile pics, tiny thumbnails."""
    skip = ['/user_profile/', '/profile/', '/avatars/', '/logos/', 'profile_images']
    return not any(p in url for p in skip)


def download_image(url, dest_path):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://www.behance.net/',
    }
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(dest_path, 'wb') as f:
                    f.write(data)
                return len(data)
        except Exception as e:
            if attempt == 2:
                return 0
            time.sleep(2)
    return 0


def main():
    token = ""
    env_file = Path(__file__).parent.parent / '.env'
    for line in env_file.read_text().splitlines():
        if line.startswith('APIFY_TOKEN='):
            token = line.split('=', 1)[1].strip()
    if not token:
        print("APIFY_TOKEN not found", file=sys.stderr)
        sys.exit(1)

    output_base = Path(__file__).parent.parent / 'knowledge' / 'design-inspiration' / 'behance'
    output_base.mkdir(parents=True, exist_ok=True)

    total_saved = 0
    batch_size = 4

    for i in range(0, len(BEHANCE_URLS), batch_size):
        batch = BEHANCE_URLS[i:i + batch_size]
        print(f"\n{'='*60}", flush=True)
        print(f"Batch {i//batch_size + 1}/{(len(BEHANCE_URLS)+batch_size-1)//batch_size}: {[s for s,_ in batch]}", flush=True)

        results = run_crawler(batch, token)

        for slug, html in results:
            folder = output_base / slug
            folder.mkdir(parents=True, exist_ok=True)

            imgs = extract_images(html)
            imgs = [u for u in imgs if is_likely_ui(u)]
            print(f"\n  [{slug}] {len(imgs)} unique UI images found", flush=True)

            saved = 0
            for j, url in enumerate(imgs[:20]):  # max 20 per project
                ext = 'webp' if 'webp' in url else 'jpg'
                dest = folder / f"{j+1:02d}.{ext}"
                size = download_image(url, str(dest))
                if size > 0:
                    print(f"    {j+1:02d}. ✓ {size//1024}KB", flush=True)
                    saved += 1
                    total_saved += 1
                else:
                    print(f"    {j+1:02d}. ✗ failed", flush=True)

            print(f"  → Saved {saved} images to {folder}", flush=True)

    print(f"\n{'='*60}", flush=True)
    print(f"Done. Total: {total_saved} images across {len(BEHANCE_URLS)} projects.", flush=True)


if __name__ == '__main__':
    main()
