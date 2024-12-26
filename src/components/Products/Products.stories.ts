import type { Meta, StoryObj } from '@storybook/vue3'

import image from '@/assets/images/product.png'
import { expect, fn, userEvent } from '@storybook/test'

import Products from './Products.vue'

const onAddBasketMock = fn()

const meta = {
  component: Products,
  tags: ['autodocs'],
  title: 'Components/Products',
} satisfies Meta<typeof Products>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ['onAddBasket']: onAddBasketMock,
    products: Array.from({ length: 3 }, () => ({
      href: 'javascript:void(0)',
      id: 1,
      image: image,
      name: 'Смартфон Apple iPhone 15 Pro 128GB Natural Titanium (Dual Sim)',
      oldPrice: 116999,
      price: 112999,
      rating: 4.9,
      reviewsCount: 2399,
    })),
    testId: 'test-id',
  },
  play: async ({ canvas, canvasElement, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-product-0')).toBeVisible()
    })

    await step('should emit add basket event', async () => {
      await userEvent.click(canvas.getByTestId('test-id-product-card-0-add'))
      await expect(onAddBasketMock).toHaveBeenCalled()
    })

    await userEvent.click(canvasElement)
  },
  render: (args) => ({
    components: { Products },
    setup() {
      return {
        args,
      }
    },
    template: `
          <Products
              :products="args.products"
              :test-id="args.testId"
              @add-basket="args['onAddBasket']"/>
        `,
  }),
}

export const Slot: Story = {
  args: {
    products: Array.from({ length: 3 }, () => ({
      href: 'javascript:void(0)',
      id: 1,
      image: image,
      name: 'Смартфон Apple iPhone 15 Pro 128GB Natural Titanium (Dual Sim)',
      oldPrice: 116999,
      price: 112999,
      rating: 4.9,
      reviewsCount: 2399,
    })),
    testId: 'test-id',
  },
  play: async ({ canvas, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-product-0')).toBeVisible()
      await expect(canvas.getByTestId('test-id-product-0')).toHaveTextContent(
        'Смартфон Apple iPhone 15 Pro 128GB Natural Titanium (Dual Sim)',
      )
    })
  },
  render: (args) => ({
    components: { Products },
    setup() {
      return {
        args,
      }
    },
    template: `
          <Products
              :products="args.products"
              :test-id="args.testId">
            <template #default="{product, productIndex}">
              {{product.name}}
            </template>
          </Products>
        `,
  }),
}
