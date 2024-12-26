<template>
  <div class="rrs-app">
    <!--header-->
    <div
      v-if="state.productsCount"
      class="rrs-app__sub-header">
      <h3 class="rrs-app__sub-title">{{ t('foundPhrase') }}: {{ state.phrase }}</h3>
    </div>
    <div
      v-if="state.productsCount"
      class="rrs-app__header">
      <div class="rrs-app__title">
        {{ state.phrase }}
      </div>
      <div
        v-if="state.productsCount"
        class="rrs-app__title-products-count">
        {{ t('items', state.productsCount) }}
      </div>
    </div>

    <!--main-->
    <div
      v-if="state.phrase && (state.loading || state.filters.length)"
      class="rrs-app__main">
      <div class="rrs-app__filters-list">
        <Filters
          :value="state.filters"
          test-id="filters"
          @update:value="updateFilters" />
      </div>
      <div class="rrs-app__products">
        <Sorting
          v-model:value="state.sorting"
          test-id="sorting"
          @update:value="updateSorting" />
        <ProductsSkeleton
          v-if="state.loading"
          :count="PER_PAGE"
          test-id="products-loading" />

        <template v-else>
          <Products
            :products="state.products"
            test-id="products" />
          <Pagination
            :page="state.page"
            :pages-count="state.pagesCount"
            :range="3"
            test-id="pagination"
            @update:page="updatePagination" />
        </template>
      </div>
    </div>

    <div
      v-if="state.phrase && !state.loading && !state.filters.length"
      class="rrs-app__empty">
      <EmptyResult test-id="empty" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filter } from '@/types/Filter'
import type { ParsedQueryParams } from '@/types/ParsedQueryParams'
import type { Product } from '@/types/Product'

import EmptyResult from '@/components/EmptyResult/EmptyResult.vue'
import Filters from '@/components/Filters/Filters.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import Products from '@/components/Products/Products.vue'
import ProductsSkeleton from '@/components/ProductsSkeleton/ProductsSkeleton.vue'
import Sorting from '@/components/Sorting/Sorting.vue'
import { serpEmitterInjectionKey } from '@/components/WebCmpSERP/Ports/Emitter'
import { searchProductsDelegateInjectionKey } from '@/components/WebCmpSERP/Ports/SearchProducts'
import { getQueryParams } from '@/helpers/getQueryParams'
import { updateQueryParams } from '@/helpers/updateQueryParams'
import { useInjected } from '@/use/useInjected'
import { onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const searchProducts = useInjected(searchProductsDelegateInjectionKey)
const emitter = useInjected(serpEmitterInjectionKey)

const PER_PAGE = 24

const state = reactive<{
  error: string
  filters: Filter[]
  loading: boolean
  page: number
  pagesCount: number
  phrase: string
  products: Product[]
  productsCount: number
  sorting: string
}>({
  error: '',
  filters: [],
  loading: false,
  page: 1,
  pagesCount: 1,
  phrase: '',
  products: [],
  productsCount: 0,
  sorting: '',
})

const { t } = useI18n({
  messages: {
    en: {
      foundItems: 'Found items',
      foundPhrase: 'Found by request',
      items: '{n} items | {n} item | {n} items',
      nothingWasFound: 'Nothing was found for your query',
    },
    ru: {
      foundItems: 'Найденные товары',
      foundPhrase: 'Нашлось по запросу',
      items: '{n} товаров | {n} товар | {n} товара | {n} товаров',
      nothingWasFound: 'Для вашего запроса ничего не найдено',
    },
  },
})

const updatePhrase = async (phrase: string) => {
  state.page = 1
  state.phrase = phrase
  state.filters = []
  await search()
}

const updateFilters = async (filters: Filter[]) => {
  state.page = 1
  state.filters = filters
  await search()
}

const updateSorting = async (sorting: string) => {
  state.sorting = sorting
  await search()
}

const updatePagination = async (page: number) => {
  state.page = page
  await search()
}

const search = async () => {
  state.loading = true

  await searchProducts({
    filters: state.filters,
    page: state.page,
    pageSize: PER_PAGE,
    phrase: state.phrase,
    sort: state.sorting,
  }).then((x) => {
    x.match({
      err: async (x) => {
        state.error = x
        state.filters = []
        state.pagesCount = 1
        state.productsCount = 0
        state.products = []
      },
      ok: async (x) => {
        state.filters = x.filters
        state.pagesCount = x.pagesCount
        state.productsCount = x.productsCount
        state.products = x.products
      },
    })
  })

  state.loading = false
}

const updateStateByQueryParams = (params: ParsedQueryParams) => {
  if (params.filters && params.filters !== JSON.stringify(state.filters)) {
    state.filters = params.filters
  }
  if (params.phrase && params.phrase !== state.phrase) {
    state.phrase = params.phrase
  }
  if (params.page && Number(params.page) !== state.page) {
    state.page = params.page
  }
  if (params.sorting && params.sorting !== state.sorting) {
    state.sorting = params.sorting
  }
}

onMounted(async () => {
  emitter.on((phrase) => {
    updatePhrase(phrase)
  })

  const params = getQueryParams(window.location.search)
  updateStateByQueryParams(params)

  await search()
})

watch(
  () => [state.filters, state.page, state.sorting, state.phrase],
  () => {
    updateQueryParams({
      filters: JSON.stringify(state.filters),
      page: String(state.page),
      phrase: state.phrase,
      sorting: state.sorting,
    })
  },
  { deep: true },
)
</script>

<style>
.rrs-app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  width: 100%;
}

.rrs-app__sub-header {
  margin-bottom: 8px;
}

.rrs-app__sub-title {
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  padding: 0;
}

.rrs-app__header {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  @media (width <= 600px) {
    gap: 12px;
  }
}

.rrs-app__title {
  align-items: center;
  color: #000;
  display: flex;
  font-size: 40px;
  font-weight: 700;
  gap: 12px;
  line-height: 44px;
  margin: 0;
  padding: 0;
  text-transform: capitalize;
}

.rrs-app__title-products-count {
  color: var(--rrs-color-grey-400);
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
}

.rrs-app__main {
  display: grid;
  gap: 24px;
  grid-template-columns: calc(25% - 12px) calc(75% + 12px);

  @media (width <= 600px) {
    gap: 24px;
    grid-template-columns: 1fr;
  }
}

.rrs-app__products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rrs-app__empty {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
