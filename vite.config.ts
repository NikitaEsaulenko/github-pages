import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  let base = '/'

  if (isProduction) {
    base = '/?partnerId=5693c2f665bf19391c0a979c&lang=ru&stock=moscow'
  }

  return {
    base,
    plugins: [
      vue({
        features: {
          customElement: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
