import { defineConfig } from 'astro/config';

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  outDir: './server/public',
  vite: {
    build: {
      inlineStylesheets: 'never',
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'chunks/chunk.[hash].mjs',
          assetFileNames: 'css/[name][extname]'
        }
      }
    }
  },
  integrations: [playformCompress()]
});