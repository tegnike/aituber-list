from openai import OpenAI
import json
import os
import argparse
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from urllib.parse import urlparse
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

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
- アイコン画像: nikechan_icon.png
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
            "imageUrl": "nikechan_icon.png",
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


class Main:
    def __init__(self):
        self.existing_data = load_aitubers()
        self.youtube_api_key1 = os.environ.get("YOUTUBE_API_KEY")
        self.youtube_api_key2 = os.environ.get("YOUTUBE_API_KEY2")
        self.current_youtube_api_key_name = "YOUTUBE_API_KEY"

        if not self.youtube_api_key1:
            print("警告: YOUTUBE_API_KEY が設定されていません。")
            # YOUTUBE_API_KEY1がない場合、YOUTUBE_API_KEY2で初期化を試みる
            if self.youtube_api_key2:
                print("YOUTUBE_API_KEY2 を使用して初期化します。")
                self.youtube = build(
                    "youtube", "v3", developerKey=self.youtube_api_key2
                )
                self.current_youtube_api_key_name = "YOUTUBE_API_KEY2"
            else:
                print("エラー: 利用可能なYouTube APIキーがありません。")
                self.youtube = None  # APIキーがない場合はNoneを設定
        else:
            self.youtube = build("youtube", "v3", developerKey=self.youtube_api_key1)

        if not self.youtube:  # youtubeオブジェクトが初期化できなかった場合
            print(
                "YouTube APIクライアントの初期化に失敗しました。YouTube関連機能は利用できません。"
            )

    def _try_youtube_api_call(self, api_function_lambda):
        """
        YouTube API呼び出しを試行し、403エラー時にセカンダリキーで再試行します。
        api_function_lambda は、実行するAPI呼び出しを含む引数なしの関数です。
        例: lambda: self.youtube.channels().list(part="id", forHandle=handle).execute()
        """
        if not self.youtube:
            print(
                "YouTube APIクライアントが初期化されていません。API呼び出しをスキップします。"
            )
            raise Exception("YouTube API client not initialized")

        try:
            return api_function_lambda()
        except HttpError as e:
            if (
                e.resp.status == 403
                and self.current_youtube_api_key_name == "YOUTUBE_API_KEY"
                and self.youtube_api_key2
            ):
                print(
                    f"API呼び出しが {self.current_youtube_api_key_name} で失敗 (403エラー)。YOUTUBE_API_KEY2 に切り替えます。"
                )
                self.youtube = build(
                    "youtube", "v3", developerKey=self.youtube_api_key2
                )
                self.current_youtube_api_key_name = "YOUTUBE_API_KEY2"
                print("YOUTUBE_API_KEY2 に切り替えました。API呼び出しを再試行します...")
                try:
                    return api_function_lambda()  # 新しいキーで再試行
                except HttpError as e2:
                    print(f"YOUTUBE_API_KEY2 でのAPI呼び出しも失敗しました: {e2}")
                    raise  # 2回目の試行のエラーを再発生させる
            else:
                # 403以外のエラー、または既にYOUTUBE_API_KEY2を使用中、またはYOUTUBE_API_KEY2がない場合
                raise  # 元のエラーを再発生させる
        except Exception as ex:  # HttpError以外の予期せぬエラー
            print(f"YouTube API呼び出し中に予期せぬエラーが発生しました: {ex}")
            raise

    def get_channel_info(self, channel_id):
        """チャンネルの詳細情報を取得"""
        if not self.youtube:
            return None
        try:
            api_call_channels = (
                lambda: self.youtube.channels()
                .list(part="snippet,statistics", id=channel_id)
                .execute()
            )
            response = self._try_youtube_api_call(api_call_channels)

            if response and response["items"]:
                channel = response["items"][0]
                snippet = channel["snippet"]
                stats = channel["statistics"]

                # 最新動画の情報を取得
                api_call_search = (
                    lambda: self.youtube.search()
                    .list(
                        part="snippet",
                        channelId=channel_id,
                        order="date",
                        type="video",
                        maxResults=1,
                    )
                    .execute()
                )
                videos_response = self._try_youtube_api_call(api_call_search)

                latest_video = (
                    videos_response["items"][0]
                    if videos_response and videos_response["items"]
                    else None
                )

                return {
                    "name": snippet["title"],
                    "description": snippet["description"],
                    "tags": [],
                    "twitterID": "",
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
            print(f"チャンネル情報の取得中にエラーが発生しました ({channel_id}): {e}")
            return None

    def get_channel_id(self, url_or_name):
        """URLまたはチャンネル名からチャンネルIDを取得"""
        if not self.youtube or not url_or_name:
            return None

        parsed_url = urlparse(url_or_name)
        if parsed_url.netloc == "www.youtube.com" or parsed_url.netloc == "youtube.com":
            if "/channel/" in parsed_url.path:
                return parsed_url.path.split("/channel/")[1]

            path = parsed_url.path.strip("/")
            if path.startswith("@"):
                handle = path
                try:
                    api_call = (
                        lambda: self.youtube.channels()
                        .list(part="id", forHandle=handle)
                        .execute()
                    )
                    response = self._try_youtube_api_call(api_call)
                    if response and response["items"]:
                        return response["items"][0]["id"]
                except Exception as e:
                    print(
                        f"ハンドル名 '{handle}' からチャンネルIDの取得中にエラー: {e}"
                    )
                return None
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
            if not aituber.get("youtubeChannelID"):
                channel_id = self.get_channel_id(aituber.get("youtubeURL", ""))
                if channel_id:
                    aituber["youtubeChannelID"] = channel_id
                else:
                    print(
                        f"YouTubeチャンネルIDが見つかりませんでした: {aituber.get('name', 'Unknown')}"
                    )
                    continue

            # チャンネルIDが見つかった場合、または最初から存在する場合、詳細情報を取得して更新
            if aituber.get("youtubeChannelID"):
                # 既存の情報を保持しつつ、APIから取得できる情報で更新
                # name, description, imageUrl, youtubeSubscribers など
                # これは get_channel_info を呼んでマージする形が良いが、
                # 現在のadd_new_aitubersはLLMからの入力が主なので、重複チェック後にAPI情報を引くのは冗長かもしれない
                # ここでは、LLMが生成した情報を基本的に信頼し、IDのみをURLから補完する現在のロジックを維持
                pass

            if not self.is_duplicate(aituber):
                # 重複がない場合、APIから最新情報を取得してマージする（オプション）
                # ここで get_channel_info を呼び、aituber 辞書を更新することを検討できる
                # 例:
                # if aituber.get("youtubeChannelID"):
                #     print(f"'{aituber.get('name', 'Unknown')}' の最新情報を取得しています...")
                #     updated_info = self.get_channel_info(aituber["youtubeChannelID"])
                #     if updated_info:
                #         # マージ戦略: LLMの情報を優先するか、API情報を優先するか
                #         # ここではAPI情報で主要な項目を上書きする例
                #         aituber.update({
                #             "name": updated_info.get("name", aituber.get("name")),
                #             "description": updated_info.get("description", aituber.get("description")),
                #             "imageUrl": updated_info.get("imageUrl", aituber.get("imageUrl")),
                #             "youtubeSubscribers": updated_info.get("youtubeSubscribers", aituber.get("youtubeSubscribers")),
                #             "latestVideoTitle": updated_info.get("latestVideoTitle", aituber.get("latestVideoTitle")),
                #             "latestVideoThumbnail": updated_info.get("latestVideoThumbnail", aituber.get("latestVideoThumbnail")),
                #             "latestVideoUrl": updated_info.get("latestVideoUrl", aituber.get("latestVideoUrl")),
                #             "latestVideoDate": updated_info.get("latestVideoDate", aituber.get("latestVideoDate")),
                #         })
                #     else:
                #         print(f"'{aituber.get('name', 'Unknown')}' の最新情報の取得に失敗しました。")

                self.existing_data["aitubers"].append(aituber)
                added_count += 1
                print(f"追加しました: {aituber.get('name', 'Unknown')}")
            else:
                print(f"重複のためスキップ: {aituber.get('name', 'Unknown')}")

        if added_count > 0:
            save_aitubers(self.existing_data)
        return added_count

    def run(self, content: str):
        if not self.youtube and (content.startswith("http") or content.startswith("@")):
            print(
                "YouTube APIクライアントが利用できないため、URL/ハンドルからの直接処理はスキップします。"
            )
            return

        if content.startswith("http") or content.startswith("@"):
            channel_id = self.get_channel_id(content)
            if channel_id:
                channel_info = self.get_channel_info(
                    channel_id
                )  # self.youtube は不要になった
                if channel_info:
                    self.add_new_aitubers([channel_info])
                    return
                else:
                    print("チャンネル情報の取得に失敗しました。")
                    return
            else:
                print("YouTubeチャンネルIDが見つかりませんでした。")
                return

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": content},
            ],
            response_format={"type": "json_object"},
        )
        ai_response_content = response.choices[0].message.content
        print("AIの応答:", ai_response_content)

        if ai_response_content is None:
            print("エラー: AIの応答内容がNoneです。")
            return

        try:
            new_data = json.loads(ai_response_content)
            if new_data.get("data"):
                added_count = self.add_new_aitubers(new_data["data"])
                print(f"新規AITuberの総追加数: {added_count}")
            else:
                print(
                    "新規AITuberは追加されませんでした、または応答に 'data' キーがありません。"
                )
        except json.JSONDecodeError as e:
            print(f"AIの応答からのJSONデコードエラー: {e}")
            print(f"問題のあるJSON文字列: {ai_response_content}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="新しいAITuber情報を追加します")
    parser.add_argument(
        "content",
        help="テキスト形式のAITuber情報、YouTube URL、またはURLを含むファイルパス",
    )
    parser.add_argument(
        "-f",
        "--file",
        action="store_true",
        help="contentをURLを含むファイルパスとして扱います",
    )

    args = parser.parse_args()
    main = Main()

    if (
        main.youtube is None and not args.file
    ):  # youtubeが使えない状況で直接URL/ハンドル以外の処理
        is_url_or_handle = args.content.startswith("http") or args.content.startswith(
            "@"
        )
        if not is_url_or_handle:
            print(
                "YouTube APIクライアントが利用できないため、テキストベースの処理はスキップします。"
            )
            exit()  # ここで終了させるか、LLM処理に進ませるか。現状はLLMには進める。

    if args.file:
        try:
            with open(args.content, "r", encoding="utf-8") as f:
                for line in f:
                    url = line.strip()
                    if url:
                        print(f"\nURLを処理中: {url}")
                        main.run(url)
        except FileNotFoundError:
            print(f"エラー: ファイル '{args.content}' が見つかりません。")
        except Exception as e:
            print(f"ファイル読み込みエラー: {e}")
    else:
        main.run(args.content)
