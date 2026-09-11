// Thuoc do khong giao dien cho tools/loopsort/loopsort.js.
//
// ⚠ Day la DUNG CU DO, khong phai mot phan cua game. Noi nay khong duoc biet gi ve
// noi tang cua Game ngoai nhung thu da export: cubes[], trucks[], accepts(), counter(),
// step(). Do tu ben trong absorb() thi thuoc do va cai bi do la mot, va no se bao
// "dat" cho bat ky cach lam nao.
//
//   node tools/loopsort/headless.mjs            -> chay bo level mac dinh
//   node tools/loopsort/headless.mjs 1 2 3 4 61 -> chay dung nhung level do
//   node tools/loopsort/headless.mjs --trace 1  -> in dien bien tung buoc cua level 1
//
// Hai so no in ra, va y nghia cua chung:
//
//   counter  : so o vuong sand dang chay tren bang chuyen (so dung giua man hinh).
//              Kiem tra: counter() phai bang so KHOI nguyen ma san dang nam ngoai ben,
//              tinh ca phan da hut do dang (fill). Sai so cho phep 0.
//   intake   : trong so hat sand di ngang mieng mot ben DANG NHAN duoc mau do,
//              bao nhieu phan tram bi hut vao. Rot ra ngoai la phan con lai.
//              Yeu cau: >= 75%, tuc moi luot di ngang mat toi da 1/4 khoi.
//
// Chay duoc tren Node >= 18. Khong can dev server: fetch bi thay bang doc dia.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(HERE, "../../Manythings/LoopSort-teardown/data/");

// loopsort.js goi fetch("../../Manythings/.../Levels.json"). Doi no thanh doc dia.
globalThis.fetch = async (u) => {
  const buf = await readFile(path.join(DATA, path.basename(String(u))));
  return { json: async () => JSON.parse(buf.toString("utf8")) };
};

// ⚠ Game co dung Math.random (huong tuon ra, rung lac). De hai lan chay cho ra hai
// con so khac nhau thi khong con la thuoc do - gieo hat co dinh.
let _seed = 0x2f6e2b1;
Math.random = () => {
  _seed ^= _seed << 13; _seed ^= _seed >>> 17; _seed ^= _seed << 5;
  return ((_seed >>> 0) % 1e6) / 1e6;
};
const reseed = (id) => { _seed = (0x2f6e2b1 ^ (id * 2654435761)) >>> 0 || 1; };

const E = await import("./loopsort.js");
await E.loadData();

const DT = 1 / 60;          // buoc mo phong co dinh
const MAX_S = 90;           // tran thoi gian mot level

// Mot hat duoc coi la "di ngang mieng ben" khi vao trong ban kinh nay. Rong hon vung
// hut that su, va co y nhu the: neu bai sua thu hep vung hut lai thi thuoc do van
// dem dung so hat da co co hoi chui vao.
const MOUTH = (g) => g.r * 3.2;

function run(id, { trace = false } = {}) {
  reseed(id);
  const g = new E.Game(id);
  let now = 0;
  g.now = now;

  // --- do intake: bam theo tung hat, tu luc no vao mieng mot ben dang nhan mau no ---
  const seen = new Map();   // cube object -> {t, eligible}
  let hit = 0, miss = 0;

  // --- do counter: so khoi san dang o ngoai ben ---
  let counterErr = 0, worstErr = 0, peak = 0;

  // --- do be tac: co cat tren ray, ma KHONG BEN NAO nhan bat ky mau nao dang chay ---
  // Day dung la canh nguoi choi thay: xe trong, ray day cat, ma khong gi chui vao ca.
  let stall = 0, stallRun = 0, worstRun = 0;

  // --- do tu nuot: ben vua do mau C ra ma hut lai chinh C ngay khi dong cat con o
  // mieng no. Day la BENH CU ma luat lastDump sinh ra de chan. Do no de khong ai
  // "chua" be tac bang cach xoa thang luat do di.
  const poured = [];        // {t, color, at}
  let selfEat = 0;

  const blocksOut = () => {
    // Hat roi + hat dang cho tuon ra, cong phan da hut do dang nam trong cac ben.
    let grains = g.cubes.length + g.pending.length;
    for (const t of g.trucks) grains += t.fill;
    return grains / g.perBlock;
  };

  const tapOne = () => {
    // Chinh sach cham don gian: cham ben nao con hang va dang co mau duoc mot ben
    // khac nhan. Khong phai bot thong minh - chi can sinh ra du dong sand de do.
    for (const t of g.trucks) {
      if (t.gone || !t.blocks.length || t.drain >= 0) continue;
      const c = t.blocks[t.blocks.length - 1].color;
      if (g.trucks.some((o) => o !== t && g.accepts(o, c))) {
        if (g.tap(t)) { poured.push({ t, color: c, at: now }); return true; }
        return false;
      }
    }
    // Chi do bua khi ray da sach: do mot mau khong ben nao nhan chi tao ket gia.
    if (g.cubes.length) return false;
    for (const t of g.trucks) {
      if (t.gone || !t.blocks.length || t.drain >= 0) continue;
      const c = t.blocks[t.blocks.length - 1].color;
      if (g.tap(t)) { poured.push({ t, color: c, at: now }); return true; }
    }
    return false;
  };

  let nextTap = 0;
  for (let step = 0; step * DT < MAX_S; step++) {
    now += DT * 1000;

    // cham mot nhip moi 1.2s, chi khi con cho tren bang chuyen
    if (g.state === "play" && now >= nextTap && g.counter() < g.slotCount) {
      if (tapOne()) nextTap = now + 1200;
      else nextTap = now + 400;
    }

    const live = new Set(g.cubes);

    // hat da bien mat giua hai khung hinh: bi hut, hay troi mat?
    for (const [c, rec] of seen) {
      if (live.has(c)) continue;
      if (rec.eligible) hit++;
      seen.delete(c);
    }

    for (const c of g.cubes) {
      let inMouth = false;
      for (const t of g.trucks) {
        if (t.gone) continue;
        const dx = c.x - t.px, dy = c.y - t.py;
        if (dx * dx + dy * dy > MOUTH(g) * MOUTH(g)) continue;
        if (!g.accepts(t, c.color)) continue;
        inMouth = true;
        if (!seen.has(c)) seen.set(c, { t, eligible: true });
        break;
      }
      // vua roi khoi mieng ma van con song -> truot
      if (!inMouth && seen.has(c)) { miss++; seen.delete(c); }
    }

    g.step(DT, now);

    // Be tac dung nghia bao cao cua nguoi choi: co mot ben TRONG RONG (khong con
    // khoi nao, khong hut do dang, chua giao xong) dang tu choi MOI mau co tren ray.
    // ⚠ Mot ben con hang ma khong khop mau thi KHONG tinh - do la trang thai binh
    // thuong cua cau do, khong phai loi. Dem ca truong hop do se do lay chinh chinh
    // sach cham ngo nghech cua thuoc do nay va bao loi oan cho game.
    if (g.state === "play" && g.cubes.length && !g.pending.length) {
      const cols = new Set(g.cubes.map((c) => c.color));
      let blocked = false;
      for (const t of g.trucks) {
        if (t.gone || t.blocks.length || t.fill) continue;   // chi xet ben trong rong
        let takes = false;
        for (const col of cols) if (g.accepts(t, col)) { takes = true; break; }
        if (!takes) { blocked = true; break; }
      }
      if (blocked) { stall++; stallRun++; worstRun = Math.max(worstRun, stallRun); }
      else stallRun = 0;
    } else stallRun = 0;

    // Ben vua do mau C ma trong SELF_MS lai dang om chinh C -> tu nuot.
    const SELF_MS = 2500;
    for (let k = poured.length - 1; k >= 0; k--) {
      const p = poured[k];
      if (now - p.at > SELF_MS) { poured.splice(k, 1); continue; }
      if (p.t.fill > 0 && p.t.claim === p.color) { selfEat++; poured.splice(k, 1); }
    }

    peak = Math.max(peak, g.counter());
    const err = Math.abs(g.counter() - Math.ceil(blocksOut() - 1e-9));
    if (err > worstErr) worstErr = err;
    if (err > 0) counterErr++;

    if (trace && step % 30 === 0)
      console.log(
        `  t=${(step * DT).toFixed(1)}s counter=${g.counter()}/${g.slotCount}` +
        ` khoi_that=${blocksOut().toFixed(2)} hat=${g.cubes.length}` +
        ` hit=${hit} miss=${miss} state=${g.state}`);

    if (g.state !== "play") break;
  }

  const intake = hit + miss ? hit / (hit + miss) : 1;
  return {
    id, state: g.state, taps: g.taps, peak, slotCount: g.slotCount,
    perBlock: g.perBlock, intake, hit, miss, counterErr, worstErr,
    stall, stallS: worstRun * DT, selfEat,
  };
}

const argv = process.argv.slice(2);
const trace = argv.includes("--trace");
const ids = argv.filter((a) => /^[0-9]+$/.test(a)).map(Number);
const LIST = ids.length ? ids : [1, 2, 3, 4, 5, 10, 25, 61, 120, 400];

console.log("lv   state  taps peak/cap perBlock  intake   hit/miss  counter sai  be tac lau nhat");
let bad = 0;
for (const id of LIST) {
  if (trace) console.log(`-- level ${id}`);
  const r = run(id, { trace });
  // Be tac qua 3 giay la loi: nguoi choi nhin thay xe trong, ray day cat, khong gi chui vao.
  const ok = r.intake >= 0.75 && r.counterErr === 0 && r.stallS <= 3 && r.selfEat === 0;
  if (!ok) bad++;
  console.log(
    String(r.id).padStart(4) + "  " + r.state.padEnd(6) +
    String(r.taps).padStart(4) + "  " + String(r.peak).padStart(3) + "/" +
    String(r.slotCount).padEnd(3) + "  " + String(r.perBlock).padStart(6) + "  " +
    (r.intake * 100).toFixed(1).padStart(6) + "%  " +
    (r.hit + "/" + r.miss).padStart(10) + "  " +
    (r.counterErr ? `${r.counterErr} khung/${r.worstErr}` : "0").padStart(11) + "  " +
    (r.stallS > 0.01 ? r.stallS.toFixed(1) + "s" : "-").padStart(8) + "  " +
    String(r.selfEat || "-").padStart(6) +
    (ok ? "" : "   <-- CHUA DAT"));
}
console.log(bad ? `\n${bad}/${LIST.length} level chua dat.` : `\n${LIST.length}/${LIST.length} level dat.`);
process.exit(bad ? 1 : 0);
