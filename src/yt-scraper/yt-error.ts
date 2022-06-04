export const ytError = {
	noContent: 'No Content',
	invalidUrl: 'Invalid URL',
	invalidQuery: 'Invalid Query',
	invalidBrowseType: 'Invalid Browse Type',
	invalidPlaylistParams: 'Invalid Playlist Params',
}

export const makeError = (message: string): never => {
	throw new Error(`[Youtube] ${message}`)
}
