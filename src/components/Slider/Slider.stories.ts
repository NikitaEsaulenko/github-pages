import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fireEvent, fn } from '@storybook/test'
import { ref } from 'vue'

import Slider from './Slider.vue'

const onUpdateValueMock = fn()
const onPointerupMock = fn()

const meta = {
  component: Slider,
  tags: ['autodocs'],
  title: 'Components/Slider',
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

const moveThumbAtPercentFactory = (slider: HTMLElement) => {
  const sliderRect = slider.getBoundingClientRect()

  return async (thumb: HTMLElement, percent: number) => {
    const newPosition = (percent / 100) * sliderRect.width

    const thumbRect = thumb.getBoundingClientRect()
    const thumbCenter = thumbRect.left + thumbRect.width / 2

    const shift = newPosition - (thumbCenter - sliderRect.left)

    await fireEvent.pointerDown(thumb)
    await fireEvent.pointerMove(thumb, {
      clientX: thumbCenter + shift,
      clientY: thumbRect.top + thumbRect.height / 2,
    })
    await fireEvent.pointerUp(thumb)
  }
}

const clickOnSliderAtPercentFactory = (slider: HTMLElement) => {
  const sliderRect = slider.getBoundingClientRect()

  return async (percent: number) => {
    const clickPosition = (percent / 100) * sliderRect.width
    await fireEvent.pointerDown(slider, {
      clientX: sliderRect.left + clickPosition,
      clientY: sliderRect.top + sliderRect.height / 2,
    })
    await fireEvent.pointerUp(slider)
  }
}

export const Default: Story = {
  args: {
    max: 5,
    min: -5,
    onPointerup: onPointerupMock,
    'onUpdate:value': onUpdateValueMock,
    step: 1,
    testId: 'test-id',
    value: {
      from: null,
      to: null,
    },
  },
  play: async ({ canvas, step }) => {
    const slider = canvas.getByTestId('test-id')

    const thumbsFrom = canvas.getByTestId('test-id-from')
    const thumbsTo = canvas.getByTestId('test-id-to')

    const moveThumbAtPercent = moveThumbAtPercentFactory(slider)
    const clickOnSliderAtPercent = clickOnSliderAtPercentFactory(slider)

    await step('move "from" thumb to 40%', async () => {
      await moveThumbAtPercent(thumbsFrom, 40)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: null })
      onUpdateValueMock.mockClear()
    })

    await step('move "to" thumb to 50%', async () => {
      await moveThumbAtPercent(thumbsTo, 50)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 0 })
      onUpdateValueMock.mockClear()
    })

    await step('move "to" thumb to 60%', async () => {
      await moveThumbAtPercent(thumbsTo, 60)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('move "from" thumb left over "to" thumb to 70&', async () => {
      await moveThumbAtPercent(thumbsFrom, 70)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: 1, to: 2 })
      onUpdateValueMock.mockClear()
    })

    await step('move "to" thumb right over "from" thumb to 40%', async () => {
      await moveThumbAtPercent(thumbsTo, 40)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('click on slider left of "from" thumb on 29%', async () => {
      await clickOnSliderAtPercent(29)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -2, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('click on slider right of "from" thumb on 41%', async () => {
      await clickOnSliderAtPercent(41)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 1 })
      onUpdateValueMock.mockClear()
    })

    await step('click on slider right of "to" thumb on 71%', async () => {
      await clickOnSliderAtPercent(71)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 2 })
      onUpdateValueMock.mockClear()
    })

    await step('click on slider left of "to" thumb on 59%', async () => {
      await clickOnSliderAtPercent(59)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: -1, to: 1 })
      onUpdateValueMock.mockClear()
    })
  },
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref({ from: null, to: null })

      return {
        args,
        value,
      }
    },
    template: `
          <Slider
              :value="value"
              :max="args.max"
              :min="args.min"
              :step="args.step"
              :test-id="args.testId"
              v-model:value="value"
              @pointerup="args['onPointerup']"
              @update:value="args['onUpdate:value']"/>
        `,
  }),
}

export const ToNull: Story = {
  ...Default,
  play: async ({ canvas, step }) => {
    const slider = canvas.getByTestId('test-id')

    const thumbsFrom = canvas.getByTestId('test-id-from')

    const moveThumbAtPercent = moveThumbAtPercentFactory(slider)

    await step('move "from" thumb to max when "to" null', async () => {
      await moveThumbAtPercent(thumbsFrom, 100)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: 5, to: null })
      onUpdateValueMock.mockClear()
      await expect(onPointerupMock).toHaveBeenCalled()
      onPointerupMock.mockClear()
    })
  },
}

export const FromNull: Story = {
  ...Default,
  play: async ({ canvas, step }) => {
    const slider = canvas.getByTestId('test-id')

    const thumbsTo = canvas.getByTestId('test-id-to')

    const moveThumbAtPercent = moveThumbAtPercentFactory(slider)

    await step('move "from" thumb to max when "to" null', async () => {
      await moveThumbAtPercent(thumbsTo, 0)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith({ from: null, to: -5 })
      onUpdateValueMock.mockClear()
      await expect(onPointerupMock).toHaveBeenCalled()
      onPointerupMock.mockClear()
    })
  },
}
