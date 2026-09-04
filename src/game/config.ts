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
 * and the only content left to cut is load-bearing — the chute is already at the shortest size
 * that was asked for (see `FUNNEL_ANGLE` and `FUNNEL_NECK_LEN`), and the grid is five rows at
 * pitch 71.
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
/**
 * The three HUD boosters (magnet, wrench, undo). Set to `false` to take the row away; the layout
 * below closes the gap on its own.
 *
 * ⚠ It lives here, not in `GameScene`, because the *layout* depends on it: hiding the row without
 * closing the hole it leaves is a strip of empty machine between the HUD and the cabinet. One
 * flag, read by both, or the pixels and the buttons disagree about whether boosters exist.
 * ⚠ Revive is not one of these. It is priced alongside them but is never a button — the jam
 * pop-up is its only door — so it stays live while this is off.
 *
 * ⚠ **Declared up here, above `GAME_H`, because the design box's height is derived from it.** With
 * the row on, the cabinet sits 84px lower and the box well ends 84px further down — so the shortest
 * box the game may be drawn in depends on this flag. It used to be declared below and the height
 * was a hardcoded 1080, which was correct only while the row was hidden: turning boosters on cut
 * 70px off the bottom of the machine on every frame shorter than about 2.15:1, taking the whole
 * bottom row of boxes off screen.
 */
export const SHOW_BOOSTERS = true;

/**
 * Magnets the player starts with, given outright.
 *
 * ⚠ Two, and the number is not arbitrary: one is a demonstration, two is a decision. The tutorial
 * spends the first *for* them, so the second is the first time they choose to use it — and choosing
 * is the thing that has to happen before a price means anything.
 */
export const FREE_MAGNETS = 2;

/**
 * The level that teaches the magnet.
 *
 * ⚠ A level number, which this project otherwise avoids — `coach.ts` and `featureProgress` both
 * read the board precisely so they cannot drift when the ladder moves, and it has moved three times
 * in a day. This one cannot be derived: "where the magnet should be taught" is a design decision,
 * not a property of a board. What *is* derived is everything inside the lesson — which trays it
 * points at come from the board, so a recoloured level 6 still teaches correctly.
 *
 * ⚠ The board here has to be able to produce a magnet plan after two taps, or the lesson stalls at
 * the step that waits for one. Level 6 can: its open boxes are all cyan and it holds four blue
 * trays over blue boxes one row down, so two blue taps put 18 marbles on the rail that nothing
 * accepts — which is the exact position the magnet exists for.
 */
export const MAGNET_TUTOR_LEVEL = 6;

/**
 * Dead space taken out of the column so the desktop build can be wider.
 *
 * ⚠ **Why height buys width.** Phaser's FIT scaler uses one ratio for everything —
 * `frame height / GAME_H` — so the design box's *width* has no effect at all: widening it only adds
 * empty canvas. The single lever on how big the game draws is `GAME_H`, and every pixel of margin
 * in the column is paid for in width on a landscape frame.
 *
 * ⚠ **None of this moves a piece of the machine relative to another.** It removes margin: the space
 * above the HUD, the slack the grid panel carried around a 5-row board, part of the cabinet's top
 * rim, and the skirt under it. The grid, the chute, the belt and the box well keep their sizes and
 * their spacing exactly.
 *
 * ⚠ `CHUTE_KEEP` is not a saving and must never become one. Every `y` in `funnel` already shifts
 * together through `BOOST_LIFT`; these shifts join it for the same reason — move one end of the
 * cone without the other and `FUNNEL_ANGLE` silently becomes a different angle, so the pacing the
 * chute was tuned to changes without any constant saying so. See the note on `funnel`.
 */
/**
 * How far the machine rides up now that the booster row is gone.
 *
 * The row used to span `boostY ± boostSize / 2` = 114…190 with the cabinet starting at 198. There
 * is one booster left and it sits **in the HUD**, so the row is not there at all and the cabinet
 * starts where it began.
 *
 * ⚠ **This is the whole of the desktop win, and it is not cosmetic.** `GAME_H` cannot be shorter
 * than the machine's own bottom edge, and Phaser's FIT scaler sets the canvas width from the design
 * box's aspect — so 84px of empty row cost the desktop build 84px of height it then paid for in
 * width. With the row present the flex range collapsed to a single value (1164…1164) and the
 * desktop canvas sat at 288px of a 1258px page; without it the range is 1080…1164 again and the
 * canvas is 311px. A tall phone is unaffected either way: at 2.16:1 it takes `H_MAX` and always
 * did.
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
// ⚠ Always lifted now: the booster sits **in the HUD**, beside the level pill, so the row it used
// to have is gone whether boosters are on or off. That row was 90px of empty column, and on a
// landscape frame every pixel of column height is paid for in width — see the note on TRIM_TOP.
// ⚠ **84 again: the booster is back on the HUD line and has no row of its own.** It sat under the
// level pill for a while, which cost 40px of column — and on this layout a pixel of column is paid
// for in width on every desktop frame. The row is gone because the line had space once the pill
// moved left against the gear and the coin moved right against the wall; the booster took the gap
// in the middle that opened up between them.
// ⚠ **94 since the booster's two soft rings came off on a phone.** The button keeps its seat in
// the middle of the HUD line, but the pad it sits on went from ±57 to ±37 — the rings were the
// widest thing on the row by a long way, and the cabinet had to start clear of them. Ten pixels
// here and eight on `TRIM_TOP` take the strip above the cabinet from 90 to 72, which leaves the
// solid pad overlapping the cabinet's top rim by about three pixels. That overlap is allowed
// deliberately: the rim is white casing with nothing on it, and three pixels of it is a far better
// use of the column than eighteen pixels of empty violet.
// ⚠ **This lever is portrait-only even though nothing here says so.** `HUD_LIFT` subtracts
// `BOOST_LIFT` and `MACHINE_TOP` adds it back, so on a wide frame the cabinet's top edge is
// `WIDE_MACHINE_TOP` whatever this is — and `FUNNEL_SHOULDER_BASE` and `GRID_TOP` cancel it the
// same way. Changing it cannot move the desktop layout by a pixel.
const BOOST_LIFT = 94;

/**
 * Is the frame landscape enough to put the HUD in a column beside the machine?
 *
 * ⚠ **Read once, at module load, exactly like `GAME_H` below it** — the whole layout is derived
 * from it, and half of that derivation is baked into textures. A phone that is rotated keeps the
 * layout it booted with, which is the behaviour `GAME_H` has always had.
 *
 * ⚠ 1.2, the same threshold `HomeScene` uses, and it must stay the same: the two screens hand off
 * to each other and a frame that gets the wide home screen and the portrait board reads as the game
 * changing shape when you press PLAY.
 */
export const WIDE_HUD =
  typeof window !== "undefined" && window.innerHeight > 0
    ? window.innerWidth / window.innerHeight >= 1.2
    : false;

/**
 * Empty design space added **each side** of the machine on a wide frame. The HUD lives in the left
 * one; the right one is there so the machine stays centred and every `GAME_W / 2` in `GameScene`
 * goes on meaning the middle of the screen.
 *
 * ⚠ It is free. Phaser's FIT scaler takes `min(frameW / boxW, frameH / boxH)`, and on any frame
 * wide enough to earn this the height is what binds — so the extra width costs nothing at all and
 * the machine is drawn at exactly the size `GAME_H` alone decides.
 *
 * 156 holds the 120px level pill with 18px of margin, and leaves 32px between the column and the
 * cabinet's left wall.
 */
export const STAGE_PAD = WIDE_HUD ? 156 : 0;

/**
 * How far the machine rides up once the HUD is no longer sitting on top of it.
 *
 * ⚠ **This is the point of the whole exercise, and it is width, not height.** `H_MIN` is the
 * machine's own bottom edge, `GAME_H` clamps to it on every landscape frame, and FIT then sets the
 * canvas from `frameH / GAME_H` — so 114px of HUD strip was costing the desktop build 114px of
 * height it paid for in width. Measured on a 1898x982 frame: `H_MIN` 970 -> 856, and the machine
 * goes from 547px wide to 620px. **13% bigger, for free.**
 *
 * ⚠ Subtracted from `FUNNEL_SHOULDER`, `GRID_TOP` **and** `MACHINE_Y` together, so `MACHINE_H` is
 * unchanged and the whole block moves as one. Take it off one of the three and the chute's angle
 * silently becomes a different one from the `FUNNEL_ANGLE` the walls claim to be built at.
 *
 * Defined below, once the trims it is measured against exist.
 */

/** Margin above the HUD: 24 was a comfortable gap on a phone and is pure cost on a desktop frame. */
// ⚠ 16 -> 24 once the booster's rings came off: the HUD line no longer carries a 114px-tall green
// pad that ran off the top of the canvas at y −11, so the row can sit closer to the edge. It moves
// the HUD and the machine together, and it cancels on a wide frame for the same reason
// `BOOST_LIFT` does.
const TRIM_TOP = 24;
/** The cabinet's top rim, 42px of grey bar above the grid cavity. 26 still reads as a lip. */
const TRIM_RIM = 16;
/** `gridPanel` carried 382 for a grid that is 348 at five rows — 34 of centring slack. */
const TRIM_PANEL = 34;
/** Skirt under the cabinet, 14 -> 6. */
const TRIM_SKIRT = 8;
/** The two gaps around the booster row, 14 and 8, taken to 8 and 6. */
const TRIM_GAPS = 8;

/** Where the cabinet's top edge sits on a wide frame: a margin, not a gap. */
const WIDE_MACHINE_TOP = 20;
/**
 * ⚠ **Derived from `BOOST_LIFT`, never typed in.** This was a hardcoded 114, chosen because it
 * put the cabinet's top edge at y 20. `MACHINE_TOP` is `198 - TRIM_TOP - TRIM_GAPS - HUD_LIFT`
 * minus `BOOST_LIFT`, so the moment the booster left its row and `BOOST_LIFT` went 40 -> 84 the
 * same 114 put that edge at **-24** and the top row of every board was clipped off the top of the
 * canvas — on desktop only, where `WIDE_HUD` is the layout, and therefore on none of the phone
 * screenshots. Pinning the edge instead of the lift means the next change to the booster cannot
 * do it again.
 */
const HUD_LIFT = WIDE_HUD ? 198 - TRIM_TOP - TRIM_GAPS - BOOST_LIFT - WIDE_MACHINE_TOP : 0;


/**
 * The rail and the balls, both bigger.
 *
 * ⚠ **They are one number, not two.** `BELT_SLOTS` is 30 and must stay 30 — belt capacity is one of
 * the most expensive constants in the game — so the gap between neighbouring marbles is
 * `perimeter / 30 - 2 * marbleR`. Growing the ball without growing the loop closes that gap to
 * nothing and the rail becomes a solid bar of touching marbles. The loop grows through `r` (its
 * cap radius) and `hx` (its half-length); the ball grows to match, and the gap is checked.
 *
 * ⚠ `hx` cannot grow far. The bottom straight has to span the box row — a marble only drops into a
 * column by physically travelling over it — and the housing has to stay inside the cabinet, which
 * is 26…514. At `hx` 200 the shell reaches 32…508.
 */
const BELT_R = 32;
/**
 * Belt half-length, 190 -> 202.
 *
 * ⚠ Bounded at both ends and the window is narrow. Too short and the bottom straight stops
 * spanning the box row; too long and the housing reaches the cabinet wall. At 204 it touched
 * 26..514 exactly — the rail looked like it was bursting out of the machine — which is why the
 * cabinet widened to 14..526 and this pulled back to 202, leaving 14px of shoulder either side.
 */
const BELT_HX = 202;
const BELT_SHELL = BELT_R + 8;
/**
 * Ball radius, 14 -> 15.
 *
 * ⚠ **Seven percent is the ceiling, and `SLOT_COLUMN` is what sets it.** A bigger ball needs a
 * wider gap on the rail, the gap comes from `perimeter / BELT_SLOTS`, and a wider gap means fewer
 * slots pass over each 100px box column. Swept every combination of ball, cap radius and half-length
 * that fits inside the cabinet: at r 16 the count drops from **3 slots per column to 2**, which is a
 * third fewer chances for a marble to fall into a box on each lap. That is a balance change, not a
 * look — nothing in the tuning has ever measured it — so the ball stops here.
 */
const MARBLE_R = 15;

/**
 * Clearance the box lids need below the rail, on top of the housing.
 *
 * ⚠ Reported from a screenshot as the rail "sitting on" the boxes. The balls reach 7px past the
 * shell and the lids were 10px below it — three pixels of daylight. Restoring the 15px the original
 * layout had costs 12px of height, which is 1.5% of the desktop width the trims bought. Worth it:
 * a rail that looks like it is grinding on the lids is a machine that looks broken.
 */
/**
 * Gap between the marble hanging under the rail and the top of the open box.
 *
 * ⚠ **Cut from 26 to 8** so the boxes sit right under the rail: the two are now drawn as one block
 * and 26px of white between them read as a gap inside it. What the number has to buy is that a
 * marble riding the belt does not overlap the box it is about to fall into — `BELT_R + MARBLE_R`
 * already covers the marble itself, so this is clearance on top of that, not the clearance.
 *
 * ⚠ It also shortens the cabinet: `WELL_BOTTOM` and `H_MIN` are derived from it, so every pixel
 * taken off here is a pixel the game gains in size on a desktop frame, where `GAME_H` is clamped to
 * the machine. Free height, not a cost.
 */
const BALL_CLEAR = 8;

/** Everything below the grid rises by this much; the machine loses it from its height. */
const TIGHTEN = TRIM_RIM + TRIM_PANEL;

// ── The chute, derived from its own geometry ────────────────────────────────
//
// ⚠ **The drop is the angle times the run — nothing else.** The chute's height is whatever
// `FUNNEL_ANGLE` needs to cross the horizontal distance from the cavity wall to the neck, so the
// only levers on it are that angle and that distance: a narrower grid (breaks the pinned cell 64 /
// pitch 71) or a wider neck (breaks the single-file queue). Every other rearrangement — one
// segment, two, a shoulder and a cone — comes out at exactly the same number.
//
// ⚠ **A chute this shallow only drains because the walls are near-frictionless.** At Matter's
// stock friction the sliding floor was real — measured: at 22.5° marbles strung out along the
// slope and never reached the neck, which is why this file used to insist on 33°. The walls and
// marbles now run friction 0.02 / frictionStatic 0.05 (`GameScene`), which is what lets the ~13°
// bottom of the bowl keep feeding; the price is that the last stretch is slow, and
// `CHUTE_STARVE_MS` over there is the backstop for a marble that parks anyway.
/**
 * Chord slope of the chute walls, from horizontal. The bowl curves through it — ~83° at the mouth
 * easing to ~13° at the throat with the current `CB` — so no single stretch of wall sits at this
 * number; it is what fixes the *height*: `FUNNEL_CONE_DROP` is `run × tan(this)`, 84px on the
 * desktop run of 188.
 *
 * ⚠ **24 was walked to on request, against recordings: 33 shipped, 42 and 45 bought the bowl its
 * headroom, then "làm phễu ngắn lại" took it to 20 and 24 stuck.** It is a pacing choice, and every
 * degree shed gives machine height back on a desktop frame, where `GAME_H` is clamped to the
 * cabinet.
 *
 * ⚠ **Do not widen the mouth to "add slope".** At a fixed angle more run means more drop, and at a
 * fixed drop more run means a *shallower* wall — the slow crawl near the throat is the bowl's own
 * ~13° bottom, and the mouth is the one lever that cannot fix it. What keeps 24° draining at all is
 * the near-zero wall friction; see the banner above.
 */
const FUNNEL_ANGLE = 24;
/**
 * Where the taper begins: the cavity walls themselves, 48/492 -> 34/506.
 *
 * ⚠ **The cavity is the board's width, so widening it is the only way a board gets wider.** It
 * sat 34px inside each cabinet wall, which on a phone is 34px of white either side of every
 * board. 20px is as close as it can come: the belt housing reaches 32..508 and the cavity must
 * not read as wider than the rail it pours onto.
 *
 * ⚠ **It costs height, so the desktop does not get it.** `FUNNEL_DROP` is the run from wall to
 * neck at `FUNNEL_ANGLE`, so 14px more run either side is ~6px more chute — and on a wide frame
 * `GAME_H` is clamped to the machine, so every pixel of chute comes straight off how big the game
 * draws.
 * A phone has height to spare and no width to spare; a landscape frame is the exact opposite.
 *
 * ⚠ **Same test as `HUD_LIFT`, deliberately.** `WIDE_HUD` is decided from the frame alone, before
 * anything about the machine exists, which is what makes it usable here — the honest condition is
 * "does this frame have height going spare", and that is `GRID_GROW`, which cannot be asked
 * because it is derived from the chute this very constant defines.
 */
const FUNNEL_WALL_L = WIDE_HUD ? 48 : 34;
const FUNNEL_WALL_R = GAME_W - FUNNEL_WALL_L;
/**
 * The neck, "barely wider than one marble" — which is what forces the queue single-file.
 *
 * ⚠ **68 — deliberately wide enough for two marbles abreast**, against a 30px ball. This reverses
 * what the file said for months: the neck was "barely wider than one marble" and that width was
 * called the mechanic. It is not. What meters the game is `Game.tick`, which lifts exactly one
 * marble per tick and only when `entryFreeNextTick` says the rail below will be clear — model code
 * that never looks at the chute. The neck width decides how the *queue looks* while it waits, and
 * a single-file column was chosen for readability, not for rules. Widened on instruction.
 *
 * ⚠ What is genuinely lost: the backlog stops being a neat column and becomes a heap, and the
 * heap is the warning the player is supposed to read when the belt is congested. Worth watching in
 * play — it is a legibility change, not a balance one, and no bot can measure it.
 *
 * ⚠ A wider neck is a shorter cone: the slope has less horizontal to cross at the same
 * `FUNNEL_ANGLE`, so `FUNNEL_CONE_DROP` falls with it and the machine gets shorter. That is a free
 * gain in how big the game draws on a desktop frame, not a cost.
 */
const FUNNEL_NECK_L = 236;
const FUNNEL_NECK_R = 304;
const FUNNEL_SHOULDER_BASE = 622 - BOOST_LIFT - TRIM_TOP - TRIM_GAPS - TIGHTEN - 40 - HUD_LIFT;
/** Top of the cavity. The grid lives between this and `FUNNEL_SHOULDER`, and nowhere else. */
const GRID_TOP = 240 - BOOST_LIFT - TRIM_TOP - TRIM_GAPS - TRIM_RIM - HUD_LIFT;
/** The sloped part: whatever `FUNNEL_ANGLE` needs to cross from the cavity wall to the neck. */
const FUNNEL_CONE_DROP = Math.round(
  (FUNNEL_NECK_L - FUNNEL_WALL_L) * Math.tan((FUNNEL_ANGLE * Math.PI) / 180),
);
/**
 * The straight vertical throat under the cone — the part that makes it read as a *neck* rather than
 * as a V that stops.
 *
 * ⚠ **9 is the third cut, each one on request: 43 → 16 with the funnel halving, → 13 ("cổ phễu cho
 * ngắn lại 20%"), → 9 ("30% nữa").** It is pure drawing now: `drainFunnel` takes a marble the
 * moment its centre is inside the neck's clear width, above this pipe, so the length decides
 * nothing but how much chrome the eye crosses between bowl and rail. `FUNNEL_DROP` shrinks with it
 * and the machine gets shorter — a free gain on every desktop frame, where `GAME_H` is clamped to
 * the cabinet.
 */
const FUNNEL_NECK_LEN = 9;

/**
 * Clear air between the floor of the neck and the top of the belt housing.
 *
 * ⚠ **A marble waiting in the neck has to be fully visible sitting ABOVE the rail.** It was 4px,
 * which is less than the block behind the belt reaches up (that block starts 8px over the housing
 * so the rail and the box well read as one piece) — so the bottom of every queued marble was drawn
 * behind it. Marbles backing up in the chute is the warning the player is meant to read when the
 * belt is congested, and a marble half-swallowed by the machine reads as a glitch instead.
 *
 * ⚠ It has to clear the BLOCK, not the housing: 8px for the block plus 7 for its slate lip, so
 * anything under 15 puts the marble back behind something. 20 leaves a visible sliver of daylight,
 * which is what "resting just above the rail" actually looks like.
 */
const NECK_TO_BELT = 20;
const FUNNEL_DROP = FUNNEL_CONE_DROP + FUNNEL_NECK_LEN;

/** Height of the visible stack of boxes in one column. */
const BOX_VISIBLE_H = 4 * (42 + 3);
/**
 * Floor showing under the deepest box.
 *
 * ⚠ **The well has to read as a recess the boxes sit *in*.** Sized to the stack exactly, the
 * last row lands flush on the rim and the two rounded edges sit a pixel apart, which reads as the
 * bottom row being cut off rather than as a floor.
 */
const WELL_FLOOR = 12;
/**
 * How far the balls reach below the belt centreline, r + marbleR, **not** shell.
 *
 * ⚠ The balls hang past the chrome: 32 + 15 = 47 against a 40px shell. Deriving the box lids
 * from the shell put them five pixels under the balls, which reads as the rail grinding on them.
 */
const BELT_REACH = BELT_R + MARBLE_R;

const MACHINE_Y = 198 - TRIM_TOP - TRIM_GAPS - HUD_LIFT;
/**
 * The cabinet's actual top edge. `MACHINE_Y` is the number before the booster row lifts it.
 *
 * ⚠ **Everything that turns a design-space y into a height must subtract this, never
 * `MACHINE_Y`.** They differ by `BOOST_LIFT`, and getting it wrong makes the cabinet report itself
 * 40px shorter than it is. `H_MIN` is derived from that report, so the game then declares it can
 * live in a box whose bottom 40px are the box well, and on a desktop frame the last row of boxes
 * is cut off by the edge of the canvas. Shipped that way and reported from the live frame.
 */
const MACHINE_TOP = MACHINE_Y - BOOST_LIFT;

// ── How much taller the grid may be on this frame ────────────────────────────
//
// ⚠ **The board grows into height the frame is not using, and only into that.** The machine has
// a fixed height of its own; a portrait phone at 2.16:1 leaves ~240px of background below it,
// while a 16:9 desktop frame leaves none at all — `GAME_H` is clamped to the machine there, which
// is why every pixel of column on this layout has been fought over. So the growth is measured
// rather than chosen: whatever the frame has spare, less a skirt, capped.
//
// ⚠ **It is a two-pass derivation and it has to be.** `GRID_GROW` needs `GAME_H`, which needs
// `H_MIN`, which needs the machine's height, which needs `GRID_GROW`. The cycle breaks by deriving
// the machine **once without any growth** — `H_MIN_BASE` — clamping the frame against that, and
// only then spending what is left. Because the growth slides the chute, the belt and the well down
// as one block, the grown `H_MIN` is exactly `H_MIN_BASE + GRID_GROW`, which by construction still
// fits inside `GAME_H`.
//
// ⚠ **Everything below the grid moves; nothing stretches.** The cone keeps `FUNNEL_ANGLE` because
// both ends slide together; moving one end alone bends it to an angle no constant admits to,
// which the note on `funnel` describes.
const _BELT_CY_BASE = FUNNEL_SHOULDER_BASE + 6 + FUNNEL_DROP + NECK_TO_BELT + BELT_SHELL;
const _WELL_BOTTOM_BASE = _BELT_CY_BASE + BELT_REACH + BALL_CLEAR + BOX_VISIBLE_H + WELL_FLOOR;
const H_MIN_BASE = _WELL_BOTTOM_BASE + 6 + 14 - TRIM_SKIRT;
const H_MAX = Math.max(1160, H_MIN_BASE);
const _aspect =
  typeof window !== "undefined" && window.innerWidth > 0
    ? window.innerHeight / window.innerWidth
    : H_MAX / GAME_W;
export const GAME_H = Math.round(
  GAME_W * Math.min(Math.max(_aspect, H_MIN_BASE / GAME_W), H_MAX / GAME_W),
);
/** Background left under the cabinet even on the tallest frame, so it stands on a floor. */
const GROW_KEEP = 44;
/**
 * ⚠ **The ceiling is what the grid can use, not what the frame can spare.** Past the point where
 * every board reaches `L.cell`, more height only pushes the machine down the screen: the cells stop
 * growing because `gridMetrics` caps them, and the rest becomes a taller empty cavity. Seven rows
 * at the full cell need 434px against a base of 308, so 130 is the last pixel that buys anything.
 */
const GROW_CAP = 130;
const GRID_GROW = Math.max(0, Math.min(GAME_H - H_MIN_BASE - GROW_KEEP, GROW_CAP));

/** The chute's shoulder, after the grid has taken whatever height this frame had spare. */
const FUNNEL_SHOULDER = FUNNEL_SHOULDER_BASE + GRID_GROW;
/** A lip, so the wall does not spring straight out of the cavity's rounded corner. */
const FUNNEL_TOP = FUNNEL_SHOULDER + 6;

/** Belt centreline: just under the chute's neck, plus its own housing. */
const BELT_CY = FUNNEL_TOP + FUNNEL_DROP + NECK_TO_BELT + BELT_SHELL;
/** Foot of the box well, in design space: the lowest thing the cabinet has to contain. */
const WELL_BOTTOM = BELT_CY + BELT_REACH + BALL_CLEAR + BOX_VISIBLE_H + WELL_FLOOR;
// The cabinet ends just under the well, whose foot is derived from the chute above it.
const MACHINE_H = WELL_BOTTOM + 6 - MACHINE_TOP;


/**
 * Where the cabinet actually ends, and the one check the two-pass derivation owes.
 *
 * ⚠ `GAME_H` was clamped against `H_MIN_BASE`, the machine **before** the grid grew. The growth
 * then pushes the cabinet's foot down by exactly `GRID_GROW`, so the arithmetic that keeps it on
 * screen is `GRID_GROW <= GAME_H - H_MIN_BASE - GROW_KEEP` — which is how `GRID_GROW` is defined,
 * and therefore true by construction. It is asserted anyway: the last two times the bottom of this
 * machine went off the bottom of the canvas, it was a height derived from the wrong end, it was
 * invisible on every desktop here, and it was reported from a live phone as a game that could not
 * be started.
 */
const MACHINE_BOTTOM = MACHINE_TOP + MACHINE_H;
if (MACHINE_BOTTOM + 14 - TRIM_SKIRT > GAME_H) {
  console.warn(
    `[layout] day may (${MACHINE_BOTTOM}) vuot qua khung ${GAME_H} — GRID_GROW ${GRID_GROW} qua lon`,
  );
}

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
/**
 * From this level up, the box stacks are mostly `?` — the colours below the open box are hidden.
 *
 * ⚠ **Nothing below the top of a column is ever hidden**; the open box always shows its colour.
 * `Game.isBoxHidden` is `idx > 0 && …`, so the rule is about the second row down and everything
 * under it, and a player can always see what the board is asking for *right now*.
 */
export const BOX_HIDDEN_FROM = 21;

/**
 * What share of the boxes below the top of each column have their colour hidden.
 *
 * ⚠ **This is the one difficulty lever the tuner cannot see.** Bots read `boxes` directly, so
 * hiding a colour changes nothing any of them measure — `npm run sim`, `npm run tune` and the
 * `(B+D)/2` targets will all read exactly the same before and after. It costs a *person* the
 * ability to plan two rows ahead and costs a bot nothing at all, so it can never be traded off
 * against tray count or colour count on the same scale, and it must never be tuned by bot.
 *
 * ⚠ That blindness is precisely why it is the right lever here. Measured over 12 hours of real
 * play, people were clearing level 20 at 91% and level 25 at 86% against bot scores of 18% and 1%
 * — the boards are hard for something that pours flat out and easy for someone who can read the
 * stack. Taking the stack away is aimed at the gap itself.
 *
 * Easy slots get 70%, hard ones up to 90%, straight off the slot's own target winrate.
 *
 * ⚠ **A floor, never a cap** — same convention as the sheet. A drawing that asks for more keeps it.
 */
export function boxHiddenFrom(level: number, target: number, drawn = 0): number {
  if (level < BOX_HIDDEN_FROM) return drawn;
  const t = Math.max(0.05, Math.min(0.9, target));
  return Math.max(drawn, 0.9 - 0.2 * ((t - 0.05) / 0.85));
}

/** Holes in one box. Fill them all and the box pops off, exposing the next one below. */
export const BOX_SLOTS = 3;
/** Box columns at the bottom of the machine. Also the number of simultaneously open colours. */
export const BOX_COLS = 4;

/**
 * Boxes cleared in a row before the cabinet throws fireworks.
 *
 * ⚠ `sfx.boxClear` owns what "in a row" means — its `CHAIN_MS` window — and this only says how
 * long. The visual is not a second reward on its own schedule; it is the top of the one the ear is
 * already following, so a run that makes the bell climb has to be a run that lights the rim.
 *
 * ⚠ **One tier, at three.** A second tier at two was built and taken straight back out: two boxes
 * in a row is not rare enough to be worth marking, so it fired most of the time and turned the
 * fireworks into background noise — which costs the three-in-a-row burst the only thing it has,
 * being unusual. Rewarding less is what makes the reward land.
 */
export const COMBO_RUN = 3;
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
export const GRID_MAX = 8;
/** How many boxes of a column are drawn before the stack runs off the bottom. */
/**
 * ⚠ **Four, down from five.** The fifth row was the price of the chute having a throat: dropping
 * it frees a 45px box row, the belt and the well move down by it, and the cone keeps its angle
 * because the throat is built out of the new height rather than carved out of the slope.
 * `BOX_VISIBLE_H` above must move with this or the cabinet stops matching what is drawn in it.
 */
export const BOX_VISIBLE = 4;

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
  // ⚠ **Three added after the first eight, and the choice is constrained by what is already here.**
  // A marble is 15px and a tray face is a flat square of one colour, so two swatches that read as
  // the same colour at that size are not two pieces — they are one piece the player will mis-sort.
  // Teal sits between green and cyan and survives only because cyan is a pale wash and this is
  // saturated; lime is pushed yellow-ward hard enough to clear green; magenta is the deep end of
  // pink. Brown was rejected — it is the crate colour — and grey with it, because a face-down tray
  // is grey and the whole point of that tile is that it reads as "colour unknown".
  //
  // ⚠ **Adding entries does not change a single generated level.** `paramsFromD` caps colours at a
  // literal 8, not at `PALETTE.length`, and every level in `SHEET` names its own count. Only a
  // hand-built board can reach these, which is the intent: they are for the editor.
  { name: "teal", base: 0x109c8d, light: 0x4fd8c6, dark: 0x0a6459 },
  { name: "lime", base: 0x9ad514, light: 0xc6f25c, dark: 0x638c00 },
  { name: "magenta", base: 0xd81b9c, light: 0xff62c8, dark: 0x8f0a66 },
  /**
   * ⚠ **Brown and grey each collide with a piece that is not a tray, and both were added anyway.**
   * Requested twice; the risk is written down here rather than argued about.
   *
   *   brown vs the **crate**  — the crate face is a #b98a52 -> #8d6236 tan with planks and a brace
   *     drawn on it. This brown is deliberately much darker so the two do not sit in the same band
   *     of lightness, and the crate keeps its woodgrain, which is the other half of telling them
   *     apart. A crate is the one thing on the board the player can do nothing about, so reading a
   *     tray as a crate costs them the move rather than just the sort.
   *
   *   grey vs the **face-down "?" tile** — that tile is #8d9bb4 -> #75839c, a *blue* slate. This
   *     grey is neutral, no blue cast, and darker. The "?" glyph is the real separator; the danger
   *     is the 15px marble on the rail, where there is no glyph and no tile, only the colour.
   *
   * Watch both on a phone before shipping a board that uses them next to a crate or a "?".
   */
  { name: "brown", base: 0x7a4b22, light: 0xb07a4a, dark: 0x4a2a10 },
  { name: "grey", base: 0x7e8388, light: 0xb4babf, dark: 0x4d5257 },
];

// ── Chrome ───────────────────────────────────────────────────────────────────
export const UI = {
  // ⚠ **Teal, not violet, from 2026-08-28** — matched to the reference machine rather than chosen.
  // `HomeScene` is deliberately NOT affected: it paints `COVER_BG` and `HOME_FOOT`, both sampled
  // from the cover render's own corner pixels, so changing these would leave the home screen's
  // letterbox disagreeing with the art it sits behind. If Home is ever meant to follow, the render
  // has to be re-made first and the two constants re-sampled from it.
  bg: 0xa9dedb,
  bgTop: 0xc2e9e4,
  bgBottom: 0x8ecfcf,
  glow: 0xe4f7f3,
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
  // ⚠ The three tones survive the hue change intact — only the hue moved. Interior and cavity stay
  // the near-white ground the pieces sit on; the rim stays the one solid mid-tone. Warming them all
  // toward the new background is what collapses this to two tones, which the note above forbids.
  // ⚠ **The page is the lightest thing on screen and the cabinet sits darker inside it** — the way
  // the reference machine reads, and the opposite of the first teal pass, which kept the white
  // cabinet and put a dark teal page around it. Reported as *"trong đậm ngoài nhạt chứ"*.
  machine: 0x62b4b8,
  machineEdge: 0x3f9095,
  panel: 0xeaf7f6,
  panelDeep: 0x9ed0d2,
  cell: 0xd6eeed,
  belt: 0x6f7686,
  beltDeep: 0x565d6b,
  beltLight: 0x8b93a3,
  chrome: 0xeff9f9,
  ink: "#2b3550",
  /**
   * The level pill and the coin, and now the mount under the booster too.
   *
   * ⚠ **The middle stop of the `btn("purple")` bake, and `textures.ts` reads it from here.** It was
   * 0x8f7ce8 and nothing read it at all: the pills were three hex literals a hundred lines away in
   * the bake, so this token was a colour the game did not use, sitting under the name of a colour it
   * did. Anything that has to match the pills — the booster's mount does, on a phone — would have
   * been a fourth copy.
   */
  pill: 0x7f6ada,
  pillEdge: 0x6a56c4,
  gold: 0xffc21e,
  green: 0x4bc84b,
  greenEdge: 0x2f8f2f,
};

// ── Layout, in design units ──────────────────────────────────────────────────



export const L = {
  hudY: 62 - TRIM_TOP,
  // Row gaps close up with everything else; the buttons keep their size.
  /**
   * The booster's seat, in the gap between the gear and the level pill.
   *
   * ⚠ Measured against the HUD, not chosen: the gear ends at x 83 and the level pill starts at 210,
   * so a 76px button centred at 140 clears both by about 20px. Its badge hangs to the lower right
   * and reaches ~191, still short of the pill. Move any of those three and this has to move too —
   * there is no room to absorb a shift.
   */
  /**
   * The booster's seat: on the HUD line, tucked against the level pill.
   *
   * ⚠ Measured, not chosen. The pill spans CX±60 and the gear ends at CX-187, so a 60px button
   * centred at CX-100 leaves 10px to the pill and 27px to the gear. Its badge hangs to the lower
   * right and reaches CX-64 — still clear. Move the pill or the gear and this has to move with them.
   */
  /**
   * ⚠ **On the HUD line, in the gap between the level pill and the coin.** The pill ends at 212 and
   * the coin starts at 400, so 306 is the middle of that 188px gap. The booster's pad reaches ±57 —
   * far wider than its 46px frame — so it needs the whole gap, not just the button's worth of it.
   * Move the pill or the coin and this has to move with them; there is no slack either side.
   */
  boostX: 306,
  boostY: 62 - TRIM_TOP,
  /**
   * The green frame behind the magnet. **Half the icon**, on purpose.
   *
   * ⚠ Not the tap target. The frame is what is drawn; the hit zone is sized separately and stays
   * finger-sized — shrinking a button's art and its hit area together is how a control ends up
   * "sometimes not working" on a phone and nowhere else.
   */
  boostSize: 46,
  /**
   * The HUD's column on a wide frame, in root-local design space — so `x` is **negative**, out in
   * the pad to the left of the machine.
   *
   * ⚠ Only read when `WIDE_HUD`. On a phone `STAGE_PAD` is 0, this column would sit on top of the
   * cabinet, and `hudY`/`boostX`/`boostY` above are still the layout.
   */
  hudCol: {
    x: -STAGE_PAD / 2,
    gearY: 52,
    levelY: 118,
    coinY: 180,
    boostY: 276,
  },

  // ⚠ Widened 488 -> 512 to make room for the bigger rail. The grid cavity did not move (48..492);
  // what grew is the shoulder either side of it, which is where the rail now ends.
  machine: { x: 14, y: MACHINE_TOP, w: 512, h: MACHINE_H },

  gridPanel: { x: FUNNEL_WALL_L, y: GRID_TOP, w: FUNNEL_WALL_R - FUNNEL_WALL_L, h: FUNNEL_SHOULDER - GRID_TOP },
  /**
   * Tray size — the **cap**, and the size the sprites are baked at. 56 -> 64, back where it began.
   *
   * ⚠ This is a ceiling, not the size a board draws at: `gridMetrics` takes the smaller of what
   * the width allows, what the height allows, and this. It went down to 56 to buy column height
   * for the booster's own row; that row is gone, the grid has taken the height back, and leaving
   * the cap at 56 would mean the extra room bought nothing at all.
   *
   * ⚠ **A cap below what the panel can fit is invisible.** Every board measured 56 exactly while
   * the panel could fit 82 — the numbers looked like a width limit and were the cap, which is the
   * kind of thing that gets diagnosed twice.
   *
   * ⚠ **Back to 56 on 2026-08-28, and this time for the spread rather than for a row of buttons.**
   * `GRID_MAX` is now 8, and an 8x8 board is held to 48 by the panel's own height whatever this
   * says — the cap cannot help it fit. What the cap decides is the *gap between board sizes*: at 64
   * a 5x5 drew a quarter larger than an 8x8, so an 8x8 level would have arrived looking like a
   * different game. At 56 every board from 4x4 to 7x7 draws identically and only 8-wide or 8-tall
   * boards step down, to 48.
   *
   * ⚠ **48 from the same day**, another 15% down and asked for by eye — *"khu vực phía trên vẫn lớn
   * quá, cho bé hơn 15% nữa"*. It lands on the one value where the panel can fit **every** board
   * size at the cap: 4x4 through 8x8 all draw at 48, so no level ever steps down and the grid is
   * one size for the whole game.
   *
   * ⚠ This breaks the "a 5-row board must stay pixel-identical" rule that stood above it, on
   * instruction. Anything measured against cell 64 — egg sizes, the badge insets, the coach ring —
   * now rides `L.cell`, and the tray sprites bake at 48.
   */
  cell: 48,
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
  // ⚠ The chute HAS since been shortened wholesale — 186px down to 93 — but on request and paid
  // for properly: the walls run near-frictionless now (see the banner on `FUNNEL_ANGLE`), where
  // the 2026-08 attempt compressed the cone to 22.5° under stock friction and the marbles strung
  // out along the slope and sat there. Screenshot after eight taps on level 5 whenever the shape
  // changes again.
  // ⚠ Every y here carries `BOOST_LIFT` so the chute keeps its exact length and cone angle — the
  // whole assembly slides, none of it stretches. Lifting `top` without `neckY` shortens the cone,
  // which is the 33°→22.5° failure the note above warns about, arrived at by accident.
  funnel: {
    shoulder: FUNNEL_SHOULDER,
    top: FUNNEL_TOP,
    // ⚠ Measured on the CONE, not on the whole drop. The drop now carries a 43px vertical throat
    // under the cone, and braking at 43% of the longer number would move the brake line down into
    // the cone — marbles then hang about halfway and never reach the neck, which is the exact
    // failure the note on this constant describes from the other direction.
    /**
     * Where `CONE_DRAG` switches on.
     *
     * ⚠ **0.43 of the way down was written for a cone twice this tall, and on a short one it brakes
     * the whole chute.** At the current drop that put the line 32px below the mouth with only 74px
     * of cone below it — so a marble was under drag for four fifths of its run and its measured
     * speed *fell* all the way down: 2.64 → 1.60 → 1.35 → 1.18 px/frame in bands from mouth to
     * neck. A ball rolling downhill that slows as it goes reads as broken, and was reported that
     * way. At 0.85 the brake is the throat only, and the run down the wall is gravity's.
     */
    brake: FUNNEL_TOP + Math.round(FUNNEL_CONE_DROP * 0.85),
    // ⚠ **The taper starts at the cavity wall, not inside it.** It used to begin at 54/486 — six
    // pixels in from the cabinet — which made the chute a wide wedge with a short vertical lip on
    // top. Starting it at the wall turns the whole thing into one continuous funnel, which is what
    // the reference machine looks like *and* is shorter: the 200px of horizontal run is now all
    // doing work instead of 194 of it, so the same 33° covers the distance in less height.
    mouthL: FUNNEL_WALL_L,
    mouthR: FUNNEL_WALL_R,
    // The neck runs all the way down to the belt housing. Ending it higher leaves marbles
    // popping onto the rail out of thin air, with a gap of empty machine in between.
    neckY: FUNNEL_TOP + FUNNEL_DROP,
    /**
     * Where the cone stops and the straight throat begins.
     *
     * ⚠ The chute used to be a V that simply ended — the walls met the neck width and the floor was
     * right there. A neck is a *length*, and without one there is nowhere for the single-file queue
     * to actually be single file: marbles arrived at the point of the V and sat in a heap. The 43px
     * below this line are vertical on both sides.
     */
    coneY: FUNNEL_TOP + FUNNEL_CONE_DROP,
    // ⚠ Widened with the ball, by the same proportion. The neck is "barely wider than one marble"
    // and that is what forces the queue single-file: 28 in 40 becomes 30 in 44. Widen it further and
    // two balls sit abreast, which is the whole mechanic gone.
    neckL: FUNNEL_NECK_L,
    neckR: FUNNEL_NECK_R,
  },

  // hx is sized so the belt's bottom run spans the whole box row — a marble has to
  // physically travel over a column to be able to drop into it, so any column sticking out
  // past the straight would be served from its edge instead of its middle.
  belt: {
    cx: 270,
    cy: BELT_CY,
    hx: BELT_HX,
    r: BELT_R,
    shell: BELT_SHELL,
  },
  marbleR: MARBLE_R,

  // ⚠ The gap under the rail is measured from the **balls**, not from the housing. A marble sits at
  // `cy ± (r + marbleR)` = 47 either side of the belt centre while the shell is only 40, so the balls
  // hang 7px below the chrome. Sizing this off the shell put them 3px from the box lids — visibly
  // resting on them.  is what they actually occupy.
  // ⚠ `h` is the box's **slot**, not its face: `BOX_LIP` of it is the body wall the face
  // stands on, which is what makes a box read as a solid thing rather than a coloured bar.
  // `h + vgap` is the pitch and it must stay **45** — `BOX_VISIBLE_H` above is written as
  // `5 * (42 + 3)`, `slideColumn` tweens by it, and `WELL_BOTTOM` is derived from it, so
  // moving the pitch moves the machine's own height. Taking the wall out of `h` and dropping
  // `vgap` to 0 is why the boxes now touch: a stack of boxes has no daylight between them, and
  // the wall's dark band already separates one face from the next.
  box: {
    top: BELT_CY + BELT_R + MARBLE_R + BALL_CLEAR,
    w: 100,
    gap: 6,
    h: 45,
    vgap: 0,
  },
};

export const CELL_PITCH = L.cell + L.gap;

/**
 * How big a crate is drawn, as a fraction of a tray.
 *
 * ⚠ **Presentation only — the crate still occupies its whole cell.** `cellFree` and `canEscape`
 * read the model, not the sprite, so a smaller picture changes no rule: the cell is as solid as it
 * ever was and no escape lane opens through the gap. Shrinking it is a way of saying *this is not
 * one of your pieces* — the cavity floor now shows all the way round it, so it reads as something
 * dropped into the board rather than as a tile of it.
 *
 * ⚠ Applied at **placement**, not baked into the texture. Every sprite here is baked at `L.cell`
 * and scaled by `cell / L.cell`; baking the crate smaller instead would leave its plank lines and
 * brace at their absolute widths, so the wood would come out coarser than the trays beside it.
 */
export const CRATE_SCALE = 0.7;

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
const GRID_MAX_W = FUNNEL_WALL_R - FUNNEL_WALL_L - 3;
/**
 * The grid stops **at the shoulder of the chute**, and this is that number rather than one typed
 * next to it.
 *
 * ⚠ **A board may not grow down into the funnel.** It was 60px more than the panel it sits in, so
 * every board over five rows — **63 of the 115 shipped levels** — hung past the bottom of the
 * cavity and covered the top of the chute. At six rows that was 57px of a 136px funnel: the V had
 * lost half its height and the board looked like it was sitting on the belt. Reported from level 40.
 *
 * ⚠ The consequence is that tall boards get **smaller cells**, and that is the trade being made
 * knowingly: a six-row board lands on 45 rather than 55. The alternative is more height, and height
 * is the one thing the desktop layout has none of — `GAME_H` is clamped to the machine there, so
 * every pixel spent here is a pixel off how big the game draws on every PC.
 *
 * ⚠ Five-row boards are untouched: 308 fits five cells of `L.cell` exactly.
 */
const GRID_MAX_H = FUNNEL_SHOULDER - GRID_TOP;

/**
 * Where a board that does not fill the panel sits in it — 0 is against the top rim, 1 against the
 * funnel's shoulder.
 *
 * ⚠ **1, i.e. every board sits on the mouth of the chute.** That is the rule the game already
 * plays by: the bottom row is the one board edge that counts as an exit, precisely because it sits
 * over the funnel, and `drawGridCavity` opens the cavity into the chute at the board's lowest row.
 * A board floating three rows above it draws a long neck down to the funnel and says the opposite
 * of what the rule is. Reported on a hand-built board with an empty bottom row: *"tôi xếp level 1
 * như này thì nó phải gần sát với phễu chứ, phải cách phễu 1 hàng thôi chứ"* — and the one row of
 * gap that board wants is the empty row it was **drawn** with, which is the right way to ask for
 * one. An empty cell is `floor`, not `wall`, so `boardBounds` counts it and the gap is the
 * designer's to place.
 *
 * ⚠ **Bottom-aligning cannot overflow the funnel, by construction.** `gridPanel.h` is
 * `FUNNEL_SHOULDER - GRID_TOP` and `GRID_MAX_H` is the same span, so the lowest row's bottom edge
 * lands exactly on the shoulder however many rows the board has. This was 0.22 for a while after
 * level 21 came out with its bottom row in the chute's throat — *"kích thước k lớn lắm mà nó tràn
 * cả ra phễu"* — but that was `GRID_MAX_H` running 60px past the panel it was meant to match, and
 * fixing the cap is what fixed it. The bias was belt and braces on a cap that no longer needs any.
 *
 * ⚠ It moves **every** board, not just short ones: a five-row level has three rows of slack at
 * cell 48 and now spends all of it going down. Check level 21 and a five-row board together after
 * touching this — the failure it guards against is a bottom row drawn over the funnel's throat,
 * and that is only visible in a screenshot.
 */
const GRID_BIAS = 1;

/**
 * The part of the grid a board actually occupies, in cells — everything outside it is casing.
 *
 * ⚠ **This is what the cells are sized against, not `cols x rows`.** A board is declared on a grid
 * and then a silhouette is cut out of it, so the declared size is an upper bound and often not the
 * board: **71 of the 115 shipped levels** declare a grid bigger than the shape inside it, and level
 * 7 declares 6x6 for a board that is 5x5. Sizing off the declaration made those levels draw at 45px
 * cells inside a cabinet they used two thirds of — reported as *"level này sao bé thế"*. Sizing off
 * the shape puts 39 of them back on the full `L.cell`.
 */
export interface GridBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

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

export function gridMetrics(cols: number, rows: number, used?: GridBox): GridMetrics {
  // ⚠ Sized and centred on the **shape**, indexed from the declared grid. `x`/`y` stay the origin
  // of cell (0,0) so every caller keeps reading `gm.x + col * gm.pitch`; they are simply shifted so
  // that the occupied part lands in the middle of the cabinet. Rows of pure casing may then fall
  // outside the panel, which costs nothing — `drawGridCavity` draws playable cells only, and a
  // pointer landing out there hits a walled cell and is refused like any other.
  const box = used ?? { x: 0, y: 0, w: cols, h: rows };
  const fitW = Math.floor((GRID_MAX_W + GRID_GAP) / Math.max(1, box.w)) - GRID_GAP;
  const fitH = Math.floor((GRID_MAX_H + GRID_GAP) / Math.max(1, box.h)) - GRID_GAP;
  const cell = Math.max(28, Math.min(L.cell, fitW, fitH));
  const pitch = cell + GRID_GAP;
  const w = cols * pitch - GRID_GAP;
  const h = rows * pitch - GRID_GAP;
  // ⚠ Centred in the panel, and `GRID_MAX_H` guarantees it fits. This used to say that a board
  // taller than the panel "hangs from its top edge and takes the extra height out of the chute
  // below", and it did — 57px of it on a six-row board. Cells shrink instead; the chute is not
  // spare room.
  const uw = box.w * pitch - GRID_GAP;
  const uh = box.h * pitch - GRID_GAP;
  const x = Math.round((GAME_W - uw) / 2) - box.x * pitch;
  const y = Math.round(L.gridPanel.y + Math.max(0, L.gridPanel.h - uh) * GRID_BIAS) - box.y * pitch;
  return { cell, pitch, x, y, w, h, bottom: y + h };
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
/**
 * One side of the chute as a polyline, from the top of the vertical wall down to the neck.
 *
 * **A bowl: near-vertical at the mouth, easing to ~13° at the throat, then a fillet into the
 * neck.** The straight cone this used to be, and the sliding-floor arithmetic that defended it,
 * both belong to the era of stock Matter friction — see the banner on `FUNNEL_ANGLE`. With the
 * walls at friction 0.02 the curve is free to spend most of its length shallow, which is what "bi
 * lăn được từ thành bên này sang thành bên kia" asked for: a marble entering with speed crosses the
 * bowl and runs up the far side before settling into the throat.
 *
 * ⚠ **Both the art and the Matter walls are built from this one function.** That is the other half
 * of why the 2026-08-19 attempt failed: the curve was drawn and the wall left straight, so the
 * marbles slid down an invisible line with a band of white between them and the surface they were
 * supposed to be resting on. Whatever shape this returns, the picture and the physics agree.
 */
export function funnelSide(side: -1 | 1, steps = 16): Array<{ x: number; y: number }> {
  const mx = side < 0 ? FUNNEL_WALL_L : FUNNEL_WALL_R;
  const nx = side < 0 ? FUNNEL_NECK_L : FUNNEL_NECK_R;
  const top = FUNNEL_TOP;
  const coneY = FUNNEL_TOP + FUNNEL_CONE_DROP;
  const dx = nx - mx, dy = coneY - top;
  /**
   * The bowl. A quadratic Bezier whose control point sits **below and outside** the straight line,
   * so the wall leaves the mouth steeper than average and eases off as it nears the throat.
   *
   * ⚠ **What governs this is the LENGTH of the too-shallow stretch, not its angle**, and getting
   * that wrong is what put a defect in front of the player. A pair at 0.32 / 0.95 was chosen against
   * a criterion that only constrained chords **above** the drain line, on the argument that
   * `drainFunnel` rescues anything below it. It does — for *reaching the belt*. It says nothing about
   * whether the marbles sit still while they wait, and that is the half that shows: the last 30px of
   * that curve ran at 20°, 15°, 10°, 6°, which is a ledge. Marbles rafted on it and shoved each other
   * back up the cone. Reported from play as *"bi lăn lên trên hoặc ra ngoài đoạn phễu gần cổ"*.
   *
   * ⚠ **Counting marbles that move upward cannot tell the shapes apart** — all five candidates, the
   * defect included, scored 0-1 climbs over 500 frames with the chute loaded to 25 bodies. A pile
   * jostles, so the metric fires on ordinary bounces. What separates candidates is static: read the
   * segment angles of the polyline itself, and mind the *length* of the shallow stretch, not just
   * its minimum.
   *
   * At 24° with this pair the profile runs **82.8° at the mouth down to 13.2°** at the throat,
   * peaking 18px off the chord, with no flat spot and no ledge — the 0.32/0.95 defect above put a
   * 6° shelf over the drain line, and that shelf is what rafted. The shallow bottom is livable now
   * for the reason the `FUNNEL_ANGLE` banner gives: the walls are near-frictionless, so marbles
   * crawl across it instead of parking, and `CHUTE_STARVE_MS` catches the one that parks anyway.
   */
  const CB = { a: 0.02, b: 0.49 };
  const out: Array<{ x: number; y: number }> = [{ x: mx, y: top }];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    out.push({
      x: u * u * mx + 2 * u * t * (mx + CB.a * dx) + t * t * nx,
      y: u * u * top + 2 * u * t * (top + CB.b * dy) + t * t * coneY,
    });
  }
  /**
   * …then into the throat, through a **fillet** rather than a corner.
   *
   * ⚠ **The bowl meets the neck at a 79° turn taken in a single step**, and that is what the drop
   * into the throat was reported as looking wrong. The bowl's last stretch runs at 11° — nearly flat
   * — and the neck is vertical, so a marble rolling along the bottom reaches the end of the wall and
   * simply falls off the edge of it. Nothing guides it in; the geometry stops supporting it.
   *
   * A quadratic Bezier whose control point **is the corner** is tangent to both lines at its ends by
   * construction, so the wall now curves from the bowl into the throat with no vertex at all. The
   * marble is carried round instead of dropped.
   *
   * ⚠ The tangent length is capped against **both** neighbours — half the last bowl chord and half
   * the neck — so a short neck or a fine subdivision cannot make the fillet eat the pieces either
   * side of it and move the throat. At the shipped geometry it is the neck that binds.
   *
   * ⚠ It rounds the corner *away* from the chute, so the opening can only get wider here, never
   * narrower. A fillet that cut the other way would pinch the throat, which is sized for two marbles.
   */
  const corner = { x: nx, y: coneY };
  const end = { x: nx, y: FUNNEL_TOP + FUNNEL_DROP };
  const prev = out[out.length - 2] ?? { x: mx, y: top };
  const back = Math.hypot(corner.x - prev.x, corner.y - prev.y);
  const T = Math.min(10, back / 2, (end.y - corner.y) / 2);
  if (T > 0.5) {
    const ux = (corner.x - prev.x) / (back || 1), uy = (corner.y - prev.y) / (back || 1);
    const A = { x: corner.x - ux * T, y: corner.y - uy * T };
    const B = { x: corner.x, y: corner.y + T };
    out.pop(); // the corner itself is now the fillet's control point, not a vertex
    out.push(A);
    for (let i = 1; i <= 4; i++) {
      const t = i / 4, u = 1 - t;
      out.push({
        x: u * u * A.x + 2 * u * t * corner.x + t * t * B.x,
        y: u * u * A.y + 2 * u * t * corner.y + t * t * B.y,
      });
    }
  }
  // …and straight down the rest of the throat. Vertical, so nothing can park on it.
  out.push(end);
  return out;
}

/** Half the width of the rim stroke, so the drawing and the offset below cannot drift apart. */
export const FUNNEL_RIM_W = 5;

/**
 * How far outside the physical surface the rim is drawn: half its own width, **plus the depth the
 * solver lets a body sink**.
 *
 * ⚠ Half the width alone is not enough, and the reason is measurable rather than aesthetic. Matter
 * resolves contacts with a slop — bodies are allowed to overlap slightly, and it needs that to keep
 * a resting stack stable. Measured over 10136 wall contacts: 10104 sit under 1px of penetration, 30
 * land in 1-3px, and 2 go past that in a squeeze at the throat. That is healthy physics, but it is
 * also 1-3px of marble drawn over a rim whose inner edge is exactly on the surface, and a screen
 * recording catches it. Reported from play as marbles rolling over the wall.
 *
 * So the rim is pushed out by the slop as well. The marble still rests on the same surface — nothing
 * about the physics moves — and the line it appears to rest on is now the line it cannot reach.
 */
export const FUNNEL_RIM_OFF = FUNNEL_RIM_W / 2 + 2.5;

/**
 * `funnelSide`, moved `dist` px **outward** — away from the chute.
 *
 * ⚠ **A stroke straddles the line it is given, and the inside half is the half a marble covers.**
 * The Matter face sits exactly on `funnelSide`, so a marble resting on the wall reaches the line and
 * buries `FUNNEL_RIM_W / 2` of a 5px rim under itself. Reported from play as marbles rolling over the
 * rim, and it is exactly that: 2.5px each side, which is 5 device pixels on a phone. Drawing the rim
 * from here, offset by half its own width, puts its **inner edge** on the surface the marbles
 * actually touch — so the rim is what they rest on, and the number in `config` is the clear opening
 * rather than 5px more than it.
 *
 * ⚠ Offset per **vertex**, not per segment. A per-segment offset — which is the right thing for the
 * Matter slabs, and what `buildWalls` does — leaves the stroke in disconnected pieces at every joint.
 * The vertex normal is the mean of its two adjacent segment normals, which is what a mitre is.
 *
 * ⚠ `side * (dy, -dx)` is the same outward direction `buildWalls` pushes its slabs by. One
 * expression, or the picture and the physics disagree about which way is out.
 */
export function funnelSideOffset(side: -1 | 1, dist: number, steps = 16): Array<{ x: number; y: number }> {
  const pts = funnelSide(side, steps);
  const segN = pts.slice(0, -1).map((p, i) => {
    const q = pts[i + 1];
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    return { x: (side * (q.y - p.y)) / len, y: (side * -(q.x - p.x)) / len };
  });
  return pts.map((p, i) => {
    const a = segN[Math.max(0, i - 1)];
    const b = segN[Math.min(segN.length - 1, i)];
    const nx = a.x + b.x, ny = a.y + b.y;
    const sq = nx * nx + ny * ny;
    /**
     * ⚠ **A true mitre, not the unit bisector times `dist`.** For unit normals `a` and `b` turning
     * by θ, `|a+b|` is `2cos(θ/2)`, and the offset corner has to sit `dist / cos(θ/2)` along the
     * bisector — so the factor is `2 * dist / |a+b|²`. Normalising instead lands every corner short
     * by `cos(θ/2)`, which is nothing along the smooth part of the curve and 0.7px at the elbow into
     * the neck, where the wall turns nearly 80° in one step. That is exactly where the rim was still
     * being overlapped.
     */
    if (sq < 1e-6) return { x: p.x, y: p.y };
    const k = (2 * dist) / sq;
    return { x: p.x + nx * k, y: p.y + ny * k };
  });
}

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
