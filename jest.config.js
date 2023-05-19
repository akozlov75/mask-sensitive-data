/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', 'build'],
}
