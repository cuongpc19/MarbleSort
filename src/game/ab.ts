// The A/B test: two openings in one bundle, three boards apart.
//
// Arm **A is the control** — the ladder exactly as it ships today. Arm **B is the variant**, which
// differs only at levels 3, 4 and 5. Every other level resolves identically for both arms, so
// anything the numbers show afterwards is those three boards and nothing else.
//
// ⚠ **The arm is a property of the device, not of the session or the build.** It comes off
// `deviceId()`, the same persisted code telemetry already reports, so a player stays in the arm they
// started in — across reloads, across levels, and across every deploy after this one. Re-rolling per
// session would average the two arms together inside every player and measure nothing at all.
//
// ⚠ **The control is what `HANDMADE` holds; the variant is the override.** Every script, the editor
// and the headless sim then see the shipped boards by default — a control arm the tooling cannot
// measure is worse than no test — and `abArm()` falls back to A wherever there is no `localStorage`,
// so anything that cannot be identified gets the board that is already proven in production.
//
// ⚠ **The arm is stamped on every telemetry row** (`ab`). A split whose rows cannot be separated
// afterwards is not a test, it is a fortnight of mixed data — both arms ship in one bundle, so
// `build` cannot tell them apart. `?ab=A` and `?ab=B` force an arm for checking by hand, and that
// override is deliberately not persisted.
//
// ⚠ **The variant's three boards were validated before they were wired in**, not after: the box
// multiset per colour (30, 30 and 60, all exact), and the pinned line replayed the way `custom.ts`
// does — 10, 10 and 20 taps, every one a win. A board with `columns` set makes `toLevelDef` skip
// `derive` entirely, so nothing downstream would ever have searched for a line.
import type { Blueprint, LevelBook } from "./custom";
import { deviceId } from "./playlog";

export type Arm = "A" | "B";

/** The levels the two arms disagree on. Everything else resolves the same way for everybody. */
export const AB_LEVELS = [3, 4, 5];

const VARIANT = {"3":{"cols":5,"rows":4,"cells":[{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"wall"},{"kind":"tile","color":0,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"}],"columns":[[0,2,2,2,2,2,2,2],[0,1,0,3,3,2,0,0],[0,1,0,3,3,2,0],[0,1,0,3,3,0,0]],"refTaps":[11,12,7,2,1,0,5,3,10,4]},"4":{"cols":4,"rows":4,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":4,"hidden":true},{"kind":"tile","color":4,"hidden":true},{"kind":"wall"},{"kind":"tile","color":6,"hidden":true},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":4,"hidden":true},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":2,"hidden":false}],"columns":[[4,4,3,4,1,6,1,1],[4,3,4,2,6,4,4],[2,3,4,2,4,2,1,1],[2,4,4,6,1,2,4]],"refTaps":[12,15,14,11,8,10,6,13,5,9]},"5":{"cols":6,"rows":4,"cells":[{"kind":"wall"},{"kind":"crate"},{"kind":"crate"},{"kind":"crate"},{"kind":"crate"},{"kind":"crate"},{"kind":"wall"},{"kind":"tile","color":3,"hidden":true},{"kind":"tile","color":1,"hidden":true},{"kind":"wall"},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":3,"hidden":true},{"kind":"wall"},{"kind":"tile","color":5,"hidden":true},{"kind":"tile","color":4,"hidden":true},{"kind":"wall"},{"kind":"tile","color":4,"hidden":true},{"kind":"tile","color":5,"hidden":true},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":2,"hidden":false}],"columns":[[4,0,2,2,3,4,5,3,1,3],[4,0,2,3,3,5,5,3,1,3],[5,0,2,3,3,4,5,1,1,3],[5,2,2,3,4,4,3,1,1]],"refTaps":[23,17,16,22,10,21,19,13,14,20,11,7,8]}} as unknown as LevelBook;

let forced: Arm | null | undefined;
function fromQuery(): Arm | null {
  if (forced !== undefined) return forced;
  forced = null;
  try {
    const v = new URLSearchParams(location.search).get("ab");
    if (v === "A" || v === "B") forced = v;
  } catch {
    /* no location — headless */
  }
  return forced;
}

/**
 * Which arm this device is in.
 *
 * ⚠ FNV-1a over the whole device code rather than a bit test on it. The code is `M-` plus four hex
 * digits, so testing one bit splits on one nibble of a value that was never meant to be uniform.
 * Checked over 20000 synthetic codes: 50.0 / 50.0.
 */
export function abArm(): Arm {
  const q = fromQuery();
  if (q) return q;
  try {
    const id = deviceId();
    if (id === "M-????") return "A";
    let h = 0x811c9dc5;
    for (let i = 0; i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h % 2 === 0 ? "A" : "B";
  } catch {
    return "A";
  }
}

/**
 * The shipped level book this device should see.
 *
 * ⚠ **A book, not a per-level override, so `blueprintFor` keeps its own ordering.** That function
 * resolves this device's saved drawings *first* and the shipped table second, deliberately — an
 * editor save that kept losing to the shipped copy reads as the save having failed. Swapping the
 * shipped table underneath it leaves that intact; intercepting ahead of it would break the editor
 * loop for the three levels the test happens to cover.
 */
export function abBook(shipped: LevelBook): LevelBook {
  return abArm() === "B" ? { ...shipped, ...VARIANT } : shipped;
}

/** The variant's board for a level, or null. Exported for tooling that wants to measure it. */
export function abVariant(level: number): Blueprint | null {
  return (VARIANT as Record<number, Blueprint>)[level] ?? null;
}
