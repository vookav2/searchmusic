import { makeError, ytError } from './yt-error'

import { joinRunsText } from './yt-util'
import { ytRequest } from './yt-request'

const SearchParams = {
  Songs: 'EgWKAQIIAWoKEAMQBBAJEAoQBQ%3D%3D',
  Videos: 'EgWKAQIQAWoKEAMQBBAJEAoQBQ%3D%3D',
  Albums: 'EgWKAQIYAWoKEAMQBBAJEAoQBQ%3D%3D',
  Artists: 'EgWKAQIgAWoKEAMQBBAJEAoQBQ%3D%3D',
  CommunityPlaylists: 'EgeKAQQoAEABagoQAxAEEAkQChAF',
  FeaturedPlaylists: 'EgeKAQQoADgBagwQAxAOEAQQCRAFEAo%3D',
}
export type SearchType = keyof typeof SearchParams | 'TopResults'
export type ResultType =
  | 'Song'
  | 'Video'
  | 'Playlist'
  | 'Album'
  | 'Single'
  | 'Artist'
  | 'Station'

const getRawContents = (raw: any) =>
  raw?.contents?.tabbedSearchResultsRenderer?.tabs?.shift()?.tabRenderer
    ?.content?.sectionListRenderer?.contents

const getQueryCorrection = (raw: any[]): string | undefined => {
  const isCorrection = raw.shift()
  if (isCorrection?.itemSectionRenderer) {
    return joinRunsText(
      isCorrection.itemSectionRenderer.contents?.shift()
        ?.showingResultsForRenderer?.correctedQuery,
    )
  }
  raw.unshift(isCorrection)
  return undefined
}

// eslint-disable-next-line complexity
const getRawType = (raw: any, searchType: SearchType): ResultType => {
  const getType = (rawType: any) => {
    const [, type] = rawType.musicResponsiveListItemRenderer.flexColumns
    return type?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.at(0)
      ?.text
  }

  switch (searchType) {
    case 'Songs':
      return 'Song'
    case 'Videos':
      return 'Video'
    case 'Albums':
      return 'Album'
    case 'Artists':
      return 'Artist'
    case 'CommunityPlaylists':
    case 'FeaturedPlaylists':
      return 'Playlist'
    case 'TopResults':
    default:
      return getType(raw)
  }
}

export const ytSearch = async (
  query: string,
  type: SearchType = 'TopResults',
) => {
  const originalQuery = query
  let searchAttempts = 0

  const tryToSearch = async (): Promise<any[]> => {
    if (searchAttempts > 3) {
      makeError(ytError.noContent)
    }

    const raw: any = await ytRequest('search', {
      query,
      params: SearchParams[type] || null, // null for top result
    })

    const rawContents = getRawContents(raw)
    const correctedQuery = getQueryCorrection(rawContents)

    if (correctedQuery) {
      searchAttempts += 1
      query = correctedQuery
      return tryToSearch()
    }

    return rawContents
  }

  const [topResult] = await tryToSearch()
  const rawContent = topResult?.musicShelfRenderer?.contents?.shift()

  if (!rawContent?.musicResponsiveListItemRenderer) {
    makeError(ytError.noContent)
  }
  const rawType = getRawType(rawContent, type)
  if (!rawType) {
    makeError(ytError.invalidQuery)
  }

  return {
    query: originalQuery,
    correctedQuery: query !== originalQuery ? query : undefined,
    rawType,
    rawContent: rawContent.musicResponsiveListItemRenderer,
  }
}
