type ServerConfiguration = {
  mediaLocation: string;
  thumbLocation: string;
};

type MediaItem = {
  _id: string;
  favorite: boolean;
  filename: string;
  name: string;
};

type Library = {
  _id: string;
  items: Array<MediaItem>;
  name: string;
};

type LibraryDatabase = {
  libraries: Array<Library>;
};
