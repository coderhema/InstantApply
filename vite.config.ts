import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/parse': {
          target: 'https://api.parse.bot',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/parse/, '/scraper'),
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: 'manifest.json',
            dest: '.'
          },
          {
            src: 'manifest.firefox.json',
            dest: '.'
          }
        ]
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_PARSE_BOT_API_KEY': JSON.stringify(env.VITE_PARSE_BOT_API_KEY),
      'process.env.VITE_PARSE_BOT_AUTH_TOKEN': JSON.stringify(env.VITE_PARSE_BOT_AUTH_TOKEN),
      'process.env.VITE_GROQ_API_KEY': JSON.stringify(env.VITE_GROQ_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          background: path.resolve(__dirname, 'background.ts'),
          contentScript: path.resolve(__dirname, 'contentScript.ts')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});

