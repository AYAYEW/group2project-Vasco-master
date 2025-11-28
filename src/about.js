import './style.css';
import { createNavbar, setupMobileMenu, setupAuthNav } from './navbar.js';

// Combine the necessary from both files:
// - Keep the "About" page content
// - Keep the new dark design
// - Keep the working login/logout (setupAuthNav)
// - Keep the navbar & mobile menu
// - Remove ALL dashboard logic

document.querySelector('#app').innerHTML = `
${createNavbar('about')}
<div class="page-content">
  <h1>About FitDarling</h1>
  <div class="card">
    <p>Welcome to FitDarling - your premier fitness destination!</p>
    <p>We're dedicated to helping you achieve your fitness goals 
       through personalized training, nutrition guidance, and 
       a supportive community.</p>
    
    <div class="about-sections">

      <div class="about-section">
        <h2>Our Mission</h2>
        <p>
          To empower individuals on their fitness journey with expert guidance,
          innovative programs, and unwavering support.
        </p>
      </div>

      <div class="about-section">
        <h2>Our Team</h2>
        <p>
          Our certified trainers and nutritionists bring years of experience 
          and passion to help you succeed.
        </p>
      </div>

      <div class="about-section">
        <h2>Why Choose Us</h2>
        <ul>
          <li>Personalized fitness programs</li>
          <li>Expert nutrition guidance</li>
          <li>State-of-the-art equipment</li>
          <li>Supportive community environment</li>
          <li>Flexible scheduling options</li>
        </ul>
      </div>

    </div>
  </div>
</div>
`;

setupMobileMenu();
setupAuthNav();
