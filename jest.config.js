module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'currency-calculator.ts',
    '!**/*.test.ts',
    '!**/*.config.js',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  verbose: true
};
