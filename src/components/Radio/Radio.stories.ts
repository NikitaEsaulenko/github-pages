import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Radio from './Radio.vue'

const onUpdateValueMock = fn()

const meta = {
  component: Radio,
  tags: ['autodocs'],
  title: 'Components/Radio',
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    description: 'description',
    disabled: false,
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    text: 'Radio',
    value: false,
  },
  play: async ({ canvas }) => {
    const radio = canvas.getByTestId('test-id')

    await expect(radio).toHaveTextContent('Radio description')

    await userEvent.click(radio)
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
    await expect(onUpdateValueMock).toHaveBeenCalledWith(true)
  },
  render: (args) => ({
    components: { Radio },
    setup() {
      const value = ref(args.value)
      return {
        args,
        value,
      }
    },
    template: `
          <Radio
              :text="args.text"
              :disabled="args.disabled"
              :description="args.description"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="args['onUpdate:value']"/>
        `,
  }),
}

export const Checked: Story = {
  ...Default,
  args: {
    ...Default.args,
    value: true,
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByTestId('test-id'))
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(0)
  },
}
