import { ytSuggestion } from '../yt-scraper'

export const querySuggestion = async (query: string) =>
	await ytSuggestion(query)
