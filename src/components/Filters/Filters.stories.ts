import type { Filter } from '@/types/Filter'
import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Filters from './Filters.vue'

const onUpdateValueMock = fn()

const meta = {
  component: Filters,
  tags: ['autodocs'],
  title: 'Components/Filters',
} satisfies Meta<typeof Filters>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:value': onUpdateValueMock,
    testId: 'test-id',
    value: [],
  },
  play: async ({ canvas, canvasElement, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-filter-0')).toBeVisible()
      await expect(canvas.getByTestId('test-id-filter-1')).toBeVisible()
      await expect(canvas.getByTestId('test-id-filter-2')).toBeVisible()
    })

    await step('should emit update value', async () => {
      await userEvent.type(canvas.getByTestId('test-id-range-from'), '1')
      await userEvent.click(canvas.getByTestId('test-id-radio-item-0'))
      await userEvent.click(canvas.getByTestId('test-id-rating-rating-5'))
      await userEvent.click(canvasElement)
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(3)
      await expect(onUpdateValueMock).toHaveBeenCalledWith([
        {
          id: 'diagonal',
          max: 10,
          min: -10,
          step: 1,
          title: 'Цена',
          type: 'RangeWithSlider',
          value: {
            from: null,
            to: null,
          },
        },
        {
          id: 'price',
          max: 10,
          min: -10,
          title: 'Цена',
          type: 'Range',
          value: {
            from: 1,
            to: null,
          },
        },
        {
          id: 'availableInStock',
          title: 'Доступен на складе',
          type: 'Switch',
          value: false,
        },
        {
          data: [
            { text: '1-2 часа', value: 1 },
            { text: 'Сегодня', value: 2 },
            { text: 'Завтра', value: 3 },
            { text: 'Сегодня или завтра', value: 4 },
            { text: 'До 5 дней', value: 5 },
            { text: 'Любой', value: 'any' },
          ],
          id: 'delivery-time',
          title: 'Срок доставки',
          type: 'Radio',
          value: 1,
        },
        {
          id: 'rating',
          title: 'Рейтинг',
          type: 'Rating',
          value: 5,
        },
        {
          data: [
            {
              text: 'Dell',
              value: 1,
            },
            {
              text: 'Samsung',
              value: 2,
            },
            {
              text: 'Hyundai',
              value: 3,
            },
          ],
          id: 'producer',
          title: 'Производитель',
          type: 'Checkbox',
          value: [3],
        },
      ])
    })

    await step('reset', async () => {
      await userEvent.click(canvas.getByTestId('test-id-reset-filters'))
      await expect(onUpdateValueMock).toHaveBeenCalledTimes(4)
      await expect(onUpdateValueMock).toHaveBeenCalledWith([
        {
          id: 'diagonal',
          max: 10,
          min: -10,
          step: 1,
          title: 'Цена',
          type: 'RangeWithSlider',
          value: {
            from: null,
            to: null,
          },
        },
        {
          id: 'price',
          max: 10,
          min: -10,
          title: 'Цена',
          type: 'Range',
          value: {
            from: null,
            to: null,
          },
        },
        {
          id: 'availableInStock',
          title: 'Доступен на складе',
          type: 'Switch',
          value: false,
        },
        {
          data: [
            { text: '1-2 часа', value: 1 },
            { text: 'Сегодня', value: 2 },
            { text: 'Завтра', value: 3 },
            { text: 'Сегодня или завтра', value: 4 },
            { text: 'До 5 дней', value: 5 },
            { text: 'Любой', value: 'any' },
          ],
          id: 'delivery-time',
          title: 'Срок доставки',
          type: 'Radio',
          value: undefined,
        },
        {
          id: 'rating',
          title: 'Рейтинг',
          type: 'Rating',
          value: undefined,
        },
        {
          data: [
            {
              text: 'Dell',
              value: 1,
            },
            {
              text: 'Samsung',
              value: 2,
            },
            {
              text: 'Hyundai',
              value: 3,
            },
          ],
          id: 'producer',
          title: 'Производитель',
          type: 'Checkbox',
          value: [],
        },
      ])
    })
  },
  render: (args) => ({
    components: { Filters },
    setup() {
      const value = ref<Filter[]>([
        {
          id: 'diagonal',
          max: 10,
          min: -10,
          step: 1,
          title: 'Цена',
          type: 'RangeWithSlider',
          value: {
            from: null,
            to: null,
          },
        },
        {
          id: 'price',
          max: 10,
          min: -10,
          title: 'Цена',
          type: 'Range',
          value: {
            from: null,
            to: null,
          },
        },
        {
          id: 'availableInStock',
          title: 'Доступен на складе',
          type: 'Switch',
          value: false,
        },
        {
          data: [
            { text: '1-2 часа', value: 1 },
            { text: 'Сегодня', value: 2 },
            { text: 'Завтра', value: 3 },
            { text: 'Сегодня или завтра', value: 4 },
            { text: 'До 5 дней', value: 5 },
            { text: 'Любой', value: 'any' },
          ],
          id: 'delivery-time',
          title: 'Срок доставки',
          type: 'Radio',
          value: 'any',
        },
        {
          id: 'rating',
          title: 'Рейтинг',
          type: 'Rating',
          value: undefined,
        },
        {
          data: [
            {
              text: 'Dell',
              value: 1,
            },
            {
              text: 'Samsung',
              value: 2,
            },
            {
              text: 'Hyundai',
              value: 3,
            },
          ],
          id: 'producer',
          title: 'Производитель',
          type: 'Checkbox',
          value: [3],
        },
      ])

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <Filters
              :test-id="args.testId"
              v-model:value="value"
              @update:value="onUpdateValueMock"/>
        `,
  }),
}

export const Slot: Story = {
  args: {
    testId: 'test-id',
    value: [],
  },
  play: async ({ canvas, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-filter-0')).toBeVisible()
      await expect(canvas.getByTestId('test-id-filter-0')).toHaveTextContent('0')
    })
  },
  render: (args) => ({
    components: { Filters },
    setup() {
      const value = ref<Filter[]>([
        {
          id: 'availableInStock',
          title: 'Доступен на складе',
          type: 'Switch',
          value: false,
        },
      ])

      return {
        args,
        onUpdateValueMock,
        value,
      }
    },
    template: `
          <Filters
              :test-id="args.testId"
              v-model:value="value">
            <template #default="{filter, filterIndex}">
              <div v-if="filter.type === 'Switch'">{{ filterIndex }}</div>
            </template>
          </Filters>
        `,
  }),
}
