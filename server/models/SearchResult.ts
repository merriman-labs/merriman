import { MediaItem } from '.';

export interface SearchResult extends MediaItem {
  user: {
    _id: string;
    username: string;
  };
}
