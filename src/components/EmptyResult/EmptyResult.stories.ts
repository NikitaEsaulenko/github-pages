import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from '@storybook/test'

import EmptyResult from './EmptyResult.vue'

const meta = {
  component: EmptyResult,
  tags: ['autodocs'],
  title: 'Components/EmptyResult',
} satisfies Meta<typeof EmptyResult>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    testId: 'test-id',
  },
  play: async ({ canvas }) => {
    const cmp = canvas.getByTestId('test-id')
    await expect(cmp).toBeVisible()
    await expect(cmp).toHaveTextContent('Nothing was found for your query')
  },
  render: (args) => ({
    components: { EmptyResult },
    setup() {
      return {
        args,
      }
    },
    template: `
      <EmptyResult
          :test-id="args.testId"/>
    `,
  }),
}
