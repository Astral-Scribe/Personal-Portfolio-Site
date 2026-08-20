// Path to the JSON file the GitHub Action commits. Adjust if your data
// file lives somewhere else relative to this page.
const HD_DATA_URL = "./data/hackatime.json";

const HD_TABS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "all_time", label: "All time" },
];

let hdData = null;
let hdActiveTab = "today";

function formatTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  const units = [
    ["year", 31536000], ["month", 2592000], ["day", 86400],
    ["hour", 3600], ["minute", 60]
  ];
  for (const [name, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${name}${val !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function renderTabs() {
  const tabsEl = document.getElementById("hd-tabs");
  tabsEl.innerHTML = "";
  HD_TABS.forEach(({ key, label }) => {
    const btn = document.createElement("button");
    btn.className = "hd-tab" + (key === hdActiveTab ? " active" : "");
    btn.textContent = label;
    btn.onclick = () => {
      hdActiveTab = key;
      renderTabs();
      renderCard();
    };
    tabsEl.appendChild(btn);
  });
}

function renderCard() {
  const card = document.getElementById("hd-card");
  const entry = hdData[hdActiveTab];

  if (!entry) {
    card.innerHTML = `<div class="hd-error">No data for this range.</div>`;
    return;
  }

  const label = HD_TABS.find((t) => t.key === hdActiveTab).label;

  let html = `
    <div class="hd-total">${entry.human}</div>
    <div class="hd-total-label">coded ${label.toLowerCase()}</div>
  `;

  if (entry.top_projects && entry.top_projects.length > 0) {
    html += `<div class="hd-projects-heading">Top Projects</div>`;
    entry.top_projects.forEach((p) => {
      html += `
        <div class="hd-project">
          <span>${p.name}</span>
          <span class="hd-project-time">${p.human}</span>
        </div>
      `;
    });
  } else {
    html += ``;
  }

  card.innerHTML = html;
}

async function loadDashboard() {
  const updatedEl = document.getElementById("hd-updated");
  try {
    const res = await fetch(HD_DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    hdData = await res.json();

    updatedEl.textContent = `updated ${formatTimeAgo(new Date(hdData.last_updated))}`;
    renderTabs();
    renderCard();
  } catch (err) {
    console.error(err);
    updatedEl.textContent = "";
    document.getElementById("hd-card").innerHTML =
      `<div class="hd-error">Couldn't load stats data.</div>`;
  }
}

loadDashboard();