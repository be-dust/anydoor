const {add, mul} = require('./math')
const {should, expect, assert} = require('chai')

describe('#math', () => {
	describe('add', () => {
		it('should return 5 when 2 + 3', () => {
			expect(add(2, 3), 5)
		})
	})
	describe('mul', () => {
		it('should return 6 when 2 * 3', () => {
			expect(mul(2, 3), 6)
		})
	})
})