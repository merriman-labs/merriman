import ServerConfigRepo from './data/ServerConfigRepo';

export namespace AppContext {
  const context = new Map();

  export enum WellKnown {
    Config = '__appconfig'
  }

  export function set(key: WellKnown.Config, value: ServerConfigRepo);
  export function set(key: string, value: any) {
    context.set(key, value);
  }

  export function get(key: WellKnown.Config): ServerConfigRepo | undefined;
  export function get<T>(key: string | symbol): T | undefined {
    if (!context.has(key)) return;
    return context.get(key) as T;
  }
}
