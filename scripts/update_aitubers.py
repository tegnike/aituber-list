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
        youtube.channels()
        .list(part="statistics,snippet,contentDetails", id=channel_id)
        .execute()
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

    # search().list()の代わりにplaylistItems().list()を使用
    uploads_playlist_id = channel_info["contentDetails"]["relatedPlaylists"]["uploads"]
    latest_videos = (
        youtube.playlistItems()
        .list(part="snippet", playlistId=uploads_playlist_id, maxResults=2)
        .execute()
    )

    if not latest_videos.get("items"):
        return aituber

    # 動画情報を取得して時間でソート
    valid_videos = []
    jst = pytz.timezone("Asia/Tokyo")
    current_time = datetime.now(jst)
    future_limit = current_time + timedelta(days=1)

    for video_item in latest_videos["items"]:
        video_id = video_item["snippet"]["resourceId"]["videoId"]

        # 動画の詳細情報を取得（liveStreamingDetailsを追加）
        video_response = (
            youtube.videos()
            .list(part="snippet,status,liveStreamingDetails", id=video_id)
            .execute()
        )

        if not video_response.get("items"):
            continue

        video_info = video_response["items"][0]

        # 非公開動画はスキップ
        if video_info["status"]["privacyStatus"] != "public":
            continue

        # プレミア公開かどうかをチェック
        is_premiere = (
            "liveStreamingDetails" in video_info
            and "scheduledStartTime" in video_info["liveStreamingDetails"]
        )

        # 公開日時を日本時間に変換
        if is_premiere:
            # プレミア公開の場合は予定時刻を使用
            published_at = (
                datetime.strptime(
                    video_info["liveStreamingDetails"]["scheduledStartTime"],
                    "%Y-%m-%dT%H:%M:%SZ",
                )
                .replace(tzinfo=pytz.UTC)
                .astimezone(jst)
            )
        else:
            # 通常の動画の場合は公開時刻を使用
            published_at = (
                datetime.strptime(
                    video_info["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
                )
                .replace(tzinfo=pytz.UTC)
                .astimezone(jst)
            )

        # 1日以上先の動画はスキップ
        if published_at > future_limit:
            continue

        valid_videos.append(
            {
                "video_info": video_info,
                "video_id": video_id,
                "published_at": published_at,
                "title": video_item["snippet"]["title"],
                "thumbnail": video_item["snippet"]["thumbnails"]["high"]["url"],
            }
        )

    if not valid_videos:
        return aituber

    # 未来の動画がある場合は公開時刻が近い順、それ以外は最新順でソート
    future_videos = [v for v in valid_videos if v["published_at"] > current_time]
    if future_videos:
        # 未来の動画がある場合、最も近い公開予定の動画を選択
        selected_video = min(future_videos, key=lambda x: x["published_at"])
    else:
        # 過去の動画のみの場合、最新の動画を選択
        selected_video = max(valid_videos, key=lambda x: x["published_at"])

    # AITuberの情報を更新
    aituber.update(
        {
            "youtubeSubscribers": int(channel_info["statistics"]["subscriberCount"]),
            "latestVideoTitle": selected_video["title"],
            "latestVideoThumbnail": selected_video["thumbnail"],
            "latestVideoUrl": f"https://www.youtube.com/watch?v={selected_video['video_id']}",
            "latestVideoDate": selected_video["published_at"].isoformat(),
            "isUpcoming": selected_video["published_at"] > current_time,
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
