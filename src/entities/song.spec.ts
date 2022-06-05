/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeFakeAlbum } from '../__test__/fixtures/make-fake-album'
import { makeFakeChannel } from '../__test__/fixtures/make-fake-channel'
import { makeFakeLyrics } from '../__test__/fixtures/make-fake-lyrics'
import { makeFakePlaylist } from '../__test__/fixtures/make-fake-playlist'
import { makeFakeSong } from '../__test__/fixtures/make-fake-song'
import { makeSong } from './song'
import { ytError } from '../yt-scraper'

describe('makeSong', () => {
  it('it defined', () => {
    expect(makeSong).toBeDefined()
  })
  it('must have an id', () => {
    const fakeSong = makeFakeSong({ id: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('must have a title', () => {
    const fakeSong = makeFakeSong({ title: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('must have a channel', () => {
    const fakeSong = makeFakeSong({ channel: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('must have a thumbnail', () => {
    const fakeSong = makeFakeSong({ thumbnail: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('must have a duration string', () => {
    const fakeSong = makeFakeSong({ durationString: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('must have a get playlist function', () => {
    const fakeSong = makeFakeSong({ getPlaylist: undefined })
    expect(() => makeSong(fakeSong)).toThrow(ytError.noContent)
  })
  it('can have an id', () => {
    const fakeSong = makeFakeSong({ id: 'id' })
    expect(makeSong(fakeSong).id).toBe('id')
  })
  it('can have a title', () => {
    const fakeSong = makeFakeSong({ title: 'title' })
    expect(makeSong(fakeSong).title).toBe('title')
  })
  it('can have a channel', () => {
    const { id, name } = makeFakeChannel()
    const fakeSong = makeFakeSong({ channel: { id, name } })
    const song = makeSong(fakeSong)
    expect(song.channel).toBeDefined()
    expect(song.channel.id).toBeDefined()
    expect(song.channel.name).toBeDefined()
  })
  it('can have an album', () => {
    const { id, title } = makeFakeAlbum()
    const fakeSong = makeFakeSong({ album: { id, title } })
    const song = makeSong(fakeSong)
    expect(song.album).toBeDefined()
    expect(song.album!.id).toBeDefined()
    expect(song.album!.title).toBeDefined()
  })
  it('can have a thumbnail', () => {
    const fakeSong = makeFakeSong({ thumbnail: 'thumbnail' })
    expect(makeSong(fakeSong).thumbnail).toBe('thumbnail')
  })
  it('can have a get playlist function', async () => {
    const fakeSong = makeFakeSong({
      getPlaylist: () => Promise.resolve(makeFakePlaylist()),
    })
    const song = makeSong(fakeSong)
    expect(song.getPlaylist).toBeDefined()
    await expect(song.getPlaylist()).resolves.toBeDefined()
  })
  it('can have a get lyrics function', async () => {
    const songWithGetLyrics = makeSong(
      makeFakeSong({
        getLyrics: () => Promise.resolve(makeFakeLyrics()),
      }),
    )
    const songWithoutGetlyrics = makeSong(
      makeFakeSong({
        getLyrics: undefined,
      }),
    )
    expect(songWithGetLyrics.getLyrics).toBeDefined()
    expect(songWithoutGetlyrics.getLyrics).toBeDefined()
    await expect(songWithGetLyrics.getLyrics()).resolves.toBeDefined()
  })
  it('have a valid url', () => {
    const fakeSong = makeFakeSong({
      id: 'fake-song-id',
    })
    expect(makeSong(fakeSong).url).toBe(
      'https://music.youtube.com/watch?v=fake-song-id',
    )
  })
  it('have a valid duration string', () => {
    const fakeSong = makeFakeSong({
      durationString: '00:10:00',
    })
    expect(makeSong(fakeSong).durationString).toBe('10:00')
  })
  it('have a valid duration in milliseconds', () => {
    const fakeSong = makeFakeSong({
      durationString: '00:10:00',
    })
    expect(makeSong(fakeSong).durationMiliseconds).toBe(600000)
  })
  it('have a valid hash', () => {
    const fakeChannel = makeFakeChannel()
    const fakeSong = makeFakeSong({
      id: 'fake-song-id',
      title: 'fake-song-title',
      channel: {
        id: fakeChannel.id,
        name: fakeChannel.name,
      },
    })
    expect(makeSong(fakeSong).hash).toBe('be05d85aca6fc668ca2d9779ce735fad')
  })
})
