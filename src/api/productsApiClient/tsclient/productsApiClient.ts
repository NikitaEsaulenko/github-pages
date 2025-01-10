type ApiFn<I, O> = (_: I) => Promise<O>
type InnerApiFn<I, O> = (_: I, fetch: Fetch) => Promise<O>

const withFetch =
  <I, O>(fn: InnerApiFn<I, O>, fetch: Fetch): ApiFn<I, O> =>
  (request: I): Promise<O> =>
    fn(request, fetch)

export type Request = {
  /* eslint-disable-next-line */
  body?: any
  headers: Record<string, string>
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
  path: string
  query: string
}

export type Response = {
  /* eslint-disable-next-line */
  body?: any
  status: number
}

export type Fetch = (req: Request) => Promise<Response>

export type GetItemsResponse200 = {
  body: {
    Algorithm: null | string
    Author: null | string
    Barcode: null | string
    BuyUrl: null | string
    CategoryIds: number[]
    Color: null | string
    Description: string
    GroupId: null | string
    IsAvailable: boolean
    IsNew: boolean
    ItemId: number
    Model: null | string
    Name: string
    OldPrice: number
    Params: Record<string, string>
    PictureUrl: string
    PreviousPrice: null | string
    Price: number
    Regions: null | string
    Size: null | string
    TypePrefix: null | string
    Url: string
    Vendor: null | string
    Weight: number
  }[]
  status: 200
}

export type GetItemsResponse204 = {
  status: 204
}

export type GetItemsResponse400 = {
  status: 400
}

export type GetItemsResponse502 = {
  status: 502
}

export type GetItemsResponse =
  | GetItemsResponse200
  | GetItemsResponse204
  | GetItemsResponse400
  | GetItemsResponse502

export type GetItemsRequest = {
  itemsIds: number[]
  partnerId: string
  stock: string
}

async function getItems(requestModel: GetItemsRequest, fetch: Fetch): Promise<GetItemsResponse> {
  const path = '/api/1.0/partner/{partnerId}/items/?itemsIds={itemsIds}&stock={stock}&format=json'
    .replace('{partnerId}', `${requestModel.partnerId}`)
    .replace('{stock}', `${requestModel.stock}`)
    .replace('{itemsIds}', `${requestModel.itemsIds.join(',')}`)

  const response = await fetch({
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    path: path,
    query: '',
  })

  if (response.status === 200) {
    return {
      body: response.body,
      status: 200,
    }
  }

  if (response.status === 204) {
    return {
      status: 204,
    }
  }

  if (response.status === 400) {
    return {
      status: 400,
    }
  }

  if (response.status === 502) {
    return {
      status: 502,
    }
  }

  throw new Error('Unknown response')
}

export const createApi = (fetch: Fetch) => {
  return {
    getItems: withFetch(getItems, fetch),
  }
}
