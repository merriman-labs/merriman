import { LibrarySchema } from './Library';
import { MediaSchema } from './Media';
import { MediaStateSchema } from './MediaState';
import { UserSchema } from './User';
import { UtilitySchema } from './Utility';

export const Schema = {
  library: LibrarySchema,
  media: MediaSchema,
  mediaState: MediaStateSchema,
  user: UserSchema,
  utility: UtilitySchema
};
