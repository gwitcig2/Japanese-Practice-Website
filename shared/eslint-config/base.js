import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import turboPlugin from 'eslint-plugin-turbo'
import onlyWarn from 'eslint-plugin-only-warn'

export const base = [

    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        plugins: {
            turbo: turboPlugin,
        },
        rules: {
            "turbo/no-undeclared-env-vars": "warn",
        }
    },
    {
        plugins: {
            onlyWarn,
        }
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
    },
    {
        ignores: ["dist/**"],
    },
];