import type {
  GetPhraseSuggestionsRequest,
  GetPhraseSuggestionsResponse,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

export type SuggestionsHttpClientDelegate = (
  req: GetPhraseSuggestionsRequest,
) => Promise<GetPhraseSuggestionsResponse>
