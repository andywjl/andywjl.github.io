module.exports = {
  root: true,
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/coverage/**",
    "src/**",
    "scripts/**",
    "prisma/**",
    "public/**",
  ],
  overrides: [
    {
      files: ["**/*.{js,cjs,mjs,ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        "no-var": "error",
      },
    },
  ],
};
