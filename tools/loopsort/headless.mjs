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
// ⚠ MAC DINH VAN LA BO LEVEL BAN MO APK, va day khong phai chuyen nho. `DATA` trong loopsort.js
// da chuyen sang "./data/" - bo level TU SINH - nen thuoc do nay dang chung nhan engine tren
// nhung ban co KHONG CON AI CHOI. Dung sua mac dinh o day mot minh: doi mac dinh la doi y nghia
// cua "10/10", va moi con so cong bo truoc do thanh khong so sanh duoc. Do ca hai bang bien moi
// truong, roi hay quyet:
//     node headless.mjs                      # bo cu, de so voi moi con so da cong bo
//     LS_DATA=./data/ node headless.mjs      # bo dang ship
const DATA = path.resolve(HERE, process.env.LS_DATA || "../../Manythings/LoopSort-teardown/data/");

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
  const busy = new Map();   // ben -> thoi diem het "dang tuon hang ra"
  let hit = 0, miss = 0;

  // --- do counter: so khoi san dang o ngoai ben ---
  let counterErr = 0, worstErr = 0, peak = 0;

  // --- do be tac: co cat tren ray, ma KHONG BEN NAO nhan bat ky mau nao dang chay ---
  // Day dung la canh nguoi choi thay: xe trong, ray day cat, ma khong gi chui vao ca.
  let stall = 0, stallRun = 0, worstRun = 0;

  // --- LUAT, do chu du an chot (2026-09-11). Day la ban dac ta, khong phai suy dien.
  //
  //   "Xe rong co the nhan duoc hang, chi co xe da du mau, da dong nap lai, thi khong
  //    nhan duoc hang."
  //
  // Nen:
  //   - xe da giao xong (dong nap, co dau tick)      -> khong nhan gi
  //   - xe day cho                                    -> khong nhan gi
  //   - xe dang hut do dang                           -> chi nhan dung mau dang hut
  //   - xe RONG HAN                                   -> NHAN MOI MAU
  //   - con lai                                       -> nhan dung mau khoi o mieng
  //
  // ⚠ Mau khoi o MIENG, khong phai mau bat ky trong xe. Do tu clip, lv5 t=82-87: mot xe
  // chi con MOT khoi xanh la va 3 o trong; tren ray co du vang, do, xanh duong, xanh la;
  // CHI xanh la chui vao - du chinh xe do truoc dot da do ra ca ba mau kia.
  const rule = (t, color) => {
    if (t.gone) return false;
    if (t.blocks.length >= t.cap) return false;
    if (t.fill > 0) return color === t.claim;
    if (!t.blocks.length) return true;
    return color === t.blocks[t.blocks.length - 1].color;
  };
  let lawErr = 0;

  // --- do tu nuot: ben hut lai chinh dong cat no vua tuon ra, khi dong do CHUA DI DUOC
  // bao xa tren ray. Do hoan toan tu ben ngoai: bam theo tung doi tuong hat, ghi lai no
  // xuat hien gan mieng ben nao, roi cong don quang duong no da di.
  // ⚠ Khong duoc do bang "ben hut dung mau no vua do": level 1 chi co MOT mau, nen phep
  // do do bat nham ca cat cua ben kia va luc nao cung bao co loi.
  const trk = new Map();    // cube -> {orig, run, x, y}
  let selfEat = 0;
  const nearestTruck = (c, pool) => {
    let best = null, bd = Infinity;
    for (const t of (pool || g.trucks)) {
      const dx = c.x - t.px, dy = c.y - t.py, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  };
  // ⚠ Chi gan nguon goc cho ben DANG TUON HANG RA. Tren ban co nhieu ben sat nhau,
  // "ben gan nhat" bat nham ben hang xom, va mot lan hut hoan toan hop le bi dem thanh
  // tu nuot - level 333 bao 6 lan oan vi the.
  const pouring = () => g.trucks.filter((t) => g.pending.some((q) => q.truck === t));

  // ⚠ Ben nao co mieng trung/sat mieng mot ben khac thi KHONG DO duoc: luc hat bien mat,
  // khong the biet ben nao vua hut no. Level 333 co 10 ben tren vong ray chu vi 27.3 va
  // co hai mieng cach nhau 0.00 - do o do la doan, khong phai do.
  const murky = new Set();
  for (const a of g.trucks)
    for (const b of g.trucks)
      if (a !== b && Math.hypot(a.px - b.px, a.py - b.py) < g.r * 6) murky.add(a);

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
      if (g.trucks.some((o) => o !== t && g.accepts(o, c))) return g.tap(t);
    }
    // Chi do bua khi ray da sach: do mot mau khong ben nao nhan chi tao ket gia.
    if (g.cubes.length) return false;
    for (const t of g.trucks) {
      if (t.gone || !t.blocks.length || t.drain >= 0) continue;
      if (g.tap(t)) return true;
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

    // ⚠ Ben dang tuon hang ra thi cat cua chinh no nam day o mieng. Khong duoc tinh do
    // la "truot" - do la luot do, khong phai luot hut. Do tu ben ngoai bang g.pending,
    // khong doc bien noi bo nao cua ban sua.
    for (const t of g.trucks)
      if (g.pending.some((q) => q.truck === t)) busy.set(t, now + 1500);

    for (const c of g.cubes) {
      let inMouth = false;
      for (const t of g.trucks) {
        if (t.gone) continue;
        if (now < (busy.get(t) || 0)) continue;
        // ⚠ Hang cua CHINH ben nay thi khong tinh la mot co hoi bi bo lo. Hang rao chan tu nuot
        // co HAI nua - THOI GIAN (`pourUntil`, chinh la `busy` ngay tren) va NGUON GOC (`c.src`)
        // - va cho nay von chi loai tru nua dau. Mot vali ma LUAT cam hut thi no chua bao gio la
        // mot co hoi, nen dem no la truot la sai the loai.
        //
        // ⚠ Vi sao no im lang suot: vali roi khay xong la bay ra khoi vung hut rat nhanh, nen
        // nua thieu nay gan nhu khong can. Toi khi SCALE len 1.5 thi than xe dai gap ruoi, vali
        // bo trong long xe lau gap ruoi, va no nam ngay trong vung hut cua chinh ben do suot
        // quang duong ay. Do duoc: so lan "nam trong vung hut ma khong duoc hut vi la hang cua
        // chinh no" nhay tu 8 len 70, va intake tu 95.8-100% tut xuong ~54% - ba level truot cua.
        // Engine khong sai mot ti nao; thuoc do sai.
        //
        // ⚠ Sua nay lam intake TANG, tuc lam cua de qua hon - dung loai thay doi nguy hiem nhat
        // voi mot thuoc do. Nen da chung minh no VAN BAN: co y bo sot mot nua so vali du dieu
        // kien trong absorb() thi bang do vao 3/8 level truot o 62.5%. Khong phai cua bi cut.
        if (c.src === t) continue;
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
    const live2 = new Set(g.cubes);

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

    // bam theo tung hat: hat moi -> ghi nguon goc; hat cu -> cong quang duong da di
    const NEAR = g.len * 0.25;
    for (const c of g.cubes) {
      const r = trk.get(c);
      if (!r) {
        // ⚠ CHI do khi khong the nham: dung MOT ben dang tuon hang. Level 333 co 10 ben
        // tren vong ray chu vi 27.3, hai mieng ben cach nhau 0.00 - "ben gan nhat" o do
        // la mot phep doan, va no dem oan 4 lan tu nuot ke ca khi hang rao dang bat.
        // Kiem chung: nang nguong chan trong game len 90% vong ray, con so van y nguyen.
        const pool = pouring();
        const one = pool.length === 1 && !murky.has(pool[0]) ? pool[0] : null;
        trk.set(c, { orig: one,
                     run: 0, x: c.x, y: c.y });
        continue;
      }
      r.run += Math.hypot(c.x - r.x, c.y - r.y);
      r.x = c.x; r.y = c.y;
    }
    // hat da bien mat: ai hut? neu dung ben da tuon no ra, va no chua di duoc 1/4 vong
    // ray, thi do la tu nuot.
    for (const [c, r] of trk) {
      if (live2.has(c)) continue;
      if (r.orig && r.run < NEAR && nearestTruck(c) === r.orig) selfEat++;
      trk.delete(c);
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

  // --- XE CHONG LAN NHAU tren mat ban ---
  // ⚠ Phep do TINH, khong can mo phong: chieu than moi xe thanh mot hinh chu nhat theo truc
  // mieng (dai cap*SLOT_LEN, rong TRUCK_W) roi dem so cap giao nhau. O level day, xe cua ta
  // phinh ra de len nhau, va xe bi de thi khong con mot pixel nao de cham - picktest lv1299
  // ra 4/12. ⚠ KHONG phai loi camera: da do fov 32/12/7 va do doc 56/72/83 do, TAT CA deu
  // ra dung 4/12.
  // ⚠ Lay HAI DAU than xe tu chinh slotPos() cua engine, KHONG tu nhan vector.
  // Lan dau minh tu dung hop bang (t.x + t.mx*L) trong khi slotPos va computeBounds deu dung
  // (t.x - t.mx*L) - than xe keo dai NGUOC huong mieng. Sai mot dau, so level bao loi phong
  // tu 20.2% len 60.9%. Hoi engine thi khong the sai huong.
  //   slotPos(t, 0, 0)          -> dau XA mieng nhat
  //   slotPos(t, cap-1, 1)      -> dau O MIENG
  // ⚠ Be rong THAT dang duoc ve: three3d.js dung TRUCK_W 2.2 + 0.12 vien vo, NHAN he so co
  // cua level (game.fit). Do bang hang so co dinh thi sai: engine thu xe lai ma thuoc do van
  // dem theo co cu, nen no bao con chong trong khi hinh ve da roi nhau.
  // ⚠ Va vi con so nay di theo chinh cai dang duoc sua, phai co SAN cho he so co - neu khong
  // thi "co xe xuong thanh hat bui" cung se qua cua.
  const TRUCK_W_M = 2.32 * (g.fit ?? 1);
  const boxOf = (t) => {
    const A = g.slotPos(t, 0, 0), B = g.slotPos(t, t.cap - 1, 1);
    const nx = -t.my, ny = t.mx, h = TRUCK_W_M / 2, pts = [];
    for (const P of [A, B]) for (const sg of [-1, 1])
      pts.push({ x: P.x + nx * sg * h, y: P.y + ny * sg * h });
    return { x0: Math.min(...pts.map(p => p.x)), x1: Math.max(...pts.map(p => p.x)),
             y0: Math.min(...pts.map(p => p.y)), y1: Math.max(...pts.map(p => p.y)) };
  };
  let overlap = 0;
  {
    const bs = g.trucks.map(boxOf);
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], b = bs[j];
      if (Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) &&
          Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0)) overlap++;
    }
  }

  const intake = hit + miss ? hit / (hit + miss) : 1;
  return {
    id, state: g.state, taps: g.taps, peak, slotCount: g.slotCount,
    perBlock: g.perBlock, intake, hit, miss, counterErr, worstErr,
    stall, stallS: worstRun * DT, selfEat, lawErr, overlap, fit: g.fit ?? 1,
  };
}

const argv = process.argv.slice(2);
const trace = argv.includes("--trace");
const ids = argv.filter((a) => /^[0-9]+$/.test(a)).map(Number);
// ⚠ Loc theo nhung level THUC SU CO. Bo level khong con la du lieu cua ban mo APK (1299 level)
// nua ma la bo tu sinh, va no ngan hon nhieu - danh sach cung o day co 120 va 400, nen thuoc do
// NEM LOI giua chung va khong in noi dong tong ket. Mot thuoc do chet giua chung thi te hon mot
// thuoc do bao truot: no khong noi duoc gi ca.
const WANT = ids.length ? ids : [1, 2, 3, 4, 5, 10, 25, 61, 120, 400];
const LIST = WANT.filter((n) => E.LEVELS[n]);
const MISSING = WANT.filter((n) => !E.LEVELS[n]);
if (MISSING.length) console.log("(bo qua " + MISSING.length + " level khong co trong bo du lieu: " + MISSING.join(", ") + ")");
if (!LIST.length) { console.log("KHONG CO LEVEL NAO DE DO."); process.exit(1); }

console.log("lv   state  taps peak/cap perBlock  intake   hit/miss  counter sai   ket(tin)  tu nuot  sai luat  xe chong");
let bad = 0;
for (const id of LIST) {
  if (trace) console.log(`-- level ${id}`);
  const r = run(id, { trace });
  // Be tac qua 3 giay la loi: nguoi choi nhin thay xe trong, ray day cat, khong gi chui vao.
  // ⚠ Cot "ket" chi de THAM KHAO, khong tinh dat/truot: theo luat goc, mot xe rong han
  // khong nhan gi la DUNG, va chinh sach cham ngo nghech cua thuoc do nay cung tu lam ket.
  const ok = r.intake >= 0.75 && r.counterErr === 0 && r.selfEat === 0 && r.lawErr === 0 && r.overlap === 0 && r.fit >= 0.28;
  if (!ok) bad++;
  console.log(
    String(r.id).padStart(4) + "  " + r.state.padEnd(6) +
    String(r.taps).padStart(4) + "  " + String(r.peak).padStart(3) + "/" +
    String(r.slotCount).padEnd(3) + "  " + String(r.perBlock).padStart(6) + "  " +
    (r.intake * 100).toFixed(1).padStart(6) + "%  " +
    (r.hit + "/" + r.miss).padStart(10) + "  " +
    (r.counterErr ? `${r.counterErr} khung/${r.worstErr}` : "0").padStart(11) + "  " +
    (r.stallS > 0.01 ? r.stallS.toFixed(1) + "s" : "-").padStart(8) + "  " +
    String(r.selfEat || "-").padStart(6) + "  " +
    String(r.lawErr || "-").padStart(7) + "  " +
    String(r.overlap || "-").padStart(8) + "  " +
    (r.fit < 0.999 ? r.fit.toFixed(2) : "-").padStart(6) +
    (ok ? "" : "   <-- CHUA DAT"));
}
console.log(bad ? `\n${bad}/${LIST.length} level chua dat.` : `\n${LIST.length}/${LIST.length} level dat.`);
process.exit(bad ? 1 : 0);
