import { Configuration } from './Utilities/ConfigUtil';

export namespace AppContext {
  const context = new Map();

  export enum WellKnown {
    Config = '__appconfig'
  }

  export function set(key: WellKnown.Config, value: Configuration);
  export function set(key: string, value: any) {
    context.set(key, value);
  }

  export function get(key: WellKnown.Config): Configuration | undefined;
  export function get<T>(key: string | symbol): T | undefined {
    if (!context.has(key)) return;
    return context.get(key) as T;
  }
}
