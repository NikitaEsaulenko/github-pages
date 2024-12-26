import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Switch from './Switch.vue'

const onUpdateValueMock = fn()

const meta = {
  component: Switch,
  tags: ['autodocs'],
  title: 'Components/Switch',
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    value: false,
  },
  play: async ({ canvas }) => {
    const element = canvas.getByTestId('test-id')

    await userEvent.click(element)
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
    await expect(onUpdateValueMock).toHaveBeenCalledWith(true)
    onUpdateValueMock.mockClear()

    await userEvent.click(element)
    await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
    await expect(onUpdateValueMock).toHaveBeenCalledWith(false)
  },
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(false)

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <Switch
              :title="args.title"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
