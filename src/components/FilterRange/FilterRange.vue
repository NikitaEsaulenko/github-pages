<template>
  <div class="rrs-filter-range">
    <!--title-->
    <div class="rrs-filter-range__title">
      {{ title }}
    </div>

    <!--inputs-->
    <InputNumber
      :placeholder="String(props.min)"
      :test-id="getTestId('from')"
      :value="state.value.from"
      @blur="updateValue"
      @update:value="updateValueFrom" />
    <InputNumber
      :placeholder="String(props.max)"
      :test-id="getTestId('to')"
      :value="state.value.to"
      @blur="updateValue"
      @update:value="updateValueTo" />
  </div>
</template>

<script setup lang="ts">
import InputNumber from '@/components/InputNumber/InputNumber.vue'
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
  testId: string
  title: string
  value: Value
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Value): void
}>()

const { getTestId } = useTestId(props.testId)

const state = reactive<{
  value: Value
}>({
  value: {
    from: null,
    to: null,
  },
})

const updateValueFrom = (value: null | number) => {
  let newValue = value

  if (newValue !== null) {
    newValue = Math.max(props.min, Math.min(props.max, newValue))
  }

  if (newValue !== null && newValue > (props.value.to ?? props.max)) {
    newValue = props.value.to ?? props.max
  }

  state.value.from = newValue
}

const updateValueTo = (value: null | number) => {
  let newValue = value

  if (newValue !== null) {
    newValue = Math.max(props.min, Math.min(props.max, newValue))
  }

  if (newValue !== null && newValue < (props.value.from ?? props.min)) {
    newValue = props.value.from ?? props.min
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
.rrs-filter-range {
  display: grid;
  gap: 16px 12px;
  grid-template-columns: repeat(2, 1fr);
}

.rrs-filter-range__title {
  font-size: 16px;
  font-weight: 500;
  grid-column: 1 / 3;
  line-height: 20px;
}
</style>
