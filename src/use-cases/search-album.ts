import {
  joinRunsText,
  makePlaylistFunc,
  mapBrowseId,
  mapNavigationEndpoint,
  mapThumbnail,
  ytSearch,
} from '../yt-scraper'

import { makeAlbum } from '../entities'

export const albumMapping = (raw: any) => {
  const [rawTitle, secondColumns] = raw.flexColumns
  const [, , rawArtist] =
    secondColumns.musicResponsiveListItemFlexColumnRenderer.text.runs
  const [rawPlayShuffle] = raw.menu.menuRenderer.items
  const playlistEndpoint = mapNavigationEndpoint(
    rawPlayShuffle?.menuNavigationItemRenderer?.navigationEndpoint,
  )
  return makeAlbum({
    id: mapBrowseId(raw),
    title: joinRunsText(
      rawTitle?.musicResponsiveListItemFlexColumnRenderer?.text,
    ),
    explicit: raw.badges !== undefined,
    thumbnail: mapThumbnail(raw.thumbnail),
    channel: {
      id: mapBrowseId(rawArtist),
      name: rawArtist.text,
    },
    getPlaylist: makePlaylistFunc({
      params: playlistEndpoint.params,
      playlistId: playlistEndpoint.playlistId,
    }),
  })
}

export const searchAlbum = async (title: string) => {
  const result = await ytSearch(title, 'Albums')
  const album = albumMapping(result.rawContent)
  return {
    search: {
      type: result.rawType,
      query: result.query,
      correctedQuery: result.correctedQuery,
    },
    album: album,
  }
}
