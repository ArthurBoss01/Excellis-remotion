// WorldCupTikTok.jsx — v1 Coupe du Monde 2026
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
const BLUE    = "#081430";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#B8C8D8";
const RED     = "#CC2200";

// ─── Scene 1 : Ballon + impact titre (0-90f) ─────────────────────────────────
const SceneBall = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ballSc  = spring({ frame: frame - 0,  fps, config: { damping: 12, stiffness: 70 } });
  const ballY   = interpolate(ballSc, [0, 1], [600, 0]);
  const ballRot = interpolate(frame, [0, 300], [0, 360]);
  const bgOp    = interpolate(frame, [0, 20],  [0, 1], { extrapolateRight: "clamp" });

  const fifaOp  = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fifaY   = interpolate(frame, [28, 44], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const wcSc    = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 160 } });
  const wcOp    = interpolate(frame, [38, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const yearSc  = spring({ frame: frame - 55, fps, config: { damping: 10, stiffness: 180 } });
  const yearOp  = interpolate(frame, [53, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineW   = interpolate(frame, [62, 82], [0, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Particules dorées
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 57 + 11) % 100, y: (i * 41 + 7) % 100,
    size: 1.5 + (i % 3), delay: i * 3,
  }));

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 100% 80% at 50% 60%, #1a1000 0%, ${NAVY} 70%)`, overflow: "hidden", opacity: bgOp }}>

      {/* Lueur dorée centrale */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 62%, rgba(212,168,47,0.22) 0%, transparent 65%)" }} />

      {/* Particules */}
      {particles.map((p, i) => {
        const pOp = interpolate(frame - p.delay, [0, 10, 70, 90], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: GOLD, opacity: pOp, boxShadow: `0 0 6px ${GOLD}`, zIndex: 1 }} />;
      })}

      {/* Ballon FIFA */}
      <div style={{
        position: "absolute",
        bottom: 160,
        left: "50%",
        transform: `translateX(-50%) translateY(${ballY}px) rotate(${ballRot}deg)`,
        width: 780, height: 780,
        zIndex: 2,
      }}>
        <img
          src={staticFile("IMG_4489.jpeg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", filter: "drop-shadow(0 0 80px rgba(212,168,47,0.4)) drop-shadow(0 40px 120px rgba(0,0,0,0.98))" }}
        />
      </div>

      {/* Fondu bas ballon */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 400, background: `linear-gradient(0deg, ${NAVY} 0%, rgba(5,10,26,0.7) 50%, transparent 100%)`, zIndex: 3 }} />

      {/* FIFA */}
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", zIndex: 4, opacity: fifaOp, transform: `translateY(${fifaY}px)` }}>
        <div style={{ fontSize: 24, color: GOLD, letterSpacing: 16, fontFamily: "Georgia, serif", fontWeight: "bold" }}>FIFA</div>
      </div>

      {/* WORLD CUP */}
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", zIndex: 4, opacity: wcOp, transform: `scale(${interpolate(wcSc, [0, 1], [0.6, 1])})` }}>
        <div style={{ fontSize: 112, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.88, letterSpacing: -2, textShadow: "0 6px 60px rgba(0,0,0,0.98)" }}>
          WORLD
        </div>
        <div style={{ fontSize: 112, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.88, letterSpacing: -2, textShadow: "0 6px 60px rgba(0,0,0,0.98)" }}>
          CUP
        </div>
      </div>

      {/* 2026 */}
      <div style={{ position: "absolute", top: 414, left: 0, right: 0, textAlign: "center", zIndex: 4, opacity: yearOp, transform: `scale(${interpolate(yearSc, [0, 1], [0.5, 1])})` }}>
        <div style={{ fontSize: 148, fontFamily: "Georgia, serif", fontWeight: "bold", color: GOLD, lineHeight: 0.9, letterSpacing: 4, textShadow: `0 0 120px rgba(212,168,47,1), 0 6px 60px rgba(0,0,0,0.98)` }}>
          2026
        </div>
      </div>

      {/* Ligne or */}
      <div style={{ position: "absolute", top: 578, left: "50%", transform: "translateX(-50%)", width: lineW, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD_LT}, transparent)`, zIndex: 4 }} />

    </AbsoluteFill>
  );
};

// ─── Scene 2 : Trophée (80-185f) ─────────────────────────────────────────────
const SceneTrophee = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp   = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const zoom   = interpolate(frame, [0, 105], [1.0, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tropSc = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 85 } });
  const tropY  = interpolate(tropSc, [0, 1], [500, 0]);
  const tropOp = interpolate(frame, [2, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSc = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 130 } });
  const logoOp = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const t1Op   = interpolate(frame, [44, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t1Y    = interpolate(frame, [44, 58], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2Op   = interpolate(frame, [56, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2Y    = interpolate(frame, [56, 70], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rays = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 100% 80% at 50% 55%, #1a1200 0%, ${NAVY} 65%)`, opacity: bgOp, overflow: "hidden" }}>

      {/* Rayons dorés depuis le trophée */}
      {rays.map((angle, i) => {
        const rOp = interpolate(frame, [10, 28], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 3, height: 700,
            background: `linear-gradient(0deg, ${GOLD}, transparent)`,
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            transformOrigin: "bottom center",
            opacity: rOp,
          }} />
        );
      })}

      {/* Lueur dorée */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 52%, rgba(212,168,47,0.28) 0%, transparent 65%)", transform: `scale(${zoom})` }} />

      {/* Trophée */}
      <div style={{
        position: "absolute",
        bottom: 120, left: "50%",
        transform: `translateX(-50%) translateY(${tropY}px)`,
        width: 700, height: 900,
        opacity: tropOp, zIndex: 2,
      }}>
        <img
          src={staticFile("IMG_4488.jpeg")}
          style={{
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "center bottom",
            filter: "drop-shadow(0 0 100px rgba(212,168,47,0.55)) drop-shadow(0 50px 120px rgba(0,0,0,0.98))",
          }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: `linear-gradient(0deg, ${NAVY} 0%, transparent 100%)` }} />
      </div>

      {/* Logo WE ARE 26 */}
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", zIndex: 4, opacity: logoOp, transform: `scale(${interpolate(logoSc, [0, 1], [0.6, 1])})` }}>
        <img
          src={staticFile("IMG_4490_cutout.png")}
          style={{ width: 420, height: 220, objectFit: "contain", filter: "invert(1) drop-shadow(0 0 30px rgba(212,168,47,0.5))" }}
        />
      </div>

      {/* Texte bas */}
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 4 }}>
        <div style={{ opacity: t1Op, transform: `translateY(${t1Y}px)` }}>
          <div style={{ fontSize: 34, color: GOLD, fontFamily: "Georgia, serif", letterSpacing: 8, fontWeight: "bold" }}>LA COUPE DU MONDE</div>
        </div>
        <div style={{ opacity: t2Op, transform: `translateY(${t2Y}px)`, marginTop: 6 }}>
          <div style={{ fontSize: 22, color: SILVER, fontFamily: "Georgia, serif", letterSpacing: 6, fontStyle: "italic" }}>USA · CANADA · MEXIQUE</div>
        </div>
      </div>

    </AbsoluteFill>
  );
};

// ─── Scene 3 : Billets Excellis (175-300f) ────────────────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp    = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const logoSc  = spring({ frame: frame - 6,  fps, config: { damping: 13, stiffness: 100 } });
  const logoOp  = interpolate(frame, [4, 18],  [0, 1], { extrapolateRight: "clamp" });

  const b1Sc    = spring({ frame: frame - 22, fps, config: { damping: 10, stiffness: 160 } });
  const b1Op    = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b2Sc    = spring({ frame: frame - 34, fps, config: { damping: 10, stiffness: 160 } });
  const b2Op    = interpolate(frame, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const l1Op    = interpolate(frame, [48, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l1Y     = interpolate(frame, [48, 62], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Op    = interpolate(frame, [60, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Y     = interpolate(frame, [60, 74], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Op    = interpolate(frame, [72, 86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Y     = interpolate(frame, [72, 86], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOp = interpolate(frame, [88, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shimmerX = interpolate(frame, [28, 72], [-150, 380], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const particles = Array.from({ length: 16 }, (_, i) => ({
    x: (i * 67 + 13) % 100, y: (i * 43 + 7) % 100, delay: i * 3,
    color: i % 3 === 0 ? GOLD : i % 3 === 1 ? RED : WHITE,
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 90% 90% at 50% 50%, ${BLUE} 0%, ${NAVY} 100%)`,
      opacity: bgOp, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 38%, rgba(212,168,47,0.16) 0%, transparent 65%)" }} />

      {/* Particules */}
      {particles.map((p, i) => {
        const pOp = interpolate(frame - p.delay, [0, 8, 100, 115], [0, 0.65, 0.65, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", background: p.color, opacity: pOp, boxShadow: `0 0 8px ${p.color}`, zIndex: 1 }} />;
      })}

      {/* Logo Excellis */}
      <div style={{
        position: "absolute", top: 130, left: 0, right: 0,
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
        <div style={{ fontSize: 62, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: 9, fontWeight: "bold", textShadow: "0 4px 30px rgba(0,0,0,0.97)" }}>EXCELLIS</div>
        <div style={{ fontSize: 13, color: GOLD, letterSpacing: 9, fontFamily: "Georgia, serif" }}>C O N C I E R G E R I E</div>
        <div style={{ position: "relative", width: 300, height: 1.5, background: GOLD, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 110, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent)" }} />
        </div>
      </div>

      {/* Badges BILLETS / CATÉGORIES */}
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, zIndex: 3 }}>
        <div style={{ opacity: b1Op, transform: `scale(${interpolate(b1Sc, [0, 1], [0.7, 1])})` }}>
          <div style={{ padding: "12px 28px", background: "rgba(212,168,47,0.12)", border: `1.5px solid ${GOLD}88`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4 }}>TOUTES</div>
            <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>CATEGORIES</div>
          </div>
        </div>
        <div style={{ opacity: b2Op, transform: `scale(${interpolate(b2Sc, [0, 1], [0.7, 1])})` }}>
          <div style={{ padding: "12px 28px", background: "rgba(212,168,47,0.12)", border: `1.5px solid ${GOLD}88`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4 }}>TOUS LES</div>
            <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold" }}>MATCHS</div>
          </div>
        </div>
      </div>

      {/* CTA centré */}
      <div style={{
        position: "absolute", top: 550, bottom: 120, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", zIndex: 3,
      }}>
        <div style={{ opacity: l1Op, transform: `translateY(${l1Y}px)` }}>
          <div style={{ fontSize: 92, fontFamily: "Georgia, serif", fontStyle: "italic", color: WHITE, lineHeight: 1.0, textShadow: "0 4px 40px rgba(0,0,0,0.97)" }}>
            Viens vite
          </div>
        </div>
        <div style={{ opacity: l2Op, transform: `translateY(${l2Y}px)` }}>
          <div style={{ fontSize: 80, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, lineHeight: 1.0, textShadow: `0 0 80px rgba(212,168,47,0.9), 0 4px 40px rgba(0,0,0,0.97)` }}>
            reserver
          </div>
          <div style={{ fontSize: 80, fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, lineHeight: 1.0, textShadow: `0 0 80px rgba(212,168,47,0.9), 0 4px 40px rgba(0,0,0,0.97)` }}>
            ta place
          </div>
        </div>
        <div style={{ opacity: l3Op, transform: `translateY(${l3Y}px)`, marginTop: 12 }}>
          <div style={{ fontSize: 42, fontFamily: "Georgia, serif", color: SILVER, letterSpacing: 3, fontStyle: "italic" }}>
            sans acompte
          </div>
        </div>
      </div>

      {/* Badge bas */}
      <div style={{
        position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", zIndex: 3,
        opacity: badgeOp,
      }}>
        <div style={{ display: "inline-block", padding: "14px 48px", background: "rgba(212,168,47,0.12)", border: `1.5px solid ${GOLD}88`, borderRadius: 50 }}>
          <div style={{ fontSize: 22, color: GOLD, fontFamily: "Georgia, serif", letterSpacing: 4, fontWeight: "bold" }}>Contactez-nous</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition ─────────────────────────────────────────────────────────────
export const WorldCupTikTok = () => (
  <AbsoluteFill>
    <Sequence from={0}   durationInFrames={100}><SceneBall /></Sequence>
    <Sequence from={84}  durationInFrames={110}><SceneTrophee /></Sequence>
    <Sequence from={178} durationInFrames={122}><SceneCTA /></Sequence>
  </AbsoluteFill>
);

export default WorldCupTikTok;
