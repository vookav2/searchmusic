<!-- URLs  -->

[actions]: https://github.com/vookav2/searchmusic/actions
[issues]: https://github.com/vookav2/searchmusic/issues
[nodejs]: https://nodejs.org/
[codefactor]: https://www.codefactor.io/repository/github/vookav2/searchmusic
[npm]: https://www.npmjs.com/package/@vookav2/searchmusic
[versions]: https://www.npmjs.com/package/@vookav2/searchmusic?activeTab=versions
[buymeacoffee]: https://www.buymeacoffee.com/daphinokio
[saweria]: https://saweria.co/daphino
[mailto]: mailto:davinomoehdanino@gmail.com

# 🔍 searchmusic

Accurate search for musics, albums, artists, with related playlists and lyrics.

[![Donate](https://img.shields.io/badge/donate-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white)][buymeacoffee]
[![Donate](https://img.shields.io/badge/SAWERIA-faae2b?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white)][saweria]

[![Tests](https://github.com/vookav2/searchmusic/actions/workflows/build.yml/badge.svg)][actions]
[![Codefactor](https://www.codefactor.io/repository/github/vookav2/searchmusic/badge)][codefactor]
[![Latest version](https://img.shields.io/npm/v/@vookav2/searchmusic?color=%2335C757)][versions]
[![Monthly downloads](https://img.shields.io/npm/dm/@vookav2/searchmusic)][npm]

<details>
  <summary>Table of contents</summary>
  <ol>
     <li>
       <a href="#features">Features</a>
     </li>
     <li>
       <a href="#getting-started">Getting Started</a>
       <ul>
         <li>
           <a href="#prerequisites">Prerequisites</a>
         </li>
         <li>
           <a href="#installation">Installation</a>
         </li>
       </ul>
     </li>
    <li>
       <a href="#usage">Usage</a>
       <ul>
         <li>
           <a href="#output">Output</a>
         </li>
         <li>
           <a href="#get-playlist-from-url">Get Playlist From URL</a>
         </li>
         <li>
           <a href="#query-suggestion">Query Suggestion</a>
         </li>
       </ul>
     </li>
    <li>
       <a href="#contributing">Contributing</a>
     </li>
    <li>
       <a href="#disclaimer">Disclaimer</a>
     </li>
    <li>
       <a href="#support">Support</a>
     </li>
    <li>
       <a href="#license">License</a>
     </li>
  </ol>
</details>

### Features

- Search musics, albums, and artists with auto title correction.
- Get related playlists from music, album, or artist.
- Easily to get lyrics from music
- Title suggestions

## Getting Started

### Prerequisites

- [Node.js][nodejs] v16 or greater
  ```
  node --version
  ```

### Installation

- NPM
  ```sh
  npm install @vookav2/searchmusic
  ```
- Yarn
  ```sh
  yarn add @vookav2/searchmusic
  ```

## Usage

Import functions that you need.

```ts
import { searchSong, searchArtist, searchAlbum, search } from '@vookav2/searchmusic'
const response = await searchSong('one more light')
```

### Output

<details>
<summary>Playlist</summary>
<p>

```js
{
  playlistId: string,
  playlistTitle: string,
  isInfinite: boolean,
  token: string,
  hash: string, // md5(playlistId + playlistTitle)
  length: number,
  songs: Song[],
}
```

</p>
</details>

<details>
<summary>Lyrics</summary>
<p>

```js
{
  lyrics: string,
  source: {
    name: string,
    url: string,
    link: string,
  },
}
```

</p>
</details>

<details>
<summary>Search Song</summary>
<p>

```js
{
  search: {
    type: string,
    query: string,
    correctedQuery: string,
  },
  song: {
    id: string,
    title: string,
    url: string,
    hash: string, // md5(id + title + channel.name)
    channel: {
      id: string,
      name: string,
    },
    album: {
      id: string,
      title: string,
    },
    explicit: boolean,
    durationMiliseconds: number,
    durationString: string,
    thumbnail: string,
    selected: boolean,
    getLyrics: () => Promise<Lyrics>,
    getPlaylist: () => Promise<Playlist>,
  }
}
```

</p>
</details>
  
<details>
<summary>Search Album</summary>
<p>

```js
{
  search: {
    type: string,
    query: string,
    correctedQuery: string,
  },
  album: {
    id: string,
    title: string,
    thumbnail: string,
    explicit: boolean,
    hash: string, // md5(id + title + channel.name)
    channel: {
      id: string,
      name: string,
    },
    getPlaylist: () => Promise<Playlist>,
  }
}
```

</p>
</details>
  
<details>
<summary>Search Artist</summary>
<p>

```js
{
  search: {
    type: string,
    query: string,
    correctedQuery: string,
  },
  artist: {
    id: string,
    name: string,
    url: string,
    thumbnail: string,
    hash: string, // md5(id + name)
    getPlaylist: () => Promise<Playlist>,
  }
}
```

</p>
</details>

<details>
<summary>Search All</summary>
<p>

```js
{
  search: {
    type: string,
    query: string,
    correctedQuery: string,
  },
  result: Song | Album | Channel
}
```

</p>
</details>

### Get Playlist From URL
```ts
  import { getPlaylistFromUrl } from '@vookav2/searchmusic'
  // const url = 'https://www.youtube.com/playlist?list={playlistId}'
  // const url = 'https://www.youtube.com/channel/{channelId}'
  // const url = 'https://www.youtube.com/watch?v={videoId}&list={playlistId}'
  const response = await getPlaylistFromUrl(url) // => Playlist
```

### Query suggestion
```ts
  import { querySuggestion } from '@vookav2/searchmusic'
  const query = 'title'
  const response = await querySuggestion(query)
  /**
    {
      original: string,
      suggestions: string[],
    }
  */
```

## Contributing

Contributions, issues and feature requests are welcome. Feel free to check [issues][issues] page if you want to contribute.

## Support

Give a 🌟 star if this project is useful to you.

## Disclaimer

This project is not affiliated with, endorsed, or sponsored by YouTube or any of their affiliates or subsidiaries. All trademarks, logos and brand names are the property of their respective owners, and are used only to directly describe the services being provided, as such, any usage of trademarks to refer to such services is considered nominative use.

Should you have any questions or concerns please contact me directly via [email][mailto].

## License

Distributed under the [MIT](https://github.com/vookav2/searchmusic/blob/main/LICENSE) License.
  
([⬆ back to top](#-searchmusic))
