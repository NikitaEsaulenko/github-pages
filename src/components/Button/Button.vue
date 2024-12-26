<template>
  <button
    :class="{
      'is-icon-right': iconRight,
      'rrs-button--primary': color === 'primary',
      'rrs-button--secondary': color === 'secondary',
      'rrs-button--white': color === 'white',
      'rrs-button--yellow': color === 'yellow',
    }"
    :data-testid="testId"
    class="rrs-button"
    @keydown.prevent.enter.space
    @keyup.enter.space="pointerup"
    @pointerup="pointerup">
    <Icon
      v-if="icon"
      :name="icon"
      class="rrs-button__icon" />
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import type { IconName } from '@/assets/icons/IconName'

import Icon from '@/components/Icon/Icon.vue'

type ButtonColors = ['primary', 'secondary', 'white', 'yellow']

type ButtonColor = ButtonColors[number]

defineProps<{
  color: ButtonColor
  icon?: '' | IconName
  iconRight?: boolean
  testId: string
  text: string
}>()

const emit = defineEmits<{
  (e: 'pointerup'): void
}>()

const pointerup = () => {
  emit('pointerup')
}
</script>

<style>
.rrs-button {
  align-items: center;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  height: 36px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 10px 20px;
  width: auto;

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
  }
}

/* .rrs-button {
  align-items: center;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  justify-content: center;
  line-height: 1;
  outline: none;
  height: 36px;
  padding: 10px 20px;
  width: auto;
  color: #0073e6;
  background-color: rgba(4, 98, 191, .08);
  border-radius: 12px;
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  transition: background-color .2s, box-shadow .2s, color .2s, fill .2s, transform .2s;
} */

.rrs-button.is-icon-right {
  flex-direction: row-reverse;
}

.rrs-button__icon {
  font-size: 16px;
}

.rrs-button--primary {
  background-color: var(--rrs-color-brand);
  color: var(--rrs-color-white);

  &:hover {
    background-color: var(--rrs-color-brand-400);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-brand-400);
  }

  &:active {
    background-color: var(--rrs-color-brand-500);
  }
}

.rrs-button--secondary {
  background-color: var(--rrs-color-brand-100);
  color: var(--rrs-color-brand-400);

  &:hover {
    background-color: var(--rrs-color-brand-200);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-brand-200);
  }

  &:active {
    background-color: var(--rrs-color-brand-300);
  }
}

.rrs-button--white {
  background-color: var(--rrs-color-white);
  color: var(--rrs-color-brand-400);

  &:hover {
    background-color: var(--rrs-color-brand-100);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-brand-200);
  }

  &:active {
    background-color: var(--rrs-color-brand-200);
  }
}

.rrs-button--yellow {
  background-color: var(--rrs-color-yellow);
  color: var(--rrs-color-black);

  &:hover {
    background-color: var(--rrs-color-yellow-400);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-yellow-400);
  }

  &:active {
    background-color: var(--rrs-color-yellow-500);
  }
}
</style>
