<template>
  <div class="rrs-filter-radio">
    <!--title-->
    <div
      :data-testid="getTestId('title')"
      class="rrs-filter-radio__title"
      @keydown.prevent.enter.space
      @keyup.enter.space="toggleShowOptions"
      @pointerup="toggleShowOptions">
      {{ title }}
      <Icon
        class="rrs-sorting__button-icon"
        :class="{ rotate: state.isShowOptions }"
        name="arrowDown" />
    </div>

    <!--radio items-->
    <div
      v-if="state.isShowOptions"
      class="rrs-filter-radio__items">
      <Radio
        :test-id="getTestId(`item-no-matter`)"
        :text="t('noMatter')"
        :value="isEqual(value, undefined)"
        @update:value="onUpdateValueItem(undefined)" />
      <Radio
        v-for="(item, index) in data"
        :key="index"
        :description="item.description"
        :test-id="getTestId(`item-${index}`)"
        :text="item.text"
        :value="isEqual(value, item.value)"
        @update:value="onUpdateValueItem(item.value)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import Radio from '@/components/Radio/Radio.vue'
import { useTestId } from '@/use/useTestId'
import { isEqual } from 'lodash-es'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Value = any

type RadioItem = {
  description?: string
  text: string
  value: Value
}

const props = defineProps<{
  data: RadioItem[]
  testId: string
  title: string
  value: Value
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Value): void
}>()

const { t } = useI18n({
  messages: {
    en: {
      noMatter: 'No matter',
    },
    ru: {
      noMatter: 'Не важно',
    },
  },
})

const { getTestId } = useTestId(props.testId)

const onUpdateValueItem = (value: RadioItem['value']) => {
  emit('update:value', value)
}

const state = reactive<{
  isShowOptions: boolean
}>({
  isShowOptions: true,
})

const toggleShowOptions = () => {
  state.isShowOptions = !state.isShowOptions
}
</script>

<style>
.rrs-filter-radio {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.rrs-filter-radio__title {
  color: #000;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  justify-content: space-between;
  line-height: 24px;
  margin-bottom: 8px;
}

.rrs-filter-radio__items {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: flex-start;
  margin-right: -16px;
  max-height: 224px;
  overflow: hidden auto;
  padding-right: 16px;
  width: 100%;
}
</style>
