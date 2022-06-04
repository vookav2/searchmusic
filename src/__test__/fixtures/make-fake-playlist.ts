import { Playlist } from '../../entities'
import { makeFakeSong } from './make-fake-song'

export const makeFakePlaylist = (fakeParams?: Partial<Playlist>) => {
	const fakePlaylist = {
		playlistId: 'fake-playlist-id',
		playlistTitle: 'fake-playlist-title',
		isInfinite: false,
		token: 'fake-playlist-token',
		hash: 'fake-playlist-hash',
		length: 1,
		songs: [makeFakeSong()],
	}

	return {
		...fakePlaylist,
		...fakeParams,
	}
}
