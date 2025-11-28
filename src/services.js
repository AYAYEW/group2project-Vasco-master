const API_BASE = 'http://localhost:3000/api';

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} – ${text}`);
  }

  return res.json();
}
