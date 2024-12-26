<template>
  <div
    :class="{ 'is-active': value }"
    class="rrs-filter-switch">
    <!--title-->
    <div class="rrs-filter-switch__title">
      {{ title }}
    </div>

    <Switch
      :test-id="testId"
      :value="value"
      @update:value="updateValue" />
  </div>
</template>

<script setup lang="ts">
import Switch from '@/components/Switch/Switch.vue'

defineProps<{
  testId: string
  title: string
  value: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void
}>()

const updateValue = (value: boolean) => {
  emit('update:value', value)
}
</script>

<style>
.rrs-filter-switch {
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto;
}

.rrs-filter-switch__title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}
</style>
