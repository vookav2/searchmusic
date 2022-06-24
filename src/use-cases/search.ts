/* eslint-disable no-case-declarations */
import { Album, Channel, Playlist, Song } from '../entities'
import {
  makePlaylistFunc,
  mapNavigationEndpoint,
  ytSearch,
} from '../yt-scraper'

import { albumMapping } from './search-album'
import { channelMapping } from './search-artist'
import { songMapping } from './search-song'

type SearchResult = Song | Album | Channel | Playlist
type SearchInfo = {
  type: SearchResult['type'] | 'Unknown'
  query: string
  correctedQuery: string | undefined
}
export type SearchReponse = {
  search: SearchInfo
  result: SearchResult | undefined
}
const playlistMapping = async (raw: any): Promise<Playlist> => {
  const playlistParams = {
    videoId: undefined,
    params: undefined,
    playlistId: undefined,
  }
  if (raw.playlistItemData) {
    playlistParams.videoId = raw.playlistItemData.videoId
  } else {
    const [shufflePlay] = raw.menu.menuRenderer.items
    const params = mapNavigationEndpoint(
      shufflePlay?.menuNavigationItemRenderer?.navigationEndpoint,
    )
    Object.assign(playlistParams, params)
  }
  return makePlaylistFunc(playlistParams)()
}

// eslint-disable-next-line complexity
export const search = async (query: string): Promise<SearchReponse> => {
  const { rawContent, rawType, correctedQuery } = await ytSearch(
    query,
    'TopResults',
  )
  const searchInfo: SearchInfo = {
    type: rawType as SearchInfo['type'],
    query,
    correctedQuery,
  }
  let playlist: Playlist | undefined
  switch (rawType) {
    case 'Song':
      return { search: searchInfo, result: songMapping(rawContent) }
    case 'Single':
    case 'Album':
      return { search: searchInfo, result: albumMapping(rawContent) }
    case 'Artist':
      searchInfo.type = 'Channel'
      return { search: searchInfo, result: channelMapping(rawContent) }
    case 'Video':
    case 'Station':
    case 'Playlist':
      searchInfo.type = 'Playlist'
      playlist = await playlistMapping(rawContent)
      return { search: searchInfo, result: playlist }
    default:
      searchInfo.type = 'Unknown'
      return { search: searchInfo, result: undefined }
  }
}
