const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({
      addComponents
    }) => {
      addComponents([{
        "@font-face": {
          "font-family": "Barlow",
          "src": "url(/fonts/Barlow/Barlow-Regular.woff2)",
          "font-weight": 400
        }
      }, {
        "@font-face": {
          "font-family": "Barlow",
          "src": "url(/fonts/Barlow/Barlow-Medium.woff2)",
          "font-weight": 500
        }
      }, {
        "@font-face": {
          "font-family": "Barlow Condensed",
          "src": "url(/fonts/BarlowCondensed/BarlowCondensed-Light.woff2)",
          "font-weight": 300
        }
      }, {
        "@font-face": {
          "font-family": "Barlow Condensed",
          "src": "url(/fonts/BarlowCondensed/BarlowCondensed-ExtraLight.woff2)",
          "font-weight": 200
        }
      }, {
        "h1": {
          "font-family": "Barlow Condensed",
          "font-weight": 200
        }
      }, {
        "h2": {
          "font-family": "Barlow Condensed",
          "font-weight": 200
        }
      }, {
        "h3": {
          "font-family": "Barlow",
          "font-weight": 400
        }
      }, {
        "p": {
          "font-family": "Barlow",
          "font-weight": 400
        }
      }, {
        "li": {
          "font-family": "Barlow",
          "font-weight": 400
        }
      }, {
        "input": {
          "font-family": "Barlow",
          "font-weight": 400
        }
      }])
    })
  ],
}