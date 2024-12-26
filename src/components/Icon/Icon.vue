<template>
  <!--eslint-disable vue/no-v-html-->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :data-testid="testId"
    class="rrs-icon"
    v-html="innerHTML" />
</template>

<script setup lang="ts">
import type { IconName } from '@/assets/icons/IconName'

import { icons } from '@/assets/icons/icons'
import { computed } from 'vue'

const props = defineProps<{
  name: IconName
  testId?: string
}>()

const innerHTML = computed<string>(() => {
  return icons[props.name].replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '') || ''
})

const viewBox = computed(() => {
  const viewBoxAttribute = icons[props.name].match(/viewBox="[^"]*"/)
  return viewBoxAttribute && viewBoxAttribute.length
    ? viewBoxAttribute[0].split('=')[1].replace(/"/g, '')
    : ''
})
</script>

<style>
.rrs-icon {
  fill: currentcolor;
  height: 1em;
  min-height: 1em;
  min-width: 1em;
  width: 1em;
}
</style>
