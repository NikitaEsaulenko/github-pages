<template>
  <div class="rrs-filter-rating">
    <div class="rrs-filter-rating__title">
      {{ title }}
    </div>
    <div class="rrs-filter-rating__options">
      <Radio
        v-for="starCount in 5"
        :key="starCount"
        class="rrs-filter-rating__option"
        :test-id="getTestId(`rating-${starCount}`)"
        :text="String(starCount)"
        :value="value === starCount"
        @update:value="updateRating(starCount)">
        <div class="rrs-filter-rating__stars">
          <Icon
            v-for="index in starCount"
            :key="index"
            class="rrs-filter-rating__star is-active"
            name="star" />
          <Icon
            v-for="index in 5 - starCount"
            :key="index"
            class="rrs-filter-rating__star"
            name="star" />
        </div>
      </Radio>
      <Radio
        :test-id="getTestId('any')"
        :text="t('any')"
        :value="value === undefined"
        @update:value="updateRating(undefined)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import Radio from '@/components/Radio/Radio.vue'
import { useTestId } from '@/use/useTestId'
import { useI18n } from 'vue-i18n'

type Value = number | undefined

const props = defineProps<{
  testId: string
  title: string
  value: Value
}>()

const emit = defineEmits<{
  (e: 'update:value', value: Value): void
}>()

const { t } = useI18n({
  messages: {
    en: {
      any: 'Any',
    },
    ru: {
      any: 'Любой',
    },
  },
})

const { getTestId } = useTestId(props.testId)

const updateRating = (newRating: Value) => {
  emit('update:value', newRating)
}
</script>

<style>
.rrs-filter-rating {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.rrs-filter-rating__title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}

.rrs-filter-rating__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rrs-filter-rating__option {
  align-items: center;
  display: flex;
}

.rrs-filter-rating__stars {
  align-items: center;
  display: flex;
  gap: 4px;
  height: 16px;
}

.rrs-filter-rating__star {
  color: var(--rrs-color-grey-300);
  font-size: 16px;
}

.rrs-filter-rating__star.is-active {
  color: var(--rrs-color-yellow);
}
</style>
