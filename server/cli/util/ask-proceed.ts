import { ask } from './ask';
import { eject } from './eject';
import 'colors';

/**
 * Ask whether or not to proceed. Process exits with code 0 if not.
 */
export const askProceed = async (): Promise<void> => {
  const proceed = await ask(`Proceed? ${'[yes/no]'.green}\n`);

  if (proceed.includes('no') || !proceed.includes('yes')) {
    eject();
  }
};
