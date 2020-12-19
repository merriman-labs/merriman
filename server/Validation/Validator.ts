import { UserCreatePayload } from '../Managers/UserManager';
import { Library } from '../models';
import { RegisterLocalPayload } from '../models/RegisterLocalPayload';
import { SetMediaOrderPayload } from '../models/SetMediaOrderPayload';
import ValidationEngine from './ValidationEngine';

class Validator {
  Media = {
    RegisterLocal(item: any) {
      return ValidationEngine.validate<RegisterLocalPayload>(
        item,
        'media.registerLocal'
      );
    }
  };
  MediaState = {
    SetWatchTime(item: any) {
      return ValidationEngine.validate<{
        userId: string;
        mediaId: string;
        time: number;
      }>(item, 'mediaState.setWatchTime');
    }
  };
  Library = {
    Create(item: any) {
      return ValidationEngine.validate<{
        name: string;
        userId: string;
        username: string;
      }>(item, 'library.create');
    },
    Update(item: any) {
      return ValidationEngine.validate<Library>(item, 'library.update');
    },
    SetMediaOrder(item: any) {
      return ValidationEngine.validate<SetMediaOrderPayload>(
        item,
        'library.setMediaOrder'
      );
    }
  };
  User = {
    Create(item: any) {
      return ValidationEngine.validate<UserCreatePayload>(item, 'user.create');
    },
    SetIsActive(item: any) {
      return ValidationEngine.validate<{ _id: string; isActive: boolean }>(
        item,
        'user.setIsActive'
      );
    }
  };
  Utility = {
    ObjectId(item: any) {
      return ValidationEngine.validate<string>(item, 'utility.ObjectId');
    }
  };
}

export default new Validator();
