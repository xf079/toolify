export {};

declare global {
  type Recordable = Record<string, any>;

  interface IEventApi {
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    send(event: string, ...args: any[]): void;
    sync(event: string, ...args: any[]): Promise<any>;
  }

  declare const eventApi: IEventApi;
  declare const __plugin__: IPlugin;
  declare const __winId__: number;

  interface IConfig {
    theme: string;
    colorPrimary: string;
    start: boolean;
    guide: boolean;
    language: string;
    placeholder: string;
  }

  interface IPlugin {
    id: number;
    // 'app' | 'built' | 'plugin-prod' | 'plugin-dev' | 'ai' | 'more'
    type: string;
    name: string;
    main: string;
    logo: string;
    description?: string;
    separation?: boolean;
    single?: boolean;
    autoUninstalled?: boolean;
    unique?: string;
    version?: string;
    platform?: string;
    features?: string;
    [key: string]: any;
  }

  interface IDeveloperPlugin {
    id: number;
    unique: string;
    name: string;
    main: string;
    logo: string;
    description: string;
    homepage: string;
    source: string;
    running: boolean;
    message: string;
  }

  interface IGroupType {
    type: string;
    label: string;
    orderBy: number;
    maxDisplayedNumber: number;
    showDisplayed: boolean;
    children: IPlugin[];
    origin: IPlugin[];
    morePlugin: IPlugin;
  }
}
