module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    extraFileExtensions: [".mdx"],
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    "simple-import-sort",
    "eslint-plugin-filenames",
  ],
  rules: {
    "prettier/prettier": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-misused-promises": "off",
    "react/jsx-curly-brace-presence": [
      "error",
      { props: "never", children: "never" },
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-nocheck": "allow-with-description",
      },
    ],
    "filenames/match-regex": [2, "^[a-z-.0-9]+$", true],
  },
  ignorePatterns: [
    "types/supabase.ts",
    "/ui/*",
    ".eslintrc.cj",
    "next.config.js",
  ],
};
