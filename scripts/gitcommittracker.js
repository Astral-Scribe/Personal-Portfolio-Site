//Config
const GH_USERNAME = "Astral-Scribe";
const GH_EVENT_LIMIT = 5;
const GH_CACHE_KEY = `gh-tracker-cache-${GH_USERNAME}`;
const GH_POLL_MINUTES = 10;
const GH_CACHE_MS = GH_POLL_MINUTES * 60 * 1000;

//Cache helpers
function readCache() {
  try {
    const raw = localStorage.getItem(GH_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > GH_CACHE_MS) return null; // stale
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(events) {
  try {
    localStorage.setItem(GH_CACHE_KEY, JSON.stringify({
      fetchedAt: Date.now(),
      events
    }));
  } catch {
  }
}

//Fetch
async function fetchGithubEvents(username) {
  const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
    headers: { "Accept": "application/vnd.github+json" }
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

//Fetch commit count for one push event via the compare API
async function fetchCommitCount(repoName, before, head) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoName}/compare/${before}...${head}`,
      { headers: { "Accept": "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.total_commits ?? null;
  } catch {
    return null;
  }
}

//Render
async function renderEvents(events, limit) {
  const container = document.getElementById("gh-tracker-body");
  const updatedLabel = document.getElementById("gh-updated");

  const pushEvents = events
    .filter(e => e.type === "PushEvent")
    .slice(0, limit);

  if (pushEvents.length === 0) {
    container.className = "";
    container.textContent = "No recent public commits found.";
  } else {
    container.className = "";
    container.innerHTML = "";

    const counts = await Promise.all(
      pushEvents.map(event =>
        fetchCommitCount(event.repo.name, event.payload.before, event.payload.head)
      )
    );

    pushEvents.forEach((event, i) => {
      const commitCount = counts[i];
      const repoName = event.repo.name;
      const timeAgo = formatTimeAgo(new Date(event.created_at));
      const countLabel = commitCount === null
        ? "pushed"
        : `${commitCount} commit${commitCount !== 1 ? "s" : ""}`;

      const row = document.createElement("div");
      row.className = "gh-event";
      row.innerHTML = `
        <a class="gh-event-repo" href="https://github.com/${repoName}" target="_blank" rel="noopener">
          ${repoName}
        </a>
        <span class="gh-event-meta">${countLabel} · ${timeAgo}</span>
      `;
      container.appendChild(row);
    });
  }

  updatedLabel.textContent = `updated ${formatTimeAgo(new Date())}`;
}

function renderError() {
  const container = document.getElementById("gh-tracker-body");
  container.className = "gh-error";
  container.textContent = "Couldn't load GitHub activity right now.";
}

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

//Orchestration
async function loadGithubActivity(username, limit, { forceFetch = false } = {}) {
  if (!forceFetch) {
    const cached = readCache();
    if (cached) {
      await renderEvents(cached.events, limit);
      return;
    }
  }

  try {
    const events = await fetchGithubEvents(username);
    writeCache(events);
    await renderEvents(events, limit);
  } catch (err) {
    console.error(err);
    // If a fetch fails, fall back to showing stale cache rather than an error, if we have one
    const raw = localStorage.getItem(GH_CACHE_KEY);
    if (raw) {
      try {
        await renderEvents(JSON.parse(raw).events, limit);
        return;
      } catch { /* fall through to error state */ }
    }
    renderError();
  }
}

loadGithubActivity(GH_USERNAME, GH_EVENT_LIMIT);

setInterval(() => {
  loadGithubActivity(GH_USERNAME, GH_EVENT_LIMIT, { forceFetch: true });
}, GH_CACHE_MS);