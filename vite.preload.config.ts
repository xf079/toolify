import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import { getBuildConfig, external, pluginHotRestart } from './vite.base.config';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;

  const config: UserConfig = {
    build: {
      rollupOptions: {
        external,
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: forgeConfigSelf.entry!,
        output: {
          format: 'cjs',
          // It should not be split chunks.
          inlineDynamicImports: false,
          entryFileNames: 'preload/[name].js',
          chunkFileNames: 'preload/[name].js',
          assetFileNames: 'preload/[name].[ext]'
        }
      }
    },
    plugins: [pluginHotRestart('reload')],
    resolve: {
      alias: {
        '@core': path.join(__dirname, 'src/core'),
        'common': path.join(__dirname, 'src/common')
      }
    }
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
