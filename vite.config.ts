import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), viteReact(), tailwindcss(), varlockVitePlugin()],
})

export default config
