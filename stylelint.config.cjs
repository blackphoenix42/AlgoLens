/* eslint-env node, commonjs */
/** Stylelint config for AlgoLens (CSS + Tailwind) */
module.exports = {
    extends: [
        "stylelint-config-recommended",
        "stylelint-config-standard",
        "stylelint-config-tailwindcss",
    ],
    plugins: ["stylelint-order"],
    rules: {
        // Keep ordering predictable (works well with Prettier)
        "order/properties-alphabetical-order": true,

        // Reasonable relaxations for modern utility-first CSS
        "no-descending-specificity": null,
        "selector-class-pattern": null,

        // Minor preferences
        "color-hex-length": "short",
        "alpha-value-notation": "percentage",
    },
    overrides: [
        // Parse inline styles in HTML-like files if you have any
        {
            files: ["**/*.{html,astro,svelte,vue}"],
            customSyntax: "postcss-html",
        },
    ],
    ignoreFiles: [
        "dist/**",
        "build/**",
        "node_modules/**",
        "e2e/__screenshots__/**",
        "playwright-report/**",
        "test-results/**",
    ],
};
