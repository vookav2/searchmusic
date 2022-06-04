import crypto from 'crypto-js'

export { safety } from './safety'

export const hashMd5 = (str: string, ...str2: string[]): string => {
	const text = (str + str2.join('')).replace(/\s/g, '').toLowerCase()
	return crypto.MD5(text).toString()
}
