<template>
  <div
    :data-testid="testId"
    class="rrs-suggestion">
    {{ suggestion }}
  </div>
</template>

<script setup lang="ts">
import type { PreviewSuggestion } from '@/types/PreviewSuggestion'

defineProps<{
  suggestion: PreviewSuggestion
  testId: string
}>()
</script>

<style>
.rrs-suggestion {
  background: var(--rrs-color-brand-100);
  border-radius: 8px;
  color: var(--rrs-color-brand);
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  width: auto;
}

.rrs-suggestion:hover {
  background: var(--rrs-color-brand-200);
}
</style>
