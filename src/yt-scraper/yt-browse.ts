import { joinRunsText } from './yt-util'
import { safety } from '../utils'
import { ytError } from './yt-error'
import { ytRequest } from './yt-request'

type BrowseType = 'Album' | 'Single' | 'Channel' | 'Lyrics'
const getLyricsContent = (raw: any): string =>
	raw?.contents?.sectionListRenderer?.contents.shift()
		?.musicDescriptionShelfRenderer?.description

export const ytBrowseRequest = async (id: string, type: BrowseType) => {
	safety(type).required(ytError.invalidBrowseType)

	const raw: any = await ytRequest('browse', { browseId: id })
	safety(raw).required(ytError.noContent)

	let rawContent: any

	if (type === 'Lyrics') {
		rawContent = joinRunsText(getLyricsContent(raw))
	} else if (type === 'Channel') {
		rawContent = raw?.header?.musicImmersiveHeaderRenderer
	}
	safety(rawContent).required(ytError.noContent)

	return {
		type,
		rawContent,
	}
}
