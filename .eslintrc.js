
module.exports = {
  "extends": "eslint:recommended",
  "rules": {
    "no-console": 0
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  // "plugins": [
  //   "html"
  // ],
  "globals": {
    "CustomElements": true,
    "HTMLImports": true,
    "Polymer": true
  }
}