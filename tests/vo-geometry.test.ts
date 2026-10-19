import { describe, expect, it } from "vitest";
import { buildVO, iso } from "@/lib/vo-geometry";

describe("iso", () => {
  it("maps the origin to the origin", () => {
    expect(iso(0, 0, 0)).toEqual([0, 0]);
  });

  it("projects the x axis down-right at 30°", () => {
    const [x, y] = iso(1, 0, 0);
    expect(x).toBeCloseTo(Math.cos(Math.PI / 6), 6);
    expect(y).toBeCloseTo(Math.sin(Math.PI / 6), 6);
  });

  it("projects z straight up", () => {
    expect(iso(0, 0, 1)).toEqual([0, -1]);
  });
});

describe("buildVO", () => {
  const vo = buildVO();
  const paths = [...vo.back, vo.front, vo.outline];

  it("produces back faces, a front face and an outline", () => {
    expect(vo.back.length).toBeGreaterThan(0);
    expect(vo.front.length).toBeGreaterThan(0);
    expect(vo.outline.length).toBeGreaterThan(0);
  });

  it("emits valid path data", () => {
    for (const d of paths) {
      expect(d.startsWith("M")).toBe(true);
      expect(d).not.toMatch(/NaN|undefined/);
    }
  });

  it("reports a viewBox that contains every point", () => {
    const [minX, minY, w, h] = vo.viewBox;
    const nums = paths.join(" ").match(/-?\d+(\.\d+)?/g)!.map(Number);
    const xs = nums.filter((_, i) => i % 2 === 0);
    const ys = nums.filter((_, i) => i % 2 === 1);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(minX);
    expect(Math.max(...xs)).toBeLessThanOrEqual(minX + w);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(minY);
    expect(Math.max(...ys)).toBeLessThanOrEqual(minY + h);
  });
});
