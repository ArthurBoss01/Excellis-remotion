// EXCELLIS - Vidéo de présentation 15 secondes
// Pour utiliser ce fichier dans Remotion :
// 1. Crée un projet : npm init video@latest
// 2. Remplace src/Root.tsx par ce fichier
// 3. Lance : npx remotion studio

import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence } from “remotion”;

const NAVY = “#0D2045”;
const GOLD = “#D4A82F”;
const WHITE = “#FFFFFF”;
const LIGHT = “#E8EDF5”;

// Utilitaire d’animation
const useFadeSlideUp = (startFrame, duration = 20) => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const progress = spring({
frame: frame - startFrame,
fps,
config: { damping: 18, stiffness: 120 },
});
return {
opacity: interpolate(frame - startFrame, [0, duration * 0.4], [0, 1], { extrapolateRight: “clamp” }),
transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
};
};

// Ligne décorative animée
const GoldLine = ({ startFrame }) => {
const frame = useCurrentFrame();
const width = interpolate(frame - startFrame, [0, 25], [0, 120], {
extrapolateLeft: “clamp”,
extrapolateRight: “clamp”,
});
return (
<div style={{
width: `${width}px`,
height: “2px”,
background: `linear-gradient(90deg, ${GOLD}, transparent)`,
margin: “12px auto”,
}} />
);
};

// Écran 1 : Intro logo (0-3s = frames 0-90)
const IntroScreen = () => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: “clamp” });

// Particules dorées
const particles = Array.from({ length: 12 }, (_, i) => ({
id: i,
x: 20 + (i * 7) % 80,
y: 10 + (i * 13) % 80,
size: 2 + (i % 3),
delay: i * 4,
}));

return (
<AbsoluteFill style={{ background: NAVY, alignItems: “center”, justifyContent: “center”, overflow: “hidden” }}>
{/* Fond radial */}
<div style={{
position: “absolute”,
inset: 0,
background: `radial-gradient(ellipse 60% 60% at 50% 50%, #1a3a6e 0%, ${NAVY} 70%)`,
}} />

```
  {/* Particules */}
  {particles.map(p => {
    const pOpacity = interpolate(frame - p.delay, [0, 20], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div key={p.id} style={{
        position: "absolute",
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        borderRadius: "50%",
        background: GOLD,
        opacity: pOpacity,
      }} />
    );
  })}

  {/* Logo SVG Excellis */}
  <div style={{
    opacity: logoOpacity,
    transform: `scale(${interpolate(logoScale, [0, 1], [0.6, 1])})`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  }}>
    {/* Couronne SVG */}
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
      <polygon points="10,55 20,20 35,40 50,10 65,40 80,20 90,55" fill={GOLD} stroke={GOLD} strokeWidth="1" strokeLinejoin="round" />
      <rect x="8" y="52" width="84" height="8" rx="4" fill={GOLD} />
      <circle cx="10" cy="20" r="5" fill={GOLD} />
      <circle cx="50" cy="10" r="5" fill={GOLD} />
      <circle cx="90" cy="20" r="5" fill={GOLD} />
    </svg>

    {/* Lettre E */}
    <div style={{
      fontSize: 90,
      fontFamily: "Georgia, serif",
      color: WHITE,
      lineHeight: 1,
      letterSpacing: "-2px",
      marginTop: -10,
    }}>E</div>

    {/* Nom */}
    <div style={{ fontSize: 32, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "6px", fontWeight: "bold" }}>
      EXCELLIS
    </div>

    {/* Sous-titre */}
    <div style={{ fontSize: 16, color: GOLD, letterSpacing: "8px", fontFamily: "Georgia, serif" }}>
      P R I V I L È G E
    </div>
  </div>
</AbsoluteFill>
```

);
};

// Écran 2 : Services (3s-9s = frames 90-270)
const ServicesScreen = () => {
const frame = useCurrentFrame();

const services = [
{ icon: “✦”, title: “Conciergerie”, sub: “Service premium & personnalisé”, frame: 0 },
{ icon: “◆”, title: “Événementiel”, sub: “Des moments inoubliables”, frame: 20 },
{ icon: “★”, title: “Accès Exclusifs”, sub: “Tickets SOLD OUT & avant-premières”, frame: 40 },
];

const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: “clamp” });

return (
<AbsoluteFill style={{
background: NAVY,
opacity: bgOpacity,
flexDirection: “column”,
alignItems: “center”,
justifyContent: “center”,
gap: 0,
padding: “0 60px”,
}}>
<div style={{
position: “absolute”, inset: 0,
background: `radial-gradient(ellipse 80% 50% at 50% 50%, #162d5e 0%, ${NAVY} 80%)`,
}} />

```
  {/* Titre section */}
  <div style={{
    ...useFadeSlideUp(0, 20),
    color: GOLD,
    fontSize: 13,
    letterSpacing: "6px",
    fontFamily: "Georgia, serif",
    marginBottom: 20,
    zIndex: 1,
  }}>
    NOS SERVICES
  </div>

  {/* Liste services */}
  {services.map((s) => {
    const anim = useFadeSlideUp(s.frame, 20);
    return (
      <div key={s.title} style={{
        ...anim,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 20,
        width: "100%",
        maxWidth: 700,
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
```

);
};

// Écran 3 : Slogan final (9s-15s = frames 270-450)
const SloganScreen = () => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const lineWidth = interpolate(frame, [10, 40], [0, 200], { extrapolateLeft: “clamp”, extrapolateRight: “clamp” });
const textAnim = useFadeSlideUp(15, 25);
const subAnim = useFadeSlideUp(30, 25);
const logoAnim = useFadeSlideUp(50, 20);

const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: “clamp” });

return (
<AbsoluteFill style={{
background: NAVY,
opacity: bgOpacity,
alignItems: “center”,
justifyContent: “center”,
flexDirection: “column”,
gap: 0,
}}>
<div style={{
position: “absolute”, inset: 0,
background: `radial-gradient(ellipse 70% 70% at 50% 40%, #1e3d7a 0%, ${NAVY} 75%)`,
}} />

```
  {/* Ligne or gauche */}
  <div style={{
    position: "absolute",
    left: 0, top: "50%",
    width: lineWidth / 2,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${GOLD})`,
    zIndex: 1,
  }} />

  {/* Ligne or droite */}
  <div style={{
    position: "absolute",
    right: 0, top: "50%",
    width: lineWidth / 2,
    height: 1,
    background: `linear-gradient(270deg, transparent, ${GOLD})`,
    zIndex: 1,
  }} />

  {/* Slogan */}
  <div style={{ ...textAnim, zIndex: 1, textAlign: "center", padding: "0 60px" }}>
    <div style={{
      fontSize: 11,
      color: GOLD,
      letterSpacing: "5px",
      fontFamily: "Georgia, serif",
      marginBottom: 16,
    }}>NOTRE PROMESSE</div>

    <div style={{
      fontSize: 28,
      color: WHITE,
      fontFamily: "Georgia, serif",
      lineHeight: 1.4,
      fontStyle: "italic",
      maxWidth: 600,
    }}>
      "Votre satisfaction fait<br />de vous notre priorité"
    </div>
  </div>

  {/* Séparateur or */}
  <div style={{
    ...subAnim,
    zIndex: 1,
    width: 60,
    height: 2,
    background: GOLD,
    margin: "24px auto",
  }} />

  {/* Logo petit */}
  <div style={{ ...logoAnim, zIndex: 1, textAlign: "center" }}>
    <div style={{ fontSize: 22, fontFamily: "Georgia, serif", color: WHITE, letterSpacing: "4px" }}>EXCELLIS</div>
    <div style={{ fontSize: 11, color: GOLD, letterSpacing: "6px", marginTop: 4 }}>P R I V I L È G E</div>
  </div>
</AbsoluteFill>
```

);
};

// Composition principale
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

// Root - à mettre dans src/Root.tsx
export const RemotionRoot = () => {
return (
<>
{/* Composition({
id: “ExcellisVideo”,
component: ExcellisVideo,
durationInFrames: 450,
fps: 30,
width: 1920,
height: 1080,
}) */}
</>
);
};

export default ExcellisVideo;
