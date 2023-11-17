/**
 * @type {import('jest').Config}
 */

import dotenv from "dotenv";
dotenv.config();

export default {
  verbose: true,
  roots: ["./src/"],
  moduleDirectories: ["node_modules"],
  testTimeout: 30000,
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      {
        tsconfig: "./config/tsconfig.json",
        compiler: "typescript",
      },
    ],
  },
  // See https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1068342692
  moduleNameMapper: {
    // "(.+)\\.js": "$1",
    "^(\\.{1,2}/.*)\\.[jt]s$": "$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  // "coverageReporters": ['json', 'lcov', 'clover']
};
