class UserRA {
  create(creds: { username: string; password: string }) {
    return fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
    }).then(x => x.json());
  }
}

export default new UserRA();
