import Phaser from "phaser";
import { platform } from "./platform";
import { GameScene, GAME_W, GAME_H } from "./scenes/GameScene";
import { HomeScene } from "./scenes/HomeScene";

// Warm the game font before Phaser draws any canvas text — a canvas texture baked
// with a font that has not finished loading keeps the fallback shape forever.
try {
  document.fonts?.load('32px "Lilita One"');
} catch {
  /* no Font Loading API — the font still swaps in when ready */
}

// Wipe saved progress from a phone, where there is no DevTools console: ?reset=1
(() => {
  try {
    const p = new URLSearchParams(location.search);
    if (!p.get("reset")) return;
    // ⚠ Both stores. Clearing only the local one on a host that syncs saves means the cloud
    // copy restores everything on the next load, and the reset silently did nothing.
    Object.keys(localStorage)
      .filter((k) => k.startsWith("bf_"))
      .forEach((k) => {
        localStorage.removeItem(k);
        platform.storage.removeItem(k);
      });
    p.delete("reset");
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  } catch {
    /* storage unavailable */
  }
})();

// ⚠ **No dev wallet float.** A dev build used to top the wallet up to 1000 at boot, and that made
// the economy unreadable from the machine it is being tuned on: 1000 coins is twenty revives, while
// a real new player starts on **nothing** and earns `WIN_COINS` = 10 a level. To exercise a booster
// now, grant the coins deliberately in the console —
// `localStorage.setItem('bf_coins','200'); location.reload()` — so the grant is visible instead of
// standing silently behind every dev session.
//
// ⚠ **Nothing reads progress before `platform.init()` resolves.** The host preloads the player's
// cloud save *during* init, so an early read hands back the local copy — and the next write then
// pushes that stale copy over their real save. Awaiting here, before the Phaser game exists at
// all, means there is no loading-screen cap to race: the HTML boot poster stays up until this
// resolves, and `crazy.ts` owns a 2.5s timeout so an adblocked SDK cannot hang it.
//
// ⚠ Wrapped in an async function rather than a top-level `await`: the build targets browsers back
// to Chrome 87, where top-level await does not exist, and raising the target to reach it would
// drop older phones for one keyword.
async function boot() {
  await platform.init();
  platform.loadingStart();

  // Render at the device pixel ratio so the baked textures stay crisp, capped at 2 —
  // a 3x canvas is 2.25x the fragments per frame for no visible gain on a 2D game.
  const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: Math.round(GAME_W * DPR),
    height: Math.round(GAME_H * DPR),
    backgroundColor: "#b3ddf5",
    render: { powerPreference: "low-power" },
    // Marbles tumble down the chute on real physics — that fall is the whole tactile pay-off
    // of a tap, and hand-animating it would never pile up the same way twice. Full gravity:
    // the drop out of the tray is meant to be quick. Only the last stretch is slowed, and
    // GameScene does that per-body once a marble enters the cone.
    physics: {
      default: "matter",
      matter: { gravity: { x: 0, y: 1.05 }, enableSleeping: false, debug: false },
    },
    // Hard-cap at 60: on a 120Hz phone Phaser would otherwise render twice as often
    // as the game is designed for, doubling heat for nothing. The host requires the game to
    // behave the same on a 120Hz phone as on a 60Hz one, and this is how that is met.
    fps: { target: 60, limit: 60 },
    // FIT scales the fixed-size canvas to whatever the host frame is while keeping the ratio,
    // which is the whole of the 800x450 -> 1920x1080 requirement: both are 16:9.
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [HomeScene, GameScene],
  });

  // Straight into a board, skipping the home screen. ?custom=1 plays the editor's scratch slot;
  // ?level=N plays that level exactly as a player would get it, hand-built board and all. The
  // editor opens these in a new tab, so going back to the drawing is just switching tabs.
  try {
    const q = new URLSearchParams(location.search);
    const custom = !!q.get("custom");
    const preview = !!q.get("preview");
    const level = Number(q.get("level")) || 0;
    if (custom || level) {
      game.events.once("ready", () => {
        game.scene.stop("Home");
        game.scene.start("Game", { level: level || 1, custom, preview });
      });
    }
  } catch {
    /* no URL API — fall through to the normal boot */
  }

  game.events.once("ready", () => platform.loadingStop());

  // Dev-only handle so a headless browser / the console can poke at scene state.
  // ⚠ `scripts/shot.mjs` waits on this to know the game has booted — removing it breaks every
  // screenshot and every `--belt` assertion.
  if (import.meta.env.DEV) (window as any).__game = game;
}

void boot();
