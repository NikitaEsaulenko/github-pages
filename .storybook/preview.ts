import { Preview, setup } from '@storybook/vue3'

import '../src/assets/styles/main.css'
import './assets/main.css'
import { i18n } from '../src/locale'
import { locale } from './decorators/locale'

setup((app) => {
  app.use(i18n)
})

const preview: Preview = {
  decorators: [locale],
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      name: 'Locale',
      toolbar: {
        icon: 'globe',
        items: [
          { title: 'Russian', value: 'ru' },
          { title: 'English', value: 'en' },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
