/** Minimal ESLint config; other nodes may extend but should not overwrite. */
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  env: { es2022: true, node: true, browser: true },
  extends: [],
  rules: {
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "no-console": "off",
  },
  ignorePatterns: ["node_modules/", ".next/", "dist/", "out/", "artifacts/"],
};
