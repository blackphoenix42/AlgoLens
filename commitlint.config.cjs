/* eslint-env node */
/** Conventional Commits rules for commitlint */
module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "header-max-length": [2, "always", 100],
        // "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
        "subject-case": [0],
        "scope-empty": [0],
        "type-empty": [0],
        "subject-empty": [0],
        // "header-max-length": [2, "always", 120],
        "type-enum": [
            2,
            "always",
            [
                "feat",
                "fix",
                "docs",
                "style",
                "refactor",
                "perf",
                "test",
                "build",
                "ci",
                "chore",
                "revert",
                "deps"
            ]
        ]
        // "scope-enum": [
        //     1,
        //     "always",
        //     ["canvas", "engine", "ui", "algorithms", "docs", "export", "a11y", "perf", "e2e", "build", "ci", "deps"]
        // ]
    }
};
