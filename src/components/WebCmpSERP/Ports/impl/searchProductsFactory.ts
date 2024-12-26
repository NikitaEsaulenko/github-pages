import type { GetProductsByIdsHttpClientDelegate } from '@/api/productsApiClient/GetProductsByIdsHttpClientDelegate'
import type { GetItemsResponse200 } from '@/api/productsApiClient/tsclient/productsApiClient'
import type { SearchProductsHttpClientDelegate } from '@/api/searchApiClient/SearchProductsHttpClientDelegate'
import type { SearchProductsDelegate } from '@/components/WebCmpSERP/Ports/SearchProducts'
import type { Filter } from '@/types/Filter'
import type { FilterCheckbox } from '@/types/FilterCheckbox'
import type { FilterRadio } from '@/types/FilterRadio'
import type { FilterRange } from '@/types/FilterRange'
import type { Product } from '@/types/Product'
import type {
  Filter as BackendFilter,
  FilterValue as BackendFilterValue,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

import { Err, Ok } from '@thames/monads'

export const searchProductsFactory = (params: {
  getProductsByIdsHttpClient: GetProductsByIdsHttpClientDelegate
  lang: string
  partnerId: string
  searchProductsHttpClient: SearchProductsHttpClientDelegate
  stock: string
}): SearchProductsDelegate => {
  return async (req) => {
    try {
      const searchData = await params.searchProductsHttpClient({
        body: {
          filters: filtersMapperRequest(req.filters),
        },
        lang: params.lang,
        page: req.page,
        pageSize: req.pageSize,
        partnerId: params.partnerId,
        phrase: encodeURIComponent(req.phrase),
        sort: req.sort,
        stock: params.stock,
      })
      if (searchData.status === 200) {
        if (searchData.body) {
          const productsData = await params.getProductsByIdsHttpClient({
            itemsIds: searchData.body.products,
            partnerId: params.partnerId,
            stock: params.stock,
          })

          if (productsData.status === 200) {
            return Ok({
              filters: filtersMapperResponse(searchData.body.filters),
              pagesCount: searchData.body.pagesCount,
              products: productsMapper(productsData.body.filter((x) => x.IsAvailable)),
              productsCount: searchData.body.productsCount,
            })
          }
          return Err('Server error')
        }
      }
      if (searchData.status === 204) {
        return Ok({
          filters: [],
          pagesCount: 0,
          products: [],
          productsCount: 0,
        })
      }
      return Err('Server error')
    } catch {
      return Err('Network error')
    }
  }
}

const productsMapper = (products: GetItemsResponse200['body']): Product[] => {
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

const filtersMapperRequest = (filters: Filter[]): BackendFilterValue[] => {
  const result: BackendFilterValue[] = []

  for (const filter of filters) {
    if (filter.type === 'Checkbox' && filter.value.length > 0) {
      result.push({
        checkBoxFilterValue: {
          filterId: filter.id,
          selectedValueIds: filter.value,
        },
      })
    }

    if (filter.type === 'Radio' && filter.value !== undefined) {
      result.push({
        radioButtonFilterValue: {
          filterId: filter.id,
          selectedValueId: filter.value,
        },
      })
    }

    if (filter.type === 'RangeWithSlider') {
      result.push({
        intervalFilterValue: {
          filterId: filter.id,
          selectedMax: filter.value.to !== null ? filter.value.to : undefined,
          selectedMin: filter.value.from !== null ? filter.value.from : undefined,
        },
      })
    }
  }

  return result
}

const filtersMapperResponse = (filters: BackendFilter[]): Filter[] => {
  const result: Filter[] = []

  for (const filter of filters) {
    const { checkBoxFilter, intervalFilter, radioButtonFilter } = filter

    if (checkBoxFilter) {
      const data: FilterCheckbox['data'] = []
      const value: FilterCheckbox['value'] = []

      const values = checkBoxFilter.retrivedValues.sort((a, b) => {
        if (a.isSelected && !b.isSelected) return -1
        if (!a.isSelected && b.isSelected) return 1
        return a.title.localeCompare(b.title)
      })

      for (const x of values) {
        data.push({
          description: String(x.count),
          text: x.title,
          value: x.valueId,
        })
        if (x.isSelected) {
          value.push(x.valueId)
        }
      }

      result.push({
        data,
        id: checkBoxFilter.filterId,
        title: checkBoxFilter.title,
        type: 'Checkbox',
        value: value,
      })
    }

    if (radioButtonFilter) {
      const data: FilterRadio['data'] = []
      const value: FilterRadio['value'] = radioButtonFilter.selectedValueId

      const values = radioButtonFilter.retrivedValues.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })

      for (const x of values) {
        data.push({
          description: String(x.count),
          text: x.title,
          value: x.valueId,
        })
      }

      result.push({
        data,
        id: radioButtonFilter.filterId,
        title: radioButtonFilter.title,
        type: 'Radio',
        value: value !== null ? value : undefined,
      })
    }

    if (intervalFilter) {
      const value: FilterRange['value'] = {
        from: null,
        to: null,
      }

      if (
        intervalFilter.selectedMin !== undefined &&
        intervalFilter.selectedMin !== intervalFilter.retrivedMin
      ) {
        value.from = intervalFilter.selectedMin
      }

      if (
        intervalFilter.selectedMax !== undefined &&
        intervalFilter.selectedMax !== intervalFilter.retrivedMax
      ) {
        value.to = intervalFilter.selectedMax
      }

      result.push({
        id: intervalFilter.filterId,
        max: intervalFilter.retrivedMax,
        min: intervalFilter.retrivedMin,
        step: 1,
        title: intervalFilter.title,
        type: 'RangeWithSlider',
        value: value,
      })
    }
  }

  return result
}
