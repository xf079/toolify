import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';
  console.log(name, path.join(__dirname, 'template', 'detach.html'));
  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    plugins: [
      svgr(),
      pluginExposeRenderer(name),
      createHtmlPlugin({
        minify: true,
        template: 'index.html',
        entry: 'src/renderer/windows/plugins/main.tsx'
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
