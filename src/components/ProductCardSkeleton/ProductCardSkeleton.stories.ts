import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from '@storybook/test'

import ProductCardSkeleton from './ProductCardSkeleton.vue'

const meta = {
  component: ProductCardSkeleton,
  tags: ['autodocs'],
  title: 'Components/ProductCardSkeleton',
} satisfies Meta<typeof ProductCardSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    testId: 'test-id',
  },
  play: async ({ canvas, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id')).toBeVisible()
    })
  },
  render: (args) => ({
    components: { ProductCardSkeleton },
    setup() {
      return {
        args,
      }
    },
    template: `
          <ProductCardSkeleton
              :style="{width: '200px'}"
              :test-id="args.testId"/>
        `,
  }),
}
