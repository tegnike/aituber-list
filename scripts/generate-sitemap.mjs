import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://aituberlist.net'

// aitubers.jsonからデータを読み込み
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../app/data/aitubers.json'), 'utf-8')
)

const today = new Date().toISOString().split('T')[0]

// 静的ページの定義
const staticPages = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/terms/', changefreq: 'monthly', priority: '0.5' },
  { loc: '/privacy/', changefreq: 'monthly', priority: '0.5' },
]

// 全タグを抽出（重複なし）
const allTags = [...new Set(data.aitubers.flatMap(a => a.tags))]

// タグURLの生成
const tagUrls = allTags.map(tag => ({
  loc: `/?tags=${encodeURIComponent(tag)}`,
  changefreq: 'daily',
  priority: '0.8'
}))

// 全URLを結合
const urls = [...staticPages, ...tagUrls]

// XMLを生成
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

// public/sitemap.xmlに出力
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml)
console.log(`Sitemap generated with ${urls.length} URLs (${staticPages.length} static pages + ${tagUrls.length} tag pages)`)
