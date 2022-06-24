import { Song } from '../../entities'
import { makeFakeAlbum } from './make-fake-album'
import { makeFakeChannel } from './make-fake-channel'
import { makeFakePlaylist } from './make-fake-playlist'

export const makeFakeSong = (fakeParams?: Partial<Song>) => {
  const fakeChannel = makeFakeChannel()
  const fakeAlbum = makeFakeAlbum()
  const fakeSong = {
    id: 'fake-song-id',
    title: 'fake-song-title',
    url: 'fake-song-url',
    hash: 'fake-song-hash',
    channel: {
      id: fakeChannel.id,
      name: fakeChannel.name,
    },
    album: {
      id: fakeAlbum.id,
      title: fakeAlbum.title,
    },
    explicit: false,
    selected: false,
    durationMiliseconds: 0,
    durationString: '0:0',
    thumbnail: 'fake-song-thumbnail',
    getPlaylist: () => Promise.resolve(makeFakePlaylist()),
  }

  return {
    ...fakeSong,
    ...fakeParams,
  }
}
