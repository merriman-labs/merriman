import { UserCreatePayload } from '../Managers/UserManager';
import { Library } from '../models';
import ValidationEngine from './ValidationEngine';

class Validator {
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
}

export default new Validator();
