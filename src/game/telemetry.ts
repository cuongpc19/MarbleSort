// Finished games, sent to a Firebase Realtime Database — the only route real players' results
// have to reach us.
//
// Why it exists: `playlog.ts` writes every game to localStorage, on the player's own machine, and
// Settings can copy them to the clipboard. That works for the person holding the phone and for
// nobody else. `npm run winrate -- --fit` needs games from strangers, and until this file existed
// there was no way to get one.
//
// ⚠ **Realtime Database, not Firestore.** RTDB accepts raw JSON over REST — one `fetch`, no SDK,
// **zero bytes** added to the bundle. Firestore's REST API wraps every field in its own type
// ({"integerValue":"30"}…), so it needs a conversion layer at both ends for the same result.
//
// ⚠ **The database URL is exposed in the bundle** and there is no way around that for
// browser-sent telemetry. So the security rules must make `/runs` **write-only** — anyone may add
// a row, nobody may read one back. See `database.rules.json`.
//
// ⚠ **The privacy page has to agree with this file.** `public/privacy.html` names what is
// collected; the moment a field is added here that page is wrong, and CrazyGames requires it to
// be right. They are two files rather than one only because one is HTML.
//
// Reading the data back: `node scripts/pull-runs.mjs` (see that file).

import { deviceId } from "./playlog";
import { platform } from "../platform";
import { gaLoaded } from "./analytics";

/**
 * The Realtime Database endpoint, ending in `/runs.json`.
 *
 * Project `ball-flow-d1d9a`, default instance, Singapore.
 *
 * ⚠ Emptying it is the off switch — no request, no console noise, no 404 storm from every finished
 * level. Nothing else here is conditional, so that is the whole of it.
 *
 * ⚠ This exact string is copied in `scripts/pull-runs.mjs` (minus `/runs.json`), and there is no
 * way to share it: one ships to browsers, the other must never. If it changes, change both.
 */
const ENDPOINT = "https://ball-flow-d1d9a-default-rtdb.asia-southeast1.firebasedatabase.app/runs.json";

/** Is telemetry switched on in this build? */
export function telemetryOn(): boolean {
  return ENDPOINT.length > 0;
}

/**
 * ⚠ **Every game is sent, test games included** — but each row carries the hostname it was played
 * on, so they can be told apart when the data is read. Filtering on read rather than blocking on
 * write, because a blocked row is gone forever while a filtered one is still there whenever the
 * question changes. `scripts/pull-runs.mjs` drops localhost from the winrate table by default.
 *
 * Filtering by date is not a substitute: testing carries on after launch, so the two streams
 * overlap forever.
 */
function whereFrom(): string {
  try {
    return location.hostname || "?";
  } catch {
    return "?";
  }
}

/**
 * The attempt currently open, so its start row and its end row can be paired.
 *
 * ⚠ Regenerated on every entry to a level, including a restart. Two attempts at the same level by
 * the same device on the same day are two different things, and a start with no matching end is
 * precisely the abandonment this exists to count — pairing them by `dev + lvl` would merge them
 * and the count would come out zero.
 */
let attempt = "";

/**
 * The player reached a board. Sent **as well as** the end row, not instead of it.
 *
 * Why it did not exist before: the log was built to calibrate winrate, and winrate is a function
 * of outcomes — a player who quits mid-level has no outcome to feed the curve. But that also made
 * them invisible, so `stats.html` could only ever report "players with at least one finished
 * attempt", which reads like a count of openings and is not one.
 *
 * ⚠ This is the row that makes drop-off measurable: a start with no end is someone who walked
 * away from that board, which is the number a difficulty spike shows up in first.
 */
export function sendStart(row: Record<string, unknown>) {
  attempt = Math.random().toString(36).slice(2, 10);
  send({ ...row, ev: "start", run: attempt });
}

/** A finished attempt. Carries the same `run` as the start row it closes. */
export function sendRun(row: Record<string, unknown>) {
  send({ ...row, ev: "end", run: attempt });
}

/**
 * The one writer. **Fire and forget**: never awaited, never surfaced, never allowed to throw. A
 * player must not be able to tell that telemetry is broken.
 *
 * ⚠ `keepalive` is what gets the end row out. It fires on the win/lose card, which is exactly when
 * a player closes the tab — without it the browser cancels the request as the page goes away, and
 * the most interesting rows are the ones that never arrive.
 */
function send(row: Record<string, unknown>) {
  if (!ENDPOINT) return;
  try {
    const body = {
      ...row,
      dev: deviceId(), // random per-device code — not an identity, see privacy.html
      host: platform.name, // web | crazy | android
      from: whereFrom(), // hostname: localhost vs crazygames.com — see whereFrom()
      build: __APP_BUILD__, // which build produced this row
      // ⚠ Whether gtag.js actually loaded. One bit, and it is the only way to tell "Analytics is
      // empty because it is blocked" from "Analytics is empty because the code is wrong" — GA
      // itself cannot distinguish those, it is silent in both cases.
      ga: gaLoaded() ? 1 : 0,
      at: Date.now(),
    };
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      /* offline, blocked, or the rules said no — one row lost, and that is fine */
    });
  } catch {
    /* no fetch at all — skip */
  }
}
