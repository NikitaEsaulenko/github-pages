import type { ParsedQueryParams } from '@/types/ParsedQueryParams'

import { getQueryParams } from '@/helpers/getQueryParams'
import { describe, expect, it } from 'vitest'

describe('getQueryParams', () => {
  it('correctly parses the query string into an object', () => {
    const query = '?stock=Moscow&partnerId=1'
    const expected: ParsedQueryParams = {
      partnerId: 1,
      stock: 'Moscow',
    }

    expect(getQueryParams(query)).toEqual(expected)
  })

  it('correctly parses JSON values', () => {
    const query = '?data={"stock":"Moscow"}'
    const expected: ParsedQueryParams = {
      data: { stock: 'Moscow' },
    }

    expect(getQueryParams(query)).toEqual(expected)
  })

  it('returns a string value if JSON.parse fails', () => {
    const query = '?invalidJson={key:value}'
    const expected: ParsedQueryParams = {
      invalidJson: '{key:value}',
    }

    expect(getQueryParams(query)).toEqual(expected)
  })

  it('returns an empty object for an empty string', () => {
    const query = ''
    const expected: ParsedQueryParams = {}

    expect(getQueryParams(query)).toEqual(expected)
  })

  it('returns an empty object on parsing error', () => {
    const malformedQuery = '&&&'
    const expected: ParsedQueryParams = {}

    expect(getQueryParams(malformedQuery)).toEqual(expected)
  })
})
