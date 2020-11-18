import { UserCreatePayload } from '../Managers/UserManager';
import { Library } from '../models';
import { RegisterLocalPayload } from '../models/RegisterLocalPayload';
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
  Library = {
    Create(item: any) {
      return ValidationEngine.validate<{ name: string; userId: string }>(
        item,
        'library.create'
      );
    },
    Update(item: any) {
      return ValidationEngine.validate<Library>(item, 'library.update');
    }
  };
  User = {
    Create(item: any) {
      return ValidationEngine.validate<UserCreatePayload>(item, 'user.create');
    }
  };
  Utility = {
    ObjectId(item: any) {
      return ValidationEngine.validate<string>(item, 'utility.ObjectId');
    }
  };
}

export default new Validator();
