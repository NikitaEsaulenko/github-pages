<template>
  <div class="rrs-input">
    <Icon
      v-if="icon"
      :name="icon"
      class="rrs-input__icon" />
    <input
      :class="{ 'is-icon': icon, search: testId === 'search-input' }"
      :data-testid="testId"
      :placeholder="placeholder"
      :value="value"
      class="rrs-input__input"
      type="text"
      @blur="onBlur"
      @keydown="onKeydown"
      @focus="onFocus"
      @input="onInput" />
  </div>
</template>

<script setup lang="ts">
import type { IconName } from '@/assets/icons/IconName'

import Icon from '@/components/Icon/Icon.vue'

withDefaults(
  defineProps<{
    icon?: '' | IconName
    placeholder?: string
    testId: string
    value: string
  }>(),
  {
    icon: '',
    placeholder: '',
  },
)

const emit = defineEmits<{
  (e: 'blur', value: FocusEvent): void
  (e: 'focus', value: FocusEvent): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'update:value', value: string): void
}>()

// Events
const onFocus = (e: FocusEvent) => {
  emit('focus', e)
}

const onBlur = (e: FocusEvent) => {
  emit('blur', e)
}

const onKeydown = (e: KeyboardEvent) => {
  emit('keydown', e)
}

const onInput = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value)
}
</script>

<style>
.rrs-input {
  position: relative;
  width: 100%;
}

.rrs-input__icon {
  color: #0073e6;
  font-size: 18px;
  left: 12px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.rrs-input__input {
  appearance: none;
  background-color: var(--rrs-color-white);
  border: none;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #99c7f5;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  line-height: 20px;
  outline: none;
  padding: 8px 16px;
  transition: box-shadow 0.1s ease;
  width: 100%;

  &::placeholder {
    color: #000;
    font-family: inherit;
    font-size: inherit;
  }

  &.search {
    border-radius: 8px 0 0 8px;
    box-shadow: none;
    font-weight: 500;
  }
}

.rrs-input__input.is-icon {
  padding: 8px 12px 8px calc(12px + 16px + 8px);
}
</style>
