import { Album } from '../../entities'
import { makeFakeChannel } from './make-fake-channel'
import { makeFakePlaylist } from './make-fake-playlist'

export const makeFakeAlbum = (fakeParams?: Partial<Album>) => {
	const fakeChannel = makeFakeChannel()
	const fakeAlbum = {
		id: 'fake-album-id',
		title: 'fake-album-title',
		thumbnail: 'fake-album-thumbnail',
		explicit: false,
		channel: {
			id: fakeChannel.id,
			name: fakeChannel.name,
		},
		getPlaylist: () => Promise.resolve(makeFakePlaylist()),
	}

	return {
		...fakeAlbum,
		...fakeParams,
	}
}
