import type { GetProductsByIdsHttpClientDelegate } from '@/api/productsApiClient/GetProductsByIdsHttpClientDelegate'
import type { GetItemsResponse200 } from '@/api/productsApiClient/tsclient/productsApiClient'
import type { PreviewProductsHttpClientDelegate } from '@/api/searchApiClient/PreviewProductsHttpClientDelegate'
import type { RedirectHttpClientDelegate } from '@/api/searchApiClient/RedirectsHttpClientDelegate'
import type { SuggestionsHttpClientDelegate } from '@/api/searchApiClient/SuggestionsHttpClientDelegate'
import type { PreviewProductsDelegate } from '@/components/WebCpmSearchInputWithPreview/Ports/PreviewProducts'
import type { PreviewProduct } from '@/types/PreviewProduct'
import type { PreviewRedirect } from '@/types/PreviewRedirect'
import type { PreviewSuggestion } from '@/types/PreviewSuggestion'
import type { Product } from '@/types/Product'
import type {
  GetPhraseProductsPreviewResponse,
  GetPhraseRedirectsResponse,
  GetPhraseRedirectsResponse200,
  GetPhraseSuggestionsResponse,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

import { Err, Ok } from '@thames/monads'

export const previewProductsFactory = (params: {
  getProductsByIdsHttpClient: GetProductsByIdsHttpClientDelegate
  lang: string
  partnerId: string
  previewProductsHttpClient: PreviewProductsHttpClientDelegate
  redirectsHttpClient: RedirectHttpClientDelegate
  stock: string
  suggestionsHttpClient: SuggestionsHttpClientDelegate
}): PreviewProductsDelegate => {
  return async (req) => {
    try {
      const [previewResult, suggestionsResult, redirectsResult] = await Promise.allSettled([
        params.previewProductsHttpClient({
          partnerId: params.partnerId,
          phrase: encodeURIComponent(req.phrase),
          stock: params.stock,
        }),
        params.suggestionsHttpClient({
          lang: params.lang,
          partnerId: params.partnerId,
          phrase: encodeURIComponent(req.phrase),
        }),
        params.redirectsHttpClient({
          lang: params.lang,
          partnerId: params.partnerId,
          phrase: encodeURIComponent(req.phrase),
        }),
      ])
      let products: PreviewProduct[] = []
      let redirects: PreviewRedirect[] = []
      let suggestions: PreviewSuggestion[] = []
      const previewData: GetPhraseProductsPreviewResponse | PromiseRejectedResult =
        previewResult.status === 'fulfilled' ? previewResult.value : previewResult.reason
      const suggestionsData: GetPhraseSuggestionsResponse | PromiseRejectedResult =
        suggestionsResult.status === 'fulfilled'
          ? suggestionsResult.value
          : suggestionsResult.reason
      const redirectsData: GetPhraseRedirectsResponse | PromiseRejectedResult =
        redirectsResult.status === 'fulfilled' ? redirectsResult.value : redirectsResult.reason

      if (previewData.status === 200) {
        const productsData = await params.getProductsByIdsHttpClient({
          itemsIds: previewData.body.products,
          partnerId: params.partnerId,
          stock: params.stock,
        })
        if (productsData.status === 200) {
          products = productsMapper(productsData.body)
        }
      }

      if (suggestionsData.status === 200) {
        suggestions = suggestionsData.body.phraseSuggestions
      }

      if (redirectsData.status === 200) {
        redirects = redirectsMapper(redirectsData.body.phraseRedirects)
      }

      return Ok({
        products,
        redirects,
        suggestions,
      })
    } catch {
      return Err('Network error')
    }
  }
}

const productsMapper = (products: GetItemsResponse200['body']): PreviewProduct[] => {
  const result: Product[] = []
  for (const product of products) {
    result.push({
      href: 'javascript:void(0)',
      id: product.ItemId,
      image: product.PictureUrl,
      name: product.Name,
      oldPrice: product.OldPrice,
      price: product.Price,
      // TODO: rating
      rating: 0,
      reviewsCount: 0,
    })
  }
  return result
}

const redirectsMapper = (redirects: GetPhraseRedirectsResponse200['body']['phraseRedirects']) => {
  const result: PreviewRedirect[] = []
  for (const redirect of redirects) {
    result.push({
      href: redirect.url,
      text: redirect.phrase,
    })
  }
  return result
}
