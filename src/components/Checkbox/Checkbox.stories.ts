import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Checkbox from './Checkbox.vue'

const onUpdateValueMock = fn()

const meta = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'Components/Checkbox',
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    description: 'description',
    disabled: false,
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    text: 'Checkbox',
    value: false,
  },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByTestId('test-id')

    await expect(checkbox).toHaveTextContent('Checkbox description')

    await userEvent.click(checkbox)
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
    await expect(onUpdateValueMock).toHaveBeenCalledWith(true)
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)

      return {
        args,
        value,
      }
    },
    template: `
      <Checkbox
        :text="args.text"
        :disabled="args.disabled"
        :description="args.description"
        :test-id="args.testId"
        v-model:value="value"
        @update:value="args['onUpdate:value']"/>
    `,
  }),
}
