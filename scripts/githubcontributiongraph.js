// Path to the JSON file the GitHub Action commits.
const CG_DATA_URL = "data/github-contributions.json";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

function levelFor(count, max) {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function buildGrid(days) {
  const grid = document.getElementById("cg-grid");
  const monthsRow = document.getElementById("cg-months");
  grid.innerHTML = "";
  monthsRow.innerHTML = "";

  const max = Math.max(...days.map((d) => d.count), 0);
  let weekIndex = 0;
  let lastMonthLabeled = -1;

  days.forEach((day, i) => {
    if (i > 0 && day.weekday === 0) weekIndex++;

    const cell = document.createElement("div");
    cell.className = "cg-day";
    cell.dataset.level = levelFor(day.count, max);
    cell.style.gridColumn = weekIndex + 1;
    cell.style.gridRow = day.weekday + 1;
    cell.title = `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`;
    grid.appendChild(cell);
    // Label a month the first time we see its first week column
    const month = new Date(day.date).getUTCMonth();
    if (month !== lastMonthLabeled && (i === 0 || day.weekday === 0)) {
      const label = document.createElement("span");
      label.textContent = MONTH_NAMES[month];
      label.style.gridColumn = weekIndex + 1;
      monthsRow.appendChild(label);
      lastMonthLabeled = month;
    }
  });

  monthsRow.style.display = "grid";
  monthsRow.style.gridTemplateColumns = `repeat(${weekIndex + 1}, 12px)`;
  monthsRow.style.gridAutoFlow = "unset";
}

async function loadContributions() {
  const titleEl = document.getElementById("cg-title");
  const updatedEl = document.getElementById("cg-updated");

  try {
    const res = await fetch(CG_DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();

    titleEl.textContent = `${data.total_contributions} contributions in the last year`;
    updatedEl.textContent = `updated ${formatTimeAgo(new Date(data.last_updated))}`;

    buildGrid(data.days);
    requestAnimationFrame(() => {
      const scrollEl = document.getElementById("cg-scroll");
      scrollEl.scrollLeft = scrollEl.scrollWidth;
    });
  } catch (err) {
    console.error(err);
    titleEl.textContent = "Couldn't load contribution data";
    updatedEl.textContent = "";
  }
}

loadContributions();