import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import InputNumberWithControls from './InputNumberWithControls.vue'

const onBlurMock = fn()
const onFocusMock = fn()
const onUpdateValueMock = fn()

const meta = {
  component: InputNumberWithControls,
  tags: ['autodocs'],
  title: 'Components/InputNumberWithControls',
} satisfies Meta<typeof InputNumberWithControls>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onBlur: onBlurMock,
    onFocus: onFocusMock,
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    value: 0,
  },
  play: async ({ canvas, canvasElement, step }) => {
    const inputElement = canvas.getByTestId('test-id')

    await step('enter normal value', async () => {
      await userEvent.clear(inputElement)
      await userEvent.type(inputElement, '5')
      await userEvent.click(canvasElement)
      await expect(onFocusMock).toHaveBeenCalledTimes(1)
      await expect(onBlurMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(5)
      onUpdateValueMock.mockClear()
    })

    await step('enter text value', async () => {
      await userEvent.clear(inputElement)
      await userEvent.type(inputElement, '-1a2.5b')
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(0)
      onUpdateValueMock.mockClear()
    })

    await userEvent.clear(inputElement)
  },
  render: (args) => ({
    components: { InputNumberWithControls },
    setup() {
      const value = ref(0)

      return {
        args,
        value,
      }
    },
    template: `
          <InputNumberWithControls
              :value="value"
              :max="args.max"
              :min="args.min"
              :step="args.step"
              :test-id="args.testId"
              v-model:value="value"
              @blur="args['onBlur']"
              @focus="args['onFocus']"
              @update:value="args['onUpdate:value']"/>
        `,
  }),
}
