# Marble Sort — project notes for Claude

**2026-08-07: scaffolded from the Beads Out project** (`github.com/cuongpc19/BeadsOut`)
following its `NEW-GAME.md` checklist. Only the shared frame was carried over — build
setup, `main.ts`, `save.ts`, `audio.ts`, the Android packaging scripts and the font.
Nothing of Beads Out's own game code came with it.

## THE mechanic

Classic marble-sort. **Not yet built** — this file is the spec to build against.

A row of **glass tubes**, each holding up to `TUBE_H` marbles stacked bottom-up. There are
`colors` colours with exactly `TUBE_H` marbles each, plus `spare` empty tubes.

- Tap a tube → it **lifts its top marble, plus every marble of the same colour directly
  under it** (the "run"). Tap it again to put the run back.
- Tap a second tube → the run **pours** if that tube is empty, or its top marble is the
  same colour and it has room. A partial pour is allowed when the target has room for some
  but not all of the run.
- **Win**: every tube is either empty or holds `TUBE_H` marbles of a single colour.
- **Lose**: no legal move exists. Undo and Restart are the way out.

Difficulty levers, in the order they should be reached for: **colour count**, **spare tube
count** (2 is comfortable, 1 is tight), **tube height**, and the **solver's minimum move
count** for the generated board.

## Rules that must hold

- ⚠ **Every generated level must be provably solvable.** Generate by shuffling the marble
  multiset, then run the solver; reject and reshuffle until it returns a solution. The
  solver's move count is also what the star pars are fitted to. Do NOT ship a level the
  solver has not cleared — a stuck-from-the-start board is unrecoverable and the player
  has no way to tell it apart from their own mistake.
- **A tube is never partially "one colour done"** — the win test is per tube: empty, or
  full and monochrome. Anything looser lets a level end with marbles stranded.
- **Undo must restore the exact board**, not re-derive it. Keep a move stack of
  `(from, to, count)` and replay backwards.

## What came from the scaffolding (do not re-invent)

- `src/main.ts` — Phaser boot, DPR capped at 2, 60fps cap, `?reset=1` wipes saved state,
  and `window.__game` exposed in dev so a headless browser can drive the scene. **That
  hook is what makes anything measurable — keep it.**
- `src/game/save.ts` — localStorage behind the `ms_` prefix (levels, stars, coins, mute).
  ⚠ The prefix must stay distinct from other games or they share storage.
- `src/game/audio.ts` — synthesised WebAudio, no sample files.
- `scripts/build-apk.mjs` · `scripts/setup-android.mjs` — Android packaging; the launcher
  icon is drawn as an SVG (a tube of marbles), there is no icon file.
- `capacitor.config.ts` — `com.marblesort.game`, distinct from Beads Out's app id.

Three conventions worth keeping from the previous project:

1. **Bake every graphic at boot** (a `textures.ts`), no `public/art/`.
2. **Generate levels from the level number with a seeded RNG**, no level files.
3. **Write a headless simulator early** (`scripts/sim.js` in the old project), not last.
   Tuning by driving the real game costs ~30s per data point, which is too slow to take
   more than one or two samples — and single samples are noisy enough to mislead.

## Ordering — read `NEW-GAME.md` in the Beads Out repo before starting

The short version of what that project paid to learn: decide the **lose condition** before
tuning anything, measure with **two opposite players** (optimal and random) because a
single bot makes real levers look like null results, and **hold everything fixed but one
variable** in every experiment.

## Commands

- Typecheck: `npx tsc --noEmit` · Dev: `npm run dev` · Android: `npm run apk`
- `?reset=1` on the URL wipes saved progress — the way to reset on a phone.
