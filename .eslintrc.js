module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'linebreak-style': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'global-require': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'no-unused-expressions': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'max-len': 'off',
    'no-unused-vars': 'off',
    'vue/no-reserved-component-names': 'off',
    'no-underscore-dangle': 'off',
  },
};
