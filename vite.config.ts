import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "CRX Example",
  version: "1.0.0",
  action: {
    default_popup: "src/index.html",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [crx({ manifest })],
});
