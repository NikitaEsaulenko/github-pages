<template>
  <div
    ref="rootEl"
    class="rrs-carousel">
    <!--items-->
    <div class="rrs-carousel__content">
      <div
        ref="items"
        :data-testid="getTestId('items')"
        class="rrs-carousel__items"
        :style="style">
        <slot />
      </div>
    </div>

    <!--arrows-->
    <div
      v-if="!prevDisabled"
      class="rrs-carousel__arrow rrs-carousel__arrow-prev"
      :data-testid="getTestId('prev')"
      @click="prev">
      <Icon name="arrowLeft" />
    </div>

    <div
      v-if="!nextDisabled"
      class="rrs-carousel__arrow rrs-carousel__arrow-next"
      :data-testid="getTestId('next')"
      @click="next">
      <Icon name="arrowRight" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import { useTestId } from '@/use/useTestId'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  testId: string
}>()

const { getTestId } = useTestId(props.testId)

const rootEl = ref<HTMLElement | null>(null)
const items = ref<HTMLElement | null>(null)

const left = ref(0)
const scrollWidth = ref(0)
const offsetWidth = ref(0)

const style = computed(() => {
  return {
    transform: `translate3d(${-left.value}px, 0, 0)`,
  }
})

const min = 0

const max = computed(() => {
  return scrollWidth.value - offsetWidth.value
})

const prevDisabled = computed(() => {
  return left.value <= min
})

const nextDisabled = computed(() => {
  return left.value >= max.value
})

const prev = () => {
  if (prevDisabled.value) return
  left.value = Math.max(findPrevLeft(), min)
}

const next = () => {
  if (nextDisabled.value) return
  left.value = Math.min(findNextLeft(), max.value)
}

const findPrevLeft = () => {
  const length = items.value?.children.length || 0
  for (let i = length - 1; i >= 0; i -= 1) {
    const el = items.value?.children[i] as HTMLElement
    if (el.offsetLeft < left.value) return el.offsetLeft - offsetWidth.value + el.offsetWidth
  }
  return min
}

const findNextLeft = () => {
  const trackWidth = left.value + offsetWidth.value
  const length = items.value?.children.length || 0
  for (let i = 0; i < length; i += 1) {
    const el = items.value?.children[i] as HTMLElement
    const elWidth = el.offsetLeft + el.offsetWidth
    if (elWidth > trackWidth) return el.offsetLeft
  }
  return max.value
}

const updateLayout = () => {
  if (!items.value) return

  scrollWidth.value = items.value.scrollWidth
  offsetWidth.value = items.value.offsetWidth
  left.value = 0
}

const resizeObserver = new ResizeObserver(updateLayout)

onMounted(() => {
  if (rootEl.value) resizeObserver.observe(rootEl.value)
})

onBeforeUnmount(() => {
  if (rootEl.value) resizeObserver.unobserve(rootEl.value)
})
</script>

<style>
.rrs-carousel {
  display: flex;
  position: relative;
  width: 100%;
}

.rrs-carousel__content {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.rrs-carousel__items {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  width: 100%;

  & > * {
    box-sizing: border-box;
    flex: 0 0 auto;
    max-width: 100%;
  }
}

.rrs-carousel__arrow {
  align-items: center;
  background-color: var(--rrs-color-white);
  border-radius: 50%;
  box-shadow: 0 0 12px 0 rgb(0 0 0 / 10%);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 32px;
  justify-content: center;
  max-height: 32px;
  max-width: 32px;
  min-height: 32px;
  min-width: 32px;
  position: absolute;
  top: 50%;
  user-select: none;
  width: 32px;
  z-index: 1;
}

.rrs-carousel__arrow-prev {
  left: 16px;
  transform: translate(-100%, -50%);
}

.rrs-carousel__arrow-next {
  right: 16px;
  transform: translate(100%, -50%);
}
</style>
