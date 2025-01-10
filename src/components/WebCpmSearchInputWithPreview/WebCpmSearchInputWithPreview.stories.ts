import type { Meta, StoryObj } from '@storybook/vue3'

import image from '@/assets/images/product.png'
import { searchInputWithPreviewEmitterInjectionKey } from '@/components/WebCpmSearchInputWithPreview/Ports/Emitter'
import { wait } from '@/helpers/wait'
import { expect, fn, userEvent, waitFor } from '@storybook/test'
import { Ok } from '@thames/monads'
import { provide } from 'vue'

import {
  type PreviewProductsDelegate,
  previewProductsDelegateInjectionKey,
} from './Ports/PreviewProducts'
import WebCpmSearchInputWithPreview from './WebCpmSearchInputWithPreview.vue'

const meta = {
  component: WebCpmSearchInputWithPreview,
  tags: ['autodocs'],
  title: 'WebCpmSearchInputWithPreview',
} satisfies Meta<typeof WebCpmSearchInputWithPreview>

export default meta

type Story = StoryObj<typeof meta>

const emitterSpy = fn()

const previewProducts = fn<PreviewProductsDelegate>(async () => {
  await wait(1000)
  return Ok({
    products: Array.from({ length: 6 }, (_, i) => ({
      discountPercentage: 0,
      href: 'javascript:void(0)',
      id: i + 1,
      image: image,
      name: `Продукт ${i + 1}`,
      oldPrice: 1000,
      price: 900,
      rating: 5,
      reviewsCount: 1,
    })),
    redirects: Array.from({ length: 3 }, (_, i) => ({
      href: 'javascript:void(0)',
      text: `Интересная новость номер - ${i + 1}`,
    })),
    suggestions: Array.from({ length: 3 }, (_, i) => `Смартфон iPhone ${i + 1}`),
  })
})

export const Default: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByTestId('search-input'), 'Продукт')
    await waitFor(() =>
      expect(previewProducts).toHaveBeenCalledWith({
        phrase: 'Продукт',
      }),
    )
    await waitFor(() => expect(canvas.getByTestId('suggestion-0')).toBeVisible())

    await userEvent.click(canvas.getByTestId('search-button'))
    await expect(emitterSpy).toHaveBeenCalledWith('Продукт')
  },
  render: () => ({
    components: { WebCpmSearchInputWithPreview },
    setup() {
      provide(previewProductsDelegateInjectionKey, previewProducts)
      provide(searchInputWithPreviewEmitterInjectionKey, {
        emit: emitterSpy,
        on: () => {},
      })
    },
    template: `
          <WebCpmSearchInputWithPreview/>
        `,
  }),
}
