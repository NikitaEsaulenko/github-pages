import type { Meta, StoryObj } from '@storybook/vue3'

import { wait } from '@/helpers/wait'
import { expect, screen, userEvent } from '@storybook/test'

import Carousel from './Carousel.vue'

const getRandomWidth = (min: number, max: number) =>
  `${(Math.random() * (max - min) + min).toFixed(0)}px`

const getRandomColor = () =>
  `hsl(${360 * Math.random()},${25 + 50 * Math.random()}%,${85 + 10 * Math.random()}%)`

const meta = {
  component: Carousel,
  tags: ['autodocs'],
  title: 'Components/Carousel',
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    testId: 'carousel',
  },
  play: async ({ canvas }) => {
    await wait(100)
    await expect(canvas.getByTestId('carousel-item-3')).toBeVisible()
    await userEvent.click(canvas.getByTestId('carousel-next'))
    await expect(canvas.getByTestId('carousel-item-7')).toBeVisible()
    await expect(screen.getByTestId('carousel-prev')).toBeVisible()
    await userEvent.click(canvas.getByTestId('carousel-prev'))
  },
  render: (args) => ({
    components: { Carousel },
    setup() {
      const items = Array.from({ length: 20 }, () => ({
        color: getRandomColor(),
        width: getRandomWidth(100, 200),
      }))

      return {
        args,
        items,
      }
    },
    template: `
          <Carousel :test-id="args.testId"
                    style="max-width: 600px"
                    v-bind="args"
          >
            <div
                v-for="(item, index) in items"
                :key="index"
                :data-testid="'carousel-item' + '-' + index"
                :style="{
          width: item.width,
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          backgroundColor: item.color,
          userSelect: 'none'
        }"
            >
              {{ index }}
            </div>
          </Carousel>
        `,
  }),
}
