import Phaser from "phaser";
import { GAME_H, GAME_W, L, UI } from "../game/config";
import { save } from "../game/save";
import { sfx } from "../game/audio";
import { K, TS, bakeAll, img } from "../game/textures";
import { dismissBootSplash } from "../game/bootsplash";
// ⚠ The one graphic in the game that is **not** baked at boot. Everything else in `textures.ts`
// is drawn procedurally on purpose — no `public/art/`, nothing to keep in sync — but this is a 3D
// render and there is no procedure that produces it. Imported rather than dropped in `public/`
// so Vite fingerprints it and it ships in `assets/` with the rest of the bundle. 34 KB.
import homeCover from "../assets/home-cover.webp";

const FONT = '"Lilita One", Arial, sans-serif';

/** The cover render's own flat background, sampled from its corner pixels. */
const COVER_BG = 0x322d58;
export class HomeScene extends Phaser.Scene {
  constructor() {
    super("Home");
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
