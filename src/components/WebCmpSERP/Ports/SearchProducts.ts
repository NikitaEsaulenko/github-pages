import type { ErrorMessage } from '@/types/ErrorMessage'
import type { Filter } from '@/types/Filter'
import type { Product } from '@/types/Product'
import type { InjectionKey } from 'vue'

import { type Result } from '@thames/monads'

export type SearchProductsDelegate = (req: {
  filters: Filter[]
  page: number
  pageSize: number
  phrase: string
  sort: string
}) => Promise<
  Result<
    {
      filters: Filter[]
      pagesCount: number
      products: Product[]
      productsCount: number
    },
    ErrorMessage
  >
>

export const searchProductsDelegateInjectionKey: InjectionKey<SearchProductsDelegate> =
  Symbol.for('SearchProductsDelegate')
