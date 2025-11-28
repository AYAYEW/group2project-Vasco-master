import './style.css'
import { createNavbar, setupMobileMenu, setupAuthNav } from './navbar.js';
import { saveUser } from './auth.js';   // <-- IMPORTANT

const API_BASE = 'http://localhost:3000/api';

async function apiRequest(path, method, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

document.querySelector('#app').innerHTML = `
${createNavbar('login')}
<div class="page-content">
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-tabs">
        <button class="auth-tab active" id="login-tab">Login</button>
        <button class="auth-tab" id="register-tab">Register</button>
      </div>
      
      <!-- LOGIN -->
      <div class="auth-form" id="login-form">
        <h2>Welcome Back!</h2>
        <p>Sign in to access your FitDarling account</p>
        
        <form id="login-form-element">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" name="password" required>
          </div>
          
          <button type="submit" class="auth-btn">Sign In</button>
        </form>
      </div>
      
      <!-- REGISTER -->
      <div class="auth-form hidden" id="register-form">
        <h2>Join FitDarling</h2>
        <p>Create your account to start your fitness journey</p>
        
        <form id="register-form-element">
          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input type="text" id="register-name" name="name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" name="email" required>
          </div>
          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" name="password" required minlength="8">
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" name="confirmPassword" required>
          </div>

          <button type="submit" class="auth-btn">Create Account</button>
        </form>
      </div>
    </div>
    
    <div class="auth-benefits">
      <h3>Why Join FitDarling?</h3>
      <ul>
        <li>🎯 Personalized workout plans</li>
        <li>📊 Progress tracking and analytics</li>
        <li>👥 Access to expert trainers</li>
        <li>💪 Exercise library</li>
        <li>🍎 Nutrition guidance</li>
        <li>🏆 Achievement badges</li>
      </ul>
    </div>
  </div>
</div>
`;

setupMobileMenu();
setupAuthNav();

function setupAuthForms() {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Tabs
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  // --- REAL LOGIN ---
  document.getElementById('login-form-element').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);

    try {
      const result = await apiRequest('/auth/login', 'POST', {
        email: data.email,
        password: data.password
      });

      if (result.user) saveUser(result.user);

      alert("Login successful!");
      window.location.href = "/dashboard.html";  // redirect to dashboard
    } catch (err) {
      alert(err.message);
    }
  });

  // --- REAL REGISTER ---
  document.getElementById('register-form-element').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);

    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await apiRequest('/auth/register', 'POST', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      alert("Account created! Now login.");
      loginTab.click();
    } catch (err) {
      alert(err.message);
    }
  });
}

setupAuthForms();
