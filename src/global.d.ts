type Recordable = Record<string, any>;

interface IMainEvent {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  trigger(event: string, ...args: any[]): void;
  sync(event: string, ...args: any[]): Promise<any>;
}

declare const apeak: IMainEvent;

type ITheme = 'system' | 'light' | 'dark';

interface IApplication {
  type: string;
  name: string;
  icon: string;
  target: string;
}

interface IPlugin {
  type: string;
  name: string;
  desc: string;
  version: string;
  logo: string;
  platform: string;
  single: boolean;
  features: string;
}
