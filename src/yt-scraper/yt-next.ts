import { Playlist, makePlaylist, makeSong } from '../entities'
import { joinRunsText, mapNavigationEndpoint } from './yt-util'
/* eslint-disable complexity */
import { makeError, ytError } from './yt-error'

import { safety } from '../utils'
import { ytRequest } from './yt-request'

const getTabsContent = (raw: any): any =>
  raw?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer
    ?.watchNextTabbedResultsRenderer?.tabs
const getUpnextContent = (raw: any): any =>
  raw?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer
const itHasPreview = (raw: any[]): number =>
  raw.findIndex(x => x.automixPreviewVideoRenderer)
const getPreviewPlaylistParams = (
  raw: any[],
  index: number,
): PlaylistParams => {
  const { navigationEndpoint } =
    raw[index].automixPreviewVideoRenderer.content.automixPlaylistVideoRenderer
  return mapNavigationEndpoint(navigationEndpoint)
}
const getContinuationToken = (raw: any): string =>
  raw?.continuations?.shift()?.nextRadioContinuationData?.continuation

// const getLyricsBrowseId = (raw: any): any =>
// 	raw?.tabRenderer?.endpoint?.browseEndpoint?.browseId

// const makeLyricsFunc = (browseId: string) => async () => {
//   const result = await ytBrowseRequest(browseId, 'Lyrics')
//   if (result.type !== 'Lyrics') {
//     makeError(ytError.noContent)
//   }
//   const lyrics = safety<string>(result.rawContent).required(ytError.noContent)
//   return {
//     lyrics,
//     source: {
//       name: 'Youtube Lyrics',
//       url: undefined,
//     },
//   }
// }

const songMapping = (raw: any) => {
  const content = raw?.playlistPanelVideoRenderer
  const [artist, , album] = content.longBylineText.runs
  return makeSong({
    id: content.videoId,
    title: joinRunsText(content.title),
    album: {
      id: album?.navigationEndpoint?.browseEndpoint?.browseId,
      title: album?.text,
    },
    channel: {
      id: artist?.navigationEndpoint?.browseEndpoint?.browseId,
      name: artist?.text,
    },
    explicit: content.badges !== undefined,
    selected: content.selected,
    thumbnail: content.thumbnail.thumbnails.pop().url,
    durationString: joinRunsText(content.lengthText),
    getPlaylist: makePlaylistFunc({
      videoId: content.videoId,
      playlistId: `RDAMVM${content.videoId}`,
      params: 'wAEB',
    }),
    // nextParams: {
    // 	index: endpoint.index,
    // 	params: endpoint.params,
    // 	videoId: endpoint.videoId,
    // 	playlistId: endpoint.playlistId,
    // 	playlistSetVideoId: endpoint.playlistSetVideoId,
    // },
  })
}

const mergeNextPlaylists = (
  nextPlaylist: Partial<Omit<Playlist, 'hash'>>,
  previewPlaylist?: Partial<Omit<Playlist, 'hash'>>,
) => {
  if (!previewPlaylist) {
    return nextPlaylist
  }
  const { isInfinite, token, length, songs, playlistId } = previewPlaylist
  nextPlaylist.playlistId = playlistId
  nextPlaylist.playlistTitle = `Playlist mix - ${nextPlaylist.playlistTitle}`
  nextPlaylist.isInfinite = isInfinite
  nextPlaylist.token = token
  nextPlaylist.length = (nextPlaylist.length ?? 0) + (length ?? 0)
  nextPlaylist.songs?.push(...(songs ?? []))
  return nextPlaylist
}

type NextRequestParams = {
  videoId?: string
  playlistId?: string
  params?: string
  token?: string
}
export const ytNextRequest = async ({
  videoId,
  playlistId,
  params,
  token,
}: NextRequestParams) => {
  if (!videoId && !playlistId) {
    makeError(ytError.invalidPlaylistParams)
  }

  const raw: any = await ytRequest('next', {
    videoId: videoId ?? null,
    playlistId: playlistId ?? null,
    isAudioOnly: true,
    params: params ?? null,
    continuation: token || null,
    enablePersistentPlaylistPanel: true,
  })

  const [rawUpNext] = safety(getTabsContent(raw)).required(ytError.noContent)
  const rawUpNextContent = getUpnextContent(rawUpNext)
  if (!rawUpNextContent) {
    // either no content or no upnext (play next song index)
    makeError(ytError.noContent)
  }

  const previewIndex = itHasPreview(rawUpNextContent.contents)
  let previewPlaylist: Partial<Omit<Playlist, 'hash'>> | undefined
  if (previewIndex !== -1) {
    const { params, playlistId, videoId } = getPreviewPlaylistParams(
      rawUpNextContent.contents,
      previewIndex,
    )
    previewPlaylist = await ytNextRequest({ videoId, params, playlistId })
    rawUpNextContent.contents.splice(previewIndex, 1)
  }

  const playlistTitle =
    joinRunsText(rawUpNextContent?.shortBylineText) +
    ` (${rawUpNextContent.title})`
  const isInfinite = rawUpNextContent.isInfinite
  if (isInfinite) {
    token = getContinuationToken(rawUpNextContent)
  }

  const playlist = {
    playlistId: rawUpNextContent.playlistId,
    playlistTitle,
    isInfinite: isInfinite,
    token,
    length: rawUpNextContent.numItemsToShow ?? rawUpNextContent.contents.length,
    songs: rawUpNextContent.contents.map(songMapping),
  }
  return mergeNextPlaylists(playlist, previewPlaylist)
}

type PlaylistParams = {
  videoId?: string
  playlistId?: string
  params?: string
}

export const makePlaylistFunc = ({
  videoId,
  params,
  playlistId,
}: PlaylistParams): (() => Promise<Playlist>) => {
  if (!videoId && !playlistId) {
    makeError(ytError.invalidPlaylistParams)
  }
  if (!playlistId && videoId) {
    playlistId = `RDAMVM${videoId}`
  }
  if (playlistId && !params && playlistId.startsWith('RDAMVM')) {
    params = 'wAEB'
  }
  return async () => {
    const response = await ytNextRequest({
      videoId,
      playlistId,
      params,
    })
    return makePlaylist(response)
  }
}
