import { makeAlbum } from './album'
import { makeFakeAlbum } from '../__test__/fixtures/make-fake-album'
import { makeFakeChannel } from '../__test__/fixtures/make-fake-channel'
import { makeFakePlaylist } from '../__test__/fixtures/make-fake-playlist'
import { ytError } from '../yt-scraper'

describe('makeAlbum', () => {
	it('it defined', () => {
		expect(makeAlbum).toBeDefined()
	})
	it('must have an id', () => {
		const fakeAlbum = makeFakeAlbum({ id: undefined })
		expect(() => makeAlbum(fakeAlbum)).toThrow(ytError.noContent)
	})
	it('must have a title', () => {
		const fakeAlbum = makeFakeAlbum({ title: undefined })
		expect(() => makeAlbum(fakeAlbum)).toThrow(ytError.noContent)
	})
	it('must have a thumbnail', () => {
		const fakeAlbum = makeFakeAlbum({ thumbnail: undefined })
		expect(() => makeAlbum(fakeAlbum)).toThrow(ytError.noContent)
	})
	it('must have a channel', () => {
		const fakeAlbum = makeFakeAlbum({ channel: undefined })
		expect(() => makeAlbum(fakeAlbum)).toThrow(ytError.noContent)
	})
	it('must have a get playlist function', () => {
		const fakeAlbum = makeFakeAlbum({ getPlaylist: undefined })
		expect(() => makeAlbum(fakeAlbum)).toThrow(ytError.noContent)
	})
	it('can have an id', () => {
		const fakeAlbum = makeFakeAlbum({ id: 'id' })
		expect(makeAlbum(fakeAlbum).id).toBe('id')
	})
	it('can have a title', () => {
		const fakeAlbum = makeFakeAlbum({ title: 'title' })
		expect(makeAlbum(fakeAlbum).title).toBe('title')
	})
	it('can have a thumbnail', () => {
		const fakeAlbum = makeFakeAlbum({ thumbnail: 'thumbnail' })
		expect(makeAlbum(fakeAlbum).thumbnail).toBe('thumbnail')
	})
	it('can have a channel', () => {
		const { id, name } = makeFakeChannel()
		const fakeAlbum = makeFakeAlbum({ channel: { id, name } })
		const album = makeAlbum(fakeAlbum)
		expect(album.channel).toBeDefined()
	})
	it('can have a get playlist function', () => {
		const fakeAlbum = makeFakeAlbum({
			getPlaylist: () => Promise.resolve(makeFakePlaylist()),
		})
		expect(makeAlbum(fakeAlbum).getPlaylist).toBeDefined()
	})
})
