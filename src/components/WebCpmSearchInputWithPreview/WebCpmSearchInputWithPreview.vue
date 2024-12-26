<template>
  <div class="rrs-search-bar">
    <div
      ref="rootEl"
      class="rrs-search"
      @pointerdown="showPreview">
      <div
        v-show="state.isShowPreview"
        class="rrs-search-backdrop" />

      <div class="rrs-search-input">
        <button
          class="search-button"
          @keydown.enter="search">
          <Icon
            name="search"
            class="rrs-button__icon" />
          Поиск
        </button>
        <!--<Input
          v-model:value="state.userInput"
          :placeholder="t('placeholder')"
          test-id="search-input"
          icon="search"
          @keydown.enter="search"
          @update:value="searchPreview" />-->
      </div>

      <div
        v-show="/*state.userInput && previewDataIsNotEmpty && */state.isShowPreview"
        class="rrs-preview">
        <SearchInput
          v-model:value="state.userInput"
          :placeholder="t('placeholder')"
          test-id="search-input"
          icon="search"
          @keydown.enter="search"
          @update:value="searchPreview" />
        <div
          v-show="state.suggestions.length > 0"
          class="rrs-preview__suggestion">
          <Suggestion
            v-for="(suggestion, index) in state.suggestions"
            :key="index"
            :test-id="`suggestion-${index}`"
            :suggestion="suggestion"
            @pointerup="selectSuggestion(suggestion)" />
        </div>
        <Carousel
          v-show="state.products.length > 0"
          test-id="carousel">
          <div
            v-for="(product, index) in state.products"
            :key="product.id"
            class="rrs-preview__product">
            <ProductCard
              :href="product.href"
              :image="product.image"
              :name="product.name"
              :old-price="product.oldPrice"
              :price="product.price"
              :rating="product.rating"
              :reviews-count="product.reviewsCount"
              :test-id="`product-${index}`" />
          </div>
        </Carousel>
        <div
          v-show="state.redirects.length > 0"
          class="rrs-preview__redirects">
          <Redirects
            v-for="(redirect, index) in state.redirects"
            :key="index"
            :value="redirect"
            :test-id="`redirect-${index}`" />
        </div>
      </div>
    </div>
    <div class="rrs-search-bar__promo">
      <a href="#">&nbsp;</a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="percent">&nbsp;</span>
        <span class="text">Акции</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Одежда и обувь</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Подгузники и гигиена</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Питание и кормление</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Игрушки и игры</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Детская комната</span>
      </a>
    </div>
    <div class="rrs-search-bar__item">
      <a href="#">
        <span class="text">Прогулки и путешествия</span>
      </a>
    </div>
    <div class="rrs-search-bar__item border">
      <a href="#">
        <span class="text">Канцтовары и товары для школы</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreviewProduct } from '@/types/PreviewProduct'
import type { PreviewRedirect } from '@/types/PreviewRedirect'
import type { PreviewSuggestion } from '@/types/PreviewSuggestion'

import Icon from '@/components/Icon/Icon.vue'
//import Button from '@/components/Button/Button.vue'
import Carousel from '@/components/Carousel/Carousel.vue'
import SearchInput from '@/components/Input/InputSearch.vue'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import Redirects from '@/components/Redirects/Redirect.vue'
import Suggestion from '@/components/Suggestion/Suggestion.vue'
import { searchInputWithPreviewEmitterInjectionKey } from '@/components/WebCpmSearchInputWithPreview/Ports/Emitter'
import { previewProductsDelegateInjectionKey } from '@/components/WebCpmSearchInputWithPreview/Ports/PreviewProducts'
import { getQueryParams } from '@/helpers/getQueryParams'
import { isEventOutside } from '@/helpers/isEventOutside'
import { useInjected } from '@/use/useInjected'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const getPreviewProducts = useInjected(previewProductsDelegateInjectionKey)
const emitter = useInjected(searchInputWithPreviewEmitterInjectionKey)

const state = reactive<{
  isShowPreview: boolean
  products: PreviewProduct[]
  redirects: PreviewRedirect[]
  suggestions: PreviewSuggestion[]
  userInput: string
}>({
  isShowPreview: false,
  products: [],
  redirects: [],
  suggestions: [],
  userInput: '',
})

const { t } = useI18n({
  messages: {
    en: {
      placeholder: 'Search',
      search: 'Search',
    },
    ru: {
      placeholder: 'Поиск',
      search: 'Поиск',
    },
  },
})

const rootEl = ref<HTMLDivElement>()

const previewDataIsNotEmpty = computed(() => {
  return state.products.length > 0 || state.redirects.length > 0 || state.suggestions.length > 0
})

const searchPreview = async () => {
  await getPreviewProducts({
    phrase: state.userInput,
  }).then((x) => {
    x.match({
      err: async () => {
        state.products = []
        state.redirects = []
        state.suggestions = []
      },
      ok: async (x) => {
        state.products = x.products
        state.redirects = x.redirects
        state.suggestions = x.suggestions
      },
    })
  })
}

const selectSuggestion = (suggestion: PreviewSuggestion) => {
  state.userInput = suggestion
  search()
}

const search = () => {
  hidePreview()
  emitter.emit(state.userInput)
}

const showPreview = () => {
  state.isShowPreview = true
}

const hidePreview = () => {
  state.isShowPreview = false
}

const pointerUpHandler = (e: PointerEvent) => {
  if (state.isShowPreview && rootEl.value) {
    if (isEventOutside(rootEl.value, e)) {
      hidePreview()
    }
  }
}

onMounted(async () => {
  const { phrase } = getQueryParams(window.location.search)
  if (phrase?.length) {
    state.userInput = phrase
    await searchPreview()
  }
  window.addEventListener('pointerup', pointerUpHandler)
})

onBeforeMount(() => {
  window.removeEventListener('pointerup', pointerUpHandler)
})
</script>

<style>
.rrs-search-bar {
  box-sizing: border-box;
  display: flex;
  height: 52px;
  justify-content: flex-end;
  position: relative;
  width: 100%;
}

.rrs-search-bar__promo,
.rrs-search-bar__item {
  align-items: center;
  background-color: #0073e6;
  background-image: url('https://go.detmir.st/images/uiconfigs/224ef2e0b0e25057b768ab015531c67a7edbb789/e8285534edb2a9454a6612d4990e6ef55314f14f.jpg');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  height: 52px;
  justify-content: center;
  max-width: 150px;
  min-width: 120px;

  & > a {
    align-items: center;
    box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    height: 100%;
    justify-content: center;
    line-height: 16px;
    padding: 0 8px;
    text-align: center;
    text-decoration: none;
    transition:
      transform 0.15s,
      opacity 0.15s;
    width: 100%;
  }
}

.rrs-search-bar__item {
  background-image: none;
  max-width: calc(12.5%);
  width: 100%;

  &.border {
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
  }
}

.rrs-search {
  width: 100%;
  z-index: 2;
}

.rrs-search-backdrop {
  backdrop-filter: blur(2px);
  background-color: color-mix(in srgb, var(--rrs-color-brand) 20%, transparent);
  content: '';
  height: 100%;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 100%;
}

.search-button {
  align-items: center;
  appearance: none;
  background-color: var(--rrs-color-white);
  border: none;
  border-radius: 8px 0 0 8px;
  box-sizing: border-box;
  color: #000;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  gap: 10px;
  height: 100%;
  justify-content: center;
  line-height: 20px;
  outline: none;
  padding: 8px 16px;
  width: 100%;
}

.rrs-button__icon {
  color: #0073e6;
  font-size: 20px;
  pointer-events: none;
}

.rrs-search-input {
  border: 2px solid #0073e6;
  border-bottom-left-radius: 8px;
  border-right: none;
  border-top-left-radius: 8px;
  box-sizing: border-box;
  display: flex;
  gap: 12px;
  height: 52px;
  position: relative;
}

.rrs-preview {
  background: var(--rrs-color-white);
  border: 1px solid var(--rrs-color-grey-300);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  left: 0;
  overflow: hidden;
  padding: 24px;
  position: absolute;
  right: 0;
  top: 48px;
}

.rrs-preview__product {
  flex: 0 1 auto;
  min-width: 198px;
  width: auto;
}

.rrs-preview__suggestion {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rrs-preview__redirects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
