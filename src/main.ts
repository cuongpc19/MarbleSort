import Phaser from "phaser";
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
    Object.keys(localStorage)
      .filter((k) => k.startsWith("ms_"))
      .forEach((k) => localStorage.removeItem(k));
    p.delete("reset");
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  } catch {
    /* storage unavailable */
  }
})();

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
  // Hard-cap at 60: on a 120Hz phone Phaser would otherwise render twice as often
  // as the game is designed for, doubling heat for nothing.
  fps: { target: 60, limit: 60 },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [HomeScene, GameScene],
});

// Dev-only handle so a headless browser / the console can poke at scene state.
if (import.meta.env.DEV) (window as any).__game = game;
