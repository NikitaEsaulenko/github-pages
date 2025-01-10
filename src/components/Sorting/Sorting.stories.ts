import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Sorting from './Sorting.vue'

const onUpdateValueMock = fn()

const meta = {
  component: Sorting,
  tags: ['autodocs'],
  title: 'Components/Sorting',
} satisfies Meta<typeof Sorting>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    value: '',
  },
  play: async ({ canvas, canvasElement }) => {
    const component = canvas.getByTestId('test-id')
    await expect(component).toHaveTextContent('By popular')

    await userEvent.click(component)

    await expect(canvas.queryByTestId('test-id-options')).toBeVisible()

    await userEvent.click(canvas.getByTestId('test-id-option-1'))

    await expect(component).toHaveTextContent('By relevance')
    await expect(onUpdateValueMock).toHaveBeenCalledWith('relevance')
    await expect(canvas.queryByTestId('test-id-options')).toBeNull()

    await userEvent.click(canvasElement)
  },
  render: (args) => ({
    components: { Sorting },
    setup() {
      const value = ref('')

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <Sorting
              :value="value"
              :options="args.options"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
