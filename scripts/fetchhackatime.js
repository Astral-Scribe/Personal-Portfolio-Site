const fs = require("fs");
const path = require("path");

const USERNAME = "Astral_Scribe"; 
const API_KEY = process.env.HACKATIME_API_KEY;

if (!API_KEY) {
  console.error("Missing HACKATIME_API_KEY environment variable.");
  process.exit(1);
}

const AUTH_BASE = "https://hackatime.hackclub.com/api/v1/authenticated";
const PUBLIC_STATS_URL = `https://hackatime.hackclub.com/api/v1/users/${USERNAME}/stats?features=projects`;

function formatDuration(totalSeconds = 0) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function toDateString(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function daysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

async function fetchHours(startDate, endDate) {
  const url = `${AUTH_BASE}/hours?start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`/hours failed for ${startDate}..${endDate}: ${res.status}`);
  }
  const data = await res.json();
  const totalSeconds = data.total_seconds ?? 0;
  return { total_seconds: totalSeconds, human: formatDuration(totalSeconds) };
}

async function fetchAllTimeWithProjects() {
  const res = await fetch(PUBLIC_STATS_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Public /stats failed: ${res.status}`);
  }
  const json = await res.json();
  const data = json.data ?? {};
  const totalSeconds = data.total_seconds ?? 0;

  const topProjects = (data.projects || [])
    .slice()
    .sort((a, b) => (b.total_seconds ?? 0) - (a.total_seconds ?? 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      seconds: p.total_seconds ?? 0,
      human: p.text || formatDuration(p.total_seconds ?? 0),
    }));

  return {
    total_seconds: totalSeconds,
    human: data.human_readable_total || formatDuration(totalSeconds),
    top_projects: topProjects,
  };
}

async function main() {
  const today = toDateString(new Date());

  const [todayStats, weekStats, monthStats, yearStats, allTimeStats] = await Promise.all([
    fetchHours(today, today),
    fetchHours(toDateString(daysAgo(6)), today),   // rolling last 7 days
    fetchHours(toDateString(daysAgo(29)), today),  // rolling last 30 days
    fetchHours(toDateString(daysAgo(364)), today), // rolling last 365 days
    fetchAllTimeWithProjects(),
  ]);

  const output = {
    last_updated: new Date().toISOString(),
    today: todayStats,
    week: weekStats,
    month: monthStats,
    year: yearStats,
    all_time: allTimeStats,
  };

  const outDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "hackatime.json"), JSON.stringify(output, null, 2));

  console.log("Wrote data/hackatime.json:", JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error("Failed to fetch Hackatime stats:", err);
  process.exit(1);
});
