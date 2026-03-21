import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier/flat"

export default defineConfig(
  {
    files: ["src/**/*.ts"],
    plugins: { js },
    extends: ["js/recommended", tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  prettier,
  {
    ignores: [
      "dist/**",
      "dist-ext/**",
      "node_modules/**",
      "scripts/**",
      "plugins/**",
      "extension/**",
      "*.config.*",
    ],
  },
)
