module.exports = {
  collectCoverage: false,
  displayName: "Git Workshop",
  errorOnDeprecated: true,
  reporters: ["jest-standard-reporter"],
  slowTestThreshold: 10,
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test|it|e2e).[jt]s?(x)"],
  testTimeout: 5000,
  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
  },
  verbose: true,
};
