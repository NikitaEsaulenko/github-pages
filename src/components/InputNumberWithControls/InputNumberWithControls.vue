<template>
  <div class="rrs-input-number-with-controls">
    <div
      class="rrs-input-number-with-controls__icon rrs-input-number-with-controls__icon--left"
      tabindex="0"
      @keydown.prevent.enter.space
      @keyup.enter.space="decrease"
      @pointerup="decrease">
      <Icon name="subtract" />
    </div>

    <input
      :data-testid="testId"
      :value="displayValue"
      class="rrs-input-number-with-controls__input"
      pattern="0-9"
      type="text"
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput" />

    <div
      class="rrs-input-number-with-controls__icon rrs-input-number-with-controls__icon--right"
      tabindex="0"
      @keydown.prevent.enter.space
      @keyup.enter.space="increase"
      @pointerup="increase">
      <Icon name="add" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import { getNumberFromString } from '@/helpers/getNumberFromString'
import { getStringFromNumber } from '@/helpers/getStringFromNumber'
import { normalizeDecimalNumber } from '@/helpers/normalizeDecimalNumber'
import { computed, reactive } from 'vue'

const props = defineProps<{
  testId: string
  value: number
}>()

const emit = defineEmits<{
  (e: 'blur', value: FocusEvent): void
  (e: 'focus', value: FocusEvent): void
  (e: 'update:value', value: number): void
}>()

const STEP = 1

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

const updateValue = (value: null | number) => {
  let newValue = value

  if (newValue === null || newValue < 0) {
    newValue = 0
  } else {
    newValue = Math.round(newValue)
  }

  if (props.value !== newValue) {
    emit('update:value', newValue)
  }
}

const decrease = () => {
  const value = normalizeDecimalNumber(Number(props.value) - STEP)
  state.userInput = getStringFromNumber(value)
  updateValue(value)
}

const increase = () => {
  const value = normalizeDecimalNumber(Number(props.value) + STEP)
  state.userInput = getStringFromNumber(value)
  updateValue(value)
}

// Events
const onFocus = (e: FocusEvent) => {
  state.userInput = getStringFromNumber(props.value)
  state.focused = true
  emit('focus', e)
}

const onBlur = (e: FocusEvent) => {
  state.userInput = ''
  state.focused = false
  emit('blur', e)
}

const onInput = (e: Event) => {
  state.userInput = (e.target as HTMLInputElement).value
  updateValue(getNumberFromString(state.userInput))
}
</script>

<style>
.rrs-input-number-with-controls {
  position: relative;
  width: 100%;
}

.rrs-input-number-with-controls__icon {
  align-items: center;
  color: var(--rrs-color-black);
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: auto;
  justify-content: center;
  outline: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  width: auto;

  &:hover,
  &:focus,
  &:focus-within {
    color: var(--rrs-color-yellow-400);
  }

  &:active {
    color: var(--rrs-color-yellow-500);
  }
}

.rrs-input-number-with-controls__icon--left {
  left: 20px;
}

.rrs-input-number-with-controls__icon--right {
  right: 20px;
}

.rrs-input-number-with-controls__input {
  appearance: none;
  background-color: var(--rrs-color-yellow-100);
  border: 1px solid var(--rrs-color-yellow);
  border-radius: 8px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  line-height: 1;
  outline: none;
  padding: 8px calc(20px + 16px + 4px);
  text-align: center;
  width: 100%;

  &:hover,
  &:focus,
  &:focus-within {
    border-color: var(--rrs-color-yellow-400);
  }

  &:active {
    background-color: var(--rrs-color-yellow-200);
    border-color: var(--rrs-color-yellow);
  }
}
</style>
