const CracoSwcPlugin = require("craco-swc")

module.exports = {
  tyle: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
  plugins: [
    {
      plugin: CracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          "minify": true,
          jsc: {
            "minify": {
              "compress": true,
              "mangle": true
            },
            externalHelpers: true,
            target: "es2021",
            transform: {
              react: {
                "runtime": "automatic"
              },
            },
            parser: {
              syntax: "ecmascript",
              jsx: true,
              dynamicImport: true,
              exportDefaultFrom: true,
            },
          },
          "env": {
            "coreJs": 3
          }
        },
      },
    },
  ],
}