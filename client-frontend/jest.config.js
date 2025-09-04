export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",  // let Babel handle JS + JSX
  },
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
