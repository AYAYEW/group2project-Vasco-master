const API_BASE = 'http://localhost:3000/api';

export function createNavbar(activePage = '') {
  return `
<nav class="navbar">
  <img src="src/fitdarling.png" class="logo" alt="Logo">

  <ul class="nav-menu" id="nav-menu">

    <li class="nav-item">
      <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
    </li>

    <li class="nav-item">
      <a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About</a>
    </li>

    <li class="nav-item">
      <a href="activity.html" class="${activePage === 'activity' ? 'active' : ''}">Activity</a>
    </li>

    <li class="nav-item">
      <a href="goals.html" class="${activePage === 'goals' ? 'active' : ''}">Goals</a>
    </li>

    <!-- NEW Progress Link (REPLACES SERVICES) -->
    <li class="nav-item">
      <a href="progress.html" class="${activePage === 'progress' ? 'active' : ''}">
        Progress
      </a>
    </li>

    <!-- Login / Logout -->
    <li class="nav-item nav-auth-item">
      <a href="login.html" id="nav-auth-link"
         class="${activePage === 'login' ? 'active' : ''}">
         Login
      </a>
    </li>
  </ul>
  
  <div class="nav-right">
    <button class="mobile-toggle" id="mobile-toggle">☰</button>
  </div>
</nav>`;
}

// Mobile menu functionality
export function setupMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      mobileToggle.textContent = 
        navMenu.classList.contains('mobile-open') ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.textContent = '☰';
      }
    });
  }
}

// Login → Logout logic
export async function setupAuthNav() {
  const authLink = document.getElementById('nav-auth-link');
  if (!authLink) return;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });
    const data = await res.json();

    if (data && data.user) {
      authLink.textContent = 'Logout';
      authLink.href = '#';

      authLink.addEventListener(
        'click',
        async (e) => {
          e.preventDefault();

          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });

          localStorage.removeItem('fitdarling_user');
          window.location.href = '/login.html';
        },
        { once: true }
      );
    }
  } catch (err) {
    console.error('Failed to check auth:', err);
  }
}
