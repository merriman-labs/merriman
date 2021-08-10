import { QueryParamDictionary } from '../types/Dictionary';

export function buildQueryString(options: QueryParamDictionary = {}) {
  const entries = Object.entries(options);
  // { skip: 100, limit: 50 } -> ?skip=100&limit=50
  if (entries.length === 0) return '';
  return (
    '?' +
    entries
      .map(([key, value]) => {
        value = value instanceof Date ? value.toISOString() : value.toString();
        return `${key}=${value}`;
      })
      .join('&')
  );
}
