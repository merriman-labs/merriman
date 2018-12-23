export type ServerConfiguration = {
  mediaLocation: string;
  thumbLocation: string;
};

export type MediaItem = {
  _id: string;
  favorite: boolean;
  filename: string;
  name: string;
};

export type Library = {
  _id: string;
  items: Array<string>;
  name: string;
};

export type LibraryDatabase = {
  libraries: Array<Library>;
};
