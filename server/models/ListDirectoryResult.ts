export interface DirectoryItem {
  name: string;
  isDirectory: boolean;
  fullPath: string;
  isAccessible?: boolean;
}

export interface ListDirectoryResult {
  path: string;
  files: Array<DirectoryItem>;
}
