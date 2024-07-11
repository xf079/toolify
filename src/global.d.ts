type Recordable = Record<string, any>;

interface IMainEvent {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  trigger(event: string, ...args: any[]): void;
  sync(event: string, ...args: any[]): Promise<any>;
}
