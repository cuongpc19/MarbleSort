/**
 * Take down the HTML boot poster in `index.html`.
 *
 * ⚠ **Every scene that can be the first one on screen has to call this**, not just Home. The
 * poster is a full-screen `div` at `z-index: 10`, so whatever fails to dismiss it does not
 * degrade — it covers the running game completely, and the player is left looking at a title
 * that pulses forever over a board they cannot see or touch.
 *
 * That is exactly what `?level=N` and `?custom=1` did: `main.ts` stops Home and starts Game
 * directly, so `HomeScene.create` — the only place that used to remove the poster — never ran.
 * Reported from a phone as "chỉ hiển thị Ball Flow rồi mãi không play được", and it took the
 * request log to find, because every URL anyone tested from a desktop went to `/` and worked.
 * The editor's two "open the game" links are `?level=N` and `?custom=1`, so every hand-built
 * board previewed that way had been showing a dead poster too.
 *
 * Idempotent, so calling it from a scene that restarts costs nothing.
 */
export function dismissBootSplash(): void {
  const boot = document.getElementById("boot");
  if (!boot) return;
  boot.classList.add("hide");
  // Fade out first, then take the node out entirely rather than leaving an invisible
  // full-screen div sitting on top of the canvas swallowing taps.
  setTimeout(() => boot.remove(), 400);
}
