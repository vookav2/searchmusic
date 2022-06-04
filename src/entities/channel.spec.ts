import { makeChannel } from './channel'
import { makeFakeChannel } from '../__test__/fixtures/make-fake-channel'
import { makeFakePlaylist } from '../__test__/fixtures/make-fake-playlist'
import { ytError } from '../yt-scraper'

describe('makeChannel', () => {
	it('it defined', () => {
		expect(makeChannel).toBeDefined()
	})
	it('must have an id', () => {
		const fakeChannel = makeFakeChannel({ id: undefined })
		expect(() => makeChannel(fakeChannel)).toThrow(ytError.noContent)
	})
	it('must have a name', () => {
		const fakeChannel = makeFakeChannel({ name: undefined })
		expect(() => makeChannel(fakeChannel)).toThrow(ytError.noContent)
	})
	it('must have a thumbnail', () => {
		const fakeChannel = makeFakeChannel({ thumbnail: undefined })
		expect(() => makeChannel(fakeChannel)).toThrow(ytError.noContent)
	})
	it('must have an get playlist function', () => {
		const fakeChannel = makeFakeChannel({ getPlaylist: undefined })
		expect(() => makeChannel(fakeChannel)).toThrow(ytError.noContent)
	})
	it('can have an id', () => {
		const fakeChannel = makeFakeChannel({ id: 'id' })
		expect(makeChannel(fakeChannel).id).toBe('id')
	})
	it('can have a name', () => {
		const fakeChannel = makeFakeChannel({ name: 'name' })
		expect(makeChannel(fakeChannel).name).toBe('name')
	})
	it('can have a thumbnail', () => {
		const fakeChannel = makeFakeChannel({ thumbnail: 'thumbnail' })
		expect(makeChannel(fakeChannel).thumbnail).toBe('thumbnail')
	})
	it('can have a get playlist function', () => {
		const fakeChannel = makeFakeChannel({
			getPlaylist: () => Promise.resolve(makeFakePlaylist()),
		})
		expect(makeChannel(fakeChannel).getPlaylist).toBeDefined()
	})
	it('have a valid url', () => {
		const fakeChannel = makeFakeChannel({
			id: 'fake-channel-id',
		})
		expect(makeChannel(fakeChannel).url).toBe(
			'https://music.youtube.com/channel/fake-channel-id'
		)
	})
	it('have a valid hash', () => {
		const fakeChannel = makeFakeChannel({
			id: 'fake-channel-id',
			name: 'fake-channel-name',
		})
		expect(makeChannel(fakeChannel).hash).toBe(
			'149e53684f977d28eb03f9974698085f'
		)
	})
})
