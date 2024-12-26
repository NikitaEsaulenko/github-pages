import type { Meta, StoryObj } from '@storybook/vue3'

import { icons } from '@/assets/icons/icons'
import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Input from './Input.vue'

const onBlurMock = fn()
const onFocusMock = fn()
const onUpdateValueMock = fn()

const meta = {
  argTypes: {
    icon: { options: ['', ...Object.keys(icons)] },
  },
  component: Input,
  tags: ['autodocs'],
  title: 'Components/Input',
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'search',
    onBlur: onBlurMock,
    onFocus: onFocusMock,
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    value: '',
  },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.type(canvas.getByTestId('test-id'), 'test')
    await userEvent.click(canvasElement)

    await expect(onFocusMock).toHaveBeenCalledTimes(1)
    await expect(onBlurMock).toHaveBeenCalledTimes(1)
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(4)
    await expect(onUpdateValueMock).toHaveBeenCalledWith('test')
  },
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('')

      return {
        args,
        value,
      }
    },
    template: `
      <Input
          :value="value"
          :icon="args.icon"
          :test-id="args.testId"
          v-model:value="value"
          @blur="args['onBlur']"
          @focus="args['onFocus']"
          @update:value="args['onUpdate:value']"/>
    `,
  }),
}
