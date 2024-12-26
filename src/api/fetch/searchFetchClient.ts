import type { Fetch } from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2'

import { fetchFactory } from '@/api/fetch/fetchFactory'

export const searchFetchClient: Fetch = fetchFactory(import.meta.env.VITE_RETAIL_ROCKET_SEARCH_API)
