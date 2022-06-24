import { hashMd5, safety } from '../utils'

import { Song } from './song'
import { ytError } from '../yt-scraper'

export type Playlist = {
  type: 'Playlist'
  playlistId: string
  playlistTitle: string
  isInfinite: boolean
  token?: string
  hash: string
  length: number
  songs: Song[]
}

export const makePlaylist = ({
  playlistId,
  playlistTitle,
  isInfinite,
  token,
  length,
  songs,
}: Partial<Omit<Playlist, 'hash' | 'playlist'>>): Playlist => {
  const makeHash = (): string => hashMd5(`${playlistId}${playlistTitle}`)
  return {
    type: 'Playlist',
    playlistId: safety(playlistId).required(ytError.noContent),
    playlistTitle: safety(playlistTitle).required(ytError.noContent),
    isInfinite: isInfinite ?? false,
    token,
    hash: makeHash(),
    length: safety(length).required(ytError.noContent),
    songs: safety(songs).required(ytError.noContent),
  }
}
