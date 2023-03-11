import { ytError } from './yt-error'

/* eslint-disable complexity */
const YT_URL_REGEXP =
  /(?:music.|www.|m.|)(?:youtube.|youtube-nocookie.|youtu.)(?:com|be)\/(?:watch|embed|browse|playlist|channel|)/
// const YT_ARTIST_ID_REGEXP = /(UC)[\w-]{22}/
// const YT_PLAYLIST_ID_REGEXP = /((PL|UU|LL|RD|OL)[a-zA-Z0-9-_]{14,44})/
// const YT_ALBUM_ID_REGEXP = /((MPREb_)[a-zA-Z0-9-_]{11})/
// const YT_SONG_ID_REGEXP = /(?:\/|%3D|v=|vi=)([\w-]{11})(?:[%#?&]|$)/m

const isYtUrl = YT_URL_REGEXP.test.bind(YT_URL_REGEXP)
const getId = (
  url: string,
): {
  id: string | undefined
  playlistId: string | undefined
  type: 'channel' | 'songOrPlaylist'
} => {
  const newUrl = new URL(url)
  if (
    newUrl.pathname.includes('watch') ||
    newUrl.pathname.includes('playlist')
  ) {
    return {
      id: newUrl.searchParams.get('v') ?? undefined,
      playlistId: newUrl.searchParams.get('list') ?? undefined,
      type: 'songOrPlaylist',
    }
  }
  if (newUrl.pathname.includes('channel')) {
    return {
      id: newUrl.pathname.split('/')[2],
      playlistId: undefined,
      type: 'channel',
    }
  }
  throw new Error(ytError.invalidUrl)
}
export const ytUrl = {
  isYtUrl,
  getId,
}
const durationStringToMilliseconds = (duration: string): number => {
  // replacing dots with semi-colons
  duration = duration.replace(/\./g, ':')
  const splitted = duration.split(':').map(x => parseInt(x) ?? 0)
  let durationMs = 0
  switch (splitted.length) {
    case 3:
      durationMs = splitted[0] * 36e5 + splitted[1] * 6e4 + splitted[2] * 1e3
      break
    case 2:
      durationMs = splitted[0] * 6e4 + splitted[1] * 1e3
      break
    default:
      durationMs = splitted[0] * 1e3
      break
  }
  return isNaN(durationMs) ? 0 : durationMs
}
const millisecondsToDurationString = (duration: number): string => {
  duration /= 1000
  const floor = Math.floor
  const hours = floor(duration / 36e2)
  const minutes = floor((duration / 60) % 60)
    .toString()
    .padStart(2, '0')
  const seconds = floor(duration % 60)
    .toString()
    .padStart(2, '0')
  let result = `${minutes}:${seconds}`
  if (hours > 0) {
    result = `${hours.toString().padStart(2, '0')}:${result}`
  }
  return result
}
export const duration = {
  parseMs: durationStringToMilliseconds,
  toString: millisecondsToDurationString,
}

export const joinRunsText = (raw: any): string =>
  raw?.runs?.map((x: any) => x.text).join('')
export const mapBrowseId = (raw: any): string =>
  raw?.navigationEndpoint?.browseEndpoint?.browseId ||
  raw?.onTap?.browseEndpoint?.browseId
export const mapThumbnail = (raw: any): string =>
  raw?.musicThumbnailRenderer?.thumbnail?.thumbnails?.pop()?.url
export const mapNavigationEndpoint = (
  raw: any,
): {
  videoId: string | undefined
  params: string | undefined
  playlistId: string | undefined
} => {
  if (raw?.watchEndpoint) {
    return {
      videoId: raw.watchEndpoint.videoId,
      params: raw.watchEndpoint.params,
      playlistId: raw.watchEndpoint.playlistId,
    }
  } else if (raw?.watchPlaylistEndpoint) {
    return {
      videoId: undefined,
      params: raw.watchPlaylistEndpoint.params,
      playlistId: raw.watchPlaylistEndpoint.playlistId,
    }
  }

  return {
    videoId: undefined,
    params: undefined,
    playlistId: undefined,
  }
}
