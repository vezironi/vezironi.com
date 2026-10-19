import { describe, expect, it } from "vitest";
import { formatDate, formatRange } from "@/lib/format";

describe("formatRange", () => {
  it("shows ongoing roles with the localized 'present'", () => {
    expect(formatRange(2026, null, "tr")).toBe("2026 — Şimdi");
    expect(formatRange(2026, null, "en")).toBe("2026 — Present");
  });

  it("collapses a single-year range", () => {
    expect(formatRange(2024, 2024, "tr")).toBe("2024");
  });

  it("shows a closed range", () => {
    expect(formatRange(2022, 2024, "en")).toBe("2022 — 2024");
  });
});

describe("formatDate", () => {
  it("formats an ISO date per locale", () => {
    expect(formatDate("2026-10-19", "tr")).toBe("19 Ekim 2026");
    expect(formatDate("2026-10-19", "en")).toBe("October 19, 2026");
  });
});
