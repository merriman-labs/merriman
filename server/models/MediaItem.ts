import { Subtitle } from '@johnny.reina/convert-srt/dist/types';
import { ObjectId } from 'mongodb';
import { ItemVisibility } from '../Constant/ItemVisibility';
import { MediaFormat } from './MediaInfo';
import { MediaType } from './MediaType';

export type MediaItem = {
  _id: string | ObjectId;
  user: {
    username: string;
    userId: string | ObjectId;
  };
  filename: string;
  name: string;
  path: string;
  type: MediaType;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Array<string>;
  subs?: Array<Subtitle>;
  subtitles?: string;
  meta?: string;
  srt?: string;
  webvtt?: string;
  isHidden: boolean;
  visibility: ItemVisibility;
  formatData?: MediaFormat;
};
