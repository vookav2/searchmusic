import { getPlaylistFromUrl } from './get-playlist-from-url'

describe('getPlaylistFromUrl', () => {
	it('it defined', () => {
		expect(getPlaylistFromUrl).toBeDefined()
	})
	it('can get playlist from channel url', async () => {
		const response = await getPlaylistFromUrl(
			'https://music.youtube.com/channel/UCxgN32UVVztKAQd2HkXzBtw'
		)
		expect(response).toBeDefined()
		expect(response.songs.length).toBeGreaterThan(0)
	})
	it('can get playlist from watch url', async () => {
		const response = await getPlaylistFromUrl(
			'https://music.youtube.com/watch?v=OplU67FMw5U&list=OLAK5uy_nBDTwlzvi_UHfDebhDAOgt1UWfGu69bpg'
		)
		expect(response).toBeDefined()
		expect(response.songs.length).toBeGreaterThan(0)
	})
})
