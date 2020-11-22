import { ObjectId } from 'mongodb';
import { ItemVisibility } from '../Constant/ItemVisibility';

export type Library = {
  _id: string | ObjectId;
  userId: string | ObjectId;
  items: Array<{ id: string | ObjectId; order: number }>;
  name: string;
  visibility: ItemVisibility;
  createdAt: Date;
  updatedAt: Date;
};
