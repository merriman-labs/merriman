import { ServerLogSeverity } from './ServerLogSeverity';

export type ServerLog = {
  severity: ServerLogSeverity;
  source?: string;
  createdAt: Date;
  message: string;
  additional?: any;
};
