import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fireEvent, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterRangeWithSlider from './FilterRangeWithSlider.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterRangeWithSlider,
  tags: ['autodocs'],
  title: 'Components/FilterRangeWithSlider',
} satisfies Meta<typeof FilterRangeWithSlider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    max: 5,
    min: -5,
    'onUpdate:value': onUpdateValueMock,
    step: 1,
    testId: 'test-id',
    title: 'Цена',
    value: {
      from: null,
      to: null,
    },
  },
  play: async ({ canvas, canvasElement, step }) => {
    const slider = canvas.getByTestId('test-id-slider')
    const sliderRect = slider.getBoundingClientRect()

    const inputFrom = canvas.getByTestId('test-id-from')
    const inputTo = canvas.getByTestId('test-id-to')

    const clickOnSliderAtPercent = async (percent: number) => {
      const clickPosition = (percent / 100) * sliderRect.width
      await fireEvent.pointerDown(slider, {
        clientX: sliderRect.left + clickPosition,
        clientY: sliderRect.top + sliderRect.height / 2,
      })
      await fireEvent.pointerUp(slider)
    }

    await step('move "from" thumb to 20%', async () => {
      await clickOnSliderAtPercent(30)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -2, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('move "to" thumb to 80%', async () => {
      await clickOnSliderAtPercent(70)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -2, to: 2 })
      onUpdateValueMock.mockClear()
    })

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
    components: { FilterRangeWithSlider },
    setup() {
      const value = ref({ from: -1, to: 1 })

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterRangeWithSlider
              :title="args.title"
              :min="args.min"
              :max="args.max"
              :step="args.step"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
