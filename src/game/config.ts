// Every tunable number the game is built on. Layout lives here too, in *design units*
// (a 540-wide portrait box); GameScene draws into a container scaled to the real canvas,
// so nothing below ever has to know the device pixel ratio.
//
// The one rule: logic.ts and level.ts must stay importable from plain Node (the headless
// sim drives them), so this file must never import Phaser.

export const GAME_W = 540;

/**
 * The design box is 540 wide and **flexes in height** to the frame it is running in.
 *
 * Why it cannot stay a constant: Phaser's FIT scaler grows the design box until one axis fills
 * the frame, and in any 16:9 frame — which is every iframe size the host uses — that axis is the
 * height. The width is then whatever the ratio leaves: `width = height × (GAME_W / GAME_H)`. At a
 * fixed 1160 that is 0.466, so the game rendered as a 298px ribbon down the middle of a 1243px
 * page while three quarters of the frame sat empty. Nothing had shrunk; a taller, thinner box
 * scaled to the same height is simply narrower.
 *
 * ⚠ **The clamp is what makes it safe, and both ends are measured, not chosen.**
 *
 * `MAX` is today's shape, so a tall phone gets exactly the layout every art decision was made
 * against — this must not become a redesign of the phone build.
 *
 * `MIN` is where the machine physically ends: `L.machine.y + L.machine.h` = 1066, plus a 14px
 * skirt. Everything below that was empty violet. Going tighter would mean cutting real content,
 * and the only content left to cut is load-bearing — the chute is 186px at a 33° cone and
 * shortening it stops the marbles sliding (see the note on `funnel`), and the grid is five rows
 * at pitch 71.
 *
 * ⚠ So the flex is 1080…1160, worth about 7% on a desktop frame and nothing at all on a phone.
 * Matching the sibling project's 0.625 would need `GAME_H` near 864, which is less than the grid
 * and the chute alone — that is a second layout (the box well beside the machine rather than
 * under it), not a number.
 *
 * ⚠ Read **once**, at module load. A mid-session resize does not re-run it: the Phaser canvas is
 * built from this value, so changing it later would mean rebuilding the game. Rotating a phone
 * keeps the shape it booted with, which is the same behaviour the sibling project ships.
 *
 * ⚠ The `typeof window` guard is not defensive dressing — `logic.ts` and `level.ts` import this
 * file and the headless sim runs them in plain Node. Without it every script dies at import.
 */
const H_MAX = 1160;
const H_MIN = 1080;
const _aspect =
  typeof window !== "undefined" && window.innerWidth > 0
    ? window.innerHeight / window.innerWidth
    : H_MAX / GAME_W;
export const GAME_H = Math.round(
  GAME_W * Math.min(Math.max(_aspect, H_MIN / GAME_W), H_MAX / GAME_W),
);

// ── Core rules ───────────────────────────────────────────────────────────────
/**
 * Marbles packed into one tray tile — the single biggest lever on how hot the belt runs.
 * One box only takes BOX_SLOTS, so a tray needs TRAY_N / BOX_SLOTS boxes of its colour open
 * at once or the remainder strands on the belt.
 *
 * Nine, matching the reference machine and the nine eggs drawn on the tile. It is expensive:
 * on the belt of 30 that suited trays of six, it drops the greedy bot to 45%. Paid for by
 * widening the belt to 36 (marbles down to r=12) and cutting the tray cap 16 → 11, which
 * leaves total marbles per level almost unchanged (11 x 9 = 99 against 16 x 6 = 96).
 */
export const TRAY_N = 9;
/** Holes in one box. Fill them all and the box pops off, exposing the next one below. */
export const BOX_SLOTS = 3;
/** Box columns at the bottom of the machine. Also the number of simultaneously open colours. */
export const BOX_COLS = 4;
/**
 * Positions on the conveyor ring. This is the whole difficulty budget — fill it and you lose.
 *
 * Must stay a multiple of 2*CLEAT_GROUP: there is exactly one cleat per slot so every marble
 * sits dead centre in a hole, which means the dark/light banding has to close cleanly around
 * the loop or a seam travels round the belt forever. 30 = 6 x 5.
 */
export const BELT_SLOTS = 30;
/**
 * Marbles the chute will hold back while the belt is busy. A tap is gated on *this*, not on
 * free belt slots: the tray tips regardless and its marbles queue in the hopper until the rail
 * under the neck comes free, which is what the reference machine does — its funnel is often
 * carrying far more than the belt has room for.
 *
 * ⚠ Do not tune this against the greedy and random bots alone; see the table in CLAUDE.md.
 * A hopper changes nothing about colour matching, so the random bot sits at 26% whatever its
 * size. What grows with it is the rope available to a player with no self-control. 21 is the
 * smallest size at which the `patient` bot — same choices, but it refuses to tip a tray the
 * rail has no room for — starts to *beat* the greedy one, which is the point where knowing
 * when not to tip becomes a skill instead of a missed opportunity. Below that the hopper is
 * small enough that using it is always right; well above it (27, 36) even patient play falls
 * to 67% and 48%.
 */
export const CHUTE_CAP = 27;

/**
 * Up to and including this level, **winning is three stars**, however it was won.
 *
 * The opening run is where a player is still learning what the machine does, and a star rating
 * that judges them while they are learning is a rating of the tutorial, not of them.
 */
export const STAR_ALWAYS_TO = 20;
/**
 * Past `STAR_ALWAYS_TO`: first go is three stars, up to this many goes is two, after that one.
 */
export const STAR_TWO_TRIES = 5;

/** Rows in the tray grid. Columns vary by level. */
export const GRID_ROWS = 5;
/** Widest the *generator* builds. Hand-built boards may go up to GRID_MAX. */
export const GRID_COLS = 6;
/** Hard ceiling on a board in either direction. Past this the cells stop being tappable. */
export const GRID_MAX = 7;
/** How many boxes of a column are drawn before the stack runs off the bottom. */
export const BOX_VISIBLE = 5;

/**
 * Conveyor advances one slot per tick, and it is also the cadence marbles feed onto the belt
 * at. Purely a pacing dial — the sim counts ticks, not milliseconds, so changing it moves how
 * the game *feels* without touching a single balance number.
 *
 * Set from a real play log: twelve levels averaged 70 seconds each, two of them ran past 110.
 * For a game meant to be picked up between other things that is too long, and the belt speed
 * is most of it.
 */
export const TICK_MS = 165;

/**
 * Tick rate once every tray is gone and only the belt is still working. Nothing is left to
 * decide at that point, so the normal pace is just a wait — run the last lap at speed.
 */
export const TICK_MS_DRAINED = 90;

// ── Marble colours ───────────────────────────────────────────────────────────
export type Color = number;

export interface Swatch {
  name: string;
  base: number;
  light: number;
  dark: number;
}

export const PALETTE: Swatch[] = [
  { name: "blue", base: 0x2b5ce8, light: 0x6d92ff, dark: 0x1a3a9e },
  { name: "green", base: 0x23bb45, light: 0x62e37c, dark: 0x137a2b },
  { name: "orange", base: 0xff8a14, light: 0xffb862, dark: 0xc25c00 },
  { name: "yellow", base: 0xffd020, light: 0xffe883, dark: 0xc99a00 },
  { name: "cyan", base: 0x55d9f5, light: 0xa6efff, dark: 0x1f9cba },
  { name: "purple", base: 0xa341f0, light: 0xc989ff, dark: 0x6d1cab },
  { name: "pink", base: 0xff86c4, light: 0xffbadd, dark: 0xc94a8d },
  { name: "red", base: 0xec3d3d, light: 0xff8080, dark: 0xa71c1c },
];

// ── Chrome ───────────────────────────────────────────────────────────────────
export const UI = {
  bg: 0x3d3a7a,
  bgTop: 0x2f2c63,
  bgBottom: 0x6a4f9e,
  glow: 0x8f7ce8,
  // ⚠ Three tones, not two, and only the middle one is solid slate.
  //
  //   machine   — the cabinet interior, white. It is the *ground* the board sits on.
  //   panelDeep — the rim around the cavity. The only slate in the machine, and what makes the
  //               silhouette read: a walled level's casing is this colour, so the board's own
  //               outline and its edge are visibly the same material.
  //   panel     — the cavity floor, white again, so it runs continuous into the funnel below.
  //
  // Filling the cavity with slate (or painting the whole cabinet slate) both collapse it to two
  // tones and lose the outline: the first makes the board a dark sticker on a white box, the
  // second makes the casing read as the hole rather than the solid part.
  machine: 0xdfe6f5,
  machineEdge: 0xa9b6d6,
  panel: 0xf4f7fd,
  panelDeep: 0x9fb0cb,
  cell: 0xe4ebf8,
  belt: 0x6f7686,
  beltDeep: 0x565d6b,
  beltLight: 0x8b93a3,
  chrome: 0xf3f6fc,
  ink: "#2b3550",
  pill: 0x8f7ce8,
  pillEdge: 0x6a56c4,
  gold: 0xffc21e,
  green: 0x4bc84b,
  greenEdge: 0x2f8f2f,
};

// ── Layout, in design units ──────────────────────────────────────────────────

/**
 * The three HUD boosters (magnet, wrench, undo). Temporarily off; set to `true` to bring the row
 * back and the layout below returns to its shipped numbers on its own.
 *
 * ⚠ It lives here, not in `GameScene`, because the *layout* depends on it: hiding the row without
 * closing the hole it leaves is a strip of empty machine between the HUD and the cabinet. One
 * flag, read by both, or the pixels and the buttons disagree about whether boosters exist.
 * ⚠ Revive is not one of these. It is priced alongside them but is never a button — the jam
 * pop-up is its only door — so it stays live while this is off.
 */
export const SHOW_BOOSTERS = false;

/**
 * How far the machine rides up while the booster row is hidden.
 *
 * The row spans `boostY ± boostSize / 2` = 114…190, and the cabinet starts at 198. Lifting by 84
 * puts the cabinet's top where the row began, so the gap under the HUD is the one that was there
 * before — the boosters are gone rather than replaced by a hole.
 *
 * ⚠ Applied to the constants, not to a container. Every consumer reads `L` — the art, the Matter
 * funnel walls, the belt path, the pointer-to-cell mapping — so moving the numbers moves all of
 * them together. Shifting a render container instead leaves the physics and the hit tests behind
 * at the old offset, and the marbles drift out of the funnel they are supposed to be inside.
 * ⚠ The cabinet keeps its height and rides up **whole**. Growing `machine.h` to keep its bottom
 * edge pinned was tried first and it just moved the hole: the well got 84px taller while still
 * drawing `BOX_VISIBLE` = 5 boxes, so the empty strip reappeared inside the well. Stretching one
 * end of the machine to hide a gap at the other end is the original defect upside-down. The whole
 * block moves, and the background shows below it — which is what a machine standing on a floor
 * looks like anyway.
 */
const BOOST_LIFT = SHOW_BOOSTERS ? 0 : 84;

export const L = {
  hudY: 62,
  boostY: 152,
  boostSize: 76,

  machine: { x: 26, y: 198 - BOOST_LIFT, w: 488, h: 952 },

  gridPanel: { x: 48, y: 240 - BOOST_LIFT, w: 444, h: 382 },
  cell: 64,
  gap: 7,

  // The chute proper starts well below the grid — above `top` the walls run straight down,
  // so the funnel reads as a tight hopper on the machine rather than a big empty wedge.
  // The neck is barely wider than one marble, which forces the queue single-file.
  // `brake` is where marbles start creeping, not `top`: braking from the mouth of the cone
  // makes them hang about halfway down and never reach the rail. They should tumble most of
  // the chute at speed and only slow over the last stretch into the neck.
  // ⚠ One chute, the same for every board size, and **do not shorten it**. A chute that moved
  // or resized with the grid would give each board a different drop, so the feel of the fall —
  // the thing the physics exists for — would change level to level. The grid grows into the
  // space above it instead, and `GRID_MAX_H` is what stops it reaching the cone.
  //
  // ⚠ Squeezing this to make room for a 7-row grid was tried and it broke the drop: compressing
  // 186px to 120px takes the cone from 33° to 22.5°, and at 22.5° the marbles stop sliding.
  // They strung out along the slope and sat there — the exact failure the note above `brake`
  // describes, reached from the other direction. Screenshot after eight taps on level 5 if this
  // is ever changed again.
  // ⚠ Every y here carries `BOOST_LIFT` so the chute keeps its exact length and cone angle — the
  // whole assembly slides, none of it stretches. Lifting `top` without `neckY` shortens the cone,
  // which is the 33°→22.5° failure the note above warns about, arrived at by accident.
  funnel: {
    shoulder: 622 - BOOST_LIFT,
    top: 682 - BOOST_LIFT,
    brake: 736 - BOOST_LIFT,
    mouthL: 54,
    mouthR: 486,
    // The neck runs all the way down to the belt housing. Ending it higher leaves marbles
    // popping onto the rail out of thin air, with a gap of empty machine in between.
    neckY: 808 - BOOST_LIFT,
    neckL: 250,
    neckR: 290,
  },

  // hx is sized so the belt's bottom run spans the whole box row — a marble has to
  // physically travel over a column to be able to drop into it, so any column sticking out
  // past the straight would be served from its edge instead of its middle.
  belt: { cx: 270, cy: 858 - BOOST_LIFT, hx: 190, r: 30, shell: 46 },
  marbleR: 14,

  box: { top: 914 - BOOST_LIFT, w: 100, gap: 6, h: 42, vgap: 4 },
};

export const CELL_PITCH = L.cell + L.gap;

/** Centre x of box column `j` — the conveyor's bottom run passes right over these. */
export function boxColX(j: number): number {
  const total = BOX_COLS * L.box.w + (BOX_COLS - 1) * L.box.gap;
  return (GAME_W - total) / 2 + L.box.w / 2 + j * (L.box.w + L.box.gap);
}

/**
 * Cell size and origin for a board of this shape.
 *
 * ⚠ A 5-row board must come out **pixel-identical to before this existed**: cell 64, pitch 71,
 * vertically centred in `gridPanel`. Every level shipped so far is 5 rows and every screenshot,
 * every art decision and the whole feel of the drop was settled against those numbers.
 *
 * Bigger boards shrink the cell instead of growing the panel, because the panel cannot grow
 * sideways — the cabinet is only so wide — and cannot grow down without eating the chute. A 7x7
 * lands on cell 58, which is still comfortably above the marble radius.
 */
export const GRID_GAP = 7;
/** The most room the grid may take. Width is the cabinet minus its shoulders; height stops at the
 *  mouth of the cone — a tray drawn any lower would sit inside the chute. */
const GRID_MAX_W = 441;
const GRID_MAX_H = 442;

export interface GridMetrics {
  cell: number;
  pitch: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** y of the lowest cell's bottom edge — where the chute has to start. */
  bottom: number;
}

export function gridMetrics(cols: number, rows: number): GridMetrics {
  const fitW = Math.floor((GRID_MAX_W + GRID_GAP) / Math.max(1, cols)) - GRID_GAP;
  const fitH = Math.floor((GRID_MAX_H + GRID_GAP) / Math.max(1, rows)) - GRID_GAP;
  const cell = Math.max(28, Math.min(L.cell, fitW, fitH));
  const pitch = cell + GRID_GAP;
  const w = cols * pitch - GRID_GAP;
  const h = rows * pitch - GRID_GAP;
  // Small boards stay centred in the panel exactly as they were; a board taller than the panel
  // hangs from its top edge and takes the extra height out of the chute below.
  const slack = L.gridPanel.h - h;
  const y = Math.round(L.gridPanel.y + Math.max(0, slack) / 2);
  return { cell, pitch, x: Math.round((GAME_W - w) / 2), y, w, h, bottom: y + h };
}

/** Top-left of the tray grid. Kept for callers that only care where it starts. */
export function gridOrigin(cols: number, rows = GRID_ROWS): { x: number; y: number } {
  const m = gridMetrics(cols, rows);
  return { x: m.x, y: m.y };
}

// ── The conveyor path ────────────────────────────────────────────────────────
// A stadium: top straight (travelled right→left), left cap, bottom straight
// (left→right, over the boxes), right cap. Distance 0 is the right end of the top
// straight, so the funnel drops in at distance `hx` — dead centre of the top run.

const B = L.belt;
export const BELT_STRAIGHT = 2 * B.hx;
export const BELT_CAP = Math.PI * B.r;
export const BELT_PERIM = 2 * BELT_STRAIGHT + 2 * BELT_CAP;
/** Gap between neighbouring marbles on the belt. */
export const BELT_SPACING = BELT_PERIM / BELT_SLOTS;
/** Path distance of the slot a marble drops into, measured from distance 0. */
export const BELT_ENTRY_D = B.hx;

export interface BeltPoint {
  x: number;
  y: number;
  /** true while the point is on the bottom straight, the only stretch that feeds boxes */
  onBottom: boolean;
}

/** Point on the conveyor centreline at path distance `d` (wraps). */
export function beltPointAt(d: number): BeltPoint {
  let t = d % BELT_PERIM;
  if (t < 0) t += BELT_PERIM;

  // top straight: right → left
  if (t < BELT_STRAIGHT) {
    return { x: B.cx + B.hx - t, y: B.cy - B.r, onBottom: false };
  }
  t -= BELT_STRAIGHT;

  // left cap: sweeps from the top-left round to the bottom-left
  if (t < BELT_CAP) {
    const a = -Math.PI / 2 - (t / BELT_CAP) * Math.PI;
    return { x: B.cx - B.hx + B.r * Math.cos(a), y: B.cy + B.r * Math.sin(a), onBottom: false };
  }
  t -= BELT_CAP;

  // bottom straight: left → right, directly above the boxes
  if (t < BELT_STRAIGHT) {
    return { x: B.cx - B.hx + t, y: B.cy + B.r, onBottom: true };
  }
  t -= BELT_STRAIGHT;

  // right cap: bottom-right back up to the top-right
  const a = Math.PI / 2 - (t / BELT_CAP) * Math.PI;
  return { x: B.cx + B.hx + B.r * Math.cos(a), y: B.cy + B.r * Math.sin(a), onBottom: false };
}

/**
 * For every belt slot, which box column sits under it (or -1).
 *
 * Precomputed once because the tick loop asks this for all 32 slots, every tick. A slot
 * is "over" a column whenever its centre falls inside the column's width, so a marble
 * lingers over a column for several slots — that is what lets a marble already sitting
 * there drop the instant that column's next box turns its colour.
 */
export const SLOT_COLUMN: number[] = (() => {
  const out: number[] = [];
  for (let i = 0; i < BELT_SLOTS; i++) {
    const p = beltPointAt(BELT_ENTRY_D + i * BELT_SPACING);
    let col = -1;
    if (p.onBottom) {
      for (let j = 0; j < BOX_COLS; j++) {
        if (Math.abs(p.x - boxColX(j)) <= L.box.w / 2) {
          col = j;
          break;
        }
      }
    }
    out.push(col);
  }
  return out;
})();

/** Point a marble leaves the neck from, where its slide onto the rail begins. */
export const FEED_FROM = { x: L.belt.cx, y: L.funnel.neckY - 14 };

/** World position of belt slot `i`, interpolated `frac` of the way to the next slot. */
export function slotPos(i: number, frac: number): BeltPoint {
  return beltPointAt(BELT_ENTRY_D + (i + frac) * BELT_SPACING);
}

/**
 * Cleats drawn on the belt surface, in repeating groups of three dark then three light.
 *
 * Exactly one per marble slot, sharing the slot's own path offset. Any other count and the
 * two run on different pitches, so a marble only lines up with a hole now and then and the
 * rest of the time sits visibly off-centre.
 */
export const CLEAT_GROUP = 3;
export const BELT_CLEATS = BELT_SLOTS;

export function cleatPos(i: number): BeltPoint {
  return beltPointAt(BELT_ENTRY_D + i * BELT_SPACING);
}

/** true for the lighter half of each six-cleat band. */
export function cleatLight(i: number): boolean {
  return Math.floor(i / CLEAT_GROUP) % 2 === 1;
}
