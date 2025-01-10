<template>
  <Input
    :placeholder="placeholder"
    :test-id="testId"
    :value="displayValue"
    class="rrs-input-number"
    @blur="onBlur"
    @focus="onFocus"
    @update:value="onuUpdateValue" />
</template>

<script setup lang="ts">
import Input from '@/components/Input/Input.vue'
import { getNumberFromString } from '@/helpers/getNumberFromString'
import { getStringFromNumber } from '@/helpers/getStringFromNumber'
import { computed, reactive } from 'vue'

type Value = null | number

const props = withDefaults(
  defineProps<{
    placeholder?: string
    testId: string
    value: Value
  }>(),
  {
    placeholder: '',
  },
)

const emit = defineEmits<{
  (e: 'blur', value: FocusEvent): void
  (e: 'focus', value: FocusEvent): void
  (e: 'update:value', value: Value): void
}>()

const state = reactive<{
  focused: boolean
  userInput: string
}>({
  focused: false,
  userInput: '',
})

const displayValue = computed(() => {
  if (state.focused) return state.userInput
  return getStringFromNumber(props.value)
})

const onFocus = (e: FocusEvent) => {
  state.focused = true
  state.userInput = getStringFromNumber(props.value)
  emit('focus', e)
}

const onBlur = (e: FocusEvent) => {
  state.focused = false
  state.userInput = ''
  emit('blur', e)
}

const onuUpdateValue = (value: string) => {
  state.userInput = value

  const newValue = getNumberFromString(state.userInput)

  if (props.value !== newValue) {
    emit('update:value', newValue)
  }
}
</script>
