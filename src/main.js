import './style.css';
import { setupCounter } from './counter.js';
import { createNavbar, setupMobileMenu, setupAuthNav } from './navbar.js';

document.querySelector('#app').innerHTML = `
  ${createNavbar('home')}
  <div class="text">
    <h1>Lets get Fit, Darling</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="bottomText">
      Bottom text text
    </p>
  </div>
`;

setupCounter(document.querySelector('#counter'));
setupMobileMenu();
setupAuthNav();  
