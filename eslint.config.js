import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import vue from 'eslint-plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config, configs } from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...configs.recommended,
  perfectionist.configs['recommended-alphabetical'],
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          defineExposeLast: false,
          order: ['defineProps', 'defineEmits'],
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          multiline: 'never',
          selfClosingTag: {
            multiline: 'never',
            singleline: 'never',
          },
          singleline: 'never',
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            component: 'always',
            normal: 'always',
            void: 'always',
          },
          math: 'always',
          svg: 'always',
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          multiline: {
            max: 1,
          },
          singleline: {
            max: 1,
          },
        },
      ],
      'vue/multi-word-component-names': 0,
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'],
    rules: {
      'import/no-unresolved': 0,
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
  },
)
