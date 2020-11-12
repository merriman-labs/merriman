export interface DirectoryItem {
  name: string;
  isDirectory: boolean;
  fullPath: string;
  isAccessible?: boolean;
  directoryPath: string;
}

export interface ListDirectoryResult {
  path: string;
  files: Array<DirectoryItem>;
}
