<template>
  <div
    :data-testid="testId"
    class="rrs-empty">
    <img
      alt="Empty"
      class="rrs-empty__image"
      src="../../assets/images/empty.svg" />
    <div class="rrs-empty__text">
      {{ t('nothingWasFound') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  testId: string
}>()

const { t } = useI18n({
  messages: {
    en: {
      nothingWasFound: 'Nothing was found for your query',
    },
    ru: {
      nothingWasFound: 'Для вашего запроса ничего не найдено',
    },
  },
})
</script>

<style>
.rrs-empty {
  align-items: center;
  display: inline-grid;
  gap: 24px;
  height: auto;
  justify-content: center;
  margin: auto;
  width: auto;
}

.rrs-empty__image {
  align-items: center;
  display: inline-grid;
  height: auto;
  justify-content: center;
  margin: auto;
  width: auto;
}

.rrs-empty__text {
  color: var(--rrs-color-grey-400);
  font-size: 14px;
  font-weight: 400;
}
</style>
