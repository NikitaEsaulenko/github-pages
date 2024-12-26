<template>
  <div
    ref="filtersEl"
    class="rrs-filters">
    <Button
      :test-id="getTestId('show-filters')"
      :text="t('showFilters')"
      class="rrs-filters__show-button"
      color="secondary"
      icon="filter"
      @pointerup="state.show = true" />

    <div
      v-if="state.show"
      class="rrs-filters-dialog-wrapper"
      @pointerup.self="state.show = false">
      <div class="rrs-filters-dialog">
        <div class="rrs-filters-dialog__header">Фильтры</div>
        <div class="rrs-filters-dialog__body">
          <div
            v-for="(filter, filterIndex) in state.value"
            :key="filter.id"
            :data-testid="getTestId(`filter-${filterIndex}`)"
            class="rrs-filters__item">
            <slot
              :filter="filter"
              :filter-index="filterIndex">
              <FilterRange
                v-if="filter.type === 'Range'"
                v-model:value="filter.value"
                :max="filter.max"
                :min="filter.min"
                :test-id="getTestId('range')"
                :title="filter.title" />

              <FilterRangeWithSlider
                v-if="filter.type === 'RangeWithSlider'"
                v-model:value="filter.value"
                :max="filter.max"
                :min="filter.min"
                :step="filter.step"
                :test-id="getTestId('range-with-slider')"
                :title="filter.title" />

              <FilterSwitch
                v-if="filter.type === 'Switch'"
                v-model:value="filter.value"
                :test-id="getTestId('switch')"
                :title="filter.title" />

              <FilterCheckbox
                v-if="filter.type === 'Checkbox'"
                v-model:value="filter.value"
                :visible="5"
                :data="filter.data"
                :test-id="getTestId('checkbox')"
                :title="filter.title" />

              <FilterRadio
                v-if="filter.type === 'Radio'"
                v-model:value="filter.value"
                :data="filter.data"
                :test-id="getTestId('radio')"
                :title="filter.title" />

              <FilterRating
                v-if="filter.type === 'Rating'"
                v-model:value="filter.value"
                :test-id="getTestId('rating')"
                :title="filter.title" />
            </slot>
          </div>

          <Button
            v-if="selectedFiltersCount"
            :test-id="getTestId('reset-filters')"
            :text="`${t('resetFilters')} (${selectedFiltersCount})`"
            class="rrs-filters__reset-button"
            color="secondary"
            @pointerup="resetValue" />
        </div>
        <div class="rrs-filters-dialog__footer">
          <Button
            :test-id="getTestId('cancel')"
            color="secondary"
            :text="t('cancel')"
            @pointerup="state.show = false" />
          <Button
            :test-id="getTestId('save')"
            color="primary"
            :text="t('save')"
            @pointerup="save" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filter } from '@/types/Filter'

import Button from '@/components/Button/Button.vue'
import FilterCheckbox from '@/components/FilterCheckbox/FilterCheckbox.vue'
import FilterRadio from '@/components/FilterRadio/FilterRadio.vue'
import FilterRange from '@/components/FilterRange/FilterRange.vue'
import FilterRangeWithSlider from '@/components/FilterRangeWithSlider/FilterRangeWithSlider.vue'
import FilterRating from '@/components/FilterRating/FilterRating.vue'
import FilterSwitch from '@/components/FilterSwitch/FilterSwitch.vue'
import { useTestId } from '@/use/useTestId'
import { cloneDeep, isEqual, throttle } from 'lodash-es'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  testId: string
  value: Filter[]
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Filter[]): void
}>()

defineSlots<{
  default(props: { filter: Filter; filterIndex: number }): void
}>()

const { t } = useI18n({
  messages: {
    en: {
      cancel: 'Cancel',
      resetFilters: 'Reset filters',
      save: 'Save',
      showFilters: 'Show filters',
    },
    ru: {
      cancel: 'Отмена',
      resetFilters: 'Очистить всё',
      save: 'Применить',
      showFilters: 'Показать фильтры',
    },
  },
})

const { getTestId } = useTestId(props.testId)

const state = reactive<{
  isMobile: boolean
  show: boolean
  value: Filter[]
}>({
  isMobile: false,
  show: true,
  value: [],
})

const filtersEl = ref<HTMLDivElement>()

const selectedFiltersCount = computed(() => {
  let result = 0

  for (const x of state.value) {
    if (x.type === 'Checkbox' && x.value.length > 0) {
      result += 1
    }
    if (x.type === 'Radio' && x.value !== undefined) {
      result += 1
    }
    if (x.type === 'Range' && (x.value.from !== null || x.value.to !== null)) {
      result += 1
    }
    if (x.type === 'RangeWithSlider' && (x.value.from !== null || x.value.to !== null)) {
      result += 1
    }
    if (x.type === 'Rating' && x.value !== undefined) {
      result += 1
    }
    if (x.type === 'Switch' && x.value !== false) {
      result += 1
    }
  }

  return result
})

const resetValue = () => {
  for (const x of state.value) {
    if (x.type === 'Checkbox') {
      x.value = []
    }
    if (x.type === 'Radio') {
      x.value = undefined
    }
    if (x.type === 'Range') {
      x.value = { from: null, to: null }
    }
    if (x.type === 'RangeWithSlider') {
      x.value = { from: null, to: null }
    }
    if (x.type === 'Rating') {
      x.value = undefined
    }
    if (x.type === 'Switch') {
      x.value = false
    }
  }

  if (!state.isMobile) updateValue()
}

const updateValue = () => {
  if (!isEqual(props.value, state.value)) {
    emit('update:value', cloneDeep(state.value))
  }
}

const save = () => {
  updateValue()
  state.show = false
}

const handleResize = throttle(() => {
  state.isMobile = window.innerWidth <= 600
  state.show = !state.isMobile
}, 16)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => state.value,
  () => {
    if (!state.isMobile) updateValue()
  },
  { deep: true },
)

watch(
  [() => props.value, () => state.show],
  () => {
    if (!isEqual(props.value, state.value)) {
      state.value = cloneDeep(props.value)
    }
  },
  { deep: true, immediate: true },
)
</script>

<style>
.rrs-filters {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

.rrs-filters__show-button {
  display: none;
  width: 100%;

  @media (width <= 600px) {
    display: flex;
  }
}

.rrs-filters__reset-button {
  background-color: rgb(4 98 191 / 8%);
  border-radius: 12px;
  color: #0073e6;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  line-height: 20px;
  padding: 16px;
  transition:
    background-color 0.2s,
    box-shadow 0.2s,
    color 0.2s,
    fill 0.2s,
    transform 0.2s;
  width: 100%;

  &:hover {
    background-color: #d4e7fb;
  }
}

.rrs-filters__item {
  padding-bottom: 20px;

  &:not(:first-child) {
    padding-top: 20px;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--rrs-color-grey-200);
  }
}

.rrs-filters-dialog-wrapper {
  display: grid;
  width: 100%;

  @media (width <= 600px) {
    backdrop-filter: blur(2px);
    box-sizing: border-box;
    display: grid;
    height: 100vh;
    left: 0;
    max-height: 100%;
    outline: none;
    overflow: hidden;
    overscroll-behavior: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;

    &::before {
      background-color: var(--rrs-color-brand);
      content: '';
      height: 100%;
      left: 0;
      opacity: 0.8;
      pointer-events: none;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
}

.rrs-filters-dialog {
  background-color: var(--rrs-color-white);
  border-radius: 16px;
  display: grid;
  grid-template-rows: 1fr;
  height: auto;
  margin-top: auto;
  width: 100%;
  z-index: 1;

  @media (width <= 600px) {
    grid-template-rows: 60px 1fr 76px;
    height: 90vh;
  }
}

.rrs-filters-dialog__header {
  align-items: center;
  border-bottom: 1px solid var(--rrs-color-grey-200);
  box-sizing: border-box;
  display: none;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  padding: 8px 32px 0;

  @media (width <= 600px) {
    display: flex;
  }
}

.rrs-filters-dialog__body {
  align-content: start;
  align-items: start;
  box-sizing: border-box;
  flex-grow: 1;
  overflow: hidden auto;
  overscroll-behavior: none;
  padding: 16px;

  @media (width <= 600px) {
    padding: 32px;
  }
}

.rrs-filters-dialog__footer {
  align-items: center;
  border-top: 1px solid var(--rrs-color-grey-200);
  box-sizing: border-box;
  display: none;
  gap: 8px;
  justify-content: flex-end;
  padding: 20px 32px;

  @media (width <= 600px) {
    display: flex;
  }
}
</style>
