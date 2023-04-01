import {
  joinRunsText,
  makePlaylistFunc,
  mapBrowseId,
  mapNavigationEndpoint,
  mapThumbnail,
  ytSearch,
} from '../yt-scraper'

import { makeSong } from '../entities'

export const songMapping = (raw: any) => {
  const [rawTitle, secondColumn] = raw.flexColumns
    ? raw.flexColumns
    : [raw.title, raw.subtitle.runs]
  const rawDetail =
    secondColumn.musicResponsiveListItemFlexColumnRenderer?.text.runs ||
    secondColumn
  if (rawDetail.length > 5) {
    rawDetail.splice(0, 2)
  }
  const [rawArtist, , rawAlbum, , rawDuration] = rawDetail
  const { videoId, playlistId, params } =
    raw.overlay?.musicItemThumbnailOverlayRenderer?.content
      .musicPlayButtonRenderer?.playNavigationEndpoint.watchEndpoint ||
    mapNavigationEndpoint(
      raw.menu.menuRenderer.items.at(0)?.menuNavigationItemRenderer
        .navigationEndpoint,
    )
  const albumBrowseId = mapBrowseId(rawAlbum)
  return makeSong({
    id: videoId,
    title: joinRunsText(
      rawTitle.musicResponsiveListItemFlexColumnRenderer?.text || rawTitle,
    ),
    album: albumBrowseId
      ? {
          id: albumBrowseId,
          title: rawAlbum.text,
        }
      : undefined,
    channel: {
      id: mapBrowseId(rawArtist),
      name: rawArtist.text,
    },
    explicit: raw.badges !== undefined,
    selected: false,
    thumbnail: mapThumbnail(raw.thumbnail),
    durationString: rawDuration.text,
    getPlaylist: makePlaylistFunc({
      videoId,
      playlistId,
      params,
    }),
  })
}

export const searchSong = async (query: string) => {
  const result = await ytSearch(query, 'Songs')
  const song = songMapping(result.rawContent)
  return {
    search: {
      type: result.rawType,
      query: result.query,
      correctedQuery: result.correctedQuery,
    },
    song,
  }
}
