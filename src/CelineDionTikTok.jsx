// CelineDionTikTok.jsx — v6 polices grandes, dynamique, CTA sans acompte
// Format: 1080x1920 (TikTok 9:16) — 15s (450 frames @ 30fps)

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";

const BLACK   = "#050508";
const DEEP    = "#0D0A1E";
const PURPLE  = "#2D1060";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#C8D4E0";
const ROSE    = "#C8547A";

// ─── Photo découpée centrée bas ───────────────────────────────────────────────
const CelinePhoto = ({ opacity = 1, scale = 1, xOffset = 0, yOffset = 0, fadeStart = 0, haloColor = "rgba(212,168,47,0.28)" }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 50) * 7;
  const animOpacity = interpolate(
    frame, [fadeStart, fadeStart + 30], [0, opacity],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div style={{
      position: "absolute", bottom: yOffset, left: "50%",
      transform: `translateX(calc(-50% + ${xOffset}px)) scale(${scale}) translateY(${float}px)`,
      transformOrigin: "bottom center",
      width: 1080, height: 1280,
      opacity: animOpacity, pointerEvents: "none", zIndex: 1,
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "15%",
        transform: "translateX(-50%)",
        width: 820, height: 820,
        background: `radial-gradient(ellipse at 50% 40%, ${haloColor} 0%, rgba(45,16,96,0.12) 50%, transparent 72%)`,
        filter: "blur(55px)", zIndex: 0,
      }} />
      <img
        src={staticFile("IMG_4446_cutout.png")}
        style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 1000, height: 1000,
          objectFit: "contain", objectPosition: "center bottom",
          filter: "drop-shadow(0px 0px 80px rgba(212,168,47,0.32)) drop-shadow(0px 40px 110px rgba(0,0,0,0.98))",
          zIndex: 1,
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(0deg, rgba(5,5,8,1) 0%, rgba(5,5,8,0.7) 45%, transparent 100%)",
        zIndex: 2,
      }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "10%", background: "linear-gradient(90deg, rgba(5,5,8,0.55) 0%, transparent 100%)", zIndex: 2 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "10%", background: "linear-gradient(270deg, rgba(5,5,8,0.55) 0%, transparent 100%)", zIndex: 2 }} />
    </div>
  );
};

// ─── Scène 1 : Intro — frames 0-90 ───────────────────────────────────────────
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stars = Array.from({ length: 40 }, (_, i) => ({ id: i, x: (i * 73 + 11) % 100, y: (i * 37 + 7) % 100, size: 1 + (i % 3), phase: i * 0.7 }));

  const spotOp    = interpolate(frame, [0, 22],  [0, 1], { extrapolateRight: "clamp" });
  const celineOp  = interpolate(frame, [12, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const celineSc  = spring({ frame: frame - 12, fps, config: { damping: 18, stiffness: 80 } });
  const dionOp    = interpolate(frame, [26, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dionSc    = spring({ frame: frame - 26, fps, config: { damping: 18, stiffness: 80 } });
  const lineW     = interpolate(frame, [46, 72], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp     = interpolate(frame, [54, 70], [0, 1],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY      = interpolate(frame, [54, 70], [16, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 55%, ${PURPLE}99 100%)`,
      overflow: "hidden",
    }}>
      {stars.map(s => {
        const twinkle = Math.sin((frame + s.phase * 20) / 14) * 0.35 + 0.45;
        return <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: WHITE, opacity: Math.max(0.05, Math.min(0.9, twinkle)), boxShadow: `0 0 ${s.size * 3}px ${WHITE}` }} />;
      })}
      <div style={{ position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)", width: 700, height: 1800, background: "conic-gradient(from -16deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.09) 16deg, transparent 32deg)", opacity: spotOp }} />

      <CelinePhoto opacity={0.95} scale={1} xOffset={0} yOffset={0} fadeStart={4} />

      {/* CÉLINE — grande, bold, haut gauche */}
      <div style={{ position: "absolute", top: 100, left: 38, opacity: celineOp, transform: `scale(${interpolate(celineSc, [0, 1], [0.82, 1])})`, transformOrigin: "left top", zIndex: 4 }}>
        <div style={{ fontSize: 148, fontFamily: "Georgia, serif", fontStyle: "italic", color: WHITE, letterSpacing: -2, lineHeight: 0.92, textShadow: `0 0 100px rgba(212,168,47,0.6), 0 6px 40px rgba(0,0,0,0.97)` }}>
          Celine
        </div>
      </div>

      {/* DION */}
      <div style={{ position: "absolute", top: 270, left: 38, opacity: dionOp, transform: `scale(${interpolate(dionSc, [0, 1], [0.82, 1])})`, transformOrigin: "left top", zIndex: 4 }}>
        <div style={{ fontSize: 148, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, letterSpacing: -2, lineHeight: 0.92, textShadow: `0 0 100px rgba(212,168,47,1), 0 4px 40px rgba(0,0,0,0.97)` }}>
          Dion
        </div>
      </div>

      {/* Ligne or */}
      <div style={{ position: "absolute", top: 440, left: 38, width: lineW, height: 2, background: `linear-gradient(90deg, ${GOLD_LT}, ${GOLD}, transparent)`, zIndex: 4 }} />

      {/* EST DE RETOUR */}
      <div style={{ position: "absolute", top: 455, left: 38, opacity: subOp, transform: `translateY(${subY}px)`, zIndex: 4 }}>
        <div style={{ fontSize: 28, color: SILVER, letterSpacing: 10, fontFamily: "Georgia, serif", textShadow: "0 2px 20px rgba(0,0,0,0.97)", fontStyle: "italic" }}>
          est de retour
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 260, background: `linear-gradient(0deg, ${BLACK} 0%, transparent 100%)`, zIndex: 3 }} />
    </AbsoluteFill>
  );
};

// ─── Scène 2 : Concert — frames 75-270 ───────────────────────────────────────
const SceneConcert = () => {
  const frame = useCurrentFrame();
  const bgOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const pop = (start, from = 0.8) => ({
    opacity:   interpolate(frame, [start, start + 16], [0, 1],    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `scale(${interpolate(frame, [start, start + 16], [from, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 35%, ${PURPLE} 100%)`, opacity: bgOp, overflow: "hidden" }}>
      {[-28, 0, 28].map((angle, i) => (
        <div key={i} style={{ position: "absolute", top: -200, left: "50%", width: 220, height: 1900, background: "linear-gradient(180deg, rgba(212,168,47,0.08) 0%, transparent 72%)", transform: `translateX(-50%) rotate(${angle}deg)`, transformOrigin: "top center" }} />
      ))}

      <CelinePhoto opacity={0.52} scale={1} xOffset={70} yOffset={0} fadeStart={0} haloColor="rgba(212,168,47,0.16)" />

      {/* ANNONCE OFFICIELLE */}
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", zIndex: 3, ...pop(8, 0.85) }}>
        <div style={{ fontSize: 20, color: GOLD, letterSpacing: 12, fontFamily: "Georgia, serif" }}>ANNONCE OFFICIELLE</div>
      </div>

      {/* 10 — immense */}
      <div style={{ position: "absolute", top: 168, left: 0, right: 0, textAlign: "center", zIndex: 3, ...pop(14, 0.7) }}>
        <div style={{ fontSize: 290, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.85, textShadow: `0 0 80px rgba(212,168,47,0.45), 0 8px 40px rgba(0,0,0,0.95)` }}>
          10
        </div>
      </div>

      {/* CONCERTS */}
      <div style={{ position: "absolute", top: 498, left: 0, right: 0, textAlign: "center", zIndex: 3, ...pop(22, 0.85) }}>
        <div style={{ fontSize: 68, fontFamily: "Georgia, serif", color: GOLD, letterSpacing: 12, fontWeight: "bold" }}>CONCERTS</div>
      </div>

      {/* Séparateur */}
      <div style={{ position: "absolute", top: 598, left: "50%", transform: "translateX(-50%)", width: 220, height: 1.5, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, zIndex: 3 }} />

      {/* La Défense Arena */}
      <div style={{ position: "absolute", top: 618, left: 0, right: 0, textAlign: "center", zIndex: 3, ...pop(36, 0.9) }}>
        <div style={{ fontSize: 20, color: SILVER, letterSpacing: 6, fontFamily: "Georgia, serif", marginBottom: 6 }}>PARIS</div>
        <div style={{ fontSize: 46, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.1 }}>La Defense Arena</div>
      </div>

      {/* SEPT — OCT 2026 */}
      <div style={{ position: "absolute", top: 770, left: 0, right: 0, textAlign: "center", zIndex: 3, ...pop(50, 0.88) }}>
        <div style={{ fontSize: 36, fontFamily: "Georgia, serif", color: SILVER, letterSpacing: 6 }}>SEPT — OCT</div>
        <div style={{ fontSize: 88, fontFamily: "Georgia, serif", fontWeight: "bold", color: GOLD, letterSpacing: 14, lineHeight: 1, textShadow: `0 0 60px rgba(212,168,47,0.8)` }}>2026</div>
      </div>

      {/* Badge Excellis */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 3,
        opacity: interpolate(frame, [74, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(frame, [74, 90], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }}>
        <div style={{ display: "inline-block", padding: "14px 42px", background: `linear-gradient(135deg, ${PURPLE}, #1A0840)`, border: `1px solid rgba(212,168,47,0.52)`, borderRadius: 50 }}>
          <div style={{ fontSize: 13, color: GOLD, letterSpacing: 5, fontFamily: "Georgia, serif" }}>BILLETS VIA</div>
          <div style={{ fontSize: 32, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 8, marginTop: 2 }}>EXCELLIS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 3 : Dates — frames 255-375 ────────────────────────────────────────
const SceneDates = () => {
  const frame = useCurrentFrame();
  const bgOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const infoOp  = interpolate(frame, [82, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const col1 = [
    { date: "12 SEPT", day: "Samedi" },   { date: "16 SEPT", day: "Mercredi" },
    { date: "19 SEPT", day: "Samedi" },   { date: "23 SEPT", day: "Mercredi" },
    { date: "26 SEPT", day: "Samedi" },
  ];
  const col2 = [
    { date: "30 SEPT", day: "Mercredi" }, { date: "3 OCT",   day: "Samedi" },
    { date: "7 OCT",   day: "Mercredi" }, { date: "10 OCT",  day: "Samedi" },
    { date: "14 OCT",  day: "Mercredi" },
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${DEEP} 0%, ${PURPLE} 50%, ${DEEP} 100%)`, opacity: bgOp, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 440, height: 440, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.09)" }} />
      <div style={{ position: "absolute", bottom: -100, left: -60, width: 540, height: 540, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.07)" }} />

      <CelinePhoto opacity={0.15} scale={0.8} xOffset={0} yOffset={160} fadeStart={0} />

      {/* Header */}
      <div style={{ opacity: titleOp, position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 14, color: GOLD, letterSpacing: 8, fontFamily: "Georgia, serif", marginBottom: 6 }}>PARIS LA DEFENSE ARENA</div>
        <div style={{ fontSize: 66, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1 }}>LES 10 DATES</div>
        <div style={{ width: 80, height: 2.5, background: GOLD, margin: "12px auto 0" }} />
      </div>

      {/* Grille */}
      <div style={{ position: "absolute", top: 256, left: 24, right: 24, display: "flex", gap: 12, zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          {col1.map((d, i) => {
            const delay = 16 + i * 10;
            return (
              <div key={d.date} style={{
                opacity:   interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame - delay, [0, 14], [-26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                padding: "13px 15px", marginBottom: 10,
                background: "rgba(5,5,8,0.74)", border: "1px solid rgba(212,168,47,0.24)", borderRadius: 8, borderLeft: `3px solid ${GOLD}`,
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
                <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          {col2.map((d, i) => {
            const delay = 20 + i * 10;
            return (
              <div key={d.date} style={{
                opacity:   interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame - delay, [0, 14], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                padding: "13px 15px", marginBottom: 10,
                background: "rgba(5,5,8,0.74)", border: "1px solid rgba(200,84,122,0.24)", borderRadius: 8, borderLeft: `3px solid ${ROSE}`,
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
                <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vente générale */}
      <div style={{ position: "absolute", bottom: 80, left: 24, right: 24, opacity: infoOp, zIndex: 2 }}>
        <div style={{ padding: "16px 24px", background: `linear-gradient(135deg, rgba(212,168,47,0.16), rgba(212,168,47,0.04))`, border: `1px solid rgba(212,168,47,0.44)`, borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: GOLD, letterSpacing: 6 }}>VENTE GENERALE</div>
          <div style={{ fontSize: 32, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", marginTop: 4 }}>10 AVRIL — 10H00</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 4 : CTA — frames 360-450 ──────────────────────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp      = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const logoSc    = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 90 } });
  const logoOp    = interpolate(frame, [6, 20],  [0, 1], { extrapolateRight: "clamp" });
  const line1Op   = interpolate(frame, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y    = interpolate(frame, [20, 36], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Op   = interpolate(frame, [32, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y    = interpolate(frame, [32, 48], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Op   = interpolate(frame, [44, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Y    = interpolate(frame, [44, 60], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmerX  = interpolate(frame, [36, 82], [-130, 440], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 45%, #060310 100%)`, opacity: bgOp, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 58% 48% at 50% 40%, rgba(45,16,96,0.7) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 36% 26% at 50% 35%, rgba(212,168,47,0.15) 0%, transparent 60%)` }} />

      <CelinePhoto opacity={0.88} scale={1.1} xOffset={0} yOffset={0} fadeStart={0} haloColor="rgba(212,168,47,0.35)" />

      {/* Particules */}
      {Array.from({ length: 14 }, (_, i) => {
        const pOp = interpolate(frame - i * 4, [0, 8, 65, 85], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${8 + (i * 9) % 82}%`, top: `${4 + (i * 13) % 88}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", background: i % 2 === 0 ? GOLD : ROSE, opacity: pOp, boxShadow: `0 0 8px ${i % 2 === 0 ? GOLD : ROSE}`, zIndex: 3 }} />;
      })}

      {/* Logo EXCELLIS — haut centré */}
      <div style={{
        position: "absolute", top: 120, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        opacity: logoOp, transform: `scale(${interpolate(logoSc, [0, 1], [0.68, 1])})`,
        zIndex: 4,
      }}>
        <svg width="80" height="48" viewBox="0 0 100 56" fill="none">
          <polygon points="10,50 22,18 36,38 50,8 64,38 78,18 90,50" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="47" width="84" height="9" rx="4.5" fill={GOLD} />
          <circle cx="10" cy="18" r="5" fill={GOLD_LT} />
          <circle cx="50" cy="8"  r="5" fill={GOLD_LT} />
          <circle cx="90" cy="18" r="5" fill={GOLD_LT} />
        </svg>
        <div style={{ fontSize: 58, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: 10, fontWeight: "bold", textShadow: "0 4px 30px rgba(0,0,0,0.95)" }}>EXCELLIS</div>
        <div style={{ fontSize: 13, color: GOLD, letterSpacing: 10, fontFamily: "Georgia, serif" }}>C O N C I E R G E R I E</div>
        <div style={{ position: "relative", width: 300, height: 1.5, background: GOLD, overflow: "hidden", marginTop: 4 }}>
          <div style={{ position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 110, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent)" }} />
        </div>
      </div>

      {/* CTA 3 lignes animées — centre bas */}
      <div style={{
        position: "absolute", top: 380, left: 40, right: 40,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
        zIndex: 4, textAlign: "center",
      }}>
        {/* Ligne 1 */}
        <div style={{ opacity: line1Op, transform: `translateY(${line1Y}px)` }}>
          <div style={{ fontSize: 44, fontFamily: "Georgia, serif", fontStyle: "italic", color: WHITE, lineHeight: 1.15, textShadow: "0 3px 24px rgba(0,0,0,0.97)" }}>
            Viens vite
          </div>
        </div>

        {/* Ligne 2 */}
        <div style={{ opacity: line2Op, transform: `translateY(${line2Y}px)` }}>
          <div style={{ fontSize: 44, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, lineHeight: 1.15, textShadow: "0 0 50px rgba(212,168,47,0.7), 0 3px 24px rgba(0,0,0,0.97)" }}>
            reserver ta place
          </div>
        </div>

        {/* Ligne 3 */}
        <div style={{ opacity: line3Op, transform: `translateY(${line3Y}px)`, marginTop: 6 }}>
          <div style={{ fontSize: 28, fontFamily: "Georgia, serif", color: SILVER, letterSpacing: 2, fontStyle: "italic", textShadow: "0 2px 20px rgba(0,0,0,0.97)", lineHeight: 1.3 }}>
            sans acompte
          </div>
        </div>
      </div>

      {/* Badge bas */}
      <div style={{
        position: "absolute", bottom: 88, left: 0, right: 0, textAlign: "center", zIndex: 4,
        opacity: interpolate(frame, [56, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [56, 72], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{
          display: "inline-block", padding: "15px 50px",
          background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`,
          border: `1.5px solid ${GOLD}88`, borderRadius: 50,
        }}>
          <div style={{ fontSize: 22, color: GOLD, fontFamily: "Georgia, serif", letterSpacing: 4, fontWeight: "bold" }}>
            Contactez-nous
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition principale ───────────────────────────────────────────────────
export const CelineDionTikTok = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <SceneIntro />
    </Sequence>
    <Sequence from={75} durationInFrames={195}>
      <SceneConcert />
    </Sequence>
    <Sequence from={255} durationInFrames={120}>
      <SceneDates />
    </Sequence>
    <Sequence from={360} durationInFrames={90}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);

export default CelineDionTikTok;
