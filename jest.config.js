module.exports = {
  setupFiles: ["<rootDir>/jest.import.js"],
  setupFilesAfterEnv: ["<rootDir>/setUpTests.js"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/test",
    "<rootDir>/_sullof",
  ],
  globals: {
    ethers: require("ethers"),
    _: require("lodash"),
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js"],
  moduleDirectories: ["node_modules", "bower_components", "shared"],
};
