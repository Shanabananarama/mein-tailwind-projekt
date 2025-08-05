export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly", // ✅ hinzugefügt
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"]
    }
  }
];