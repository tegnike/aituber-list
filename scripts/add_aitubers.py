from openai import OpenAI
import json
import os
import argparse
from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
Create JSON data based on the following format that can handle multiple YouTuber information. If any information is missing, set the value as an empty string for that item.

# Format Details

Please provide the following information for each item:

- name: Name (e.g., character or project name)
- description: Brief description
- tags: Related keywords or categories
- twitterID: Twitter user ID
- youtubeChannelID: YouTube channel ID
- youtubeURL: YouTube channel URL (e.g., https://www.youtube.com/c/[channel_name])
- imageUrl: Image URL (e.g., icon image, profile photo)
- youtubeSubscribers: YouTube channel subscriber count
- latestVideoTitle: Latest video title
- latestVideoThumbnail: Latest video thumbnail URL
- latestVideoUrl: Latest video URL
- latestVideoDate: Latest video publication date (ISO 8601 format)

# Notes

- For missing information, use appropriate empty values (`""`: empty string, or empty array `[]`).

# Output Format

Please output the JSON data in the following format (must be in array format):

```json
{
    "data": [
        {
            "name": "[Character or project name]",
            "description": "[Brief description]",
            "tags": ["[Tag1]", "[Tag2]", "[Tag3]"],
            "twitterID": "[Twitter user ID]",
            "youtubeChannelID": "[YouTube channel ID]",
            "youtubeURL": "[YouTube channel URL]",
            "imageUrl": "[Image URL]",
            "youtubeSubscribers": [Subscriber count as number],
            "latestVideoTitle": "[Latest video title]",
            "latestVideoThumbnail": "[Latest video thumbnail URL]",
            "latestVideoUrl": "[Latest video URL]",
            "latestVideoDate": "[Latest video publication datetime (ISO 8601 format)]"
        }
    ]
}
```

# Examples

**Input Information**

- 名前: ニケちゃん
- 説明: 歌って踊れるAIアイドル
- タグ: アイドル, 歌手, ダンサー
- Twitter ID: tegnike
- YouTube チャンネルID: UCj94TVhN0op8xZX9r-sTvSA
- YouTube チャンネルURL: https://www.youtube.com/c/nikechan
- アイコン画像: nikechan_icon.jpg
- YouTube 登録者数：272
- 最新の動画：アップデートしたのでちゃんと動くか試す配信【AITuberKit】
- サムネイルURL: https://i.ytimg.com/vi/RCHDZ7BRTYQ/hqdefault.jpg
- 動画のURL: https://www.youtube.com/watch?v=RCHDZ7BRTYQ
- 動画公開日: 2024-08-26T18:38:55+09:00

**Expected Output**:

```json
{
    "data": [
        {
            "name": "ニケちゃん",
            "description": "歌って踊れるAIアイドル",
            "tags": ["アイドル", "歌手", "ダンサー"],
            "twitterID": "tegnike",
            "youtubeChannelID": "UCj94TVhN0op8xZX9r-sTvSA",
            "youtubeURL": "https://www.youtube.com/c/nikechan",
            "imageUrl": "nikechan_icon.jpg",
            "youtubeSubscribers": 272,
            "latestVideoTitle": "アップデートしたのでちゃんと動くか試す配信【AITuberKit】",
            "latestVideoThumbnail": "https://i.ytimg.com/vi/RCHDZ7BRTYQ/hqdefault.jpg",
            "latestVideoUrl": "https://www.youtube.com/watch?v=RCHDZ7BRTYQ",
            "latestVideoDate": "2024-08-26T18:38:55+09:00"
        }
    ]
}
```

# Important Notes

- Always output data in array format to handle multiple YouTuber information.
- Even when there is only one YouTuber's information, output it as an array element.
"""


def load_aitubers():
    """aitubers.jsonを読み込む"""
    with open("app/data/aitubers.json", "r", encoding="utf-8") as f:
        return json.load(f)


def save_aitubers(data):
    """aitubers.jsonを保存する"""
    with open("app/data/aitubers.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_channel_info(youtube, channel_id):
    """チャンネルの詳細情報を取得"""
    try:
        response = (
            youtube.channels().list(part="snippet,statistics", id=channel_id).execute()
        )

        if response["items"]:
            channel = response["items"][0]
            snippet = channel["snippet"]
            stats = channel["statistics"]

            # 最新動画の情報を取得
            videos_response = (
                youtube.search()
                .list(
                    part="snippet",
                    channelId=channel_id,
                    order="date",
                    type="video",
                    maxResults=1,
                )
                .execute()
            )

            latest_video = (
                videos_response["items"][0] if videos_response["items"] else None
            )

            return {
                "name": snippet["title"],
                "description": snippet["description"],
                "tags": [],  # チャンネルタグは別APIコールが必要
                "twitterID": "",  # YouTube APIからは取得不可
                "youtubeChannelID": channel_id,
                "youtubeURL": f"https://www.youtube.com/channel/{channel_id}",
                "imageUrl": snippet["thumbnails"]["default"]["url"],
                "youtubeSubscribers": int(stats.get("subscriberCount", 0)),
                "latestVideoTitle": (
                    latest_video["snippet"]["title"] if latest_video else ""
                ),
                "latestVideoThumbnail": (
                    latest_video["snippet"]["thumbnails"]["high"]["url"]
                    if latest_video
                    else ""
                ),
                "latestVideoUrl": (
                    f"https://www.youtube.com/watch?v={latest_video['id']['videoId']}"
                    if latest_video
                    else ""
                ),
                "latestVideoDate": (
                    latest_video["snippet"]["publishedAt"] if latest_video else ""
                ),
            }
    except Exception as e:
        print(f"Error getting channel info: {e}")
        return None


class Main:
    def __init__(self):
        self.existing_data = load_aitubers()
        self.youtube = build(
            "youtube", "v3", developerKey=os.environ.get("YOUTUBE_API_KEY")
        )

    def get_channel_id(self, url_or_name):
        """URLまたはチャンネル名からチャンネルIDを取得"""
        if not url_or_name:
            return None

        # URLからチャンネルIDを抽出を試みる
        parsed_url = urlparse(url_or_name)
        if parsed_url.netloc == "www.youtube.com" or parsed_url.netloc == "youtube.com":
            # /channel/[ID] 形式の場合
            if "/channel/" in parsed_url.path:
                return parsed_url.path.split("/channel/")[1]

            # /c/ or /@[name] 形式の場合
            path = parsed_url.path.strip("/")
            if path.startswith("@") or path.startswith("c/"):
                handle = path.lstrip("c/")
                return self._search_channel_id(handle)

        # URLでない場合は、名前として検索
        return self._search_channel_id(url_or_name)

    def _search_channel_id(self, query):
        """チャンネル名から検索してIDを取得"""
        try:
            response = (
                self.youtube.search()
                .list(part="id", q=query, type="channel", maxResults=1)
                .execute()
            )

            if response["items"]:
                return response["items"][0]["id"]["channelId"]
        except Exception as e:
            print(f"Error searching channel: {e}")
        return None

    def is_duplicate(self, new_aituber):
        """既存のAITuberと重複しているかチェック"""
        for existing in self.existing_data["aitubers"]:
            if (
                existing["youtubeChannelID"]
                and existing["youtubeChannelID"] == new_aituber["youtubeChannelID"]
            ):
                return True
        return False

    def add_new_aitubers(self, new_aitubers):
        """新しいAITuberを追加"""
        added_count = 0
        for aituber in new_aitubers:
            # チャンネルIDが空の場合は、URLから取得を試みる
            if not aituber.get("youtubeChannelID"):
                channel_id = self.get_channel_id(aituber.get("youtubeURL", ""))
                if channel_id:
                    aituber["youtubeChannelID"] = channel_id
                else:
                    print(
                        f"Could not find YouTube channel ID for: {aituber.get('name', 'Unknown')}"
                    )
                    continue

            if not self.is_duplicate(aituber):
                self.existing_data["aitubers"].append(aituber)
                added_count += 1
                print(f"Added: {aituber.get('name', 'Unknown')}")
            else:
                print(f"Skipped duplicate: {aituber.get('name', 'Unknown')}")

        if added_count > 0:
            save_aitubers(self.existing_data)
        return added_count

    def run(self, content: str):
        # URLが直接入力された場合、または @handle 形式の場合
        if content.startswith("http") or content.startswith("@"):
            channel_id = self.get_channel_id(content)
            if channel_id:
                channel_info = get_channel_info(self.youtube, channel_id)
                if channel_info:
                    self.add_new_aitubers([channel_info])
                    return
                else:
                    print("Failed to get channel information")
                    return
            else:
                print("Could not find YouTube channel ID")
                return

        # 通常のテキスト入力の場合は既存の処理を使用
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": content},
            ],
            response_format={"type": "json_object"},
        )
        ai_response_content = response.choices[0].message.content
        print("AI response:", ai_response_content)

        if ai_response_content is None:
            print("Error: AI response content is None")
            return

        try:
            new_data = json.loads(ai_response_content)
            if new_data.get("data"): # .get() を使用して "data" キーが存在しない場合のエラーを回避
                added_count = self.add_new_aitubers(new_data["data"])
                print(f"Total new AITubers added: {added_count}")
            else:
                print("No new AITubers added or 'data' key missing in response")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from AI response: {e}")
            print(f"Problematic JSON string: {ai_response_content}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Add new AITuber information")
    parser.add_argument(
        "content",
        help="AITuber information in text format, YouTube URL, or file path containing URLs",
    )
    parser.add_argument(
        "-f",
        "--file",
        action="store_true",
        help="Treat content as a file path containing URLs",
    )

    args = parser.parse_args()
    main = Main()

    if args.file:
        try:
            with open(args.content, "r", encoding="utf-8") as f:
                for line in f:
                    url = line.strip()
                    if url:  # Skip empty lines
                        print(f"\nProcessing URL: {url}")
                        main.run(url)
        except FileNotFoundError:
            print(f"Error: File '{args.content}' not found")
        except Exception as e:
            print(f"Error reading file: {e}")
    else:
        main.run(args.content)
