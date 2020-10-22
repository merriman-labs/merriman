import { Library } from '../models';
import ValidationEngine from './ValidationEngine';

class Validator {
  Library = {
    Create(item: any) {
      return ValidationEngine.validate<{ name: string }>(
        item,
        'library.create'
      );
    },
    Update(item: any) {
      return ValidationEngine.validate<Library>(item, 'library.update');
    }
  };
}

export default new Validator();
