#!/usr/bin/env python3
"""Refresh recent YouTube content from public RSS feeds without API credentials."""

from __future__ import annotations

import argparse
import json
import re
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.request import Request, urlopen


DATA_PATH = Path("app/data/aitubers.json")
ATOM = {"atom": "http://www.w3.org/2005/Atom", "media": "http://search.yahoo.com/mrss/"}
ASMR_PATTERN = re.compile(
    r"(?:\bASMR\b|ＡＳＭＲ|耳かき|耳掃除|音フェチ|ear\s*(?:cleaning|massage))",
    re.IGNORECASE,
)


def fetch_feed(channel_id: str) -> list[dict[str, str]]:
    request = Request(
        f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}",
        headers={"User-Agent": "Mozilla/5.0 AITuberList RSS updater"},
    )
    with urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())

    contents: list[dict[str, str]] = []
    seen_urls: set[str] = set()
    for entry in root.findall("atom:entry", ATOM):
        link = entry.find("atom:link", ATOM)
        thumbnail = entry.find("media:group/media:thumbnail", ATOM)
        url = link.get("href", "") if link is not None else ""
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        contents.append({
            "title": entry.findtext("atom:title", default="", namespaces=ATOM),
            "url": url,
            "thumbnail": thumbnail.get("url", "") if thumbnail is not None else "",
            "date": entry.findtext("atom:published", default="", namespaces=ATOM),
        })
    return contents


def should_add_asmr(aituber: dict, contents: list[dict[str, str]]) -> tuple[bool, list[str]]:
    title_hits = [item["title"] for item in contents if ASMR_PATTERN.search(item["title"])]
    name_hit = bool(ASMR_PATTERN.search(aituber.get("name", "")))
    description_hit = bool(ASMR_PATTERN.search(aituber.get("description", "")))
    qualifies = name_hit or len(title_hits) >= 2 or (description_hit and len(title_hits) >= 1)
    return qualifies, title_hits


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply-asmr", action="store_true", help="Add ASMR tags when evidence is strong")
    parser.add_argument("--dry-run", action="store_true", help="Inspect results without writing data")
    parser.add_argument("--workers", type=int, default=12)
    args = parser.parse_args()

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    records = [item for item in data["aitubers"] if item.get("youtubeChannelID")]
    feeds: dict[str, list[dict[str, str]]] = {}
    errors: dict[str, str] = {}

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(fetch_feed, item["youtubeChannelID"]): item for item in records}
        for future in as_completed(futures):
            item = futures[future]
            try:
                feeds[item["youtubeChannelID"]] = future.result()
            except Exception as error:
                errors[item["youtubeChannelID"]] = f"{type(error).__name__}: {error}"

    tagged: list[dict[str, object]] = []
    refreshed = 0
    for aituber in data["aitubers"]:
        contents = feeds.get(aituber.get("youtubeChannelID", ""))
        if contents is None:
            continue
        if not contents:
            if aituber.get("recentYoutubeVideos") == []:
                aituber.pop("recentYoutubeVideos")
            continue
        aituber["recentYoutubeVideos"] = contents[:3]
        refreshed += 1
        if args.apply_asmr and "ASMR" not in aituber.get("tags", []):
            qualifies, evidence = should_add_asmr(aituber, contents)
            if qualifies:
                aituber.setdefault("tags", []).append("ASMR")
                tagged.append({"name": aituber["name"], "evidence": evidence[:5]})

    if not args.dry_run:
        DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"refreshed": refreshed, "errors": errors, "asmrTagged": tagged}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
