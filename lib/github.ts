import { cacheLife } from "next/cache";
import { env } from "@/lib/env";

export type Day = { date: string; count: number };
export type LeveledDay = Day & { level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; weeks: (LeveledDay | null)[][] };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function toLevels(days: Day[]): LeveledDay[] {
  const max = Math.max(0, ...days.map((d) => d.count));
  const step = max / 4;
  return days.map((d) => ({
    ...d,
    level: d.count === 0 ? 0 : (Math.min(4, Math.max(1, Math.ceil(d.count / step))) as 1 | 2 | 3 | 4),
  }));
}

/** Parses GitHub's public contributions calendar fragment. */
export function parseContributionsHtml(html: string): Day[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^(\d[\d,]*)\s+contribution/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: Day[] = [];
  for (const m of html.matchAll(/<td\b[^>]*>/g)) {
    const date = /data-date="([^"]+)"/.exec(m[0])?.[1];
    const id = /\bid="([^"]+)"/.exec(m[0])?.[1];
    if (date && id) days.push({ date, count: counts.get(id) ?? 0 });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

/** Groups consecutive days into Sunday-first weeks, padding the first week with nulls. */
export function toWeeks(days: LeveledDay[]): (LeveledDay | null)[][] {
  const weeks: (LeveledDay | null)[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weeks.length === 0) weeks.push(Array(weekday).fill(null));
    else if (weekday === 0) weeks.push([]);
    weeks.at(-1)!.push(day);
  }
  return weeks;
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export async function fetchContributions(
  login: string,
  token: string | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<Contributions | null> {
  try {
    let days: Day[];
    if (token) {
      const res = await fetchImpl("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: QUERY, variables: { login } }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) return null;
      days = calendar.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      );
    } else {
      const res = await fetchImpl(`https://github.com/users/${encodeURIComponent(login)}/contributions`, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) return null;
      days = parseContributionsHtml(await res.text());
    }
    if (days.length === 0) return null;
    const leveled = toLevels(days);
    return { total: days.reduce((sum, d) => sum + d.count, 0), weeks: toWeeks(leveled) };
  } catch {
    return null;
  }
}

export async function getContributions(login = "vezironi"): Promise<Contributions | null> {
  "use cache";
  cacheLife("days");
  return fetchContributions(login, env.githubToken);
}
