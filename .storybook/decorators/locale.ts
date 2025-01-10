import { DecoratorFunction } from '@storybook/types'
import { VueRenderer } from '@storybook/vue3'

import { i18n } from '../../src/locale'

export const locale: DecoratorFunction<VueRenderer> = (story, context) => {
  const { locale } = context.globals
  if (locale) {
    i18n.global.locale = locale
  }
  return story(context)
}
