<template>
  <div class="rrs-products-skeleton">
    <div
      v-for="index in count"
      :key="index"
      :data-testid="getTestId(`product-${index}`)"
      class="rrs-products-skeleton__product">
      <slot :index="index">
        <ProductCardSkeleton :test-id="getTestId(`product-skeleton-${index}`)" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCardSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton.vue'
import { useTestId } from '@/use/useTestId'

const props = defineProps<{
  count: number
  testId: string
}>()

defineSlots<{
  default(props: { index: number }): void
}>()

const { getTestId } = useTestId(props.testId)
</script>

<style>
.rrs-products-skeleton {
  display: grid;
  gap: 24px 12px;
  grid-template-columns: repeat(auto-fill, minmax(198px, 1fr));
}

.rrs-products-skeleton__product {
  align-items: flex-start;
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
  min-height: 291px;
  min-width: 198px;
  padding: 12px;
  width: 100%;
}
</style>
