// Thuoc do do kho cho Loop Sort: cho mot bot choi that mot van, tra ve thang/thua, cao
// nhat tren ray, so cu cham. Dung cho CA hai viec va do la co y: do bo level cu de lay
// duong cong, roi nghiem thu bo level moi tren DUNG cai thuoc do ay.
//
// ⚠ Mot dinh nghia bot, mot dinh nghia vong lap. Ball Sort (du an me) da tra gia cho bai
// hoc nay: sim, winrate va tune moi cai giu mot ban sao ba con bot, chung troi khoi nhau,
// va cung mot phep do ra hai con so khac nhau ma khong cai nao noi duoc nen tin cai nao.
//
// Chay truc tiep de xem mot dai level:
//   node tools/loopsort/levelbot.mjs 1-50            (du lieu goc)
//   node tools/loopsort/levelbot.mjs 1-50 --data tools/loopsort/data
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ORIG = path.resolve(HERE, "../../Manythings/LoopSort-teardown/data/");

// loopsort.js goi fetch("../../Manythings/.../Levels.json"). Doi thanh doc dia, va cho phep
// tro sang THU MUC KHAC de do bo level tu sinh bang cung mot bo may.
export async function useData(dir) {
  const base = dir ? path.resolve(dir) : ORIG;
  globalThis.fetch = async (u) => {
    const f = path.basename(String(u));
    const p = path.join(base, f);
    const buf = await readFile(existsSync(p) ? p : path.join(ORIG, f));
    return { json: async () => JSON.parse(buf.toString("utf8")) };
  };
}

// ⚠ Game co dung Math.random (huong tuon ra, rung lac). Bot ma choi tren mot bo sinh so
// khong gieo duoc thi hai lan do ra hai con so khac nhau, va luc do khong con la thuoc do.
let _seed = 1;
export function seed(n) { _seed = (n >>> 0) || 1; }
Math.random = () => {
  _seed ^= _seed << 13; _seed ^= _seed >>> 17; _seed ^= _seed << 5;
  return ((_seed >>> 0) % 1e6) / 1e6;
};

const DT = 1 / 60;
// Tran thoi gian mot van. ⚠ Day la mot tham so cua THUOC DO chu khong phai cua tro choi:
// ban co to thi mot vong ray lau hon, nen cung mot the tran qua ngan se bao "thua" cho mot
// ban co that ra thang duoc, chi la cham hon. LS_MAXS de do lai khi nghi ngo dung cai do.
const MAX_S = Number(process.env.LS_MAXS || 240);

// Chinh sach cham. Khong phai bot gioi nhat co the - la bot DU DE noi hai ban co khac nhau
// cho nao, va dung mot chinh sach cho moi phep do.
//
// ⚠ Cho ray voi bot roi hay cham (`WAIT_AT`). Bot cu cua headless.mjs cham moi 1.2 giay
// mien la `counter < slotCount`, tuc do het toc do vao mot co may ma duong thua duy nhat la
// tac ray - no thua nhung van ma nguoi choi qua de dang. Ball Sort do duoc dung dieu nay:
// bot khong biet cho thi ca thang do kho deu lech.
// Chon nuoc cham. Ba thu quyet dinh, theo dung thu tu quan trong:
//   1. mau do ra co ben nao nhan ngay khong  (khong thi hang di vong mai, an cho tren ray)
//   2. do xong thi ben NAY mo ra mau gi - co hut duoc hang dang nam tren ray khong
//   3. do it thi de xoay hon
//
// ⚠ (2) la thu bi bo quen o ban dau va no la thu quan trong nhat. Ray la mot cai kho: hang
// nam do doi mot ben mo dung mau no ra. Bot chi biet (1) thi cham vai nuoc dau roi dung
// hinh - do duoc: 1/12 level thang, phan lon van dung o 1-8 cu cham va chay het 240 giay.
// ⚠ Mo man thi KHONG mau nao duoc nhan ca (ben nao cung con day hang), nen phai co duong
// "do lieu": khi khong con nuoc nao sach va ban co da dung yen, cu do ben day nhat. Do la
// nuoc mo man that su cua tro choi, khong phai nuoc lieu.
function pickTap(g, desperate) {
  const onRail = {};
  for (const c of g.cubes) onRail[c.color] = (onRail[c.color] || 0) + 1;
  let best = null, bestScore = -1e9, fallback = null;
  for (const t of g.trucks) {
    if (!g.canTap(t)) continue;
    const n = g.tapLoad(t);
    const c = t.blocks[t.blocks.length - 1].color;
    let score = 0;
    for (const o of g.trucks) {
      if (o === t || o.gone || !g.accepts(o, c)) continue;
      if (o.fill > 0 && o.claim === c) score += 6 + o.blocks.length;   // dang do dang mau nay
      else if (o.blocks.length) score += 5 + o.blocks.length;          // mieng dung mau
      else score += 1;                                                 // ben rong: nhan tuot
    }
    // do xong thi ben nay mo ra mau gi, va tren ray dang co bao nhieu mieng mau do
    // ⚠ Ben "thuan mau" (ca đong cung mot mau) la ben DANG GOM, khong phai ben can do di.
    // Do no ra la pha chinh viec no dang lam. Chi duoc do khi co mot ben khac cung mau ma
    // DONG HON - tuc la don nho ve lon. Thieu luat nay bot danh bong ban vinh vien: tren
    // level 1 (bon mieng do, hai ben) no do qua do lai 131 lan, ca hai ben khong bao gio
    // gom du bon, va van chay het 240 giay.
    if (t.blocks.every((b) => b.color === c)) {
      const bigger = g.trucks.some((o) => o !== t && !o.gone && o.blocks.length > t.blocks.length &&
        o.blocks.length < o.cap && o.blocks.every((b) => b.color === c));
      if (!bigger) score = 0;
    }
    const next = t.blocks[t.blocks.length - 1 - n];
    if (next && onRail[next.color]) score += 4 * Math.min(onRail[next.color], t.cap - (t.blocks.length - n));
    if (score > 0) {
      score -= n * 0.5;
      if (score > bestScore) { bestScore = score; best = t; }
    } else {
      // ⚠ Nuoc "khong co ai nhan" phai la nuoc DON TRONG MOT BEN, khong phai nuoc do bua cai
      // dong to nhat. Mot ben RONG nhan moi mau, nen no la cho gom duy nhat cho nhung mau
      // dang nam rai rac - va neu khong co ben rong nao thi nhung mau do vinh vien khong ve
      // dau duoc. Ban dau chon "ben nhieu hang nhat" va no chinh la cach tu khoa: do duoc
      // tren level 65, ray ket lai voi LB LB LB O O Y trong khi khong ben nao nhan mot mau
      // nao trong ba mau do - het cham duoc, ban chet sau 12 cu cham.
      const after = t.blocks.length - n;      // con lai bao nhieu sau khi do
      if (!fallback || after < fallback.after) fallback = { t, after };
    }
  }
  return best || (desperate || !g.cubes.length ? (fallback && fallback.t) : null);
}

// ⚠ `slip` la cach DUY NHAT con lai de mot ban co ra nhieu duong choi khac nhau: engine gio
// tat dinh (mot phien khac da bo ngau nhien o cho sinh hang), nen cung mot ban co + cung con
// bot = cung mot van, hat gieo khong doi duoc gi. Do duoc: ba hat cho ra ba ket qua giong
// nhau den tung cu cham va tung giay. Muon biet mot ban co CO duong thang hay khong thi phai
// cho bot di chech ra khoi duong no vua di - do la cong dung cua slip o day, khong phai de
// mo phong nguoi choi au.
export function playOnce(E, id, s, slip = 0) {
  seed(s);
  const g = new E.Game(id);
  let now = 0, nextTap = 0, peak = 0, taps = 0;
  // ⚠ Kien nhan la CHO RAY VOI DI, khong phai cho toi mot nguong co dinh. Ban dau viet
  // "cham khi counter <= slotCount/2" va bot dung hinh o moi level: hang khong ben nao nhan
  // thi nam li tren ray, counter khong bao gio xuong duoi nguong, bot khong cham nua, van
  // chay het 240 giay - 0% thang tren ca level 1. Cho tren mot con so tuyet doi la cho mot
  // dieu co the khong bao gio toi.
  let lastN = -1, flat = 0;
  for (let step = 0; step * DT < MAX_S && g.state === "play"; step++) {
    now += DT * 1000;
    g.step(DT, now);
    const n = g.counter();
    peak = Math.max(peak, n);
    if (n === lastN) flat++; else { flat = 0; lastN = n; }
    // Cham khi ray da lang (khong doi trong ~0.4s) hoac khi con rong rai. Con `canTap` lo
    // phan "co du cho khong" - o day chi quyet dinh CO NEN cham luc nay khong.
    // Ray con rong rai thi cham ngay; gan day thi cho no lang han (khong doi trong ~0.4s)
    // roi hay cham tiep, vi hang dang tren duong vao ben.
    if (now >= nextTap && (n <= g.slotCount * 0.6 || flat > 24)) {
      let t = pickTap(g, flat > 60);
      if (slip && t && Math.random() < slip) {
        const any = g.trucks.filter((x) => g.canTap(x));
        if (any.length) t = any[Math.floor(Math.random() * any.length)];
      }
      if (t && g.tap(t)) { taps++; nextTap = now + 700; flat = 0; }
      else nextTap = now + 250;
    }
  }
  return { win: g.state === "win", state: g.state, peak, taps, secs: now / 1000,
           cap: g.slotCount, left: g.trucks.reduce((n, t) => n + t.blocks.length, 0) };
}

// N van cho mot level, tra ve ty le thang + cao nhat tren ray trung binh.
export function rate(E, id, runs = 3, off = 0, slip = 0) {
  let win = 0, peak = 0, taps = 0, secs = 0;
  for (let i = 0; i < runs; i++) {
    const r = playOnce(E, id, 0x9e3779b9 ^ (id * 2654435761) ^ ((i + off) * 40503), slip);
    if (r.win) win++;
    peak += r.peak; taps += r.taps; secs += r.secs;
  }
  return { win: win / runs, peak: peak / runs, taps: taps / runs, secs: secs / runs };
}

// ---------------------------------------------------------------- chay truc tiep
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const arg = (n, d) => {
    const i = process.argv.indexOf("--" + n);
    return i < 0 ? d : process.argv[i + 1];
  };
  const spec = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "1-30";
  const [a, b] = spec.includes("-") ? spec.split("-").map(Number) : [Number(spec), Number(spec)];
  await useData(arg("data", null));
  const E = await import("./loopsort.js");
  await E.loadData();
  const runs = Number(arg("runs", 3));
  console.log("lv    thang  peak/cap  cham  giay");
  const band = [];
  for (let id = a; id <= b; id++) {
    if (!E.LEVELS[id]) continue;
    const r = rate(E, id, runs);
    band.push(r);
    console.log(String(id).padStart(4) + "  " + (r.win * 100).toFixed(0).padStart(4) + "%  " +
      (r.peak.toFixed(1) + "/" + E.LEVELS[id].SlotCount).padStart(8) + "  " +
      r.taps.toFixed(0).padStart(4) + "  " + r.secs.toFixed(0).padStart(4));
  }
  const m = (k) => (band.reduce((s, x) => s + x[k], 0) / band.length);
  console.log(`\ntrung binh ${a}-${b}: thang ${(m("win") * 100).toFixed(0)}%  peak ${m("peak").toFixed(1)}  cham ${m("taps").toFixed(0)}  ${m("secs").toFixed(0)}s`);
}
