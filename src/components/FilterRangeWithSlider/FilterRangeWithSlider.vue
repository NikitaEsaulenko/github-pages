<template>
  <div class="rrs-filter-range-with-slider">
    <!--title-->
    <div
      class="rrs-filter-range-with-slider__title"
      @keydown.prevent.enter.space
      @keyup.enter.space="toggleShowOptions"
      @pointerup="toggleShowOptions">
      {{ title }}
      <Icon
        class="rrs-sorting__button-icon"
        :class="{ rotate: state.isShowOptions }"
        name="arrowDown" />
    </div>

    <!--slider-->
    <Slider
      v-if="state.isShowOptions"
      v-model:value="state.value"
      :max="max"
      :min="min"
      :step="step"
      :test-id="getTestId('slider')"
      class="rrs-filter-range-with-slider__slider"
      @pointerup="updateValue" />

    <!--inputs-->
    <InputNumber
      v-if="state.isShowOptions"
      :placeholder="String(props.min)"
      :test-id="getTestId('from')"
      :value="state.value.from"
      @blur="updateValue"
      @update:value="updateValueFrom" />
    <InputNumber
      v-if="state.isShowOptions"
      :placeholder="String(props.max)"
      :test-id="getTestId('to')"
      :value="state.value.to"
      @blur="updateValue"
      @update:value="updateValueTo" />
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import InputNumber from '@/components/InputNumber/InputNumber.vue'
import Slider from '@/components/Slider/Slider.vue'
import { useTestId } from '@/use/useTestId'
import { cloneDeep, isEqual } from 'lodash-es'
import { reactive, watch } from 'vue'

type Value = {
  from: null | number
  to: null | number
}

const props = defineProps<{
  max: number
  min: number
  step: number
  testId: string
  title: string
  value: Value
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Value): void
}>()

const { getTestId } = useTestId(props.testId)

const state = reactive<{
  isShowOptions: boolean
  value: Value
}>({
  isShowOptions: true,
  value: {
    from: null,
    to: null,
  },
})

const toggleShowOptions = () => {
  state.isShowOptions = !state.isShowOptions
}

const updateValueFrom = (value: null | number) => {
  let newValue = value

  if (newValue !== null) {
    newValue = Math.max(props.min, Math.min(props.max, newValue))
  }

  if (newValue !== null && newValue > (state.value.to ?? props.max)) {
    newValue = state.value.to ?? props.max
  }

  state.value.from = newValue
}

const updateValueTo = (value: null | number) => {
  let newValue = value

  if (newValue !== null) {
    newValue = Math.max(props.min, Math.min(props.max, newValue))
  }

  if (newValue !== null && newValue < (state.value.from ?? props.min)) {
    newValue = state.value.from ?? props.min
  }

  state.value.to = newValue
}

const updateValue = () => {
  if (!isEqual(props.value, state.value)) {
    emit('update:value', cloneDeep(state.value))
  }
}

watch(
  () => props.value,
  () => {
    if (!isEqual(props.value, state.value)) {
      state.value = cloneDeep(props.value)
    }
  },
  { deep: true, immediate: true },
)
</script>

<style>
.rrs-filter-range-with-slider {
  display: grid;
  gap: 16px 12px;
  grid-template-columns: repeat(2, 1fr);
}

.rrs-filter-range-with-slider__title {
  color: #000;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  grid-column: 1 / 3;
  justify-content: space-between;
  line-height: 24px;
  margin-bottom: 8px;
}

.rrs-filter-range-with-slider__slider {
  grid-column: 1 / 3;
}
</style>
