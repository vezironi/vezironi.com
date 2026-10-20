import { describe, expect, it } from "vitest";
import { youtubeId, youtubeThumbnail } from "@/lib/youtube";

describe("youtubeId", () => {
  it.each([
    ["https://www.youtube.com/watch?v=UYbTJGIbblI", "UYbTJGIbblI"],
    ["https://youtube.com/watch?v=-Owr5kznK5w&t=10s", "-Owr5kznK5w"],
    ["https://m.youtube.com/watch?v=MHgN_ElzpNk", "MHgN_ElzpNk"],
    ["https://youtu.be/2Ahq3SYcyms?si=abc", "2Ahq3SYcyms"],
    ["https://www.youtube.com/shorts/G3s4IyYNP1M", "G3s4IyYNP1M"],
    ["https://www.youtube.com/embed/GKOI-N5vfAs", "GKOI-N5vfAs"],
  ])("%s -> %s", (url, id) => {
    expect(youtubeId(url)).toBe(id);
  });

  it.each(["", "not a url", "https://example.com/watch?v=UYbTJGIbblI", "https://www.youtube.com/watch?v=short", "https://www.youtube.com/@channel"])(
    "rejects %s",
    (url) => {
      expect(youtubeId(url)).toBeNull();
    },
  );
});

describe("youtubeThumbnail", () => {
  it("builds the i.ytimg.com URL", () => {
    expect(youtubeThumbnail("UYbTJGIbblI")).toBe("https://i.ytimg.com/vi/UYbTJGIbblI/maxresdefault.jpg");
    expect(youtubeThumbnail("UYbTJGIbblI", "mqdefault")).toBe("https://i.ytimg.com/vi/UYbTJGIbblI/mqdefault.jpg");
  });
});
