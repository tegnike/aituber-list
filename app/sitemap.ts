import type { MetadataRoute } from 'next'
import { aitubers, aituberLastUpdated } from '@/lib/aitubers'
import { getAituberDetailPath } from '@/components/aituber-list/types'
import { absoluteUrl, SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(aituberLastUpdated)

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/about/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/terms/'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: absoluteUrl('/privacy/'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const profilePages: MetadataRoute.Sitemap = aitubers.map((aituber) => ({
    url: absoluteUrl(getAituberDetailPath(aituber)),
    lastModified,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [...staticPages, ...profilePages]
}
