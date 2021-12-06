import { MediaItem } from '../../../server/models';

export interface MediaHandlerComponentProps {
  media: MediaItem;
  onFinished: (media: MediaItem) => void;
  url: string;
}
