// The daily-reward card, drawn on whichever screen asks for it.
//
// ⚠ **One card, two scenes.** This began as four private methods on `HomeScene`, because the home
// screen was the only place the streak could be collected — a win on `DAILY_FROM` routed the player
// back there rather than offering NEXT LEVEL. It no longer does: the card opens over the results
// card, on the board. A second copy in `GameScene` would be a second idea of what the streak looks
// like and, worse, a second place the prize table is read — the note on `dailyCell` already says a
// card promising 150 over a `claimDaily` paying 100 is the worst bug this feature can have.
//
// What each scene still owns is *where* it is drawn: the centre, the dimmer, the container it is
// parented to, and where a claimed coin flies. Those are `DailyHost`; nothing else here knows which
// screen it is on.

import Phaser from "phaser";
import { UI } from "../game/config";
import { save } from "../game/save";
import {
  DAILY_DAYS,
  DAILY_ON,
  claimDaily,
  dailyPrize,
  dailyState,
  type DailyPrize,
  type DailyState,
} from "../game/daily";
import { sendDaily } from "../game/telemetry";
import { sfx } from "../game/audio";
import { K, TS, img } from "../game/textures";

const FONT = '"Lilita One", Arial, sans-serif';

/** Everything about the card that is a property of the screen it is standing on. */
export interface DailyHost {
  /** Middle of the screen, in whatever units the caller draws cards in. */
  cx: number;
  cy: number;
  /**
   * The full-screen dimmer that goes behind it.
   *
   * ⚠ A factory, not a width: the board's dimmer must be `STAGE_W` wide and centred on `CX`, and
   * the home screen's is its own design box. Passing a number would put one of the two wrong.
   */
  dim(): Phaser.GameObjects.Rectangle;
  /** Where the card is parented. The scene root if absent. */
  into?: Phaser.GameObjects.Container;
  /** Container scale, for a scene whose cards are drawn straight onto an unscaled root. */
  scale?: number;
  /** Where a claimed coin flies — the coin readout itself, not the row it sits on. */
  wallet: { x: number; y: number };
  /** The claim landed: update a coin readout, retire a badge. */
  onClaimed?(prize: DailyPrize): void;
  /** The card is gone. `claimed` says whether it paid out on the way out. */
  onClosed?(claimed: boolean): void;
}

/**
 * The three-day card.
 *
 * ⚠ Every day is on screen, including the ones already banked and the ones still to come. A card
 * that showed only today would be a coin popup; what makes a streak work is seeing day 3's 250
 * while standing on day 1.
 *
 * ⚠ The three states are told apart by **presence, not brightness** — a live day has a red tab and
 * a cream face, a locked day has a padlock, a banked day has a tick. Shading alone has to be
 * compared against a neighbour to be read, and day 3 has no brighter neighbour to compare with.
 * Same reasoning as the raised/flat eggs on a tray.
 */
export function showDailyCard(
  scene: Phaser.Scene,
  host: DailyHost,
): Phaser.GameObjects.Container | null {
  // ⚠ Guarded here as well as at every call site. A stale scene transition or a hand-typed restart
  // can still ask for it, and a card with no way to reach it is worse than one that is absent.
  if (!DAILY_ON) return null;
  const found = host.into ? host.into.getByName("dailyCard") : scene.children.getByName("dailyCard");
  if (found) return null;

  const c = scene.add.container(0, 0).setName("dailyCard").setDepth(100);
  // ⚠ Parented **after** it is built into the scene root, so a host that keeps its cards in a layer
  // gets it there rather than floating on the root at the layer's expense. `GameScene` draws every
  // other card into `uiLayer`; a daily card outside it would sit under the HUD.
  if (host.into) host.into.add(c);
  if (host.scale !== undefined) c.setScale(host.scale);
  const st = dailyState();

  // Swallows taps on whatever is behind it — the art on Home, the results card on the board.
  c.add(host.dim().setInteractive());

  const W = 478;
  const HH = 520;
  const X = host.cx - W / 2;
  const Y = host.cy - HH / 2;
  const panel = scene.add.graphics();
  panel.fillStyle(0x0a1730, 0.55).fillRoundedRect(X - 8, Y + 8, W + 16, HH, 36);
  panel.fillStyle(0x0e2145, 1).fillRoundedRect(X - 6, Y - 6, W + 12, HH, 34);
  panel.fillStyle(0x16305a, 1).fillRoundedRect(X, Y, W, HH, 30);
  c.add(panel);

  c.add(
    scene.add
      .text(host.cx, Y + 52, "DAILY BONUS", { fontFamily: FONT, fontSize: "40px", color: "#ffd453" })
      .setOrigin(0.5)
      .setStroke("#7a3d06", 9),
  );
  // ⚠ Two lines, not one. "Claim your gift!" over a card whose button says COME BACK TOMORROW is
  // the card arguing with itself, and the state where there is nothing to take is exactly the one
  // a player is most likely to misread as broken.
  c.add(
    scene.add
      .text(
        host.cx,
        Y + 100,
        st.claimable ? "Thanks for playing! Claim your gift!" : "See you tomorrow!",
        { fontFamily: FONT, fontSize: "19px", color: "#a9c2e6" },
      )
      .setOrigin(0.5),
  );

  // ⚠ `DAILY_DAYS` drives the loop, never a literal 3. The table in `daily.ts` is the one
  // definition of how long a cycle is; a second one here is a silently wrong card the day it moves.
  const CW = 140;
  const CH = 258;
  const gap = 14;
  /** Where the tick goes on the day about to be claimed. Null when there is nothing to claim. */
  let liveTick: { x: number; y: number } | null = null;
  for (let d = 1; d <= DAILY_DAYS; d++) {
    const cx = host.cx + (d - 1 - (DAILY_DAYS - 1) / 2) * (CW + gap);
    const cy = Y + 150 + CH / 2;
    dailyCell(scene, c, cx, cy, CW, CH, d, st);
    if (d === st.day && st.claimable) liveTick = { x: cx, y: cy + CH / 2 - 30 };
  }

  const close = (claimed: boolean) => {
    c.destroy();
    host.onClosed?.(claimed);
  };

  // ⚠ **One Claim button for the card, not one per column.** Only ever one day is takeable, so a
  // button on every cell is two that do nothing beside one that does, and the player has to read
  // three columns to find out which. The single button also has somewhere to say why it is off,
  // which a missing button does not.
  const bY = Y + HH - 62;
  if (st.claimable) {
    c.add(
      wideBtn(scene, host.cx, bY, "CLAIM", 0x4bc84b, 0x2f8f2f, () =>
        doClaim(scene, host, c, liveTick, close),
      ),
    );
  } else {
    c.add(wideBtn(scene, host.cx, bY, "COME BACK TOMORROW", 0x3f5578, 0x2b3c56, () => close(false), 20));
  }

  // The close cross — the way out that takes nothing.
  const kx = X + W - 30;
  const ky = Y + 22;
  const cross = scene.add.graphics();
  cross.fillStyle(0x8f2f2f, 1).fillCircle(kx, ky + 3, 23);
  cross.fillStyle(0xe04b4b, 1).fillCircle(kx, ky, 23);
  c.add(cross);
  c.add(
    scene.add
      .text(kx, ky - 2, "X", { fontFamily: FONT, fontSize: "24px", color: "#ffffff" })
      .setOrigin(0.5)
      .setStroke(UI.ink, 4),
  );
  const closeHit = scene.add.rectangle(kx, ky, 62, 62, 0xffffff, 0).setInteractive({ useHandCursor: true });
  closeHit.on("pointerdown", () => {
    sfx.pick();
    close(false);
  });
  c.add(closeHit);
  return c;
}

/**
 * One day of the streak: banked, live, or still locked.
 *
 * ⚠ The reward is read from `dailyPrize`, never from the tables directly. The card and the payout
 * have to agree, and the only way to guarantee that is for both to ask the same function — a card
 * promising 150 over a `claimDaily` paying 100 is the worst bug this feature can have.
 */
function dailyCell(
  scene: Phaser.Scene,
  into: Phaser.GameObjects.Container,
  cx: number,
  cy: number,
  w: number,
  h: number,
  day: number,
  st: DailyState,
) {
  const banked = day <= st.done;
  const live = day === st.day && st.claimable;
  const top = cy - h / 2;

  // Body. Live is cream inside a gold rim; locked is the reference's blue; banked is sunk back
  // into the panel so it reads as spent rather than as one more offer.
  const rim = live ? 0xf5c344 : banked ? 0x22385a : 0x2f74b4;
  const face = live ? 0xfdf4dc : banked ? 0x1b3050 : 0x3d8fd6;
  const g = scene.add.graphics();
  g.fillStyle(rim, 1).fillRoundedRect(cx - w / 2, top, w, h, 18);
  g.fillStyle(face, 1).fillRoundedRect(cx - w / 2 + 5, top + 5, w - 10, h - 10, 14);
  into.add(g);

  // The day tab. Red on the live day — the only hue on the card that is not blue or gold, so the
  // eye lands on it before it has read a word.
  const tabW = w - 26;
  const tabH = 40;
  const tab = scene.add.graphics();
  tab
    .fillStyle(live ? 0xd93b32 : banked ? 0x2b4468 : 0x2f74b4, 1)
    .fillRoundedRect(cx - tabW / 2, top + 12, tabW, tabH, 12);
  into.add(tab);
  into.add(
    scene.add
      .text(cx, top + 32, "Day " + day, {
        fontFamily: FONT,
        fontSize: "22px",
        color: live ? "#ffffff" : banked ? "#7f93b3" : "#dceaf9",
      })
      .setOrigin(0.5),
  );

  const prize = dailyPrize(day);
  const ink = live ? "#7a5a12" : banked ? "#6d81a1" : "#ffffff";
  const edge = live ? 0 : 4;

  // ⚠ The prize block is centred on what this day actually pays, not pinned to the top. Day 1 has
  // no magnet row, and pinned it left a third of the column empty below the coin — which reads as
  // a reward that failed to draw rather than as one item. `drop` re-centres the shorter block.
  const drop = prize.magnets ? 0 : 30;

  // Coins, every day. Sized a little by the day so the cycle reads as building before the numbers
  // have been compared at all.
  into.add(img(scene, K.coin, cx, top + 106 + drop).setScale((1.35 + day * 0.12) / TS));
  into.add(
    scene.add
      .text(cx, top + 148 + drop, String(prize.coins), { fontFamily: FONT, fontSize: "27px", color: ink })
      .setOrigin(0.5)
      .setStroke(UI.ink, edge),
  );

  // Magnets, only on the days that pay them. ⚠ Nothing at all on day 1, rather than a greyed
  // slot: an empty slot is one more thing the player has to work out is not a reward.
  if (prize.magnets) {
    into.add(img(scene, K.icon("magnet"), cx - 16, top + 198).setScale(1.05 / TS));
    into.add(
      scene.add
        .text(cx + 22, top + 198, "x" + prize.magnets, { fontFamily: FONT, fontSize: "23px", color: ink })
        .setOrigin(0.5)
        .setStroke(UI.ink, edge),
    );
  }

  if (banked) {
    // Sunk **and** ticked. The sinking alone is only legible beside a brighter column, and on the
    // last day of a finished cycle there is not one.
    into.add(
      scene.add
        .text(cx, cy + h / 2 - 30, "✓", { fontFamily: FONT, fontSize: "38px", color: "#4bc86e" })
        .setOrigin(0.5),
    );
  } else if (!live) {
    // The padlock, hung off the bottom-right corner as in the reference — over the rim rather
    // than inside the face, so it reads as fastening the card shut.
    const lx = cx + w / 2 - 16;
    const ly = cy + h / 2 - 14;
    const halo = scene.add.graphics();
    halo.fillStyle(0x0e2145, 1).fillCircle(lx, ly, 25);
    halo.fillStyle(0xdfe8f5, 1).fillCircle(lx, ly, 21);
    into.add(halo);
    into.add(img(scene, K.lock, lx, ly).setScale(0.92 / TS));
  }
}

/**
 * A card-sized button.
 *
 * ⚠ Drawn at this size rather than either scene's own `button()`: those bake a 260px face with a
 * 25px label, and squeezing that into a card left the word eight pixels tall while the tap target
 * shrank with it. A small button is its own shape, not a big one seen from far away.
 */
function wideBtn(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  top: number,
  shadow: number,
  onTap: () => void,
  size = 26,
) {
  const c = scene.add.container(x, y);
  const bw = 300;
  const bh = 62;
  const g = scene.add.graphics();
  g.fillStyle(shadow, 1).fillRoundedRect(-bw / 2, -bh / 2 + 5, bw, bh, 16);
  g.fillStyle(top, 1).fillRoundedRect(-bw / 2, -bh / 2, bw, bh - 5, 16);
  const t = scene.add
    .text(0, -2, label, { fontFamily: FONT, fontSize: size + "px", color: "#ffffff" })
    .setOrigin(0.5)
    .setStroke(UI.ink, 5);
  const hit = scene.add.rectangle(0, 0, bw + 10, bh + 14, 0xffffff, 0).setInteractive({ useHandCursor: true });
  hit.on("pointerdown", () => {
    sfx.pick();
    onTap();
  });
  c.add([g, t, hit]);
  return c;
}

/**
 * How long the card stays up after a claim.
 *
 * ⚠ Long enough for the coins to land: the last of the eight leaves at 7 x 55ms and flies for
 * 520ms. Cut it shorter and the card — and the sprites parented to it — vanish mid-flight, which
 * reads as the reward not having been paid.
 */
const CLAIM_MS = 1000;

/** Take today's reward, show it being paid, and get out of the way. */
function doClaim(
  scene: Phaser.Scene,
  host: DailyHost,
  card: Phaser.GameObjects.Container,
  liveTick: { x: number; y: number } | null,
  close: (claimed: boolean) => void,
) {
  // ⚠ Read the day **before** claiming. `claimDaily` advances the streak, so asking afterwards
  // reports the day the player will take tomorrow rather than the one they were just paid for.
  const day = dailyState().day;
  const prize = claimDaily();
  // ⚠ Logged after the null check, never before it. `claimDaily` returns null when there is
  // nothing to take — a row written there would record a reward the player never received, and
  // this whole log exists to answer how many of them are actually collected.
  if (!prize) return;
  sendDaily({ lvl: save.unlocked, day, coins: prize.coins, magnets: prize.magnets });
  sfx.win();
  host.onClaimed?.(prize);

  // Coins flying to the wallet. The number changing on its own is a fact; watching it arrive is
  // the reward — same reasoning as the feature bar on the results card.
  for (let i = 0; i < 8; i++) {
    const s = img(scene, K.coin, host.cx, host.cy - 40).setScale(1.2 / TS).setDepth(200);
    card.add(s);
    scene.tweens.add({
      targets: s,
      x: host.wallet.x,
      y: host.wallet.y,
      scale: 0.5 / TS,
      duration: 520,
      delay: i * 55,
      ease: "Quad.easeIn",
      onComplete: () => s.destroy(),
    });
  }

  /**
   * ⚠ **The tick is stamped on the claimed day in place; the card is not rebuilt.** It used to
   * destroy itself and re-open 700ms later in its spent state — the same three columns the player
   * had just read, under the words *See you tomorrow!* — which put a second card, with nothing on
   * it for them, between the reward and the game. The confirmation that rebuild existed for is
   * this one mark, so it is drawn where it would have appeared and the card then leaves.
   *
   * ⚠ **Magnets are still paid silently.** They are credited by `claimDaily` above; what is
   * deliberately absent is any animation. There is no magnet counter for a sprite to land on, so a
   * magnet flying anywhere would be flying at nothing, and a caption in mid-air is a second,
   * competing announcement over the coins already in flight. The card the player just read is
   * where the magnet was promised, and this tick is where it is confirmed.
   */
  if (liveTick) {
    const tick = scene.add
      .text(liveTick.x, liveTick.y, "✓", { fontFamily: FONT, fontSize: "38px", color: "#2f9f52" })
      .setOrigin(0.5)
      .setScale(0.4);
    card.add(tick);
    scene.tweens.add({ targets: tick, scale: 1, duration: 260, ease: "Back.easeOut" });
  }

  scene.time.delayedCall(CLAIM_MS, () => close(true));
}
