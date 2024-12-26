export type Request = {
  body?: never
  headers: Record<string, string>
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
  path: string
  query: string
}

export type Response = {
  body?: never
  status: number
}

export type Fetch = (req: Request) => Promise<Response>

export const fetchFactory = (baseUrl: string): Fetch => {
  return async (req) => {
    const { path, query } = req
    const url = query ? `${path}?${query}` : path

    const response = await fetch(`${baseUrl}${url}`, {
      body: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      method: req.method,
    })

    const responseBody = await response.json().catch(() => ({}))

    return {
      body: responseBody,
      status: response.status,
    }
  }
}
