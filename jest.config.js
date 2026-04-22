module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: [
    "src/currency-calculator.ts",
    "!**/*.test.ts",
    "!**/*.config.js",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/coverage/", "/dist/"],
  verbose: true,
};
