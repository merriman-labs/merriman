import { ObjectId } from 'mongodb';

export interface MediaState {
  mediaId: ObjectId;
  userId: ObjectId;
  time: number;
  isFinished: boolean;
}
