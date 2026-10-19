import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchContributions, parseContributionsHtml, toLevels, toWeeks } from "@/lib/github";

const HTML = `
<table>
<tr>
<td data-date="2026-10-18" id="contribution-day-component-0-0" data-level="0" class="ContributionCalendar-day"></td>
<td data-date="2026-10-19" id="contribution-day-component-1-0" data-level="2" class="ContributionCalendar-day"></td>
</tr>
<tr>
<td data-date="2026-10-20" id="contribution-day-component-2-0" data-level="1" class="ContributionCalendar-day"></td>
</tr>
</table>
<tool-tip id="t1" for="contribution-day-component-0-0" class="sr-only">No contributions on October 18th.</tool-tip>
<tool-tip id="t2" for="contribution-day-component-1-0" class="sr-only">12 contributions on October 19th.</tool-tip>
<tool-tip id="t3" for="contribution-day-component-2-0" class="sr-only">1 contribution on October 20th.</tool-tip>
`;

describe("toLevels", () => {
  it("buckets counts into quartiles of the max", () => {
    const days = [0, 1, 5, 6, 10, 11, 15, 16, 20].map((count, i) => ({ date: `2026-01-${String(i + 1).padStart(2, "0")}`, count }));
    expect(toLevels(days).map((d) => d.level)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it("keeps level 0 when there is no activity", () => {
    expect(toLevels([{ date: "2026-01-01", count: 0 }])[0].level).toBe(0);
  });
});

describe("parseContributionsHtml", () => {
  it("reads dates and counts in date order", () => {
    expect(parseContributionsHtml(HTML)).toEqual([
      { date: "2026-10-18", count: 0 },
      { date: "2026-10-19", count: 12 },
      { date: "2026-10-20", count: 1 },
    ]);
  });
});

describe("toWeeks", () => {
  it("groups days into Sunday-first weeks", () => {
    const days = toLevels(parseContributionsHtml(HTML));
    const weeks = toWeeks(days);
    expect(weeks).toHaveLength(1);
    expect(weeks[0][0]?.date).toBe("2026-10-18"); // a Sunday
    expect(weeks[0][2]?.date).toBe("2026-10-20");
  });
});

describe("fetchContributions", () => {
  afterEach(() => vi.restoreAllMocks());

  it("falls back to the public calendar without a token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(HTML, { status: 200 }));
    const result = await fetchContributions("vezironi", undefined, fetchImpl);
    expect(fetchImpl).toHaveBeenCalledWith(expect.stringContaining("/users/vezironi/contributions"), expect.anything());
    expect(result?.total).toBe(13);
  });

  it("uses GraphQL with a token", async () => {
    const body = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 3,
              weeks: [{ contributionDays: [{ date: "2026-10-18", contributionCount: 3 }] }],
            },
          },
        },
      },
    };
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    const result = await fetchContributions("vezironi", "tok", fetchImpl);
    expect(fetchImpl).toHaveBeenCalledWith("https://api.github.com/graphql", expect.objectContaining({ method: "POST" }));
    expect(result?.total).toBe(3);
    expect(result?.weeks[0][0]).toMatchObject({ date: "2026-10-18", count: 3, level: 4 });
  });

  it("returns null when the request fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    expect(await fetchContributions("vezironi", undefined, fetchImpl)).toBeNull();
    expect(await fetchContributions("vezironi", "tok", fetchImpl)).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));
    expect(await fetchContributions("vezironi", undefined, fetchImpl)).toBeNull();
  });
});
