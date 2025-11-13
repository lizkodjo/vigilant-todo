// jest.config.cjs - CommonJS configuration
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.cjs",
    "<rootDir>/src/setupTests.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "cjs"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
};
