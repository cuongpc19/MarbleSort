// Procedural toy-puzzle sound effects. Web Audio keeps the game asset-free and scales
// cleanly on mobile; the context is resumed only after a user gesture.
const STORE_KEY = "ls_sound";
let enabled = localStorage.getItem(STORE_KEY) !== "0";
let audio = null;
let bus = null;
let lastCatch = -Infinity;
let lastBelt = -Infinity;

function context() {
  if (!audio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audio = new AudioContext();
    bus = audio.createGain();
    bus.gain.value = 0.72;
    bus.connect(audio.destination);
  }
  if (audio.state === "suspended") audio.resume().catch(() => {});
  return audio;
}

function note(freq, delay = 0, duration = 0.11, wave = "sine", volume = 0.065, endFreq = freq) {
  const ctx = context();
  if (!ctx || !enabled) return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(volume, start + 0.009);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(bus);
  osc.start(start);
  osc.stop(start + duration + 0.015);
}

// Firework sounds: filtered noise. One shared buffer of white noise, made on first use.
let noiseBuf = null;
function noise(delay, duration, volume, from, to, type = "lowpass") {
  const ctx = context();
  if (!ctx || !enabled) return;
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const start = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + duration);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(volume, start + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter); filter.connect(amp); amp.connect(bus);
  src.start(start, Math.random() * 0.5);
  src.stop(start + duration + 0.02);
}
let lastBoom = -Infinity;

function melody(notes, spacing = 0.085, duration = 0.16, volume = 0.055) {
  notes.forEach((freq, i) => note(freq, i * spacing, duration, "sine", volume));
}

export const sound = {
  isEnabled: () => enabled,
  toggle() {
    enabled = !enabled;
    localStorage.setItem(STORE_KEY, enabled ? "1" : "0");
    if (enabled) this.play("ui");
    return enabled;
  },
  unlock() { if (enabled) context(); },
  play(name, amount = 1) {
    if (!enabled || !context()) return;
    switch (name) {
      case "ui": melody([740, 988], 0.045, 0.075, 0.035); break;
      case "pour":
        // Wrapper opens, then four bright candy pieces spill out in sequence.
        note(310, 0, 0.11, "triangle", 0.045, 190);
        melody([587, 698, 880, 1047].slice(0, Math.max(1, Math.min(4, amount))), 0.068, 0.10, 0.04);
        break;
      case "belt": {
        const now = performance.now();
        if (now - lastBelt < 90) return;
        lastBelt = now;
        const n = Math.max(1, Math.min(2, amount));
        for (let i = 0; i < n; i++) note(i ? 920 : 760, i * 0.038, 0.048, "sine", 0.022, i ? 780 : 630);
        break;
      }
      case "catch": {
        const now = performance.now();
        if (now - lastCatch < 105) return;
        lastCatch = now;
        note(880, 0, 0.105, "sine", 0.035);
        note(1320, 0.012, 0.09, "sine", 0.018);
        break;
      }
      case "Undo": melody([784, 659, 587], 0.055, 0.11, 0.045); break;
      case "Shuffle": melody([523, 659, 784, 1047], 0.045, 0.09, 0.04); break;
      case "ConveyorCapacity": melody([523, 659, 784], 0.09, 0.16, 0.05); break;
      case "Capacity":
        note(330, 0, 0.18, "triangle", 0.045, 510);
        melody([659, 784], 0.07, 0.12, 0.04);
        break;
      case "revive": melody([392, 523, 659, 784], 0.09, 0.18, 0.045); break;
      case "deliver":
        // Soft carton close followed by a small confectionery sparkle.
        note(190, 0, 0.09, "triangle", 0.04, 115);
        melody([659, 831, 1047, 1319], 0.055, 0.15, 0.045);
        break;
      case "win": melody([523, 659, 784, 1047, 1319], 0.13, 0.28, 0.055); break;
      // Rocket going up: a rising hiss.
      case "launch": noise(0, 0.42, 0.05 * amount, 900, 5200, "bandpass"); break;
      // Firework burst: a deep thump, a noisy crack, then a tail of crackles.
      case "boom": {
        const now = performance.now();
        if (now - lastBoom < 70) return;
        lastBoom = now;
        const k = Math.max(0.4, Math.min(1.4, amount));
        note(95, 0, 0.5, "sine", 0.16 * k, 38);
        noise(0, 0.55, 0.22 * k, 2600, 180);
        for (let i = 0; i < 6; i++) noise(0.16 + i * 0.07 + Math.random() * 0.05, 0.05, 0.05 * k, 6000, 2500, "highpass");
        break;
      }
      case "lose": melody([494, 392, 330], 0.16, 0.28, 0.04); break;
      case "blocked": note(180, 0, 0.07, "triangle", 0.025, 125); break;
      default: break;
    }
  },
};
