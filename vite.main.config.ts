import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import copyPlugin from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import {
  getBuildConfig,
  getBuildDefine,
  external,
  pluginHotRestart
} from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const config: UserConfig = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry!,
        fileName: () => 'main/[name].js',
        formats: ['cjs']
      },
      rollupOptions: {
        external,
        plugins: [
          commonjs(),
          copyPlugin({
            targets: [
              {
                src: './plugins',
                dest: '.vite/build'
              }
            ]
          })
        ]
      }
    },
    plugins: [pluginHotRestart('restart')],
    define,
    resolve: {
      mainFields: ['module', 'jsnext:main', 'jsnext']
    }
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
