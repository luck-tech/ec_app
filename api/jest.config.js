export default {
  preset: "ts-jest",
  testEnvironment: "@quramy/jest-prisma/environment",
  testMatch: ["<rootDir>/__tests__/routes/*.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {tsconfig: "tsconfig.json"}],
  },
  globalSetup: "./jest-global-setup.js",
  globalTeardown: "./jest-global-teardown.js",
  globals: {
    API_PORT: process.env.PORT || 5555,
    API_URL: `http://localhost:${process.env.PORT || 5555}`,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@db/(.*)$": "<rootDir>/prisma/$1",
    "^@tests/(.*)$": "<rootDir>/__tests__/$1",
  },
};
