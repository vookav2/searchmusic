import {
	makeError,
	makePlaylistFunc,
	mapNavigationEndpoint,
	ytBrowseRequest,
	ytError,
	ytUrl,
} from '../yt-scraper'

const getPlaylistFromChannel = async (channelId: string | undefined) => {
	if (!channelId) {
		throw new Error(ytError.invalidUrl)
	}

	const response = await ytBrowseRequest(channelId, 'Channel')
	const endpoint = mapNavigationEndpoint(
		response.rawContent.playButton.buttonRenderer.navigationEndpoint
	)
	const getPlaylist = makePlaylistFunc(endpoint)

	return getPlaylist()
}

export const getPlaylistFromUrl = async (query: string) => {
	if (!ytUrl.isYtUrl(query)) {
		makeError(ytError.invalidQuery)
	}

	const ytId = ytUrl.getId(query)
	switch (ytId.type) {
		case 'channel':
			return getPlaylistFromChannel(ytId.id)
		case 'songOrPlaylist':
			return makePlaylistFunc({
				videoId: ytId.id,
				playlistId: ytId.playlistId,
			})()
		default:
			throw new Error(ytError.invalidUrl)
	}
}
