import type {
  GetPhraseProductsPreviewRequest,
  GetPhraseProductsPreviewResponse,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

export type PreviewProductsHttpClientDelegate = (
  req: GetPhraseProductsPreviewRequest,
) => Promise<GetPhraseProductsPreviewResponse>
