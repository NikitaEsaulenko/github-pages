<template>
  <div
    :class="{ 'is-checked': value, 'is-disabled': disabled }"
    :data-testid="testId"
    :data-checked="value"
    :tabindex="disabled ? -1 : 0"
    class="rrs-radio"
    @keydown.prevent.enter.space
    @keyup.enter.space="updateValue"
    @pointerup="updateValue">
    <div class="rrs-radio__checkmark">
      <div class="rrs-radio__icon" />
    </div>
    <div class="rrs-radio__text">
      <slot> {{ text }}</slot>

      <span
        v-if="description"
        class="rrs-radio__description">
        {{ ` ${description}` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  description?: string
  disabled?: boolean
  testId: string
  text: string
  value: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void
}>()

const updateValue = () => {
  if (!props.value) emit('update:value', true)
}
</script>

<style>
.rrs-radio__checkmark {
  align-items: center;
  background-color: var(--rrs-color-white);
  border: 1px solid #99c7f5;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  max-height: 24px;
  max-width: 24px;
  min-height: 24px;
  min-width: 24px;
  width: 24px;
}

.rrs-radio__icon {
  background-color: #0073e6;
  border-radius: 50%;
  height: 12px;
  opacity: 0;
  transition:
    background 0.2s,
    border 0.3s;
  width: 12px;
}

.rrs-radio__text {
  color: var(--rrs-color-black);
  display: block;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  white-space: pre;
  width: 100%;
  word-break: break-all;
}

.rrs-radio__description {
  color: var(--rrs-color-grey-400);
  display: inline;
}

.rrs-radio {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 20px;
  outline: none;
  width: auto;

  &:active,
  &:focus-visible {
    .rrs-radio__icon {
      opacity: 1;
    }
  }

  &:hover {
    .rrs-radio__text {
      color: var(--rrs-color-brand);
    }

    .rrs-radio__checkmark {
      border: 1px solid #2788e9;
      box-shadow: inset 0 0 0 1px #0073e6;
    }
  }

  &:active {
    .rrs-radio__text {
      color: var(--rrs-color-brand-400);
    }
  }

  &:focus-visible {
    .rrs-radio__checkmark {
      border: 1px solid #0073e6;
    }

    .rrs-radio__text {
      color: var(--rrs-color-brand);
    }
  }
}

.rrs-radio.is-disabled {
  pointer-events: none;

  .rrs-radio__checkmark {
    background-color: var(--rrs-color-grey-200);
  }

  .rrs-radio__text {
    color: var(--rrs-color-grey-400);
  }
}

.rrs-radio.is-checked {
  .rrs-radio__checkmark {
    background-color: var(--rrs-color-white);
  }

  .rrs-radio__icon {
    opacity: 1;
  }

  &:active {
    .rrs-radio__checkmark {
      background-color: var(--rrs-color-brand-500);
    }

    .rrs-radio__text {
      color: var(--rrs-color-brand-500);
    }
  }
}

.rrs-radio.is-checked.is-disabled {
  .rrs-radio__checkmark {
    background-color: var(--rrs-color-brand-300);
  }
}
</style>
