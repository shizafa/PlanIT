import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import apiDevPlugin from './vite-api-dev-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Makes .env.local vars available to the dev-only /api middleware (server-side only,
  // never exposed to the client bundle — only import.meta.env.VITE_* gets inlined there).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
  }
})
