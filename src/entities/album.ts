import { Channel } from './channel'
import { Playlist } from './playlist'
import { safety } from '../utils'
import { ytError } from '../yt-scraper'

export type Album = {
	id: string
	title: string
	thumbnail: string
	explicit: boolean
	channel?: Pick<Channel, 'id' | 'name'>
	getPlaylist: () => Promise<Playlist>
}

export const makeAlbum = ({
	id,
	thumbnail,
	explicit,
	title,
	channel,
	getPlaylist,
}: Album): Album => ({
	id: safety(id).required(ytError.noContent),
	title: safety(title).required(ytError.noContent),
	channel: safety(channel).required(ytError.noContent),
	thumbnail: safety(thumbnail).required(ytError.noContent),
	explicit: explicit ?? false,
	getPlaylist: safety(getPlaylist).undefined(ytError.noContent),
})
