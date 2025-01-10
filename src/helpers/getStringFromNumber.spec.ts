import { describe, expect, it } from 'vitest'

import { getStringFromNumber } from './getStringFromNumber'

describe('getStringFromNumber', () => {
  it('should return an empty string for null input', () => {
    expect(getStringFromNumber(null)).toBe('')
  })

  it('should return an empty string for Infinity input', () => {
    expect(getStringFromNumber(Infinity)).toBe('')
  })

  it('should return an empty string for -Infinity input', () => {
    expect(getStringFromNumber(-Infinity)).toBe('')
  })

  it('should return a string representation of a number', () => {
    expect(getStringFromNumber(42)).toBe('42')
    expect(getStringFromNumber(3.14)).toBe('3.14')
    expect(getStringFromNumber(-10)).toBe('-10')
  })
})
