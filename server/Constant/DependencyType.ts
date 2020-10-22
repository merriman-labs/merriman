export const DependencyType = {
  Managers: {
    Media: Symbol('MediaManager'),
    Library: Symbol('LibraryManager')
  },
  ResourceAccess: {
    Media: Symbol('MediaResourceAccess'),
    Library: Symbol('LibraryResourceAccess')
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
