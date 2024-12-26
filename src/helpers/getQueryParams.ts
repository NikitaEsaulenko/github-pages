import type { ParsedQueryParams } from '@/types/ParsedQueryParams'

export function getQueryParams(query: string) {
  try {
    const result: ParsedQueryParams = {}

    const paramsString = query.startsWith('?') ? query.slice(1) : query
    const params = new URLSearchParams(paramsString)

    for (const [key, value] of params.entries()) {
      try {
        result[key] = JSON.parse(value)
      } catch {
        result[key] = value
      }
    }
    return result
  } catch (e) {
    console.error('Error parsing query parameters:', e)
    return {}
  }
}
