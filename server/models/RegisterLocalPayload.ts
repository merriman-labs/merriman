import { ObjectId } from 'mongodb';

export interface RegisterLocalPayload {
  userId: string;
  tags: Array<string>;
  filename: string;
  path: string;
  libraries: Array<{ _id: string | ObjectId }>;
}
