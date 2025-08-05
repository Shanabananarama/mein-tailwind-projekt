// =============================================
// ESLint Konfiguration für mein-tailwind-projekt
// =============================================

import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      js
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"]
    }
  }
];