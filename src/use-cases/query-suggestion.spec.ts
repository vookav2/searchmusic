import { querySuggestion } from './query-suggestion'

describe('querySuggestion', () => {
	it('it defined', () => {
		expect(querySuggestion).toBeDefined()
	})
	it('can suggest that related with query', async () => {
		const response = await querySuggestion('test')
		expect(response.original).toBe('test')
		expect(response.suggestions.length).toBeGreaterThanOrEqual(1)
	})
})
