import type { ParsedQueryParams } from '@/types/ParsedQueryParams'

export function updateQueryParams(params: ParsedQueryParams) {
  const url = new URL(window.location.href)

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      url.searchParams.delete(key)
      value.forEach((v) => url.searchParams.append(key, String(v)))
    } else if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    } else {
      url.searchParams.delete(key)
    }
  })

  if (url.toString() !== window.location.href) {
    window.history.replaceState({}, '', url)
  }
}
