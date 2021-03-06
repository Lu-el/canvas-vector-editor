module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    rules: {
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': ['off', { ignore: ['.png$', '.svg$'] }]
    },
    globals: {
        Promise: true,
        document: true,
        window: true
    },
    env: {
        browser: true,
        node: true
    }
};
