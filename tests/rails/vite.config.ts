import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  clearScreen: false,
  server: {
    fs: {
      strict: false
    }
  },
  plugins: [
    RubyPlugin(),
  ],
})
