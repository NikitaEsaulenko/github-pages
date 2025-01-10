import { describe, expect, it } from 'vitest'

import { normalizeDecimalNumber } from './normalizeDecimalNumber'

const a = 0.1
const b = 0.2

describe('normalizeDecimalNumber', () => {
  it('work', () => {
    expect(a + b).toBe(0.30000000000000004)
    expect(normalizeDecimalNumber(a + b)).toBe(0.3)
  })
})
