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

// PAGE LAYOUT — REAL, CLEAN, NICE
document.querySelector("#app").innerHTML = `
${createNavbar("goals")}
<div class="page-content">
  <h1>Weekly Goals</h1>

  <div class="card goals-card">

    <!-- TITLE & MESSAGE -->
    <div class="section">
      <h2>Weekly Message</h2>
      <p class="subtext">Set a motivation message for the week</p>

      <div class="form-group">
        <label for="goal-title">Goal Title</label>
        <input type="text" id="goal-title" name="title" placeholder="e.g., Burn Week" />
      </div>

      <div class="form-group">
        <label for="goal-message">Message</label>
        <textarea id="goal-message" name="message" rows="3"
          placeholder="Write your motivational message..."></textarea>
      </div>
    </div>

    <hr class="section-divider">

    <!-- GOALS IN NICE CLEAN GRID -->
    <div class="section">
      <h2>Numeric Goals</h2>
      <p class="subtext">Set your measurable goals for the week</p>

      <div class="goals-grid">
<div class="goals-grid">

  <div class="goal-box">
    <h3>Steps Goal</h3>
    <input type="number" name="stepsGoal" placeholder="e.g., 12000" />
    <small>steps this week</small>
  </div>

  <div class="goal-box">
    <h3>Weight Goal</h3>
    <input type="number" name="weightGoal" step="0.1" placeholder="e.g., 75.5" />
    <small>kg</small>
  </div>

  <div class="goal-box">
    <h3>Water Goal</h3>
    <input type="number" name="waterGoal" step="0.1" placeholder="e.g., 3" />
    <small>litres/day</small>
  </div>

  <div class="goal-box">
    <h3>Sleep Goal</h3>
    <input type="number" name="sleepGoalHours" step="0.1" placeholder="e.g., 8" />
    <small>hours/day</small>
  </div>

  <div class="goal-box">
    <h3>BMI Goal</h3>
    <input type="number" name="bmiGoal" step="0.1" placeholder="e.g., 23" />
    <small>Healthy 18.5–24.9</small>
  </div>

</div>

    </div>

    <button id="save-goals-btn" class="auth-btn goals-save-btn">Save Weekly Goals</button>
  </div>
</div>
`;

setupMobileMenu();
setupAuthNav();

const user = requireAuth();
const USER_ID = user.id;

document.getElementById("save-goals-btn").addEventListener("click", async () => {
  const title = document.getElementById("goal-title").value;
  const message = document.getElementById("goal-message").value;

  const stepsGoal = document.querySelector("[name='stepsGoal']").value;
  const weightGoal = document.querySelector("[name='weightGoal']").value;
  const waterGoal = document.querySelector("[name='waterGoal']").value;
  const sleepGoal = document.querySelector("[name='sleepGoalHours']").value;
  const bmiGoal = document.querySelector("[name='bmiGoal']").value;

  try {
    await apiRequest("/goals/weekly", "POST", {
      userId: USER_ID,
      title,
      message,
      stepsGoal: stepsGoal ? Number(stepsGoal) : null,
      weightGoal: weightGoal ? Number(weightGoal) : null,
      waterGoal: waterGoal ? Number(waterGoal) : null,
      sleepGoal: sleepGoal ? Number(sleepGoal) : null,
      bmiGoal: bmiGoal ? Number(bmiGoal) : null,
    });

    showPopup("Goals saved successfully!");
  } catch (err) {
    showPopup("Error: " + err.message);
  }
});

// POPUP FUNCTION
function showPopup(msg) {
  const popup = document.createElement("div");
  popup.className = "popup-success";
  popup.textContent = msg;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}
