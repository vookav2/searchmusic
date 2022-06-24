import { hashMd5, safety } from '../utils'

import { Playlist } from './playlist'
import { ytError } from '../yt-scraper'

export type Channel = {
  type: 'Channel'
  id: string
  name: string
  url: string
  thumbnail: string
  hash: string
  getPlaylist: () => Promise<Playlist>
}

export const makeChannel = ({
  id,
  name,
  thumbnail,
  getPlaylist,
}: Partial<Omit<Channel, 'hash' | 'url' | 'type'>>): Channel => ({
  type: 'Channel',
  id: safety(id).required(ytError.noContent),
  name: safety(name).required(ytError.noContent),
  url: `https://music.youtube.com/channel/${id}`,
  hash: hashMd5(`${id}${name}`),
  thumbnail: safety(thumbnail).required(ytError.noContent),
  getPlaylist: safety(getPlaylist).undefined(ytError.noContent),
})
