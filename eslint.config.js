export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        js: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
        module: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"]
    }
  }
];