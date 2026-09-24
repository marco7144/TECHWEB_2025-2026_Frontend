import { API_BASE_URL } from '../config';

/**
 * Funzione helper per parsare in modo sicuro la risposta JSON o restituire fallback pulito.
 */
async function parseResponseBody(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

/**
 * Helper per effettuare richieste GET autenticate al backend.
 * Aggiunge automaticamente gli headers e il token JWT se presente.
 */
export async function apiGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  const data = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    throw new Error(data.error || data.description || `Errore HTTP ${response.status}`);
  }

  return data as T;
}

/**
 * Helper per effettuare richieste POST autenticate al backend.
 * Aggiunge automaticamente gli headers, il body JSON e il token JWT se presente.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    throw new Error(data.error || data.description || `Errore HTTP ${response.status}`);
  }

  return data as T;
}
