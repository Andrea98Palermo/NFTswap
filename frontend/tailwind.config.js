module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "media",
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
  plugins: [require("@tailwindcss/forms")],
}
