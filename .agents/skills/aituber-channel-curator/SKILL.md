---
name: aituber-channel-curator
description: YouTubeチャンネルを機械的に調査し、AITuberメインか一部AITuberかを判定して、概要・最新動画・X情報・既存タグを安全にAITuber一覧へ反映する。YouTubeチャンネルURLの追加、AITuberタグの自動判定、既存チャンネルのタグ再確認、Xアカウント情報の補完、AITuberリストの更新を依頼されたときに使用する。
---

# AITuber Channel Curator

YouTubeチャンネルの取得データと公開コンテンツを根拠に、AITuber一覧のレコードを追加・補完する。機械取得とAI判定を分離し、既存レコードの情報を不用意に上書きしない。

## Workflow

### 1. Discover the data authority

- 作業対象のリポジトリ、データファイル、タグ定義、UI上の特殊タグ処理を先に確認する。
- このプロジェクトでは通常 `app/data/aitubers.json`、取得処理は `scripts/add_aitubers.py`、タグ定義は `lib/i18n.ts` と `components/aituber-list/types.ts` にある。
- `app/data/aitubers.json` の既存レコードを読み、`youtubeChannelID` と正規化したYouTube URLで重複を判定する。
- 既存レコードは、ユーザーが明示的に修正を求めない限り、概要・画像・登録者数・最新動画・X情報を上書きしない。タグは既存値を保持し、根拠がある追加タグだけを足す。

### 2. Collect metadata mechanically first

- まずリポジトリにある取得スクリプトを使う。API依存関係や認証が使えない場合は、付属の `scripts/collect_youtube_metadata.py` を使い、`yt-dlp` で同等の公開メタデータを取得する。
- 取得対象はチャンネルID、表示名、概要、登録者数、チャンネル画像、公開コンテンツ一覧、最新動画のタイトル・URL・サムネイル・投稿日とする。
- `/videos` タブが存在しないチャンネルでは `/streams`、`/shorts`、チャンネル本体、`/about` の順に確認する。配信中心のチャンネルを「動画なし」と誤判定しない。
- 取得結果を先に記録・確認してからタグを判定する。APIキーなどの秘密情報は出力・コミットしない。
- YouTube側の一時的なエラー、予定配信、取得不能な投稿日は不確実性として報告し、推測で埋めない。

### 3. Judge channel scope and tags

- 概要欄と、可能なら10件以上の動画・配信タイトルを確認する。単一のタイトルだけでタグを断定しない。
- AITuberキャラクターがチャンネルの主役で、配信・投稿の中心なら `一部AITuber` を付けない。
- 人間の活動・通常動画・開発者チャンネルが主で、その一部にAIキャラクターを使う場合だけ `一部AITuber` を付ける。このタグは内部レコードには保持できるが、通常のタグ選択肢から除外される特殊分類として扱う。
- 適用可能なタグは上限なく付けてよいが、明確な根拠があるものに限る。概要欄に「歌」「ゲーム」と書かれているだけで、歌唱枠・ゲーム実況配信が確認できなければ断定しない。
- `海外` は英語併記、海外歓迎、英語チャット対応だけでは付けない。主な視聴者・運営・コンテンツが非日本語圏向けだと、複数の公開情報から確認できる場合に限る。
- 詳細なタグ定義と判断例は [references/tag-policy.md](references/tag-policy.md) を読む。
- AI判定は断定しすぎず、採用した根拠と見送った近似タグを最終報告する。

### 4. Handle X information conservatively

- 概要欄、チャンネル紹介、固定リンクなどから公式Xアカウントが明確に確認でき、かつ既存 `twitterID` が空の場合だけ補完する。
- 開発者、制作協力者、所属先、他人のアカウントをチャンネル公式アカウントとして登録しない。
- 既存の `twitterID` はユーザーの明示的な修正依頼がない限り変更しない。スキーマ上は通常 `@` を除いたハンドルを保存するが、既存値の形式を尊重する。

### 5. Update and verify

- 新規レコードは既存スキーマの全フィールドを埋める。通常は `twitterID: ""`、`isUpcoming: false` とし、Xが確実な場合だけ設定する。
- チャンネルID、YouTube URL、画像、最新動画URLは取得結果を使う。元の`@handle` URLは `youtubeURL` に保存してよいが、UIのリンク先がチャンネルID依存か確認する。
- JSONをパースし、件数、重複チャンネルID、重複URL、許可されたタグ名、必須フィールドを検証する。`git diff --check` も実行する。
- データ変更後は可能なら `npm run lint` と `npm run build` を実行する。既存警告と今回のエラーを区別する。
- ユーザーが明示的に求めない限りコミット・プッシュしない。求められた場合は、所有するファイルだけを明示的にステージし、リモート先行更新を確認してから安全にリベースまたはマージしてプッシュする。

## Project-specific schema

`app/data/aitubers.json` のレコードは通常次のフィールドを持つ。

`name`, `description`, `tags`, `twitterID`, `youtubeChannelID`, `youtubeURL`, `imageUrl`, `youtubeSubscribers`, `latestVideoTitle`, `latestVideoThumbnail`, `latestVideoUrl`, `latestVideoDate`, `isUpcoming`

投稿日をUnix timestampから変換する場合は、プロジェクトの既存形式に合わせて日本時間のISO 8601にする。取得できない値は空文字など既存スキーマの慣例に合わせ、架空の時刻を作らない。

## Output

最終報告には、追加・更新件数、各チャンネルの判定タグ、`一部AITuber` の有無、X情報の変更有無、検証結果、コミット・プッシュの有無を簡潔に示す。不確かなチャンネルは理由とともに明示する。
