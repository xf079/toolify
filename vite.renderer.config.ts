import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { pluginExposeRenderer } from './vite.base.config';
import viteImagePlugin from './build/plugins/image';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root: root,
    mode,
    base: './',
    publicDir: 'public',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    plugins: [
      pluginExposeRenderer(name),
      svgr(),
      viteImagePlugin(),
      createHtmlPlugin({
        minify: true,
        template: 'index.html',
        entry: 'src/renderer/windows/main/main.tsx'
      })
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': path.join(__dirname, 'src/renderer'),
        '@config': path.join(__dirname, 'src/config'),
        '@main': path.join(__dirname, 'src/main')
      }
    },
    clearScreen: false
  } as UserConfig;
});
