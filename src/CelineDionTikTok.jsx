// CelineDionTikTok.jsx — v5 photo centrée style magazine
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

// ─── Photo découpée — centrée bas, style magazine cover ───────────────────────
const CelinePhoto = ({ opacity = 1, scale = 1, xOffset = 0, yOffset = 0, fadeStart = 0, haloColor = "rgba(212,168,47,0.28)" }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 50) * 6;

  const animOpacity = interpolate(
    frame, [fadeStart, fadeStart + 30], [0, opacity],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{
      position: "absolute",
      bottom: yOffset,
      left: "50%",
      transform: `translateX(calc(-50% + ${xOffset}px)) scale(${scale}) translateY(${float}px)`,
      transformOrigin: "bottom center",
      width: 1080,
      height: 1280,
      opacity: animOpacity,
      pointerEvents: "none",
      zIndex: 1,
    }}>
      {/* Halo lumineux derrière la silhouette */}
      <div style={{
        position: "absolute",
        left: "50%", top: "18%",
        transform: "translateX(-50%)",
        width: 780, height: 780,
        background: `radial-gradient(ellipse at 50% 40%, ${haloColor} 0%, rgba(45,16,96,0.12) 50%, transparent 72%)`,
        filter: "blur(50px)",
        zIndex: 0,
      }} />

      {/* Photo découpée PNG */}
      <img
        src={staticFile("IMG_4446_cutout.png")}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 980,
          height: 980,
          objectFit: "contain",
          objectPosition: "center bottom",
          filter: "drop-shadow(0px 0px 70px rgba(212,168,47,0.30)) drop-shadow(0px 40px 100px rgba(0,0,0,0.95))",
          zIndex: 1,
        }}
      />

      {/* Fondu bas — ancre la photo au fond */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0, height: "28%",
        background: "linear-gradient(0deg, rgba(5,5,8,1) 0%, rgba(5,5,8,0.75) 40%, transparent 100%)",
        zIndex: 2,
      }} />

      {/* Fondu lateral gauche léger */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0, left: 0, width: "12%",
        background: "linear-gradient(90deg, rgba(5,5,8,0.6) 0%, transparent 100%)",
        zIndex: 2,
      }} />

      {/* Fondu lateral droit léger */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0, right: 0, width: "12%",
        background: "linear-gradient(270deg, rgba(5,5,8,0.6) 0%, transparent 100%)",
        zIndex: 2,
      }} />
    </div>
  );
};

// ─── Scène 1 : Intro — frames 0-90 ───────────────────────────────────────────
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i, x: (i * 73 + 11) % 100, y: (i * 37 + 7) % 100,
    size: 1 + (i % 3), phase: i * 0.7,
  }));

  const spotOpacity  = interpolate(frame, [0, 25],  [0, 1], { extrapolateRight: "clamp" });
  const celineOp     = interpolate(frame, [18, 38],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const celineSc     = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 70 } });
  const dionOp       = interpolate(frame, [32, 52],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dionSc       = spring({ frame: frame - 32, fps, config: { damping: 20, stiffness: 70 } });
  const lineW        = interpolate(frame, [50, 76],  [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp        = interpolate(frame, [58, 74],  [0, 1],   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 55%, ${PURPLE}88 100%)`,
      overflow: "hidden",
    }}>
      {/* Étoiles */}
      {stars.map(s => {
        const twinkle = Math.sin((frame + s.phase * 20) / 14) * 0.35 + 0.45;
        return (
          <div key={s.id} style={{
            position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: "50%",
            background: WHITE,
            opacity: Math.max(0.05, Math.min(0.9, twinkle)),
            boxShadow: `0 0 ${s.size * 3}px ${WHITE}`,
          }} />
        );
      })}

      {/* Spotlight */}
      <div style={{
        position: "absolute", top: -180, left: "50%",
        transform: "translateX(-50%)",
        width: 660, height: 1700,
        background: "conic-gradient(from -15deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.08) 15deg, transparent 30deg)",
        opacity: spotOpacity,
      }} />

      {/* ── Photo Céline centrée bas ── */}
      <CelinePhoto opacity={0.95} scale={1} xOffset={0} yOffset={0} fadeStart={5} />

      {/* CÉLINE — en haut gauche */}
      <div style={{
        position: "absolute", top: 130, left: 44,
        opacity: celineOp,
        transform: `scale(${interpolate(celineSc, [0, 1], [0.85, 1])})`,
        transformOrigin: "left top",
        zIndex: 4,
      }}>
        <div style={{
          fontSize: 122,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: WHITE,
          letterSpacing: 2,
          lineHeight: 0.95,
          textShadow: `0 0 90px rgba(212,168,47,0.55), 0 6px 32px rgba(0,0,0,0.95)`,
        }}>Céline</div>
      </div>

      {/* DION */}
      <div style={{
        position: "absolute", top: 265, left: 44,
        opacity: dionOp,
        transform: `scale(${interpolate(dionSc, [0, 1], [0.85, 1])})`,
        transformOrigin: "left top",
        zIndex: 4,
      }}>
        <div style={{
          fontSize: 122,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: GOLD,
          letterSpacing: 2,
          lineHeight: 0.95,
          textShadow: `0 0 90px rgba(212,168,47,0.95), 0 4px 30px rgba(0,0,0,0.95)`,
        }}>Dion</div>
      </div>

      {/* Ligne or */}
      <div style={{
        position: "absolute", top: 408, left: 44,
        width: lineW, height: 1.5,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LT}, transparent)`,
        zIndex: 4,
      }} />

      {/* EST DE RETOUR */}
      <div style={{
        position: "absolute", top: 422, left: 44,
        opacity: subOp, zIndex: 4,
      }}>
        <div style={{
          fontSize: 22, color: SILVER, letterSpacing: 9,
          fontFamily: "Georgia, serif",
          textShadow: "0 2px 16px rgba(0,0,0,0.95)",
        }}>EST DE RETOUR</div>
      </div>

      {/* Fondu bas global */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 260,
        background: `linear-gradient(0deg, ${BLACK} 0%, transparent 100%)`,
        zIndex: 3,
      }} />
    </AbsoluteFill>
  );
};

// ─── Scène 2 : Concert — frames 75-270 ───────────────────────────────────────
const SceneConcert = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fadeUp = (start) => ({
    opacity:   interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(frame, [start, start + 18], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 35%, ${PURPLE} 100%)`,
      opacity: bgOpacity, overflow: "hidden",
    }}>
      {/* Rayons */}
      {[-25, 0, 25].map((angle, i) => (
        <div key={i} style={{
          position: "absolute", top: -200, left: "50%",
          width: 200, height: 1800,
          background: "linear-gradient(180deg, rgba(212,168,47,0.07) 0%, transparent 75%)",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transformOrigin: "top center",
        }} />
      ))}

      {/* ── Photo centrée bas, légèrement décalée droite ── */}
      <CelinePhoto
        opacity={0.55}
        scale={1}
        xOffset={80}
        yOffset={0}
        fadeStart={0}
        haloColor="rgba(212,168,47,0.18)"
      />

      {/* "10 CONCERTS" */}
      <div style={{ position: "absolute", top: 175, left: 0, right: 0, textAlign: "center", ...fadeUp(10), zIndex: 3 }}>
        <div style={{ fontSize: 22, color: GOLD, letterSpacing: 10, fontFamily: "Georgia, serif", marginBottom: 6 }}>
          ANNONCE OFFICIELLE
        </div>
        <div style={{
          fontSize: 172, fontFamily: "Georgia, serif", fontWeight: "bold",
          color: WHITE, lineHeight: 0.88,
          textShadow: `0 0 70px rgba(212,168,47,0.40), 0 6px 30px rgba(0,0,0,0.9)`,
        }}>10</div>
        <div style={{ fontSize: 46, fontFamily: "Georgia, serif", color: GOLD, letterSpacing: 8, marginTop: -6 }}>
          CONCERTS
        </div>
      </div>

      {/* Venue */}
      <div style={{ position: "absolute", top: "52%", left: 40, right: 40, textAlign: "center", ...fadeUp(32), zIndex: 3 }}>
        <div style={{ width: 200, height: 1.5, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 16, color: SILVER, letterSpacing: 6, fontFamily: "Georgia, serif", marginBottom: 6 }}>PARIS</div>
        <div style={{ fontSize: 36, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.2 }}>
          La Defense Arena
        </div>
        <div style={{ width: 200, height: 1.5, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "16px auto 0" }} />
      </div>

      {/* SEPT — OCT 2026 */}
      <div style={{ position: "absolute", top: "70%", left: 0, right: 0, textAlign: "center", ...fadeUp(52), zIndex: 3 }}>
        <div style={{ fontSize: 44, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, letterSpacing: 4 }}>
          SEPT — OCT
        </div>
        <div style={{
          fontSize: 72, fontFamily: "Georgia, serif", fontWeight: "bold",
          color: GOLD, letterSpacing: 12,
          textShadow: `0 0 50px rgba(212,168,47,0.75)`,
        }}>2026</div>
      </div>

      {/* Badge Excellis */}
      <div style={{
        position: "absolute", bottom: 85, left: 0, right: 0, textAlign: "center", zIndex: 3,
        opacity: interpolate(frame, [78, 94], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(frame, [78, 94], [0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }}>
        <div style={{
          display: "inline-block", padding: "14px 38px",
          background: `linear-gradient(135deg, ${PURPLE}, #1A0840)`,
          border: `1px solid rgba(212,168,47,0.50)`, borderRadius: 50,
        }}>
          <div style={{ fontSize: 13, color: GOLD, letterSpacing: 5, fontFamily: "Georgia, serif" }}>BILLETS DISPONIBLES VIA</div>
          <div style={{ fontSize: 26, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 7, marginTop: 4 }}>EXCELLIS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 3 : Dates — frames 255-375 ────────────────────────────────────────
const SceneDates = () => {
  const frame = useCurrentFrame();

  const bgOpacity  = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleAnim  = { opacity: interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
  const infoOpacity = interpolate(frame, [82, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${DEEP} 0%, ${PURPLE} 50%, ${DEEP} 100%)`,
      opacity: bgOpacity, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 420, height: 420, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.09)" }} />
      <div style={{ position: "absolute", bottom: -100, left: -60, width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.07)" }} />

      {/* ── Photo en filigrane, très transparente ── */}
      <CelinePhoto opacity={0.18} scale={0.8} xOffset={0} yOffset={180} fadeStart={0} />

      {/* Header */}
      <div style={{ ...titleAnim, position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 12, color: GOLD, letterSpacing: 8, fontFamily: "Georgia, serif", marginBottom: 8 }}>
          PARIS LA DEFENSE ARENA
        </div>
        <div style={{ fontSize: 54, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1 }}>
          LES 10 DATES
        </div>
        <div style={{ width: 80, height: 2, background: GOLD, margin: "12px auto 0" }} />
      </div>

      {/* Grille dates */}
      <div style={{ position: "absolute", top: 278, left: 26, right: 26, display: "flex", gap: 12, zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          {col1.map((d, i) => {
            const delay = 18 + i * 11;
            return (
              <div key={d.date} style={{
                opacity:   interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame - delay, [0, 15], [-22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                padding: "12px 14px", marginBottom: 10,
                background: "rgba(5,5,8,0.72)",
                border: "1px solid rgba(212,168,47,0.22)",
                borderRadius: 8, borderLeft: `3px solid ${GOLD}`,
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
                <div style={{ fontSize: 20, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          {col2.map((d, i) => {
            const delay = 22 + i * 11;
            return (
              <div key={d.date} style={{
                opacity:   interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame - delay, [0, 15], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                padding: "12px 14px", marginBottom: 10,
                background: "rgba(5,5,8,0.72)",
                border: "1px solid rgba(200,84,122,0.22)",
                borderRadius: 8, borderLeft: `3px solid ${ROSE}`,
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
                <div style={{ fontSize: 20, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vente générale */}
      <div style={{ position: "absolute", bottom: 85, left: 26, right: 26, opacity: infoOpacity, zIndex: 2 }}>
        <div style={{
          padding: "16px 24px",
          background: `linear-gradient(135deg, rgba(212,168,47,0.16), rgba(212,168,47,0.04))`,
          border: `1px solid rgba(212,168,47,0.42)`, borderRadius: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 6 }}>VENTE GENERALE</div>
          <div style={{ fontSize: 28, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", marginTop: 4 }}>
            10 AVRIL — 10H00
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 4 : CTA Excellis — frames 360-450 ─────────────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity   = interpolate(frame, [0, 15], [0, 1],  { extrapolateRight: "clamp" });
  const logoScale   = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [8, 22],  [0, 1],  { extrapolateRight: "clamp" });
  const ctaOpacity  = interpolate(frame, [28, 45], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY        = interpolate(frame, [28, 45], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmerX    = interpolate(frame, [38, 85], [-120, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 50%, #060310 100%)`,
      opacity: bgOpacity, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 48% at 50% 42%, rgba(45,16,96,0.65) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 38% 28% at 50% 38%, rgba(212,168,47,0.14) 0%, transparent 60%)` }} />

      {/* ── Photo centrée bas, grande ── */}
      <CelinePhoto
        opacity={0.85}
        scale={1.08}
        xOffset={0}
        yOffset={0}
        fadeStart={0}
        haloColor="rgba(212,168,47,0.32)"
      />

      {/* Particules */}
      {Array.from({ length: 14 }, (_, i) => {
        const pOpacity = interpolate(frame - i * 4, [0, 8, 65, 85], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${8 + (i * 9) % 82}%`, top: `${4 + (i * 13) % 88}%`,
            width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%",
            background: i % 2 === 0 ? GOLD : ROSE,
            opacity: pOpacity,
            boxShadow: `0 0 8px ${i % 2 === 0 ? GOLD : ROSE}`,
            zIndex: 3,
          }} />
        );
      })}

      {/* Logo + CTA — en haut, centré */}
      <div style={{
        position: "absolute", top: 140, left: 0, right: 0,
        opacity: logoOpacity,
        transform: `scale(${interpolate(logoScale, [0, 1], [0.72, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        zIndex: 4,
      }}>
        <svg width="88" height="52" viewBox="0 0 100 56" fill="none">
          <polygon points="10,50 22,18 36,38 50,8 64,38 78,18 90,50" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="47" width="84" height="9" rx="4.5" fill={GOLD} />
          <circle cx="10" cy="18" r="5" fill={GOLD_LT} />
          <circle cx="50" cy="8"  r="5" fill={GOLD_LT} />
          <circle cx="90" cy="18" r="5" fill={GOLD_LT} />
        </svg>

        <div style={{ fontSize: 52, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: 8, fontWeight: "bold" }}>EXCELLIS</div>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 9, fontFamily: "Georgia, serif" }}>C O N C I E R G E R I E</div>

        <div style={{ position: "relative", width: 280, height: 1.5, background: GOLD, overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 100,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
          }} />
        </div>

        <div style={{ opacity: ctaOpacity, transform: `translateY(${ctaY}px)`, textAlign: "center", marginTop: 18 }}>
          <div style={{ fontSize: 26, color: WHITE, fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 20 }}>
            Reservez vos billets
          </div>
          <div style={{
            padding: "16px 44px",
            background: `linear-gradient(135deg, ${PURPLE} 0%, #1A0840 100%)`,
            borderRadius: 50, border: `1px solid rgba(212,168,47,0.48)`,
          }}>
            <div style={{ fontSize: 20, color: WHITE, fontFamily: "Georgia, serif", letterSpacing: 3 }}>
              DM / WhatsApp
            </div>
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
