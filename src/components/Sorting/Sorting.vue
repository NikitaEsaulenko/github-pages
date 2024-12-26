<template>
  <div
    ref="rootEl"
    class="rrs-sorting">
    <div class="rrs-sorting__delivery">
      <button
        :data-testid="testId"
        class="rrs-sorting__delivery__button"
        @keydown.prevent.enter.space>
        <div class="rrs-sorting__delivery__button-text">
          Способ получения<br /><span>Выберите адрес или магазин</span>
        </div>
        <Icon
          class="rrs-sorting__delivery__button-icon"
          name="arrowRight" />
      </button>
    </div>
    <div class="rrs-sorting__sort">
      <button
        :data-testid="testId"
        class="rrs-sorting__button"
        @keydown.prevent.enter.space
        @keyup.enter.space="toggleShowOptions"
        @pointerup="toggleShowOptions">
        <span class="rrs-sorting__button-text">
          {{ selected?.text }}
        </span>
        <Icon
          class="rrs-sorting__button-icon"
          :class="{ rotate: state.isShowOptions }"
          name="arrowDown" />
      </button>

      <ul
        v-if="state.isShowOptions"
        :data-testid="getTestId('options')"
        class="rrs-sorting__options">
        <li
          v-for="(option, index) in options"
          :key="index"
          :data-testid="getTestId(`option-${index}`)"
          class="rrs-sorting__option"
          :class="{ active: index === 0 }"
          tabindex="0"
          @keydown.prevent.enter.space
          @keyup.enter.space="selectOption(option)"
          @pointerup="selectOption(option)">
          {{ option.text }}
        </li>
      </ul>
    </div>
    <div class="rrs-sorting__time">
      <button
        :data-testid="testId"
        class="rrs-sorting__time__button"
        @keydown.prevent.enter.space>
        <div class="rrs-sorting__time__button-text">Сегодня<br />или завтра</div>
      </button>
    </div>
    <div class="rrs-sorting__vendor">
      <button
        :data-testid="testId"
        class="rrs-sorting__vendor__button"
        @keydown.prevent.enter.space>
        <div class="rrs-sorting__vendor__button-text">Бренд</div>
      </button>
    </div>
    <div class="rrs-sorting__price">
      <button
        :data-testid="testId"
        class="rrs-sorting__price__button"
        @keydown.prevent.enter.space>
        <div class="rrs-sorting__price__button-text">Цена</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import { isEventOutside } from '@/helpers/isEventOutside'
import { useTestId } from '@/use/useTestId'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Option = { text: string; value: string }

const props = defineProps<{
  testId: string
  value: Option['value']
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Option['value']): void
}>()

const { getTestId } = useTestId(props.testId)

const state = reactive<{
  isShowOptions: boolean
}>({
  isShowOptions: false,
})

const { t } = useI18n({
  messages: {
    en: {
      byNameAsc: 'By name',
      byPopular: 'By popularity',
      byPriceAsc: 'Ascending by price',
      byPriceDesc: 'Decreasing in price',
      byRelevance: 'By relevance',
    },
    ru: {
      byNameAsc: 'По названию',
      byPopular: 'По популярности',
      byPriceAsc: 'По возрастанию цены',
      byPriceDesc: 'По убыванию цены',
      byRelevance: 'По релевантности',
    },
  },
})

const rootEl = ref<HTMLDivElement>()

const options = computed(() => [
  {
    text: t('byPopular'),
    value: '',
  },
  {
    text: t('byRelevance'),
    value: 'relevance',
  },
  {
    text: t('byPriceAsc'),
    value: 'price_asc',
  },
  {
    text: t('byPriceDesc'),
    value: 'price_desc',
  },
  {
    text: t('byNameAsc'),
    value: 'name_asc',
  },
])

const selected = computed(() => {
  return options.value.find((x) => x.value === props.value)
})

const hideOptions = () => {
  state.isShowOptions = false
}

const selectOption = (option: Option) => {
  emit('update:value', option.value)
  state.isShowOptions = false
}

const toggleShowOptions = () => {
  state.isShowOptions = !state.isShowOptions
}

const pointerUpHandler = (e: PointerEvent) => {
  if (state.isShowOptions && rootEl.value) {
    if (isEventOutside(rootEl.value, e)) {
      hideOptions()
    }
  }
}

onMounted(() => {
  window.addEventListener('pointerup', pointerUpHandler)
})

onBeforeMount(() => {
  window.removeEventListener('pointerup', pointerUpHandler)
})
</script>

<style>
.rrs-sorting {
  display: flex;
  gap: 8px;
  position: relative;
  width: auto;

  @media (width <= 600px) {
    width: 100%;
  }
}

.rrs-sorting__sort {
  position: relative;
}

.rrs-sorting__delivery__button {
  width: 280px;
}

.rrs-sorting__time__button,
.rrs-sorting__vendor__button,
.rrs-sorting__price__button {
  padding: 16px 8px;
  width: auto;
}

.rrs-sorting__button {
  width: 200px;
}

.rrs-sorting__button,
.rrs-sorting__delivery__button,
.rrs-sorting__time__button,
.rrs-sorting__vendor__button,
.rrs-sorting__price__button {
  align-items: center;
  appearance: none;
  background-color: var(--rrs-color-white);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  gap: 8px;
  height: 48px;
  justify-content: space-between;
  line-height: 20px;
  outline: 2px solid transparent;
  padding: 16px;
  transition:
    background-color 0.2s,
    box-shadow 0.2s,
    color 0.2s,
    fill 0.2s,
    transform 0.2s,
    all 0.3s;
  width: auto;

  &:focus {
    outline: 2px solid #0073e6;
  }

  &:hover,
  &:active {
    background-color: unset;
    transform: none;
  }

  @media (width <= 600px) {
    width: 100%;
  }
}

.rrs-sorting__button-text,
.rrs-sorting__delivery__button-text,
.rrs-sorting__time__button-text,
.rrs-sorting__vendor__button-text,
.rrs-sorting__price__button-text {
  color: var(--rrs-color-black);
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;

  & > span {
    color: #0073e6;
  }
}

.rrs-sorting__button-icon,
.rrs-sorting__delivery__button-icon {
  color: #0073e6;
  font-size: 20px;
  pointer-events: none;
  transition: all 0.2s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.rrs-sorting__options {
  appearance: none;
  background-color: var(--rrs-color-white);
  border: 1px solid var(--rrs-color-grey-300);
  border-radius: 16px;
  display: block;
  filter: drop-shadow(0 8px 16px rgb(121 156 208 / 12%));
  left: 0;
  margin: 0;
  padding: 8px 0;
  position: absolute;
  top: 100%;
  transform: translateY(4px);
  width: 200px;
  z-index: 1;
}

.rrs-sorting__option {
  appearance: none;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  color: var(--rrs-color-black);
  cursor: pointer;
  display: block;
  font-size: 14px;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 8px 12px;
  white-space: nowrap;

  &:hover,
  &:focus-visible {
    background-color: var(--rrs-color-grey-50);
  }

  &.active {
    font-weight: 600;
  }
}
</style>
