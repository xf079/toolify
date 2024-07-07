import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { pluginExposeRenderer } from './vite.base.config';
import path from 'node:path';

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
        '@': path.join(__dirname, 'src/renderer'),
        '@common': path.join(__dirname, 'src/common'),
        '@shared': path.join(__dirname, 'src/shared'),
        '@main': path.join(__dirname, 'src/main'),
        '@preload': path.join(__dirname, 'src/preload'),
      }
    },
    clearScreen: false
  } as UserConfig;
});
