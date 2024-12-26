import { isEventOutside } from '@/helpers/isEventOutside'
import { describe, expect, it } from 'vitest'

describe('isEventOutside', () => {
  it('should return true when click outside', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    const event = {
      composedPath: () => [outsideElement],
      /* eslint-disable-next-line */
    } as any

    expect(isEventOutside(element, event)).toBe(true)

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it('should return false, when click inside', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const insideElement = document.createElement('div')
    element.appendChild(insideElement)

    const event = {
      composedPath: () => [insideElement],
      /* eslint-disable-next-line */
    } as any

    expect(isEventOutside(element, event)).toBe(false)

    document.body.removeChild(element)
  })
})
