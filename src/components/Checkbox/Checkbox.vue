<template>
  <div
    :class="{ 'is-checked': value, 'is-disabled': disabled }"
    :data-testid="testId"
    :data-checked="value"
    :tabindex="disabled ? -1 : 0"
    class="rrs-checkbox"
    @keydown.prevent.enter.space
    @keyup.enter.space="updateValue"
    @pointerup="updateValue">
    <div class="rrs-checkbox__checkmark">
      <Icon
        class="rrs-checkbox__icon"
        name="checkmark" />
    </div>
    <div class="rrs-checkbox__text">
      {{ text }}
      <span
        v-if="description"
        class="rrs-checkbox__description">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'

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
  emit('update:value', !props.value)
}
</script>

<style>
.rrs-checkbox__checkmark {
  align-items: center;
  background-color: var(--rrs-color-white);
  border: 1px solid #99c7f5;
  border-radius: 8px;
  display: flex;
  height: 24px;
  justify-content: center;
  max-height: 24px;
  max-width: 24px;
  min-height: 24px;
  min-width: 24px;
  width: 24px;
}

.rrs-checkbox__icon {
  color: var(--rrs-color-white);
  opacity: 0;
}

.rrs-checkbox__text {
  color: var(--rrs-color-black);
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  width: auto;
  word-break: break-all;
}

.rrs-checkbox__description {
  color: var(--rrs-color-grey-400);
  display: inline;
}

.rrs-checkbox__count {
  color: var(--rrs-color-grey-400);
  display: inline;
}

.rrs-checkbox {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 16px;
  outline: none;
  padding: 3px 0;
  width: auto;

  &:hover,
  &:active,
  &:focus-visible {
    .rrs-checkbox__icon {
      opacity: 1;
    }
  }

  &:hover {
    .rrs-checkbox__text {
      color: var(--rrs-color-brand);
    }
  }

  &:active {
    .rrs-checkbox__checkmark {
      background-color: var(--rrs-color-brand-300);
    }

    .rrs-checkbox__text {
      color: var(--rrs-color-brand-400);
    }
  }

  &:focus-visible {
    .rrs-checkbox__checkmark {
      outline: 2px solid var(--rrs-color-brand-300);
    }

    .rrs-checkbox__text {
      color: var(--rrs-color-brand);
    }
  }
}

.rrs-checkbox.is-disabled {
  pointer-events: none;

  .rrs-checkbox__checkmark {
    background-color: var(--rrs-color-grey-200);
  }

  .rrs-checkbox__text {
    color: var(--rrs-color-grey-400);
  }
}

.rrs-checkbox.is-checked {
  .rrs-checkbox__checkmark {
    background-color: #0073e6;
  }

  .rrs-checkbox__icon {
    opacity: 1;
  }

  &:active {
    .rrs-checkbox__checkmark {
      background-color: var(--rrs-color-brand-500);
    }

    .rrs-checkbox__text {
      color: var(--rrs-color-brand-500);
    }
  }
}

.rrs-checkbox.is-checked.is-disabled {
  .rrs-checkbox__checkmark {
    background-color: var(--rrs-color-brand-300);
  }
}
</style>
