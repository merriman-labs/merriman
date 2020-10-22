import ServerLogRA from '../ResourceAccess/ServerLogRA';
import { ServerLogSeverity } from '../models';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export class ServerLogManager {
  constructor(
    @inject(DependencyType.ResourceAccess.ServerLog) private _logRA: ServerLogRA
  ) {}

  get() {
    return this._logRA.get();
  }

  add(
    message: string,
    severity: ServerLogSeverity,
    source?: string,
    additional?: any
  ) {
    return this._logRA.add({
      createdAt: new Date(),
      message,
      severity,
      source,
      additional
    });
  }

  info(message: string, source?: string, additional?: any) {
    return this.add(message, ServerLogSeverity.info, source, additional);
  }

  warn(message: string, source?: string, additional?: any) {
    return this.add(message, ServerLogSeverity.warn, source, additional);
  }

  error(message: string, source?: string, additional?: any) {
    return this.add(message, ServerLogSeverity.err, source, additional);
  }
}
