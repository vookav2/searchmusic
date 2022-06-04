/* eslint-disable complexity */
import { makeError, ytError } from './yt-error'
import { makePlaylist, makeSong } from '../entities'

import { joinRunsText } from './yt-util'
import { safety } from '../utils'
import { ytBrowseRequest } from './yt-browse'
import { ytRequest } from './yt-request'

const getTabsContent = (raw: any): any =>
	raw?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer
		?.watchNextTabbedResultsRenderer?.tabs
const getUpnextContent = (raw: any): any =>
	raw?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer
const itHasPreview = (raw: any[]): number =>
	raw.findIndex((x) => x.automixPreviewVideoRenderer)
// const getPreviewPlaylistId = (raw: any[], index: number): any =>
// 	raw?.at(index)?.automixPreviewVideoRenderer?.content
// 		?.automixPlaylistVideoRenderer?.navigationEndpoint?.watchPlaylistEndpoint
// 		?.playlistId
// const getLyricsBrowseId = (raw: any): any =>
// 	raw?.tabRenderer?.endpoint?.browseEndpoint?.browseId
const getContinuationToken = (raw: any): string =>
	raw?.continuations?.shift()?.nextRadioContinuationData?.continuation

const makeLyricsFunc =
	(browseId: string): (() => Promise<string>) =>
	async () => {
		const result = await ytBrowseRequest(browseId, 'Lyrics')
		if (result.type !== 'Lyrics') {
			makeError(ytError.noContent)
		}
		return safety<string>(result.rawContent).required(ytError.noContent)
	}

const songMapping = (raw: any) => {
	const content = raw?.playlistPanelVideoRenderer
	const [artist, , album] = content.longBylineText.runs
	const newSong = makeSong({
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
		// nextParams: {
		// 	index: endpoint.index,
		// 	params: endpoint.params,
		// 	videoId: endpoint.videoId,
		// 	playlistId: endpoint.playlistId,
		// 	playlistSetVideoId: endpoint.playlistSetVideoId,
		// },
		durationString: joinRunsText(content.lengthText),
		getPlaylist: makePlaylistFunc({
			videoId: content.videoId,
			playlistId: `RDAMVM${content.videoId}`,
			params: 'wAEB',
		}),
	})

	if (raw.rawLyrics) {
		const lyricsBrowseId =
			raw.rawLyrics.tabRenderer.endpoint.browseEndpoint.browseId
		newSong.getLyrics = makeLyricsFunc(lyricsBrowseId)
	}

	return newSong
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

	const [rawUpNext, rawLyrics] = safety(getTabsContent(raw)).required(
		ytError.noContent
	)
	const rawUpNextContent = getUpnextContent(rawUpNext)
	if (!rawUpNextContent) {
		// either no content or no upnext (play next song index)
		makeError(ytError.noContent)
	}

	if (rawLyrics) {
		const firstContent = rawUpNextContent.contents.shift()
		firstContent.rawLyrics = rawLyrics
		rawUpNextContent.contents.unshift(firstContent)
	}

	const previewIndex = itHasPreview(rawUpNextContent.contents)
	if (previewIndex !== -1) {
		rawUpNextContent.contents.splice(previewIndex, 1)
	}

	const playlistTitle =
		joinRunsText(rawUpNextContent?.shortBylineText) +
		` (${rawUpNextContent.title})`
	const isInfinite = rawUpNextContent.isInfinite
	if (isInfinite) {
		token = getContinuationToken(rawUpNextContent)
	}

	return {
		playlistId: rawUpNextContent.playlistId,
		playlistTitle,
		isInfinite: isInfinite,
		token,
		length: rawUpNextContent.numItemsToShow ?? rawUpNextContent.contents.length,
		songs: rawUpNextContent.contents.map(songMapping),
	}
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
}: PlaylistParams) => {
	if (!videoId && !playlistId) {
		makeError(ytError.invalidPlaylistParams)
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
