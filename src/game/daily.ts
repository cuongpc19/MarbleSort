// The seven-day login streak.
//
// One reward a day, bigger each day, resetting to day 1 the moment a day is missed. Nothing here
// touches Phaser — the rule is a pure function of the clock and the save, so the scene only has to
// draw what it is told.
//
// ⚠ **Coins, and only coins.** The reference this was copied from hands out potions, hammers and
// skins; this game has no inventory to put them in — a booster is bought outright with coins at
// the moment it is used (`COST` in `GameScene`), there is nothing to own. Inventing an item type
// to make the card look busier would be a whole system nobody asked for, and the coin is already
// the thing every booster is priced in.

import { save } from "./save";

/**
 * Master switch. **Off** — the art was judged not good enough to ship (2026-08-19).
 *
 * ⚠ Off, not deleted, and `bf_daily` is deliberately left alone. A player who has already banked
 * three days of a streak keeps them for whenever this comes back; wiping the key to "clean up"
 * would take their progress away to hide a feature they can no longer see. The rule below is
 * whole and tested either way — what is switched off is only the three places that draw it.
 *
 * Flipping this back to `true` is the entire re-enable: the icon, the card, and the level-10
 * routing all read it.
 */
export const DAILY_ON = false;

/** Days in one cycle. Day 7 claimed rolls the streak back to day 1 the next day. */
export const DAILY_DAYS = 7;

/**
 * What each day pays.
 *
 * ⚠ Read against the earn rate, not in isolation: a win pays `WIN_COINS` = 10, and a revive costs
 * 50. So day 1 alone is worth two and a half levels, and a full week is worth more than sixty. That
 * is deliberate — the play log showed players jamming at level 3 with 20 coins to their name, i.e.
 * the revive priced out of exactly the levels that need it. This is the cheapest way to put coins
 * in a new player's pocket without touching the win reward, which is tuned against the ladder.
 */
export const DAILY_COINS = [25, 40, 60, 80, 100, 130, 200];

/**
 * The level that unlocks it. Below this the icon is not on the home screen at all.
 *
 * ⚠ A player who has cleared two levels has not yet met the machine; a card offering them a
 * seven-day commitment is asking for something before it has given them anything.
 */
export const DAILY_FROM = 10;

/** Local calendar day, `YYYY-MM-DD`. The player's own midnight is the boundary they expect. */
export function dayKey(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export interface DailyState {
  /** which day of the cycle is live, 1..DAILY_DAYS */
  day: number;
  /** true while today's reward is still there to take */
  claimable: boolean;
  /** how many days of the cycle are already banked — the ticks on the card */
  done: number;
}

/**
 * Where the streak stands right now.
 *
 * ⚠ **Yesterday is a calendar day, not 24 hours.** Someone who plays at 23:50 and again at 00:10
 * has played on two days and their streak should count two, which is what a player means by "daily"
 * and what every game they have played does. Measuring elapsed time instead would refuse them.
 *
 * ⚠ The device clock is the only clock there is. A player who winds it forward can farm the whole
 * week in a minute, and that is accepted: the alternative is a server, and the reward is coins in a
 * single-player game where the same player could simply edit localStorage anyway.
 */
export function dailyState(now = Date.now()): DailyState {
  const { streak, last } = save.daily;
  const today = dayKey(now);
  if (last === today) return { day: streak, claimable: false, done: streak };
  const next = last === dayKey(now - 864e5) ? (streak % DAILY_DAYS) + 1 : 1;
  // A fresh cycle shows nothing banked; mid-cycle, everything before today is.
  return { day: next, claimable: true, done: next - 1 };
}

/** Is the icon worth showing at all — i.e. has the player unlocked it and is there anything to take? */
export function dailyReady(): boolean {
  return DAILY_ON && save.unlocked > DAILY_FROM && dailyState().claimable;
}

/**
 * Take today's reward. Returns the coins paid, or 0 if there was nothing to take.
 *
 * ⚠ Writes the day stamp **and** the streak together. Storing only the stamp would leave the streak
 * to be re-derived on the next open, and any re-derivation is a chance to disagree with the card the
 * player just watched.
 */
export function claimDaily(now = Date.now()): number {
  const st = dailyState(now);
  if (!st.claimable) return 0;
  save.daily = { streak: st.day, last: dayKey(now) };
  const coins = DAILY_COINS[st.day - 1] ?? 0;
  save.coins = save.coins + coins;
  return coins;
}
