// The A/B test: two openings, ten boards apart, one bundle.
//
// Arm A is the ladder that was serving CrazyGames on the morning of 21/8 — build `c0eebc3` — for
// **levels 1 to 10 only**. Arm B is everything this repo has done to those ten boards since.
// Level 11 upward is identical in both arms, so anything the numbers show afterwards is the first
// ten boards and nothing else.
//
// ⚠ **The arm is a property of the device, not of the session or the build.** It comes off
// `deviceId()`, the same persisted code telemetry already reports, so a player stays in the arm
// they started in — across reloads, across levels, and across every deploy after this one.
// Re-rolling per session would average the two arms together inside every player and measure
// nothing at all.
//
// ⚠ **Arm B is what `HANDMADE` holds; arm A is the override.** Every script, the editor and the
// headless sim then see the current boards by default — a test arm the tooling cannot measure is
// worse than no test — and `abArm()` falls back to B wherever there is no `localStorage`.
//
// ⚠ **Four of arm A's ten boards pinned no well of their own** (1, 2, 8, 10). For those
// `toLevelDef` derives one against `targetWin(level)`, and today's `SHEET` is not the sheet that
// shipped on 21/8 — most of those rows were re-specified this week. Copying the drawings alone
// resolved level 8 into a board nobody has ever played. What is frozen below is what that build's
// own engine actually returned: drawing, resolved `columns` and resolved `refTaps` together, each
// one checked to re-resolve to the same fingerprint in today's tree.
//
// ⚠ **The arm is stamped on every telemetry row** (`ab`). A split whose rows cannot be separated
// afterwards is not a test, it is a fortnight of mixed data — both arms ship in one bundle, so
// `build` cannot tell them apart. `?ab=A` and `?ab=B` force an arm for checking by hand, and that
// override is deliberately not persisted.
import type { Blueprint, LevelBook } from "./custom";
import { deviceId } from "./playlog";

export type Arm = "A" | "B";

/** The levels the two arms disagree on. Everything above resolves the same way for everybody. */
export const AB_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1);

const CONTROL: LevelBook = {"1":{"cols":4,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"}],"columns":[[1,0,3,3,3,3],[1,0,2,3,2,0],[1,0,2,3,2,0],[0,2,3,2,3,3]],"refTaps":[13,12,15,14,8,10,11,9]},"2":{"cols":5,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":1,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":6,"hidden":false},{"kind":"tile","color":6,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":7,"hidden":false},{"kind":"tile","color":6,"hidden":false},{"kind":"tile","color":7,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":7,"hidden":false},{"kind":"wall"},{"kind":"wall"}],"boxHiddenFrac":0,"columns":[[7,1,6,4,6,4,6,4],[7,4,4,7,6,6,7,1],[7,4,4,7,6,6,7],[7,4,4,7,6,6,1]],"refTaps":[22,17,12,11,16,13,18,6,7,2]},"3":{"cols":5,"rows":5,"cells":[{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"}],"columns":[[1,2,2,2,2,2,2,2,0,2],[1,0,3,0,3,0,2,3,1,2],[1,0,3,0,3,0,2,3,1,0],[1,0,3,0,3,0,2,3,0]],"refTaps":[12,7,8,11,2,6,10,5,9,3,1,0,4]},"4":{"cols":6,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"wall"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"wall"}],"columns":[[2,4,4,4,4,4,4,4,2],[1,2,0,2,0,0,4,2,2],[1,2,0,2,0,0,2,2],[1,2,0,2,0,0,4,2,2,2]],"refTaps":[17,11,16,13,15,14,9,10,8,12,7,6]},"5":{"cols":5,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"wall"},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false}],"columns":[[1,1,3,3,2,2,1,3,1,1,1,1,1,2,2,2],[1,3,2,3,0,2,2,4,1,4,1,3,0,4,4,4],[1,3,2,3,0,2,2,4,1,4,2,3,0],[1,3,2,3,0,2,2,4,1,4,3,0]],"refTaps":[24,21,19,18,23,13,22,8,17,9,20,12,3,7,11,14,2,6,4]},"6":{"cols":5,"rows":5,"cells":[{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"floor"},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"floor"},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"crate"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"floor"},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false}],"columns":[[0,1,1,1,1,3,3,3,1,1,1,4,1,4,1,4],[0,0,0,0,3,4,3,4,3,4,3,4,2,0,1,1],[0,0,0,0,3,4,3,4,3,4,3,4,2,0,1,1],[0,0,0,0,3,4,3,4,3,4,3,4,2,1,1]],"refTaps":[24,23,3,16,6,20,5,10,19,21,18,0,22,4,13,8,15,9,14,11,1]},"7":{"cols":6,"rows":6,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":6,"hidden":true},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":0,"hidden":true},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":7,"hidden":true},{"kind":"tile","color":4,"hidden":true},{"kind":"wall"},{"kind":"tile","color":0,"hidden":true},{"kind":"tile","color":2,"hidden":true},{"kind":"tile","color":6,"hidden":true},{"kind":"tile","color":7,"hidden":true},{"kind":"tile","color":6,"hidden":false},{"kind":"wall"},{"kind":"floor"},{"kind":"tile","color":7,"hidden":true},{"kind":"tile","color":6,"hidden":true},{"kind":"tile","color":2,"hidden":false},{"kind":"floor"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":7,"hidden":false},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"}],"boxHiddenFrac":0,"columns":[[7,2,2,2,2,1,6,1,6,1,6,6,6,6],[7,6,7,7,6,7,2,0,0,0,2,4,4,4],[7,6,7,7,6,7,2,0,0,0],[7,6,7,7,6,2,0,0,0,2]],"refTaps":[25,32,22,21,19,15,27,20,26,14,16,10,9,8,13,18]},"8":{"cols":5,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"tile","color":7,"hidden":false},{"kind":"tile","color":7,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":5,"hidden":true},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":7,"hidden":true},{"kind":"tile","color":4,"hidden":true},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":4,"hidden":false},{"kind":"tile","color":7,"hidden":false},{"kind":"wall"},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":4,"hidden":false}],"boxHiddenFrac":0,"columns":[[5,7,4,3,0,7,4,3,0,7,4,3,0,7,4],[5,0,5,4,2,7,4,7,4,5,3,7,5,4],[5,0,5,4,2,7,4,7,4,5,3,7,5,4],[5,0,5,4,2,7,4,7,4,5,3,4,4,4]],"refTaps":[22,23,21,18,17,19,16,12,7,13,14,8,6,11,9,10,5,15,24]},"9":{"cols":5,"rows":5,"cells":[{"kind":"tile","color":4,"hidden":false},{"kind":"wall"},{"kind":"hatch","queue":[2,2,2],"hiddenQ":[false,false,false],"dir":"down"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":true},{"kind":"wall"},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":2,"hidden":true},{"kind":"tile","color":2,"hidden":true},{"kind":"tile","color":0,"hidden":false},{"kind":"wall"},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":2,"hidden":false},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"},{"kind":"floor"}],"columns":[[2,4,1,4,2,1,4,2,1,2,2,2,2,2,2],[2,0,1,2,2,5,2,0,0,0,1,3,2,2],[2,0,1,2,2,5,2,0,0,0,1,3,2,2],[2,0,1,2,2,5,2,0,0,0,1,3,2,2]],"refTaps":[17,19,15,16,14,9,18,10,13,5,0,12,7,4,7,8,7,7,3]},"10":{"cols":5,"rows":5,"cells":[{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"wall"},{"kind":"hatch","queue":[6,2,5],"hiddenQ":[false,true,true],"dir":"down"},{"kind":"tile","color":0,"hidden":true},{"kind":"tile","color":3,"hidden":true},{"kind":"tile","color":6,"hidden":true},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":2,"hidden":false},{"kind":"tile","color":1,"hidden":true},{"kind":"tile","color":3,"hidden":true},{"kind":"tile","color":5,"hidden":false},{"kind":"tile","color":5,"hidden":true},{"kind":"wall"},{"kind":"tile","color":0,"hidden":false},{"kind":"tile","color":3,"hidden":false},{"kind":"tile","color":1,"hidden":false},{"kind":"tile","color":0,"hidden":false}],"boxHiddenFrac":0,"columns":[[0,6,5,3,5,3,5,3,2,5,3,1,2,5,3,1],[0,1,0,0,5,3,0,6,5,6,5,1,3,1,2,5],[0,1,0,0,5,3,0,6,5,6,5,1,3,1,2,3],[0,1,0,0,5,3,6,5,2,5,1,3,1,2,1]],"refTaps":[21,24,19,22,14,13,8,9,12,11,6,10,10,10,17,23,10,15,18,7,16]}} as unknown as LevelBook;

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
 * loop for the ten levels the test happens to cover.
 */
export function abBook(shipped: LevelBook): LevelBook {
  return abArm() === "A" ? { ...shipped, ...CONTROL } : shipped;
}

/** Arm A's board for a level, or null. Exported for tooling that wants to measure the control. */
export function abControl(level: number): Blueprint | null {
  return (CONTROL as Record<number, Blueprint>)[level] ?? null;
}
