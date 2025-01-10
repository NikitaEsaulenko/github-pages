import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from '@storybook/test'

import Suggestion from './Suggestion.vue'

const meta = {
  component: Suggestion,
  tags: ['autodocs'],
  title: 'Components/Suggestion',
} satisfies Meta<typeof Suggestion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    suggestion: 'Смартфон iPhone 13 Pro',
    testId: 'test-id',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('test-id')).toBeVisible()
  },
  render: (args) => ({
    components: { Suggestion },
    setup() {
      return {
        args,
      }
    },
    template: `
          <Suggestion
              :test-id="args.testId"
              :suggestion="args.suggestion"/>
        `,
  }),
}
