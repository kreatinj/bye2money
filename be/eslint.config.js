import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", "node_modules/"]),
  { 
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      perfectionist.configs["recommended-natural"],
    ],
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "no-unused-vars": "off",
    }
  },
]);
