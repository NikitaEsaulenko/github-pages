import type { ErrorMessage } from '@/types/ErrorMessage'
import type { PreviewProduct } from '@/types/PreviewProduct'
import type { PreviewRedirect } from '@/types/PreviewRedirect'
import type { PreviewSuggestion } from '@/types/PreviewSuggestion'
import type { InjectionKey } from 'vue'

import { type Result } from '@thames/monads'

export type PreviewProductsDelegate = (req: { phrase: string }) => Promise<
  Result<
    {
      products: PreviewProduct[]
      redirects: PreviewRedirect[]
      suggestions: PreviewSuggestion[]
    },
    ErrorMessage
  >
>

export const previewProductsDelegateInjectionKey: InjectionKey<PreviewProductsDelegate> =
  Symbol.for('PreviewProductsDelegate')
