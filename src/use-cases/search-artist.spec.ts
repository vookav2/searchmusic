import { searchArtist } from './search-artist'

describe('searchArtist', () => {
	it('it defined', () => {
		expect(searchArtist).toBeDefined()
	})
	it('can search top result', async () => {
		const response = await searchArtist('one more light')
		expect(response.artist).toBeDefined()
	})
})
