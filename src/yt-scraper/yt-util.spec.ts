/* eslint-disable sonarjs/no-duplicate-string */
import { duration, ytUrl } from './yt-util'

describe('[Yt Util] Youtube URL', () => {
	let videoUrlWithPlaylistIdAndVideoId: string
	let videoUrlwithVideoId: string
	let playlistUrl: string
	let channelUrl: string
	beforeAll(() => {
		videoUrlWithPlaylistIdAndVideoId =
			'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLx0sYbCqOb8TBPRdmB3TcjP8fZL2wBg9A'
		videoUrlwithVideoId = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		playlistUrl =
			'https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmB3TcjP8fZL2wBg9A'
		channelUrl = 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ'
	})

	it('it defined', () => {
		expect(ytUrl).toBeDefined()
	})

	it('can define a valid youtube url', () => {
		expect(ytUrl.isYtUrl(videoUrlwithVideoId)).toBe(true)
		expect(ytUrl.isYtUrl(videoUrlWithPlaylistIdAndVideoId)).toBe(true)
		expect(ytUrl.isYtUrl(channelUrl)).toBe(true)
		expect(ytUrl.isYtUrl(playlistUrl)).toBe(true)
	})

	it('can define an invalid youtube url', () => {
		const url = 'http://google.com'
		const url2 = 'invalid youtube url'
		const url3 = 'song title example'

		expect(ytUrl.isYtUrl(url)).toBe(false)
		expect(ytUrl.isYtUrl(url2)).toBe(false)
		expect(ytUrl.isYtUrl(url3)).toBe(false)
	})

	it('must returns a valid youtube video id', () => {
		expect(ytUrl.getId(videoUrlwithVideoId).id).toBe('dQw4w9WgXcQ')
		expect(ytUrl.getId(videoUrlWithPlaylistIdAndVideoId).playlistId).toBe(
			'PLx0sYbCqOb8TBPRdmB3TcjP8fZL2wBg9A'
		)
		expect(ytUrl.getId(channelUrl).id).toBe('UC-9-kyTW8ZkZNDHQJ6FgpwQ')
		expect(ytUrl.getId(playlistUrl).playlistId).toBe(
			'PLx0sYbCqOb8TBPRdmB3TcjP8fZL2wBg9A'
		)
	})

	it('must returns a valid youtube url type', () => {
		expect(ytUrl.getId(videoUrlwithVideoId).type).toBe('songOrPlaylist')
		expect(ytUrl.getId(videoUrlWithPlaylistIdAndVideoId).type).toBe(
			'songOrPlaylist'
		)
		expect(ytUrl.getId(channelUrl).type).toBe('channel')
		expect(ytUrl.getId(playlistUrl).type).toBe('songOrPlaylist')
	})
})
describe('[Yt Util] Duration string to milliseconds', () => {
	it('it defined', () => {
		expect(duration.parseMs).toBeDefined()
	})
	it('can convert duration string to millisecons', () => {
		const hms = duration.parseMs('1.23.45')
		const ms = duration.parseMs('23.45')
		const s = duration.parseMs('45')

		expect(hms).toStrictEqual(5025000)
		expect(ms).toStrictEqual(1425000)
		expect(s).toStrictEqual(45000)
	})
	it('return a valid duration in milliseconds', () => {
		// arrange
		const incorrectDuration = 'aaa.aa.aa'
		const correctDuration = '1:23:45'

		// acts
		const parseIncorrect = duration.parseMs(incorrectDuration)
		const parseCorrect = duration.parseMs(correctDuration)

		// assert
		expect(parseIncorrect).toStrictEqual(0)
		expect(parseCorrect).toStrictEqual(5025000)
	})
})
describe('[Yt Util] Milliseconds to duration string', () => {
	it('it defined', () => {
		expect(duration.toString).toBeDefined()
	})
	it('can convert duration in millisecons to formatted string', () => {
		// arrange
		const durationHms = 5025000
		const durationMs = 1425000
		const durationS = 45000

		// act
		const formattedHms = duration.toString(durationHms)
		const formattedMs = duration.toString(durationMs)
		const formattedS = duration.toString(durationS)

		// assert
		expect(formattedHms).toStrictEqual('01:23:45')
		expect(formattedMs).toStrictEqual('23:45')
		expect(formattedS).toStrictEqual('00:45')
	})
})
