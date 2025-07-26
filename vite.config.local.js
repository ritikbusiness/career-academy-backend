// Local override for Vite allowedHosts in Replit environment
import { defineConfig } from "vite";
import baseConfig from "./vite.config.js";

export default defineConfig({
  ...baseConfig,
  server: {
    ...baseConfig.server,
    allowedHosts: [
      "674e1bb6-2f36-423f-861a-9d220e6a1ff1-00-1rphil3ttx53k.kirk.replit.dev",
      "replit.app", 
      "replit.dev", 
      "localhost",
      ".replit.dev",
      ".kirk.replit.dev"
    ]
  }
});