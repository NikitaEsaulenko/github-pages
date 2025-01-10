<template>
  <div
    :data-testid="testId"
    class="rrs-product-card-skeleton">
    <span class="rrs-product-card-skeleton__image-wrapper" />
    <span class="rrs-product-card-skeleton__rating-wrapper" />
    <div class="rrs-product-card-skeleton__info">
      <span class="rrs-product-card-skeleton__name" />
      <span class="rrs-product-card-skeleton__price-wrapper" />
    </div>
    <span class="rrs-product-card-skeleton__button" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  testId: string
}>()
</script>

<style>
@keyframes skeleton {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.rrs-product-card-skeleton {
  display: grid;
  gap: 12px;
  height: auto;
  width: 100%;
}

.rrs-product-card-skeleton span {
  animation: skeleton 1.5s infinite;
  background-color: var(--rrs-color-grey-50);
  background-image: linear-gradient(
    90deg,
    transparent 25%,
    var(--rrs-color-grey-200) 50%,
    transparent 75%
  );
  background-position: 0 0;
  background-size: 200% 100%;
  border-radius: 4px;
}

.rrs-product-card-skeleton__image-wrapper {
  border-radius: 12px;
  height: 168px;
  width: 100%;
}

.rrs-product-card-skeleton__rating-wrapper {
  height: 16px;
  width: 25%;
}

.rrs-product-card-skeleton__info {
  display: grid;
  gap: 8px;
  height: auto;
  width: 100%;
}

.rrs-product-card-skeleton__name {
  height: 40px;
  width: 100%;
}

.rrs-product-card-skeleton__price-wrapper {
  height: 24px;
  width: 50%;
}

.rrs-product-card-skeleton__button {
  border-radius: 8px;
  height: 36px;
  width: 100%;
}
</style>
