from TikTokApi import TikTokApi

api = TikTokApi()

# 取得件数
results = 3

# 解説動画にあるように認証のためのcustom_verifyFpをサイトから取得して入れる
trending = api.by_trending(
    count=results,
    custom_verifyFp="verify_m411i6v4_fPcXuoCe_2Q9W_4mqw_AnCb_HuRzmaoyuuBR",
)

for tiktok in trending:
    print("uniqueId: ", tiktok["author"]["uniqueId"])
    print("id: ", tiktok["id"])
    print("diggCount: ", tiktok["stats"]["diggCount"])
    print("playCount: ", tiktok["stats"]["playCount"])
    print("＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝")
