/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

type MakeSafety = <T>(val: T) => {
	required: (error: string) => NonNullable<T>
	undefined: (error: string) => NonNullable<T>
	null: (error: string) => NonNullable<T>
	nullOrUndefined: (error: string) => NonNullable<T>
}
const throwAnError = (errorMessage: string) => {
	throw new Error(errorMessage)
}

export const safety: MakeSafety = <T>(val: T) => ({
	undefined: (error: string) => {
		if (val === undefined) {
			throwAnError(error)
		}
		return val!
	},
	null: (error: string) => {
		if (val === null) {
			throwAnError(error)
		}
		return val!
	},
	nullOrUndefined: (error: string) => {
		if (val === null || val === undefined) {
			throwAnError(error)
		}
		return val!
	},
	required: (error: string) => {
		if (typeof val === 'undefined' || val === null) {
			throwAnError(error)
		}
		if ((typeof val === 'string' || val instanceof Array) && !val.length) {
			throwAnError(error)
		}
		if (val instanceof Object && !Object.keys(val).length) {
			throwAnError(error)
		}
		return val!
	},
})
