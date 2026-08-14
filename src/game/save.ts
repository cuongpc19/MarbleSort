// Progress + wallet. Small enough to keep in key-value storage; every key is prefixed `bf_`
// so a browser that still holds another build's keys is ignored rather than misread.
//
// ⚠ Through `platform.storage`, never `localStorage` directly. On CrazyGames that routes to the
// host's data module so a save follows the player between devices — and it writes to *both*, so
// a session where the SDK is down still leaves a fresh local copy rather than a stale one frozen
// at whenever the SDK last worked.
//
// ⚠ And the prefix is now frozen. Automatic Progress Save backs `localStorage` up verbatim, so
// renaming `bf_*` after launch restores the old names into a game that reads the new ones and
// every player loses everything. Before launch it is free; after, it never is.

import { platform } from "../platform";

const K_LEVEL = "bf_level";
const K_STARS = "bf_stars";
const K_COINS = "bf_coins";
const K_MUTE = "bf_mute";
/** Has the player been walked through level 1 yet? */
const K_TUTOR = "bf_tutor";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = platform.storage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    platform.storage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — progress just won't persist */
  }
}

export const save = {
  /** highest level the player has unlocked (1-based) */
  get unlocked() {
    return Math.max(1, read<number>(K_LEVEL, 1));
  },
  set unlocked(v: number) {
    write(K_LEVEL, Math.max(this.unlocked, v));
  },

  stars(n: number): number {
    return read<Record<string, number>>(K_STARS, {})[String(n)] ?? 0;
  },
  setStars(n: number, s: number) {
    const all = read<Record<string, number>>(K_STARS, {});
    if ((all[String(n)] ?? 0) >= s) return;
    all[String(n)] = s;
    write(K_STARS, all);
  },
  get totalStars() {
    return Object.values(read<Record<string, number>>(K_STARS, {})).reduce((a, b) => a + b, 0);
  },

  get coins() {
    // ⚠ A new player starts on **nothing** and earns their way in — `WIN_COINS` = 10 a level,
    // against 40 for an undo and 50 for a revive. So the first four levels have no boosters and
    // the first five have no revive, which means a jam in that stretch has exactly one outcome:
    // the JAMMED card. That is the decision; the levels down there are the gentle ones and are
    // meant to be winnable without help.
    return read<number>(K_COINS, 0);
  },
  set coins(v: number) {
    write(K_COINS, Math.max(0, Math.round(v)));
  },

  get muted() {
    return read<boolean>(K_MUTE, false);
  },
  set muted(v: boolean) {
    write(K_MUTE, v);
  },

  /**
   * Whether the level-1 walkthrough has been seen.
   *
   * ⚠ Written when the walkthrough **finishes**, not when it starts. A player who bounces off the
   * first screen and comes back gets it again, which is the point of it; marking it on entry means
   * the one person who most needs it is the one guaranteed to miss it.
   */
  get tutorialDone() {
    return read<boolean>(K_TUTOR, false);
  },
  set tutorialDone(v: boolean) {
    write(K_TUTOR, v);
  },
};
