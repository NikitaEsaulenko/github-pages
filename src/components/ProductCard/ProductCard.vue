<template>
  <div
    :data-testid="testId"
    class="rrs-product-card">
    <a
      :data-testid="getTestId('link')"
      :href="href"
      class="rrs-product-card__link">
      <!--image-wrapper-->
      <div class="rrs-product-card__image-wrapper">
        <!--image-->
        <img
          :alt="name"
          :data-testid="getTestId('image')"
          :src="image"
          class="rrs-product-card__image" />

        <!--discountPercentage-->
        <div
          v-if="discountPercentage"
          :data-testid="getTestId('discountPercentage')"
          class="rrs-product-card__discount-percentage">
          <span>-</span>{{ discountPercentage }}<span>%</span>
        </div>
      </div>

      <!--info-->
      <div class="rrs-product-card__info">
        <!--price-->
        <div class="rrs-product-card__price-wrapper">
          <span
            :data-testid="getTestId('price')"
            class="rrs-product-card__price">
            {{ props.priceFormatter(price) }}
          </span>
          <span
            v-if="hasDiscount"
            :data-testid="getTestId('oldPrice')"
            class="rrs-product-card__old-price">
            {{ props.priceFormatter(oldPrice) }}
          </span>
        </div>

        <!--name-->
        <div
          :data-testid="getTestId('name')"
          class="rrs-product-card__name">
          {{ name }}
        </div>
      </div>

      <div class="rrs-product-card__rating-wrapper">
        <!--rating-->
        <div
          :data-testid="getTestId('rating')"
          class="rrs-product-card__rating">
          <Icon
            class="rrs-product-card__rating-icon"
            name="star" />
          {{ rating }}
        </div>
        &#183;
        <!--reviewsCount-->
        <div
          :data-testid="getTestId('reviewsCount')"
          class="rrs-product-card__reviews-count">
          {{ props.reviewsCountFormatter(reviewsCount) }}
        </div>
      </div>
    </a>

    <div class="rrs-product-card__btn-wrapper">
      <!--productButton-->
      <button
        :data-testid="'test-id-add'"
        class="rrs-product-button"
        @keydown.prevent.enter.space
        @keyup.enter.space="pointerup"
        @pointerup="emit('addBasket')">
        <span class="rrs-product-button__left" />
        <span class="rrs-product-button__center" />
        <span class="rrs-product-button__right" />
        <span class="rrs-product-button__text">В корзину</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTestId } from '@/use/useTestId'
import { computed } from 'vue'

import Icon from '../Icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    href: string
    image: string
    name: string
    oldPrice: number
    price: number
    priceFormatter?: (price: number) => string
    rating: number
    reviewsCount: number
    reviewsCountFormatter?: (reviewsCount: number) => string
    testId: string
  }>(),
  {
    priceFormatter: (price: number) => {
      return new Intl.NumberFormat('ru', {
        currency: 'RUB',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'currency',
      }).format(price)
    },
    reviewsCountFormatter: (reviewsCount: number) => {
      return new Intl.NumberFormat('en').format(reviewsCount)
    },
  },
)

const emit = defineEmits<{
  (e: 'addBasket'): void
  (e: 'pointerup'): void
}>()

const pointerup = () => {
  emit('pointerup')
}

const { getTestId } = useTestId(props.testId)

const hasDiscount = computed(() => {
  return props.oldPrice > 0
})

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(100 - (props.price / props.oldPrice) * 100)
})
</script>

<style>
.rrs-product-card {
  background-color: var(--rrs-color-white);
  border-radius: 10px;
  color: #000;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  width: 100%;
}

.rrs-product-card__link {
  color: var(--rrs-color-black);
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  width: 100%;
}

.rrs-product-card__image-wrapper {
  align-items: center;
  border-radius: 10px 10px 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
  overflow: hidden;
  overflow: visible;
  padding: 2px;
  position: relative;
}

.rrs-product-card__image {
  height: auto;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  width: auto;
}

.rrs-product-card__discount-percentage {
  align-items: center;
  background-color: #f72a16;
  border-radius: 8px;
  bottom: -6px;
  box-sizing: border-box;
  color: var(--rrs-color-white);
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  left: 12px;
  line-height: 16px;
  outline: 2px solid #fff;
  padding: 2px 4px;
  position: absolute;

  & > span {
    font-size: 10px;
  }
}

.rrs-product-card__rating-wrapper {
  align-items: center;
  display: flex;
  padding: 0 12px;
  width: auto;
}

.rrs-product-card__rating {
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 4px;
  height: 16px;
  line-height: 1;
  width: auto;
}

.rrs-product-card__rating-icon {
  fill: #ffde21 !important;
  font-size: 16px;
}

.rrs-product-card__reviews-count {
  color: var(--rrs-color-grey-400);
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
}

.rrs-product-card__info {
  display: grid;
  gap: 8px;
  margin-top: auto;
  padding: 0 12px;
}

.rrs-product-card__name {
  -webkit-box-orient: vertical;
  color: #000;
  display: -webkit-box;
  font-size: 16px;
  height: 60px;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  line-height: 20px;
  margin: 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rrs-product-card__price-wrapper {
  align-items: center;
  display: inline-flex;
  margin-top: 4px;
  width: auto;
}

.rrs-product-card__price {
  color: #f72a16;
  font-size: 20px;
  font-weight: 800;
  line-height: 24px;
}

.rrs-product-card__old-price {
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  margin-left: 4px;
  position: relative;

  &::before {
    background-color: #f72a16;
    border-radius: 1px;
    content: '';
    display: block;
    height: 1px;
    left: 0;
    margin-top: -1px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: matrix(0.96, -0.21, 0.29, 0.98, 0, 0);
  }
}

.rrs-product-card__btn-wrapper {
  margin-bottom: 0;
  margin-top: 12px;
  padding: 0 12px 12px;

  .rrs-button {
    background-color: #ebf4fd;
    border-radius: 40%;
    color: #0073e6;
    font-size: 16px;
    font-weight: 700;
    height: 40px;
    line-height: 20px;
    min-width: 120px;
    transition: all 0.3s;
    width: 100%;

    &:hover {
      background-color: #d4e7fb;
    }
  }
}

.rrs-product-button__left {
  background-color: #ebf4fd;
  bottom: 0;
  display: block;
  -mask-image: url('/./src/assets/images/back_btn_left.svg');
  left: 0;
  mask-image: url('/./src/assets/images/back_btn_left.svg');
  position: absolute;
  top: 0;
  transition: background-color 0.3s;
  width: 58px;
  z-index: 1;
}

.rrs-product-button__center {
  background-color: #ebf4fd;
  bottom: 0;
  display: block;
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  transition: background-color 0.3s;
  width: calc(100% - 114px);
  z-index: 1;
}

.rrs-product-button__right {
  background-color: #ebf4fd;
  bottom: 0;
  display: block;
  -mask-image: url('/./src/assets/images/back_btn_right.svg');
  mask-image: url('/./src/assets/images/back_btn_right.svg');
  position: absolute;
  right: 0;
  top: 0;
  transition: background-color 0.3s;
  width: 58px;
  z-index: 1;
}

.rrs-product-button {
  align-items: center;
  background: none;
  border: 0;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  min-width: 120px;
  outline: 0;
  padding: 0;
  position: relative;
  text-decoration: none;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
  width: 100%;
  z-index: 1;

  &:hover {
    .rrs-product-button__left,
    .rrs-product-button__center,
    .rrs-product-button__right {
      background-color: #d4e7fb;
    }
  }
}

.rrs-product-button__text {
  align-items: center;
  color: #0073e6;
  display: flex;
  fill: #0073e6;
  font-size: 16px;
  justify-content: center;
  line-height: 20px;
  padding: 0 28px;
  width: 100%;
  z-index: 2;
}
</style>
