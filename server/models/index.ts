import { ObjectId } from 'mongodb';
import { Subtitle } from '@johnny.reina/convert-srt/dist/types';
import { ItemVisibility } from '../Constant/ItemVisibility';
import { Library } from './Library';

export type ServerConfiguration = {
  mediaLocation: string;
  thumbLocation: string;
};

export enum MediaType {
  Video = 'video',
  Audio = 'audio',
  Image = 'image',
  Book = 'book',
  Binary = 'binary'
}

export type MediaItem = {
  _id: string | ObjectId;
  filename: string;
  name: string;
  path?: string;
  type: MediaType;
  views: number;
  created: Date;
  updated: Date;
  tags: Array<string>;
  subs?: Array<Subtitle>;
  subtitles?: string;
  meta?: string;
  srt?: string;
  webvtt?: string;
  isHidden: boolean;
  userId: string | ObjectId;
  visibility: ItemVisibility;
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

export type { Library };
export type { MediaState } from './MediaState';
export type { RegisterLocalPayload } from './RegisterLocalPayload';
export type { RequestLog, RequestLogResponse } from './RequestLog';
export type { SearchResult } from './SearchResult';
