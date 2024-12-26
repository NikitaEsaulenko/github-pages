import type { Emitter } from '@/types/Emitter'
import type { InjectionKey } from 'vue'

export const searchInputWithPreviewEmitterInjectionKey: InjectionKey<Emitter> = Symbol.for(
  'searchInputWithPreviewEmitterInjectionKey',
)
