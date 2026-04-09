// CelineDionPoster.jsx — Affiche places disponibles v6
// Format: 1080x1920 portrait

import { AbsoluteFill } from "remotion";

const BLACK   = "#050508";
const DEEP    = "#0D0A1E";
const PURPLE  = "#2D1060";
const GOLD    = "#D4A82F";
const GOLD_LT = "#F0C84F";
const WHITE   = "#FFFFFF";
const SILVER  = "#C8D4E0";
const GREEN   = "#4ADE80";

const dates = [
  { day: "16", month: "SEPT", dow: "MERCREDI",
    tickets: ["DUO CAT 1 PARTERRE"] },
  { day: "18", month: "SEPT", dow: "VENDREDI",
    tickets: ["DUO TRIBUNE OR PARTERRE", "DUO CAT 1 PARTERRE ALLEE"] },
  { day: "19", month: "SEPT", dow: "SAMEDI",
    tickets: ["DUO CAT 1 PARTERRE"] },
  { day: "23", month: "SEPT", dow: "MERCREDI",
    tickets: ["DUO TRIBUNE OR ALLEE"] },
  { day: "25", month: "SEPT", dow: "VENDREDI",
    tickets: ["DUO CAT 1 PARTERRE"] },
  { day: "30", month: "SEPT", dow: "MERCREDI",
    tickets: ["DUO TRIBUNE OR ALLEE"] },
  { day: "9",  month: "OCT",  dow: "VENDREDI",
    tickets: ["DUO CAT 2 TRIBUNE HAUTE"] },
];

const ticketColor = (t) => {
  if (t.includes("TRIBUNE OR")) return GOLD_LT;
  if (t.includes("CAT 1"))      return GOLD;
  return SILVER;
};

export const CelineDionPoster = () => (
  <AbsoluteFill style={{
    background: `linear-gradient(160deg, ${BLACK} 0%, ${DEEP} 50%, ${PURPLE}88 100%)`,
    overflow: "hidden",
    fontFamily: "Georgia, 'Times New Roman', serif",
  }}>

    {/* Stars */}
    {Array.from({ length: 60 }, (_, i) => (
      <div key={i} style={{
        position: "absolute",
        left: `${(i * 73 + 11) % 100}%`,
        top:  `${(i * 37 +  7) % 100}%`,
        width: 1 + (i % 2), height: 1 + (i % 2),
        borderRadius: "50%", background: WHITE,
        opacity: 0.12 + (i % 5) * 0.06,
      }} />
    ))}

    {/* Spotlight */}
    <div style={{
      position: "absolute", top: -300, left: "50%",
      transform: "translateX(-50%)",
      width: 900, height: 2200,
      background: "conic-gradient(from -18deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.05) 18deg, transparent 36deg)",
    }} />

    {/* Glow */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 1,
      background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(45,16,96,0.5) 0%, transparent 70%)",
    }} />

    {/* ── HEADER ── */}
    <div style={{ position: "absolute", top: 60, left: 54, right: 54, zIndex: 4 }}>

      <div style={{ fontSize: 15, color: GOLD, letterSpacing: 9, marginBottom: 14 }}>
        EXCELLIS CONCIERGERIE
      </div>

      <div style={{
        fontSize: 106, color: WHITE, lineHeight: 0.85,
        fontStyle: "italic", letterSpacing: -2,
        textShadow: "0 0 80px rgba(212,168,47,0.4), 0 4px 30px rgba(0,0,0,0.95)",
      }}>Celine</div>
      <div style={{
        fontSize: 106, color: GOLD, lineHeight: 0.88,
        fontStyle: "italic", letterSpacing: -2,
        textShadow: "0 0 100px rgba(212,168,47,0.9), 0 4px 30px rgba(0,0,0,0.95)",
      }}>Dion</div>

      <div style={{ marginTop: 18, fontSize: 15, color: SILVER, letterSpacing: 7 }}>
        PARIS LA DEFENSE ARENA · 2026
      </div>
    </div>

    {/* Separator */}
    <div style={{
      position: "absolute", top: 355, left: 54, right: 54, height: 1.5, zIndex: 4,
      background: `linear-gradient(90deg, ${GOLD}, rgba(212,168,47,0.3), transparent)`,
    }} />

    {/* Badge PLACES DISPONIBLES */}
    <div style={{ position: "absolute", top: 376, left: 54, zIndex: 4 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        padding: "10px 28px",
        background: "linear-gradient(135deg, rgba(45,16,96,0.95), rgba(26,8,64,0.98))",
        border: "1px solid rgba(212,168,47,0.55)", borderRadius: 30,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN,
          boxShadow: `0 0 8px ${GREEN}` }} />
        <div style={{ fontSize: 17, color: GOLD_LT, letterSpacing: 5, fontWeight: "bold" }}>
          PLACES DISPONIBLES
        </div>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN,
          boxShadow: `0 0 8px ${GREEN}` }} />
      </div>
    </div>

    {/* ── DATE ROWS ── */}
    <div style={{ position: "absolute", top: 448, left: 54, right: 54, zIndex: 4 }}>
      {dates.map((d, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 22px",
          marginBottom: 14,
          background: i % 2 === 0
            ? "rgba(13,10,30,0.82)"
            : "rgba(20,12,40,0.78)",
          border: "1px solid rgba(212,168,47,0.18)",
          borderLeft: `5px solid ${GOLD}`,
          borderRadius: 12,
          gap: 22,
        }}>

          {/* Date block */}
          <div style={{ minWidth: 105, textAlign: "center", flexShrink: 0 }}>
            <div style={{
              fontSize: 58, color: GOLD_LT, fontWeight: "bold", lineHeight: 1,
              textShadow: "0 0 30px rgba(240,200,79,0.5)",
            }}>{d.day}</div>
            <div style={{ fontSize: 17, color: GOLD, letterSpacing: 3, marginTop: 2 }}>{d.month}</div>
            <div style={{ fontSize: 12, color: SILVER, letterSpacing: 2, opacity: 0.7, marginTop: 3 }}>{d.dow}</div>
          </div>

          {/* Vertical divider */}
          <div style={{
            width: 1, alignSelf: "stretch",
            background: "linear-gradient(180deg, transparent, rgba(212,168,47,0.4), transparent)",
            flexShrink: 0,
          }} />

          {/* Ticket list */}
          <div style={{ flex: 1 }}>
            {d.tickets.map((t, j) => (
              <div key={j} style={{
                fontSize: 22,
                color: ticketColor(t),
                letterSpacing: 0.8,
                lineHeight: 1.6,
                fontWeight: j === 0 ? "bold" : "normal",
                fontStyle: j > 0 ? "italic" : "normal",
                textShadow: j === 0 && t.includes("TRIBUNE OR")
                  ? "0 0 20px rgba(240,200,79,0.45)"
                  : "none",
              }}>{t}</div>
            ))}
          </div>

          {/* Check mark */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "rgba(74,222,128,0.12)",
            border: "1.5px solid rgba(74,222,128,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: GREEN,
          }}>✓</div>

        </div>
      ))}
    </div>

    {/* ── FOOTER ── */}
    <div style={{
      position: "absolute", bottom: 36, left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center", zIndex: 4,
    }}>
      <div style={{
        width: 200, height: 1.5, marginBottom: 12,
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }} />
      <div style={{ fontSize: 26, color: WHITE, letterSpacing: 9, fontWeight: "bold" }}>EXCELLIS</div>
      <div style={{ fontSize: 11, color: GOLD, letterSpacing: 9, marginTop: 5 }}>
        C O N C I E R G E R I E
      </div>
    </div>

  </AbsoluteFill>
);

export default CelineDionPoster;
