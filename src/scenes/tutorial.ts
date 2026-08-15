// The level-1 walkthrough.
//
// Four coach marks, in the order the machine actually works: pour a tray, watch the marbles ride
// the belt, watch one drop into a box of its colour, fill every box.
//
// ⚠ **It never blocks input.** Every step advances on something the player did or on a timer; none
// of them swallows a tap. A tutorial that gates taps would also gate `window.__ms.tap()` and every
// `npm run shot` run, so the one screen every reviewer sees would be the one nothing can drive.
// The cost is that a player can tap past it, which is the right trade — they have already learned
// the thing the step was about.
//
// ⚠ **English, like the rest of the UI.** `public/fonts/LilitaOne.ttf` is a Latin-only subset with
// no Vietnamese glyphs; non-ASCII falls back to Arial glyph-by-glyph and looks broken. Swapping in
// a full Lilita One is what unblocks Vietnamese copy here and everywhere else.
//
// ⚠ Presentation only. It reads the board to find a tray worth pointing at and otherwise decides
// nothing — no rule lives here, so the headless sim is unaffected by its existence.

import Phaser from "phaser";
import { GAME_W, L, UI } from "../game/config";
import { save } from "../game/save";
import { K, TS, img } from "../game/textures";
import { teachAll } from "../game/teach";

const FONT = '"Lilita One", Arial, sans-serif';

/**
 * `UI.ink` as a number, for `Graphics.fillStyle`.
 *
 * ⚠ Derived from the string rather than written out again. The palette keeps ink as a CSS string
 * because every other use is a text stroke; a second literal here is one more copy of a colour to
 * drift, and this file would be the one nobody thinks to update.
 */
const INK = Phaser.Display.Color.HexStringToColor(UI.ink).color;

/**
 * The pulsing ring that marks a thing on the board.
 *
 * ⚠ Sized to ring the target, not to sit inside it. `img` already applies 1/TS, so these are
 * multiples of the 64-unit texture: 0.85 starts just outside a 64px cell and 1.5 pushes clear of
 * it. At the first draft's 0.6 the ring landed *within* the tray face and read as a decoration
 * painted on the tile rather than as a pointer at it.
 *
 * ⚠ Shared with `coach.ts`. A second copy would drift, and the two are meant to be the same
 * marker — a player should not have to learn two visual languages for "look here".
 */
export function coachRing(scene: Phaser.Scene, x: number, y: number, grow = 1): Phaser.GameObjects.Image {
  const ring = img(scene, K.ring, x, y).setAlpha(0.95).setScale((0.85 * grow) / TS);
  ring.setTint(UI.gold);
  scene.tweens.add({ targets: ring, scale: (1.5 * grow) / TS, alpha: 0, duration: 1100, repeat: -1 });
  return ring;
}

/**
 * The caption, on a plate.
 *
 * ⚠ A plate behind the words, not bare text. The caption sits over the chute, which is white
 * cabinet at the start and full of falling marbles a second later; white-stroked text on that is
 * unreadable exactly when it most needs reading.
 *
 * ⚠ Below the grid, in the throat of the chute — `shoulder` is where the cabinet walls start
 * running in, and everything above it belongs to the board. The first draft used `shoulder - 34`
 * and the plate landed squarely on the bottom row of cells.
 *
 * ⚠ `+ 44`, not the `+ 26` this started at. A silhouette whose lowest row sits on the chute mouth
 * — a `cross`, most of level 6 — hangs its bottom tray past `shoulder`, and at 26 the plate rested
 * on that tray's face. Covering a tray is not a cosmetic problem here: raised-or-flat eggs are how
 * the board says whether a tray can move, so the card would be hiding the very thing it is
 * explaining.
 */
export function coachPlate(scene: Phaser.Scene, text: string) {
  const y = L.funnel.shoulder + 44;
  // ⚠ Wrapped, and the plate is measured from the result. The plate width was capped at the screen
  // and the label was not, so a caption a few characters too long simply ran out past both ends of
  // its own background — white text on whatever the chute happened to contain. That is a trap for
  // whoever writes the *next* card, not a fault in any existing one, so it is fixed here rather
  // than by keeping every string short enough to get away with.
  const label = scene.add
    .text(GAME_W / 2, y, text, {
      fontFamily: FONT,
      fontSize: "21px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: GAME_W - 84 },
    })
    .setOrigin(0.5)
    .setDepth(1);
  const w = Math.min(GAME_W - 40, label.width + 44);
  const h = label.height + 22;
  const plate = scene.add.graphics();
  plate.fillStyle(INK, 0.82);
  plate.fillRoundedRect(GAME_W / 2 - w / 2, y - h / 2, w, h, Math.min(22, h / 2));
  return { plate, label };
}

/** What each step says, and how it ends. */
type Step = {
  text: string;
  /** Where the hand and ring sit, or null for a caption with no pointer. */
  at?: { x: number; y: number } | null;
  /** Advance after this many ms. Absent means "wait for the player". */
  after?: number;
};

export class Tutorial {
  private scene: Phaser.Scene;
  private layer: Phaser.GameObjects.Container;
  private hand: Phaser.GameObjects.Image | null = null;
  private ring: Phaser.GameObjects.Image | null = null;
  private label: Phaser.GameObjects.Text | null = null;
  private plate: Phaser.GameObjects.Graphics | null = null;
  private timer: Phaser.Time.TimerEvent | null = null;
  private steps: Step[] = [];
  private at = -1;
  private done = false;

  constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Container) {
    this.scene = scene;
    this.layer = layer;
  }

  /** Is the walkthrough wanted on this level, for this player? */
  static wanted(level: number): boolean {
    return level === 1 && (!save.tutorialDone || teachAll());
  }

  /**
   * `tray` is where the first pour should be pointed — the scene knows the grid metrics, this
   * does not. Passing it in beats recomputing the layout here and drifting from `gridMetrics`.
   */
  start(tray: { x: number; y: number }) {
    this.steps = [
      { text: "Tap a tray to pour its marbles", at: tray },
      // The bottom run is the one that matters: it is the only stretch that passes over the boxes.
      { text: "They ride the belt", at: { x: L.belt.cx, y: L.belt.cy + L.belt.r }, after: 2200 },
      { text: "A marble drops into a box of its own colour", at: { x: GAME_W / 2, y: L.box.top + L.box.h / 2 }, after: 2800 },
      { text: "Fill every box to clear the level", at: null, after: 2600 },
    ];
    this.show(0);
  }

  /** The player poured a tray. Only the first step is waiting on that. */
  noteTap() {
    if (this.at === 0) this.show(1);
  }

  private show(i: number) {
    this.clear();
    const step = this.steps[i];
    if (!step) return this.finish();
    this.at = i;

    if (step.at) {
      // ⚠ Ring first, then hand: the hand has to read *on top of* the ring, and a container draws
      // in insertion order.
      this.ring = coachRing(this.scene, step.at.x, step.at.y);
      this.layer.add(this.ring);

      // Offset down-right of the target so the finger tip lands on it rather than the palm.
      this.hand = img(this.scene, K.hand, step.at.x + 16, step.at.y + 40);
      this.layer.add(this.hand);
      this.scene.tweens.add({
        targets: this.hand,
        y: step.at.y + 52,
        duration: 620,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }

    const { plate, label } = coachPlate(this.scene, step.text);
    this.plate = plate;
    this.label = label;
    this.layer.add([plate, label]);

    if (step.after) {
      this.timer = this.scene.time.delayedCall(step.after, () => this.show(i + 1));
    }
  }

  private clear() {
    this.timer?.remove();
    this.timer = null;
    for (const o of [this.hand, this.ring, this.label, this.plate]) {
      if (o) {
        this.scene.tweens.killTweensOf(o);
        o.destroy();
      }
    }
    this.hand = this.ring = null;
    this.label = null;
    this.plate = null;
  }

  private finish() {
    if (this.done) return;
    this.done = true;
    this.clear();
    // ⚠ Marked here, at the end, not at `start()`. A player who quits on the first screen and
    // comes back gets the walkthrough again — they are precisely the player it exists for.
    // ⚠ Never while replaying (`?teach=`): looking at the walkthrough must not consume it.
    if (!teachAll()) save.tutorialDone = true;
  }

  /** Tear-down for a scene shutdown or a level restart mid-walkthrough. */
  destroy() {
    this.clear();
  }
}
