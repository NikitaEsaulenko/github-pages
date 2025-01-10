import type { Emitter } from '@/types/Emitter'
import type { InjectionKey } from 'vue'

export const serpEmitterInjectionKey: InjectionKey<Emitter> = Symbol.for('serpEmitterInjectionKey')
