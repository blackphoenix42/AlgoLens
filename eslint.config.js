// Flat ESLint config for React + TypeScript (ESLint 9+ compatible)
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    // Ignore build artefacts, snapshots, etc.
    {
        ignores: [
            "dist/**",
            "build/**",
            "node_modules/**",
            "playwright-report/**",
            "test-results/**",
            "e2e/__screenshots__/**"
        ]
    },

    // Base JS rules
    js.configs.recommended,

    // TS rules (non-type-checked to keep it fast; switch to recommendedTypeChecked if desired)
    ...tseslint.configs.recommended,

    // App rules
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node },
            // For type-aware rules, set parserOptions.project to your tsconfig and use configs.recommendedTypeChecked
            parserOptions: { warnOnUnsupportedTypeScriptVersion: false }
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            import: importPlugin,
            "unused-imports": unusedImports
        },
        settings: {
            react: { version: "detect" },
            "import/resolver": { node: { extensions: [".js", ".jsx", ".ts", ".tsx"] } }
        },
        rules: {
            // React
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Accessibility
            "jsx-a11y/anchor-is-valid": "warn",

            // Imports
            "import/order": [
                "warn",
                {
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
                    pathGroupsExcludedImportTypes: ["builtin"]
                }
            ],
            "import/no-unresolved": "off", // let TS handle it
            "import/no-duplicates": "warn",

            // Unused code
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
            ],

            // General hygiene
            "no-console": process.env.CI ? "warn" : "off",
            "no-debugger": process.env.CI ? "error" : "warn"
        }
    },

    // Disable stylistic rules that Prettier handles
    prettier
);
