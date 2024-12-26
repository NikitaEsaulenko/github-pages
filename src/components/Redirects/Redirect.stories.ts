import type { Meta, StoryObj } from '@storybook/vue3'

import { expect } from '@storybook/test'
import { ref } from 'vue'

import Redirect from './Redirect.vue'

const meta = {
  component: Redirect,
  tags: ['autodocs'],
  title: 'Components/Redirect',
} satisfies Meta<typeof Redirect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    testId: 'test-id',
    value: {
      href: 'https://www.google.ru/?hl=en',
      text: 'Узнайте новость тут',
    },
  },
  play: async ({ canvas }) => {
    const redirect = canvas.getByTestId('test-id')
    await expect(redirect).toHaveAttribute('href', 'https://www.google.ru/?hl=en')
  },
  render: (args) => ({
    components: { Redirect },
    setup() {
      const value = ref(args.value)
      return {
        args,
        value,
      }
    },
    template: `
          <Redirect
              :test-id="args.testId"
              v-model:value="value"
              @update:value="args['onUpdate:value']"/>
        `,
  }),
}
