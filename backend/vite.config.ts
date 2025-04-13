// @ts-ignore
import { defineConfig } from 'vite';
// @ts-ignore
import path from 'path';
// @ts-ignore
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      '*.ngrok-free.app',
      'localhost',
      '*.yu-yu0202.f5.si'
    ]
  },
  build: {
    // Node.js向けにバンドル
    target: 'node16',
    // SSR用のライブラリモードで出力
    lib: {
      entry: path.resolve(__dirname, 'src/server.ts'),
      formats: ['cjs'],
      fileName: () => 'server.js'
    },
    // ランタイムソースマップを生成
    sourcemap: true,
    // node_modulesを外部モジュールとして扱う
    rollupOptions: {
      external: [
        // Node.jsの組み込みモジュールと依存パッケージを外部化
        /^node:(.+)$/,
        'express',
        'mysql2',
        'bcryptjs',
        'jsonwebtoken',
        'dotenv',
        // その他の依存関係も必要に応じて追加
      ],
      output: {
        format: 'cjs'
      }
    },
  },
  optimizeDeps: {
    // 開発サーバー起動時の最適化からNode.jsモジュールを除外
    exclude: ['fsevents']
  }
}); 