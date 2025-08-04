// eslint.config.js

import js from "@eslint/js";
import globals from "globals";

export default [
    {
        files: ["**/*.js", "**/*.jsx", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "no-unused-vars": "warn",       // Warnt bei ungenutzten Variablen
            "no-undef": "error",            // Fehler bei nicht definierten Variablen
            "semi": ["error", "always"],    // Erzwingt Semikolons
            "quotes": ["error", "double"],  // Erzwingt doppelte Anführungszeichen
        },
    },
];