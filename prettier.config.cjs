/** Prettier config for AlgoLens */
module.exports = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: "always",
    endOfLine: "lf",
    proseWrap: "preserve",
    embeddedLanguageFormatting: "auto",

    overrides: [
        { files: "*.md", options: { proseWrap: "always" } },
        { files: ["*.yml", "*.yaml", "*.css", "*.scss"], options: { singleQuote: false } }
    ],

    // Sorts Tailwind classes—install: npm i -D prettier prettier-plugin-tailwindcss
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindFunctions: ["clsx", "classnames", "twMerge", "cva"]
};
