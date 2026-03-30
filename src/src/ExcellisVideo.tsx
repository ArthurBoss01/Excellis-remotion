import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
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

// ── Scène 1 : Intro logo (0–75 frames = 2.5 s) ───────────────────────────────
const IntroScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleP  = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const scale   = interpolate(scaleP, [0, 1], [0.3, 1]);
  const opacity = fadeIn(frame, 0, 18);
  const halo    = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);

  const tagOp = fadeIn(frame, 38, 20);
  const tagTy = interpolate(
    spring({ frame: frame - 38, fps, config: { damping: 18, stiffness: 110 } }),
    [0, 1], [40, 0]
  );

  return (
    <AbsoluteFill style={{ background: NAVY, alignItems: "center", justifyContent: "center", overflow: "hidden", flexDirection: "column", gap: 50 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 50%, #1e3d7a 0%, ${NAVY} 70%)` }} />

      {[480, 640, 800].map((size, i) => (
        <div key={size} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: `${i === 0 ? 3 : 1}px solid rgba(212,168,47,${0.18 - i * 0.05})`,
          transform: `scale(${halo * (1 + i * 0.03)})`,
        }} />
      ))}

      {/* Logo */}
      <div style={{ opacity, transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 1 }}>
        <svg width="140" height="86" viewBox="0 0 100 60" fill="none">
          <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} strokeLinejoin="round" />
          <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
          <circle cx="10" cy="20" r="5" fill={GOLD} />
          <circle cx="50" cy="10" r="5" fill={GOLD} />
          <circle cx="90" cy="20" r="5" fill={GOLD} />
        </svg>
        {/* Grande lettre E */}
        <div style={{ fontSize: 160, fontFamily: "Georgia, serif", color: WHITE, lineHeight: 1, marginTop: -16 }}>E</div>
        <div style={{ fontSize: 64, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "14px", fontWeight: "bold" }}>EXCELLIS</div>
        <div style={{ fontSize: 28, color: GOLD, letterSpacing: "14px", fontFamily: "Georgia, serif" }}>P R I V I L È G E</div>
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagOp, transform: `translateY(${tagTy}px)`, zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 48, color: LIGHT, fontFamily: "Georgia, serif", fontStyle: "italic", opacity: 0.85 }}>
          Votre conciergerie privée<br />pour l'inaccessible.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 2 : iPhone pleine largeur + messages (75–405 frames = 11 s) ─────────
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
  // iPhone pleine largeur : 1000px de large sur 1080
  const W = 1000, H = 1580, R = 70, BORDER = 16;

  return (
    <div style={{
      width: W, height: H, borderRadius: R,
      background: "#1c1c1e",
      border: `${BORDER}px solid #333`,
      boxShadow: `0 0 0 2px #555, 0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(212,168,47,0.15)`,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Dynamic island */}
      <div style={{
        position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 40, background: "#1c1c1e", borderRadius: 24, zIndex: 10,
      }} />

      {/* Écran */}
      <div style={{
        flex: 1, background: "#07071a",
        borderRadius: R - BORDER,
        display: "flex", flexDirection: "column",
        padding: "72px 36px 36px",
        gap: 22, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ opacity: fadeIn(gf, 5, 15), display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <svg width="30" height="20" viewBox="0 0 100 60" fill="none">
            <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} />
          </svg>
          <span style={{ color: GOLD, fontSize: 28, fontFamily: "Georgia, serif", letterSpacing: "6px" }}>EXCELLIS</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: GREEN }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 22 }}>En ligne</span>
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ width: "100%", height: 1, background: "rgba(212,168,47,0.25)", opacity: fadeIn(gf, 8, 12) }} />

        {/* Messages */}
        {messages.map((msg) => {
          const appeared = gf >= msg.frame;
          const op = appeared ? fadeIn(gf, msg.frame, 14) : 0;
          const ty = appeared
            ? interpolate(spring({ frame: gf - msg.frame, fps, config: { damping: 18, stiffness: 125 } }), [0, 1], [50, 0])
            : 50;

          return (
            <div key={msg.text} style={{
              opacity: op, transform: `translateY(${ty}px)`,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 28, padding: "28px 30px",
              border: "1px solid rgba(212,168,47,0.18)",
              display: "flex", alignItems: "center", gap: 24,
            }}>
              {/* Icône */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(212,168,47,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, flexShrink: 0,
              }}>{msg.icon}</div>

              {/* Texte */}
              <div style={{ flex: 1 }}>
                <div style={{ color: WHITE, fontSize: 34, fontFamily: "Georgia, serif", lineHeight: 1.3, fontWeight: "bold" }}>
                  {msg.text}
                </div>
                {msg.sub && (
                  <div style={{ color: LIGHT, fontSize: 30, opacity: 0.7, marginTop: 10, lineHeight: 1.35 }}>
                    {msg.sub}
                  </div>
                )}
              </div>

              {/* Badge */}
              {msg.badge && (
                <div style={{
                  background: msg.badgeColor ?? GOLD,
                  borderRadius: 14, padding: "8px 18px", flexShrink: 0,
                  fontSize: 22, fontWeight: "bold", color: NAVY, letterSpacing: "1px",
                }}>{msg.badge}</div>
              )}
            </div>
          );
        })}

        {/* Disponibilité */}
        <div style={{
          marginTop: "auto", opacity: fadeIn(gf, 15, 20),
          display: "flex", gap: 10, alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 22 }}>Disponible 24h/24 · 7j/7</span>
        </div>
      </div>

      {/* Barre home */}
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", width: 180, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
    </div>
  );
};

const IPhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = useSlideUp(0, 80);
  const phoneP    = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 88 } });
  const phoneOp   = fadeIn(frame, 15, 20);
  const phoneY    = interpolate(phoneP, [0, 1], [150, 0]);

  const messages: IPhoneMessage[] = [
    {
      text: "Événements SOLD OUT ? On s'en occupe.",
      sub: "Votre place est réservée — même quand c'est complet.",
      icon: "🎟️", badge: "SOLD OUT", badgeColor: RED,
      frame: 35,
    },
    {
      text: "Loges VIP · Galas · Red Carpets",
      sub: "Vivez les coulisses de l'événement, pas la foule.",
      icon: "👑", badge: "VIP",
      frame: 90,
    },
    {
      text: "Avant-premières & soirées sur invitation",
      sub: "De la Fashion Week aux matchs de légende — on ouvre les portes.",
      icon: "🌟",
      frame: 145,
    },
    {
      text: "Sourcing 100% fiable & vérifié",
      sub: "Chaque prestataire est testé, validé et approuvé par nos soins.",
      icon: "✅",
      frame: 200,
    },
    {
      text: "Des centaines de clients satisfaits",
      sub: "Ils nous ont fait confiance. Ils reviennent.",
      icon: "⭐",
      frame: 255,
    },
    {
      text: "Satisfait ou remboursé — sans discussion",
      sub: "Nous tenons nos engagements — ou on vous rembourse. Point.",
      icon: "🛡️",
      frame: 305,
    },
  ];

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 60,
      gap: 40,
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 45% at 50% 20%, ${NAVY2} 0%, ${NAVY} 70%)` }} />

      {/* Headline */}
      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center", padding: "0 50px" }}>
        <div style={{ color: GOLD, fontSize: 28, letterSpacing: "8px", fontFamily: "Georgia, serif", marginBottom: 16 }}>
          CONCIERGERIE PRIVÉE
        </div>
        <div style={{ color: WHITE, fontSize: 72, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.15 }}>
          Les événements<br />
          <span style={{ color: RED, fontStyle: "italic" }}>SOLD OUT</span> ?<br />
          <span style={{ color: GOLD }}>Plus un obstacle.</span>
        </div>
        <div style={{ width: 80, height: 4, background: GOLD, margin: "20px auto 16px" }} />
        <div style={{ color: LIGHT, fontSize: 40, fontFamily: "Georgia, serif", opacity: 0.75, lineHeight: 1.4 }}>
          Événements, galas, concerts, loges VIP…<br />
          Nous ouvrons les portes que vous croyiez fermées.
        </div>
      </div>

      {/* iPhone pleine largeur */}
      <div style={{ opacity: phoneOp, transform: `translateY(${phoneY}px)`, zIndex: 1 }}>
        <IPhoneMockup messages={messages} gf={frame} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 3 : Badges (405–525 frames = 4 s) ──────────────────────────────────
const TrustScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const badges = [
    { icon: "🎟️", title: "Accès événements exclusifs",  sub: "Le mot « complet » ne vous concerne plus.",                          delay: 5  },
    { icon: "👑", title: "Service conciergerie VIP",     sub: "Un expert à vos côtés, disponible quand vous le décidez.",          delay: 30 },
    { icon: "✅", title: "Sourcing 100% fiable",         sub: "Chaque prestataire est choisi avec la même exigence que pour nous.", delay: 55 },
    { icon: "🛡️", title: "Satisfait ou remboursé",      sub: "Notre service vous convient — ou vous êtes remboursé. Sans condition.", delay: 80 },
  ];

  const titleAnim = useSlideUp(0, 60);

  return (
    <AbsoluteFill style={{
      background: NAVY,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 50,
      padding: "0 60px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${NAVY2} 0%, ${NAVY} 80%)` }} />

      <div style={{ ...titleAnim, zIndex: 1, textAlign: "center" }}>
        <div style={{ color: GOLD, fontSize: 26, letterSpacing: "8px", fontFamily: "Georgia, serif", marginBottom: 18 }}>NOS ENGAGEMENTS</div>
        <div style={{ color: WHITE, fontSize: 66, fontFamily: "Georgia, serif", fontWeight: "bold", lineHeight: 1.2 }}>
          Ce qui fait la<br /><span style={{ color: GOLD }}>différence</span> Excellis
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", zIndex: 1 }}>
        {badges.map((b) => {
          const anim = useSlideUp(b.delay, 60);
          return (
            <div key={b.title} style={{
              ...anim,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,168,47,0.25)",
              borderRadius: 28, padding: "30px 40px",
              display: "flex", alignItems: "center", gap: 30,
            }}>
              <div style={{ fontSize: 56, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ color: WHITE, fontSize: 38, fontFamily: "Georgia, serif", fontWeight: "bold", marginBottom: 8 }}>{b.title}</div>
                <div style={{ color: LIGHT, fontSize: 34, opacity: 0.7, lineHeight: 1.4 }}>{b.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scène 4 : Slogan (525–600 frames = 2.5 s) ────────────────────────────────
const SloganScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const allOp    = fadeIn(frame, 0, 12);
  const lineW    = interpolate(frame, [5, 35], [0, 450], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const });
  const textAnim = useSlideUp(5, 50);

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: allOp, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 45%, #1e3d7a 0%, ${NAVY} 75%)` }} />
      <div style={{ position: "absolute", top: "50%", left: 0, width: lineW / 2, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD})`, zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", right: 0, width: lineW / 2, height: 2, background: `linear-gradient(270deg, transparent, ${GOLD})`, zIndex: 1 }} />

      <div style={{ ...textAnim, zIndex: 1, textAlign: "center", padding: "0 80px" }}>
        <div style={{ fontSize: 26, color: GOLD, letterSpacing: "10px", fontFamily: "Georgia, serif", marginBottom: 32 }}>NOTRE PROMESSE</div>
        <div style={{ fontSize: 68, color: WHITE, fontFamily: "Georgia, serif", lineHeight: 1.35, fontStyle: "italic" }}>
          "Votre satisfaction<br />
          fait de vous<br />
          notre priorité"
        </div>
        <div style={{ width: 90, height: 4, background: GOLD, margin: "40px auto 36px" }} />
        <div style={{ fontSize: 52, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "10px" }}>EXCELLIS</div>
        <div style={{ fontSize: 24, color: GOLD, letterSpacing: "12px", marginTop: 14 }}>P R I V I L È G E</div>
        <div style={{ fontSize: 36, color: LIGHT, fontFamily: "Georgia, serif", opacity: 0.7, marginTop: 30, lineHeight: 1.5 }}>
          Contactez-nous — votre première expérience<br />vous attend dès aujourd'hui.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Composition 1080×1920 · 20 s · 30 fps = 600 frames ───────────────────────
export const ExcellisVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("music.wav")} volume={1} />
      <Sequence from={0}   durationInFrames={75}><IntroScreen /></Sequence>
      <Sequence from={75}  durationInFrames={330}><IPhoneScreen /></Sequence>
      <Sequence from={405} durationInFrames={120}><TrustScreen /></Sequence>
      <Sequence from={525} durationInFrames={75}><SloganScreen /></Sequence>
    </AbsoluteFill>
  );
};
