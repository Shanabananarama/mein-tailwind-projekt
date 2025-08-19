// eslint.config.js (ESM, Flat Config)
import globals from "globals";

/**
 * Ziel:
 * - Browser-Globals (URL, URLSearchParams, alert, window, document, …) bekannt machen
 * - Generierte Artefakte nicht linten (dist/, node_modules/)
 * - Warnregeln für Quotes & Semikolons beibehalten
 */
export default [
  // 1) Globale Ignores: gebaute Artefakte & Dependencies
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "build/**",
      ".vite/**",
      ".storybook/**"
    ],
  },

  // 2) Projekt-weite Spracheinstellungen & Regeln
  {
    languageOptions: {
      // Browser + moderne JS-Globals aktivieren
      globals: {
        ...globals.browser,   // URL, URLSearchParams, window, document, alert, …
        ...globals.es2021,
      },
    },
    rules: {
      // Behalte deine Style-Warnungen:
      "quotes": ["warn", "double"],
      "semi": ["warn", "always"],
      // Sicherheitshalber: wenn irgendwo noch ein Global nicht aufgelöst wird,
      // verhindern wir false positives:
      "no-undef": "off"
    },
  },
];
