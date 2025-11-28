import "./style.css";
import { createNavbar, setupMobileMenu, setupAuthNav } from "./navbar.js";
import { requireAuth } from "./auth.js";

const API_BASE = "http://localhost:3000/api";

async function apiRequest(path, method, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// PAGE — NEW CLEAN DASHBOARD DESIGN WITH BOXES
document.querySelector("#app").innerHTML = `
${createNavbar("activity")}
<div class="page-content">
  <h1>Daily Activity</h1>

  <div class="card activity-card">

    <form id="activity-form">

      <div class="activity-grid">

        <div class="activity-box">
          <h3>Weight</h3>
          <input type="number" id="weight" name="weight" step="0.1" placeholder="e.g., 75.5" required />
          <small>kg</small>
        </div>

        <div class="activity-box">
          <h3>Height</h3>
          <input type="number" id="heightCm" name="heightCm" step="0.1" placeholder="e.g., 180" required />
          <small>cm</small>
        </div>

        <div class="activity-box">
          <h3>Water Intake</h3>
          <input type="number" id="water" name="water" step="0.1" placeholder="e.g., 2.5" required />
          <small>litres</small>
        </div>

        <div class="activity-box">
          <h3>Steps</h3>
          <input type="number" id="steps" name="steps" placeholder="e.g., 8500" required />
          <small>steps today</small>
        </div>

        <div class="activity-box">
          <h3>Sleep</h3>
          <input type="number" id="sleepHours" name="sleepHours" step="0.1" placeholder="e.g., 7.5" required />
          <small>hours last night</small>
        </div>

      </div>

      <button type="submit" class="auth-btn save-activity-btn">Save Daily Activity</button>

      <div id="bmi-result" class="bmi-box hidden"></div>

    </form>

  </div>
</div>
`;

setupMobileMenu();
setupAuthNav();

const user = requireAuth();
const USER_ID = user.id;

// POPUP FEEDBACK
function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup-success";
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

const formEl = document.getElementById("activity-form");

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(formEl));

  try {
    const result = await apiRequest("/health/activity", "POST", {
      userId: USER_ID,
      weight: Number(data.weight),
      heightCm: Number(data.heightCm),
      water: Number(data.water),
      steps: Number(data.steps),
      sleepHours: Number(data.sleepHours),
    });

    const bmiBox = document.getElementById("bmi-result");
    bmiBox.classList.remove("hidden");
    bmiBox.textContent = result.bmi
      ? `Your BMI today: ${result.bmi}`
      : "BMI could not be calculated.";

    showPopup("Activity saved!");
    formEl.reset();
  } catch (err) {
    showPopup("Error: " + err.message);
  }
});
