import * as R from 'ramda';

/**
 * Create a className string from keys in an object.
 * @param classes
 */
export function c(classes: { [cls: string]: boolean }) {
  return Object.entries(classes).filter(R.nth(1)).map(R.nth(0)).join(' ');
}
