import { RequestHandler, Router } from 'express';
import { HandleError } from '../Middleware/HandleError';

/**
 * Creates a new router instance and by default overwrites
 * the `get`, `post`, `delete`, `put`, and `patch` methods
 * to wrap each handler in async error handlers.
 * Pass in an array of method names to overwrite a different set of methods.
 */
export function AsyncRouter(
  methods = ['get', 'post', 'delete', 'put', 'patch']
): Router {
  const r = Router();
  for (let key in r) {
    if (methods.includes(key)) {
      const meth = r[key];
      r[key] = (path: string, ...handlers: Array<RequestHandler>) =>
        meth.call(r, path, ...handlers.map((handler) => HandleError(handler)));
    }
  }
  return r;
}
