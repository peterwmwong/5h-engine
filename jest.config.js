module.exports = {
  "globals": {
    "ts-jest": { "enableTsDiagnostics": true }
  },
  "transform": {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "src/.*test\\.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ]
};
