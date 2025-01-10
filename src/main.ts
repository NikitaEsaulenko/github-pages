import type { Emitter } from '@/types/Emitter'

import { productsFetchClient } from '@/api/fetch/productsFetchClient'
import { searchFetchClient } from '@/api/fetch/searchFetchClient'

import './assets/styles/main.css'
import './assets/styles/fonts.css'

import { serpEmitterInjectionKey } from '@/components/WebCmpSERP/Ports/Emitter'
import { searchProductsFactory } from '@/components/WebCmpSERP/Ports/impl/searchProductsFactory'
import { searchProductsDelegateInjectionKey } from '@/components/WebCmpSERP/Ports/SearchProducts'
import WebCmpSERP from '@/components/WebCmpSERP/WebCmpSERP.vue'
import { searchInputWithPreviewEmitterInjectionKey } from '@/components/WebCpmSearchInputWithPreview/Ports/Emitter'
import { previewProductsFactory } from '@/components/WebCpmSearchInputWithPreview/Ports/impl/previewProductsFactory'
import { previewProductsDelegateInjectionKey } from '@/components/WebCpmSearchInputWithPreview/Ports/PreviewProducts'
import WebCpmSearchInputWithPreview from '@/components/WebCpmSearchInputWithPreview/WebCpmSearchInputWithPreview.vue'
import { getQueryParams } from '@/helpers/getQueryParams'
import { i18n } from '@/locale'
import { createApi as createSearchApi } from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'
import { defineCustomElement, ref } from 'vue'
import { I18nInjectionKey } from 'vue-i18n'

import { createApi as createProductsApi } from './api/productsApiClient/tsclient/productsApiClient'

const searchClient = createSearchApi(searchFetchClient)
const productsClient = createProductsApi(productsFetchClient)

const getInitParams = () => {
  const { lang, partnerId, stock } = getQueryParams(window.location.search)

  const missingParams: string[] = []

  if (!lang) missingParams.push('lang')
  if (!partnerId) missingParams.push('partnerId')
  if (!stock) missingParams.push('stock')

  if (missingParams.length) {
    console.error(`Missing query params: ${missingParams.join(', ')}`)
  }

  return {
    lang,
    partnerId,
    stock,
  }
}

const initParams = getInitParams()

const createEmitter: () => Emitter = () => {
  const callback = ref<(phrase: string) => void>(() => {})

  const on = (fn: (phrase: string) => void) => {
    callback.value = fn
  }

  const emit = (phrase: string) => {
    callback.value(phrase)
  }

  return {
    emit,
    on,
  }
}

const emitter = createEmitter()

i18n.global.locale = initParams.lang

customElements.define(
  'rrs-serp',
  defineCustomElement(WebCmpSERP, {
    configureApp(app) {
      app.use(i18n)
      app.provide(I18nInjectionKey, i18n)

      app.provide(serpEmitterInjectionKey, emitter)

      app.provide(
        searchProductsDelegateInjectionKey,
        searchProductsFactory({
          getProductsByIdsHttpClient: productsClient.getItems,
          lang: initParams.lang,
          partnerId: initParams.partnerId,
          searchProductsHttpClient: searchClient.postProducts,
          stock: initParams.stock,
        }),
      )
    },
  }),
)

customElements.define(
  'rrs-search-input-with-preview',
  defineCustomElement(WebCpmSearchInputWithPreview, {
    configureApp(app) {
      app.use(i18n)
      app.provide(I18nInjectionKey, i18n)

      app.provide(searchInputWithPreviewEmitterInjectionKey, emitter)

      app.provide(
        previewProductsDelegateInjectionKey,
        previewProductsFactory({
          getProductsByIdsHttpClient: productsClient.getItems,
          lang: initParams.lang,
          partnerId: initParams.partnerId,
          previewProductsHttpClient: searchClient.getPhraseProductsPreview,
          redirectsHttpClient: searchClient.getPhraseRedirects,
          stock: initParams.stock,
          suggestionsHttpClient: searchClient.getPhraseSuggestions,
        }),
      )
    },
  }),
)

customElements.define('i18n-host', defineCustomElement(WebCpmSearchInputWithPreview))
