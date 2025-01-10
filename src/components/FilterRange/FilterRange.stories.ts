import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterRange from './FilterRange.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterRange,
  tags: ['autodocs'],
  title: 'Components/FilterRange',
} satisfies Meta<typeof FilterRange>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    max: 5,
    min: -5,
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    title: 'Цена',
    value: {
      from: null,
      to: null,
    },
  },
  play: async ({ canvas, canvasElement, step }) => {
    const inputFrom = canvas.getByTestId('test-id-from')
    const inputTo = canvas.getByTestId('test-id-to')

    await step('set input "from" to -1', async () => {
      await userEvent.clear(inputFrom)
      await userEvent.type(inputFrom, '-1')
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 2 })
      onUpdateValueMock.mockClear()
    })

    await step('set input "to" to 1', async () => {
      await userEvent.clear(inputTo)
      await userEvent.type(inputTo, '1')
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('set input "from" over "to"', async () => {
      await userEvent.clear(inputFrom)
      await userEvent.type(inputFrom, '2')
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: 1, to: 1 })
      await userEvent.clear(inputFrom)
      await userEvent.type(inputFrom, '-1')
      await userEvent.click(canvasElement)
      onUpdateValueMock.mockClear()
    })

    await step('set input "to" over "from"', async () => {
      await userEvent.clear(inputTo)
      await userEvent.type(inputTo, '-2')
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: -1 })
      await userEvent.clear(inputTo)
      await userEvent.type(inputTo, '1')
      await userEvent.click(canvasElement)
      onUpdateValueMock.mockClear()
    })

    await step('clear input "from"', async () => {
      await userEvent.clear(inputFrom)
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: null, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('clear input "to"', async () => {
      await userEvent.clear(inputTo)
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: null, to: null })
      onUpdateValueMock.mockClear()
    })

    await userEvent.click(canvasElement)
  },
  render: (args) => ({
    components: { FilterRange },
    setup() {
      const value = ref({ from: -2, to: 2 })

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterRange
              :max="args.max"
              :min="args.min"
              :title="args.title"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
