import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterCheckbox from './FilterCheckbox.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterCheckbox,
  tags: ['autodocs'],
  title: 'Components/FilterCheckbox',
} satisfies Meta<typeof FilterCheckbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [
      {
        description: '1',
        text: 'Apple',
        value: 1,
      },
      {
        text: 'Xiaomi',
        value: 2,
      },
      {
        text: 'Samsung',
        value: 3,
      },
      {
        text: 'realme',
        value: 4,
      },
      {
        text: 'HONOR',
        value: 5,
      },
      {
        text: 'POCO',
        value: 6,
      },
    ],
    testId: 'test-id',
    title: 'Производитель',
    value: [1, 3],
    visible: 5,
  },
  play: async ({ canvas, canvasElement, step }) => {
    const checkbox1 = canvas.getByTestId('test-id-item-0')
    const checkbox2 = canvas.getByTestId('test-id-item-2')

    await step('update value', async () => {
      await userEvent.click(checkbox1)
      await expect(checkbox1).toHaveTextContent('Apple 1')
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith([3])
    })

    await step('nothing picked', async () => {
      await userEvent.click(checkbox2)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(2)
      await expect(onUpdateValueMock).toHaveBeenCalledWith([])
      onUpdateValueMock.mockClear()
    })

    await userEvent.click(canvasElement)
  },
  render: (args) => ({
    components: { FilterCheckbox },
    setup() {
      const value = ref([1, 3])

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterCheckbox
              :visible="args.visible"
              :data="args.data"
              :title="args.title"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
