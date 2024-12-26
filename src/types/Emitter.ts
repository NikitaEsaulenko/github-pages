export type Emitter = {
  emit: (phrase: string) => void
  on: (callback: (phrase: string) => void) => void
}
