import { ObjectId } from 'mongodb';

export type ServerConfiguration = {
  mediaLocation: string;
  thumbLocation: string;
};

export type MediaType = 'video' | 'audio' | 'image' | 'binary';

export type MediaItem = {
  _id: string | ObjectId;
  filename: string;
  name: string;
  path?: string;
  type: MediaType;
  views: number;
  created: string;
  updated: string;
};

export type Library = {
  _id: string | ObjectId;
  items: Array<string | ObjectId>;
  name: string;
};

export type LibraryDatabase = {
  libraries: Array<Library>;
};

export enum ServerLogSeverity {
  info,
  warn,
  err
}

export interface ServerLog {
  severity: ServerLogSeverity;
  source?: string;
  createdAt: Date;
  message: string;
  additional?: any;
}
