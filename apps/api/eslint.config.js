import { defineConfig } from 'eslint/config'
import globals from 'globals'
import n from 'eslint-plugin-n'
import { base } from '@kanpeki/eslint-config/base'

export default defineConfig([
    ...base,
    n.configs['flat/recommended'],
    {
        files: ['**/*.js', '**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'n/no-missing-import': 'off',
            'n/no-unsupported-features/es-syntax': 'off',
            'n/no-process-env': 'off',
        },
    },
])
