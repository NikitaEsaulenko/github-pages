import type { ParsedQueryParams } from '@/types/ParsedQueryParams'

import { describe, expect, it, vi } from 'vitest'

import { updateQueryParams } from './updateQueryParams'

describe('updateUrlParams', () => {
  it('updates URL parameters by adding new parameters', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    const params: ParsedQueryParams = { partnerId: '5556', stock: 'Moscow' }
    updateQueryParams(params)

    const url = new URL(window.location.href)
    expect(url.searchParams.get('partnerId')).toBe('5556')
    expect(url.searchParams.get('stock')).toBe('Moscow')

    expect(replaceStateSpy).toHaveBeenCalledOnce()
    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', url)
    replaceStateSpy.mockRestore()
  })

  it('updates massive parameters by adding them as multiple values', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    const params: ParsedQueryParams = { tags: ['vue', 'javascript'] }
    updateQueryParams(params)

    const url = new URL(window.location.href)
    expect(url.searchParams.getAll('tags')).toEqual(['vue', 'javascript'])

    expect(replaceStateSpy).toHaveBeenCalledOnce()
    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', url)
    replaceStateSpy.mockRestore()
  })

  it("doesnt call replaceState if the URL hasn't changed", () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    let mockLocation = new URL('http://localhost?partnerId=5556')
    Object.defineProperty(window, 'location', {
      value: {
        assign: vi.fn(),
        get href() {
          return mockLocation.href
        },
        set href(newHref: string) {
          mockLocation = new URL(newHref)
        },
        reload: vi.fn(),
        replace: vi.fn(),
        get search() {
          return mockLocation.search
        },
      },
      writable: true,
    })
    const params: ParsedQueryParams = { partnerId: '5556' }
    updateQueryParams(params)
    expect(replaceStateSpy).not.toHaveBeenCalled()
    replaceStateSpy.mockRestore()
  })
})
