const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const filenames = require("eslint-plugin-filenames");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends(
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "prettier",
    ),

    languageOptions: {
        parser: tsParser,

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
            extraFileExtensions: [".mdx"],
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
        "simple-import-sort": simpleImportSort,
        filenames,
    },

    rules: {
        "prettier/prettier": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "@typescript-eslint/no-misused-promises": "off",

        "react/jsx-curly-brace-presence": ["error", {
            props: "never",
            children: "never",
        }],

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-nocheck": "allow-with-description",
        }],

        "filenames/match-regex": [2, "^[a-z-.0-9]+$", true],
    },
}, globalIgnores([
    "types/supabase.ts",
    "components/ui/*",
    "**/.eslintrc.cj",
    "**/next.config.js",
])]);
