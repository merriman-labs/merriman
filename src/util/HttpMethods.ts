export function get(uri: string) {
  return fetch(uri).then((x) => x.json());
}
export function post<T, U>(uri: string, data: T): Promise<U> {
  return fetch(uri, {
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
export function patch<T, U>(uri: string, data: T): Promise<U> {
  return fetch(uri, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((x) => x.json());
}
export function put<T, U>(uri: string, data: T): Promise<U> {
  return fetch(uri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((x) => x.json());
}
