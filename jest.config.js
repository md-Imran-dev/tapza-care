module.exports = {
  preset: "jest-expo",
  watchman: false,
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  clearMocks: true,
  collectCoverageFrom: [
    "utilities/config.ts",
    "services/apiService.ts",
    "store/careStore.ts",
    "store/authStore.ts",
  ],
};
