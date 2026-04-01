// RolandGarrosTikTok.jsx — v1 dynamique 10s
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
const CLAY    = "#C44010";
const GREEN   = "#1A5C35";
const WHITE   = "#FFFFFF";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const SILVER  = "#B8C8D8";

// ─── Scene 1 : iPhone qui explose (0-100f) ───────────────────────────────────
const SceneIphone = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // iPhone bounce in
  const iphoneIn = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  // iPhone zoom to fill screen
  const iphoneZoom = interpolate(frame, [60, 95], [1, 18], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  const iphoneOp   = interpolate(frame, [88, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgOp       = interpolate(frame, [70, 95],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // text above iPhone
  const tagOp = interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY  = interpolate(frame, [18, 32], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phoneScale = interpolate(iphoneIn, [0, 1], [0.3, 1]) * iphoneZoom;

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* Stade full screen visible quand l'iPhone explose */}
      <div style={{ position: "absolute", inset: 0, opacity: bgOp }}>
        <img
          src={staticFile("IMG_4455.jpeg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,10,26,0.55) 0%, rgba(5,10,26,0.2) 40%, rgba(5,10,26,0.7) 100%)" }} />
      </div>

      {/* Tag au-dessus */}
      <div style={{
        position: "absolute", top: 220, left: 0, right: 0,
        textAlign: "center", zIndex: 5,
        opacity: tagOp * interpolate(frame, [55, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${tagY}px)`,
      }}>
        <div style={{ fontSize: 20, color: CLAY, letterSpacing: 10, fontFamily: "Georgia, serif", fontWeight: "bold" }}>
          EXCELLIS CONCIERGERIE
        </div>
        <div style={{ fontSize: 16, color: SILVER, letterSpacing: 5, fontFamily: "Georgia, serif", marginTop: 4 }}>
          vous propose
        </div>
      </div>

      {/* iPhone mockup */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${phoneScale})`,
        transformOrigin: "center center",
        width: 320, height: 640,
        borderRadius: 46,
        border: "7px solid rgba(200,210,230,0.22)",
        background: NAVY,
        overflow: "hidden",
        boxShadow: "0 0 80px rgba(0,0,0,0.95), 0 0 30px rgba(26,92,53,0.3), inset 0 0 0 1px rgba(255,255,255,0.06)",
        opacity: iphoneOp,
        zIndex: 4,
      }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 110, height: 26, background: NAVY, borderRadius: "0 0 18px 18px", zIndex: 10 }} />
        {/* Stade inside */}
        <img
          src={staticFile("IMG_4455.jpeg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,10,26,0.3) 0%, rgba(5,10,26,0.1) 50%, rgba(5,10,26,0.6) 100%)" }} />
        {/* Mini RG logo text */}
        <div style={{
          position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center",
          opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontSize: 30, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, textShadow: "0 2px 12px rgba(0,0,0,0.9)", letterSpacing: 1 }}>Roland Garros</div>
          <div style={{ fontSize: 14, color: CLAY, letterSpacing: 4, fontFamily: "Georgia, serif", fontWeight: "bold" }}>2025</div>
        </div>
        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", width: 90, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2 : Stade + branding RG (85-175f) ─────────────────────────────────
const SceneStade = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp   = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const zoom   = interpolate(frame, [0, 90], [1.08, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSc = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 120 } });
  const logoOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });

  const rg1Op  = interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rg1X   = interpolate(frame, [18, 32], [-80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rg2Op  = interpolate(frame, [28, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rg2X   = interpolate(frame, [28, 42], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearOp = interpolate(frame, [40, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearSc = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", opacity: bgOp }}>
      {/* Stade — fond qui zoome lentement */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "center center" }}>
        <img
          src={staticFile("IMG_4455.jpeg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
      </div>

      {/* Overlay navy fort en haut et bas */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,10,26,0.75) 0%, rgba(5,10,26,0.1) 35%, rgba(5,10,26,0.15) 60%, rgba(5,10,26,0.88) 100%)" }} />
      {/* Vignette laterale */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(5,10,26,0.65) 100%)" }} />

      {/* Roland Garros logo */}
      <div style={{
        position: "absolute", top: 130, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: logoOp,
        transform: `scale(${interpolate(logoSc, [0, 1], [0.5, 1])})`,
        zIndex: 3,
      }}>
        <img
          src={staticFile("IMG_4459.png")}
          style={{ width: 180, height: 180, objectFit: "contain", filter: "drop-shadow(0 0 30px rgba(196,64,16,0.6))" }}
        />
      </div>

      {/* ROLAND */}
      <div style={{ position: "absolute", top: 332, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: rg1Op, transform: `translateX(${rg1X}px)` }}>
        <div style={{ fontSize: 104, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, letterSpacing: 6, lineHeight: 0.9, textShadow: "0 4px 40px rgba(0,0,0,0.95)" }}>
          ROLAND
        </div>
      </div>

      {/* GARROS */}
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", zIndex: 3, opacity: rg2Op, transform: `translateX(${rg2X}px)` }}>
        <div style={{ fontSize: 104, fontFamily: "Georgia, serif", fontWeight: "bold", color: CLAY, letterSpacing: 6, lineHeight: 0.9, textShadow: `0 0 80px rgba(196,64,16,0.8), 0 4px 40px rgba(0,0,0,0.95)` }}>
          GARROS
        </div>
      </div>

      {/* 2025 badge */}
      <div style={{
        position: "absolute", top: 572, left: 0, right: 0, textAlign: "center", zIndex: 3,
        opacity: yearOp,
        transform: `scale(${interpolate(yearSc, [0, 1], [0.6, 1])})`,
      }}>
        <div style={{
          display: "inline-block", padding: "8px 32px",
          background: `linear-gradient(135deg, ${GREEN}, #0D3D22)`,
          border: `1px solid rgba(255,255,255,0.2)`, borderRadius: 40,
        }}>
          <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: 8 }}>PARIS 2025</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 : Les joueurs (160-255f) ────────────────────────────────────────
const SceneJoueurs = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // Djokovic de la droite
  const djokSc  = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 90 } });
  const djokX   = interpolate(djokSc, [0, 1], [400, 0]);

  // Zverev de la gauche
  const zvSc    = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 90 } });
  const zvX     = interpolate(zvSc, [0, 1], [-400, 0]);

  // Textes centre
  const t1Op    = interpolate(frame, [22, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t1Sc    = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 160 } });
  const t2Op    = interpolate(frame, [34, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t3Op    = interpolate(frame, [46, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t3Y     = interpolate(frame, [46, 60], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t4Op    = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${BLUE} 60%, #0A1A10 100%)`, opacity: bgOp, overflow: "hidden" }}>
      {/* Lignes lumineuses en fond */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${10 + i * 20}%`, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, rgba(196,64,16,0.07) 30%, rgba(26,92,53,0.07) 70%, transparent)`,
        }} />
      ))}

      {/* Glow central */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(196,64,16,0.08) 0%, transparent 70%)" }} />

      {/* DJOKOVIC — droite, grand, célébrant */}
      <div style={{
        position: "absolute",
        bottom: 0, right: -60,
        width: 720, height: 900,
        transform: `translateX(${djokX}px)`,
        zIndex: 2,
      }}>
        <img
          src={staticFile("IMG_4458_cutout.png")}
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "right bottom",
            filter: "drop-shadow(0px 0px 60px rgba(196,64,16,0.4)) drop-shadow(0px 30px 80px rgba(0,0,0,0.95))",
          }}
        />
        {/* Fondu bas */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", background: "linear-gradient(0deg, rgba(5,10,26,1) 0%, transparent 100%)", zIndex: 1 }} />
      </div>

      {/* ZVEREV — gauche */}
      <div style={{
        position: "absolute",
        bottom: 0, left: -80,
        width: 620, height: 780,
        transform: `translateX(${zvX}px)`,
        zIndex: 2,
      }}>
        <img
          src={staticFile("IMG_4457_cutout.png")}
          style={{
            position: "absolute", bottom: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "left bottom",
            filter: "drop-shadow(0px 0px 40px rgba(26,92,53,0.3)) drop-shadow(0px 30px 80px rgba(0,0,0,0.95))",
          }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", background: "linear-gradient(0deg, rgba(5,10,26,1) 0%, transparent 100%)", zIndex: 1 }} />
      </div>

      {/* Textes — centre haut */}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", zIndex: 4 }}>

        {/* VOS BILLETS */}
        <div style={{
          opacity: t1Op,
          transform: `scale(${interpolate(t1Sc, [0, 1], [0.65, 1])})`,
        }}>
          <div style={{ fontSize: 96, fontFamily: "Georgia, serif", fontWeight: "bold", color: WHITE, lineHeight: 0.9, letterSpacing: -1, textShadow: "0 4px 40px rgba(0,0,0,0.97)" }}>
            VOS
          </div>
          <div style={{ fontSize: 96, fontFamily: "Georgia, serif", fontWeight: "bold", color: CLAY, lineHeight: 0.9, letterSpacing: -1, textShadow: `0 0 70px rgba(196,64,16,0.8), 0 4px 40px rgba(0,0,0,0.97)` }}>
            BILLETS
          </div>
        </div>

        {/* Ligne séparatrice */}
        <div style={{ opacity: t2Op, margin: "14px auto", width: 200, height: 2, background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />

        {/* TOUTES CATÉGORIES */}
        <div style={{ opacity: t3Op, transform: `translateY(${t3Y}px)` }}>
          <div style={{ fontSize: 28, color: WHITE, fontFamily: "Georgia, serif", letterSpacing: 4, textShadow: "0 2px 20px rgba(0,0,0,0.97)" }}>
            TOUTES CATEGORIES
          </div>
        </div>

        {/* TOUTES LES DATES */}
        <div style={{ opacity: t4Op, transform: `translateY(${t3Y}px)`, marginTop: 6 }}>
          <div style={{ fontSize: 28, color: SILVER, fontFamily: "Georgia, serif", letterSpacing: 4, fontStyle: "italic", textShadow: "0 2px 20px rgba(0,0,0,0.97)" }}>
            TOUTES LES DATES
          </div>
        </div>
      </div>

      {/* Fondu bas global */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: `linear-gradient(0deg, ${NAVY} 0%, transparent 100%)`, zIndex: 3 }} />
    </AbsoluteFill>
  );
};

// ─── Scene 4 : CTA Excellis (240-300f) ───────────────────────────────────────
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp   = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const logoSc = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 100 } });
  const logoOp = interpolate(frame, [4, 18], [0, 1], { extrapolateRight: "clamp" });
  const l1Op   = interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l1Y    = interpolate(frame, [16, 30], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Op   = interpolate(frame, [26, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2Y    = interpolate(frame, [26, 40], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Op   = interpolate(frame, [36, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l3Y    = interpolate(frame, [36, 50], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOp = interpolate(frame, [48, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmerX = interpolate(frame, [22, 55], [-150, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Particules
  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: (i * 67 + 13) % 100,
    y: (i * 43 + 7) % 100,
    delay: i * 3,
    color: i % 3 === 0 ? CLAY : i % 3 === 1 ? GREEN : GOLD,
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 90% 90% at 50% 50%, ${BLUE} 0%, ${NAVY} 100%)`,
      opacity: bgOp, overflow: "hidden",
    }}>
      {/* Particules */}
      {particles.map((p, i) => {
        const pOp = interpolate(frame - p.delay, [0, 8, 50, 60], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", background: p.color, opacity: pOp, boxShadow: `0 0 8px ${p.color}`, zIndex: 1 }} />;
      })}

      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(26,92,53,0.18) 0%, rgba(196,64,16,0.08) 50%, transparent 75%)" }} />

      {/* Logo Excellis */}
      <div style={{
        position: "absolute", top: 160, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        opacity: logoOp,
        transform: `scale(${interpolate(logoSc, [0, 1], [0.65, 1])})`,
        zIndex: 3,
      }}>
        <svg width="82" height="48" viewBox="0 0 100 56" fill="none">
          <polygon points="10,50 22,18 36,38 50,8 64,38 78,18 90,50" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="47" width="84" height="9" rx="4.5" fill={GOLD} />
          <circle cx="10" cy="18" r="5" fill={GOLD_LT} />
          <circle cx="50" cy="8"  r="5" fill={GOLD_LT} />
          <circle cx="90" cy="18" r="5" fill={GOLD_LT} />
        </svg>
        <div style={{ fontSize: 54, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: 9, fontWeight: "bold", textShadow: "0 4px 30px rgba(0,0,0,0.95)" }}>EXCELLIS</div>
        <div style={{ fontSize: 12, color: GOLD, letterSpacing: 9, fontFamily: "Georgia, serif" }}>C O N C I E R G E R I E</div>
        <div style={{ position: "relative", width: 280, height: 1.5, background: GOLD, overflow: "hidden", marginTop: 4 }}>
          <div style={{ position: "absolute", left: shimmerX, top: 0, bottom: 0, width: 110, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }} />
        </div>
      </div>

      {/* CTA 3 lignes */}
      <div style={{ position: "absolute", top: 420, left: 40, right: 40, textAlign: "center", zIndex: 3 }}>
        <div style={{ opacity: l1Op, transform: `translateY(${l1Y}px)` }}>
          <div style={{ fontSize: 48, fontFamily: "Georgia, serif", fontStyle: "italic", color: WHITE, lineHeight: 1.1, textShadow: "0 3px 24px rgba(0,0,0,0.97)" }}>
            Viens vite
          </div>
        </div>
        <div style={{ opacity: l2Op, transform: `translateY(${l2Y}px)` }}>
          <div style={{ fontSize: 48, fontFamily: "Georgia, serif", fontStyle: "italic", color: CLAY, lineHeight: 1.1, textShadow: `0 0 50px rgba(196,64,16,0.7), 0 3px 24px rgba(0,0,0,0.97)` }}>
            reserver ta place
          </div>
        </div>
        <div style={{ opacity: l3Op, transform: `translateY(${l3Y}px)`, marginTop: 8 }}>
          <div style={{ fontSize: 30, fontFamily: "Georgia, serif", color: SILVER, letterSpacing: 2, fontStyle: "italic", textShadow: "0 2px 20px rgba(0,0,0,0.97)" }}>
            sans acompte
          </div>
        </div>
      </div>

      {/* Badge bas */}
      <div style={{
        position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center", zIndex: 3,
        opacity: badgeOp,
        transform: `translateY(${interpolate(frame, [48, 58], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{
          display: "inline-block", padding: "14px 48px",
          background: `linear-gradient(135deg, rgba(26,92,53,0.35), rgba(26,92,53,0.10))`,
          border: `1.5px solid rgba(26,92,53,0.7)`, borderRadius: 50,
        }}>
          <div style={{ fontSize: 22, color: WHITE, fontFamily: "Georgia, serif", letterSpacing: 4, fontWeight: "bold" }}>
            Contactez-nous
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition principale ───────────────────────────────────────────────────
export const RolandGarrosTikTok = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={105}>
      <SceneIphone />
    </Sequence>
    <Sequence from={88} durationInFrames={90}>
      <SceneStade />
    </Sequence>
    <Sequence from={163} durationInFrames={95}>
      <SceneJoueurs />
    </Sequence>
    <Sequence from={243} durationInFrames={57}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);

export default RolandGarrosTikTok;
