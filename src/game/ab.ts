// The A/B test: two ladders that differ on exactly two boards.
//
// Arm A is the build that was on production the day this went in — `381adcd` — and it is the
// control. Arm B changes level 5 (eased: a bot tapping blind went 47% -> 73%) and level 10 (thinned
// from 21 trays to 19, careless play 70% -> 80%). Nothing else differs between them, so whatever
// the numbers show afterwards is those two boards and not a build.
//
// ⚠ **The arm is a property of the device, not of the session or the build.** It comes off
// `deviceId()`, the same persisted code telemetry already reports, so a player stays in the arm
// they started in — across reloads, across levels, and across every deploy after this one.
// Re-rolling per session would average the two arms together inside every player and measure
// nothing at all.
//
// ⚠ **Arm B is what `HANDMADE` holds; arm A is the override.** That way every script, the editor
// and the headless sim see the new boards by default — a test arm the tooling cannot measure is
// worse than no test — and `abArm()` falls back to B wherever there is no `localStorage`.
//
// ⚠ **The arm is stamped on every telemetry row** (`ab`). A split whose rows cannot be separated
// afterwards is not a test, it is two weeks of mixed data. `?ab=A` and `?ab=B` force an arm for
// checking by hand, and that override is deliberately not persisted.
import type { Blueprint, LevelBook } from "./custom";
import { deviceId } from "./playlog";

export type Arm = "A" | "B";

/** The levels the two arms disagree on. Everything else resolves the same way for everybody. */
export const AB_LEVELS = [5, 10];

/**
 * Arm A's two boards: level 5 and level 10 exactly as `381adcd` shipped them.
 *
 * ⚠ Frozen copies, pinned `columns` and `refTaps` included. A control arm that re-derives its own
 * well is not a control: `toLevelDef` aims the box-order search at `targetWin(level)`, and the
 * sheet row for 5 moved when the board did — so a re-derived "control" would be a third board.
 */
const CONTROL: Record<number, Blueprint> = {
  5: {"cols":5,"rows":3,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"wall"}],"columns":[[2,3,3,1,0],[2,1,0,1,0],[2,0,0,1],[1,3,0,1]],"refTaps":[12,13,8,3,7,11]} as Blueprint,
  10: {"cols":5,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"hatch","queue":[6,2,5],"hiddenQ":[false,true,true],"dir":"down"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":true},{"kind":"tile","color":6,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":3,"hidden":true},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":5,"hidden":true},{"kind":"wall"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":0,"hidden":false}],"boxHiddenFrac":0,"columns":[[3,6,5,5,5,5,1,6,5,1,6,5,1,6,0,5],[3,0,1,3,5,0,1,3,2,3,6,0,5,0,1,0],[3,0,1,3,5,0,1,3,2,3,2,2,2,5,5,5],[3,0,1,3,5,0,1,3,2,6,0,5,0,1,1]],"refTaps":[22,17,16,24,15,19,11,14,12,9,8,7,13,6,10,10,10,18,23,21,10]} as Blueprint,
};

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
 */
export function abArm(): Arm {
  const q = fromQuery();
  if (q) return q;
  try {
    const id = deviceId();
    if (id === "M-????") return "B";
    let h = 0x811c9dc5;
    for (let i = 0; i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h % 2 === 0 ? "A" : "B";
  } catch {
    return "B";
  }
}

/**
 * The shipped level book this device should see.
 *
 * ⚠ **A book, not a per-level override, so `blueprintFor` keeps its own ordering.** That function
 * resolves this device's saved drawings *first* and the shipped table second, deliberately — an
 * editor save that kept losing to the shipped copy reads as the save having failed. Swapping the
 * shipped table underneath it leaves that intact; intercepting ahead of it would break the editor
 * loop for whichever two levels the test happens to be on.
 */
export function abBook(shipped: LevelBook): LevelBook {
  return abArm() === "A" ? { ...shipped, ...CONTROL } : shipped;
}
