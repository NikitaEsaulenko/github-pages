<template>
  <div class="rrs-pagination">
    <template
      v-for="item in pages"
      :key="item">
      <div
        v-if="item !== null"
        :class="{ 'is-active': page === item }"
        :data-testid="getTestId(`page-${item}`)"
        class="rrs-pagination__page"
        tabindex="0"
        @keydown.prevent.enter.space
        @keyup.enter.space="updatePage(item)"
        @pointerup="updatePage(item)">
        {{ item }}
      </div>
      <div
        v-else
        class="rrs-pagination__dots">
        <Icon name="more" />
      </div>
    </template>

    <Button
      v-if="!nextDisabled"
      :test-id="getTestId('next')"
      :text="t('next')"
      color="white"
      icon="arrowRight"
      icon-right
      @pointerup="updatePage(page + 1)" />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import Icon from '@/components/Icon/Icon.vue'
import { useTestId } from '@/use/useTestId'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  page: number
  pagesCount: number
  range: number
  testId: string
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const { t } = useI18n({
  messages: {
    en: {
      next: 'Next',
    },
    ru: {
      next: 'Далее',
    },
  },
})

const { getTestId } = useTestId(props.testId)

const pages = computed(() => {
  const result: (null | number)[] = []

  const MIN_PAGE = 1
  const FIRST_VISIBLE_PAGE_OFFSET = MIN_PAGE + 1 // Первая видимая страница
  const LAST_VISIBLE_PAGE_OFFSET = 1 // Смещение для последней видимой страницы

  const halfRange = Math.floor(Math.max(props.range, 1) / 2)

  let start = Math.max(FIRST_VISIBLE_PAGE_OFFSET, props.page - halfRange)
  let end = Math.min(props.pagesCount - LAST_VISIBLE_PAGE_OFFSET, props.page + halfRange)

  if (props.page - halfRange < FIRST_VISIBLE_PAGE_OFFSET) {
    end = Math.min(
      props.pagesCount - LAST_VISIBLE_PAGE_OFFSET,
      end + (halfRange - (props.page - FIRST_VISIBLE_PAGE_OFFSET)),
    )
  }

  if (props.page + halfRange > props.pagesCount - LAST_VISIBLE_PAGE_OFFSET) {
    start = Math.max(
      FIRST_VISIBLE_PAGE_OFFSET,
      start - (props.page + halfRange - (props.pagesCount - LAST_VISIBLE_PAGE_OFFSET)),
    )
  }

  result.push(MIN_PAGE)

  if (start > FIRST_VISIBLE_PAGE_OFFSET) {
    result.push(null)
  }

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  if (end < props.pagesCount - LAST_VISIBLE_PAGE_OFFSET) {
    result.push(null)
  }

  if (props.pagesCount > 1) {
    result.push(props.pagesCount)
  }

  return result
})

const nextDisabled = computed(() => {
  return props.page >= props.pagesCount
})

const updatePage = (value: number) => {
  if (value !== props.page) {
    emit('update:page', value)
  }
}
</script>

<style>
.rrs-pagination {
  align-items: center;
  display: flex;
  gap: 4px;
}

.rrs-pagination__page {
  align-items: center;
  border-radius: 20px;
  box-sizing: border-box;
  color: var(--rrs-color-brand);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 400;
  height: 36px;
  justify-content: center;
  line-height: 20px;
  min-width: 40px;
  padding: 8px 16px;
  width: auto;

  &:hover,
  &:focus-visible {
    background-color: var(--rrs-color-brand-100);
  }

  &:active {
    background-color: var(--rrs-color-brand-200);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-brand-300);
    outline-offset: -2px;
  }
}

.rrs-pagination__page.is-active {
  background-color: var(--rrs-color-brand);
  color: var(--rrs-color-white);

  &:hover,
  &:focus-visible {
    background-color: var(--rrs-color-brand-400);
  }

  &:active {
    background-color: var(--rrs-color-brand-500);
  }

  &:focus-visible {
    outline: 2px solid var(--rrs-color-brand-500);
    outline-offset: -2px;
  }
}

.rrs-pagination__dots {
  align-items: center;
  color: var(--rrs-color-grey-400);
  display: inline-flex;
  height: 24px;
  justify-content: center;
  padding: 4px;
  width: 24px;
}
</style>
