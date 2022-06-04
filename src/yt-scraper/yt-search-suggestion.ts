/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeError, ytError } from './yt-error'

import { safety } from '../utils'
import { ytRequest } from './yt-request'

const getContents = (raw: any): any[] =>
	raw?.searchSuggestionsSectionRenderer?.contents
const getSuggestion = (raw: any): any =>
	raw?.searchSuggestionRenderer?.suggestion?.runs?.map((x) => x?.text).join('')

export const ytSuggestion = async (query: string) => {
	const raw: any = await ytRequest('music/get_search_suggestions', {
		input: query,
	})
	const rawContents: any[] = safety(raw?.contents).required(ytError.noContent)
	if (!rawContents.length) {
		makeError(ytError.noContent)
	}
	const contents: any = safety(getContents(rawContents.shift())).required(
		ytError.noContent
	)
	if (!contents.length) {
		makeError(ytError.noContent)
	}
	return {
		original: query,
		suggestions: contents.map(getSuggestion) as string[],
	}
}
