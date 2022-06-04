import { duration, ytError } from '../yt-scraper'
import { hashMd5, safety } from '../utils'
import songlyrics, { TLyrics } from 'songlyrics'

import { Album } from './album'
import { Channel } from './channel'
import { Playlist } from './playlist'

export type Song = {
	id: string
	title: string
	url: string
	hash: string
	channel: Pick<Channel, 'id' | 'name'>
	album?: Pick<Album, 'id' | 'title'>
	explicit: boolean
	durationMiliseconds: number
	durationString: string
	thumbnail: string
	selected: boolean
	getLyrics: () => Promise<string | TLyrics>
	getPlaylist: () => Promise<Playlist>
}

type SongParams = Omit<
	Song,
	'url' | 'hash' | 'getLyrics' | 'durationMiliseconds'
> & {
	// nextParams: {
	// 	index: number
	// 	params: string
	// 	videoId: string
	// 	playlistId: string
	// 	playlistSetVideoId: string
	// }
	getLyrics?: Song['getLyrics']
}
export const makeSong = ({
	id,
	title,
	album,
	channel,
	explicit,
	selected,
	thumbnail,
	durationString,
	getLyrics,
	getPlaylist,
}: SongParams): Song => {
	const lyricsFunc = async (): Promise<TLyrics> => {
		const query = `${title} ${channel.name}`
		const result = await songlyrics(query)
		return safety(result).undefined(ytError.noContent)
	}
	const durationMiliseconds = duration.parseMs(
		safety(durationString).required(ytError.noContent)
	)

	return {
		id: safety(id).required(ytError.noContent),
		title: safety(title).required(ytError.noContent),
		channel: safety(channel).required(ytError.noContent),
		album,
		explicit: explicit ?? false,
		selected: selected ?? false,
		thumbnail: safety(thumbnail).required(ytError.noContent),
		durationString: duration.toString(durationMiliseconds),
		durationMiliseconds,
		hash: hashMd5(id, title, channel.name),
		url: `https://music.youtube.com/watch?v=${id}`,
		getLyrics: getLyrics ?? lyricsFunc,
		getPlaylist: safety(getPlaylist).undefined(ytError.noContent),
	}
}
