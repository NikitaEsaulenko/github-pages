<template>
  <div
    :class="{ 'is-active': value }"
    :data-testid="testId"
    class="rrs-switch"
    tabindex="0"
    @keydown.prevent.enter.space
    @keyup.enter.space="updateValue"
    @pointerup="updateValue">
    <div
      :class="{ 'is-active': value }"
      class="rrs-switch__bar" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  testId: string
  value: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void
}>()

const updateValue = () => {
  emit('update:value', !props.value)
}
</script>

<style>
.rrs-switch__bar {
  background-color: var(--rrs-color-white);
  border-radius: 50%;
  height: 20px;
  left: 2px;
  margin-right: auto;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition-duration: 100ms;
  transition-property: left, width, height;
  width: 20px;
}

.rrs-switch__bar.is-active {
  left: calc(100% - calc(20px + 2px));
}

.rrs-switch {
  align-items: center;
  background-color: var(--rrs-color-grey-300);
  border-radius: 24px;
  cursor: pointer;
  display: inline-grid;
  height: 24px;
  justify-content: start;
  outline: none;
  position: relative;
  width: 40px;

  &:active {
    background-color: var(--rrs-color-grey-500);

    .rrs-switch__bar {
      height: calc(20px * 0.7);
      left: calc(50% - calc(20px * 0.7) / 2);
      width: calc(20px * 0.7);
    }
  }

  &:focus-visible {
    outline: var(--rrs-color-grey-500) solid 2px;
    outline-offset: 0;
  }

  &:hover,
  &:focus-visible {
    background-color: var(--rrs-color-grey-400);
  }
}

.rrs-switch.is-active {
  background-color: var(--rrs-color-brand);

  &:hover,
  &:focus-visible {
    background-color: var(--rrs-color-brand-400);
  }

  &:focus-visible {
    outline-color: var(--rrs-color-brand-500);
  }

  &:active {
    background-color: var(--rrs-color-brand-500);
  }
}
</style>
