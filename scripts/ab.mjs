// Read the A/B test: two ladders that differ on exactly two boards, levels 5 and 10.
//
//   node scripts/ab.mjs            # since the test went live
//   node scripts/ab.mjs 48         # last 48 hours
//
// ⚠ **Split on the `ab` field, not on `build`.** Both arms ship in one bundle and carry the same
// build stamp, so a build column cannot separate them. Rows written before the test went live have
// no `ab` at all and are dropped rather than guessed at — the same rule the fingerprint has.
//
// ⚠ **The two arms are also separable by `sig`**, and that is the check worth running first: if the
// arms disagree about which board a level is, their fingerprints differ, and a row whose `ab` says
// A while its `sig` says B is a bug in the split rather than a result.
//
// ⚠ **Only levels 5 and 10 can move.** Every other level is byte-identical between the arms, so a
// difference anywhere else is noise and is printed to prove it: if level 7 shows a gap as wide as
// level 10's, the sample is too small to read either.
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const HOURS = Number(process.argv[2] ?? 0);
const TMP = "scripts/.ab.json";
const r = spawnSync("npx", ["-y", "firebase-tools", "database:get", "/runs", "-o", TMP], {
  encoding: "utf8",
  shell: true,
});
if (r.status !== 0) {
  console.error([r.stdout, r.stderr].filter(Boolean).join("\n"));
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(TMP, "utf8"));
fs.unlinkSync(TMP);

const NOW = Date.now();
const from = HOURS ? NOW - HOURS * 3600000 : 0;
const rows = Object.values(raw ?? {})
  .filter((x) => x && typeof x === "object" && typeof x.lvl === "number")
  .filter((x) => x.ab === "A" || x.ab === "B")
  .filter((x) => {
    const t = x.at ?? x.ts;
    return t && t >= from && t <= NOW + 36e5;
  })
  .filter((x) => !/localhost|127\.0\.0\.1|192\.168\./.test(String(x.from ?? "")));

if (!rows.length) {
  console.log("Chua co ban ghi nao mang nhan A/B. Bat dau dem tu luc ban build len production.");
  process.exit(0);
}
const f = (t) => new Date(t + 7 * 3600000).toISOString().replace("T", " ").slice(5, 16);
const stamps = rows.map((x) => x.at ?? x.ts);
console.log(
  `${rows.length} ban ghi co nhan A/B · ${f(Math.min(...stamps))} → ${f(Math.max(...stamps))} gio VN\n`,
);

// How many devices landed in each arm. A split that is not near 50/50 is the first thing to doubt.
const devs = { A: new Set(), B: new Set() };
for (const x of rows) devs[x.ab].add(String(x.dev ?? "?"));
const tot = devs.A.size + devs.B.size;
console.log(
  `may trong moi nhanh: A ${devs.A.size} (${((100 * devs.A.size) / tot).toFixed(1)}%) · ` +
    `B ${devs.B.size} (${((100 * devs.B.size) / tot).toFixed(1)}%)\n`,
);

const ends = rows.filter((x) => x.ev === "end" || x.ev === undefined);
const cell = (lv, arm) => {
  const r2 = ends.filter((x) => x.lvl === lv && x.ab === arm);
  const w = r2.filter((x) => x.result === "win").length;
  const boost = r2.filter((x) => Array.isArray(x.used) && x.used.length).length;
  return { n: r2.length, w, boost, rate: r2.length ? w / r2.length : null };
};
// ⚠ Standard error of a difference of two proportions. Anything inside 2x this is not a result.
const se = (a, b) =>
  a.n && b.n
    ? Math.sqrt((a.rate * (1 - a.rate)) / a.n + (b.rate * (1 - b.rate)) / b.n)
    : null;

console.log("lv |  van A / thang% |  van B / thang% | chenh lech | doc duoc chua");
const LEVELS = [...new Set(ends.map((x) => x.lvl))].filter((l) => l <= 14).sort((a, b) => a - b);
for (const lv of LEVELS) {
  const a = cell(lv, "A");
  const b = cell(lv, "B");
  if (!a.n || !b.n) continue;
  const s = se(a, b);
  const d = (b.rate - a.rate) * 100;
  const real = Math.abs(d) > 2 * s * 100;
  const tested = lv === 5 || lv === 10;
  console.log(
    `${String(lv).padStart(2)}${tested ? "*" : " "}| ${String(a.n).padStart(6)} / ${String(Math.round(a.rate * 100)).padStart(5)}% ` +
      `| ${String(b.n).padStart(6)} / ${String(Math.round(b.rate * 100)).padStart(5)}% ` +
      `| ${(d > 0 ? "+" : "") + d.toFixed(0).padStart(5)} diem | ` +
      (real ? `vuot nhieu (±${(2 * s * 100).toFixed(0)})` : `trong nhieu (±${(2 * s * 100).toFixed(0)})`),
  );
}
console.log("\n* = level dang duoc thu nghiem. Cac dong khac phai nam trong nhieu, neu khong thi mau con qua nho de doc bat cu dong nao.");

// Progression: the number the test is actually for.
const deepest = (arm) => {
  const m = new Map();
  for (const x of rows.filter((y) => y.ab === arm)) {
    const d = String(x.dev ?? "?");
    m.set(d, Math.max(m.get(d) ?? 0, x.lvl));
  }
  return [...m.values()];
};
for (const gate of [6, 10, 11, 15]) {
  const a = deepest("A");
  const b = deepest("B");
  const pa = a.filter((v) => v >= gate).length / (a.length || 1);
  const pb = b.filter((v) => v >= gate).length / (b.length || 1);
  console.log(
    `qua duoc level ${String(gate).padStart(2)}: A ${(100 * pa).toFixed(1)}% (${a.length} may) · ` +
      `B ${(100 * pb).toFixed(1)}% (${b.length} may) · chenh ${((pb - pa) * 100).toFixed(1)} diem`,
  );
}
