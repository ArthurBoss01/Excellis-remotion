/**
 * Génère une piste audio ambient/luxe pour Excellis (15 s)
 * Synthèse pure Node.js → public/music.wav
 *
 * Tonalité : Ré mineur (D, F, A, C)
 * Structure :
 *   0.0 – 2.5 s  → Pad fade-in (accord Dm)
 *   2.5 – 7.5 s  → Arpège + pad (scène iPhone)
 *   7.5 – 12.0 s → Accord plein + basse pulsée (badges)
 *  12.0 – 15.0 s → Fade-out avec accord final (slogan)
 */

const fs   = require("fs");
const path = require("path");

const SR       = 44100;        // sample rate
const DURATION = 15.5;         // légèrement > vidéo
const N        = Math.floor(SR * DURATION);
const CHANNELS = 2;

// ── Oscillateurs ─────────────────────────────────────────────────────────────

const sin  = (f, t) => Math.sin(2 * Math.PI * f * t);
const TWO_PI = 2 * Math.PI;

/** Sine simple */
const osc = (freq, t) => Math.sin(TWO_PI * freq * t);

/** Pad : plusieurs oscillateurs légèrement désaccordés */
const pad = (freq, t, spread = 0.008) => {
  let s = 0;
  for (let i = -3; i <= 3; i++) s += Math.sin(TWO_PI * freq * (1 + i * spread) * t);
  return s / 7;
};

/** Piano-like : fondamentale + harmoniques décroissantes */
const piano = (freq, t) => {
  const f = freq;
  return (
    osc(f, t)     * 1.0 +
    osc(f * 2, t) * 0.28 +
    osc(f * 3, t) * 0.08 +
    osc(f * 4, t) * 0.03
  ) / 1.39;
};

/** Enveloppe ADSR */
const adsr = (t, dur, a, d, s, r) => {
  if (t < 0)       return 0;
  if (t < a)       return t / a;
  if (t < a + d)   return 1 - (1 - s) * (t - a) / d;
  if (t < dur - r) return s;
  if (t < dur)     return s * (1 - (t - (dur - r)) / r);
  return 0;
};

/** Reverb simple : mélange du signal avec des retards */
const makeReverb = (buf, decay = 0.4, delayMs = 80) => {
  const d = Math.floor((delayMs / 1000) * SR);
  const out = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    out[i] = buf[i];
    if (i >= d) out[i] += buf[i - d] * decay;
    if (i >= d * 2) out[i] += buf[i - d * 2] * decay * 0.5;
    if (i >= d * 3) out[i] += buf[i - d * 3] * decay * 0.25;
  }
  return out;
};

// ── Notes (fréquences en Hz) ──────────────────────────────────────────────────
const NOTE = {
  D2: 73.42,  A2: 110.00,
  D3: 146.83, F3: 174.61, A3: 220.00, C4: 261.63,
  D4: 293.66, F4: 349.23, A4: 440.00, C5: 523.25,
  D5: 587.33, F5: 698.46, A5: 880.00,
};

// ── Buffers stéréo ────────────────────────────────────────────────────────────
const left  = new Float64Array(N);
const right = new Float64Array(N);

// ── Couche 1 : Pad Dm (D+F+A) sur toute la durée ─────────────────────────────
for (let i = 0; i < N; i++) {
  const t  = i / SR;
  // Fade global in/out
  const vol = adsr(t, DURATION, 2.0, 0.5, 0.85, 2.5);

  const chord =
    pad(NOTE.D3, t) * 0.50 +
    pad(NOTE.F3, t) * 0.40 +
    pad(NOTE.A3, t) * 0.35 +
    pad(NOTE.D4, t) * 0.20;

  const sig = chord * vol * 0.22;
  left[i]  += sig;
  right[i] += sig * 0.98; // très léger stereo
}

// ── Couche 2 : Basse pulsée (D2) à partir de t=2.5 s ─────────────────────────
{
  // Pulse toutes les 1.5 s (tempo libre, ambient)
  const pulses = [2.5, 4.0, 5.5, 7.0, 8.5, 10.0, 11.5, 13.0];
  for (const start of pulses) {
    const dur = 1.2;
    const startI = Math.floor(start * SR);
    const endI   = Math.min(N, startI + Math.floor(dur * SR));
    for (let i = startI; i < endI; i++) {
      const t   = (i - startI) / SR;
      const env = adsr(t, dur, 0.01, 0.1, 0.4, 0.7);
      const sig = piano(NOTE.D2, t) * env * 0.35;
      left[i]  += sig;
      right[i] += sig;
    }
  }
}

// ── Couche 3 : Arpège (t = 2.5–12 s) ────────────────────────────────────────
{
  const arpNotes = [
    NOTE.D4, NOTE.F4, NOTE.A4, NOTE.C5,
    NOTE.D5, NOTE.A4, NOTE.F4, NOTE.D4,
    NOTE.C5, NOTE.A4, NOTE.F4, NOTE.D4,
  ];
  const noteDur  = 0.55;
  const noteGap  = 0.72;
  const arpStart = 2.5;

  for (let n = 0; n < 20; n++) {
    const noteStart = arpStart + n * noteGap;
    if (noteStart >= 12.5) break;

    const freq     = arpNotes[n % arpNotes.length];
    const startI   = Math.floor(noteStart * SR);
    const endI     = Math.min(N, startI + Math.floor(noteDur * SR));

    // Legère variation de pan gauche/droite
    const pan  = 0.3 * Math.sin(n * 1.2);
    const volL = 0.5 + pan * 0.5;
    const volR = 0.5 - pan * 0.5;

    for (let i = startI; i < endI; i++) {
      const t   = (i - startI) / SR;
      const env = adsr(t, noteDur, 0.02, 0.15, 0.45, 0.25);

      // Volume global (global fade)
      const globalT = i / SR;
      const gvol = adsr(globalT, DURATION, 2.0, 0.5, 0.85, 2.5);

      const sig = piano(freq, t) * env * 0.28 * gvol;
      left[i]  += sig * volL;
      right[i] += sig * volR;
    }
  }
}

// ── Couche 4 : Mélodie (t = 5–13 s) ─────────────────────────────────────────
{
  const melody = [
    { freq: NOTE.A4, start: 5.0,  dur: 1.1 },
    { freq: NOTE.F4, start: 6.2,  dur: 0.9 },
    { freq: NOTE.D5, start: 7.2,  dur: 1.4 },
    { freq: NOTE.C5, start: 8.8,  dur: 0.8 },
    { freq: NOTE.A4, start: 9.8,  dur: 0.7 },
    { freq: NOTE.F4, start: 10.6, dur: 0.8 },
    { freq: NOTE.D4, start: 11.5, dur: 1.8 },
  ];

  for (const { freq, start, dur } of melody) {
    const startI = Math.floor(start * SR);
    const endI   = Math.min(N, startI + Math.floor(dur * SR));
    for (let i = startI; i < endI; i++) {
      const t      = (i - startI) / SR;
      const env    = adsr(t, dur, 0.04, 0.2, 0.55, 0.4);
      const globalT = i / SR;
      const gvol   = adsr(globalT, DURATION, 2.0, 0.5, 0.85, 2.5);
      const sig    = piano(freq, t) * env * 0.30 * gvol;
      left[i]  += sig * 0.55;
      right[i] += sig * 0.45;
    }
  }
}

// ── Couche 5 : Shimmer haute fréquence (A5) léger ────────────────────────────
{
  for (let i = 0; i < N; i++) {
    const t    = i / SR;
    const gvol = adsr(t, DURATION, 3.0, 0.5, 0.80, 2.5);
    const sig  = pad(NOTE.A5, t, 0.004) * gvol * 0.04;
    left[i]  += sig;
    right[i] += sig;
  }
}

// ── Reverb légère sur L+R ─────────────────────────────────────────────────────
const leftRev  = makeReverb(left,  0.35, 75);
const rightRev = makeReverb(right, 0.35, 85);

// ── Normalisation ─────────────────────────────────────────────────────────────
let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(leftRev[i]), Math.abs(rightRev[i]));
}
const gain = 0.88 / peak; // headroom

// ── Écriture WAV ─────────────────────────────────────────────────────────────
const dataSize   = N * CHANNELS * 2; // 16-bit = 2 bytes/sample
const headerSize = 44;
const wavBuf     = Buffer.alloc(headerSize + dataSize);
let off = 0;

const w4 = (s)   => { wavBuf.write(s, off, "ascii");          off += 4; };
const u32 = (v)  => { wavBuf.writeUInt32LE(v, off);           off += 4; };
const u16 = (v)  => { wavBuf.writeUInt16LE(v, off);           off += 2; };
const i16 = (v)  => { wavBuf.writeInt16LE(Math.round(Math.max(-32768, Math.min(32767, v * 32767))), off); off += 2; };

w4("RIFF"); u32(36 + dataSize); w4("WAVE");
w4("fmt "); u32(16); u16(1); u16(CHANNELS);
u32(SR); u32(SR * CHANNELS * 2); u16(CHANNELS * 2); u16(16);
w4("data"); u32(dataSize);

for (let i = 0; i < N; i++) {
  i16(leftRev[i]  * gain);
  i16(rightRev[i] * gain);
}

const outDir = path.join(__dirname, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "music.wav");
fs.writeFileSync(outPath, wavBuf);
console.log(`✅ Audio généré : ${outPath} (${(wavBuf.length / 1024).toFixed(0)} KB)`);
