import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from '@storybook/test'

import ProductsSkeleton from './ProductsSkeleton.vue'

const meta = {
  component: ProductsSkeleton,
  tags: ['autodocs'],
  title: 'Components/ProductsSkeleton',
} satisfies Meta<typeof ProductsSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    count: 12,
    testId: 'test-id',
  },
  play: async ({ canvas, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-product-skeleton-1')).toBeVisible()
      await expect(canvas.getByTestId('test-id-product-skeleton-12')).toBeVisible()
    })
  },
  render: (args) => ({
    components: { ProductsSkeleton },
    setup() {
      return {
        args,
      }
    },
    template: `
          <ProductsSkeleton
              :count="args.count"
              :test-id="args.testId"/>
        `,
  }),
}
