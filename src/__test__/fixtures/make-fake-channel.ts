import { Channel } from '../../entities'
import { makeFakePlaylist } from './make-fake-playlist'

export const makeFakeChannel = (fakeParams?: Partial<Channel>) => {
	const fakeChannel = {
		id: 'fake-channel-id',
		name: 'fake-channel-name',
		url: 'fake-channel-url',
		thumbnail: 'fake-channel-thumbnail',
		hash: 'fake-channel-hash',
		getPlaylist: () => Promise.resolve(makeFakePlaylist()),
	}

	return {
		...fakeChannel,
		...fakeParams,
	}
}
