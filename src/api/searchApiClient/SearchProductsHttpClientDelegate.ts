import type {
  PostProductsRequest,
  PostProductsResponse,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

export type SearchProductsHttpClientDelegate = (
  req: PostProductsRequest,
) => Promise<PostProductsResponse>
