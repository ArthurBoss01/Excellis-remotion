import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const NAVY  = "#0D2045";
const NAVY2 = "#162d5e";
const GOLD  = "#D4A82F";
const WHITE = "#FFFFFF";
const LIGHT = "#E8EDF5";
const GREEN = "#2ECC71";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fadeIn = (frame: number, start: number, dur = 20) =>
  interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  });

const useSlideUp = (startFrame: number, dist = 60) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - startFrame, fps, config: { damping: 20, stiffness: 130 } });
  return {
    opacity: fadeIn(frame, startFrame, 18),
    transform: `translateY(${interpolate(p, [0, 1], [dist, 0])}px)`,
  };
};

// ── Scène 1 : Logo intro (0–75 frames = 2.5 s) ───────────────────────────────
const IntroScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleP  = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const scale   = interpolate(scaleP, [0, 1], [0.3, 1]);
  const opacity = fadeIn(frame, 0, 20);
  const halo    = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ background: NAVY, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 50%, #1e3d7a 0%, ${NAVY} 70%)` }} />

      {/* Halos */}
      {[380, 500, 620].map((size, i) => (
        <div key={size} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: `${i === 0 ? 2 : 1}px solid rgba(212,168,47,${0.18 - i * 0.05})`,
          transform: `scale(${halo * (1 + i * 0.03)})`,
        }} />
      ))}

      {/* Logo */}
      <div style={{ opacity, transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 1 }}>
        <svg width="110" height="68" viewBox="0 0 100 60" fill="none">
          <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
          <circle cx="10" cy="20" r="5" fill={GOLD} />
          <circle cx="50" cy="10" r="5" fill={GOLD} />
          <circle cx="90" cy="20" r="5" fill={GOLD} />
        </svg>
        <div style={{ fontSize: 110, fontFamily: "Georgia, serif", color: WHITE, lineHeight: 1, marginTop: -12 }}>E</div>
        <div style={{ fontSize: 38, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "9px", fontWeight: "bold" }}>EXCELLIS</div>
        <div style={{ fontSize: 18, color: GOLD, letterSpacing: "11px", fontFamily: "Georgia, serif" }}>P R I V I L È G E</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 2 : Texte accroche + iPhone (75–270 frames = 6.5 s) ────────────────
interface IPhoneMessage { text: string; icon: string; frame: number }

const IPhoneMockup: React.FC<{ messages: IPhoneMessage[]; gf: number }> = ({ messages, gf }) => {
  const { fps } = useVideoConfig();
  const W = 420, H = 760, R = 52, BORDER = 10;

  return (
    <div style={{
      width: W, height: H, borderRadius: R,
      background: "#1c1c1e",
      border: `${BORDER}px solid #2c2c2e`,
      boxShadow: `0 0 0 1px #444, 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(212,168,47,0.15)`,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Notch dynamique island */}
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        width: 120, height: 30, background: "#1c1c1e", borderRadius: 20, zIndex: 10,
      }} />

      {/* Écran */}
      <div style={{
        flex: 1, background: "#0a0a1a",
        borderRadius: R - BORDER,
        display: "flex", flexDirection: "column",
        padding: "52px 22px 28px",
        gap: 16, overflow: "hidden",
      }}>
        {/* Header app */}
        <div style={{ opacity: fadeIn(gf, 5, 15), display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <svg width="22" height="14" viewBox="0 0 100 60" fill="none">
            <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} />
          </svg>
          <span style={{ color: GOLD, fontSize: 14, fontFamily: "Georgia, serif", letterSpacing: "4px" }}>EXCELLIS</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>En ligne</span>
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ width: "100%", height: 1, background: "rgba(212,168,47,0.2)", opacity: fadeIn(gf, 8, 12) }} />

        {/* Messages */}
        {messages.map((msg) => {
          const appeared = gf >= msg.frame;
          const op = appeared ? fadeIn(gf, msg.frame, 15) : 0;
          const ty = appeared
            ? interpolate(spring({ frame: gf - msg.frame, fps, config: { damping: 18, stiffness: 120 } }), [0, 1], [35, 0])
            : 35;

          return (
            <div key={msg.text} style={{
              opacity: op, transform: `translateY(${ty}px)`,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 18, padding: "16px 18px",
              border: "1px solid rgba(212,168,47,0.18)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: "rgba(212,168,47,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>{msg.icon}</div>
              <div style={{ color: WHITE, fontSize: 16, fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{msg.text}</div>
            </div>
          );
        })}

        {/* Indicateur disponibilité */}
        <div style={{
          marginTop: "auto", opacity: fadeIn(gf, 12, 20),
          display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "1px" }}>Service disponible 24h/24 · 7j/7</span>
        </div>
      </div>

      {/* Barre home */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
    </div>
  );
};

const IPhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useSlideUp(0, 70);
  const phoneP    = spring({ frame: frame - 20, fps, config: { damping: 16, stiffness: 90 } });
  const phoneOp   = fadeIn(frame, 20, 20);
  const phoneY    = interpolate(phoneP, [0, 1], [120, 0]);

  const messages: IPhoneMessage[] = [
    { text: "Sourcing 100% fiable & vérifié",          icon: "✅", frame: 45 },
    { text: "Clients déjà satisfaits de nos services", icon: "⭐", frame: 90 },
    { text: "Satisfait ou remboursé, garanti",         icon: "🛡️", frame: 135 },
  ];

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 100,
      gap: 60,
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${NAVY2} 0%, ${NAVY} 70%)` }} />

      {/* Titre accroche */}
      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center", padding: "0 60px" }}>
        <div style={{ color: GOLD, fontSize: 16, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 16 }}>POURQUOI NOUS ?</div>
        <div style={{ color: WHITE, fontSize: 52, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.25 }}>
          Une expérience<br />
          <span style={{ color: GOLD }}>sur mesure</span>,<br />
          à chaque instant.
        </div>
        <div style={{ width: 60, height: 3, background: GOLD, margin: "20px auto 0" }} />
      </div>

      {/* iPhone */}
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)`, zIndex: 1 }}>
        <IPhoneMockup messages={messages} gf={frame} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 3 : Badges confiance (270–405 frames = 4.5 s) ──────────────────────
const TrustScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const badges = [
    { icon: "✅", title: "Sourcing fiable",         sub: "Partenaires triés sur le volet",        delay: 10 },
    { icon: "🏆", title: "Clients satisfaits",       sub: "Des centaines d'expériences réussies",  delay: 40 },
    { icon: "🛡️", title: "Satisfait ou remboursé",  sub: "Zéro risque, 100% confiance",           delay: 70 },
    { icon: "⚡", title: "Réactivité 24h/24",        sub: "Disponible quand vous avez besoin",     delay: 100 },
  ];

  const titleAnim = useSlideUp(0, 60);

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 48,
      padding: "0 60px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${NAVY2} 0%, ${NAVY} 80%)` }} />

      {/* Titre */}
      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 16, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 16 }}>NOS ENGAGEMENTS</div>
        <div style={{ color: WHITE, fontSize: 46, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.25 }}>
          Ce qui fait la<br />
          <span style={{ color: GOLD }}>différence</span> Excellis
        </div>
      </div>

      {/* Badges verticaux */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%", zIndex: 1 }}>
        {badges.map((b) => {
          const anim = useSlideUp(b.delay, 50);
          return (
            <div key={b.title} style={{
              ...anim,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,168,47,0.22)",
              borderRadius: 20,
              padding: "28px 32px",
              display: "flex", alignItems: "center", gap: 24,
            }}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ color: WHITE, fontSize: 24, fontFamily: "Georgia, serif", fontWeight: "bold", marginBottom: 6 }}>{b.title}</div>
                <div style={{ color: LIGHT, fontSize: 16, opacity: 0.65, lineHeight: 1.4 }}>{b.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 4 : Slogan final (405–450 frames = 1.5 s) ──────────────────────────
const SloganScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const allOp  = fadeIn(frame, 0, 12);
  const lineW  = interpolate(frame, [5, 30], [0, 340], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const });
  const textAnim = useSlideUp(5, 40);

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: allOp, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 45%, #1e3d7a 0%, ${NAVY} 75%)` }} />

      <div style={{ position: "absolute", top: "50%", left: 0, width: lineW / 2, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", right: 0, width: lineW / 2, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, zIndex: 1 }} />

      <div style={{ ...textAnim, zIndex: 1, textAlign: "center", padding: "0 80px" }}>
        <div style={{ fontSize: 15, color: GOLD, letterSpacing: "7px", fontFamily: "Georgia, serif", marginBottom: 24 }}>NOTRE PROMESSE</div>
        <div style={{ fontSize: 46, color: WHITE, fontFamily: "Georgia, serif", lineHeight: 1.4, fontStyle: "italic" }}>
          "Votre satisfaction<br />
          fait de vous<br />
          notre priorité"
        </div>
        <div style={{ width: 70, height: 3, background: GOLD, margin: "36px auto 32px" }} />
        <div style={{ fontSize: 32, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "7px" }}>EXCELLIS</div>
        <div style={{ fontSize: 16, color: GOLD, letterSpacing: "9px", marginTop: 10 }}>P R I V I L È G E</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Composition principale 1080×1920, 15 s @ 30 fps ──────────────────────────
export const ExcellisVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0}   durationInFrames={75}><IntroScreen /></Sequence>
      <Sequence from={75}  durationInFrames={195}><IPhoneScreen /></Sequence>
      <Sequence from={270} durationInFrames={135}><TrustScreen /></Sequence>
      <Sequence from={405} durationInFrames={45}><SloganScreen /></Sequence>
    </AbsoluteFill>
  );
};
