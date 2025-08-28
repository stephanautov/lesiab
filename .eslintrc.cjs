// path: .eslintrc.cjs
/** ESLint for Next + TSX (no type-aware rules to keep it fast & simple) */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier", // turn off stylistic rules that conflict with Prettier
  ],
  ignorePatterns: ["node_modules/", ".next/", "artifacts/", "supabase/functions/**"],
  rules: {
    // keep the ruleset quiet while scaffolding
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
