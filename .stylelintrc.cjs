/* eslint-env node */
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-length': 'short',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'selector-class-pattern': null,
  },
  ignoreFiles: ['**/node_modules/**'],
};
