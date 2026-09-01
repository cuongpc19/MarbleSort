// Every graphic in the game is drawn into a canvas at boot — there is no public/art, so
// there is nothing to load, nothing to cache-bust and nothing to keep in sync with the
// palette in config.ts.
//
// Textures are baked at TS× and drawn back at 1/TS so they stay sharp on a 2× phone while
// the rest of the game keeps working in flat design units.

import Phaser from "phaser";
import { BOX_SLOTS, CELL_PITCH, L, PALETTE, TRAY_N, UI, type Color } from "./config";

export const TS = 2;

/**
 * Eggs on the face of a tray tile — one per marble it holds, in a 3x3. Deliberately tied to
 * TRAY_N rather than hard-coded: the tile is the player's only warning of how much belt a tap
 * is about to spend, and it lying about that is worse than no marking at all.
 */
const EGGS = TRAY_N;
const EGG_COLS = 3;

/**
 * How much of a piece's height is **body wall** rather than face. What shows under the face is
 * the piece's own thickness, and it is the only thing separating a box from a coloured bar.
 *
 * ⚠ **Measured off the reference machine** (`Manythings/IMG_6564.MP4`), one pixel column down a
 * yellow box: 1px dark outline, 1px light rim, **20px of dead-flat face**, a 7px ramp, 2px dark
 * outline. 32px tall — so the wall is 22% of the piece and the first attempt at this was already
 * the right *depth*. What made it read heavy was every other decision:
 *
 * - ⚠ **The ramp changes hue, it does not darken.** Theirs runs (253,253,0) to (237,170,4): red
 *   is untouched and only green falls, i.e. yellow rolling into amber. Ending it below `sw.dark`
 *   — the first version went to `shade(dark, -0.34)` — turns a lit surface into a shadow, and a
 *   shadow under every one of forty pieces is what "nặng nề" means. **Stop at `sw.dark`.**
 * - ⚠ **The face is flat.** 20 of their 32 rows are the same three bytes. A gradient down the
 *   whole face puts its darkest value directly above the wall, so the two read as one large mass
 *   instead of a face and an edge. Ours keeps a short sheen over the top third and nothing below.
 * - ⚠ **A crisp 1-2px outline is what buys the slimness.** With a hard edge the wall reads as an
 *   edge; without one it reads as mass, and no amount of lightening the ramp fixes that. It is
 *   also why the first version needed a side vignette and a seam line to look solid — both are
 *   ink spent standing in for an outline, and both are gone.
 */
const BOX_LIP = 11;
const TRAY_LIP = 10;

/** Outline weight, and the tone of it against the piece's own swatch. */
const OUT = 1.3;
const outlineOf = (dark: number) => shade(dark, -0.3);

/** The coloured face of a box — the part above its body wall. */
export const BOX_FACE_H = L.box.h - BOX_LIP;

/** Hole geometry for the active box — shared with GameScene so the marbles land in them. */
export const HOLE_R = 11;
export const HOLE_STEP = HOLE_R * 2.6;
/** ⚠ A hole is an **oval**, not a circle — theirs run about 1.7 wide to 1 tall. */
const HOLE_RY = HOLE_R * 0.8;

/**
 * Centre y of the holes inside a box sprite. ⚠ Exported because `GameScene.holePos` has to land
 * its marbles in them: the two used to carry the same `h / 2 - 2` written out twice, which was
 * only ever right while the face filled the sprite. It no longer does.
 */
export const HOLE_CY = BOX_FACE_H / 2 + 1;

const hex = (n: number) => "#" + n.toString(16).padStart(6, "0");

/** Lighten (`k > 0`) or darken (`k < 0`) a palette colour, for the tones between the swatches. */
const shade = (n: number, k: number) => {
  const ch = (sh: number) => {
    const v = (n >> sh) & 255;
    return Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
  };
  return "#" + ((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0");
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.lineTo(x + w - k, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + k);
  ctx.lineTo(x + w, y + h - k);
  ctx.quadraticCurveTo(x + w, y + h, x + w - k, y + h);
  ctx.lineTo(x + k, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - k);
  ctx.lineTo(x, y + k);
  ctx.quadraticCurveTo(x, y, x + k, y);
  ctx.closePath();
}

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function bake(scene: Phaser.Scene, key: string, w: number, h: number, draw: Draw) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, Math.ceil(w * TS), Math.ceil(h * TS));
  if (!tex) return;
  const ctx = tex.getContext();
  ctx.save();
  ctx.scale(TS, TS);
  draw(ctx, w, h);
  ctx.restore();
  tex.refresh();
}

/** Add a baked texture at design-unit size. */
export function img(scene: Phaser.Scene, key: string, x = 0, y = 0): Phaser.GameObjects.Image {
  return scene.add.image(x, y, key).setScale(1 / TS);
}

// ── Keys ─────────────────────────────────────────────────────────────────────

export const K = {
  marble: (c: Color) => `mb${c}`,
  /** `raised` is the tappable look; the flat one reads as sealed. */
  tray: (c: Color, raised: boolean) => (raised ? `tr${c}` : `trf${c}`),
  /** the x2 tray, two cells wide */
  trayWide: (c: Color, raised: boolean) => (raised ? `trw${c}` : `trwf${c}`),
  trayHidden: "trH",
  dispenser: "disp",
  crate: "crate",
  bar: "bar",
  /** The clip that holds a linked pair together. */
  link: "link",
  /**
   * The arrow lock: a chevron on a dark disc, sitting on the face of a sealed tray and pointing
   * at the neighbour that has to be poured first.
   *
   * ⚠ **One texture, baked pointing up, turned by the scene** — the same trick the hatch shutter
   * uses. Four baked arrows would be four chances for one of them to be drawn a pixel off centre,
   * and the rotation is exactly what the rule is about.
   */
  arrow: "arrow",
  lid: "lid",
  /**
   * The two ribbons tied round a chocolate box, in the colour that counts toward opening it.
   * `null` is the rainbow box, whose ribbons run through every colour because a tray of *any*
   * colour counts.
   */
  lidRibbon: (c: Color | null) => (c === null ? "lidRibR" : `lidRib${c}`),
  /** The pale disc the counter sits on, so the number stays legible over dark chocolate. */
  lidDial: "lidDial",
  boxHidden: "bxHid",
  cell: "cell",
  box: (c: Color) => `bx${c}`,
  boxOpen: (c: Color) => `bxo${c}`,
  cleat: (light: boolean) => (light ? "cleatL" : "cleatD"),
  spark: "spark",
  ring: "ring",
  /** The pointing hand every coach mark travels on. */
  hand: "hand",
  rays: "rays",
  flash: "flash",
  btn: (kind: string) => `btn_${kind}`,
  icon: (kind: string) => `ic_${kind}`,
  star: (on: boolean) => (on ? "starOn" : "starOff"),
  coin: "coin",
  /** The home screen's daily-reward button: a tear-off calendar with a coin on it. */
  calendar: "cal",
  /** Day seven's prize. Bigger than a coin because it has to look like more than a coin. */
  chest: "chest",
  /** The padlock on a daily-reward day the player has not reached yet. */
  lock: "lock",
};

// ── The bakery ───────────────────────────────────────────────────────────────

export function bakeAll(scene: Phaser.Scene) {
  const R = L.marbleR;

  PALETTE.forEach((sw, c) => {
    // Marble: light source up-left, dark rim, one hard specular dot. The dot is what makes
    // a flat circle read as glass rather than as a coloured disc.
    bake(scene, K.marble(c), R * 2, R * 2, (ctx) => {
      const g = ctx.createRadialGradient(R * 0.62, R * 0.58, R * 0.12, R, R, R);
      g.addColorStop(0, hex(sw.light));
      g.addColorStop(0.45, hex(sw.base));
      g.addColorStop(1, hex(sw.dark));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(R, R, R - 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(R * 0.66, R * 0.55, R * 0.26, R * 0.18, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.ellipse(R * 1.28, R * 1.42, R * 0.16, R * 0.1, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Tray tile, in two states, and the gap between them has to be obvious at arm's length
    // on a phone: a tray with a lane out grows nine eggs, a boxed-in one is a bare slab.
    // Presence-versus-absence beats any amount of shading — it survives every colour in the
    // palette and reads without comparing two tiles side by side.
    const trayFace = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      raised: boolean,
      cells = 1,
    ) => {
      const faceH = h - TRAY_LIP;
      const face = () => rr(ctx, OUT, 1 + OUT, w - OUT * 2, faceH - OUT, 13);
      // Outline first, over the whole silhouette; everything after it is drawn inside.
      ctx.fillStyle = outlineOf(sw.dark);
      rr(ctx, 0, 1, w, h - 1, 14);
      ctx.fill();
      // The wall: one ramp from the face's own colour to `sw.dark`, and no further. It is the
      // piece rolling away from the light, not a shadow under it.
      const wall = ctx.createLinearGradient(0, faceH - 1, 0, h - OUT);
      wall.addColorStop(0, hex(sw.base));
      wall.addColorStop(1, hex(sw.dark));
      ctx.fillStyle = wall;
      rr(ctx, OUT, 1 + OUT, w - OUT * 2, h - 1 - OUT * 2, 13);
      ctx.fill();
      // The face, flat but for a sheen over the top third. ⚠ Run the gradient the whole way down
      // and its darkest value lands directly on the wall, so face and wall read as one mass.
      const g = ctx.createLinearGradient(0, 0, 0, faceH * 0.45);
      g.addColorStop(0, hex(raised ? sw.light : sw.base));
      g.addColorStop(1, hex(sw.base));
      ctx.fillStyle = g;
      face();
      ctx.fill();

      const eggCols = EGG_COLS * cells;
      const rows = Math.ceil(EGGS / EGG_COLS);
      const er = 6.2;
      // ⚠ Measured from `faceH`, not from the sprite: the eggs belong on the face and the wall is
      // not part of it. Off the sprite they straddle the seam and the bottom row sits on the wall.
      const spanX = (w - 16) / eggCols;
      const spanY = (faceH - 10) / rows;
      if (raised) {
        for (let i = 0; i < EGGS * cells; i++) {
          const cx = 8 + spanX * ((i % eggCols) + 0.5);
          const cy = 6 + spanY * (((i / eggCols) | 0) + 0.5);
          // Cast down-right, then light up-left: the pair is what sells the bulge.
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = hex(sw.dark);
          ctx.beginPath();
          ctx.ellipse(cx + 0.5, cy + 1.8, er, er * 1.06, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          const bg = ctx.createRadialGradient(cx - er * 0.45, cy - er * 0.5, 1, cx, cy, er * 1.15);
          bg.addColorStop(0, "#ffffff");
          bg.addColorStop(0.35, hex(sw.light));
          bg.addColorStop(1, hex(sw.base));
          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.ellipse(cx, cy, er, er * 1.06, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Sealed: a bare face with a soft inner shadow, so it reads as a lid rather than as
        // a tray whose eggs happen to be badly lit.
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = hex(sw.dark);
        rr(ctx, 8, 7, w - 16, faceH - 14, 9);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // A light rim along the **top edge only** — one pixel of it in the reference, and it is what
      // makes a flat face read as the top of something. Stroked all the way round it is a second
      // outline, and two outlines is most of the heaviness this replaced.
      ctx.save();
      face();
      ctx.clip();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = shade(sw.light, 0.45);
      ctx.lineWidth = 2;
      rr(ctx, OUT + 1, 2 + OUT, w - OUT * 2 - 2, faceH, 12);
      ctx.stroke();
      ctx.restore();
    };
    bake(scene, K.tray(c, true), L.cell, L.cell, (ctx, w, h) => trayFace(ctx, w, h, true));
    bake(scene, K.tray(c, false), L.cell, L.cell, (ctx, w, h) => trayFace(ctx, w, h, false));
    // The x2 tray spans two cells and carries twice the eggs, so the size of the thing you
    // are about to dump on the belt is legible before you read the badge.
    const ww = L.cell + CELL_PITCH;
    bake(scene, K.trayWide(c, true), ww, L.cell, (ctx, w, h) => trayFace(ctx, w, h, true, 2));
    bake(scene, K.trayWide(c, false), ww, L.cell, (ctx, w, h) => trayFace(ctx, w, h, false, 2));

    // Box: the bar the marbles land in. Two variants — sealed, and the active one with its
    // holes showing. Only the top box of a column is ever drawn open.
    const bw = L.box.w;
    const bh = L.box.h;
    const faceH = BOX_FACE_H;
    const boxFace = (ctx: CanvasRenderingContext2D) =>
      rr(ctx, OUT, OUT, bw - OUT * 2, faceH - OUT, 10);
    const drawBody = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = outlineOf(sw.dark);
      rr(ctx, 0, 0, bw, bh, 11);
      ctx.fill();
      const wall = ctx.createLinearGradient(0, faceH - 1, 0, bh - OUT);
      wall.addColorStop(0, hex(sw.base));
      wall.addColorStop(1, hex(sw.dark));
      ctx.fillStyle = wall;
      rr(ctx, OUT, OUT, bw - OUT * 2, bh - OUT * 2, 10);
      ctx.fill();
      // ⚠ The sheen runs over the top 45% and the face is flat below it. It used to run the whole
      // height, and the note it replaces is still the reason the two pieces must be drawn the same
      // way: a box is a flat bar and a tray is nine lit eggs, so one swatch drawn identically
      // reads *darker* on the box — orange measured #ff8e1a against the tray's #fc9d39, and was
      // reported from real play. Match the **mean** lightness, which means matching the recipe:
      // same sheen fraction, same wall ramp, same outline on both.
      const g = ctx.createLinearGradient(0, 0, 0, faceH * 0.45);
      g.addColorStop(0, hex(sw.light));
      g.addColorStop(1, hex(sw.base));
      ctx.fillStyle = g;
      boxFace(ctx);
      ctx.fill();
      ctx.save();
      boxFace(ctx);
      ctx.clip();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = shade(sw.light, 0.45);
      ctx.lineWidth = 2;
      rr(ctx, OUT + 1, OUT + 1, bw - OUT * 2 - 2, faceH, 9);
      ctx.stroke();
      ctx.restore();
    };
    bake(scene, K.box(c), bw, bh, drawBody);
    bake(scene, K.boxOpen(c), bw, bh, (ctx) => {
      drawBody(ctx);
      // ⚠ A **recess, not a punched hole**, and it was the single heaviest mark left on the piece.
      // Measured down the reference's blue box: the hole runs (0,96,194) at its top to (0,122,220)
      // at its foot against a (23,177,255) face — 0.55x rising to **0.70x**, i.e. lighter toward
      // the bottom, where light bounces back out of it. `sw.dark` under 35% black is 0.40x flat
      // all the way through, which reads as a dot painted on rather than a socket cut in.
      for (let i = 0; i < BOX_SLOTS; i++) {
        const cx = bw / 2 + (i - (BOX_SLOTS - 1) / 2) * HOLE_STEP;
        const pit = ctx.createLinearGradient(0, HOLE_CY - HOLE_RY, 0, HOLE_CY + HOLE_RY);
        pit.addColorStop(0, shade(sw.dark, -0.16));
        pit.addColorStop(1, shade(sw.dark, 0.16));
        ctx.fillStyle = pit;
        ctx.beginPath();
        ctx.ellipse(cx, HOLE_CY, HOLE_R, HOLE_RY, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });

  // The clip joining a linked pair. Drawn as its own small sprite between the two trays rather
  // than baked into a double-width face: a pair carries two colours, and baking every
  // combination would be PALETTE² textures at boot for a thing 18px wide.
  /**
   * ⚠ **Dark on the tray, not tinted with it.** The tray underneath is a locked one, so it is
   * already wearing the flat face, and a chevron in the tray's own colour on a tray's own colour
   * is the one combination that disappears at arm's length — the same trap the box-clear burst
   * fell into on a white cabinet. Ink and white read on all seven.
   */
  bake(scene, K.arrow, 34, 34, (ctx, w) => {
    const r = w / 2;
    const stroke = (color: string, dy: number, width: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(r, r + 9 + dy);
      ctx.lineTo(r, r - 7 + dy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r - 7, r - 2 + dy);
      ctx.lineTo(r, r - 9.5 + dy);
      ctx.lineTo(r + 7, r - 2 + dy);
      ctx.stroke();
    };
    // ⚠ **A shadow under it, not a disc behind it.** White alone is the request and white alone is
    // unreadable on the pale half of the palette — yellow and cyan trays are nearly white
    // themselves, and this sits on the *flat* face, which is the tray's own colour with no eggs to
    // break it up. So the arrow stays purely white and the contrast comes from underneath: one
    // darker pass, offset down and drawn fatter, which reads as depth on the dark swatches and as
    // an outline on the light ones. Same trick as the eggs on `trayFace`.
    ctx.globalAlpha = 0.4;
    stroke("#101a30", 2, 8.5);
    ctx.globalAlpha = 1;
    stroke("#ffffff", 0, 5);
  });

  bake(scene, K.link, 22, 30, (ctx, w, h) => {
    ctx.fillStyle = hex(UI.machineEdge);
    rr(ctx, 0, 0, w, h, 7);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    rr(ctx, 2, 2, w - 4, h - 7, 5);
    ctx.fill();
    ctx.fillStyle = hex(UI.panelDeep);
    rr(ctx, 6, 8, w - 12, h - 16, 3);
    ctx.fill();
  });

  // A tile whose colour is still unknown. Cannot be tapped, so it reads as inert grey.
  bake(scene, K.trayHidden, L.cell, L.cell, (ctx, w, h) => {
    // ⚠ Same body wall as a coloured tray, in grey. A face-down tray sitting flat beside pieces
    // with visible thickness reads as a hole in the board rather than as a tray.
    const faceH = h - TRAY_LIP;
    ctx.fillStyle = "#414c60";
    rr(ctx, 0, 1, w, h - 1, 14);
    ctx.fill();
    const wall = ctx.createLinearGradient(0, faceH - 1, 0, h - OUT);
    wall.addColorStop(0, "#8d9bb4");
    wall.addColorStop(1, "#5d6b85");
    ctx.fillStyle = wall;
    rr(ctx, OUT, 1 + OUT, w - OUT * 2, h - 1 - OUT * 2, 13);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, faceH * 0.45);
    g.addColorStop(0, "#a3b0c6");
    g.addColorStop(1, "#8d9bb4");
    ctx.fillStyle = g;
    rr(ctx, OUT, 1 + OUT, w - OUT * 2, faceH - OUT, 13);
    ctx.fill();
    ctx.fillStyle = "#dfe6f5";
    ctx.font = `700 ${Math.round(faceH * 0.6)}px "Lilita One", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", w / 2, faceH / 2);
  });

  // Empty grid slot.
  bake(scene, K.cell, L.cell, L.cell, (ctx, w, h) => {
    ctx.fillStyle = hex(UI.cell);
    rr(ctx, 2, 2, w - 4, h - 4, 12);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    rr(ctx, 3, 3, w - 6, h - 6, 11);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // The hatch. It is a machine part, not a tile: a housing with a roller shutter across the
  // bottom, and the count on its face is how many trays are still behind the door. Trays are
  // pushed out from under the shutter into the cell below, so the door has to read as a door.
  bake(scene, K.dispenser, L.cell, L.cell, (ctx, w, h) => {
    const doorTop = h - 21;
    ctx.fillStyle = "#2f3a4f";
    rr(ctx, 1, 3, w - 2, h - 3, 13);
    ctx.fill();

    // Housing face, lit from above.
    const g = ctx.createLinearGradient(0, 0, 0, doorTop);
    g.addColorStop(0, "#b6cbec");
    g.addColorStop(1, "#7f99c6");
    ctx.fillStyle = g;
    rr(ctx, 2, 2, w - 4, doorTop - 2, 12);
    ctx.fill();
    ctx.strokeStyle = "#61789f";
    ctx.lineWidth = 2;
    rr(ctx, 3, 3, w - 6, doorTop - 4, 11);
    ctx.stroke();

    // Rails either side of the opening.
    ctx.fillStyle = "#5a6c8c";
    rr(ctx, 3, doorTop - 4, 6, 22, 3);
    ctx.fill();
    rr(ctx, w - 9, doorTop - 4, 6, 22, 3);
    ctx.fill();

    // Roller shutter: slats, then a heavier lip along the bottom edge.
    ctx.fillStyle = "#3d4a63";
    rr(ctx, 7, doorTop - 2, w - 14, 20, 5);
    ctx.fill();
    ctx.strokeStyle = "#55658a";
    ctx.lineWidth = 1.6;
    for (let k = 0; k < 3; k++) {
      const y = doorTop + 2.5 + k * 5;
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#26303f";
    rr(ctx, 6, h - 8, w - 12, 6, 3);
    ctx.fill();
  });

  // Belt tread. One sprite per cleat, because the tread has to travel with the marbles —
  // baked into the housing it would sit still and the marbles would read as sliding along a
  // dead track instead of being carried by a moving belt.
  ([true, false] as const).forEach((light) => {
    // Sized just under a marble so a seated marble covers its hole exactly, the way it does
    // on the reference machine.
    bake(scene, K.cleat(light), 30, 32, (ctx, w, h) => {
      ctx.fillStyle = hex(light ? UI.beltLight : UI.beltDeep);
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 10.2, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = light ? 0.2 : 0.32;
      ctx.fillStyle = light ? "#ffffff" : hex(UI.belt);
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 - 2, 7.3, 7.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  });

  // A crate: the one thing on the board the player can do nothing about. Wood against all
  // that moulded plastic, so it reads as "not part of the puzzle" at a glance.
  bake(scene, K.crate, L.cell, L.cell, (ctx, w, h) => {
    ctx.fillStyle = "#6b4423";
    rr(ctx, 1, 4, w - 2, h - 4, 10);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#b98a52");
    g.addColorStop(1, "#8d6236");
    ctx.fillStyle = g;
    rr(ctx, 1, 1, w - 2, h - 7, 10);
    ctx.fill();
    // Planks, then the brace across them.
    ctx.strokeStyle = "#6b4423";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    for (let k = 1; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(6, 4 + ((h - 12) * k) / 3);
      ctx.lineTo(w - 6, 4 + ((h - 12) * k) / 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#7d5430";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(10, 9);
    ctx.lineTo(w - 10, h - 15);
    ctx.moveTo(w - 10, 9);
    ctx.lineTo(10, h - 15);
    ctx.stroke();
  });

  // A box whose colour has not been revealed yet.
  bake(scene, K.boxHidden, L.box.w, L.box.h, (ctx, w, h) => {
    const faceH = BOX_FACE_H;
    ctx.fillStyle = "#333b4f";
    rr(ctx, 0, 0, w, h, 11);
    ctx.fill();
    const wall = ctx.createLinearGradient(0, faceH - 1, 0, h - OUT);
    wall.addColorStop(0, "#8b96b0");
    wall.addColorStop(1, "#4a5470");
    ctx.fillStyle = wall;
    rr(ctx, OUT, OUT, w - OUT * 2, h - OUT * 2, 10);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, faceH * 0.45);
    g.addColorStop(0, "#a1abc2");
    g.addColorStop(1, "#8b96b0");
    ctx.fillStyle = g;
    rr(ctx, OUT, OUT, w - OUT * 2, faceH - OUT, 10);
    ctx.fill();
    ctx.fillStyle = "#e4ebf8";
    ctx.font = `700 ${Math.round(faceH * 0.72)}px "Lilita One", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", w / 2, HOLE_CY);
  });

  // The x2 bar. Bolted across two cells, and everything standing above it drops double —
  // so it is drawn as hardware, not as a tile.
  const barW = L.cell + CELL_PITCH;
  bake(scene, K.bar, barW, 30, (ctx, w, h) => {
    ctx.fillStyle = "#2f7a2f";
    rr(ctx, 1, 4, w - 2, h - 4, 9);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#8ae06a");
    g.addColorStop(1, "#4bb43f");
    ctx.fillStyle = g;
    rr(ctx, 1, 1, w - 2, h - 7, 9);
    ctx.fill();
    ctx.strokeStyle = "#2f7a2f";
    ctx.lineWidth = 2;
    rr(ctx, 3, 3, w - 6, h - 11, 7);
    ctx.stroke();
  });

  // The chocolate box: a 2x2 slab with a dial. The four trays it hides only join the board once
  // the dial reaches zero.
  //
  // ⚠ Drawn as **chocolate**, not as a chrome plate. The plate version was the same shape in the
  // machine's own two tones, and against a white cavity floor it read as a piece of the cabinet —
  // a panel that happened to have a number on it — rather than as something sitting *on* the
  // board waiting to be broken. Every other obstacle here says what it is by its material (the
  // crate is wood, the hatch is a shutter), and this one has to as well.
  const lidW = L.cell + CELL_PITCH;
  bake(scene, K.lid, lidW, lidW, (ctx, w, h) => {
    // The dark underside, so the slab sits proud of the floor rather than lying flat on it.
    ctx.fillStyle = "#3d2412";
    rr(ctx, 2, 6, w - 4, h - 6, 16);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#8a5a2f");
    g.addColorStop(1, "#5d3618");
    ctx.fillStyle = g;
    rr(ctx, 2, 2, w - 4, h - 10, 16);
    ctx.fill();
    // Moulded squares — four of them, one per tray underneath, which is also the count the box
    // is standing in for.
    const pad = 12;
    const cell = (w - pad * 3) / 2;
    for (let i = 0; i < 4; i++) {
      const x = pad + (i % 2) * (cell + pad);
      const y = pad + ((i / 2) | 0) * (cell + pad) - 4;
      ctx.fillStyle = "rgba(255,225,190,0.16)";
      rr(ctx, x, y, cell, cell, 7);
      ctx.fill();
      ctx.strokeStyle = "rgba(45,25,10,0.45)";
      ctx.lineWidth = 3;
      rr(ctx, x, y, cell, cell, 7);
      ctx.stroke();
    }
  });

  // The ribbons — two bands crossing the slab, the way a box of chocolates is tied.
  //
  // ⚠ **The ribbon is the rule, not decoration.** Its colour is the colour that counts toward
  // opening the box, so it has to be the loudest thing on the piece after the number. A single
  // colour on both bands means only that colour counts; a rainbow band means any tray does.
  // Drawn as a cross rather than as a rim because a rim reads as "a tray of this colour" — the
  // box would look like one more tile in the row — while a ribbon plainly wraps something.
  const RIB = 18;
  const ribbon = (key: string, paint: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void) =>
    bake(scene, key, lidW, lidW, (ctx, w, h) => {
      // Vertical band, then horizontal, then a shadow line under each so they sit on the slab
      // rather than being painted onto it.
      paint(ctx, (w - RIB) / 2, 0, RIB, h);
      paint(ctx, 0, (h - RIB) / 2 - 2, w, RIB);
      ctx.fillStyle = "rgba(30,16,6,0.28)";
      ctx.fillRect((w - RIB) / 2 - 3, 0, 3, h);
      ctx.fillRect(0, (h - RIB) / 2 - 5, w, 3);
    });
  ribbon(K.lidRibbon(null), (ctx, x, y, w, h) => {
    // Every colour along the band's length, so "any colour counts" is legible without a legend.
    const along = w > h;
    const g = ctx.createLinearGradient(x, y, along ? x + w : x, along ? y : y + h);
    PALETTE.forEach((sw, i) => g.addColorStop(i / Math.max(1, PALETTE.length - 1), hex(sw.base)));
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  });
  PALETTE.forEach((sw, c) =>
    ribbon(K.lidRibbon(c), (ctx, x, y, w, h) => {
      ctx.fillStyle = hex(sw.base);
      ctx.fillRect(x, y, w, h);
      // A highlight down the middle of the band, so it reads as satin rather than as a painted
      // stripe. Along the band's own axis, or it would look like a seam across it.
      ctx.fillStyle = hex(sw.light);
      if (w > h) ctx.fillRect(x, y + 3, w, 4);
      else ctx.fillRect(x + 3, y, 4, h);
    }),
  );

  // The counter's backing. Cream and plain: the ribbon already carries the colour, and a second
  // coloured ring around the number would say the same thing twice and crowd a 30px disc.
  const ringR = 30;
  bake(scene, K.lidDial, ringR * 2, ringR * 2, (ctx) => {
    ctx.fillStyle = "rgba(40,22,10,0.35)";
    ctx.beginPath();
    ctx.arc(ringR, ringR + 2, ringR - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7f1e4";
    ctx.beginPath();
    ctx.arc(ringR, ringR, ringR - 2, 0, Math.PI * 2);
    ctx.fill();
  });

  bakeEffects(scene);
  bakeChrome(scene);
}

/** Sparkle, shockwave, sunburst and glow — everything the celebration is built from. */
function bakeEffects(scene: Phaser.Scene) {
  // Four-point twinkle. Drawn as two crossed tapers rather than a star polygon so the arms
  // stay needle-thin when it is scaled up.
  bake(scene, K.spark, 40, 40, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const arm = (rot: number, len: number, wide: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const g = ctx.createLinearGradient(0, -len, 0, len);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "#ffffff");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -len);
      ctx.quadraticCurveTo(wide, 0, 0, len);
      ctx.quadraticCurveTo(-wide, 0, 0, -len);
      ctx.fill();
      ctx.restore();
    };
    arm(0, 19, 3.6);
    arm(Math.PI / 2, 19, 3.6);
    arm(Math.PI / 4, 11, 2.2);
    arm(-Math.PI / 4, 11, 2.2);
  });

  /**
   * The tutorial's pointing hand.
   *
   * ⚠ Baked, not an emoji or a font glyph. `LilitaOne.ttf` here is a Latin-only subset and the
   * canvas fallback for a pictograph is whatever the OS happens to have — a different shape on
   * every device, and nothing at all on some Androids. A drawn hand is the same hand everywhere.
   *
   * ⚠ Outlined in ink, like every other piece: it has to sit legibly on the white cabinet *and*
   * on a saturated tray, and a plain white hand vanishes against the first.
   */
  // The pointing hand every coach mark travels on.
  //
  // ⚠ **Two details carry the whole drawing, and three earlier versions failed for want of them.**
  // A finger rising out of a fist is the rude gesture — reported off a real screen, twice, and
  // correctly, because that is the silhouette. What separates a *pointing* hand from it is:
  //
  //   1. **The thumb protrudes**, as its own rounded lobe clear of the palm with a crease where it
  //      folds across. A bump tucked flat against the side is not enough — that shipped, and still
  //      read wrong.
  //   2. **The three folded fingers are separate humps** with creases between them. Smoothed into
  //      one curve, what is left is a fist with one finger out, whatever else is added.
  //
  // Drawn side by side at 6x, 2x and 1x, a version missing either one reverts. Both are load-bearing.
  //
  // ⚠ The **fingertip sits on the sprite's horizontal centre** (x = 43 of 86), which is why the
  // canvas is wider than the drawing needs and carries dead margin on the left. Every call site
  // places this by an offset from the thing it points at, so an off-centre tip would silently
  // re-aim the level-1 walkthrough and the magnet lesson together — a change to what the player is
  // told to touch, made from inside a drawing routine. Pad the canvas; never move the tip.
  bake(scene, K.hand, 86, 70, (ctx) => {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = UI.ink;
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.moveTo(36, 36);
    ctx.lineTo(36, 12);                       // index finger, left side
    ctx.quadraticCurveTo(36, 4, 43, 4);       // the tip — on the sprite's centre line
    ctx.quadraticCurveTo(50, 4, 50, 12);
    ctx.lineTo(50, 26);                       // index finger, right side
    ctx.quadraticCurveTo(50, 21, 56, 21);     // folded finger 1
    ctx.quadraticCurveTo(62, 21, 62, 28);
    ctx.quadraticCurveTo(62, 24, 68, 24);     // folded finger 2
    ctx.quadraticCurveTo(74, 24, 74, 31);
    ctx.quadraticCurveTo(74, 28, 78, 29);     // folded finger 3
    ctx.quadraticCurveTo(82, 31, 82, 37);
    ctx.lineTo(82, 48);                       // outside of the palm
    ctx.quadraticCurveTo(82, 64, 64, 64);
    ctx.lineTo(48, 64);
    ctx.quadraticCurveTo(37, 64, 34, 54);     // heel
    ctx.lineTo(31, 50);
    ctx.quadraticCurveTo(20, 50, 19, 42);     // the thumb, out clear of the palm
    ctx.quadraticCurveTo(18, 34, 28, 33);
    ctx.quadraticCurveTo(34, 33, 36, 36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // The creases: two between the folded fingers, one where the thumb folds across the palm.
    // Without them the right side is one smooth lump and the left side is a mitten.
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(62, 29);
    ctx.lineTo(62, 40);
    ctx.moveTo(74, 32);
    ctx.lineTo(74, 43);
    ctx.moveTo(33, 38);
    ctx.quadraticCurveTo(39, 45, 40, 54);
    ctx.stroke();
  });

  // Expanding shockwave for a marble seating in its hole.
  bake(scene, K.ring, 64, 64, (ctx, w) => {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(w / 2, w / 2, w / 2 - 5, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Sunburst behind the win panel; it is slowly rotated in the scene.
  bake(scene, K.rays, 520, 520, (ctx, w) => {
    const cx = w / 2;
    const n = 16;
    // All wedges as one path, filled with a radial fade. Flat wedges have a hard outer edge
    // and read as cut paper; light has to fall off, and additive blending only sells it if
    // there is real brightness near the middle to add.
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const spread = Math.PI / n / 1.6;
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(a - spread) * cx, cx + Math.sin(a - spread) * cx);
      ctx.lineTo(cx + Math.cos(a + spread) * cx, cx + Math.sin(a + spread) * cx);
      ctx.closePath();
    }
    const rg = ctx.createRadialGradient(cx, cx, cx * 0.05, cx, cx, cx);
    rg.addColorStop(0, "rgba(255,255,255,1)");
    rg.addColorStop(0.45, "rgba(255,255,255,0.55)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.fill();
  });

  // Soft radial glow, used behind the machine and to punch a star pop.
  bake(scene, K.flash, 160, 160, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.45, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
  });
}

function bakeChrome(scene: Phaser.Scene) {
  const face = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    top: string,
    bot: string,
    edge: string,
    r: number,
  ) => {
    ctx.fillStyle = edge;
    rr(ctx, 1, 4, w - 2, h - 4, r);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top);
    g.addColorStop(1, bot);
    ctx.fillStyle = g;
    rr(ctx, 1, 1, w - 2, h - 7, r);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#ffffff";
    rr(ctx, 6, 5, w - 12, h * 0.3, r * 0.6);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const S = L.boostSize;
  bake(scene, K.btn("green"), S, S, (ctx, w, h) =>
    face(ctx, w, h, "#7fe06a", "#3fb43f", "#2c8330", 17),
  );
  // ⚠ The "not yet" face, and it is **muted green, not grey**. It used to be #a9b5a9 → #7e8a7e,
  // whose top edge reads as off-white — and this is the state the button spends most of a level in,
  // because with a magnet in hand it greys whenever the belt has no plan for one, which is nearly
  // always true at the start of a board. Reported as "the button is green but the background is
  // still white": the white *was* this face. Darker and less saturated than the live face, so it
  // still reads as unavailable, but it is recognisably the same control rather than a pale disc.
  bake(scene, K.btn("greenOff"), S, S, (ctx, w, h) =>
    face(ctx, w, h, "#5f9c62", "#40734a", "#2b4d35", 17),
  );
  // ⚠ The middle stop comes from `UI.pill`, not from a literal beside the other two. The booster's
  // mount is drawn in that same token on a phone, and two hexes that have to stay equal are two
  // hexes that will not.
  bake(scene, K.btn("purple"), 120, 46, (ctx, w, h) =>
    face(ctx, w, h, "#a596f2", hex(UI.pill), "#5b48ab", 20),
  );
  // The booster's face on a phone, where it stands in a row of purple pills rather than out on the
  // violet. It has to read as bright as the level pill beside it, and these three stops are what
  // measures that way — the pill's own ramp lifted **half a step**.
  //
  // ⚠ **The pill's exact stops are not the answer, and that is not obvious.** Brightness is read
  // over the whole control, and a magnet covering half of a 56px square is a lot of dark where the
  // pill's thin lettering is almost none. Measured as the mean over each control, against the pill's
  // 169/255: the pill's own ramp gives 160, a full step up gives 177-182, half a step gives 168-171.
  // ⚠ So do not "tidy" this back to `UI.pill` and the pill's neighbours. It would look like removing
  // a duplicate and it is the one thing that has already been tried and reported from a real phone
  // as the button being too dark.
  // ⚠ **There is no muted twin and nothing dims this face** — see `GameScene.boosterBtn` and the
  // note on the locked alpha in `refreshHud`. Dimming is how "not yet" and "locked" are said out on
  // the violet; in a bright row a dimmed square reads as the one control that failed to draw.
  bake(scene, K.btn("purpleSq"), S, S, (ctx, w, h) =>
    face(ctx, w, h, "#b7a9f8", "#9280e6", "#6d59c2", 17),
  );
  bake(scene, K.btn("gold"), 46, 46, (ctx, w, h) =>
    face(ctx, w, h, "#ffd964", "#f5a91a", "#c67a06", 14),
  );
  bake(scene, K.btn("wide"), 260, 76, (ctx, w, h) =>
    face(ctx, w, h, "#7fe06a", "#3fb43f", "#2c8330", 24),
  );
  bake(scene, K.btn("wideBlue"), 260, 76, (ctx, w, h) =>
    face(ctx, w, h, "#8fb6ff", "#4a7de0", "#2c53a3", 24),
  );

  // Booster icons, drawn as paths so they scale with the buttons and cost no bytes.
  bake(scene, K.icon("magnet"), 44, 44, (ctx) => {
    ctx.lineCap = "butt";
    ctx.lineWidth = 11;
    ctx.strokeStyle = "#e33b3b";
    ctx.beginPath();
    ctx.arc(22, 24, 13, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = "#dfe6f5";
    ctx.beginPath();
    ctx.moveTo(9, 24);
    ctx.lineTo(9, 34);
    ctx.moveTo(35, 24);
    ctx.lineTo(35, 34);
    ctx.stroke();
  });

  bake(scene, K.icon("wrench"), 44, 44, (ctx) => {
    ctx.save();
    ctx.translate(22, 22);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = "#f5a623";
    ctx.fillRect(-4.5, -14, 9, 28);
    ctx.beginPath();
    ctx.arc(0, -14, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 14, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, -14, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 14, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  bake(scene, K.icon("undo"), 44, 44, (ctx) => {
    ctx.strokeStyle = "#dfe6f5";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(22, 24, 12, Math.PI * 0.85, Math.PI * 2.25);
    ctx.stroke();
    ctx.fillStyle = "#dfe6f5";
    ctx.beginPath();
    ctx.moveTo(4, 16);
    ctx.lineTo(20, 14);
    ctx.lineTo(11, 27);
    ctx.closePath();
    ctx.fill();
  });

  bake(scene, K.icon("gear"), 40, 40, (ctx) => {
    ctx.fillStyle = "#f3f6fc";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const b = a + Math.PI / 8;
      ctx.lineTo(20 + Math.cos(a) * 18, 20 + Math.sin(a) * 18);
      ctx.lineTo(20 + Math.cos(b) * 18, 20 + Math.sin(b) * 18);
      const c = b + Math.PI / 16;
      ctx.lineTo(20 + Math.cos(c) * 12, 20 + Math.sin(c) * 12);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(20, 20, 6.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const starPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? r * 0.45 : r;
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.closePath();
  };
  bake(scene, K.star(true), 52, 52, (ctx) => {
    starPath(ctx, 26, 26, 24);
    ctx.fillStyle = "#ffc21e";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#c67a06";
    ctx.stroke();
  });
  bake(scene, K.star(false), 52, 52, (ctx) => {
    starPath(ctx, 26, 26, 24);
    ctx.fillStyle = "#7c88a6";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#5a6480";
    ctx.stroke();
  });

  // The daily-reward calendar. Same construction as everything else here — flat blocks of colour
  // with one darker edge underneath, no gradients past a single highlight, so it sits beside the
  // trays and the boxes rather than looking imported from another game.
  //
  // ⚠ A **tear-off** calendar: rings across the top and a red header. A plain rounded square with
  // a coin on it is a wallet, not a day, and the whole point of the icon is that it means "today".
  bake(scene, K.calendar, 64, 64, (ctx) => {
    ctx.fillStyle = "#c2410c";
    rr(ctx, 6, 12, 52, 48, 10);
    ctx.fill();
    ctx.fillStyle = "#f97316";              // red header band
    rr(ctx, 6, 12, 52, 18, 10);
    ctx.fill();
    ctx.fillStyle = "#fff7ed";              // the page
    rr(ctx, 9, 28, 46, 28, 7);
    ctx.fill();
    // Two rings biting over the header, which is what makes it read as a calendar at 40px.
    ctx.fillStyle = "#cbd5e1";
    for (const x of [22, 42]) {
      rr(ctx, x - 4, 5, 8, 16, 4);
      ctx.fill();
    }
    // A coin on the page — the reward, in the same gold as the wallet counter.
    ctx.fillStyle = "#c67a06";
    ctx.beginPath();
    ctx.arc(32, 43, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffc21e";
    ctx.beginPath();
    ctx.arc(32, 42, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe07a";
    ctx.beginPath();
    ctx.arc(32, 42, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Day seven. ⚠ Drawn open with coins spilling out rather than shut: a closed box is the
  // chocolate obstacle, which the player has been taught means "in your way".
  bake(scene, K.chest, 56, 48, (ctx) => {
    ctx.fillStyle = "#7c3f12";              // the body
    rr(ctx, 4, 20, 48, 26, 6);
    ctx.fill();
    ctx.fillStyle = "#a45a1c";
    rr(ctx, 7, 23, 42, 20, 4);
    ctx.fill();
    ctx.fillStyle = "#7c3f12";              // the lid, thrown back
    rr(ctx, 6, 4, 44, 14, 6);
    ctx.fill();
    ctx.fillStyle = "#a45a1c";
    rr(ctx, 9, 6, 38, 9, 4);
    ctx.fill();
    ctx.fillStyle = "#ffc21e";              // the coins, between lid and body
    for (const [x, y, r] of [[18, 20, 7], [30, 18, 8], [41, 21, 6]]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffe07a";
    for (const [x, y, r] of [[18, 19, 3], [30, 17, 4], [41, 20, 3]]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd964";              // the clasp
    rr(ctx, 24, 26, 8, 10, 2);
    ctx.fill();
  });

  // The padlock on a locked daily-reward day.
  //
  // ⚠ Baked, not an emoji. A pictograph falls back to whatever the OS ships — a different shape on
  // every device and nothing at all on some Androids — and this one carries a rule ("you cannot
  // take this yet"), so it has to look the same everywhere the rule applies.
  bake(scene, K.lock, 34, 40, (ctx) => {
    ctx.strokeStyle = "#8fa6c4";            // the shackle, behind the body
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(17, 17, 9, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = "#54708f";              // the body
    rr(ctx, 3, 16, 28, 22, 5);
    ctx.fill();
    ctx.fillStyle = "#8fa6c4";
    rr(ctx, 5, 18, 24, 18, 4);
    ctx.fill();
    ctx.fillStyle = "#39506c";               // the keyhole
    ctx.beginPath();
    ctx.arc(17, 25, 3.4, 0, Math.PI * 2);
    ctx.fill();
    rr(ctx, 15.4, 25, 3.2, 7, 1.4);
    ctx.fill();
  });

  bake(scene, K.coin, 34, 34, (ctx) => {
    ctx.fillStyle = "#c67a06";
    ctx.beginPath();
    ctx.arc(17, 17, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffc21e";
    ctx.beginPath();
    ctx.arc(17, 16, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe07a";
    ctx.beginPath();
    ctx.arc(17, 16, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}
