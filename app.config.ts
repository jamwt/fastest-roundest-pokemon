// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname),
      },
    },
  },
});
