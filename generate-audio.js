/**
 * Génère une piste TRAP / CINÉMATIQUE pour Excellis (15 s)
 * Style : luxury trap — 808 bass, hi-hats, kick cinématique, pad sombre
 * Tempo : 140 BPM   Tonalité : Ré mineur
 */

const fs   = require("fs");
const path = require("path");

const SR       = 44100;
const DURATION = 15.5;
const N        = Math.floor(SR * DURATION);
const BPM      = 140;
const BEAT     = SR * 60 / BPM;          // samples par beat
const SIXTEENTH = BEAT / 4;              // double-croche

const TWO_PI = 2 * Math.PI;

// ── Buffers ───────────────────────────────────────────────────────────────────
const left  = new Float64Array(N);
const right = new Float64Array(N);

const add = (buf, startI, sig) => {
  if (startI >= 0 && startI < buf.length) buf[startI] += sig;
};

// Ajouter un buffer dans le mix à partir d'un offset
const mix = (dest, src, offsetI, volL = 1, volR, destR) => {
  const vR = volR ?? volL;
  for (let i = 0; i < src.length; i++) {
    const idx = offsetI + i;
    if (idx < 0 || idx >= dest.length) continue;
    dest[idx] += src[i] * volL;
    if (destR) destR[idx] += src[i] * vR;
  }
};

// ── Outils DSP ────────────────────────────────────────────────────────────────

/** Enveloppe exponentielle (son percussif) */
const expEnv = (t, attack, decay) => {
  if (t < 0) return 0;
  if (t < attack) return t / attack;
  return Math.exp(-(t - attack) / decay);
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rnd   = () => Math.random() * 2 - 1;

/** Filtre passe-bas simple (IIR 1er ordre) */
const lpf = (buf, cutoff) => {
  const rc = 1 / (TWO_PI * cutoff);
  const dt = 1 / SR;
  const a  = dt / (rc + dt);
  let prev = 0;
  const out = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    prev   = prev + a * (buf[i] - prev);
    out[i] = prev;
  }
  return out;
};

/** Filtre passe-haut simple */
const hpf = (buf, cutoff) => {
  const rc = 1 / (TWO_PI * cutoff);
  const dt = 1 / SR;
  const a  = rc / (rc + dt);
  let prev = 0, prevIn = 0;
  const out = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    out[i] = a * (prev + buf[i] - prevIn);
    prev   = out[i];
    prevIn = buf[i];
  }
  return out;
};

/** Soft clipping / saturation */
const saturate = (buf, drive = 2) => {
  const out = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i] * drive;
    out[i] = x / (1 + Math.abs(x));
  }
  return out;
};

/** Reverb plate simple */
const reverb = (buf, decay = 0.5, ms = 60) => {
  const d  = Math.floor(ms / 1000 * SR);
  const out = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    out[i] = buf[i];
    if (i >= d)     out[i] += buf[i - d]     * decay;
    if (i >= d * 2) out[i] += buf[i - d * 2] * decay * 0.6;
    if (i >= d * 3) out[i] += buf[i - d * 3] * decay * 0.3;
    if (i >= d * 5) out[i] += buf[i - d * 5] * decay * 0.15;
  }
  return out;
};

// ── 1. KICK CINÉMATIQUE ───────────────────────────────────────────────────────
const makeKick = () => {
  const dur  = Math.floor(SR * 0.55);
  const buf  = new Float64Array(dur);
  for (let i = 0; i < dur; i++) {
    const t     = i / SR;
    // Pitch : 180 Hz → 40 Hz en 80 ms
    const pitch = 180 * Math.exp(-t / 0.05) + 40;
    const phase = TWO_PI * pitch * t;
    const env   = expEnv(t, 0.002, 0.18);
    // Punch transient haute fréquence
    const transient = Math.exp(-t / 0.004) * rnd() * 0.4;
    buf[i] = (Math.sin(phase) * env + transient) * 0.9;
  }
  return saturate(buf, 1.5);
};

// ── 2. 808 BASS ───────────────────────────────────────────────────────────────
const make808 = (freq, durationS) => {
  const dur = Math.floor(SR * durationS);
  const buf = new Float64Array(dur);
  for (let i = 0; i < dur; i++) {
    const t     = i / SR;
    // Pitch slide : part de 3x la fréquence, descend en 150ms
    const pitch = freq * (1 + 2 * Math.exp(-t / 0.08));
    const env   = expEnv(t, 0.005, durationS * 0.6);
    // Triangle wave pour un 808 plus gras
    const phase = (pitch * t) % 1;
    const tri   = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
    buf[i] = (tri * 0.65 + Math.sin(TWO_PI * pitch * t) * 0.35) * env;
  }
  return lpf(saturate(buf, 1.8), 180);
};

// ── 3. HI-HAT ─────────────────────────────────────────────────────────────────
const makeHat = (durationS = 0.04, open = false) => {
  const dur = Math.floor(SR * (open ? 0.18 : durationS));
  const buf = new Float64Array(dur);
  for (let i = 0; i < dur; i++) {
    const t   = i / SR;
    const env = expEnv(t, 0.001, open ? 0.06 : 0.015);
    buf[i]    = rnd() * env * 0.7;
  }
  const filtered = hpf(buf, 7000);
  return filtered;
};

// ── 4. SNARE / CLAP ───────────────────────────────────────────────────────────
const makeSnare = () => {
  const dur = Math.floor(SR * 0.25);
  const buf = new Float64Array(dur);
  for (let i = 0; i < dur; i++) {
    const t     = i / SR;
    const tone  = Math.sin(TWO_PI * 200 * t) * Math.exp(-t / 0.03);
    const noise = rnd() * Math.exp(-t / 0.07);
    buf[i]      = (tone * 0.3 + noise * 0.7) * 0.85;
  }
  return hpf(buf, 200);
};

// ── 5. PAD SOMBRE (Dm) ────────────────────────────────────────────────────────
const NOTE = {
  D2: 73.42, A2: 110.00,
  D3: 146.83, F3: 174.61, A3: 220.00, C4: 261.63,
  D4: 293.66, F4: 349.23, A4: 440.00,
};

const makePad = (durationS) => {
  const dur = Math.floor(SR * durationS);
  const buf = new Float64Array(dur);
  const chord = [NOTE.D2, NOTE.D3, NOTE.F3, NOTE.A3, NOTE.D4];
  const spread = 0.006;
  for (let i = 0; i < dur; i++) {
    const t   = i / SR;
    let   sig = 0;
    for (const freq of chord) {
      for (let d = -2; d <= 2; d++) {
        sig += Math.sin(TWO_PI * freq * (1 + d * spread) * t) / (5 * chord.length);
      }
    }
    // Enveloppe longue
    const env = Math.min(1, t / 1.5) * Math.min(1, (durationS - t) / 1.5);
    buf[i] = sig * env * 0.6;
  }
  return reverb(buf, 0.55, 80);
};

// ── 6. MÉLODIE TRAP (notes courtes, staccato) ─────────────────────────────────
const makeMelodyNote = (freq, durationS) => {
  const dur = Math.floor(SR * durationS);
  const buf = new Float64Array(dur);
  for (let i = 0; i < dur; i++) {
    const t   = i / SR;
    const env = expEnv(t, 0.005, 0.12) * Math.min(1, (durationS - t) / 0.05);
    // Sawtooth pour un son synth agressif
    const phase = (freq * t) % 1;
    const saw   = 2 * phase - 1;
    buf[i]      = saw * env * 0.5;
  }
  return lpf(saturate(buf, 2.5), 3500);
};

// ── ASSEMBLAGE ────────────────────────────────────────────────────────────────

const kick   = makeKick();
const hatC   = makeHat(0.03, false);
const hatO   = makeHat(0.18, true);
const snare  = makeSnare();
const pad    = makePad(DURATION);

// Mix du pad en stéréo dès le début
mix(left, pad, 0, 0.70);
mix(right, pad, 0, 0.68);

// ── Pattern rythmique (8 bars de 4 beats à 140 BPM) ──────────────────────────
// Durée d'un bar = 4 beats
const barBeats  = 4;
const totalBars = Math.ceil((DURATION * BPM) / 60 / barBeats);

for (let bar = 0; bar < totalBars; bar++) {
  const barStart = Math.floor(bar * barBeats * BEAT);
  if (barStart >= N) break;

  // Kicks : beat 1 + beat 3 (avec variations)
  const kickBeats = bar === 0 ? [0] : [0, 2];       // bar 1 = intro légère
  for (const b of kickBeats) {
    const idx = barStart + Math.floor(b * BEAT);
    mix(left, kick, idx, bar < 1 ? 0.5 : 0.9);
    mix(right, kick, idx, bar < 1 ? 0.5 : 0.9);
  }

  // 808 : beat 1, durée longue sur beat 1+2, plus court sur beat 3
  if (bar >= 1) {
    const bassNotes = [
      { beat: 0, freq: NOTE.D2, dur: 1.6 },
      { beat: 2, freq: NOTE.A2, dur: 0.7 },
    ];
    for (const { beat, freq, dur } of bassNotes) {
      const b808 = make808(freq, dur);
      const idx  = barStart + Math.floor(beat * BEAT);
      const vol  = bar >= 2 ? 0.85 : 0.6;
      mix(left,  b808, idx, vol * 0.9);
      mix(right, b808, idx, vol * 1.0); // légèrement plus fort à droite
    }
  }

  // Hi-hats : toutes les doubles-croches + rolls au bar 4, 8…
  const isRollBar = bar % 4 === 3;
  for (let s = 0; s < 16; s++) {
    const idx = barStart + Math.floor(s * SIXTEENTH);
    if (idx >= N) break;

    if (isRollBar && s >= 12) {
      // Roll : 4 hats rapides en fin de bar
      for (let r = 0; r < 3; r++) {
        const rIdx = idx + Math.floor(r * SIXTEENTH / 3);
        const vol  = 0.25 + r * 0.08;
        mix(left,  hatC, rIdx, vol * 0.6);
        mix(right, hatC, rIdx, vol * 0.9);
      }
    } else if (s % 2 === 0) {
      // Closed hat sur les croches
      const vol = bar < 1 ? 0.15 : (s % 4 === 0 ? 0.45 : 0.30);
      mix(left,  hatC, idx, vol * 0.7);
      mix(right, hatC, idx, vol);
    } else {
      // Hat ouvert sur les upbeats (optionnel)
      if (bar >= 2 && s % 4 === 1) {
        mix(left,  hatO, idx, 0.18);
        mix(right, hatO, idx, 0.22);
      }
    }
  }

  // Snare / clap : beat 2 et beat 4
  if (bar >= 1) {
    for (const b of [1, 3]) {
      const idx = barStart + Math.floor(b * BEAT);
      const vol = bar < 2 ? 0.5 : 0.8;
      mix(left,  snare, idx, vol * 1.0);
      mix(right, snare, idx, vol * 0.9);
      // Double clap (légèrement décalé pour plus d'épaisseur)
      mix(left,  snare, idx + 220, vol * 0.5);
      mix(right, snare, idx + 220, vol * 0.45);
    }
  }
}

// ── Mélodie synth trap (à partir de la barre 2) ───────────────────────────────
const melodySeq = [
  { beat: 8,  freq: NOTE.D4,  dur: 0.18 },
  { beat: 8.5,freq: NOTE.F4,  dur: 0.18 },
  { beat: 9,  freq: NOTE.A4,  dur: 0.22 },
  { beat: 10, freq: NOTE.D4,  dur: 0.18 },
  { beat: 10.5,freq: NOTE.C4, dur: 0.18 },
  { beat: 11, freq: NOTE.A3,  dur: 0.30 },
  { beat: 12, freq: NOTE.D4,  dur: 0.18 },
  { beat: 12.5,freq: NOTE.F4, dur: 0.18 },
  { beat: 13, freq: NOTE.A4,  dur: 0.22 },
  { beat: 14, freq: NOTE.F4,  dur: 0.18 },
  { beat: 14.5,freq: NOTE.D4, dur: 0.18 },
  { beat: 15, freq: NOTE.A3,  dur: 0.55 },
  { beat: 16, freq: NOTE.D4,  dur: 0.18 },
  { beat: 16.75,freq: NOTE.F4,dur: 0.18 },
  { beat: 17.5,freq: NOTE.D5, dur: 0.35 },
  { beat: 20, freq: NOTE.A4,  dur: 0.18 },
  { beat: 20.5,freq: NOTE.F4, dur: 0.18 },
  { beat: 21, freq: NOTE.D4,  dur: 0.40 },
];

const melodyRev = reverb(
  melodySeq.reduce((acc, { beat, freq, dur }) => {
    const note = makeMelodyNote(freq, dur);
    const idx  = Math.floor(beat * BEAT);
    for (let i = 0; i < note.length; i++) {
      if (idx + i < acc.length) acc[idx + i] += note[i];
    }
    return acc;
  }, new Float64Array(N)),
  0.30, 40
);

mix(left,  melodyRev, 0, 0.45, 0.55, right);

// ── Normalisation + fade-out final ────────────────────────────────────────────
const fadeStart = Math.floor((DURATION - 1.8) * SR);
for (let i = fadeStart; i < N; i++) {
  const t = (i - fadeStart) / (N - fadeStart);
  const f = 1 - t;
  left[i]  *= f;
  right[i] *= f;
}

// Fade-in 0.3 s
const fadeInEnd = Math.floor(0.3 * SR);
for (let i = 0; i < fadeInEnd; i++) {
  const f = i / fadeInEnd;
  left[i]  *= f;
  right[i] *= f;
}

let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const gain = 0.88 / peak;

// ── Écriture WAV ─────────────────────────────────────────────────────────────
const CHANNELS = 2;
const dataSize = N * CHANNELS * 2;
const wavBuf   = Buffer.alloc(44 + dataSize);
let off = 0;

const w4  = (s) => { wavBuf.write(s, off, "ascii"); off += 4; };
const u32 = (v) => { wavBuf.writeUInt32LE(v, off);  off += 4; };
const u16 = (v) => { wavBuf.writeUInt16LE(v, off);  off += 2; };
const i16 = (v) => { wavBuf.writeInt16LE(clamp(Math.round(v * 32767), -32768, 32767), off); off += 2; };

w4("RIFF"); u32(36 + dataSize); w4("WAVE");
w4("fmt "); u32(16); u16(1); u16(CHANNELS);
u32(SR); u32(SR * CHANNELS * 2); u16(CHANNELS * 2); u16(16);
w4("data"); u32(dataSize);

for (let i = 0; i < N; i++) {
  i16(left[i]  * gain);
  i16(right[i] * gain);
}

const outDir = path.join(__dirname, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "music.wav");
fs.writeFileSync(outPath, wavBuf);
console.log(`✅ Trap/cinematic audio : ${outPath} (${(wavBuf.length / 1024).toFixed(0)} KB)`);
