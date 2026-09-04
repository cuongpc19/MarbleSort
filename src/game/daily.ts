// The seven-day login streak.
//
// One reward a day, bigger each day, resetting to day 1 the moment a day is missed. Nothing here
// touches Phaser — the rule is a pure function of the clock and the save, so the scene only has to
// draw what it is told.
//
// ⚠ **Coins and magnets, and nothing else.** Those are the only two things this game lets a player
// own: `save.coins` and `save.magnets`. The wrench and the undo are bought outright with coins at
// the moment they are used (`COST` in `GameScene`), so there is no inventory to put them in and a
// day that paid one would have nowhere to bank it. Adding a third item type to make the card look
// busier would be a whole system nobody asked for.

import { save } from "./save";

/**
 * Master switch. **On** since 2026-08-19, when the seven-day card was replaced by the three-day one.
 *
 * ⚠ `bf_daily` was deliberately never wiped while this was off, so a player who banked days under
 * the old seven-day cycle still has that streak in storage. `dailyState` clamps it — see the note
 * there. Do not "clean up" the key on a future change either: it is the player's progress, and the
 * cheapest way to lose it is to assume nobody has any.
 */
export const DAILY_ON = true;

/** Days in one cycle. Day 3 claimed rolls the streak back to day 1 the next day. */
export const DAILY_DAYS = 3;

/**
 * What each day pays in coins.
 *
 * ⚠ Read against the earn rate, not in isolation: a win pays `WIN_COINS` = 10 (20 on a badged
 * board) and a revive costs 50, so **day 1 alone is worth ten ordinary levels** and the three-day
 * cycle is worth fifty. That is a large
 * number on purpose — the play log showed players jamming at level 3 with 20 coins to their name,
 * i.e. the revive priced out of exactly the levels that need it most. Paying it here rather than
 * raising `WIN_COINS` keeps the win reward, which is tuned against the ladder, untouched.
 */
export const DAILY_COINS = [100, 150, 250];

/**
 * Magnets each day pays, alongside the coins.
 *
 * ⚠ Day 1 pays none, and that is the shape of the whole card: coins on the first day, coins **and**
 * an item on the second, more of both on the third. A cycle where every day pays the same kinds of
 * thing has nothing to come back for on day two.
 *
 * ⚠ Must stay the same length as `DAILY_COINS`. `claimDaily` indexes both by the same day.
 */
export const DAILY_MAGNETS = [0, 1, 2];

/**
 * The level that unlocks it. Below this the icon is not on the home screen at all.
 *
 * ⚠ **Read as "after clearing level 16", not "from level 16".** Both gates are strict: `dailyReady`
 * asks `save.unlocked > DAILY_FROM`, and `unlocked` only passes 16 once level 16 is won. Lowering
 * this to 15 to mean the same thing would open the card a level early.
 *
 * ⚠ **It has been 10, then 5, then 10, and is 16 since 2026-09-02 — set deliberately each time, so
 * do not "restore" a previous value from the history below.** It started at 10; the play log showed
 * players jamming around level 3 with about 20 coins, unable to afford the 50-coin revive that
 * would rescue them, so it went to 5 to put a hundred coins in their hands earlier; it went back to
 * 10, and now to 16, by decision.
 *
 * ⚠ **What 16 costs, and it is the thing to watch.** Two measured facts point the same way. The
 * revive is 50 coins against `WIN_COINS` = 10 a win, so a player who jams twice before their
 * first hundred coins has exactly one outcome — the first jam is covered by the free revive every
 * player now gets (`save.freeReviveUsed`), the second is not, and 16 wins is a long way to make
 * them earn it. And the
 * funnel is steep early: 11% of players never open level 3 after clearing level 2, and about
 * two-thirds are gone inside the first six levels, so **most of the audience now never reaches the
 * reward at all**. If early-quit numbers move after this, this constant is the first place to look.
 *
 * ⚠ It no longer lines up with the magnet. At 5 the cycle landed day 2 — the first day that pays a
 * magnet — right before `MAGNET_TUTOR_LEVEL` = 6 taught what a magnet is. From 10 up the lesson
 * comes first and the reward later, which is the safer order of the two but no longer a designed
 * pairing; at 16 they are ten levels apart and the pairing is gone entirely.
 *
 * ⚠ **Nothing anywhere tests the level number against this.** `GameScene` offers the card on a win
 * through `dailyOfferable()`, which asks the gate and the streak, never `this.level === DAILY_FROM`
 * — see the note at that call site for what the equality test cost. So moving this number moves the
 * whole feature and there is no second copy to keep in step. There must not be one.
 */
export const DAILY_FROM = 16;

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
  // ⚠ Clamped. `bf_daily` outlived the seven-day cycle, so a returning player can hand us a streak
  // of 4..7 for a card that now has three columns — and an unclamped `day` of 6 lights nothing,
  // ticks nothing, and reads to them as the reward having vanished. The rollover below needs no
  // clamp because `% DAILY_DAYS` already lands inside the range.
  if (last === today) return { day: Math.min(streak, DAILY_DAYS), claimable: false, done: Math.min(streak, DAILY_DAYS) };
  const next = last === dayKey(now - 864e5) ? (streak % DAILY_DAYS) + 1 : 1;
  // A fresh cycle shows nothing banked; mid-cycle, everything before today is.
  return { day: next, claimable: true, done: next - 1 };
}

/** Is the icon worth showing at all — i.e. has the player unlocked it and is there anything to take? */
export function dailyReady(): boolean {
  return DAILY_ON && save.unlocked > DAILY_FROM && dailyState().claimable;
}

/**
 * May a win **interrupt the run** to offer the reward — at most once a day.
 *
 * ⚠ **Not the same question as `dailyReady`, and the difference is the whole point.** `dailyReady`
 * asks whether there is something to take, which stays true all day for anyone who does not take
 * it — so gating the detour on it sent a player home after *every* win. 121 forced returns over 72
 * devices in one day of real play, one of them 50 times.
 *
 * The reward itself is never withheld: the calendar button is still on the home screen with its
 * badge, and `dailyReady` still governs that. This only limits how often the game stops the player
 * to point at it.
 */
export function dailyOfferable(now = Date.now()): boolean {
  return dailyReady() && save.dailyOffered !== dayKey(now);
}

/** Remember that today's offer has been made, so it is not made again. */
export function markDailyOffered(now = Date.now()): void {
  save.dailyOffered = dayKey(now);
}

/** What one day of the cycle hands over. */
export interface DailyPrize {
  coins: number;
  magnets: number;
}

/** What day `d` (1-based) pays, without taking it. The card draws every day from this. */
export function dailyPrize(d: number): DailyPrize {
  return { coins: DAILY_COINS[d - 1] ?? 0, magnets: DAILY_MAGNETS[d - 1] ?? 0 };
}

/**
 * Take today's reward. Returns what was paid, or null if there was nothing to take.
 *
 * ⚠ Writes the day stamp **and** the streak together. Storing only the stamp would leave the streak
 * to be re-derived on the next open, and any re-derivation is a chance to disagree with the card the
 * player just watched.
 *
 * ⚠ Returns the prize rather than just the coins, because the card has to animate what it paid and
 * a magnet flying to the wallet would be a lie. The caller needs both numbers, so this hands over
 * both — deriving them again at the call site is a second copy of the table.
 */
export function claimDaily(now = Date.now()): DailyPrize | null {
  const st = dailyState(now);
  if (!st.claimable) return null;
  save.daily = { streak: st.day, last: dayKey(now) };
  const prize = dailyPrize(st.day);
  save.coins = save.coins + prize.coins;
  if (prize.magnets) save.magnets = save.magnets + prize.magnets;
  return prize;
}
