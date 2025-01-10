import type { Meta, StoryObj } from '@storybook/vue3'

import image from '@/assets/images/product.png'
import { serpEmitterInjectionKey } from '@/components/WebCmpSERP/Ports/Emitter'
import { wait } from '@/helpers/wait'
import { expect, fn } from '@storybook/test'
import { Ok } from '@thames/monads'
import { provide } from 'vue'

import {
  type SearchProductsDelegate,
  searchProductsDelegateInjectionKey,
} from './Ports/SearchProducts'
import WebCmpSERP from './WebCmpSERP.vue'

const meta = {
  component: WebCmpSERP,
  tags: ['autodocs'],
  title: 'WebCmpSERP',
} satisfies Meta<typeof WebCmpSERP>

export default meta

type Story = StoryObj<typeof meta>

const emitterSpy = fn()

const searchProductsMock = fn<SearchProductsDelegate>(async () => {
  await wait(1000)
  return Ok({
    filters: [
      {
        id: 'diagonal',
        max: 60,
        min: 20,
        step: 1,
        title: 'Цена',
        type: 'RangeWithSlider',
        value: {
          from: 30,
          to: null,
        },
      },
      {
        id: 'diagonal',
        max: 60,
        min: 20,
        step: 1,
        title: 'Диагональ',
        type: 'Range',
        value: {
          from: null,
          to: null,
        },
      },
    ],
    pagesCount: 3,
    products: Array.from({ length: 3 }, (_, i) => ({
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
    productsCount: 1,
  })
})

const searchProductsMockEmpty = fn<SearchProductsDelegate>(async () => {
  await wait(1000)
  return Ok({
    filters: [],
    pagesCount: 0,
    products: [],
    productsCount: 0,
  })
})

export const Default: Story = {
  play: async () => {
    await expect(emitterSpy).toHaveBeenCalledTimes(1)
  },
  render: () => ({
    components: { WebCmpSERP },
    setup() {
      provide(searchProductsDelegateInjectionKey, searchProductsMock)
      provide(serpEmitterInjectionKey, {
        emit: () => {},
        on: emitterSpy,
      })
    },
    template: `
          <WebCmpSERP/>
        `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { WebCmpSERP },
    setup() {
      provide(searchProductsDelegateInjectionKey, searchProductsMockEmpty)
      provide(serpEmitterInjectionKey, {
        emit: () => {},
        on: emitterSpy,
      })
    },
    template: `
          <WebCmpSERP/>
        `,
  }),
}
