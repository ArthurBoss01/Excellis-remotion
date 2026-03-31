// CelineDionTikTok.jsx
// Excellis Conciergerie — Céline Dion est de retour
// Format: 1080×1920 (TikTok 9:16 vertical) — 15s (450 frames @ 30fps)
//
// Scènes :
//   0-90   → Intro dramatique (nom + spotlight)
//   75-270 → Annonce concert (10 dates / Paris La Défense Arena)
//   255-375 → Les 10 dates
//   360-450 → CTA Excellis

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLACK   = "#050508";
const DEEP    = "#0D0A1E";
const PURPLE  = "#2D1060";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#C8D4E0";
const ROSE    = "#C8547A";

// ─── Scène 1 : Intro — frames 0-90 (3 s) ────────────────────────────────────
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Étoiles fixes (déterministes)
  const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    x: (i * 73 + 11) % 100,
    y: (i * 37 + 7)  % 100,
    size: 1 + (i % 3),
    phase: i * 0.7,
  }));

  const spotOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // "Céline"
  const celineOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const celineScale   = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 70 } });

  // "Dion"
  const dionOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dionScale   = spring({ frame: frame - 35, fps, config: { damping: 20, stiffness: 70 } });

  // Séparateur & sous-titre
  const lineW    = interpolate(frame, [55, 80], [0, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [62, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BLACK} 0%, ${DEEP} 60%, ${PURPLE}66 100%)`, overflow: "hidden" }}>

      {/* Étoiles scintillantes */}
      {stars.map(s => {
        const twinkle = Math.sin((frame + s.phase * 20) / 14) * 0.35 + 0.45;
        return (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            borderRadius: "50%",
            background: WHITE,
            opacity: Math.max(0.05, Math.min(1, twinkle)),
            boxShadow: `0 0 ${s.size * 3}px ${WHITE}`,
          }} />
        );
      })}

      {/* Spotlight central */}
      <div style={{
        position: "absolute", top: -200, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 1600,
        background: "conic-gradient(from -18deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.07) 18deg, transparent 36deg)",
        opacity: spotOpacity,
      }} />
      {/* Spot latéral gauche */}
      <div style={{
        position: "absolute", top: -100, left: "25%",
        width: 350, height: 1100,
        background: "linear-gradient(180deg, rgba(200,84,122,0.05) 0%, transparent 100%)",
        transform: "rotate(-22deg)",
        transformOrigin: "top center",
        opacity: spotOpacity,
      }} />

      {/* CÉLINE */}
      <div style={{
        position: "absolute", top: "27%", left: 0, right: 0,
        textAlign: "center",
        opacity: celineOpacity,
        transform: `scale(${interpolate(celineScale, [0, 1], [0.88, 1])})`,
      }}>
        <div style={{
          fontSize: 112,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: WHITE,
          letterSpacing: 6,
          lineHeight: 1,
          textShadow: `0 0 80px rgba(212,168,47,0.55), 0 0 24px rgba(255,255,255,0.2), 0 6px 32px rgba(0,0,0,0.9)`,
        }}>Céline</div>
      </div>

      {/* DION */}
      <div style={{
        position: "absolute", top: "43%", left: 0, right: 0,
        textAlign: "center",
        opacity: dionOpacity,
        transform: `scale(${interpolate(dionScale, [0, 1], [0.88, 1])})`,
      }}>
        <div style={{
          fontSize: 112,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: GOLD,
          letterSpacing: 6,
          lineHeight: 1,
          textShadow: `0 0 80px rgba(212,168,47,0.9), 0 0 30px rgba(212,168,47,0.5), 0 6px 32px rgba(0,0,0,0.9)`,
        }}>Dion</div>
      </div>

      {/* Ligne or */}
      <div style={{
        position: "absolute", top: "59%", left: "50%",
        transform: "translateX(-50%)",
        width: lineW, height: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />

      {/* Est de retour */}
      <div style={{
        position: "absolute", top: "62%", left: 0, right: 0,
        textAlign: "center", opacity: subOpacity,
      }}>
        <div style={{
          fontSize: 26, color: SILVER,
          letterSpacing: 10,
          fontFamily: "Georgia, serif",
          textTransform: "uppercase",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}>Est de retour</div>
      </div>

      {/* Lueur basse */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 350,
        background: `linear-gradient(0deg, rgba(45,16,96,0.45) 0%, transparent 100%)`,
      }} />
    </AbsoluteFill>
  );
};

// ─── Scène 2 : Annonce concert — frames 75-270 (6.5 s) ───────────────────────
const SceneConcert = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const fadeUp = (start) => ({
    opacity: interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(frame, [start, start + 18], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
  });

  const badgeScale = interpolate(frame, [80, 96], [0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [80, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, #0D0A1E 40%, ${PURPLE} 100%)`,
      opacity: bgOpacity, overflow: "hidden",
    }}>

      {/* Rayons lumineux */}
      {[-22, 0, 22].map((angle, i) => (
        <div key={i} style={{
          position: "absolute", top: -200, left: "50%",
          width: 220, height: 1700,
          background: "linear-gradient(180deg, rgba(212,168,47,0.07) 0%, transparent 80%)",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transformOrigin: "top center",
        }} />
      ))}

      {/* "10 CONCERTS" */}
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", ...fadeUp(10) }}>
        <div style={{ fontSize: 28, color: GOLD, letterSpacing: 10, fontFamily: "Georgia, serif", marginBottom: 4 }}>
          ANNONCE OFFICIELLE
        </div>
        <div style={{
          fontSize: 170, fontFamily: "Georgia, serif", fontWeight: "bold",
          color: WHITE, lineHeight: 0.88,
          textShadow: `0 0 60px rgba(212,168,47,0.35)`,
        }}>10</div>
        <div style={{ fontSize: 46, fontFamily: "Georgia, serif", color: GOLD, letterSpacing: 6, marginTop: -4 }}>
          CONCERTS
        </div>
      </div>

      {/* Paris La Défense Arena */}
      <div style={{ position: "absolute", top: "53%", left: 40, right: 40, textAlign: "center", ...fadeUp(35) }}>
        <div style={{ width: 220, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 18, color: SILVER, letterSpacing: 5, fontFamily: "Georgia, serif", marginBottom: 8 }}>
          PARIS
        </div>
        <div style={{ fontSize: 36, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 1, lineHeight: 1.2 }}>
          La Défense Arena
        </div>
        <div style={{ width: 220, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "20px auto 0" }} />
      </div>

      {/* Sept — Oct 2026 */}
      <div style={{ position: "absolute", top: "71%", left: 0, right: 0, textAlign: "center", ...fadeUp(55) }}>
        <div style={{
          fontSize: 50, fontFamily: "Georgia, serif", fontWeight: "bold",
          color: WHITE, letterSpacing: 3,
        }}>SEPT — OCT</div>
        <div style={{
          fontSize: 70, fontFamily: "Georgia, serif", fontWeight: "bold",
          color: GOLD, letterSpacing: 10,
          textShadow: `0 0 40px rgba(212,168,47,0.7)`,
        }}>2026</div>
      </div>

      {/* Badge Excellis */}
      <div style={{
        position: "absolute", bottom: 90, left: 0, right: 0,
        textAlign: "center",
        opacity: badgeOpacity,
        transform: `scale(${badgeScale})`,
      }}>
        <div style={{
          display: "inline-block",
          padding: "14px 36px",
          background: `linear-gradient(135deg, ${PURPLE}, #1A0840)`,
          border: `1px solid rgba(212,168,47,0.5)`,
          borderRadius: 50,
        }}>
          <div style={{ fontSize: 14, color: GOLD, letterSpacing: 5, fontFamily: "Georgia, serif" }}>
            BILLETS DISPONIBLES VIA
          </div>
          <div style={{ fontSize: 24, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 7, marginTop: 4 }}>
            EXCELLIS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 3 : Les 10 dates — frames 255-375 (4 s) ───────────────────────────
const SceneDates = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const titleAnim = {
    opacity: interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };

  const col1 = [
    { date: "12 SEPT", day: "Samedi" },
    { date: "16 SEPT", day: "Mercredi" },
    { date: "19 SEPT", day: "Samedi" },
    { date: "23 SEPT", day: "Mercredi" },
    { date: "26 SEPT", day: "Samedi" },
  ];
  const col2 = [
    { date: "30 SEPT", day: "Mercredi" },
    { date: "3 OCT",   day: "Samedi" },
    { date: "7 OCT",   day: "Mercredi" },
    { date: "10 OCT",  day: "Samedi" },
    { date: "14 OCT",  day: "Mercredi" },
  ];

  const cardStyle = (delay, side) => ({
    opacity: interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateX(${interpolate(frame - delay, [0, 15], [side === "L" ? -24 : 24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
  });

  const infoOpacity = interpolate(frame, [82, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, #0D0A1E 0%, ${PURPLE} 50%, #0D0A1E 100%)`,
      opacity: bgOpacity, overflow: "hidden",
    }}>

      {/* Cercles décoratifs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 450, height: 450, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.08)" }} />
      <div style={{ position: "absolute", bottom: -120, left: -80, width: 550, height: 550, borderRadius: "50%", border: "1px solid rgba(212,168,47,0.06)" }} />

      {/* Header */}
      <div style={{ ...titleAnim, position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
        <div style={{ fontSize: 13, color: GOLD, letterSpacing: 8, fontFamily: "Georgia, serif", marginBottom: 10 }}>
          PARIS LA DÉFENSE ARENA
        </div>
        <div style={{ fontSize: 52, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1 }}>
          LES 10 DATES
        </div>
        <div style={{ width: 80, height: 2, background: GOLD, margin: "14px auto 0" }} />
      </div>

      {/* Grille 2 colonnes */}
      <div style={{ position: "absolute", top: 295, left: 28, right: 28, display: "flex", gap: 14, zIndex: 2 }}>

        {/* Colonne gauche — Septembre */}
        <div style={{ flex: 1 }}>
          {col1.map((d, i) => (
            <div key={d.date} style={{
              ...cardStyle(20 + i * 11, "L"),
              padding: "13px 14px", marginBottom: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,168,47,0.2)",
              borderRadius: 8,
              borderLeft: `3px solid ${GOLD}`,
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
              <div style={{ fontSize: 19, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
            </div>
          ))}
        </div>

        {/* Colonne droite — Septembre/Octobre */}
        <div style={{ flex: 1 }}>
          {col2.map((d, i) => (
            <div key={d.date} style={{
              ...cardStyle(24 + i * 11, "R"),
              padding: "13px 14px", marginBottom: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,84,122,0.2)",
              borderRadius: 8,
              borderLeft: `3px solid ${ROSE}`,
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>{d.day}</div>
              <div style={{ fontSize: 19, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{d.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vente générale */}
      <div style={{
        position: "absolute", bottom: 90, left: 28, right: 28,
        opacity: infoOpacity, zIndex: 2,
      }}>
        <div style={{
          padding: "16px 24px",
          background: `linear-gradient(135deg, rgba(212,168,47,0.15), rgba(212,168,47,0.04))`,
          border: `1px solid rgba(212,168,47,0.4)`,
          borderRadius: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 12, color: GOLD, letterSpacing: 5 }}>VENTE GÉNÉRALE</div>
          <div style={{ fontSize: 26, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", marginTop: 4 }}>
            10 AVRIL — 10H00
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scène 4 : CTA Excellis — frames 360-450 (3 s) ───────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity  = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const logoScale  = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });

  const ctaOpacity = interpolate(frame, [28, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY       = interpolate(frame, [28, 45], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shimmerX = interpolate(frame, [38, 85], [-120, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BLACK} 0%, #0D0A1E 50%, #060310 100%)`,
      opacity: bgOpacity, alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>

      {/* Lueurs d'ambiance */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(45,16,96,0.65) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 30% at 50% 35%, rgba(212,168,47,0.12) 0%, transparent 60%)` }} />

      {/* Particules */}
      {Array.from({ length: 12 }, (_, i) => {
        const pOpacity = interpolate(frame - i * 4, [0, 8, 65, 85], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + (i * 9) % 80}%`,
            top:  `${5  + (i * 13) % 90}%`,
            width: 2 + (i % 3), height: 2 + (i % 3),
            borderRadius: "50%",
            background: i % 2 === 0 ? GOLD : ROSE,
            opacity: pOpacity,
            boxShadow: `0 0 7px ${i % 2 === 0 ? GOLD : ROSE}`,
          }} />
        );
      })}

      {/* Logo Excellis */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${interpolate(logoScale, [0, 1], [0.72, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 2,
      }}>

        {/* Couronne */}
        <svg width="92" height="54" viewBox="0 0 100 56" fill="none">
          <polygon points="10,50 22,18 36,38 50,8 64,38 78,18 90,50" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="47" width="84" height="9" rx="4.5" fill={GOLD} />
          <circle cx="10" cy="18" r="5" fill={GOLD_LT} />
          <circle cx="50" cy="8"  r="5" fill={GOLD_LT} />
          <circle cx="90" cy="18" r="5" fill={GOLD_LT} />
        </svg>

        <div style={{
          fontSize: 54, fontFamily: "Georgia, serif",
          color: WHITE, letterSpacing: 9, fontWeight: "bold",
        }}>EXCELLIS</div>

        <div style={{ fontSize: 13, color: GOLD, letterSpacing: 9, fontFamily: "Georgia, serif" }}>
          C O N C I E R G E R I E
        </div>

        {/* Barre or avec shimmer */}
        <div style={{ position: "relative", width: 330, height: 1, background: GOLD, overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 110,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
          }} />
        </div>

        {/* CTA */}
        <div style={{ opacity: ctaOpacity, transform: `translateY(${ctaY}px)`, textAlign: "center", marginTop: 22 }}>
          <div style={{
            fontSize: 28, color: WHITE,
            fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 24,
          }}>Réservez vos billets</div>

          <div style={{
            padding: "17px 48px",
            background: `linear-gradient(135deg, ${PURPLE} 0%, #1A0840 100%)`,
            borderRadius: 50,
            border: `1px solid rgba(212,168,47,0.45)`,
          }}>
            <div style={{ fontSize: 21, color: WHITE, fontFamily: "Georgia, serif", letterSpacing: 3 }}>
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
    {/* Scène 1 : Intro — 0 à 90 */}
    <Sequence from={0} durationInFrames={90}>
      <SceneIntro />
    </Sequence>

    {/* Scène 2 : Annonce — 75 à 270 (fade-in à 75, 15 frames d'overlap) */}
    <Sequence from={75} durationInFrames={195}>
      <SceneConcert />
    </Sequence>

    {/* Scène 3 : Dates — 255 à 375 (15 frames d'overlap) */}
    <Sequence from={255} durationInFrames={120}>
      <SceneDates />
    </Sequence>

    {/* Scène 4 : CTA — 360 à 450 (15 frames d'overlap) */}
    <Sequence from={360} durationInFrames={90}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);

export default CelineDionTikTok;
