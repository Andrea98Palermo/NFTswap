module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "quotes": [1, "double", { "avoidEscape": true }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
};
