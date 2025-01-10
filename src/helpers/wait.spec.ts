import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { wait } from './wait'

describe('wait', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.spyOn(global, 'setTimeout')
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('waiting timeout', async () => {
    await wait(100)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100)
  })

  it('return Promise', async () => {
    const waited = wait(100, true)
    expect(waited).resolves.toBe(true)
  })
})
