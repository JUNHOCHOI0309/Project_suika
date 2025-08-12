import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh'; 
import parser from '@typescript-eslint/parser';
import { types } from 'util';

export default [
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: true,
        window: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        requestAnimationFrame: true,
        cancelAnimationFrame: true,
        HTMLDivElement: true, // Ensure HTMLDivElement is recognized
        HTMLImageElement:true,
        HTMLAudioElement:true,
        React:true,
        types: true, // Ensure types is recognized
        NodeJS: true, // Ensure NodeJS is recognized
        fetch: true, // For fetch API
        Image: true,
        Audio:true,
        crypto:true,
        any : true,
        localStorage:true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': ts,react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Next.js does not require
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/prop-types': 'off', // TypeScript handles prop types
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version 
      }
    },
  },
]