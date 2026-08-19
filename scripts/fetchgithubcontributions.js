
const fs = require("fs");
const path = require("path");

const USERNAME = "Astral-Scribe";
const TOKEN = process.env.GRAPHQL_TOKEN;

if (!TOKEN) {
  console.error("Missing GRAPHQL_TOKEN environment variable.");
  process.exit(1);
}

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

function oneYearAgo(date) {
  const d = new Date(date);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d;
}

async function main() {
  const to = new Date();
  const from = oneYearAgo(to);

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: USERNAME,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;

  // Flatten weeks -> a simple flat array of { date, count, weekday }
  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      weekday: d.weekday, // 0 = Sunday ... 6 = Saturday
    }))
  );

  const output = {
    last_updated: new Date().toISOString(),
    total_contributions: calendar.totalContributions,
    days,
  };

  const outDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "github-contributions.json"),
    JSON.stringify(output, null, 2)
  );

  console.log(
    `Wrote data/github-contributions.json — ${calendar.totalContributions} contributions across ${days.length} days.`
  );
}

main().catch((err) => {
  console.error("Failed to fetch GitHub contributions:", err);
  process.exit(1);
});
