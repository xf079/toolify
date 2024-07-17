import type {
  ThemeConfigType,
  SettingsConfigType
} from '@common/config/default-config';

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
    type: string;
    name: string;
    main: string;
    logo: string;
    desc?: string;
    version?: string;
    platform?: string;
    single?: boolean;
    features?: string;
    [key: string]: any;
  }
}
