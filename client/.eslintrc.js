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
    // TODO later
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'max-lines-per-function': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    // unsure
    'import/no-named-as-default': 'off',
    // keeps getting confused about what is async
    '@typescript-eslint/promise-function-async': 'off',
    // doesn't seem to work right
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
}
