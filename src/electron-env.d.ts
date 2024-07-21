declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

declare global {
  declare var theme: ThemeConfig;
  declare var settings: SettingsConfig;
  declare var configs: {
    theme: ThemeConfig;
    settings: SettingsConfig;
  };
  declare var bgColor: string;
}

export {};
