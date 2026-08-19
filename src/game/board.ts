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

/**
 * The pieces the results card counts down to. Ordered as the player meets them.
 *
 * ⚠ Only the ones that change what the player *does*. A `?` tray and a crate are met early and
 * explained by a coach card on the spot; these three arrive far enough apart that "something new
 * is coming" is worth saying out loud between them.
 */
export const FEATURES = [
  { id: "hatch", label: "HATCH" },
  { id: "pair", label: "LINKED TRAYS" },
  { id: "lid", label: "CHOCOLATE BOX" },
] as const;

export type FeatureId = (typeof FEATURES)[number]["id"];

/**
 * The first level each tracked piece appears on, **read off the boards rather than written down**.
 *
 * ⚠ A hand-written "level 9 → hatch" table is a second copy of the ladder, and the ladder moves —
 * levels have already been reordered once and one was inserted at slot 2 today, which shifted
 * every board after it. `coach.ts` avoids the same trap by reading the settled board; this cannot
 * do that (it has to look *ahead*, at levels nobody has played yet) so it reads the drawings
 * instead, which is the next cheapest source of truth.
 *
 * ⚠ Read from `cells`, never by building the level. `toLevelDef` runs a box-order search worth
 * hundreds of milliseconds; this runs on the results card, and scanning forward would stutter it.
 * The cells already say everything needed.
 *
 * Generated levels have no drawing, so they cannot introduce a piece here. That is true of the
 * shipped ladder — every piece arrives on a hand-built board — and if it ever stops being true the
 * bar just skips that level rather than being wrong about it.
 */
let firstAt: Map<FeatureId, number> | null = null;

function featureLevels(): Map<FeatureId, number> {
  if (firstAt) return firstAt;
  const out = new Map<FeatureId, number>();
  const nums = Object.keys(HANDMADE)
    .map(Number)
    .sort((a, b) => a - b);
  for (const lvl of nums) {
    const cells = HANDMADE[lvl]?.cells ?? [];
    const has = {
      hatch: cells.some((c) => c.kind === "hatch"),
      pair: cells.some((c) => c.kind === "tile" && c.wide),
      lid: cells.some((c) => c.kind === "choc"),
    };
    for (const f of FEATURES) if (has[f.id] && !out.has(f.id)) out.set(f.id, lvl);
  }
  firstAt = out;
  return out;
}

export interface FeatureProgress {
  id: FeatureId;
  label: string;
  /** the level it turns up on */
  at: number;
  /** 0..1 — hits exactly 1 when the very next level is the one */
  pct: number;
}

/**
 * How close the player is to the next piece they have not met, having just cleared `cleared`.
 *
 * Null once there is nothing left to count down to — the bar then simply does not appear, which
 * is better than a full bar that never moves again.
 */
export function featureProgress(cleared: number): FeatureProgress | null {
  const at = featureLevels();
  let from = 1;
  for (const f of FEATURES) {
    const lvl = at.get(f.id);
    if (lvl === undefined) continue;
    if (lvl > cleared) {
      // ⚠ `cleared + 1` on top, not `cleared`: the bar has to read full on the card that hands the
      // player the level carrying the piece. Measured against the other form, `(cleared - from)`
      // tops out one level short and the bar never fills — which reads as the reward receding.
      const span = Math.max(1, lvl - from);
      return { id: f.id, label: f.label, at: lvl, pct: Math.min(1, (cleared + 1 - from) / span) };
    }
    from = lvl;
  }
  return null;
}
