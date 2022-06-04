import { searchAlbum } from './search-album'

describe('searchAlbum', () => {
	it('it defined', () => {
		expect(searchAlbum).toBeDefined()
	})
	it('can search top result', async () => {
		const response = await searchAlbum('one more light')
		expect(response.album).toBeDefined()
	})
})
