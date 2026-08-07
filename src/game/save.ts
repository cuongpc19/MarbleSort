// Progress + wallet. Small enough to keep in localStorage; every key is prefixed `ms_`
// so a browser that still holds another build's keys is ignored rather than misread.

const K_LEVEL = "ms_level";
const K_STARS = "ms_stars";
const K_COINS = "ms_coins";
const K_MUTE = "ms_mute";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
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
    return read<number>(K_COINS, 250);
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
};
