import type {
  GetPhraseRedirectsRequest,
  GetPhraseRedirectsResponse,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

export type RedirectHttpClientDelegate = (
  req: GetPhraseRedirectsRequest,
) => Promise<GetPhraseRedirectsResponse>
