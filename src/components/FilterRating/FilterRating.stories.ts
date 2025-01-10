import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import FilterRating from './FilterRating.vue'

const onUpdateValueMock = fn()

const meta = {
  component: FilterRating,
  tags: ['autodocs'],
  title: 'Components/FilterRating',
} satisfies Meta<typeof FilterRating>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:value': onUpdateValueMock,
    testId: 'filter-rating',
    title: 'Рейтинг',
    value: 1,
  },
  play: async ({ canvas, canvasElement, step }) => {
    const rating2 = canvas.getByTestId('filter-rating-rating-2')
    const rating3 = canvas.getByTestId('filter-rating-rating-3')
    const ratingAny = canvas.getByTestId('filter-rating-any')

    await step('select Option 2', async () => {
      await userEvent.click(rating2)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(2)
      onUpdateValueMock.mockClear()
    })

    await step('select Option 3', async () => {
      await userEvent.click(rating3)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(3)
      onUpdateValueMock.mockClear()
    })

    await step('select any', async () => {
      await userEvent.click(ratingAny)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(1)
      await expect(onUpdateValueMock).toHaveBeenCalledWith(undefined)
      onUpdateValueMock.mockClear()
      await userEvent.click(canvasElement)
    })
  },
  render: (args) => ({
    components: { FilterRating },
    setup() {
      const value = ref(1)

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <FilterRating
              :title="args.title"
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"
          />
        `,
  }),
}
