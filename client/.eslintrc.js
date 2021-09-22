module.exports = {
  extends: ['@xrplf'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'import/no-unused-modules': 'off',
    'jsdoc/require-jsdoc': 'off',
    // TODO not resolving some legit modules
    'node/no-missing-import': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    // TODO seems to not like .tsx
    'react/jsx-filename-extension': 'off',
    // should make it into our general config for react
    'node/file-extension-in-import': 'off',
    // should make it into our general config for react
    'import/no-unassigned-import': 'off',
    // should make it into our general config for react
    'func-style': [
      'warn',
      'expression',
      {
        'allowArrowFunctions': true,
      },
    ],
    // TODO dunno
    '@typescript-eslint/triple-slash-reference': 'off',
    // TODO dunno
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    // TODO later
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    'no-debugger': 'off',
    'react/require-default-props': 'off',
  },
}
