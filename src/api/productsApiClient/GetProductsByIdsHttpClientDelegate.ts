import type { GetItemsRequest, GetItemsResponse } from './tsclient/productsApiClient'

export type GetProductsByIdsHttpClientDelegate = (req: GetItemsRequest) => Promise<GetItemsResponse>
