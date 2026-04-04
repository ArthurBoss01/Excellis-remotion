// WorldCupTikTok.jsx — v2 clean
// Format: 1080x1920 (TikTok 9:16) — 10s (300 frames @ 30fps)

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";

const NAVY    = "#050A1A";
const BLUE    = "#081228";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#B8C8D8";

// ─── Scene 1 : Titre + ballon coin bas-droit (0-95f) ─────────────────────────
const SceneOpening = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp   = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // Titres
  const fifaOp = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fifaY  = interpolate(frame, [8, 24], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const wcSc   = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 140 } });
  const wcOp   = interpolate(frame, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const yearSc = spring({ frame: frame - 36, fps, config: { damping: 9, stiffness: 180 } });
  const yearOp = interpolate(frame, [34, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineW  = interpolate(frame, [52, 76], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp  = interpolate(frame, [60, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ballon — arrive de droite vers coin bas-droit
  const ballSc = spring({ frame: frame - 38, fps, config: { damping: 14, stiffness: 80 } });
  const ballX  = interpolate(ballSc, [0, 1], [600, 0]);
  const ballRot = interpolate(frame, [38, 95], [25, -8]);

  // Particules
  const pts = Array.from({ length: 18 }, (_, i) => ({
    x: (i * 57 + 11) % 100, y: (i * 43 + 7) % 100,
    size: 1.5 + (i % 3), delay: i * 3,
  }));

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 100% 70% at 50% 70%, #0f1828 0%, ${NAVY} 65%)`, opacity: bgOp, overflow: "hidden" }}>

      {/* Glow doré bas */}
      <div style={{ position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse at 50% 80%, rgba(212,168,47,0.18) 0%, transparent 65%)", filter: "blur(20px)" }} />

      {/* Particules */}
      {pts.map((p, i) => {
        const pOp = interpolate(frame - p.delay, [0, 10, 80, 95], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: GOLD, opacity: pOp, boxShadow: `0 0 5px ${GOLD}` }} />;
      })}

      {/* FIFA */}
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: fifaOp, transform: `translateY(${fifaY}px)` }}>
        <div style={{ fontSize: 22, color: GOLD, letterSpacing: 18, fontFamily: "Georgia, serif", fontWeight: "bold" }}>FIFA</div>
      </div>

      {/* WORLD CUP */}
      <div style={{ position: "absolute", top: 148, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: wcOp, transform: `scale(${interpolate(wcSc, [0, 1], [0.62, 1])})` }}>
        <div style={{ fontSize: 176, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.84, letterSpacing: -4, textShadow: "0 6px 70px rgba(0,0,0,0.98)" }}>
          WORLD
        </div>
        <div style={{ fontSize: 176, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.84, letterSpacing: -4, textShadow: "0 6px 70px rgba(0,0,0,0.98)" }}>
          CUP
        </div>
      </div>

      {/* 2026 */}
      <div style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: yearOp, transform: `scale(${interpolate(yearSc, [0, 1], [0.5, 1])})` }}>
        <div style={{ fontSize: 230, fontFamily: "Georgia, serif", fontWeight: "bold", color: GOLD, lineHeight: 0.85, letterSpacing: 6, textShadow: `0 0 180px rgba(212,168,47,1), 0 0 80px rgba(212,168,47,0.8), 0 8px 60px rgba(0,0,0,0.98)` }}>
          2026
        </div>
      </div>

      {/* Ligne or */}
      <div style={{ position: "absolute", top: 742, left: "50%", transform: "translateX(-50%)", width: lineW, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD_LT}, transparent)`, zIndex: 3 }} />

      {/* Sous-titre */}
      <div style={{ position: "absolute", top: 758, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: subOp }}>
        <div style={{ fontSize: 28, color: SILVER, letterSpacing: 7, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          USA · CANADA · MEXIQUE
        </div>
      </div>

    </AbsoluteFill>
  );
};

// ─── Scene 2 : Trophée stylé (82-185f) ───────────────────────────────────────
const SceneTrophee = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp  = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // Flash doré à l'entrée
  const flashOp = interpolate(frame, [4, 18], [0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Trophée monte du bas avec overshoot
  const tropSc = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 90 } });
  const tropY  = interpolate(tropSc, [0, 1], [420, 0]);
  const tropOp = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Logo WE ARE 26
  const logoSc = spring({ frame: frame - 32, fps, config: { damping: 11, stiffness: 120 } });
  const logoOp = interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Textes bas
  const t1Op = interpolate(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t1Y  = interpolate(frame, [46, 60], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2Op = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2Y  = interpolate(frame, [58, 72], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rayons
  const raysOp = interpolate(frame, [6, 30], [0, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 100% 80% at 50% 60%, #120e00 0%, ${NAVY} 60%)`, opacity: bgOp, overflow: "hidden" }}>

      {/* Flash à l'entrée */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,168,47,0.9) 0%, transparent 70%)`, opacity: flashOp, zIndex: 5 }} />

      {/* Rayons depuis le centre */}
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", top: "44%", left: "50%",
          width: 2, height: 750,
          background: `linear-gradient(0deg, ${GOLD}, transparent)`,
          transform: `translate(-50%, -100%) rotate(${i * 36}deg)`,
          transformOrigin: "bottom center",
          opacity: raysOp,
        }} />
      ))}

      {/* Lueur dorée */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(212,168,47,0.30) 0%, transparent 60%)" }} />

      {/* Trophée — centré parfaitement */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(calc(-50% + 70px), calc(-50% - 60px)) translateY(${tropY}px)`,
        width: 820, height: 1060,
        opacity: tropOp, zIndex: 2,
      }}>
        <img
          src={staticFile("IMG_4488_cutout.png")}
          style={{
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "center bottom",
            filter: "drop-shadow(0 0 140px rgba(212,168,47,0.85)) drop-shadow(0 0 60px rgba(212,168,47,0.5)) brightness(1.08)",
          }}
        />
      </div>

      {/* Logo WE ARE 26 — haut centré */}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", zIndex: 4, opacity: logoOp, transform: `scale(${interpolate(logoSc, [0, 1], [0.65, 1])})` }}>
        <img
          src={staticFile("IMG_4490_cutout.png")}
          style={{ width: 380, objectFit: "contain", filter: "invert(1) drop-shadow(0 0 28px rgba(212,168,47,0.55))" }}
        />
      </div>

      {/* Bas : textes */}
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 4 }}>
        <div style={{ opacity: t1Op, transform: `translateY(${t1Y}px)` }}>
          <div style={{ fontSize: 48, color: GOLD, fontFamily: "Georgia, serif", letterSpacing: 6, fontWeight: "bold" }}>LA COUPE DU MONDE</div>
        </div>
        <div style={{ opacity: t2Op, transform: `translateY(${t2Y}px)`, marginTop: 8 }}>
          <div style={{ fontSize: 28, color: SILVER, fontFamily: "Georgia, serif", letterSpacing: 5, fontStyle: "italic" }}>USA · CANADA · MEXIQUE</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 : CTA Excellis (175-300f) ───────────────────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp    = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const logoSc  = spring({ frame: frame - 5,  fps, config: { damping: 13, stiffness: 100 } });
  const logoOp  = interpolate(frame, [3, 18],  [0, 1], { extrapolateRight: "clamp" });

  // Badges billets + hôtel
  const b1Sc   = spring({ frame: frame - 22, fps, config: { damping: 10, stiffness: 150 } });
  const b1Op   = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b2Sc   = spring({ frame: frame - 32, fps, config: { damping: 10, stiffness: 150 } });
  const b2Op   = interpolate(frame, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CTA texte
  const l1Op   = interpolate(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l1Y    = interpolate(frame, [46, 60], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Op   = interpolate(frame, [57, 71], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Y    = interpolate(frame, [57, 71], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Op   = interpolate(frame, [68, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Y    = interpolate(frame, [68, 82], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp  = interpolate(frame, [90, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY   = interpolate(frame, [90, 104], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shimmerX = interpolate(frame, [22, 65], [-160, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pts = Array.from({ length: 14 }, (_, i) => ({
    x: (i * 67 + 13) % 100, y: (i * 43 + 7) % 100, delay: i * 3,
  }));

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 95% at 50% 50%, ${BLUE} 0%, ${NAVY} 100%)`, opacity: bgOp, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 42% at 50% 36%, rgba(212,168,47,0.16) 0%, transparent 65%)" }} />

      {/* Particules */}
      {pts.map((p, i) => {
        const pOp = interpolate(frame - p.delay, [0, 8, 110, 125], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", background: GOLD, opacity: pOp, boxShadow: `0 0 7px ${GOLD}` }} />;
      })}

      {/* Logo Excellis */}
      <div style={{
        position: "absolute", top: 120, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        opacity: logoOp, transform: `scale(${interpolate(logoSc, [0, 1], [0.65, 1])})`, zIndex: 3,
      }}>
        <svg width="86" height="52" viewBox="0 0 100 56" fill="none">
          <polygon points="10,50 22,18 36,38 50,8 64,38 78,18 90,50" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="47" width="84" height="9" rx="4.5" fill={GOLD} />
          <circle cx="10" cy="18" r="5" fill={GOLD_LT} />
          <circle cx="50" cy="8"  r="5" fill={GOLD_LT} />
          <circle cx="90" cy="18" r="5" fill={GOLD_LT} />
        </svg>
        <div style={{ fontSize: 74, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: 9, fontWeight: "bold", textShadow: "0 4px 30px rgba(0,0,0,0.97)" }}>EXCELLIS</div>
        <div style={{ fontSize: 15, color: GOLD, letterSpacing: 9, fontFamily: "Georgia, serif" }}>C O N C I E R G E R I E</div>
        <div style={{ position: "relative", width: 300, height: 1.5, background: GOLD, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 110, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }} />
        </div>
      </div>

      {/* Séparateur */}
      <div style={{ position: "absolute", top: 378, left: "50%", transform: "translateX(-50%)", width: interpolate(frame, [20, 40], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 1, background: `linear-gradient(90deg, transparent, rgba(212,168,47,0.4), transparent)`, zIndex: 3 }} />

      {/* Badges — billets + hôtel, grands et centrés */}
      <div style={{ position: "absolute", top: 390, left: 30, right: 30, display: "flex", justifyContent: "center", gap: 24, zIndex: 3 }}>
        <div style={{ opacity: b1Op, transform: `scale(${interpolate(b1Sc, [0, 1], [0.72, 1])})`, flex: 1 }}>
          <div style={{ padding: "22px 18px", background: "rgba(212,168,47,0.12)", border: `2px solid rgba(212,168,47,0.6)`, borderRadius: 18, textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 6 }}>🎟️</div>
            <div style={{ fontSize: 16, color: GOLD, letterSpacing: 4, marginBottom: 4 }}>TOUTES LES</div>
            <div style={{ fontSize: 36, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>DATES</div>
          </div>
        </div>
        <div style={{ opacity: b2Op, transform: `scale(${interpolate(b2Sc, [0, 1], [0.72, 1])})`, flex: 1 }}>
          <div style={{ padding: "22px 18px", background: "rgba(212,168,47,0.12)", border: `2px solid rgba(212,168,47,0.6)`, borderRadius: 18, textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 6 }}>🏨</div>
            <div style={{ fontSize: 16, color: GOLD, letterSpacing: 4, marginBottom: 4 }}>PACK</div>
            <div style={{ fontSize: 36, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>HOTEL</div>
          </div>
        </div>
      </div>

      {/* CTA centré milieu-bas */}
      <div style={{
        position: "absolute", top: 600, bottom: 110, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", zIndex: 3,
      }}>
        <div style={{ opacity: l1Op, transform: `translateY(${l1Y}px)` }}>
          <div style={{ fontSize: 124, fontFamily: "Georgia, serif", fontStyle: "italic", color: WHITE, lineHeight: 0.95, textShadow: "0 4px 50px rgba(0,0,0,0.98)" }}>
            Viens vite
          </div>
        </div>
        <div style={{ opacity: l2Op, transform: `translateY(${l2Y}px)` }}>
          <div style={{ fontSize: 108, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, lineHeight: 0.95, textShadow: `0 0 110px rgba(212,168,47,0.95), 0 4px 50px rgba(0,0,0,0.98)` }}>
            reserver
          </div>
          <div style={{ fontSize: 108, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, lineHeight: 0.95, textShadow: `0 0 110px rgba(212,168,47,0.95), 0 4px 50px rgba(0,0,0,0.98)` }}>
            ta place
          </div>
        </div>
        <div style={{ opacity: l3Op, transform: `translateY(${l3Y}px)`, marginTop: 14 }}>
          <div style={{ fontSize: 52, fontFamily: "Georgia, serif", color: SILVER, letterSpacing: 4, fontStyle: "italic" }}>
            sans acompte
          </div>
        </div>
      </div>

      {/* Bouton bas */}
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: ctaOp, transform: `translateY(${ctaY}px)` }}>
        <div style={{ display: "inline-block", padding: "14px 52px", background: "linear-gradient(135deg, rgba(212,168,47,0.18), rgba(212,168,47,0.06))", border: `1.5px solid rgba(212,168,47,0.7)`, borderRadius: 50 }}>
          <div style={{ fontSize: 22, color: GOLD, fontFamily: "Georgia, serif", letterSpacing: 5, fontWeight: "bold" }}>Contactez-nous</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition ─────────────────────────────────────────────────────────────
export const WorldCupTikTok = () => (
  <AbsoluteFill>
    <Sequence from={0}   durationInFrames={97}><SceneOpening /></Sequence>
    <Sequence from={82}  durationInFrames={105}><SceneTrophee /></Sequence>
    <Sequence from={178} durationInFrames={122}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

export default WorldCupTikTok;
