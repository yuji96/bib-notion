import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "CRX Example",
  version: "1.0.0",
  icons: {
    32: "icons/leaf-green-32.png",
  },

  permissions: ["activeTab", "storage"],
  host_permissions: [
    "https://api.notion.com/v1/*",
    "https://papers.nips.cc/paper_files/paper/*/hash/*.html",
    "https://proceedings.neurips.cc/paper_files/paper/*/hash/*-Abstract.html",
    "https://aclanthology.org/*-*/",
    "https://openreview.net/forum?id=*",
    "https://arxiv.org/abs/*",
  ],
  action: {},
  background: {
    service_worker: "src/service_worker/background.ts",
  },
  content_scripts: [
    {
      matches: [
        "https://papers.nips.cc/paper_files/paper/*/hash/*.html",
        "https://proceedings.neurips.cc/paper_files/paper/*/hash/*-Abstract.html",
      ],
      js: ["src/content_scripts/neurips.ts"],
    },
    {
      matches: ["https://aclanthology.org/*-*/"],
      js: ["src/content_scripts/aclanthology.ts"],
    },
    {
      matches: ["https://openreview.net/forum?id=*"],
      js: ["src/content_scripts/openreview.ts"],
    },
    {
      matches: ["https://arxiv.org/abs/*"],
      js: ["src/content_scripts/arxiv.ts"],
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
