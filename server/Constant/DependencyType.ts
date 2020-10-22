export const DependencyType = {
  Managers: {
    Media: Symbol('MediaManager'),
    Library: Symbol('LibraryManager'),
    ServerLog: Symbol('ServerLogManager')
  },
  ResourceAccess: {
    Media: Symbol('MediaResourceAccess'),
    Library: Symbol('LibraryResourceAccess'),
    ServerLog: Symbol('ServerLogResourceAccess')
  },
  Engines: {
    Media: Symbol('MediaEngine'),
    Library: Symbol('LibraryEngine')
  },
  Controller: {
    Media: Symbol('MediaController'),
    Library: Symbol('LibraryController')
  },
  External: {
    MongoDB: Symbol('MongoDB')
  }
};
