export function parseQueryString<T extends string>(
  query: string
): Record<T, string> {
  const pairs = query
    .replace('?', '')
    .split('&')
    .map((pair) => pair.split('='));
  const params = Object.fromEntries(pairs);
  return params;
}
