import aituberData from '@/app/data/aitubers.json'
import type { AITuber } from '@/components/aituber-list/types'
import { getAituberSlug } from '@/components/aituber-list/types'

export const aitubers = aituberData.aitubers as AITuber[]
export const aituberLastUpdated = aituberData.lastUpdated

export const findAituberBySlug = (slug: string): AITuber | undefined =>
  aitubers.find((aituber) => getAituberSlug(aituber) === slug)

export const getMainAitubers = (): AITuber[] =>
  aitubers.filter((aituber) => !aituber.tags.includes('一部AITuber'))
