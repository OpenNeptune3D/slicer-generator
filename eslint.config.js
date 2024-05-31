import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '[A-Z](?:[A-Z_]+|[a-z]+)',
      }],
    },
    files: ["src/**/*.js", "src/**/*.jsx"],
  },
  pluginJs.configs.recommended,
];