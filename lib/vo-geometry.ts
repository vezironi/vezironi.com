// Geometry for the "VO" monogram: two letters drawn as polygons, standing
// upright on the ground plane and extruded backwards, in isometric projection.
//
// Axes: x runs along the text (down-right on screen), y is depth (down-left),
// z is height (up). The viewer looks from +(1,1,1). The glyph face sits on the
// plane y = DEPTH, closest to the viewer, so it is never occluded and is drawn
// last; the extruded walls behind it are painter-sorted.

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS + 0, (x + y) * SIN - z + 0];
}

type P2 = [number, number]; // (x, z) in the glyph plane
type Pt = [number, number, number];

// Outer contours counter-clockwise, holes clockwise (z up).
const V: P2[][] = [[[2.5, 0], [4.5, 0], [7, 7], [5, 7], [3.5, 2.6], [2, 7], [0, 7]]];
const O_W = 6;
const O: P2[][] = [
  [[1, 0], [5, 0], [6, 1], [6, 6], [5, 7], [1, 7], [0, 6], [0, 1]],
  [[2, 2], [2, 5], [4, 5], [4, 2]],
];
const V_W = 7;
const GAP = 1.2;
const HEIGHT = 7;
const DEPTH = 2;
const UNIT = 20;

export function buildVO() {
  const contours = [...V, ...O.map((c) => c.map(([x, z]): P2 => [x + V_W + GAP, z]))];

  const fmt = (n: number) => (Math.round(n * 100) / 100).toString();
  const project = ([x, y, z]: Pt) => iso(x, y, z).map((v) => v * UNIT) as [number, number];
  const poly = (pts: Pt[]) => `M${pts.map((p) => project(p).map(fmt).join(" ")).join("L")}Z`;

  // Walls: one quad per contour edge whose outward normal faces the viewer.
  const back: { d: string; depth: number }[] = [];
  for (const contour of contours) {
    contour.forEach((a, i) => {
      const b = contour[(i + 1) % contour.length];
      const [du, dv] = [b[0] - a[0], b[1] - a[1]];
      // Outward normal of a CCW edge is (dv, -du); visible when it points toward +x/+z.
      if (dv - du <= 1e-9) return;
      back.push({
        d: poly([[a[0], DEPTH, a[1]], [b[0], DEPTH, b[1]], [b[0], 0, b[1]], [a[0], 0, a[1]]]),
        depth: (a[0] + b[0]) / 2 + DEPTH / 2 + (a[1] + b[1]) / 2,
      });
    });
  }
  back.sort((p, q) => p.depth - q.depth);

  const front = contours.map((c) => poly(c.map(([x, z]): Pt => [x, DEPTH, z]))).join("");

  const width = V_W + GAP + O_W;
  const corners: Pt[] = [0, width].flatMap((x) => [0, DEPTH].flatMap((y) => [0, HEIGHT].map((z): Pt => [x, y, z])));
  const projected = corners.map(project);
  const pad = UNIT * 1.5;
  const minX = Math.floor(Math.min(...projected.map((p) => p[0])) - pad);
  const minY = Math.floor(Math.min(...projected.map((p) => p[1])) - pad);
  const maxX = Math.ceil(Math.max(...projected.map((p) => p[0])) + pad);
  const maxY = Math.ceil(Math.max(...projected.map((p) => p[1])) + pad);

  return {
    back: back.map((b) => b.d),
    front,
    outline: front,
    viewBox: [minX, minY, maxX - minX, maxY - minY] as [number, number, number, number],
    /** Anchor points for construction lines, in viewBox units. */
    anchors: { start: project([0, DEPTH, 0]), end: project([width, DEPTH, 0]), top: project([0, DEPTH, HEIGHT]) },
  };
}
