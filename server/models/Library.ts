import { ObjectId } from 'mongodb';
import { ItemVisibility } from '../Constant/ItemVisibility';

export type Library = {
  _id: string | ObjectId;
  user: {
    username: string;
    userId: ObjectId;
  };
  items: Array<ObjectId>;
  name: string;
  visibility: ItemVisibility;
  createdAt: Date;
  updatedAt: Date;
  isSeason: boolean;
};
