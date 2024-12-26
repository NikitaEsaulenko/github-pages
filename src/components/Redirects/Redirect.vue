<template>
  <div class="rrs-redirect">
    <Icon
      class="rrs-redirect__icon"
      name="redirect" />
    <a
      :data-testid="testId"
      :href="value.href"
      class="rrs-redirect__text">
      {{ value.text }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { PreviewRedirect } from '@/types/PreviewRedirect'

import Icon from '@/components/Icon/Icon.vue'

defineProps<{
  testId: string
  value: PreviewRedirect
}>()
</script>

<style lang="scss">
.rrs-redirect {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
}

.rrs-redirect__icon {
  color: var(--rrs-color-grey-500);
}

.rrs-redirect__text {
  font-size: 14px;
  font-weight: 500;
  color: var(--rrs-color-brand);
  line-height: 20px;
  width: 100%;
  text-decoration: none;

  &:visited,
  &:active {
    color: var(--rrs-color-brand);
    text-decoration: none;
  }
}
</style>
