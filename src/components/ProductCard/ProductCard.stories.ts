import type { Meta, StoryObj } from '@storybook/vue3'

import image from '@/assets/images/product.png'
import { expect, fn, userEvent } from '@storybook/test'

import ProductCard from './ProductCard.vue'

const onAddBasketMock = fn()

const meta = {
  component: ProductCard,
  tags: ['autodocs'],
  title: 'Components/ProductCard',
} satisfies Meta<typeof ProductCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: 'javascript:void(0)',
    image: image,
    name: 'Смартфон Apple iPhone 15 Pro 128GB Natural Titanium (Dual Sim)',
    oldPrice: 116999,
    ['onAddBasket']: onAddBasketMock,
    price: 112999,
    rating: 4.9,
    reviewsCount: 2399,
    testId: 'test-id',
  },
  play: async ({ canvas, step }) => {
    await step('check render', async () => {
      await expect(canvas.getByTestId('test-id-link').getAttribute('href')).toBe(
        'javascript:void(0)',
      )
      await expect(canvas.getByTestId('test-id-image').getAttribute('src')).toBe(image)
      await expect(canvas.getByTestId('test-id-discountPercentage')).toHaveTextContent('3%')
      await expect(canvas.getByTestId('test-id-rating')).toHaveTextContent('4.9')
      await expect(canvas.getByTestId('test-id-reviewsCount')).toHaveTextContent('2,399')
      await expect(canvas.getByTestId('test-id-name')).toHaveTextContent(
        'Смартфон Apple iPhone 15 Pro 128GB Natural Titanium (Dual Sim)',
      )
      await expect(canvas.getByTestId('test-id-price')).toHaveTextContent('112 999,00 ₽')
      await expect(canvas.getByTestId('test-id-oldPrice')).toHaveTextContent('116 999,00 ₽')
    })

    await step('should emit add basket event', async () => {
      await userEvent.click(canvas.getByTestId('test-id-add'))
      await expect(onAddBasketMock).toHaveBeenCalled()
    })
  },
  render: (args) => ({
    components: { ProductCard },
    setup() {
      return {
        args,
      }
    },
    template: `
          <ProductCard
              :style="{width: '200px'}"
              :href="args.href"
              :image="args.image"
              :name="args.name"
              :oldPrice="args.oldPrice"
              :price="args.price"
              :rating="args.rating"
              :reviewsCount="args.reviewsCount"
              :test-id="args.testId"
              @add-basket="args['onAddBasket']"/>
        `,
  }),
}
