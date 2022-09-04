import { QueryParamDictionary } from '../types/Dictionary';
import { buildUri } from './buildUri';

export function get(uri: string, query?: QueryParamDictionary) {
  return fetch(buildUri(uri, query)).then((x) => x.json());
}
export function post<T, U>(
  uri: string,
  data: T,
  query?: QueryParamDictionary
): Promise<U> {
  return fetch(buildUri(uri, query), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((x) => {
    const resp = x.json();
    if (x.ok) {
      return resp;
    }
    return resp.then((e) => {
      throw e;
    });
  });
}
export function patch<T, U>(
  uri: string,
  data: T,
  query?: QueryParamDictionary
): Promise<U> {
  return fetch(buildUri(uri, query), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((x) => x.json());
}
export function put<T, U>(
  uri: string,
  data: T,
  query?: QueryParamDictionary
): Promise<U> {
  return fetch(buildUri(uri, query), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((x) => x.json());
}
