import { API_URL } from '../../../config';

export function login(username: string, password: string) {
  return new Promise<{ error: null | string; token: string; id: number }>((resolve) => {
    // Attempt to login.
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    fetch(`${API_URL}/api-token-auth/`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error('Invalid credentials.');
        } else {
          throw new Error('Server not configured properly.');
        }
      })
      .then((data) => resolve({ error: null, token: data.token, id: data.id }))
      .catch((error) => {
        const message = error.message === 'Failed to fetch' ? 'Server unreachable.' : error.message;
        resolve({ error: message, token: '', id: 0 });
      });
  });
}
