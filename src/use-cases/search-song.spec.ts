import { searchSong } from './search-song'

describe('searchSong', () => {
	it('it defined', () => {
		expect(searchSong).toBeDefined()
	})
	it('can search top result', async () => {
		const response = await searchSong('one more light')
		expect(response.song).toBeDefined()
	})
})
