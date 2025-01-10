import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterRadio from './FilterRadio.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterRadio,
  tags: ['autodocs'],
  title: 'Components/FilterRadio',
} satisfies Meta<typeof FilterRadio>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [
      {
        description: '1',
        text: '1-2 часа',
        value: 1,
      },
      {
        text: 'Сегодня',
        value: 2,
      },
      {
        text: 'Завтра',
        value: 3,
      },
      {
        text: 'Сегодня или завтра',
        value: 4,
      },
      {
        text: 'До 5 дней',
        value: 5,
      },
    ],
    'onUpdate:value': onUpdateValueMock,
    testId: 'filter-radio',
    title: 'Срок доставки',
    value: 1,
  },
  play: async ({ canvas, canvasElement, step }) => {
    const radioItem1 = canvas.getByTestId('filter-radio-item-0')
    const radioItem2 = canvas.getByTestId('filter-radio-item-1')
    const radioItem3 = canvas.getByTestId('filter-radio-item-2')

    await step('select Option 2', async () => {
      await userEvent.click(radioItem2)
      await expect(radioItem1).toHaveTextContent('1-2 часа 1')
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(2)
      onUpdateValueMock.mockClear()
    })

    await step('select Option 3', async () => {
      await userEvent.click(radioItem3)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(3)
      onUpdateValueMock.mockClear()
    })

    await step('select Option 1 again', async () => {
      await userEvent.click(radioItem1)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(1)
      onUpdateValueMock.mockClear()
      await userEvent.click(canvasElement)
    })
  },
  render: (args) => ({
    components: { FilterRadio },
    setup() {
      const value = ref()
      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterRadio
              :title="args.title"
              :data="args.data"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}
