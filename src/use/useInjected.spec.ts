import { describe, expect, it, vi } from 'vitest'
import { inject, type InjectionKey } from 'vue'

import { useInjected } from './useInjected'

vi.mock('vue', () => ({
  inject: vi
    .fn()
    .mockImplementationOnce(() => 'injected value')
    .mockImplementationOnce(() => undefined),
}))

describe('useInjected', () => {
  const mockKey: InjectionKey<string> = Symbol('testKey')

  it('should return injected value if it exists', () => {
    const result = useInjected(mockKey)

    expect(result).toBe('injected value')
    expect(inject).toHaveBeenCalledWith(mockKey)
  })

  it('should throw an error if injected value is not found', () => {
    expect(() => useInjected(mockKey)).toThrowError(
      `Injection for key "${mockKey.toString()}" not found.`,
    )
    expect(inject).toHaveBeenCalledWith(mockKey)
  })
})
