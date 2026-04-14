import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { blockBots } from './plugins/vite-block-bots'
import { characterWriter } from './plugins/vite-character-writer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    blockBots(),
    characterWriter(),
  ],
  cacheDir: '/tmp/vite-cache',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        playground: resolve(__dirname, 'playground/index.html'),
      },
    },
  },
})
