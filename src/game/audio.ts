// All sound is synthesised — no audio files to load, and a bead "tick" that fires
// several times a second stays free of the decode/instance cost sample playback has.

import { save } from "./save";
import { platform } from "../platform";

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  // ⚠ The host's mute **outranks** the in-game toggle — their rules say so explicitly, and a
  // player who muted the page must not get sound back by tapping the speaker in here. Checked
  // live on every sound rather than mirrored into a flag: every sound in this game is a
  // one-shot, so there is no loop already playing that a change event would have to catch.
  if (save.muted || platform.hostMuted()) return null;
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

/**
 * One output stage for the whole game: a master gain into a limiter into the speakers.
 *
 * ⚠ **The limiter is what makes the volume raisable at all.** Every sound used to connect
 * straight to `destination`, so the only safe level was one where the worst pile-up — a box
 * clearing while the chute is rattling — still came in under 1.0. That worst case is rare and it
 * was setting the level for the other 99% of the game, which is why everything was too quiet.
 * With a limiter the normal case can sit where it belongs and the pile-up gets squashed instead
 * of hard-clipped, which is the one distortion a browser will not do gracefully.
 *
 * ⚠ Cached against the context, not in a module-level `let` alone — `ac()` can build a fresh
 * `AudioContext`, and a master node from the old one is silently connected to nothing.
 */
let master: GainNode | null = null;
let masterFor: AudioContext | null = null;

/**
 * ⚠ **One number for the whole game's volume, and it is the only place to change it.** Measured
 * against the worst realistic stack — a box clearing at the top of its chain on top of a chute
 * knock — 3.0 peaks at **0.39**, and the loudest single sound in the game, `win`, at **0.43**.
 * Both sit under the limiter's 0.50 threshold, so nothing is being squashed in normal play and
 * the limiter is doing what it is there for: catching the rare stack rather than setting the
 * level for everything else.
 *
 * Net effect against what shipped: knocks **11x** louder, tones 3x. That is not a slip — it is
 * what the reference measures. Over its 547 onsets the tonal sounds peak at a median of 0.409
 * and the whole set at 0.410: in that machine **a marble knock and a chime are the same
 * loudness**, and here the knocks were quieter than the chimes by the 2.8x normalisation error
 * on top of a bus that was quiet anyway.
 */
const MASTER = 3.0;

function out(a: AudioContext): AudioNode {
  if (master && masterFor === a) return master;
  const g = a.createGain();
  g.gain.value = MASTER;
  const lim = a.createDynamicsCompressor();
  lim.threshold.value = -6;
  lim.knee.value = 3;
  lim.ratio.value = 12;
  lim.attack.value = 0.002;
  lim.release.value = 0.1;
  g.connect(lim).connect(a.destination);
  master = g;
  masterFor = a;
  return g;
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
  osc.connect(g).connect(out(a));
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/**
 * A struck, pitched blip — the marble sound this machine is actually made of.
 *
 * ⚠ **It is a tone, not filtered noise, and getting that wrong is what made the first attempt
 * sound nothing like the reference.** Isolated one-shots in `Manythings/IMG_6564.MP4` (36 of them
 * with a clear 250 ms of silence in front, so nothing is contaminating the window) are **near-pure
 * sines**: at 431 Hz the second harmonic is **1.2%** of the fundamental and the inharmonic residue
 * between the partials is 1.1%. Filtered noise cannot be that.
 *
 * ⚠ **Matching octave bands is the wrong test**, and it is the mistake that produced the noise
 * version: a noise burst and a sine at the same pitch can share a band profile exactly and sound
 * nothing alike. The first pass ground a 0.095 band error down to 0.022 and was still wrong,
 * because band energy is the *envelope* of a spectrum and what separates these is its *structure*.
 * Check the harmonic series and the inharmonic residue, not the bands.
 *
 * Two families, and they are different instruments:
 * - **low** (24 of 36, median 210 Hz): second harmonic at **0.65** — warm, a struck body.
 * - **high** (12 of 36, median 371 Hz): second harmonic **0.06** — a clean sine.
 *
 * Attack is 5-13 ms; decay to -20 dB is 20-55 ms (p50 22). `play`'s exponential runs to -80 dB
 * over `dur`, so -20 dB lands at `dur / 4` — a 45 ms decay is a `dur` of 0.18.
 */
function struck(freq: number, gain: number, dur: number, partials: number[]) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime;
  // ⚠ **Normalised by the partial sum, so `gain` means peak amplitude.** Harmonics add coherently
  // at the attack, so the bell's [1, 0.68, 0.21, 0.1] peaks at nearly twice its nominal gain —
  // the same trap `clack` fell into from the other direction, where `gain` meant 0.356 of a peak.
  // One convention across every sound in the file or they cannot be balanced by reading it.
  const norm = partials.reduce((t, v) => t + v, 0) || 1;
  partials.forEach((amp, i) => {
    if (amp <= 0.002) return;
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * (i + 1), t0);
    // ⚠ 3 ms, not the 12 ms `play` uses. These are struck objects; a 12 ms ramp on a 45 ms sound
    // is a third of it spent arriving, which is the difference between a knock and a blown note.
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime((gain * amp) / norm, t0 + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(out(a));
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  });
}

/**
 * The contact itself: 4 ms of noise under a blip, so a marble sounds like it *hit* something
 * rather than being played on a keyboard. Deliberately tiny — the reference's inharmonic residue
 * is 1-3% of the fundamental, so this is seasoning, not the dish.
 */
function tick(gain: number, rate: number) {
  const a = ac();
  if (!a) return;
  const len = Math.floor(a.sampleRate * 0.02);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 7);
  const src = a.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate;
  const bp = a.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1400 * rate;
  bp.Q.value = 0.9;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(out(a));
  src.start();
}

/**
 * The notes the machine plays. ⚠ Taken from the reference's own inventory, not chosen: across the
 * 36 clean one-shots the pitches are A3 (8x), D#3, F#3, E4, C5, F#4, A4, C4, F3, D4, G3, B3 and a
 * handful below — centred on **A**, and A minor pentatonic covers the bulk of them.
 *
 * ⚠ **Drawn at random per knock, and that is the point.** The rhythm already comes from real
 * Matter collisions; the pitch coming from a set rather than from `playbackRate` is what turns a
 * pile of marbles into the sound this game is remembered for. Fixed pitch per event would be a
 * ringtone; a continuous random pitch is a slide whistle.
 */
/**
 * ⚠ **Marble notes climb; they are not drawn at random.** Inside a run — consecutive sounds less
 * than 600 ms apart — the reference goes **up 50% of the time against down 35%**, in steps of
 * 1-3 semitones, i.e. one rung of a pentatonic. Random notes off the same five-note set have the
 * same histogram and sound aimless, which is the difference between a melody and a bag of pitches;
 * it was the first thing reported about the tone version and it is not something a spectrum shows.
 *
 * The ladder wraps rather than climbing forever — a nine-marble pour would otherwise cover two
 * octaves — and the reference resets mid-run too (291 -> 215 Hz is right there in the data). It
 * drops back to the bottom after `LADDER_MS` of quiet, which is the same shape `CHAIN_STEPS` uses
 * for boxes and for the same reason: a pause is what separates one gesture from the next.
 */
/** What counts as a busy rail, for `roll`'s density. Not imported — audio must not
 * depend on the board's constants, and being a few slots out changes nothing audible. */
const BELT_FULL = 30;
const RUNG = [196, 220, 262, 294, 330, 392, 440];
/**
 * The same seven rungs an octave and a bit up, for the sound that carries the tune. ⚠ Written out
 * rather than `RUNG[i] * 1.5`: a pentatonic multiplied by a fifth is a *different* pentatonic and
 * quietly imports a note the rest of the game never plays. Its median, 440, sits near the 371 Hz
 * measured for the reference's clean-sine family.
 */
const SEAT = [294, 330, 392, 440, 523, 587, 659];

/**
 * Whether a marble landing in a box makes a sound at all. **Off**, on instruction, and it is one
 * word to put back rather than deleted code.
 *
 * ⚠ **This is the loudest thing in the game by count, not by level.** By the reference's own
 * arithmetic a seating is ~350 of its ~507 sounds, so switching it off does not remove a sound —
 * it removes about two thirds of them, and it takes the tune with it: `seat` was the only caller
 * that climbed the ladder. What is left is the chute's two fixed low rungs, the belt's half a
 * sound a second, the pour, and the box-clear bell. That is a much sparser machine, closer to a
 * physical one and further from the reference. Both are defensible; this is a choice about the
 * game, not a fix.
 */
const SEAT_SOUND = false;
/**
 * Whether marbles riding the belt make a sound. **Off, temporarily, on instruction** ("tạm thời
 * tắt tiếng bi lăn") — same convention as `SEAT_SOUND`: one word to put back, not deleted code.
 * The gain it comes back at is on `roll` itself (0.035-0.06, raised twice before the switch-off).
 */
const ROLL_SOUND = false;
const LADDER_MS = 700;
let rung = 0;
let rungAt = 0;
/** Advances the ladder and returns the rung **index**, so both registers stay in step. */
function climb(): number {
  const now = performance.now();
  rung = now - rungAt < LADDER_MS ? (rung + 1) % RUNG.length : 0;
  rungAt = now;
  return rung;
}

/**
 * Boxes popping off close together read as one run, and the bell climbs a step per box.
 *
 * ⚠ The ladder is **pentatonic**, not chromatic or a plain ratio. A run's length is decided by
 * how the player set the belt up, so any number of steps has to land somewhere consonant — a
 * chromatic climb turns a five-box run into a siren.
 *
 * ⚠ It is **minor** pentatonic on A, and that is measured. Every tonal sound in the reference —
 * the 41 events there whose decay runs past 180 ms — lands on A3 220.7, C4 263.8, E4 328.4 or
 * C5 522.2 Hz, plus low bodies on D3, E3, F3 and G3. That is A C D E G, and reading it as major
 * pentatonic on C (the old ladder: 1, 9/8, 5/4, 3/2, 5/3) puts a run on C D E G A, which is the
 * same five notes voiced so the *root* is the major one. Rooting it on A is what carries their
 * flavour rather than only their pitch set.
 *
 * The window is measured from the *previous box*, not from the start of the run, so a steady
 * stream of clears keeps climbing and a pause anywhere drops back to the bottom note.
 */
const CHAIN_MS = 1000;
const CHAIN_STEPS = [1, 6 / 5, 4 / 3, 3 / 2, 9 / 5, 2, 12 / 5, 8 / 3];

/**
 * ⚠ **The register came down an octave, and it was the second measured correction.** The bell was
 * struck at 784 Hz (G5) with a fifth at 1176; the reference's own bells sit at **220-523 Hz**,
 * which is where a marble machine made of plastic tubs belongs. High and thin is what a UI chime
 * sounds like; this has to sound like a thing.
 */
const BELL = 220;
let chainAt = 0;
let chain = 0;

export const sfx = {
  /**
   * ⚠ **The second sound of a marble landing in a box.** `GameScene` fires this *and* `seat` for
   * the same event, from two different eras of the code: this one came in with the scaffolding
   * ("rising pitch as a block fills") and `seat` was written later for the same moment without
   * the first being removed. Switching `SEAT_SOUND` off and still hearing the landing is what
   * turned it up.
   *
   * It also means the density measured against the reference was understated: every seating was
   * counted once and produced two sounds, so the real figure was higher than the 4.97/s the
   * simulation reported.
   */
  collect(progress: number) {
    if (!SEAT_SOUND) return;
    play({ freq: 520 + progress * 420, dur: 0.07, type: "triangle", gain: 0.07 });
  },
  /**
   * ⚠ **A plain UI tick, on instruction** — "chỉ cần tiếng Tick đơn giản như các game khác". The
   * old 380→620 Hz square sweep was a sci-fi bleep on a machine whose every other sound is a
   * struck object. Every UI button shares this (Home's PLAY, the daily calendar, the pause/skip
   * buttons), so one definition keeps them one voice.
   *
   * The noise tick alone vanishes on a phone speaker, so a very short E5 sine rides under it —
   * E is in the A-minor pentatonic everything else here plays, and at `dur` 0.06 it is gone in
   * ~15 ms: a click with a pitch, not a note.
   */
  pick() {
    tick(0.1, 1.5);
    struck(660, 0.045, 0.06, [1, 0.05]);
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

  /**
   * A tray tipping its marbles into the chute.
   *
   * ⚠ **Not a whoosh.** This was a 640 → 280 Hz triangle sweep, and the reference has no such
   * thing: measured over its 39 tray pours, what the tap adds is a lift in the **200-800 Hz**
   * band about 100 ms in and nothing above 1 kHz at all. A sweep is a UI sound; what the machine
   * makes is a slab of marbles letting go and hitting the chute.
   *
   * ⚠ **And it does not add a rattle.** Onset density around those 39 pours is *flat* — 0.5 per
   * 100 ms before the tap and 0.5 after. The marbles are already falling all the time, so the
   * pour is a thump and the physics supplies the rest through `tumble`. Four hand-placed knocks
   * would be the one rhythm in the game that is the same every time.
   */
  release() {
    // ⚠ Reworked on instruction ("thử thay tiếng khi user click vào khay"). The old body was the
    // 102 Hz slab alone at 0.13 — nearly all of it *below* the 200-800 Hz band the reference's own
    // pours measure in, so on a phone speaker the tap was mostly rumble and barely read as
    // feedback. Now the knock leads: a latch tick and a struck A3 — A3 being the reference's most
    // common pitch, 8 of its 36 clean one-shots — with the old low body kept underneath at half
    // level for the weight of the slab. Still a thump plus a knock, still no sweep and no rattle;
    // the two warnings above stand.
    tick(0.05, 1.1);
    struck(220, 0.1, 0.22, [1, 0.62, 0.18]);
    struck(102, 0.05, 0.35, [1, 0.43, 0.77, 0.45]);
    setTimeout(() => struck(RUNG[climb()], 0.08, 0.18, [1, 0.6, 0.2]), 60 + Math.random() * 40);
  },

  /**
   * Marbles riding the belt — one soft knock or two per tick, never a loop.
   *
   * ⚠ **Driven by occupancy, not by the clock.** One knock per tick would be a metronome, and the
   * belt ticks on a fixed interval; `n` is how many marbles are actually on the rail, so a busy
   * belt patters and an empty one is silent. The offsets are random inside the tick for the same
   * reason the chute knocks come off real collisions: the rhythm must never be the same twice.
   *
   * ⚠ Quiet enough to sit under everything else. This is the only sound in the game that plays
   * while the player is doing nothing, so it is texture, not an event — and it is the reason the
   * reference is never silent while marbles are moving.
   */
  roll(n: number, ms: number) {
    if (!ROLL_SOUND) return;
    if (n <= 0) return;
    // ⚠ **Roughly one every four ticks on a full belt, not one or two every tick.** The reference
    // plays **2.97 sounds a second** over its whole clip, 7/s at the 90th percentile and 15/s at
    // its busiest single second; two a tick is 12/s *sustained* on its own, and stacked on the
    // chute it put us near 34/s. That is a wall rather than a rhythm, and it is most of what was
    // wrong with how this felt. The reference has no belt sound at all by that accounting, so
    // this is our own addition and it is kept to about half a sound a second.
    if (Math.random() > n / (BELT_FULL * 8)) return;
    // ⚠ It does **not** advance the ladder. The belt runs the whole level; letting it climb would
    // leave the chute's own runs starting from wherever the rail happened to leave off.
    // Raised twice on instruction ("cho tiếng bi lăn... lớn hơn 1 chút", then "tăng thêm 1 chút"):
    // 0.022-0.038 → 0.028-0.048 → 0.035-0.06. Still texture, still under tumble's 0.055-0.11.
    const g = 0.035 + Math.random() * 0.025;
    setTimeout(() => struck(RUNG[0] / 2, g, 0.15, [1, 0.5, 0.15]), Math.random() * ms * 0.8);
  },

  /**
   * One marble knocking something on the way down. Driven off real Matter collisions and
   * rate-limited by the caller — the whole point of the physics is that this never plays the
   * same rhythm twice, so it must not be a loop.
   */
  tumble(strength: number) {
    // ⚠ **The chute does not carry the melody, and it must not climb.** Count what the reference
    // actually plays: 39 tray pours x 9 marbles = 351 seatings, 117 box clears (101 detected) and
    // 39 pours — **507 sounds against the 547 onsets measured**. Almost every sound in that game
    // is a marble *landing in a box*. The chute is close to silent, and once every marble sound
    // became a note, giving the physics one too made the machine play chords at itself.
    // So: a quiet low body, two fixed rungs, and `seat` owns the tune.
    // ⚠ `dur` 0.18 puts -20 dB at ~44 ms, which is the low family's measured decay.
    // Raised twice on instruction, same requests as `roll`: 0.035-0.07 → 0.045-0.09 → 0.055-0.11.
    // ⚠ Post-master the hardest knock is now 0.33 — the loudest single sound in the game, above
    // the halved bell. That is the declared intent (the marbles ARE the game); anything further
    // should come with the limiter arithmetic re-done.
    const g = 0.055 + Math.min(0.055, strength * 0.03);
    struck(RUNG[Math.random() < 0.5 ? 0 : 1] / 2, g, 0.18, [1, 0.65, 0.2]);
    tick(g * 0.3, 0.9 + Math.random() * 0.5);
  },

  /**
   * A marble dropping into its hole — pitch climbs with the hole it filled.
   * ⚠ The tone came down with the bell: E4 to G4 rather than 480-780 Hz, so the three holes and
   * the pop that follows them are the same instrument.
   */
  seat(_progress: number) {
    if (!SEAT_SOUND) return;
    // The clean-sine family, climbing the pentatonic across the three holes.
    // ⚠ **This is the tune.** One note per marble landing is what the reference is nearly
    // entirely made of, so this is the sound that climbs — not the chute, and not the belt.
    // `progress` is no longer read for pitch: a three-note figure that restarts on every box is
    // shorter than the runs measured in the reference, which climb four to ten steps across
    // several boxes before a pause drops them back.
    // ⚠ `dur` 0.09 -> -20 dB at ~22 ms, the clean family's own decay: these are shorter than
    // the low knocks, not longer.
    struck(SEAT[climb()], 0.085, 0.09, [1, 0.03]);
    tick(0.022, 1.5);
  },

  /**
   * The third marble seating and the box popping off the stack.
   *
   * ⚠ Punctuation, not an event — this fires several times a level. It also has to be *unlike*
   * `complete`: the old version was a rising triangle arpeggio, which is exactly what `complete`
   * is, so the two ran together and a box popping sounded like the level ending. A cork-pop with
   * a struck bell over it reads as an object leaving instead of a fanfare, and the descent
   * contrasts against `seat`, whose pitch has just climbed across the three holes.
   */
  boxClear(): number {
    const now = performance.now();
    chain = now - chainAt < CHAIN_MS ? Math.min(chain + 1, CHAIN_STEPS.length - 1) : 0;
    chainAt = now;
    const step = CHAIN_STEPS[chain];

    // The pop stays put. It is the sound of the *object* leaving, so it should not move — only
    // the bell over it carries the run, or a long chain ends up sounding like a different box.
    // ⚠ All three layers at HALF their measured levels, on instruction ("âm thanh khi clear box,
    // cho nhỏ đi 1 nửa") — the balance between pop and bell is kept, the whole event steps back.
    tick(0.025, 1.35);
    play({ freq: 520, to: 165, dur: 0.08, type: "sine", gain: 0.025 });

    // ⚠ **The bell is the reference's own longest one-shot, harmonic for harmonic.** Measured at
    // 94.88s: 221 Hz with the second at **0.68** and the third at 0.21, decaying to -20 dB in
    // 193 ms — a struck body, not the thin sine the short knocks are. That partial structure is
    // the difference between "a box came off" and a notification chime.
    struck(BELL * step, 0.055, 0.78, [1, 0.68, 0.21, 0.1]);

    // ⚠ Returns how many boxes this run is up to, 1-based, because the scene throws fireworks on
    // the third and there must be **one** definition of "in a row". A second timer in `GameScene`
    // would be measuring the same thing from a different clock: the two drift within a frame or
    // two of `CHAIN_MS`, and the run where the bell climbs but nothing lights up reads as the
    // fireworks being broken. The ear already knows what a run is — let the eye ask it.
    return chain + 1;
  },

  starPop(n: number) {
    play({ freq: 600 + n * 220, dur: 0.24, type: "triangle", gain: 0.13 });
  },
};
