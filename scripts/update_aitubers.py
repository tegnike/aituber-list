from googleapiclient.discovery import build
import json
from datetime import datetime, timezone, timedelta
import pytz
import os


def load_aitubers():
    """aitubers.jsonを読み込む"""
    with open("app/data/aitubers.json", "r", encoding="utf-8") as f:
        return json.load(f)


def save_aitubers(data):
    """aitubers.jsonを保存する"""
    with open("app/data/aitubers.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_aituber_info(aituber, youtube):
    """各AITuberの情報を更新する"""
    channel_id = aituber["youtubeChannelID"]

    # チャンネルIDが空の場合はスキップ
    if not channel_id:
        return aituber

    # チャンネル情報の取得（statisticsとsnippetの両方を取得）
    channel_response = (
        youtube.channels().list(part="statistics,snippet", id=channel_id).execute()
    )

    if not channel_response["items"]:
        return aituber

    channel_info = channel_response["items"][0]

    # カスタムURLの取得と設定（youtubeURLが空の場合のみ）
    if not aituber["youtubeURL"] and "customUrl" in channel_info["snippet"]:
        custom_url = channel_info["snippet"]["customUrl"]
        # @を除去してyoutubeURLを設定
        aituber["youtubeURL"] = custom_url.lstrip("@")

    # プロフィール画像URLの取得と設定
    if not aituber["imageUrl"] or aituber["imageUrl"].startswith("http"):
        profile_image_url = channel_info["snippet"]["thumbnails"]["high"]["url"]
        aituber["imageUrl"] = profile_image_url

    # 最新動画の情報を取得
    videos_response = (
        youtube.search()
        .list(
            part="snippet",
            channelId=channel_id,
            order="date",
            maxResults=1,
            type="video",
            eventType="completed,live",  # 公開済みの動画とライブ配信中の動画のみを対象にする
        )
        .execute()
    )

    if not videos_response["items"]:
        return aituber

    latest_video = videos_response["items"][0]
    video_id = latest_video["id"]["videoId"]

    # 日本時間に変換
    jst = pytz.timezone("Asia/Tokyo")
    published_at = (
        datetime.strptime(latest_video["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
        .replace(tzinfo=pytz.UTC)
        .astimezone(jst)
    )

    # AITuberの情報を更新
    aituber.update(
        {
            "youtubeSubscribers": int(channel_info["statistics"]["subscriberCount"]),
            "latestVideoTitle": latest_video["snippet"]["title"],
            "latestVideoThumbnail": latest_video["snippet"]["thumbnails"]["high"][
                "url"
            ],
            "latestVideoUrl": f"https://www.youtube.com/watch?v={video_id}",
            "latestVideoDate": published_at.isoformat(),
        }
    )

    return aituber


def update_aituber_data():
    # YouTube Data API の認証情報
    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        raise ValueError("YouTube API Key is not set")

    youtube = build("youtube", "v3", developerKey=api_key)

    # AITuberデータの読み込み
    data = load_aitubers()

    # 各AITuberの情報を更新
    for i, aituber in enumerate(data["aitubers"]):
        try:
            data["aitubers"][i] = update_aituber_info(aituber, youtube)
            print(f"Updated: {aituber['name']}")
        except Exception as e:
            print(f"Error updating {aituber['name']}: {e}")

    # 日本のタイムゾーンで現在時刻を取得
    jst = timezone(timedelta(hours=9))
    current_time = datetime.now(jst)

    # データを更新
    data = {"lastUpdated": current_time.isoformat(), "aitubers": data["aitubers"]}

    # 更新したデータを保存
    save_aitubers(data)
    print("Update completed!")


if __name__ == "__main__":
    update_aituber_data()
