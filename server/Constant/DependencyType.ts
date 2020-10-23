export const DependencyType = {
  Managers: {
    FileSystem: Symbol('FileSystemManager'),
    Media: Symbol('MediaManager'),
    Library: Symbol('LibraryManager'),
    ServerLog: Symbol('ServerLogManager')
  },
  ResourceAccess: {
    FileSystem: Symbol('FileSystemResourceAccess'),
    Media: Symbol('MediaResourceAccess'),
    Library: Symbol('LibraryResourceAccess'),
    ServerLog: Symbol('ServerLogResourceAccess')
  },
  Engines: {
    Media: Symbol('MediaEngine'),
    Library: Symbol('LibraryEngine')
  },
  Controller: {
    Server: Symbol('ServerController'),
    Admin: Symbol('AdminController'),
    Media: Symbol('MediaController'),
    Library: Symbol('LibraryController')
  },
  External: {
    MongoDB: Symbol('MongoDB')
  }
};
