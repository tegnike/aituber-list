#!/usr/bin/env python3
"""Collect public YouTube channel metadata for AITuber classification.

This script is deliberately read-only. It prints JSON to stdout and does not
modify the target repository. It requires yt-dlp and curl to be available.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from typing import Any


JST = timezone(timedelta(hours=9))


def run_json(command: list[str]) -> dict[str, Any]:
    completed = subprocess.run(command, capture_output=True, text=True)
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip().splitlines()[-1] if completed.stderr else "command failed")
    return json.loads(completed.stdout)


def collect_tab(handle: str, tab: str, limit: int) -> dict[str, Any]:
    url = f"https://www.youtube.com/@{handle}{tab}"
    return run_json([
        "yt-dlp", "--flat-playlist", "--playlist-end", str(limit),
        "--dump-single-json", "--skip-download", "--no-warnings", url,
    ])


def entries_from(data: dict[str, Any], channel_id: str | None = None) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for entry in data.get("entries") or []:
        entry_id = entry.get("id")
        title = entry.get("title") or ""
        if not entry_id or entry_id == channel_id:
            continue
        if title.endswith(" - Videos") or title.endswith(" - Live") or title.endswith(" - Shorts"):
            continue
        entries.append(entry)
    return entries


def channel_image(handle: str) -> str:
    completed = subprocess.run(
        ["curl", "-LfsS", f"https://www.youtube.com/@{handle}/about"],
        capture_output=True, text=True,
    )
    if completed.returncode != 0:
        return ""
    matches = re.findall(r'(?:image_src|og:image).*?(?:href|content)="([^"]+)"', completed.stdout, re.I)
    return html.unescape(matches[0]) if matches else ""


def iso_from_timestamp(value: Any) -> str:
    if not value:
        return ""
    return datetime.fromtimestamp(float(value), timezone.utc).astimezone(JST).isoformat()


def collect(handle: str, limit: int) -> dict[str, Any]:
    tabs = ["/videos", "/streams", "/shorts", "", "/about"]
    successful: list[dict[str, Any]] = []
    errors: list[str] = []
    for tab in tabs:
        try:
            data = collect_tab(handle, tab, limit)
            if data.get("channel_id") or data.get("channel"):
                successful.append(data)
        except Exception as error:  # Keep one unavailable tab from hiding the channel.
            errors.append(f"{tab or '/'}: {error}")

    if not successful:
        return {"handle": handle, "error": "; ".join(errors) or "channel metadata unavailable"}

    source = next((data for data in successful if data.get("channel_id")), successful[0])
    channel_id = source.get("channel_id")
    all_entries: list[dict[str, Any]] = []
    seen: set[str] = set()
    for data in successful:
        for entry in entries_from(data, channel_id):
            if entry.get("id") not in seen:
                seen.add(entry["id"])
                all_entries.append(entry)

    latest = all_entries[0] if all_entries else {}
    video: dict[str, Any] = {}
    if latest.get("id"):
        try:
            video = run_json([
                "yt-dlp", "--dump-single-json", "--skip-download", "--no-warnings",
                f"https://www.youtube.com/watch?v={latest['id']}",
            ])
        except Exception as error:
            errors.append(f"latest video: {error}")

    return {
        "handle": handle,
        "channel_id": channel_id,
        "name": source.get("channel") or source.get("uploader") or "",
        "description": source.get("description") or "",
        "subscribers": source.get("channel_follower_count"),
        "image_url": channel_image(handle),
        "entries": [
            {
                "id": entry.get("id"),
                "title": entry.get("title") or "",
                "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}",
                "duration": entry.get("duration"),
            }
            for entry in all_entries[:limit]
        ],
        "latest": {
            "id": latest.get("id", ""),
            "title": video.get("title") or latest.get("title") or "",
            "url": video.get("webpage_url") or latest.get("url") or "",
            "thumbnail": video.get("thumbnail") or "",
            "date": iso_from_timestamp(video.get("timestamp")),
        },
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="+", help="YouTube channel URLs or @handles")
    parser.add_argument("--limit", type=int, default=20, help="Maximum titles to retain per channel")
    args = parser.parse_args()
    if not shutil.which("yt-dlp"):
        print("yt-dlp is required but was not found on PATH", file=sys.stderr)
        return 2

    handles = [url.rstrip("/").split("/@", 1)[-1].split("/", 1)[0].lstrip("@") for url in args.urls]
    print(json.dumps([collect(handle, args.limit) for handle in handles], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
