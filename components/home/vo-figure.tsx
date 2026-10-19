"use client";

import { useCallback, useRef } from "react";
import { buildVO } from "@/lib/vo-geometry";

const VO = buildVO();
const [VB_X, VB_Y, VB_W, VB_H] = VO.viewBox;

// Dashed construction lines along the isometric axes through the glyph's base.
function guideLines() {
  const { start, end, top } = VO.anchors;
  const far = 2000;
  const along = (p: [number, number], dx: number, dy: number) =>
    `M${p[0] - dx * far} ${p[1] - dy * far}L${p[0] + dx * far} ${p[1] + dy * far}`;
  const c = Math.cos(Math.PI / 6);
  const s = Math.sin(Math.PI / 6);
  return [along(start, c, s), along(end, -c, s), along(top, c, s)];
}
const GUIDES = guideLines();

let audio: AudioContext | null = null;
function playTok() {
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Audio unavailable — the visual press still happens.
  }
}

export function VOFigure({ caption, note }: { caption: string; note: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGRadialGradientElement>(null);
  const glowLayerRef = useRef<SVGGElement>(null);
  const pressRef = useRef<SVGGElement>(null);
  const frame = useRef(0);

  const moveGlow = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm || !glowRef.current) return;
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    glowRef.current.setAttribute("cx", String(p.x));
    glowRef.current.setAttribute("cy", String(p.y));
  }, []);

  const showGlow = (visible: boolean) => {
    if (glowLayerRef.current) glowLayerRef.current.style.opacity = visible ? "1" : "0";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => moveGlow(clientX, clientY));
    showGlow(true);
  };

  const onPress = (e: React.PointerEvent) => {
    moveGlow(e.clientX, e.clientY);
    showGlow(true);
    playTok();
    const g = pressRef.current;
    if (!g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    g.animate([{ transform: "translateY(0)" }, { transform: "translateY(4px)" }, { transform: "translateY(0)" }], {
      duration: 180,
      easing: "ease-out",
    });
    if (e.pointerType !== "mouse") setTimeout(() => showGlow(false), 600);
  };

  return (
    <figure className="relative overflow-hidden bg-blueprint">
      <svg
        ref={svgRef}
        viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
        className="mx-auto block h-auto max-h-[300px] w-full cursor-pointer touch-manipulation select-none"
        onPointerMove={onPointerMove}
        onPointerLeave={() => showGlow(false)}
        onPointerDown={onPress}
        aria-hidden
      >
        <defs>
          <pattern id="vo-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--subtle)" strokeOpacity="0.55" strokeWidth="1" />
          </pattern>
          <radialGradient ref={glowRef} id="vo-glow" gradientUnits="userSpaceOnUse" cx={VB_X + VB_W * 0.7} cy={VB_Y + VB_H * 0.3} r="110">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="var(--line-dashed)" strokeDasharray="4 3" fill="none">
          {GUIDES.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g ref={pressRef} style={{ transformBox: "fill-box" }}>
          <g fill="var(--bg)" stroke="var(--subtle)" strokeLinejoin="round">
            {VO.back.map((d) => (
              <path key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          <path d={VO.front} fill="var(--bg)" fillRule="evenodd" />
          <path d={VO.front} fill="url(#vo-hatch)" fillRule="evenodd" />
          <path d={VO.outline} fill="none" stroke="var(--muted)" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          <g ref={glowLayerRef} className="transition-opacity duration-300" style={{ opacity: 0 }} fill="none" stroke="url(#vo-glow)" strokeWidth="1.5">
            {VO.back.map((d) => (
              <path key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
            <path d={VO.outline} vectorEffect="non-scaling-stroke" />
          </g>
        </g>
      </svg>

      <figcaption className="pointer-events-none absolute right-3 bottom-2 font-mono text-[10px] text-subtle select-none sm:right-4 sm:bottom-3">
        {caption}
      </figcaption>
      <p className="pointer-events-none absolute top-3 left-4 hidden font-mono text-[10px] text-subtle select-none pointer-fine:sm:block" aria-hidden>
        ↘ {note}
      </p>
    </figure>
  );
}
