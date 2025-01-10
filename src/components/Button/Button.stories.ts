import type { Meta, StoryObj } from '@storybook/vue3'

import { icons } from '@/assets/icons/icons'
import { fn } from '@storybook/test'

import Button from './Button.vue'

const onPointerupMock = fn()

const colors = ['primary', 'secondary', 'white', 'yellow']

const meta = {
  argTypes: {
    color: { options: colors },
    icon: { options: ['', ...Object.keys(icons)] },
  },
  component: Button,
  tags: ['autodocs'],
  title: 'Components/Button',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: 'primary',
    icon: 'search',
    iconRight: false,
    onPointerup: onPointerupMock,
    testId: 'test-id',
    text: 'Button',
  },
}
