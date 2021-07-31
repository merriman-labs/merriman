import { QueryParamDictionary } from '../types/Dictionary';
import { buildQueryString } from './buildQueryString';

export function buildUri(uri: string, query?: QueryParamDictionary) {
  return `${uri}${buildQueryString(query)}`;
}
