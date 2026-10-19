import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { buildVO } from "@/lib/vo-geometry";

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0a0a0b";
const FG = "#e7e7ea";
const MUTED = "#9a9aa2";
const SUBTLE = "#6b6b73";
const ACCENT = "#a3e635";
const GRID = "#18181b";
const LINE = "#2a2a2f";

function Frame({ children, footerLeft, footerRight }: { children: ReactNode; footerLeft: string; footerRight: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 72,
        background: BG,
        backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        color: FG,
        fontFamily: "sans-serif",
      }}
    >
      {children}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px dashed ${LINE}`,
          paddingTop: 24,
          fontSize: 24,
          color: MUTED,
          fontFamily: "monospace",
        }}
      >
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>
  );
}

function TopBar({ eyebrow }: { eyebrow: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
      <div style={{ display: "flex", fontWeight: 700, letterSpacing: -1 }}>
        VO<span style={{ color: ACCENT }}>.</span>
      </div>
      <div style={{ display: "flex", color: ACCENT, fontFamily: "monospace" }}>{`// ${eyebrow}`}</div>
    </div>
  );
}

const VO = buildVO();

/** The home figure as a static line drawing. */
function VOMark({ width }: { width: number }) {
  const [x, y, w, h] = VO.viewBox;
  return (
    <svg width={width} height={(width * h) / w} viewBox={`${x} ${y} ${w} ${h}`}>
      {VO.back.map((d) => (
        <path key={d} d={d} fill={BG} stroke={SUBTLE} strokeWidth={1.2} />
      ))}
      <path d={VO.front} fill={BG} fillRule="evenodd" />
      <path d={VO.outline} fill="none" stroke={ACCENT} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

/** Home: name and title beside the VO figure. */
export function renderHomeOg({ name, title, site, eyebrow }: { name: string; title: string; site: string; eyebrow: string }) {
  return new ImageResponse(
    (
      <Frame footerLeft={site} footerRight="Fig. 01 — VO">
        <TopBar eyebrow={eyebrow} />
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -3 }}>{name}</div>
            <div style={{ display: "flex", fontSize: 34, color: ACCENT, fontFamily: "monospace" }}>{title}</div>
          </div>
          <VOMark width={420} />
        </div>
      </Frame>
    ),
    OG_SIZE,
  );
}

/** Regular pages (blog index, gallery, contact); `aside` lines give each page its own detail. */
export function renderPageOg({
  eyebrow,
  title,
  subtitle,
  site,
  aside = [],
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  site: string;
  aside?: string[];
}) {
  return new ImageResponse(
    (
      <Frame footerLeft={site} footerRight="Vezir Oni — Full Stack Developer">
        <TopBar eyebrow={eyebrow} />
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 30, color: MUTED, lineHeight: 1.4 }}>{subtitle}</div>
          </div>
          {aside.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 420,
                gap: 14,
                padding: "26px 28px",
                border: `1px solid ${LINE}`,
                borderRadius: 14,
                background: "#111113",
              }}
            >
              {aside.map((line, i) => (
                <div key={line} style={{ display: "flex", gap: 12, fontSize: 24, lineHeight: 1.3, color: i === 0 ? FG : MUTED }}>
                  <span style={{ color: ACCENT, fontFamily: "monospace" }}>{i === 0 ? "→" : "·"}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>
    ),
    OG_SIZE,
  );
}

/** Blog posts: article layout with metadata and tags, marked by an accent rail. */
export function renderPostOg({
  title,
  excerpt,
  meta,
  tags,
  site,
}: {
  title: string;
  excerpt?: string;
  meta: string;
  tags: string[];
  site: string;
}) {
  return new ImageResponse(
    (
      <Frame footerLeft={site} footerRight="Vezir Oni">
        <TopBar eyebrow="blog" />
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 36 }}>
          <div style={{ display: "flex", width: 6, alignSelf: "stretch", margin: "56px 0", background: ACCENT, borderRadius: 3 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 26, color: SUBTLE, fontFamily: "monospace" }}>{meta}</div>
            <div style={{ display: "flex", fontSize: title.length > 42 ? 58 : 70, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08 }}>
              {title}
            </div>
            {excerpt && <div style={{ display: "flex", fontSize: 28, color: MUTED, lineHeight: 1.4 }}>{excerpt}</div>}
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: 12 }}>
                {tags.map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      padding: "6px 14px",
                      border: `1px solid ${LINE}`,
                      borderRadius: 8,
                      fontSize: 22,
                      color: MUTED,
                      fontFamily: "monospace",
                    }}
                  >
                    {`#${t}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Frame>
    ),
    OG_SIZE,
  );
}
