export default {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'body-case': [2, 'always', ['sentence-case']],
    'scope-case': [2, 'always', ['upper-case']],
    'subject-case': [2, 'always', ['sentence-case']],
  },
}
