from openai import OpenAI
import json
import os

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
[
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
[
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


class Main:
    def __init__(self):
        self.existing_data = load_aitubers()

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
            # YouTubeチャンネルIDが空の場合はスキップ
            if not aituber.get("youtubeChannelID"):
                print(
                    f"Skipped empty YouTube channel ID: {aituber.get('name', 'Unknown')}"
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
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": content},
            ],
            response_format={"type": "json_object"},
        )

        new_data = json.loads(response.choices[0].message.content)
        if isinstance(new_data, dict):
            new_data = [new_data]

        added_count = self.add_new_aitubers(new_data)
        print(f"Total new AITubers added: {added_count}")


if __name__ == "__main__":
    main = Main()
    main.run("名前は[音紡いま AI VTuber]です。youtubeidは[UCSHXPmFvDM32bLm0OgHblsA]")
