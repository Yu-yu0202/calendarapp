import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { Agent } from 'https'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      '798b-240f-42-3571-1-54c1-93d2-e34e-3f9.ngrok-free.app',
      'localhost',
      '*.yu-yu0202.f5.si',
      '[240f:42:3571:1:54c1:93d2:e34e:3f9]'
    ],
    proxy: {
      '/api': {
        target: 'https://798b-240f-42-3571-1-54c1-93d2-e34e-3f9.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        agent: new Agent({
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
          maxVersion: 'TLSv1.3',
        }),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
    },
  },
}) 