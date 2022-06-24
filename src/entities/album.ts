import { hashMd5, safety } from '../utils'

import { Channel } from './channel'
import { Playlist } from './playlist'
import { ytError } from '../yt-scraper'

export type Album = {
  type: 'Album'
  id: string
  title: string
  thumbnail: string
  explicit: boolean
  hash: string
  channel: Pick<Channel, 'id' | 'name'>
  getPlaylist: () => Promise<Playlist>
}

export const makeAlbum = ({
  id,
  thumbnail,
  explicit,
  title,
  channel,
  getPlaylist,
}: Partial<Omit<Album, 'hash' | 'type'>>): Album => ({
  type: 'Album',
  id: safety(id).required(ytError.noContent),
  title: safety(title).required(ytError.noContent),
  channel: safety(channel).required(ytError.noContent),
  thumbnail: safety(thumbnail).required(ytError.noContent),
  explicit: explicit ?? false,
  hash: hashMd5(`${id}${title}`),
  getPlaylist: safety(getPlaylist).undefined(ytError.noContent),
})
