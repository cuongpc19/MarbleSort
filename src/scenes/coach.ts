// One-off explanations for the board pieces, shown the first time a player meets each one.
//
// The level-1 walkthrough teaches the machine — pour, ride, drop, fill. It cannot teach the
// pieces, because none of them exist on level 1: the `?` tray arrives on 6, the hatch on 8, the
// crate on 11, the linked pair on 15, the chocolate box on **31**.
//
// ⚠ **Some pieces need more than a caption.** A crate is self-evident once named; a hatch and a
// chocolate box are not. Both carry a rule the picture does not state — a hatch feeds *the cell it
// faces*, which is not always the one below it, and a chocolate box counts **trays poured**, which
// a player will otherwise read as boxes filled and be wrong by a factor of three (a tray is
// `TRAY_N` = 9 marbles, a box holds `BOX_SLOTS` = 3). Those two get a short sequence; the rest get
// one card.
//
// ⚠ **Driven by what is on the board, not by level number.** A table of "level 8 → hatch" is a
// second copy of the ladder, and the ladder moves: levels 15-115 have been reordered once already.
// Reading the pieces off the settled `Game` cannot drift.
//
// ⚠ **Each step re-finds its target on the live board.** A sequence runs for several seconds and
// the player is free to play through it, so a cell index captured when the card opened can be
// stale by step 3 — a hatch that has already pushed a tray out, a tray that has been poured. Steps
// resolve late, and a step whose target is gone simply drops its ring and keeps its caption.
//
// ⚠ **One card per level**, and never at the same time as the level-1 walkthrough: both own the
// same strip of chute, and two plates on top of each other are unreadable.
//
// ⚠ **Never blocks input**, same rule as the walkthrough — gating taps would also gate
// `window.__ms.tap()` and every `npm run shot` run. A tap advances to the next step rather than
// killing the sequence, so an impatient player reads it at their own pace instead of losing it.
//
// ⚠ **English.** `public/fonts/LilitaOne.ttf` is a Latin-only subset — Vietnamese copy falls back
// to Arial glyph by glyph and looks broken.

import Phaser from "phaser";
import type { Game } from "../game/logic";
import { save } from "../game/save";
import { coachPlate, coachRing } from "./tutorial";
import { teachAll, teachOnly } from "../game/teach";

/** How long a step stays up before advancing on its own. */
const HOLD = 3200;

type Step = {
  /** A function when the wording depends on the piece in front of the player. */
  text: string | ((b: Game) => string);
  /** Which cell to ring, or -1 for a caption with no pointer. Resolved when the step opens. */
  find: (b: Game) => number;
  /** Shift the ring by this many cells, for a piece that covers more than one. */
  off?: { x: number; y: number };
  /** Ring size multiplier, for the same reason. */
  grow?: number;
};

type Mark = { id: string; steps: Step[]; present: (b: Game) => boolean };

const firstTile = (b: Game, f: (t: NonNullable<Game["tiles"][number]>) => boolean) =>
  b.tiles.findIndex((t) => !!t && f(t));

/** Where a hatch pushes to. Absent `dir` means down — boards built before hatches could turn. */
function hatchTarget(b: Game): number {
  const i = b.disp.findIndex(Boolean);
  if (i < 0) return -1;
  const d = b.disp[i]!;
  const dir = d.dir ?? "down";
  const at = dir === "left" ? i - 1 : dir === "right" ? i + 1 : i + b.cols;
  return at >= 0 && at < b.cols * b.rows ? at : i;
}

/**
 * ⚠ Order is the order they are *offered*, not the order they appear on the ladder. Cheapest to
 * read first, so that if a board ever carries two new pieces the simple one is explained and the
 * rich one waits for a board where it is the only new thing.
 */
const MARKS: Mark[] = [
  {
    id: "crate",
    present: (b) => b.blocked.some(Boolean),
    steps: [
      { text: "Crates never move and never clear", find: (b) => b.blocked.findIndex(Boolean) },
      // ⚠ The half that is not obvious. A crate looks like an obstacle to route around; what it
      // actually does is take away an open side, and a tray needs one to slide into. A tray boxed
      // in by crates is locked however much space is elsewhere on the board.
      { text: "A tray needs an open side — a crate is not one", find: (b) => b.blocked.findIndex(Boolean) },
    ],
  },
  {
    id: "hidden",
    present: (b) => b.tiles.some((t) => !!t && t.hidden),
    steps: [
      { text: "A ? tray shows its colour once it has a way out", find: (b) => firstTile(b, (t) => !!t.hidden) },
    ],
  },
  {
    id: "hatch",
    present: (b) => b.disp.some(Boolean),
    steps: [
      { text: "The number on a hatch is how many trays it holds", find: (b) => b.disp.findIndex(Boolean) },
      { text: "It pushes one out when the cell it faces is free", find: hatchTarget },
      { text: "So clearing that cell pulls the queue through", find: hatchTarget },
    ],
  },
  {
    id: "pair",
    present: (b) => b.tiles.some((t) => !!t && t.wide),
    steps: [
      { text: "These two trays are clipped together", find: (b) => firstTile(b, (t) => !!t.wide), off: { x: 0.5, y: 0 }, grow: 1.4 },
      { text: "One tap pours both — two colours at once", find: (b) => firstTile(b, (t) => !!t.wide), off: { x: 0.5, y: 0 }, grow: 1.4 },
    ],
  },
  {
    id: "lid",
    present: (b) => b.lids.length > 0,
    steps: [
      {
        text: "A chocolate box locks the four trays under it",
        find: (b) => (b.lids.length ? b.lids[0].at : -1),
        off: { x: 0.5, y: 0.5 },
        grow: 1.8,
      },
      {
        // ⚠ The sentence this whole sequence exists for. Read as "boxes filled" the counter looks
        // broken: the player clears a box the lid plainly wanted and the number does not move.
        text: "Its number counts trays you pour, not boxes filled",
        find: (b) => (b.lids.length ? b.lids[0].at : -1),
        off: { x: 0.5, y: 0.5 },
        grow: 1.8,
      },
      {
        // ⚠ Describes the box actually on screen rather than teaching both cases. The ribbon is
        // half the rule, and a player holding a rainbow box does not need the single-colour one.
        text: (b) =>
          b.lids.length && b.lids[0].color == null
            ? "Rainbow ribbons: a tray of any colour counts"
            : "These ribbons count only trays of their colour",
        find: (b) => (b.lids.length ? b.lids[0].at : -1),
        off: { x: 0.5, y: 0.5 },
        grow: 1.8,
      },
      {
        text: "At zero it bursts and the four trays join the board",
        find: (b) => (b.lids.length ? b.lids[0].at : -1),
        off: { x: 0.5, y: 0.5 },
        grow: 1.8,
      },
    ],
  },
];

/** Turns a cell index (plus a sub-cell offset) into a point. The scene owns grid metrics. */
export type Locate = (cell: number, off?: { x: number; y: number }) => { x: number; y: number };

export class Coach {
  private scene: Phaser.Scene;
  private layer: Phaser.GameObjects.Container;
  private board: Game;
  private locate: Locate;
  private ring: Phaser.GameObjects.Image | null = null;
  private label: Phaser.GameObjects.Text | null = null;
  private plate: Phaser.GameObjects.Graphics | null = null;
  private timer: Phaser.Time.TimerEvent | null = null;
  private mark: Mark | null = null;
  /** Marks still to play. Only replay mode ever queues more than one — see `start`. */
  private queue: Mark[] = [];
  private at = 0;

  constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Container, board: Game, locate: Locate) {
    this.scene = scene;
    this.layer = layer;
    this.board = board;
    this.locate = locate;
  }

  /**
   * The marks this board could show, in offer order.
   *
   * ⚠ Under `?teach=` the seen list is ignored, so a card can be looked at again without spending
   * the one a real player on this device was going to get.
   */
  private static eligible(board: Game): Mark[] {
    const only = teachOnly();
    const seen = teachAll() ? [] : save.coachSeen;
    return MARKS.filter(
      (m) => (only ? m.id === only : true) && !seen.includes(m.id) && m.present(board),
    );
  }

  /** Is there a piece on this board the player has not been shown yet? */
  static wanted(board: Game): boolean {
    return Coach.eligible(board).length > 0;
  }

  /**
   * Open the first unexplained piece on this board.
   *
   * ⚠ **Replay plays every mark on the board, one after another; normal play takes one.** A real
   * player meets these one level at a time and two explanations back to back would be noise. But
   * `?teach=1` on a late board is someone asking *what does this level teach* — and level 31
   * carries `?` trays, a hatch and a chocolate box at once, so stopping at the first eligible mark
   * answered with the `?` card and never reached the chocolate box the level is actually about.
   * Reported exactly that way. To go straight to one, `?teach=lid`.
   */
  start() {
    const all = Coach.eligible(this.board);
    this.queue = teachAll() ? all : all.slice(0, 1);
    this.next();
  }

  private next() {
    this.mark = this.queue.shift() ?? null;
    if (!this.mark) return;
    this.at = 0;
    this.step();
  }

  /** The player poured a tray — move on rather than talk over them. */
  noteTap() {
    if (!this.mark) return;
    this.at++;
    this.step();
  }

  private step() {
    this.clear();
    const step = this.mark?.steps[this.at];
    if (!step) return this.finish();

    const cell = step.find(this.board);
    if (cell >= 0) {
      const p = this.locate(cell, step.off);
      this.ring = coachRing(this.scene, p.x, p.y, step.grow ?? 1);
      this.layer.add(this.ring);
    }

    const text = typeof step.text === "function" ? step.text(this.board) : step.text;
    const { plate, label } = coachPlate(this.scene, text);
    this.plate = plate;
    this.label = label;
    this.layer.add([plate, label]);

    this.timer = this.scene.time.delayedCall(HOLD, () => {
      this.at++;
      this.step();
    });
  }

  private finish() {
    if (!this.mark) return;
    // ⚠ Marked when the sequence **ends**, not when it opens — the same rule as `tutorialDone`.
    // A card that flashed by during a scene restart has taught nothing, and this is its only
    // chance; a player who tapped through it has at least been past every step.
    // ⚠ Never while replaying: looking at a card must not consume it.
    if (!teachAll()) save.markCoach(this.mark.id);
    this.mark = null;
    this.clear();
    this.next();
  }

  private clear() {
    this.timer?.remove();
    this.timer = null;
    for (const o of [this.ring, this.label, this.plate]) {
      if (o) {
        this.scene.tweens.killTweensOf(o);
        o.destroy();
      }
    }
    this.ring = null;
    this.label = null;
    this.plate = null;
  }

  destroy() {
    this.mark = null;
    this.clear();
  }
}
