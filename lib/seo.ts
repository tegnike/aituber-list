export const SITE_URL = 'https://aituberlist.net'
export const SITE_NAME = 'AITuberList'

export const absoluteUrl = (path: string): string =>
  new URL(path, SITE_URL).toString()

export const truncateText = (value: string, maxLength = 150): string => {
  const normalized = value.replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, '\\u003c')
