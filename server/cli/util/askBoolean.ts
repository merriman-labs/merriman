import { ask } from './ask';

export async function askBoolean(q: string) {
  const resp = await ask(q);
  return /y|yes/i.test(resp);
}
