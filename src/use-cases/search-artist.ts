import {
	joinRunsText,
	makePlaylistFunc,
	mapBrowseId,
	mapNavigationEndpoint,
	mapThumbnail,
	ytSearch,
} from '../yt-scraper'

import { makeChannel } from '../entities'

export const channelMapping = (raw: any) => {
	const [playShuffle] = raw.menu.menuRenderer.items
	const { videoId, playlistId, params } = mapNavigationEndpoint(
		playShuffle?.menuNavigationItemRenderer?.navigationEndpoint
	)
	const [rawArtist] = raw.flexColumns
	return makeChannel({
		id: mapBrowseId(raw),
		name: joinRunsText(
			rawArtist?.musicResponsiveListItemFlexColumnRenderer?.text
		),
		thumbnail: mapThumbnail(raw.thumbnail),
		getPlaylist: makePlaylistFunc({ videoId, playlistId, params }),
	})
}

export const searchArtist = async (name: string) => {
	const result = await ytSearch(name, 'Artists')
	const channel = channelMapping(result.rawContent)
	return {
		search: {
			type: result.rawType,
			query: result.query,
			correctedQuery: result.correctedQuery,
		},
		artist: channel,
	}
}
