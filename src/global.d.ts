import type {
  ThemeConfigType,
  SettingsConfigType
} from '@main/configs/default-config';

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

  type ThemeConfig = ThemeConfigType;

  type SettingsConfig = SettingsConfigType;

  interface GlobalConfigs {
    theme: ThemeConfig;
    settings: SettingsConfig;
  }

  interface IPlugin {
    id: number;
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
    unique: string;
    name: string;
    desc: string;
    homepage: string;
    source: string;
    running: boolean;
  }

  interface IGroupType {
    type: string;
    label: string;
    orderBy: number;
    maxNum:number;
    showAll: boolean;
    children: IPlugin[];
    originChildren: IPlugin[];
  }
}
