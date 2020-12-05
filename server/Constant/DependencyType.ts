export const DependencyType = {
  Managers: {
    Auth: Symbol('AuthManager'),
    FileSystem: Symbol('FileSystemManager'),
    Media: Symbol('MediaManager'),
    Library: Symbol('LibraryManager'),
    MediaState: Symbol('MediaStateManager'),
    ServerLog: Symbol('ServerLogManager'),
    User: Symbol('UserManager')
  },
  ResourceAccess: {
    Auth: Symbol('AuthMenager'),
    FileSystem: Symbol('FileSystemResourceAccess'),
    Media: Symbol('MediaResourceAccess'),
    Library: Symbol('LibraryResourceAccess'),
    MediaState: Symbol('MediaStateResourceAccess'),
    ServerLog: Symbol('ServerLogResourceAccess'),
    User: Symbol('UserManager')
  },
  Engines: {
    Auth: Symbol('AuthEngine'),
    Media: Symbol('MediaEngine'),
    Library: Symbol('LibraryEngine')
  },
  Controller: {
    Auth: Symbol('AuthController'),
    Server: Symbol('ServerController'),
    Admin: Symbol('AdminController'),
    Media: Symbol('MediaController'),
    Library: Symbol('LibraryController'),
    MediaState: Symbol('MediaStateController'),
    Stream: Symbol('StreamController'),
    User: Symbol('UserController')
  },
  External: {
    MongoDB: Symbol('MongoDB')
  }
};
