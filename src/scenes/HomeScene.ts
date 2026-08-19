import Phaser from "phaser";
import { GAME_H, GAME_W, L, UI } from "../game/config";
import { save } from "../game/save";
import { DAILY_COINS, DAILY_DAYS, DAILY_FROM, DAILY_ON, claimDaily, dailyState } from "../game/daily";
import { sfx } from "../game/audio";
import { K, TS, bakeAll, img } from "../game/textures";
import { dismissBootSplash, setPageBackground } from "../game/bootsplash";
// ⚠ The one graphic in the game that is **not** baked at boot. Everything else in `textures.ts`
// is drawn procedurally on purpose — no `public/art/`, nothing to keep in sync — but this is a 3D
// render and there is no procedure that produces it. Imported rather than dropped in `public/`
// so Vite fingerprints it and it ships in `assets/` with the rest of the bundle. 34 KB.
import homeCover from "../assets/home-cover.webp";

const FONT = '"Lilita One", Arial, sans-serif';

/** The cover render's own flat background, sampled from its corner pixels. */
const COVER_BG = 0x322d58;
/**
 * ⚠ Flat, not a gradient, and that is the whole reason the page background is set per scene: Home
 * paints its own two violets and has no halo, so the board's gradient would run light at the foot
 * of the bars against a Home that stays dark — a step the eye lands on straight away.
 */
const PAGE_BG = "#322d58";
export class HomeScene extends Phaser.Scene {
  /** Redrawn after a claim, so the wallet on the home screen agrees with the card. */
  private coinTxt!: Phaser.GameObjects.Text;
  /** Open the streak card as soon as the screen exists — set by whoever sent the player here. */
  private openDaily = false;
  /** The "something to take" badge and its breath, so a claim can put them out. */
  private dailyDot: Phaser.GameObjects.Arc | null = null;
  private dailyPulse: Phaser.Tweens.Tween | null = null;

  constructor() {
    super("Home");
  }

  init(data: { daily?: boolean }) {
    this.openDaily = !!data?.daily;
  }

  preload() {
    this.load.image("homeCover", homeCover);
  }

  create() {
    bakeAll(this);
    this.cameras.main.setBackgroundColor(UI.bg);
    const root = this.add.container(0, 0).setScale(this.scale.width / GAME_W);

    // A flat ground in the render's own violet. ⚠ Not decoration — it is what the letterbox bars
    // are painted with on a frame wider than 9:19, and what shows for the frame or two before the
    // image decodes. Nothing else draws it, because the cover now fills the screen.
    const bg = this.add.graphics();
    bg.fillStyle(COVER_BG, 1);
    bg.fillRect(0, 0, GAME_W, GAME_H);
    root.add(bg);
    // ⚠ No halo and no rotating rays here any more. They sat behind the cover, where the only
    // thing they could do was brighten everything the cover was *not* covering — and at 5.6x
    // scale the halo reached well past the cover's lower edge, so the band that hides that edge
    // masked a bright glow above it and nothing below. That step, not any colour mismatch, was
    // the horizontal line across the screen. The render carries its own glow; the screen does
    // not need a second one.

    // Drop the HTML boot splash now that there is something real to look at.
    // ⚠ Shared with `GameScene`, not inlined here — see the note in `bootsplash.ts` for what
    // owning it privately cost.
    dismissBootSplash();
    setPageBackground(PAGE_BG);

    // The cover art, which carries the game's name itself — so there is no canvas title over it.
    // Two titles saying the same thing in two typefaces is worse than either alone, and the
    // render's own lettering is the one the store page shows.
    // ⚠ **Cover fit, not contain** — the render fills the whole screen and there is no painted
    // background under it at all. The 2:3 render is 810 tall at full width, so anything short of
    // this leaves a strip of flat violet below it, and then the join between two purples has to
    // be hidden however long the fade is. Scaled to the full 1160 it is 773 wide instead, which
    // bleeds 116px off each side — the lettering sits between 19% and 61% of the width, so it
    // clears that comfortably. The buttons then float over the art rather than sitting under it.
    const scale = Math.max(GAME_W / 1080, GAME_H / 1620);
    const cover = this.add.image(GAME_W / 2, GAME_H / 2, "homeCover");
    cover.setDisplaySize(1080 * scale, 1620 * scale);
    root.add(cover);

    // ⚠ A scrim, not a panel. With the render running edge to edge the PLAY button lands on the
    // funnel and the stars sit on its stem — legible, but the two fight each other. This darkens
    // the lower third *through* the art rather than covering it, so the funnel still reads and
    // the UI has a ground under it. Fully transparent where it starts, so there is no line.
    const scrim = this.add.graphics();
    scrim.fillGradientStyle(COVER_BG, COVER_BG, COVER_BG, COVER_BG, 0, 0, 0.82, 0.82);
    scrim.fillRect(0, GAME_H * 0.6, GAME_W, GAME_H * 0.4);
    root.add(scrim);
    // A slow breath, the same idle the old title had. A completely still home screen reads as a
    // screenshot rather than as a game waiting for you.
    this.tweens.add({
      targets: cover,
      scaleX: cover.scaleX * 1.03,
      scaleY: cover.scaleY * 1.03,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // One button, always. ⚠ With START OVER gone there is no route back to level 1 from here —
    // `?reset=1` is the only one left, and inside the host's iframe the player cannot edit the
    // URL. That is the trade: a single uncluttered call to action against no way to replay from
    // the start.
    const level = save.unlocked;
    root.add(
      this.button(GAME_W / 2, 952, level > 1 ? `LEVEL ${level}` : "PLAY", "wide", () =>
        this.scene.start("Game", { level }),
        1.35,
      ),
    );

    const stars = img(this, K.star(true), GAME_W / 2 - 90, 1062).setScale(0.8 / TS);
    const starTxt = this.add
      .text(GAME_W / 2 - 56, 1060, String(save.totalStars), {
        fontFamily: FONT,
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5)
      .setStroke(UI.ink, 6);
    const coin = img(this, K.coin, GAME_W / 2 + 40, 1062).setScale(1 / TS);
    const coinTxt = this.add
      .text(GAME_W / 2 + 66, 1060, String(save.coins), {
        fontFamily: FONT,
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5)
      .setStroke(UI.ink, 6);
    root.add([stars, starTxt, coin, coinTxt]);
    // Held so a claim can update it in place — rebuilding the scene to change one number would
    // restart the cover's breath and re-run the boot splash dismissal.
    this.coinTxt = coinTxt;

    const mute = img(this, K.btn("gold"), GAME_W - 70, 70);
    const muteTxt = this.add
      .text(GAME_W - 70, 68, save.muted ? "🔇" : "🔊", { fontSize: "24px" })
      .setOrigin(0.5);
    const muteZone = this.add
      .rectangle(GAME_W - 70, 70, 60, 60, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });
    muteZone.on("pointerdown", () => {
      save.muted = !save.muted;
      muteTxt.setText(save.muted ? "🔇" : "🔊");
    });
    root.add([mute, muteTxt, muteZone]);

    // ⚠ Top **left**, mirroring the mute button rather than joining it. The two are different
    // kinds of thing — one is a setting, the other is a reward waiting to be taken — and a badge
    // that pulses next to a speaker icon reads as "the sound is broken".
    if (DAILY_ON && save.unlocked > DAILY_FROM) this.buildDailyButton(root);

    root.add(
      this.add
        .text(GAME_W / 2, GAME_H - 40, `v${__APP_VERSION__} · ${__APP_BUILD__}`, {
          fontFamily: FONT,
          fontSize: "16px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setAlpha(0.55),
    );
  }

  /**
   * The daily-reward button, and the red dot that says there is something in it.
   *
   * ⚠ The dot is driven by `claimable`, not by whether the feature exists. A badge that is always
   * on is furniture within a day and the player stops seeing it — which is the one thing a daily
   * reward cannot afford, since it only works if they come back tomorrow and notice.
   */
  private buildDailyButton(root: Phaser.GameObjects.Container) {
    const x = 70;
    const y = 70;
    const st = dailyState();

    const frame = img(this, K.btn("gold"), x, y);
    const cal = img(this, K.calendar, x, y).setScale(0.86 / TS);
    root.add([frame, cal]);

    if (st.claimable) {
      const dot = this.add.circle(x + 22, y - 20, 11, 0xe33b3b).setStrokeStyle(3, 0xffffff);
      root.add(dot);
      this.dailyDot = dot;
      // A slow breath on the whole button, not a flash on the dot. The home screen already has the
      // cover art breathing; a second, faster rhythm on top of it reads as an error indicator.
      this.dailyPulse = this.tweens.add({
        targets: [frame, cal, dot],
        scale: "*=1.08",
        duration: 780,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    const zone = this.add.rectangle(x, y, 76, 76, 0xffffff, 0).setInteractive({ useHandCursor: true });
    zone.on("pointerdown", () => {
      sfx.pick();
      this.showDaily();
    });
    root.add(zone);

    // Sent here by clearing the level that unlocks it — open the card without making them hunt
    // for a button they have never seen before.
    if (this.openDaily) this.time.delayedCall(420, () => this.showDaily());
  }

  /**
   * The seven-day card.
   *
   * ⚠ Every day is on screen, including the ones already banked and the ones still to come. A card
   * that showed only today would be a coin popup; what makes a streak work is seeing the 200 on day
   * seven while standing on day two.
   */
  private showDaily() {
    // ⚠ Guarded here as well as at the button. `init` can still be handed `{daily: true}` by a
    // stale scene transition or a hand-typed restart, and a card with no way to reach it is worse
    // than one that is simply absent.
    if (!DAILY_ON) return;
    if (this.children.getByName("dailyCard")) return;
    const c = this.add.container(0, 0).setName("dailyCard").setDepth(100);
    c.setScale(this.scale.width / GAME_W);
    const st = dailyState();
    const midY = GAME_H / 2;

    const dim = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x0d0a2a, 0.78);
    dim.setInteractive();     // swallows taps on the art behind, which would otherwise start a level
    c.add(dim);

    const W = 440;
    const HH = 566;
    const X = (GAME_W - W) / 2;
    const Y = midY - HH / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x1d1a45, 0.55).fillRoundedRect(X - 8, Y + 6, W + 16, HH, 36);
    panel.fillStyle(UI.machineEdge, 1).fillRoundedRect(X - 6, Y - 6, W + 12, HH, 34);
    panel.fillStyle(UI.machine, 1).fillRoundedRect(X, Y, W, HH, 30);
    panel.fillStyle(0x4bc84b, 1).fillRoundedRect(X, Y, W, 76, 30);
    panel.fillStyle(0x4bc84b, 1).fillRect(X, Y + 46, W, 30);
    c.add(panel);

    c.add(
      this.add
        .text(GAME_W / 2, Y + 36, "DAILY REWARDS", { fontFamily: FONT, fontSize: "34px", color: "#ffffff" })
        .setOrigin(0.5)
        .setStroke(UI.ink, 7),
    );
    c.add(
      this.add
        .text(GAME_W / 2, Y + 108, `LOGIN STREAK — DAY ${st.day}`, {
          fontFamily: FONT,
          fontSize: "23px",
          color: "#3b465f",
        })
        .setOrigin(0.5),
    );

    // Four across, then three — the last row centred rather than left-hung, so day 7 sits under
    // the middle of the card where the eye finishes.
    const CW = 96;
    const CH = 150;
    const gap = 12;
    const cellY = [Y + 212, Y + 212 + CH + gap];
    for (let d = 1; d <= DAILY_DAYS; d++) {
      const row = d <= 4 ? 0 : 1;
      const n = row === 0 ? 4 : DAILY_DAYS - 4;
      const i = row === 0 ? d - 1 : d - 5;
      const cx = GAME_W / 2 + (i - (n - 1) / 2) * (CW + gap);
      this.dailyCell(c, cx, cellY[row], CW, CH, d, st);
    }

    c.add(
      this.button(GAME_W / 2, Y + HH - 54, "CLOSE", "wideBlue", () => c.destroy(), 0.86),
    );
  }

  /** One day of the streak: banked, live, or still ahead. */
  private dailyCell(
    into: Phaser.GameObjects.Container,
    cx: number,
    cy: number,
    w: number,
    h: number,
    day: number,
    st: { day: number; claimable: boolean; done: number },
  ) {
    const banked = day <= st.done;
    const live = day === st.day && st.claimable;
    const g = this.add.graphics();
    g.fillStyle(live ? 0xcfe4ff : 0xb9c4da, 1).fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 16);
    g.fillStyle(live ? 0xe8f2ff : 0xcbd4e6, 1).fillRoundedRect(cx - w / 2 + 4, cy - h / 2 + 4, w - 8, h - 8, 13);
    into.add(g);

    into.add(
      this.add
        .text(cx, cy - h / 2 + 18, `Day ${day}`, { fontFamily: FONT, fontSize: "18px", color: "#3b465f" })
        .setOrigin(0.5),
    );

    // Day seven gets the chest; the rest get a coin that grows a little with the reward, so the
    // week reads as building even before the numbers are compared.
    const icon =
      day === DAILY_DAYS
        ? img(this, K.chest, cx, cy - 12).setScale(0.86 / TS)
        : img(this, K.coin, cx, cy - 14).setScale((1.0 + day * 0.12) / TS);
    into.add(icon);

    into.add(
      this.add
        .text(cx, cy + 20, `+${DAILY_COINS[day - 1]}`, {
          fontFamily: FONT,
          fontSize: "22px",
          color: "#8a5a06",
        })
        .setOrigin(0.5),
    );

    if (banked) {
      into.add(
        this.add
          .text(cx, cy + h / 2 - 24, "✓", { fontFamily: FONT, fontSize: "30px", color: "#2e9b57" })
          .setOrigin(0.5),
      );
    } else if (live) {
      // ⚠ Drawn at this size, not the wide button shrunk to fit. `button()` bakes a 260px face with
      // a 25px label; scaled into an 96px cell the word came out eight pixels tall and unreadable,
      // while the tap target shrank with it. A small button is its own shape, not a big one far away.
      const bw = w - 18;
      const bh = 34;
      const by = cy + h / 2 - 26;
      const btn = this.add.graphics();
      btn.fillStyle(0x2f8f2f, 1).fillRoundedRect(cx - bw / 2, by - bh / 2 + 3, bw, bh, 10);
      btn.fillStyle(0x4bc84b, 1).fillRoundedRect(cx - bw / 2, by - bh / 2, bw, bh - 3, 10);
      into.add(btn);
      into.add(
        this.add
          .text(cx, by - 2, "CLAIM", { fontFamily: FONT, fontSize: "18px", color: "#ffffff" })
          .setOrigin(0.5)
          .setStroke(UI.ink, 4),
      );
      const hit = this.add
        .rectangle(cx, by, bw + 8, bh + 12, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });
      hit.on("pointerdown", () => this.doClaim(into));
      into.add(hit);
    }
    // Days still ahead get nothing under them — a greyed button on four cells is four things the
    // player has to work out are not for them.
  }

  /** Take today's coins, then rebuild the card so every state on it is the new one. */
  private doClaim(card: Phaser.GameObjects.Container) {
    const paid = claimDaily();
    if (!paid) return;
    sfx.win();
    this.coinTxt.setText(String(save.coins));

    // ⚠ Put the badge out here, not on the next visit to this screen. The card closes back onto the
    // home screen, and a red dot still sitting on the icon says there is something to take when
    // there is not — the player taps it again and is shown a card with nothing on it for them.
    this.dailyPulse?.remove();
    this.dailyPulse = null;
    this.dailyDot?.destroy();
    this.dailyDot = null;

    // Coins flying to the wallet. The number changing on its own is a fact; watching it arrive is
    // the reward — same reasoning as the feature bar on the results card.
    for (let i = 0; i < 8; i++) {
      const s = img(this, K.coin, GAME_W / 2, GAME_H / 2 - 40).setScale(1.2 / TS).setDepth(200);
      this.tweens.add({
        targets: s,
        x: GAME_W / 2 + 40,
        y: 1062,
        scale: 0.5 / TS,
        duration: 520,
        delay: i * 55,
        ease: "Quad.easeIn",
        onComplete: () => s.destroy(),
      });
    }

    card.destroy();
    this.time.delayedCall(700, () => this.showDaily());
  }

  /**
   * `scale` grows the whole container — face, label, stroke and hit zone together. Enlarging the
   * sprite alone would leave the tap target at its old size, which is the sort of thing that only
   * shows up as "the button sometimes does not work" on a phone.
   */
  private button(x: number, y: number, label: string, face: string, onTap: () => void, scale = 1) {
    const c = this.add.container(x, y).setScale(scale);
    const bg = img(this, K.btn(face), 0, 0);
    const t = this.add
      .text(0, -3, label, { fontFamily: FONT, fontSize: "25px", color: "#ffffff" })
      .setOrigin(0.5)
      .setStroke(UI.ink, 6);
    const zone = this.add
      .rectangle(0, 0, 260, L.boostSize, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerdown", () => {
      sfx.pick();
      onTap();
    });
    c.add([bg, t, zone]);
    return c;
  }
}
