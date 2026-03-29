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
const RED   = "#E74C3C";

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

// ── Scène 1 : Intro SOLD OUT (0–75 frames = 2.5 s) ───────────────────────────
const IntroScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleP   = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const scale    = interpolate(scaleP, [0, 1], [0.3, 1]);
  const opacity  = fadeIn(frame, 0, 18);
  const halo     = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);

  // Tagline qui arrive après le logo
  const tagOp = fadeIn(frame, 35, 20);
  const tagTy = interpolate(
    spring({ frame: frame - 35, fps, config: { damping: 18, stiffness: 110 } }),
    [0, 1], [30, 0]
  );

  return (
    <AbsoluteFill style={{ background: NAVY, alignItems: "center", justifyContent: "center", overflow: "hidden", flexDirection: "column", gap: 40 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 50%, #1e3d7a 0%, ${NAVY} 70%)` }} />

      {[380, 500, 620].map((size, i) => (
        <div key={size} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: `${i === 0 ? 2 : 1}px solid rgba(212,168,47,${0.18 - i * 0.05})`,
          transform: `scale(${halo * (1 + i * 0.03)})`,
        }} />
      ))}

      {/* Logo */}
      <div style={{ opacity, transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 1 }}>
        <svg width="90" height="56" viewBox="0 0 100 60" fill="none">
          <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
          <circle cx="10" cy="20" r="5" fill={GOLD} />
          <circle cx="50" cy="10" r="5" fill={GOLD} />
          <circle cx="90" cy="20" r="5" fill={GOLD} />
        </svg>
        <div style={{ fontSize: 90, fontFamily: "Georgia, serif", color: WHITE, lineHeight: 1, marginTop: -10 }}>E</div>
        <div style={{ fontSize: 32, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "8px", fontWeight: "bold" }}>EXCELLIS</div>
        <div style={{ fontSize: 15, color: GOLD, letterSpacing: "10px", fontFamily: "Georgia, serif" }}>P R I V I L È G E</div>
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagOp, transform: `translateY(${tagTy}px)`, zIndex: 1, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 22, color: LIGHT, fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: "2px", opacity: 0.85 }}>
          L'accès à l'inaccessible.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 2 : iPhone + messages conciergerie (75–300 frames = 7.5 s) ──────────

interface IPhoneMessage {
  text: string;
  sub?: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  frame: number;
}

const IPhoneMockup: React.FC<{ messages: IPhoneMessage[]; gf: number }> = ({ messages, gf }) => {
  const { fps } = useVideoConfig();
  const W = 560, H = 900, R = 56, BORDER = 12;

  return (
    <div style={{
      width: W, height: H, borderRadius: R,
      background: "#1c1c1e",
      border: `${BORDER}px solid #2c2c2e`,
      boxShadow: `0 0 0 1px #444, 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(212,168,47,0.18)`,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Dynamic island */}
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        width: 110, height: 28, background: "#1c1c1e", borderRadius: 20, zIndex: 10,
      }} />

      {/* Écran */}
      <div style={{
        flex: 1, background: "#07071a",
        borderRadius: R - BORDER,
        display: "flex", flexDirection: "column",
        padding: "48px 18px 22px",
        gap: 11, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ opacity: fadeIn(gf, 5, 15), display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <svg width="18" height="12" viewBox="0 0 100 60" fill="none">
            <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} />
          </svg>
          <span style={{ color: GOLD, fontSize: 13, fontFamily: "Georgia, serif", letterSpacing: "4px" }}>EXCELLIS</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>En ligne</span>
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "rgba(212,168,47,0.2)", opacity: fadeIn(gf, 8, 12), marginBottom: 2 }} />

        {/* Messages */}
        {messages.map((msg) => {
          const appeared = gf >= msg.frame;
          const op = appeared ? fadeIn(gf, msg.frame, 14) : 0;
          const ty = appeared
            ? interpolate(spring({ frame: gf - msg.frame, fps, config: { damping: 18, stiffness: 125 } }), [0, 1], [32, 0])
            : 32;

          return (
            <div key={msg.text} style={{
              opacity: op, transform: `translateY(${ty}px)`,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16, padding: "12px 14px",
              border: "1px solid rgba(212,168,47,0.15)",
              display: "flex", alignItems: "center", gap: 13,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(212,168,47,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>{msg.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: WHITE, fontSize: 14, fontFamily: "Georgia, serif", lineHeight: 1.35 }}>{msg.text}</div>
                {msg.sub && <div style={{ color: LIGHT, fontSize: 11, opacity: 0.55, marginTop: 3 }}>{msg.sub}</div>}
              </div>
              {msg.badge && (
                <div style={{
                  background: msg.badgeColor ?? GOLD,
                  borderRadius: 8, padding: "3px 8px", flexShrink: 0,
                  fontSize: 10, fontWeight: "bold", color: NAVY, letterSpacing: "0.5px",
                }}>{msg.badge}</div>
              )}
            </div>
          );
        })}

        {/* Disponibilité */}
        <div style={{
          marginTop: "auto", opacity: fadeIn(gf, 15, 20),
          display: "flex", gap: 7, alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.5px" }}>Disponible 24h/24 · 7j/7</span>
        </div>
      </div>

      {/* Barre home */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 120, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.25)" }} />
    </div>
  );
};

const IPhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useSlideUp(0, 70);
  const phoneP    = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 88 } });
  const phoneOp   = fadeIn(frame, 15, 20);
  const phoneY    = interpolate(phoneP, [0, 1], [130, 0]);

  const messages: IPhoneMessage[] = [
    {
      text: "Événements SOLD OUT ? On s'en occupe.",
      sub: "Accès garantis aux soirées les plus demandées",
      icon: "🎟️", badge: "SOLD OUT", badgeColor: RED,
      frame: 30,
    },
    {
      text: "Loges VIP · Galas · Red Carpets",
      sub: "Places premium introuvables au grand public",
      icon: "👑", badge: "VIP",
      frame: 60,
    },
    {
      text: "Avant-premières & soirées sur invitation",
      sub: "Concerts, matchs, fashion weeks…",
      icon: "🌟",
      frame: 90,
    },
    {
      text: "Sourcing 100% fiable & vérifié",
      sub: "Partenaires triés sur le volet, zéro arnaque",
      icon: "✅",
      frame: 130,
    },
    {
      text: "Des centaines de clients satisfaits",
      sub: "Expériences livrées, promesses tenues",
      icon: "⭐",
      frame: 160,
    },
    {
      text: "Satisfait ou remboursé — sans discussion",
      sub: "Zéro risque, 100% confiance",
      icon: "🛡️",
      frame: 190,
    },
  ];

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 60,
      gap: 36,
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 55% at 50% 25%, ${NAVY2} 0%, ${NAVY} 70%)` }} />

      {/* Headline */}
      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center", padding: "0 55px" }}>
        <div style={{ color: GOLD, fontSize: 15, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 14 }}>
          CONCIERGERIE PRIVÉE
        </div>
        <div style={{ color: WHITE, fontSize: 42, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.2 }}>
          Les événements<br />
          <span style={{ color: RED, fontStyle: "italic" }}>SOLD OUT</span> ?<br />
          <span style={{ color: GOLD }}>Plus un obstacle.</span>
        </div>
        <div style={{ width: 60, height: 3, background: GOLD, margin: "18px auto 0" }} />
      </div>

      {/* iPhone */}
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)`, zIndex: 1 }}>
        <IPhoneMockup messages={messages} gf={frame} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 3 : Badges confiance (300–405 frames = 3.5 s) ──────────────────────
const TrustScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const badges = [
    { icon: "🎟️", title: "Accès événements exclusifs",  sub: "SOLD OUT n'est plus dans votre vocabulaire",  delay: 5  },
    { icon: "👑", title: "Service conciergerie VIP",     sub: "Une équipe dédiée à votre service",           delay: 30 },
    { icon: "✅", title: "Sourcing 100% fiable",         sub: "Partenaires certifiés, aucune mauvaise surprise", delay: 55 },
    { icon: "🛡️", title: "Satisfait ou remboursé",      sub: "Zéro risque, engagement total",               delay: 80 },
  ];

  const titleAnim = useSlideUp(0, 60);

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      padding: "0 55px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${NAVY2} 0%, ${NAVY} 80%)` }} />

      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: "6px", fontFamily: "Georgia, serif", marginBottom: 14 }}>NOS ENGAGEMENTS</div>
        <div style={{ color: WHITE, fontSize: 42, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.25 }}>
          Ce qui fait la<br /><span style={{ color: GOLD }}>différence</span> Excellis
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%", zIndex: 1 }}>
        {badges.map((b) => {
          const anim = useSlideUp(b.delay, 50);
          return (
            <div key={b.title} style={{
              ...anim,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,168,47,0.22)",
              borderRadius: 20, padding: "24px 28px",
              display: "flex", alignItems: "center", gap: 22,
            }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ color: WHITE, fontSize: 22, fontFamily: "Georgia, serif", fontWeight: "bold", marginBottom: 5 }}>{b.title}</div>
                <div style={{ color: LIGHT, fontSize: 14, opacity: 0.65, lineHeight: 1.4 }}>{b.sub}</div>
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
  const allOp    = fadeIn(frame, 0, 12);
  const lineW    = interpolate(frame, [5, 30], [0, 340], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const });
  const textAnim = useSlideUp(5, 40);

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: allOp, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 45%, #1e3d7a 0%, ${NAVY} 75%)` }} />
      <div style={{ position: "absolute", top: "50%", left: 0, width: lineW / 2, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", right: 0, width: lineW / 2, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, zIndex: 1 }} />

      <div style={{ ...textAnim, zIndex: 1, textAlign: "center", padding: "0 75px" }}>
        <div style={{ fontSize: 14, color: GOLD, letterSpacing: "7px", fontFamily: "Georgia, serif", marginBottom: 22 }}>NOTRE PROMESSE</div>
        <div style={{ fontSize: 44, color: WHITE, fontFamily: "Georgia, serif", lineHeight: 1.4, fontStyle: "italic" }}>
          "Votre satisfaction<br />fait de vous<br />notre priorité"
        </div>
        <div style={{ width: 65, height: 3, background: GOLD, margin: "30px auto 28px" }} />
        <div style={{ fontSize: 30, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "7px" }}>EXCELLIS</div>
        <div style={{ fontSize: 14, color: GOLD, letterSpacing: "9px", marginTop: 10 }}>P R I V I L È G E</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Composition principale 1080×1920, 15 s @ 30 fps = 450 frames ─────────────
export const ExcellisVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0}   durationInFrames={75}><IntroScreen /></Sequence>
      <Sequence from={75}  durationInFrames={225}><IPhoneScreen /></Sequence>
      <Sequence from={300} durationInFrames={105}><TrustScreen /></Sequence>
      <Sequence from={405} durationInFrames={45}><SloganScreen /></Sequence>
    </AbsoluteFill>
  );
};
