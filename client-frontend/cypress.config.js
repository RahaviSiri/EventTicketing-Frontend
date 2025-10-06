import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // your frontend
    setupNodeEvents(on, config) {
      // You can add event hooks or plugins here if needed later
      return config;
    },
    video: false, // optional: disable video to speed up runs
    screenshotOnRunFailure: true, // helpful for debugging
  },
});
