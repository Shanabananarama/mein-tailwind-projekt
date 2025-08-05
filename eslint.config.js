export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        js: "readonly",
        console: "readonly"   // ✅ Neu hinzugefügt
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"]
    }
  }
];