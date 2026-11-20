module.exports = {
  preset: "jest-expo",
  watchman: false,
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  clearMocks: true,
  collectCoverageFrom: [
    "lib/config.ts",
    "lib/api.ts",
    "state/app.ts",
    "state/auth.ts",
  ],
};
