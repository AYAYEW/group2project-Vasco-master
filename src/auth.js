const USER_KEY = 'fitdarling_user';

// Make sure we always get { id, email, displayName }
function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id =
    raw.id ??
    raw.user_id ??
    raw.userId ??
    null;

  const email =
    raw.email ??
    raw.user_email ??
    null;

  const displayName =
    raw.displayName ??
    raw.display_name ??
    raw.name ??
    null;

  if (!id) return null;

  return { id, email, displayName };
}

export function saveUser(user) {
  // If backend sends user_id/display_name, normalize before storing
  const normalized = normalizeUser(user) || user;
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return normalizeUser(parsed);
  } catch {
    return null;
  }
}

export function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user; // always { id, email, displayName }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
