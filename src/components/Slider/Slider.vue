<template>
  <div
    ref="sliderEl"
    :data-testid="testId"
    class="rrs-slider"
    @pointerdown="onPointerdownSlider">
    <div
      :style="{ left: `${percentValue.from}%`, right: `${100 - percentValue.to}%` }"
      class="rrs-slider__bar" />
    <div
      v-for="thumb in ['from', 'to'] as Thumb[]"
      :key="thumb"
      class="rrs-slider__thumb"
      :class="{
        'rrs-slider__thumb--from': thumb === 'from',
        'rrs-slider__thumb--to': thumb === 'to',
      }"
      :data-testid="getTestId(thumb)"
      :style="{ left: `${percentValue[thumb]}%` }"
      @pointerdown.stop="startDragging(thumb)" />
  </div>
</template>

<script setup lang="ts">
import { normalizeDecimalNumber } from '@/helpers/normalizeDecimalNumber'
import { useTestId } from '@/use/useTestId'
import { cloneDeep, isEqual } from 'lodash-es'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

type Value = { from: null | number; to: null | number }

type Thumb = 'from' | 'to'

const props = defineProps<{
  max: number
  min: number
  step: number
  testId: string
  value: Value
}>()

const emit = defineEmits<{
  (e: 'pointerup'): void
  (e: 'update:value', value: Value): void
}>()

const { getTestId } = useTestId(props.testId)

const state = reactive<{
  sliderResized: boolean
  value: Value
}>({
  sliderResized: false,
  value: {
    from: null,
    to: null,
  },
})

const sliderEl = ref<HTMLDivElement>()
const draggingEl = ref<null | Thumb>(null)

const resizeObserver = new ResizeObserver(() => {
  state.sliderResized = true
  state.sliderResized = false
})

const sliderRect = computed(() => {
  if (sliderEl.value && !state.sliderResized) {
    const { left, width } = sliderEl.value.getBoundingClientRect()
    return {
      left,
      width,
    }
  }
  return {
    left: 0,
    width: 0,
  }
})

const percentValue = computed(() => {
  const range = props.max - props.min

  const from = state.value.from !== null ? state.value.from : props.min
  const to = state.value.to !== null ? state.value.to : props.max

  return {
    from: ((from - props.min) / range) * 100,
    to: ((to - props.min) / range) * 100,
  }
})

const roundToStep = (value: number) => {
  const newValue = normalizeDecimalNumber(Math.round(value / props.step) * props.step)
  return Object.is(newValue, -0) ? 0 : newValue
}

const onPointerdownSlider = (e: PointerEvent) => {
  const clickX = e.clientX - sliderRect.value.left
  const clickPercent = clickX / sliderRect.value.width
  const newValue = clickPercent * (props.max - props.min) + props.min
  const closerThumb =
    Math.abs(clickPercent - percentValue.value.from / 100) <
    Math.abs(clickPercent - percentValue.value.to / 100)
      ? 'from'
      : 'to'
  updateValueFromThumbPosition(newValue, closerThumb)
  startDragging(closerThumb)
}

const startDragging = (thumb: Thumb) => {
  draggingEl.value = thumb
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDragging)
}

const stopDragging = () => {
  draggingEl.value = null
  emit('pointerup')
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDragging)
}

const onPointerMove = (event: PointerEvent) => {
  if (!draggingEl.value) return
  const newPosition = (event.clientX - sliderRect.value.left) / sliderRect.value.width
  updateValueFromThumbPosition(newPosition * (props.max - props.min) + props.min, draggingEl.value)
}

const updateValueFromThumbPosition = (newPosition: number, thumb: Thumb) => {
  const validPosition = Math.min(Math.max(newPosition, props.min), props.max)
  const roundedValue = roundToStep(validPosition)

  if (thumb === 'from') {
    if (state.value.from === null || roundedValue !== state.value.from) {
      if (roundedValue > (state.value.to ?? props.max)) {
        state.value = { from: state.value.to, to: roundedValue }
        draggingEl.value = 'to'
      } else {
        state.value = { ...state.value, from: roundedValue }
      }
    }
  }

  if (thumb === 'to') {
    if (state.value.to === null || roundedValue !== state.value.to) {
      if (roundedValue < (state.value.from ?? props.min)) {
        state.value = { from: roundedValue, to: state.value.from }
        draggingEl.value = 'from'
      } else {
        state.value = { ...state.value, to: roundedValue }
      }
    }
  }
}

onMounted(() => {
  if (sliderEl.value) resizeObserver.observe(sliderEl.value)
})

onBeforeUnmount(() => {
  if (sliderEl.value) resizeObserver.unobserve(sliderEl.value)
})

watch(
  () => state.value,
  () => {
    if (!isEqual(props.value, state.value)) {
      emit('update:value', cloneDeep(state.value))
    }
  },
  { deep: true },
)

watch(
  () => props.value,
  () => {
    if (!isEqual(props.value, state.value)) {
      state.value = cloneDeep(props.value)
    }
  },
  { deep: true, immediate: true },
)
</script>

<style>
.rrs-slider {
  align-items: center;
  background-color: var(--rrs-color-grey-200);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  height: 4px;
  margin: 0 calc(16px * 0.5);
  position: relative;
  touch-action: none;
  user-select: none;
  width: auto;
  z-index: 0;
}

.rrs-slider__bar {
  background-color: #0073e6;
  border-radius: 8px;
  height: 100%;
  position: absolute;
  width: auto;
}

.rrs-slider__thumb {
  background-color: #0073e6;
  border-radius: 50%;
  cursor: pointer;
  height: 16px;
  position: absolute;
  top: 50%;
  touch-action: none;
  width: 16px;
  z-index: 1;
}

.rrs-slider__thumb--from {
  transform: translate(-50%, -50%);
}

.rrs-slider__thumb--to {
  transform: translate(-50%, -50%);
}
</style>
