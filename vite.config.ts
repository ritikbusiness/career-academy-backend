import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { componentTagger } from "lovable-tagger";

export default defineConfig(async ({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      port: 5000,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(process.cwd(), "client", "src"),
      },
      {
        find: "@shared",
        replacement: path.resolve(process.cwd(), "shared"),
      },
      {
        find: "@assets",
        replacement: path.resolve(process.cwd(), "attached_assets"),
      },
    ],
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
}));
