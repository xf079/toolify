import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import path from 'node:path';
import svgr from 'vite-plugin-svgr';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    plugins: [svgr(), pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': path.join(__dirname, 'src/renderer')
      }
    },
    clearScreen: false
  } as UserConfig;
});
