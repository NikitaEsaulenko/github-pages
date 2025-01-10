<template>
  <div class="rrs-filter-checkbox">
    <!--title-->
    <div
      :data-testid="getTestId('title')"
      class="rrs-filter-checkbox__title"
      @keydown.prevent.enter.space
      @keyup.enter.space="toggleShowOptions"
      @pointerup="toggleShowOptions">
      {{ title }}
      <Icon
        class="rrs-sorting__button-icon"
        :class="{ rotate: state.isShowOptions }"
        name="arrowDown" />
    </div>

    <!--search-->

    <!--checkbox items-->
    <div
      v-if="state.isShowOptions"
      class="rrs-filter-checkbox__items">
      <Input
        v-model:value="state.query"
        :placeholder="t('placeholder')"
        :test-id="testId"
        icon="search" />
      <template v-if="visibleData.length">
        <Checkbox
          v-for="(item, index) in visibleData"
          :key="index"
          :description="item.description"
          :test-id="getTestId(`item-${index}`)"
          :text="item.text"
          :value="value.includes(item.value)"
          @update:value="updateValue(item)" />
      </template>
      <template v-else>
        <span class="rrs-filter-checkbox__nothing-found">
          {{ t('nothingFound') }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Checkbox from '@/components/Checkbox/Checkbox.vue'
import Icon from '@/components/Icon/Icon.vue'
import Input from '@/components/Input/Input.vue'
import { useTestId } from '@/use/useTestId'
import { cloneDeep, isEqual } from 'lodash-es'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Value = any

type CheckboxItem = {
  description?: string
  text: string
  value: Value
}

const props = defineProps<{
  data: CheckboxItem[]
  testId: string
  title: string
  value: Value[]
  visible: number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Value[]): void
}>()

const { t } = useI18n({
  messages: {
    en: {
      hide: 'Hide',
      nothingFound: 'Nothing found',
      placeholder: 'Search',
      showAll: 'Show all',
    },
    ru: {
      hide: 'Скрыть',
      nothingFound: 'Ничего не найдено',
      placeholder: 'Поиск',
      showAll: 'Показать все',
    },
  },
})

const { getTestId } = useTestId(props.testId)

const state = reactive({
  isShowOptions: true,
  query: '',
})

const toggleShowOptions = () => {
  state.isShowOptions = !state.isShowOptions
}

const visibleData = computed(() => {
  return props.data
})

const updateValue = (item: CheckboxItem) => {
  const newValue = cloneDeep(props.value)
  const index = newValue.findIndex((x) => isEqual(x, item.value))

  if (index !== -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(item.value)
  }

  emit('update:value', newValue)
}
</script>

<style>
.rrs-filter-checkbox {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.rrs-filter-checkbox__title {
  color: #000;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  justify-content: space-between;
  line-height: 24px;
  margin-bottom: 8px;
}

.rrs-filter-checkbox__items {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: flex-start;
  margin-right: -16px;
  max-height: 312px;
  overflow: hidden auto;
  padding-right: 16px;
  width: 100%;
}

.rrs-filter-checkbox__nothing-found {
  color: var(--rrs-color-grey-500);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.rrs-filter-checkbox__button {
  align-items: center;
  background: none;
  border: none;
  color: var(--rrs-color-grey-500);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  justify-content: flex-start;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 0;
  text-align: left;
  width: auto;

  &:hover,
  &:focus-visible,
  &:active {
    color: var(--rrs-color-brand);
  }
}
</style>
