import { ObjectId } from 'bson';
import { ServerLogSeverity } from '.';

export interface MigrationLogEntry {
  createdAt: Date;
  level: ServerLogSeverity;
  message: string;
}

export interface MigrationLog {
  userId: string | ObjectId;
  mediaId: string | ObjectId;
  startTime: Date;
  endTime?: Date;
  entries: Array<MigrationLogEntry>;
}
