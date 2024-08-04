export {};

declare global {
  type Recordable = Record<string, any>;

  interface IMainEvent {
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    send(event: string, ...args: any[]): void;
    sendSync(event: string, ...args: any[]): Promise<any>;
  }
  declare const apeak: IMainEvent;

  declare const __plugin__: IPlugin;

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
    // 'app' | 'built' | 'plugin' | 'ai' | 'more'
    type: string;
    name: string;
    main: string;
    logo: string;
    separation: boolean;
    desc?: string;
    unique?: string;
    running?: boolean;
    version?: string;
    platform?: string;
    single?: boolean;
    features?: string;
    [key: string]: any;
  }

  interface IDeveloperPlugin {
    id: number;
    unique: string;
    name: string;
    main: string;
    logo:string;
    description: string;
    homepage: string;
    source: string;
    running: boolean;
    message:string;
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
