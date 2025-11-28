import "./style.css";
import { createNavbar, setupMobileMenu, setupAuthNav } from "./navbar.js";
import { requireAuth } from "./auth.js";
import { apiGet } from "./services.js";

// PAGE SETUP — the DASHBOARD layout without the 3 removed parts
document.querySelector("#app").innerHTML = `
${createNavbar("progress")}
<div class="page-content">

  <div class="dashboard-header">
    <h1>Your Progress</h1>
    <p>Track your latest fitness metrics</p>
  </div>

  <div class="dashboard-grid">

    <!-- Quick Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card" id="bmi-card">
        <h3>BMI</h3>
        <div class="stat-value" id="bmi-display">--</div>
        <div class="stat-label">Body Mass Index</div>
      </div>

      <div class="stat-card" id="weight-card">
        <h3>Weight</h3>
        <div class="stat-value" id="weight-display">-- kg</div>
        <div class="stat-label">Current Weight</div>
      </div>

      <div class="stat-card" id="steps-card">
        <h3>Steps Today</h3>
        <div class="stat-value" id="steps-display">0</div>
        <div class="stat-label">Daily Steps</div>
      </div>

      <div class="stat-card" id="water-card">
        <h3>Water Intake</h3>
        <div class="stat-value" id="water-display">0L</div>
        <div class="stat-label">Today's Hydration</div>
      </div>

      <div class="stat-card" id="sleep-card">
        <h3>Sleep</h3>
        <div class="stat-value" id="sleep-display">0h</div>
        <div class="stat-label">Last Night</div>
      </div>
    </div>

    <!-- Update Profile (KEEP) -->
    <div class="data-entry-section">
      <div class="entry-card">
        <h2>Update Your Profile</h2>
        <p id="user-info">Loading user...</p>
      </div>
    </div>

    <!-- Daily Health Log (KEEP) -->
    <div class="daily-tracking-section">
      <div class="entry-card">
        <h2>Latest Health Data</h2>
        <p id="health-status">Loading...</p>
        <div id="health-details"></div>
      </div>
    </div>

    <!-- Weight & BMI History (KEEP) -->
    <div class="weight-history-section">
      <div class="entry-card">
        <h2>Your Goals</h2>
        <p id="goals-status">Loading...</p>
        <div id="goals-details"></div>
      </div>
    </div>

    <!-- DO NOT ADD Workout Section -->
    <!-- DO NOT ADD Recent Activity -->
    <!-- DO NOT ADD Progress Overview -->

  </div>
</div>
`;

setupMobileMenu();
setupAuthNav();

const user = requireAuth();
if (!user) throw new Error("Not logged in");

// HELPER
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

async function loadAllData() {
  // USER
  document.getElementById("user-info").textContent =
    `Logged in as: ${user.email}`;

  // HEALTH DATA
  setText("health-status", "Loading...");
  try {
    const health = await apiGet(`/health/user/${user.id}`);
    const traits = health.traits?.[0];
    const sleep = health.sleep?.[0];

    document.getElementById("health-details").innerHTML = traits
      ? `
        <strong>Weight:</strong> ${traits.weight} kg<br>
        <strong>BMI:</strong> ${traits.bmi}<br>
        <strong>Water:</strong> ${traits.water} L<br>
        <strong>Steps:</strong> ${traits.daily_steps}<br>
        <strong>Sleep:</strong> ${sleep ? sleep.duration : "—"} h<br>
      `
      : `<p>No health data yet.</p>`;

    // Update stat cards too
    document.getElementById("bmi-display").textContent = traits?.bmi ?? "--";
    document.getElementById("weight-display").textContent = traits?.weight ? traits.weight + " kg" : "-- kg";
    document.getElementById("water-display").textContent = traits?.water ? traits.water + "L" : "0L";
    document.getElementById("steps-display").textContent = traits?.daily_steps ?? 0;
    document.getElementById("sleep-display").textContent = sleep?.duration ? sleep.duration + "h" : "0h";

    setText("health-status", "Loaded ✔");
  } catch (err) {
    setText("health-status", "Failed to load ❌");
  }

  // GOALS
  setText("goals-status", "Loading...");
  try {
    const goals = await apiGet(`/goals/user/${user.id}`);

    document.getElementById("goals-details").innerHTML = `
      <strong>Message:</strong> ${goals.steps?.steps_goal_message ?? "No message"}<br><br>

  <strong>Steps Goal:</strong> ${goals.steps?.steps_goal ?? "—"}<br>

  <strong>Weight Goal:</strong> ${goals.weight?.weight_goal ?? "—"} kg<br>

  <strong>Water Goal:</strong> ${goals.water?.water_goal ?? "—"} L/day<br>

  <strong>Sleep Goal:</strong> ${goals.sleep?.duration_goal ?? "—"} h/day<br>

  <strong>BMI Goal:</strong> ${goals.bmi?.bmi_goal ?? "—"}<br>
`;


    setText("goals-status", "Loaded ✔");
  } catch (err) {
    setText("goals-status", "Failed to load ❌");
  }
}

loadAllData();
