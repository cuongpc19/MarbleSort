// Procedural toy-puzzle sound effects. Web Audio keeps the game asset-free and scales
// cleanly on mobile; the context is resumed only after a user gesture.
const STORE_KEY = "ls_sound";
let enabled = localStorage.getItem(STORE_KEY) !== "0";
let audio = null;
let bus = null;
let lastCatch = -Infinity;

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
        note(250, 0, 0.14, "triangle", 0.055, 145);
        melody([523, 659, 784, 988].slice(0, Math.max(1, Math.min(4, amount))), 0.075, 0.12, 0.045);
        break;
      case "belt": {
        const n = Math.max(1, Math.min(2, amount));
        for (let i = 0; i < n; i++) note(i ? 820 : 690, i * 0.045, 0.055, "triangle", 0.026, i ? 690 : 560);
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
      case "deliver": melody([659, 784, 988], 0.075, 0.19, 0.05); break;
      case "win": melody([523, 659, 784, 1047, 1319], 0.13, 0.28, 0.055); break;
      case "lose": melody([494, 392, 330], 0.16, 0.28, 0.04); break;
      case "blocked": note(180, 0, 0.07, "triangle", 0.025, 125); break;
      default: break;
    }
  },
};
