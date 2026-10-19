import { describe, expect, it } from "vitest";
import { parseLanyard } from "@/lib/lanyard";

describe("parseLanyard", () => {
  it("treats an unknown user as offline", () => {
    expect(parseLanyard({ success: false, error: { code: "user_not_monitored" } })).toEqual({
      status: "offline",
      activity: null,
    });
  });

  it("treats malformed input as offline", () => {
    expect(parseLanyard(null)).toEqual({ status: "offline", activity: null });
    expect(parseLanyard({ success: true, data: { discord_status: "weird" } })).toEqual({ status: "offline", activity: null });
  });

  it("reads status and the main activity from the REST envelope", () => {
    expect(
      parseLanyard({
        success: true,
        data: { discord_status: "online", activities: [{ type: 0, name: "Visual Studio Code" }] },
      }),
    ).toEqual({ status: "online", activity: "Visual Studio Code" });
  });

  it("accepts a bare presence object from the WebSocket", () => {
    expect(parseLanyard({ discord_status: "dnd", activities: [] })).toEqual({ status: "dnd", activity: null });
  });

  it("ignores Spotify and custom status activities", () => {
    expect(
      parseLanyard({
        success: true,
        data: {
          discord_status: "idle",
          activities: [
            { type: 4, name: "Custom Status", state: "brb" },
            { type: 2, name: "Spotify" },
          ],
        },
      }),
    ).toEqual({ status: "idle", activity: null });
  });
});
