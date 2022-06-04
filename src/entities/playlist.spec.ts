import { makeFakePlaylist } from '../__test__/fixtures/make-fake-playlist'
import { makeFakeSong } from '../__test__/fixtures/make-fake-song'
import { makePlaylist } from './playlist'
import { ytError } from '../yt-scraper'

describe('makePlaylist', () => {
	it('it defined', () => {
		expect(makePlaylist).toBeDefined()
	})
	it('must have a playlist id', () => {
		const fakePlaylist = makeFakePlaylist({ playlistId: undefined })
		expect(() => makePlaylist(fakePlaylist)).toThrow(ytError.noContent)
	})
	it('must have a playlist title', () => {
		const fakePlaylist = makeFakePlaylist({ playlistTitle: undefined })
		expect(() => makePlaylist(fakePlaylist)).toThrow(ytError.noContent)
	})
	it('must have a length', () => {
		const fakePlaylist = makeFakePlaylist({ length: undefined })
		expect(() => makePlaylist(fakePlaylist)).toThrow(ytError.noContent)
	})
	it('must have a songs', () => {
		const fakePlaylist = makeFakePlaylist({ songs: undefined })
		expect(() => makePlaylist(fakePlaylist)).toThrow(ytError.noContent)
	})
	it('can have a playlist id', () => {
		const fakePlaylist = makeFakePlaylist({ playlistId: 'id' })
		expect(makePlaylist(fakePlaylist).playlistId).toBe('id')
	})
	it('can have a playlist title', () => {
		const fakePlaylist = makeFakePlaylist({ playlistTitle: 'title' })
		expect(makePlaylist(fakePlaylist).playlistTitle).toBe('title')
	})
	it('can have a length', () => {
		const fakePlaylist = makeFakePlaylist({ length: 5 })
		const playlist = makePlaylist(fakePlaylist)
		expect(typeof playlist.length).toBe('number')
		expect(playlist.length).toBe(5)
	})
	it('can have songs', () => {
		const fakePlaylist = makeFakePlaylist({ songs: [makeFakeSong()] })
		const playlist = makePlaylist(fakePlaylist)
		expect(playlist.songs).toBeDefined()
		expect(playlist.songs.length > 0).toBeTruthy()
	})
	it('must have a valid hash', () => {
		const fakePlaylist = makeFakePlaylist({
			playlistId: 'id',
			playlistTitle: 'title',
		})
		const playlist = makePlaylist(fakePlaylist)
		expect(playlist.hash).toBe('e161f011e3dcd8c5193ad862b955740b')
	})
})
