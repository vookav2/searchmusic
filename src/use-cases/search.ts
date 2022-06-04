import { Album, Channel, Song } from '../entities'
import { ResultType, ytSearch } from '../yt-scraper'
import { searchSong, songMapping } from './search-song'

import { albumMapping } from './search-album'
import { channelMapping } from './search-artist'

export type SearchResult = {
	search: {
		type: ResultType
		query: string
		correctedQuery: string | undefined
	}
	result: Song | Album | Channel | undefined
}

// eslint-disable-next-line complexity
export const search = async (query: string): Promise<SearchResult> => {
	const response = await ytSearch(query, 'TopResults')
	const searchInfo = {
		type: response.rawType,
		query: response.query,
		correctedQuery: response.correctedQuery,
	}
	switch (response.rawType) {
		case 'Video':
			// eslint-disable-next-line no-case-declarations
			const resultSong = await searchSong(
				response.correctedQuery ?? response.query
			)
			return {
				search: resultSong.search,
				result: resultSong.song,
			}
		case 'Song':
			return { search: searchInfo, result: songMapping(response.rawContent) }
		case 'Single':
		case 'Album':
			return { search: searchInfo, result: albumMapping(response.rawContent) }
		case 'Artist':
			return { search: searchInfo, result: channelMapping(response.rawContent) }
		case 'Playlist':
		default:
			return { search: searchInfo, result: undefined }
	}
}
