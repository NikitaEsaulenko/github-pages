import type { Meta, StoryObj } from '@storybook/vue3'

import { expect, fn, userEvent } from '@storybook/test'
import { ref } from 'vue'

import Pagination from './Pagination.vue'

const onUpdatePageMock = fn()

const meta = {
  component: Pagination,
  tags: ['autodocs'],
  title: 'Components/Pagination',
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'onUpdate:page': onUpdatePageMock,
    page: 1,
    pagesCount: 10,
    range: 5,
    testId: 'test-id',
  },
  play: async ({ canvas, canvasElement, step }) => {
    await step('should emit update on page click', async () => {
      await userEvent.click(canvas.getByTestId('test-id-page-2'))
      await expect(onUpdatePageMock).toHaveBeenCalledTimes(1)
      await expect(onUpdatePageMock).toHaveBeenCalledWith(2)
    })

    await step('should not emit update on same page click', async () => {
      await userEvent.click(canvas.getByTestId('test-id-page-2'))
      await expect(onUpdatePageMock).toHaveBeenCalledTimes(1)
    })

    await step('should emit update on page click', async () => {
      await userEvent.click(canvas.getByTestId('test-id-next'))
      await expect(onUpdatePageMock).toHaveBeenCalledTimes(2)
      await expect(onUpdatePageMock).toHaveBeenCalledWith(3)
    })

    await userEvent.click(canvasElement)
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const value = ref(1)
      return {
        args,
        value,
      }
    },
    template: `
          <Pagination
              v-model:page="value"
              :pagesCount="args.pagesCount"
              :range="args.range"
              :test-id="args.testId"
              @update:page="args['onUpdate:page']"/>
        `,
  }),
}
