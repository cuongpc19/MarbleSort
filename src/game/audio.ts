// All sound is synthesised — no audio files to load, and a bead "tick" that fires
// several times a second stays free of the decode/instance cost sample playback has.

import { save } from "./save";

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (save.muted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = {
  freq: number;
  to?: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

function play({ freq, to, dur, type = "sine", gain = 0.16, delay = 0 }: Tone) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to != null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Rising pitch as a block fills, so the ear tracks progress without reading the %. */
export const sfx = {
  collect(progress: number) {
    play({ freq: 520 + progress * 420, dur: 0.07, type: "triangle", gain: 0.07 });
  },
  pick() {
    play({ freq: 380, to: 620, dur: 0.1, type: "square", gain: 0.08 });
  },
  deny() {
    play({ freq: 220, to: 150, dur: 0.14, type: "sawtooth", gain: 0.07 });
  },
  complete() {
    [660, 880, 1180].forEach((f, i) =>
      play({ freq: f, dur: 0.16, type: "triangle", gain: 0.12, delay: i * 0.06 }),
    );
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) =>
      play({ freq: f, dur: 0.32, type: "triangle", gain: 0.14, delay: i * 0.11 }),
    );
  },
  booster() {
    play({ freq: 300, to: 1200, dur: 0.28, type: "sine", gain: 0.12 });
  },
};
