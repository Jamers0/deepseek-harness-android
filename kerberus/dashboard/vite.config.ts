import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: ['dashboard.kerberus.uk', 'term.kerberus.uk', '100.109.109.51', 'localhost'],
    proxy: { '/api': 'http://127.0.0.1:3000' },
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: ['dashboard.kerberus.uk', 'term.kerberus.uk', '100.109.109.51', 'localhost'],
  },
})
