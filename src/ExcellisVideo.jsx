// EXCELLIS - Video de presentation 15 secondes
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence } from "remotion";

const NAVY = "#0D2045";
const GOLD = "#D4A82F";
const WHITE = "#FFFFFF";
const LIGHT = "#E8EDF5";

const useFadeSlideUp = (startFrame, duration = 20) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  return {
    opacity: interpolate(frame - startFrame, [0, duration * 0.4], [0, 1], { extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };
};

const GoldLine = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame - startFrame, [0, 25], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{
      width: `${width}px`,
      height: "2px",
      background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      margin: "12px auto",
    }} />
  );
};

const IntroScreen = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 20 + (i * 7) % 80,
    y: 10 + (i * 13) % 80,
    size: 2 + (i % 3),
    delay: i * 4,
  }));

  return (
    <AbsoluteFill style={{ background: NAVY, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, #1a3a6e 0%, ${NAVY} 70%)`,
      }} />

      {particles.map(p => {
        const pOpacity = interpolate(frame - p.delay, [0, 20], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={p.id} style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: GOLD,
            opacity: pOpacity,
          }} />
        );
      })}

      <div style={{
        opacity: logoOpacity,
        transform: `scale(${interpolate(logoScale, [0, 1], [0.6, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
          <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} stroke={GOLD} strokeWidth="1" strokeLinejoin="round" />
          <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
          <circle cx="10" cy="20" r="5" fill={GOLD} />
          <circle cx="50" cy="10" r="5" fill={GOLD} />
          <circle cx="90" cy="20" r="5" fill={GOLD} />
        </svg>

        <div style={{ fontSize: 90, fontFamily: "Georgia, serif", color: WHITE, lineHeight: 1, letterSpacing: "-2px", marginTop: -10 }}>E</div>

        <div style={{ fontSize: 32, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "6px", fontWeight: "bold" }}>
          EXCELLIS
        </div>

        <div style={{ fontSize: 16, color: GOLD, letterSpacing: "8px", fontFamily: "Georgia, serif" }}>
          P R I V I L E G E
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ServicesScreen = () => {
  const frame = useCurrentFrame();

  const services = [
    { icon: "✦", title: "Conciergerie", sub: "Service premium & personnalise", frame: 0 },
    { icon: "◆", title: "Evenementiel", sub: "Des moments inoubliables", frame: 20 },
    { icon: "★", title: "Acces Exclusifs", sub: "Tickets SOLD OUT & avant-premieres", frame: 40 },
  ];

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: NAVY,
      opacity: bgOpacity,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 60px",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, #162d5e 0%, ${NAVY} 80%)`,
      }} />

      <div style={{
        ...useFadeSlideUp(0, 20),
        color: GOLD, fontSize: 13, letterSpacing: "6px",
        fontFamily: "Georgia, serif", marginBottom: 20, zIndex: 1,
      }}>
        NOS SERVICES
      </div>

      {services.map((s) => {
        const anim = useFadeSlideUp(s.frame, 20);
        return (
          <div key={s.title} style={{
            ...anim, zIndex: 1,
            display: "flex", alignItems: "center", gap: 20,
            width: "100%", maxWidth: 700,
            padding: "18px 0",
            borderBottom: `1px solid rgba(212,168,47,0.15)`,
          }}>
            <div style={{ color: GOLD, fontSize: 18, minWidth: 30, textAlign: "center" }}>{s.icon}</div>
            <div>
              <div style={{ color: WHITE, fontSize: 20, fontFamily: "Georgia, serif", fontWeight: "bold" }}>{s.title}</div>
              <div style={{ color: LIGHT, fontSize: 13, opacity: 0.7, marginTop: 2, letterSpacing: "1px" }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SloganScreen = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineWidth = interpolate(frame, [10, 40], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textAnim = useFadeSlideUp(15, 25);
  const subAnim = useFadeSlideUp(30, 25);
  const logoAnim = useFadeSlideUp(50, 20);
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: NAVY,
      opacity: bgOpacity,
      alignItems: "center", justifyContent: "center", flexDirection: "column",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 70% at 50% 40%, #1e3d7a 0%, ${NAVY} 75%)`,
      }} />

      <div style={{ position: "absolute", left: 0, top: "50%", width: lineWidth / 2, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, zIndex: 1 }} />
      <div style={{ position: "absolute", right: 0, top: "50%", width: lineWidth / 2, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, zIndex: 1 }} />

      <div style={{ ...textAnim, zIndex: 1, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: "5px", fontFamily: "Georgia, serif", marginBottom: 16 }}>
          NOTRE PROMESSE
        </div>
        <div style={{ fontSize: 28, color: WHITE, fontFamily: "Georgia, serif", lineHeight: 1.4, fontStyle: "italic", maxWidth: 600 }}>
          Votre satisfaction fait de vous notre priorite
        </div>
      </div>

      <div style={{ ...subAnim, zIndex: 1, width: 60, height: 2, background: GOLD, margin: "24px auto" }} />

      <div style={{ ...logoAnim, zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 22, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "4px" }}>EXCELLIS</div>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: "6px", marginTop: 4 }}>P R I V I L E G E</div>
      </div>
    </AbsoluteFill>
  );
};

export const ExcellisVideo = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <IntroScreen />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <ServicesScreen />
      </Sequence>
      <Sequence from={270} durationInFrames={180}>
        <SloganScreen />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ExcellisVideo;
