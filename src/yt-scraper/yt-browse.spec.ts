import { mapNavigationEndpoint } from './yt-util'
import { ytBrowseRequest } from './yt-browse'
import { ytError } from './yt-error'

describe('Yt Browse Request', () => {
	it('it defined', () => {
		expect(ytBrowseRequest).toBeDefined()
	})
	it('must have an id when try to browse a lyrics', async () => {
		await expect(ytBrowseRequest('', 'Lyrics')).rejects.toThrow(
			ytError.noContent
		)
	})
	it('must have an id when try to browse a channel', async () => {
		await expect(ytBrowseRequest('', 'Channel')).rejects.toThrow(
			ytError.noContent
		)
	})
	it('can browse a channel', async () => {
		const response = await ytBrowseRequest(
			'UCxgN32UVVztKAQd2HkXzBtw',
			'Channel'
		)
		const endpoint = mapNavigationEndpoint(
			response.rawContent?.playButton?.buttonRenderer?.navigationEndpoint
		)
		expect(response.type).toBe('Channel')
		expect(endpoint.params).toBeDefined()
		expect(endpoint.playlistId).toBeDefined()
		expect(endpoint.videoId).toBeDefined()
	})
	it('can browse a lyrics', async () => {
		const response = await ytBrowseRequest('MPLYt_ZrU0BSKAZdU', 'Lyrics')
		expect(response.type).toBe('Lyrics')
		expect(typeof response.rawContent).toBe('string')
	})
})
