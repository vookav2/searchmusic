import { ytSuggestion } from './yt-search-suggestion'

describe('Yt Suggestion', () => {
	it('it defined', () => {
		expect(ytSuggestion).toBeDefined()
	})

	it('can get suggestion', async () => {
		const query = 'lali janjinee'
		const res = await ytSuggestion(query)

		expect(res.original).toBe(query)
		expect(res.suggestions).toBeDefined()
		expect(res.suggestions.length).toBeGreaterThan(0)
	})

	it('must throw an error when query is empty', async () => {
		const query = ''
		await expect(ytSuggestion(query)).rejects.toThrow()
	})
})
