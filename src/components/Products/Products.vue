<template>
  <div class="rrs-products">
    <div
      v-for="(product, productIndex) in products"
      :key="product.id"
      :data-testid="getTestId(`product-${productIndex}`)"
      class="rrs-products__product">
      <slot
        :product="product"
        :product-index="productIndex">
        <ProductCard
          :href="product.href"
          :image="product.image"
          :name="product.name"
          :old-price="product.oldPrice"
          :price="product.price"
          :rating="product.rating"
          :reviews-count="product.reviewsCount"
          :test-id="getTestId(`product-card-${productIndex}`)"
          @add-basket="addBasket(product.id)" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/Product'

import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { useTestId } from '@/use/useTestId'

const props = defineProps<{
  products: Product[]
  testId: string
}>()

const emit = defineEmits<{
  (e: 'addBasket', productId: number): void
}>()

defineSlots<{
  default(props: { product: Product; productIndex: number }): void
}>()

const { getTestId } = useTestId(props.testId)

const addBasket = (productId: number) => {
  emit('addBasket', productId)
}
</script>

<style>
.rrs-products {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 1fr);
}

.rrs-products__product {
  align-items: flex-start;
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  width: 100%;
}
</style>
