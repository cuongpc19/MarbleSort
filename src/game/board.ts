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

import { MAGNET_TUTOR_LEVEL } from "./config";
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
 * explained by a coach card on the spot; these arrive far enough apart that "something new is
 * coming" is worth saying out loud between them.
 *
 * ⚠ **The magnet is not a piece, and it is the reason this table is no longer purely derived.** The
 * other three are found by scanning the drawings, because a board either has a hatch on it or does
 * not. A booster is a button: nothing on any board says when it arrives, so its milestone comes
 * from `MAGNET_TUTOR_LEVEL` — the same constant that decides where it is taught. One source, so the
 * bar cannot promise it on a different level from the one that hands it over.
 */
export const FEATURES = [
  { id: "magnet", label: "MAGNET" },
  { id: "hatch", label: "HATCH" },
  { id: "pair", label: "LINKED TRAYS" },
  { id: "lid", label: "CHOCOLATE BOX" },
  { id: "arrow", label: "ARROW TRAY" },
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
  // ⚠ Not from the drawings — see the note on `FEATURES`. A booster leaves no mark on a board.
  out.set("magnet", MAGNET_TUTOR_LEVEL);
  const nums = Object.keys(HANDMADE)
    .map(Number)
    .sort((a, b) => a - b);
  for (const lvl of nums) {
    const cells = HANDMADE[lvl]?.cells ?? [];
    const has = {
      hatch: cells.some((c) => c.kind === "hatch"),
      pair: cells.some((c) => c.kind === "tile" && c.wide),
      lid: cells.some((c) => c.kind === "choc"),
      // ⚠ An arrow tray is a `tile` like any other — the lock is a field on it, not a cell kind —
      // so it cannot be found the way the other three are.
      arrow: cells.some((c) => c.kind === "tile" && !!c.arrow),
    };
    // ⚠ `f.id in has` first: the magnet is in FEATURES but has no cell kind to look for, and its
    // milestone was already set above. Indexing `has` with it would be a silent undefined that
    // reads as "not on this board" — true, but for the wrong reason, and it would break the moment
    // someone added a board-derived id without a matching entry.
    for (const f of FEATURES) {
      if (!(f.id in has)) continue;
      if (has[f.id as keyof typeof has] && !out.has(f.id)) out.set(f.id, lvl);
    }
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

// ── Difficulty labels ────────────────────────────────────────────────────────

/** What the board is billed as, or null for an ordinary level. */
export type LevelTag = "hard" | "superhard";

export interface TagLook {
  text: string;
  /** Face colour of the ribbon. */
  face: number;
  /** The shadow under it — the same two-tone treatment every button in the game uses. */
  shadow: number;
}

/**
 * ⚠ `superhard` keeps the exact two tones the warning plate already shipped with, so levels 15 and
 * 30 look identical to what players have been seeing. Only the new `hard` tier is a new colour, and
 * it is amber rather than a paler red — two reds a shade apart have to be compared side by side to
 * be told apart, and the player only ever sees one of them at a time.
 */
export const TAG_LOOK: Record<LevelTag, TagLook> = {
  hard: { text: "HARD", face: 0xf0a12a, shadow: 0x8a5200 },
  superhard: { text: "SUPER HARD", face: 0xd2452f, shadow: 0x7a1220 },
};

/**
 * Which levels are billed as hard, from the level number alone.
 *
 * Every 15th board is **super hard**; past level 10, every 5th board that is not already a super
 * hard one is **hard**.
 *
 * ⚠ **Order matters: 15 divides by 5 too.** Testing the multiple of five first would label 15, 30
 * and 45 merely "HARD" and the super-hard tier would never appear at all — the milestones the
 * ladder builds toward are exactly the ones it would lose.
 *
 * ⚠ Derived from the number, not from a measured winrate. It is a **promise the ladder makes**, and
 * the boards at those slots are built to keep it: `targetWin` already asks for a dip at 15, 20, 25
 * and 30. A label read off a live bot score instead would flicker every time a level was retuned,
 * and a badge that comes and goes is worse than none.
 *
 * ⚠ Levels 5 and 10 get nothing on purpose. They are the first two multiples of five, met while the
 * player is still learning the machine, and calling the third board they ever reach "hard" spends
 * the word before it means anything.
 */
export function levelTag(level: number): LevelTag | null {
  if (!Number.isFinite(level) || level < 1) return null;
  if (level % 15 === 0) return "superhard";
  if (level > 10 && level % 5 === 0) return "hard";
  return null;
}
