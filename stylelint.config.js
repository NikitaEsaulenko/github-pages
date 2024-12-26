export default {
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      customSyntax: 'postcss-html',
      files: ['**/*.vue'],
    },
  ],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['each'],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['map-get'],
      },
    ],
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
  },
}
