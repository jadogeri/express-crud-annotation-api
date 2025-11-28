
 import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  globalTeardown: '<rootDir>/tests/__configurations__/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/__configurations__/setup.ts'],
  globalSetup: '<rootDir>/tests/__configurations__/global-setup.ts',
  testRunner: "jest-circus/runner",
  workerIdleMemoryLimit: "512MB",
  coveragePathIgnorePatterns: [
      "<rootDir>/tests/"
  ]

};
