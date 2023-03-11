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
  let title: any = undefined
  let channel: any = undefined

  if (raw.flexColumns) {
    const [rawTitle, secondColumns] = raw.flexColumns
    const [, , rawArtist] =
      secondColumns.musicResponsiveListItemFlexColumnRenderer.text.runs

    title = joinRunsText(
      rawTitle?.musicResponsiveListItemFlexColumnRenderer?.text,
    )
    channel = {
      id: mapBrowseId(rawArtist),
      name: rawArtist.text,
    }
  } else {
    const [, , rawArtist] = raw.subtitle.runs
    title = joinRunsText(raw.title)
    channel = {
      id: mapBrowseId(rawArtist),
      name: rawArtist.text,
    }
  }

  const [rawPlayShuffle] = raw.menu.menuRenderer.items
  const playlistEndpoint = mapNavigationEndpoint(
    rawPlayShuffle?.menuNavigationItemRenderer?.navigationEndpoint,
  )
  return makeAlbum({
    id: mapBrowseId(raw),
    title,
    explicit: (raw.badges || raw.subtitleBadges) !== undefined,
    thumbnail: mapThumbnail(raw.thumbnail),
    channel,
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
