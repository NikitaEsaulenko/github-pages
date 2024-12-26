import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterSwitch from './FilterSwitch.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterSwitch,
  tags: ['autodocs'],
  title: 'Components/FilterSwitch',
} satisfies Meta<typeof FilterSwitch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    title: 'Доступен на складе',
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
    components: { FilterSwitch },
    setup() {
      const value = ref(false)

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterSwitch
              :style="{maxWidth: '200px'}"
              :title="args.title"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
