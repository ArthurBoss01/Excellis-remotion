// CelineDionPoster.jsx — Affiche tarifs précommande v2
// Format: 1080x1920 portrait

import { AbsoluteFill, staticFile } from "remotion";

const BLACK   = "#050508";
const DEEP    = "#0D0A1E";
const PURPLE  = "#2D1060";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#C8D4E0";
const ROSE    = "#C8547A";

const prices = [
  { cat: "Parterre Prestige",  price: "540 €", tier: "S" },
  { cat: "Parterre Diamant",   price: "500 €", tier: "S" },
  { cat: "Tribune Or",         price: "420 €", tier: "A" },
  { cat: "Parterre Cat. 1",    price: "360 €", tier: "A" },
  { cat: "Parterre Cat. 2",    price: "245 €", tier: "B" },
  { cat: "Gradin Cat. Or",     price: "420 €", tier: "A" },
  { cat: "Gradin Cat. 1",      price: "360 €", tier: "A" },
  { cat: "Gradin Cat. 2",      price: "245 €", tier: "B" },
  { cat: "Gradin Cat. 3",      price: "205 €", tier: "C" },
  { cat: "Gradin Cat. 4",      price: "165 €", tier: "C" },
];

const tierLeft  = { S: GOLD_LT, A: GOLD, B: "#C0A870", C: SILVER };
const tierPrice = { S: GOLD_LT, A: GOLD, B: "#D4B870", C: SILVER };

export const CelineDionPoster = () => (
  <AbsoluteFill style={{
    background: `linear-gradient(160deg, ${BLACK} 0%, ${DEEP} 50%, ${PURPLE}88 100%)`,
    overflow: "hidden",
    fontFamily: "Georgia, 'Times New Roman', serif",
  }}>

    {/* ── Étoiles fond ── */}
    {Array.from({ length: 60 }, (_, i) => (
      <div key={i} style={{
        position: "absolute",
        left: `${(i * 73 + 11) % 100}%`,
        top:  `${(i * 37 +  7) % 100}%`,
        width: 1 + (i % 2), height: 1 + (i % 2),
        borderRadius: "50%", background: WHITE,
        opacity: 0.15 + (i % 5) * 0.07,
      }} />
    ))}

    {/* ── Spotlight vertical ── */}
    <div style={{
      position: "absolute", top: -300, left: "50%",
      transform: "translateX(-50%)",
      width: 900, height: 2200,
      background: "conic-gradient(from -18deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.055) 18deg, transparent 36deg)",
    }} />

    {/* ── Photo Céline — centrée en arrière-plan ── */}
    <div style={{
      position: "absolute",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 1000, height: 1000,
      zIndex: 1,
      opacity: 0.72,
    }}>
      <img
        src={staticFile("IMG_4446_cutout.png")}
        style={{
          width: "100%", height: "100%",
          objectFit: "contain", objectPosition: "center center",
          filter: "drop-shadow(0 0 80px rgba(212,168,47,0.3))",
        }}
      />
    </div>
    {/* Voile sombre par-dessus la photo pour lisibilité */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 2,
      background: "rgba(5,5,8,0.38)",
    }} />

    {/* ═══════════════ CONTENU ═══════════════ */}

    {/* ── En-tête ── */}
    <div style={{ position: "absolute", top: 70, left: 50, right: 50, zIndex: 4 }}>
      <div style={{ fontSize: 16, color: GOLD, letterSpacing: 9, marginBottom: 10 }}>
        EXCELLIS CONCIERGERIE
      </div>

      <div style={{
        fontSize: 104, color: WHITE, lineHeight: 0.85, fontStyle: "italic", letterSpacing: -2,
        textShadow: `0 0 80px rgba(212,168,47,0.4), 0 4px 30px rgba(0,0,0,0.97)`,
      }}>Celine</div>
      <div style={{
        fontSize: 104, color: GOLD, lineHeight: 0.85, fontStyle: "italic", letterSpacing: -2,
        textShadow: `0 0 100px rgba(212,168,47,1), 0 4px 30px rgba(0,0,0,0.97)`,
      }}>Dion</div>

      <div style={{ marginTop: 16, fontSize: 16, color: SILVER, letterSpacing: 7 }}>
        PARIS · LA DÉFENSE ARENA
      </div>
    </div>

    {/* ── Ligne séparatrice ── */}
    <div style={{
      position: "absolute", top: 340, left: 50, right: 50, height: 1.5, zIndex: 4,
      background: `linear-gradient(90deg, ${GOLD}, rgba(212,168,47,0.25), transparent)`,
    }} />

    {/* ── Badge PRÉCOMMANDE ── */}
    <div style={{ position: "absolute", top: 360, left: 50, zIndex: 4 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "9px 26px",
        background: `linear-gradient(135deg, ${PURPLE}, #1A0840)`,
        border: `1px solid rgba(212,168,47,0.55)`, borderRadius: 30,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ROSE }} />
        <div style={{ fontSize: 17, color: GOLD, letterSpacing: 5, fontWeight: "bold" }}>
          PRÉCOMMANDE
        </div>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: ROSE }} />
      </div>
    </div>

    {/* ── Prix pour les précommandes ── */}
    <div style={{
      position: "absolute", top: 412, left: 50, zIndex: 4,
      fontSize: 19, color: SILVER, fontStyle: "italic", letterSpacing: 1,
    }}>
      Prix spéciaux · Réservation garantie
    </div>

    {/* ── Tableau des prix ── */}
    <div style={{ position: "absolute", top: 456, left: 50, right: 50, zIndex: 4 }}>
      {prices.map((p, i) => (
        <div key={i} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          marginBottom: 9,
          background: i < 2
            ? "rgba(212,168,47,0.09)"
            : "rgba(13,10,30,0.72)",
          border: `1px solid rgba(212,168,47,${i < 2 ? "0.35" : "0.13"})`,
          borderLeft: `4px solid ${tierLeft[p.tier]}`,
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 23, color: WHITE, letterSpacing: 0.3 }}>
            {p.cat}
          </div>
          <div style={{
            fontSize: 28, fontWeight: "bold", letterSpacing: 1,
            color: tierPrice[p.tier],
            textShadow: i < 3 ? `0 0 22px ${tierPrice[p.tier]}99` : "none",
          }}>
            {p.price}
          </div>
        </div>
      ))}
    </div>

    {/* ── Note importante ── */}
    <div style={{
      position: "absolute", bottom: 120, left: 50, right: 50, zIndex: 4,
      padding: "24px 26px",
      background: `linear-gradient(135deg, rgba(45,16,96,0.82), rgba(13,10,30,0.88))`,
      border: `2px solid rgba(212,168,47,0.5)`,
      borderRadius: 16,
    }}>
      <div style={{ fontSize: 26, color: ROSE, letterSpacing: 5, marginBottom: 14, fontWeight: "bold" }}>
        ⚠️ IMPORTANT
      </div>
      <div style={{ fontSize: 38, color: WHITE, lineHeight: 1.4, fontStyle: "italic" }}>
        En raison de la forte demande, un acompte est requis pour valider votre précommande et garantir votre place.
      </div>
    </div>

    {/* ── Footer EXCELLIS ── */}
    <div style={{
      position: "absolute", bottom: 38, left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center", zIndex: 4,
    }}>
      <div style={{ width: 180, height: 1.5, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, marginBottom: 10 }} />
      <div style={{ fontSize: 26, color: WHITE, letterSpacing: 9, fontWeight: "bold" }}>EXCELLIS</div>
      <div style={{ fontSize: 11, color: GOLD, letterSpacing: 9, marginTop: 4 }}>C O N C I E R G E R I E</div>
    </div>

  </AbsoluteFill>
);

export default CelineDionPoster;
