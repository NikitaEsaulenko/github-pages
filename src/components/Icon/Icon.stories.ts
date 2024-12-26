import type { Meta, StoryObj } from '@storybook/vue3'

import { icons } from '@/assets/icons/icons'

import Icon from './Icon.vue'

const meta = {
  component: Icon,
  tags: ['autodocs'],
  title: 'Components/Icon',
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'search',
    testId: 'test-id',
  },
  render: (args) => ({
    components: { Icon },
    setup() {
      return {
        args,
        icons: Object.keys(icons),
      }
    },
    template: `
      <div :style="{display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '16px'}">
        <Icon
            v-for="icon in icons"
            :name="icon"
            :test-id="args.testId"/>
      </div>
    `,
  }),
}
