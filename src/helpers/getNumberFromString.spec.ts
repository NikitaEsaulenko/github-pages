import { describe, expect, it } from 'vitest'

import { getNumberFromString } from './getNumberFromString'

describe('getNumberFromString', () => {
  it('should return null for an empty string', () => {
    expect(getNumberFromString('')).toBe(null)
  })

  it('should return valid numbers for valid numeric strings', () => {
    expect(getNumberFromString('1')).toBe(1)
    expect(getNumberFromString('.0.')).toBe(0)
    expect(getNumberFromString('-1')).toBe(-1)
    expect(getNumberFromString('0.1')).toBe(0.1)
    expect(getNumberFromString('-0.1')).toBe(-0.1)
    expect(getNumberFromString('Test 0.1')).toBe(0.1)
    expect(getNumberFromString('00..0.01')).toBe(0.01)
    expect(getNumberFromString('--00..0.01')).toBe(-0.01) // Проверка с двумя знаками минус
  })

  it('should return null for invalid negative numbers', () => {
    expect(getNumberFromString('-')).toBe(null)
    expect(getNumberFromString('-a')).toBe(null)
    expect(getNumberFromString('-0')).toBe(null)
    expect(getNumberFromString('-0.')).toBe(null)
  })

  it('should return null for strings that do not contain valid numbers', () => {
    expect(getNumberFromString('abc')).toBe(null)
    expect(getNumberFromString('!@#$')).toBe(null)
    expect(getNumberFromString('Test abc')).toBe(null)
  })

  it('should return valid numbers for various numeric formats', () => {
    expect(getNumberFromString('42')).toBe(42)
    expect(getNumberFromString('-42')).toBe(-42)
    expect(getNumberFromString('3.14')).toBe(3.14)
    expect(getNumberFromString('-3.14')).toBe(-3.14)
    expect(getNumberFromString('   123   ')).toBe(123) // Проверяем пробелы
  })

  it('should return null for strings with only decimal points', () => {
    expect(getNumberFromString('.')).toBe(null)
    expect(getNumberFromString('..')).toBe(null)
  })
})
