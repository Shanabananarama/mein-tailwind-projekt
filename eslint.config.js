export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        js: "readonly",
        module: "readonly",
        console: "readonly"
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