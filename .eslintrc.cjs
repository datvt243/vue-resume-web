/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
        },
        {
            files: ['*.vue'],
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
    ],
    rules: {},
}
