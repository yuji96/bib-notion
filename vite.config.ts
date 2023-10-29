import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "CRX Example",
  version: "1.0.0",
  icons: {
    32: "icons/leaf-32.png",
  },

  permissions: ["activeTab", "storage"],
  host_permissions: ["https://api.notion.com/v1/*"],
  action: {},
  background: {
    service_worker: "src/service_worker/background.ts",
  },
  content_scripts: [
    {
      matches: ["https://papers.nips.cc/paper_files/paper/*/hash/*.html"],
      js: ["src/content_scripts/neurips.ts"],
    },
  ],
  options_ui: {
    page: "src/options/options.html",
    open_in_tab: false,
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: crx({ manifest }),
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
