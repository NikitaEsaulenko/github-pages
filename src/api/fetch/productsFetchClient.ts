import { fetchFactory } from '@/api/fetch/fetchFactory'

import type { Fetch } from '../productsApiClient/tsclient/productsApiClient'

export const productsFetchClient: Fetch = fetchFactory(import.meta.env.VITE_RETAIL_ROCKET_API)
