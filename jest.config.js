module.exports = {
  preset: "jest-expo",
 watchman:false,
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  clearMocks: true,
  collectCoverageFrom: [
    "src/lib/config.ts",
    "src/lib/api.ts",
    "src/state/app.ts",
    "src/state/auth.ts",
  ],
};
