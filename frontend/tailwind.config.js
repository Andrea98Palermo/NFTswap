const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.{js,jsx}"]
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        green: "#76DE65",
      },
      fontFamily: {
        "source-code": ["\"Source Code Pro\"", "monospace"]
      }
    },
  },
  plugins: [],
}
