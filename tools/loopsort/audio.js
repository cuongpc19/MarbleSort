// Procedural candy-factory sound effects, in the style of Tube Tangle (Ball sort color
// puzzle): bright synth voices over a short echo for sparkle, filtered-noise bursts for
// wrappers and impacts. Web Audio keeps the game asset-free; the context is resumed only
// after a user gesture.
//
// Asked for on 2026-09-17: "tieng phao hoa keu qua. thay doi am thanh het level nhu Tube
// game" and "bo am thanh hien tai chua kieu game va chua kieu keo lam". So the fireworks
// are Tube Tangle's quiet whistle + thump, the win is its "ta-daa" with a chime per star and
// coins, and the in-game sounds are poppy and sugary: wrapper crinkle, bubbly blops, a
// rising chime when a box fills.
const STORE_KEY = "ls_sound";
let enabled = localStorage.getItem(STORE_KEY) !== "0";
let ctx = null, bus = null, echo = null, noiseBuf = null;
const last = {};

function context() {
  if (!ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.62;
    // ⚠ Loc phan CHOI truoc loa (chu du an 2026-09-18: "am thanh hien tai nghe hoi nhuc"). Tren
    // ~5kHz gan nhu khong mang thong tin gi trong bo am nay, ma do la dung dai tai nguoi nghe
    // thay gat nhat; cat bot thi moi tieng van ro ma nghe tron.
    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass"; soft.frequency.value = 5200; soft.Q.value = 0.7;
    const tilt = ctx.createBiquadFilter();
    tilt.type = "highshelf"; tilt.frequency.value = 2400; tilt.gain.value = -6;
    master.connect(soft); soft.connect(tilt); tilt.connect(ctx.destination);
    bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(master);
    // a short feedback delay gives every chime a bit of sparkle
    echo = ctx.createDelay(0.6);
    const fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain();
    echo.delayTime.value = 0.17;
    fb.gain.value = 0.25;
    lp.type = "lowpass"; lp.frequency.value = 2800;
    wet.gain.value = 0.45;
    echo.connect(lp); lp.connect(fb); fb.connect(echo);
    echo.connect(wet); wet.connect(master);
    const len = Math.floor(ctx.sampleRate * 0.5);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// One synth voice.
function tone({ f, f2, dur, type = "sine", vol = 0.15, at = 0, atk = 0.006, wet = 0 }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f, t);
  if (f2) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g); g.connect(bus);
  if (wet) { const s = ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(echo); }
  osc.start(t); osc.stop(t + dur + 0.03);
}

// Filtered noise burst: wrappers, clicks, impacts.
function hiss({ f = 1800, f2, dur, vol = 0.1, q = 1.2, type = "bandpass", at = 0 }) {
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const flt = ctx.createBiquadFilter();
  flt.type = type; flt.Q.value = q;
  flt.frequency.setValueAtTime(f, t);
  if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(flt); flt.connect(g); g.connect(bus);
  src.start(t, Math.random() * 0.3); src.stop(t + dur + 0.02);
}

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
// Rate limit per sound: a pour releases dozens of candies a second.
function every(name, ms) {
  const now = performance.now();
  if (now - (last[name] || -Infinity) < ms) return false;
  last[name] = now;
  return true;
}
let catchStep = 0;

const SFX = {
  // button tap
  ui() { tone({ f: 740, f2: 990, dur: 0.07, type: "sine", vol: 0.05, atk: 0.008 }); },
  // a box opens: wrapper crinkle, then a bubbly cascade of candy
  pour(n) {
    hiss({ f: 2600, f2: 1300, dur: 0.14, vol: 0.05, q: 0.8, type: "lowpass" });
    hiss({ f: 1800, f2: 2600, dur: 0.08, vol: 0.03, at: 0.05, type: "lowpass" });
    const k = Math.max(1, Math.min(3, n || 1));
    [0, 4, 7, 12].forEach((s, i) =>
      tone({ f: midi(67 + s), f2: midi(67 + s) * 1.5, dur: 0.1, vol: 0.09 + k * 0.01, at: 0.04 + i * 0.05, wet: 0.12 }));
  },
  // candies spilling onto the belt: soft sugary rattle
  belt() {
    if (!every("belt", 110)) return;
    hiss({ f: 1600 + Math.random() * 700, dur: 0.05, vol: 0.022, q: 1.4, type: "lowpass" });
    tone({ f: 620 + Math.random() * 260, f2: 430, dur: 0.06, vol: 0.022, atk: 0.01 });
  },
  // a candy lands in a box: springy blop that climbs a scale as candy keeps arriving
  catch() {
    if (!every("catch", 95)) return;
    catchStep = (catchStep + 1) % 8;
    const base = midi(72 + [0, 2, 4, 5, 7, 9, 11, 12][catchStep]);
    tone({ f: base * 0.7, f2: base * 0.44, dur: 0.16, vol: 0.1, atk: 0.008 });
    tone({ f: base * 1.35, f2: base * 0.85, dur: 0.09, type: "sine", vol: 0.035, atk: 0.008 });
  },
  // a box is fully packed: lid clunk + bright rising arpeggio
  box() {
    tone({ f: 210, f2: 130, dur: 0.14, type: "sine", vol: 0.11, atk: 0.006 });
    hiss({ f: 900, f2: 300, dur: 0.09, vol: 0.05, q: 0.8, type: "lowpass" });
    [60, 64, 67, 72].forEach((n, k) => tone({ f: midi(n), dur: 0.26, type: "sine", vol: 0.075, at: 0.04 + k * 0.06, wet: 0.25 }));
  },
  // a whole tray delivered: bigger sparkle
  deliver() {
    tone({ f: 180, f2: 115, dur: 0.16, type: "sine", vol: 0.11 });
    [64, 67, 72, 76, 79].forEach((n, k) => tone({ f: midi(n), dur: 0.34, type: "sine", vol: 0.085, at: 0.05 + k * 0.065, wet: 0.3 }));
  },
  // comedic "wah-wah" for a move that is not allowed
  // mot tieng "buop" tron, khong phai tieng u-u gat
  blocked() {
    tone({ f: 330, f2: 180, dur: 0.16, type: "sine", vol: 0.07, atk: 0.01 });
    tone({ f: 165, f2: 95, dur: 0.2, type: "triangle", vol: 0.03, atk: 0.012 });
  },
  whoosh() { hiss({ f: 400, f2: 1500, dur: 0.2, vol: 0.045, q: 0.7, type: "lowpass" }); },
  Undo() { SFX.whoosh(); [79, 76, 72].forEach((n, k) => tone({ f: midi(n), dur: 0.12, type: "triangle", vol: 0.09, at: 0.05 + k * 0.05 })); },
  Shuffle() { for (let i = 0; i < 5; i++) hiss({ f: 1200 + i * 260, dur: 0.06, vol: 0.035, q: 1.2, type: "lowpass", at: i * 0.05 }); tone({ f: 520, f2: 980, dur: 0.28, vol: 0.05, wet: 0.2 }); },
  ConveyorCapacity() { SFX.whoosh(); [72, 79, 84].forEach((n, k) => tone({ f: midi(n), dur: 0.2, type: "triangle", vol: 0.1, at: 0.06 + k * 0.07, wet: 0.3 })); },
  Capacity() { tone({ f: 180, f2: 420, dur: 0.2, type: "triangle", vol: 0.12 }); [76, 81, 88].forEach((n, k) => tone({ f: midi(n), dur: 0.22, type: "triangle", vol: 0.1, at: 0.12 + k * 0.07, wet: 0.3 })); },
  revive() { [67, 72, 76, 79, 84].forEach((n, k) => tone({ f: midi(n), dur: 0.3, type: "triangle", vol: 0.11, at: k * 0.08, wet: 0.35 })); },
  // full "ta-daa"
  win() {
    [[60, 0], [64, 0.1], [67, 0.2], [72, 0.32], [76, 0.32]].forEach(([n, at]) => {
      tone({ f: midi(n), dur: 0.6, type: "sine", vol: 0.11, at, wet: 0.3 });
      tone({ f: midi(n - 12), dur: 0.55, vol: 0.05, at });
    });
  },
  // one star landing on the result card (amount = which star, 0-2)
  star(i) {
    tone({ f: midi(67 + i * 4), dur: 0.34, type: "sine", vol: 0.12, wet: 0.3, atk: 0.01 });
    tone({ f: midi(79 + i * 4), dur: 0.18, vol: 0.04, atk: 0.01 });
  },
  // coins into the wallet
  coin() { [0, 0.08, 0.16].forEach((at, k) => tone({ f: 780 + k * 150, dur: 0.13, type: "sine", vol: 0.09, at, wet: 0.25, atk: 0.01 })); },
  lose() { [67, 63, 60].forEach((n, k) => tone({ f: midi(n), f2: midi(n) * 0.97, dur: 0.3, type: "triangle", vol: 0.09, at: k * 0.16 })); },
  // firework shell going up / going off - Tube Tangle's sounds, kept quiet
  launch() { if (every("launch", 120)) tone({ f: 300, f2: 820, dur: 0.45, vol: 0.025, atk: 0.09 }); },
  boom() {
    if (!every("boom", 120)) return;
    tone({ f: 88, f2: 34, dur: 0.36, vol: 0.12, atk: 0.008 });
    hiss({ f: 900, f2: 140, dur: 0.4, vol: 0.05, q: 0.6, type: "lowpass" });
    for (let i = 0; i < 4; i++) hiss({ f: 1200 + Math.random() * 900, dur: 0.05, vol: 0.016, q: 1.5, type: "lowpass", at: 0.12 + Math.random() * 0.4 });
  },
};

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
    if (!enabled || !context() || !SFX[name]) return;
    SFX[name](amount);
  },
};
