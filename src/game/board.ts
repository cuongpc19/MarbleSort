// Which board a level number actually gets.
//
// ⚠ This exists because there were two answers to that question and only one of them was the
// game's. `GameScene` resolved hand-built levels first and fell through to the generator; every
// measurement script called `makeLevel` directly and so measured a board the player never sees.
// A hand-built level 20 would have been audited, tuned and reported as the generated level 20.
//
// Same lesson as `scripts/bots.mjs`: one definition, imported, or the tooling optimises something
// the game is not running.
//
// It lives in its own file rather than in `custom.ts` because that file is deliberately free of
// the generator — the editor imports it and must not pull the difficulty ladder in with it.

import { blueprintFor, toLevelDef } from "./custom";
import { HANDMADE } from "./handmade";
import { makeLevel, targetWin } from "./level";
import type { LevelDef } from "./logic";

/**
 * The board for a level: this device's saved drawing, then the shipped hand-built table, then the
 * generator. `blueprintFor` owns that ordering and the reason for it.
 *
 * Safe to call from Node — `loadBook` swallows the missing `localStorage` and returns nothing, so
 * a script sees the shipped table and the generator, which is what a fresh install sees too.
 */
export function levelDefFor(level: number): LevelDef {
  const bp = blueprintFor(level, HANDMADE);
  // ⚠ The sheet's target goes in with it. A hand-built board ignores LADDER and VARIANTS, so the
  // *order of its boxes* is the only lever left that can move its difficulty — and it only moves
  // it if something tells it where to aim.
  return bp ? toLevelDef(bp, level, targetWin(level)) : makeLevel(level);
}

/** Is this level hand-built rather than generated? Nothing about it is on the tuned curve. */
export function isHandmade(level: number): boolean {
  return blueprintFor(level, HANDMADE) != null;
}
