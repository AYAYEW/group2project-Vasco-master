import './style.css'
import { createNavbar, setupMobileMenu, setupAuthNav } from './navbar.js';

const API_BASE = 'http://localhost:3000/api';

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include'
  });
  return res.json();
}

document.querySelector('#app').innerHTML = `
  ${createNavbar('dashboard')}
  <div class="page-content">
    <h1 id="username">Loading...</h1>
    <p>Welcome to your dashboard, darling 💚</p>
  </div>
`;

setupMobileMenu();
setupAuthNav();

(async () => {
  const me = await apiGet('/auth/me');

  if (!me.user) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('username').textContent =
    "Hello, " + me.user.email;
})();
