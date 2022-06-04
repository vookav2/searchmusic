/* eslint-disable sonarjs/no-duplicate-string */

import { safety } from './safety'

describe('safety', () => {
	it('it defined', () => {
		expect(safety).toBeDefined()
	})
	it('can called with a target', () => {
		expect(() => safety(1)).not.toThrow()
	})
	it('must returns value', () => {
		expect(safety(1).undefined('target is undefined')).toBe(1)
		expect(safety(1).null('target is null')).toBe(1)
		expect(safety(1).nullOrUndefined('target is null')).toBe(1)
		expect(safety('any target').required('target is required')).toBe(
			'any target'
		)
	})
	it('must returns a value with the same type', () => {
		expect(typeof safety('string').undefined('target is undefined')).toBe(
			'string'
		)
		expect(typeof safety(true).null('target is null')).toBe('boolean')
		expect(
			typeof safety(1).nullOrUndefined('target is null or undefined')
		).toBe('number')
	})
	it('must throw an error when target is undefined', () => {
		expect(() => safety(undefined).undefined('target is required')).toThrow(
			'target is required'
		)
	})
	it('must throw an error when target is null', () => {
		expect(() => safety(null).null('target is required')).toThrow(
			'target is required'
		)
	})
	it('must throw an error when target is null or undefined', () => {
		expect(() => safety(null).nullOrUndefined('target is required')).toThrow(
			'target is required'
		)
		expect(() =>
			safety(undefined).nullOrUndefined('target is required')
		).toThrow('target is required')
	})
})
