import unittest
from datetime import datetime
from zoneinfo import ZoneInfo

from scripts.update_aitubers import get_youtube_content_time
from scripts.refresh_youtube_rss import apply_canonical_latest


class YouTubeContentTimeTest(unittest.TestCase):
    def setUp(self):
        self.jst = ZoneInfo("Asia/Tokyo")

    def test_actual_start_wins_over_stale_schedule(self):
        video = {
            "snippet": {"publishedAt": "2026-08-04T14:43:46Z"},
            "liveStreamingDetails": {
                "scheduledStartTime": "2026-08-04T14:43:46Z",
                "actualStartTime": "2026-08-12T14:49:20Z",
            },
        }

        self.assertEqual(
            get_youtube_content_time(video, self.jst),
            datetime(2026, 8, 12, 23, 49, 20, tzinfo=self.jst),
        )

    def test_upcoming_stream_uses_schedule(self):
        video = {
            "snippet": {"publishedAt": "2026-08-04T14:43:46Z"},
            "liveStreamingDetails": {"scheduledStartTime": "2026-08-14T12:00:00Z"},
        }

        self.assertEqual(
            get_youtube_content_time(video, self.jst),
            datetime(2026, 8, 14, 21, 0, 0, tzinfo=self.jst),
        )

    def test_ordinary_video_uses_publish_time(self):
        video = {"snippet": {"publishedAt": "2026-08-13T03:50:19Z"}}

        self.assertEqual(
            get_youtube_content_time(video, self.jst),
            datetime(2026, 8, 13, 12, 50, 19, tzinfo=self.jst),
        )


class CanonicalLatestTest(unittest.TestCase):
    def test_live_start_time_replaces_rss_publish_time(self):
        aituber = {
            "latestVideoTitle": "Current title",
            "latestVideoThumbnail": "https://example.com/current.jpg",
            "latestVideoUrl": "https://www.youtube.com/watch?v=y1rIkC6_uTQ",
            "latestVideoDate": "2026-08-12T23:49:20+09:00",
        }
        contents = [
            {
                "title": "Old title",
                "thumbnail": "https://example.com/rss.jpg",
                "url": "https://www.youtube.com/watch?v=y1rIkC6_uTQ",
                "date": "2026-08-13T03:50:19+00:00",
            }
        ]

        apply_canonical_latest(aituber, contents)

        self.assertEqual(contents[0]["title"], "Current title")
        self.assertEqual(contents[0]["date"], "2026-08-12T23:49:20+09:00")


if __name__ == "__main__":
    unittest.main()
