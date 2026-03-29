import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const NAVY   = "#0D2045";
const NAVY2  = "#162d5e";
const GOLD   = "#D4A82F";
const WHITE  = "#FFFFFF";
const LIGHT  = "#E8EDF5";
const GREEN  = "#2ECC71";

// ── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const fadeIn = (frame: number, start: number, dur = 20) =>
  interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  });

const slideUp = (frame: number, start: number, fps: number, dist = 50) => {
  const p = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 130 } });
  return `translateY(${interpolate(p, [0, 1], [dist, 0])}px)`;
};

const slideRight = (frame: number, start: number, fps: number, dist = 80) => {
  const p = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 100 } });
  return `translateX(${interpolate(p, [0, 1], [dist, 0])}px)`;
};

// ── Écran 1 : Intro logo (frames 0–60 = 2 s) ─────────────────────────────────
const IntroScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleP = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const scale  = interpolate(scaleP, [0, 1], [0.4, 1]);
  const opacity = fadeIn(frame, 0, 18);

  // Halo doré pulsant
  const haloScale = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{ background: NAVY, alignItems: "center", justifyContent: "center", overflow: "hidden" }}
    >
      {/* Fond radial */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 65% at 50% 50%, #1e3d7a 0%, ${NAVY} 70%)` }} />

      {/* Halo */}
      <div style={{
        position: "absolute",
        width: 340, height: 340, borderRadius: "50%",
        border: `2px solid rgba(212,168,47,0.18)`,
        transform: `scale(${haloScale})`,
      }} />
      <div style={{
        position: "absolute",
        width: 420, height: 420, borderRadius: "50%",
        border: `1px solid rgba(212,168,47,0.08)`,
        transform: `scale(${haloScale * 1.05})`,
      }} />

      {/* Logo */}
      <div style={{ opacity, transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
        <svg width="90" height="55" viewBox="0 0 100 60" fill="none">
          <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
          <circle cx="10" cy="20" r="5" fill={GOLD} />
          <circle cx="50" cy="10" r="5" fill={GOLD} />
          <circle cx="90" cy="20" r="5" fill={GOLD} />
        </svg>
        <div style={{ fontSize: 80, fontFamily: "Georgia, serif", color: WHITE, lineHeight: 1, marginTop: -8 }}>E</div>
        <div style={{ fontSize: 30, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "7px", fontWeight: "bold" }}>EXCELLIS</div>
        <div style={{ fontSize: 14, color: GOLD, letterSpacing: "9px", fontFamily: "Georgia, serif" }}>P R I V I L È G E</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Composant iPhone ─────────────────────────────────────────────────────────
interface IPhoneMessage {
  text: string;
  icon: string;
  color: string;
  frame: number;
}

const IPhoneMockup: React.FC<{ messages: IPhoneMessage[]; globalFrame: number }> = ({ messages, globalFrame }) => {
  const { fps } = useVideoConfig();
  const W = 260, H = 520;
  const R = 36;
  const BORDER = 8;
  const screenBg = "#0a0a1a";

  return (
    <div style={{
      width: W, height: H,
      borderRadius: R,
      background: "#1a1a1a",
      border: `${BORDER}px solid #2a2a2a`,
      boxShadow: `0 0 0 1px #444, 0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,47,0.12)`,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Encoche (notch) */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 100, height: 24, background: "#1a1a1a", borderRadius: "0 0 18px 18px",
        zIndex: 10,
      }} />

      {/* Écran */}
      <div style={{
        flex: 1, background: screenBg,
        borderRadius: R - BORDER,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        padding: "36px 18px 20px",
        gap: 12,
        overflow: "hidden",
      }}>
        {/* En-tête app */}
        <div style={{
          opacity: fadeIn(globalFrame, 5, 15),
          display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
        }}>
          <svg width="20" height="14" viewBox="0 0 100 60" fill="none">
            <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} />
          </svg>
          <span style={{ color: GOLD, fontSize: 12, fontFamily: "Georgia, serif", letterSpacing: "3px" }}>EXCELLIS</span>
        </div>

        {/* Séparateur */}
        <div style={{ width: "80%", height: 1, background: "rgba(212,168,47,0.2)", marginBottom: 4, opacity: fadeIn(globalFrame, 8, 12) }} />

        {/* Messages */}
        {messages.map((msg) => {
          const appeared = globalFrame >= msg.frame;
          const op = appeared ? fadeIn(globalFrame, msg.frame, 15) : 0;
          const ty = appeared
            ? interpolate(
                spring({ frame: globalFrame - msg.frame, fps, config: { damping: 18, stiffness: 120 } }),
                [0, 1], [30, 0]
              )
            : 30;

          return (
            <div key={msg.text} style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 14,
              padding: "12px 14px",
              border: `1px solid rgba(212,168,47,0.15)`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {/* Icône */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `rgba(${msg.color},0.15)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                {msg.icon}
              </div>
              {/* Texte */}
              <div style={{ color: WHITE, fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.4 }}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Barre de statut fictive */}
        <div style={{
          marginTop: "auto",
          opacity: fadeIn(globalFrame, 10, 20),
          display: "flex", gap: 6, alignItems: "center",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "1px" }}>Service disponible 24/7</span>
        </div>
      </div>

      {/* Bouton home */}
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        width: 100, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.3)",
      }} />
    </div>
  );
};

// ── Écran 2 : iPhone + messages (frames 60–255 = 6.5 s) ──────────────────────
const IPhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrée de l'iPhone depuis la droite
  const phoneP = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const phoneX  = interpolate(phoneP, [0, 1], [600, 0]);
  const phoneOp = fadeIn(frame, 0, 20);

  // Entrée du texte de gauche
  const titleOp = fadeIn(frame, 15, 20);
  const titleTx = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 18, stiffness: 110 } }),
    [0, 1], [-80, 0]
  );

  const messages: IPhoneMessage[] = [
    { text: "Sourcing 100% fiable & vérifié",        icon: "✅", color: "46,204,113",  frame: 40 },
    { text: "Clients déjà satisfaits de nos services", icon: "⭐", color: "212,168,47", frame: 85 },
    { text: "Satisfait ou remboursé, garanti",        icon: "🛡️", color: "52,152,219", frame: 130 },
  ];

  return (
    <AbsoluteFill style={{
      background: NAVY,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 80,
      padding: "0 80px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${NAVY2} 0%, ${NAVY} 75%)` }} />

      {/* Texte gauche */}
      <div style={{
        opacity: titleOp,
        transform: `translateX(${titleTx}px)`,
        flex: 1, zIndex: 1,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ color: GOLD, fontSize: 12, letterSpacing: "5px", fontFamily: "Georgia, serif" }}>POURQUOI NOUS ?</div>
        <div style={{ color: WHITE, fontSize: 36, fontFamily: "Georgia, serif", lineHeight: 1.3, fontWeight: "bold" }}>
          Une expérience<br />
          <span style={{ color: GOLD }}>sur mesure</span>,<br />
          à chaque instant.
        </div>
        <div style={{ width: 50, height: 2, background: GOLD }} />
        <div style={{ color: LIGHT, fontSize: 15, opacity: 0.7, lineHeight: 1.6, maxWidth: 340 }}>
          Conciergerie · Événementiel · Accès VIP<br />
          Votre satisfaction, notre priorité absolue.
        </div>
      </div>

      {/* iPhone */}
      <div style={{
        opacity: phoneOp,
        transform: `translateX(${phoneX}px)`,
        zIndex: 1, flexShrink: 0,
      }}>
        <IPhoneMockup messages={messages} globalFrame={frame} />
      </div>
    </AbsoluteFill>
  );
};

// ── Écran 3 : Badges de confiance (frames 255–390 = 4.5 s) ───────────────────
interface Badge {
  icon: string;
  title: string;
  sub: string;
  delay: number;
}

const TrustScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badges: Badge[] = [
    { icon: "✅", title: "Sourcing fiable",          sub: "Partenaires triés sur le volet",    delay: 10 },
    { icon: "🏆", title: "Clients satisfaits",        sub: "Des centaines d'expériences réussies", delay: 35 },
    { icon: "🛡️", title: "Satisfait ou remboursé",   sub: "Zéro risque, 100% confiance",      delay: 60 },
    { icon: "⚡", title: "Réactivité 24h/24",         sub: "Disponible quand vous avez besoin", delay: 85 },
  ];

  const titleOp = fadeIn(frame, 0, 20);

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      padding: "0 100px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${NAVY2} 0%, ${NAVY} 80%)` }} />

      {/* Titre */}
      <div style={{ opacity: titleOp, zIndex: 1, textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 12, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 12 }}>NOS ENGAGEMENTS</div>
        <div style={{ color: WHITE, fontSize: 32, fontFamily: "Georgia, serif", fontWeight: "bold" }}>
          Ce qui fait la différence Excellis
        </div>
      </div>

      {/* Grille 2×2 */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
        width: "100%", maxWidth: 900, zIndex: 1,
      }}>
        {badges.map((b) => {
          const op = fadeIn(frame, b.delay, 18);
          const ty = interpolate(
            spring({ frame: frame - b.delay, fps, config: { damping: 20, stiffness: 120 } }),
            [0, 1], [40, 0]
          );
          return (
            <div key={b.title} style={{
              opacity: op, transform: `translateY(${ty}px)`,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,168,47,0.2)",
              borderRadius: 16,
              padding: "24px 28px",
              display: "flex", alignItems: "flex-start", gap: 18,
            }}>
              <div style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
              <div>
                <div style={{ color: WHITE, fontSize: 18, fontFamily: "Georgia, serif", fontWeight: "bold", marginBottom: 6 }}>{b.title}</div>
                <div style={{ color: LIGHT, fontSize: 13, opacity: 0.65, lineHeight: 1.5 }}>{b.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Écran 4 : Slogan final (frames 390–450 = 2 s) ────────────────────────────
const SloganScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allOp = fadeIn(frame, 0, 25);
  const lineW = interpolate(frame, [15, 45], [0, 260], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const });
  const textTy = interpolate(
    spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 110 } }),
    [0, 1], [40, 0]
  );

  return (
    <AbsoluteFill style={{
      background: NAVY, opacity: allOp,
      alignItems: "center", justifyContent: "center", flexDirection: "column",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 70% at 50% 40%, #1e3d7a 0%, ${NAVY} 75%)` }} />

      {/* Lignes latérales */}
      <div style={{ position: "absolute", left: 0, top: "50%", width: lineW / 2, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, zIndex: 1 }} />
      <div style={{ position: "absolute", right: 0, top: "50%", width: lineW / 2, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, zIndex: 1 }} />

      <div style={{ zIndex: 1, textAlign: "center", transform: `translateY(${textTy}px)`, padding: "0 80px" }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 20 }}>NOTRE PROMESSE</div>
        <div style={{ fontSize: 34, color: WHITE, fontFamily: "Georgia, serif", lineHeight: 1.45, fontStyle: "italic", maxWidth: 700 }}>
          "Votre satisfaction fait<br />de vous notre priorité"
        </div>
        <div style={{ width: 60, height: 2, background: GOLD, margin: "28px auto 24px" }} />
        <div style={{ fontSize: 24, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "5px" }}>EXCELLIS</div>
        <div style={{ fontSize: 12, color: GOLD, letterSpacing: "7px", marginTop: 6 }}>P R I V I L È G E</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Composition principale : 15 s @ 30 fps = 450 frames ──────────────────────
export const ExcellisVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scène 1 : Logo intro — 2 s */}
      <Sequence from={0} durationInFrames={60}>
        <IntroScreen />
      </Sequence>

      {/* Scène 2 : iPhone + raisons — 6.5 s */}
      <Sequence from={60} durationInFrames={195}>
        <IPhoneScreen />
      </Sequence>

      {/* Scène 3 : Badges de confiance — 4.5 s */}
      <Sequence from={255} durationInFrames={135}>
        <TrustScreen />
      </Sequence>

      {/* Scène 4 : Slogan final — 2 s */}
      <Sequence from={390} durationInFrames={60}>
        <SloganScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
