#!/usr/bin/env python3
"""Check what Apify content-crawler actually returns for a Behance page."""

import json, os, sys, time, urllib.request
from pathlib import Path

API_BASE = "https://api.apify.com/v2"
ACTOR_ID = "apify~website-content-crawler"
TEST_URL = "https://www.behance.net/gallery/245468841/Fluid-Glass"

def api_request(path, token, method="GET", data=None):
    url = f"{API_BASE}{path}?token={token}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())

def main():
    token = Path('../.env').read_text()
    token = [l.split('=',1)[1].strip() for l in token.splitlines() if l.startswith('APIFY_TOKEN=')][0]

    input_data = {
        "startUrls": [{"url": TEST_URL}],
        "maxCrawlPages": 1,
        "crawlerType": "playwright:firefox",
        "proxyConfiguration": {"useApifyProxy": True},
        "saveHtml": True,
        "saveMarkdown": True,
    }

    print("Starting crawler...", flush=True)
    result = api_request(f"/acts/{ACTOR_ID}/runs", token, method="POST", data=input_data)
    run_id = result["data"]["id"]
    print(f"Run: {run_id}", flush=True)

    for i in range(60):
        time.sleep(5)
        s = api_request(f"/actor-runs/{run_id}", token)
        status = s["data"]["status"]
        print(f"  [{i*5}s] {status}", flush=True)
        if status == "SUCCEEDED": break
        if status in ("FAILED","ABORTED","TIMED-OUT"):
            print("FAILED"); sys.exit(1)

    dataset_id = s["data"]["defaultDatasetId"]
    items = api_request(f"/datasets/{dataset_id}/items?limit=1", token)

    print(f"\nGot {len(items)} items")
    for item in items:
        print(f"\nURL: {item.get('url','')}")
        print(f"Title: {item.get('metadata',{}).get('title','')}")
        # Check for images in markdown
        md = item.get('markdown','') or item.get('text','')
        print(f"Markdown length: {len(md)}")
        # Look for image URLs
        import re
        img_urls = re.findall(r'!\[.*?\]\((https?://[^\)]+)\)', md)
        cdn_imgs = re.findall(r'https?://[a-z0-9\-]+\.behance\.net[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', md, re.I)
        print(f"Markdown image refs: {len(img_urls)}")
        print(f"CDN image URLs in markdown: {len(cdn_imgs)}")
        for u in cdn_imgs[:5]:
            print(f"  {u}")
        # Check HTML for images
        html = item.get('html','')
        print(f"HTML length: {len(html)}")
        html_imgs = re.findall(r'(?:src|data-src)=["\']([^"\']*behance[^"\']*\.(?:jpg|jpeg|png|webp)[^"\']*)["\']', html, re.I)
        print(f"HTML CDN images: {len(html_imgs)}")
        for u in html_imgs[:5]:
            print(f"  {u}")
        # First 500 chars of markdown
        print(f"\nMarkdown preview:\n{md[:500]}")

if __name__ == '__main__':
    main()
