import { search } from './search'

describe('search top result', () => {
	it('it defined', () => {
		expect(search).toBeDefined()
	})
	it('can search top result', async () => {
		const response = await search('one more light')
		expect(response.result).toBeDefined()
	})
})
