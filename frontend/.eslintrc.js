const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce(
  (acc, rule) => {
    acc[`jsx-a11y/${rule}`] = 'off';
    return acc;
  },
  {},
);

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:import/errors'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    ...a11yOff,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/display-name': 1,
    'no-underscore-dangle': 'off',
    semi: 0,
    indent: [1, 2],
    quotes: [1, 'single', { avoidEscape: true }],
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'react/destructuring-assignment': 0,
    camelcase: 0,
    'react/button-has-type': 0,
    'no-nested-ternary': 0,
    'no-shadow': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/no-array-index-key': 0,
    'import/prefer-default-export': 0,
    'no-inner-declarations': 0,
    'react/jsx-props-no-spreading': 0,
    'no-restricted-syntax': 0,
    'no-unused-vars': 0,
    'import/extensions': 0,
    'guard-for-in': 0,
    'react/jsx-one-expression-per-line': 0,
    'no-undef': 0,
    'no-use-before-define': 0,
    'no-console': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-named-as-default': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'react/jsx-no-useless-fragment': 0,
    'react/jsx-no-constructed-context-values': 0,
    'default-param-last': 0,
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
  },
};
