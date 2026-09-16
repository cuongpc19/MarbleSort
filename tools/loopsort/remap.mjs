// Ghep lai level: GIU DO KHO cua level goc, THAY HINH RAY bang hinh cua mot level khac.
//
// Y tuong (lenh chu du an 2026-09-13): "chon random level design bat ky roi apply len level
// day (vi du lay level 99 apply vao level 5). Dua vao so luong khay cua level 5 hien tai, ma
// them bot khay cho hop ly."
//
// ⚠ VI SAO CACH NAY DUNG HON BO SINH LEVEL. `levelgen.mjs` tu ve ray tu dau, va no hong o
// dung cho khong ai ngo: ray no sinh ra RONG GAP DOI ray cua ho (22-48 don vi so voi 20-25),
// nen camera phai lui xa gap doi va khay/vali tren man hinh be di mot nua. Hinh ray cua ho la
// thu da duoc chinh tay qua 1299 level - muon hoc thi muon hinh, dung ve lai.
//
// ⚠ THU TU MAU TRONG KHAY LA CUA MINH, KHONG CHEP. Lenh chu du an 2026-09-16: "tu xao thu tu
// mau la du". Ban dau file nay giu NGUYEN ColorData cua ho va chi doi ten mau - tuc bai toan
// nguoi choi giai van la bai toan cua ho tung o mot. Gio moi level XAO LAI mau giua cac o:
//   - giu so khoi moi khay (khay dai bao nhieu van dai bay nhieu),
//   - giu SO LUONG moi mau - bat buoc, vi DELIVER = 4: mot mau khong chia het cho 4 la mot
//     ban KHONG THANG DUOC, va khong gi tren man hinh noi ra dieu do,
//   - giu vi tri khoi an "?" (hau to _H o lai o cua no, chi phan mau doi).
// Xao ngau nhien thi do kho troi di, nen thu nhieu cach xao va cho bot chon cach GAN BAN GOC
// NHAT - dung cai luat da dung de chon ray. Cai con lay tu ban goc chi la cac CON SO do kho
// (so khay, so mau, SlotCount) va hinh ray muon.
// ⚠ remap.json KHONG duoc ghi khuon xep cua ban goc. No nam trong data/ va di theo ban build,
// nen ghi khuon cu vao do la dua lai dung cai vua bo di. Chi ghi khuon MOI.
//
//   node tools/loopsort/remap.mjs --to 20
//   node tools/loopsort/remap.mjs --to 20 --shuffles 6 --rails 3
//   node tools/loopsort/remap.mjs --to 20 --no-shuffle      # hanh vi cu: giu thu tu cua ho
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { useData, rate, seed, playOnce } from "./levelbot.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ORIG = path.resolve(HERE, "../../Manythings/LoopSort-teardown/data");
const OUT = path.join(HERE, "data");

const arg = (n, d) => {
  const i = process.argv.indexOf("--" + n);
  return i < 0 ? d : (process.argv[i + 1] ?? true);
};
const TO = Number(arg("to", 20));
const TRIES = Number(arg("tries", 40));
const RECOLOR = process.argv.indexOf("--no-recolor") < 0;
const SHUFFLE = process.argv.indexOf("--no-shuffle") < 0;
const SHUFFLES = Number(arg("shuffles", 6));   // so cach xao dem cho bot thu
const RAILS = Number(arg("rails", 3));         // so hinh ray sat co chuan nhat dem cho bot thu
// Mot cach xao phai doi mau it nhat chung nay phan o so voi ban goc, neu khong thi coi nhu
// chua xao. Xao ngau nhien gan nhu luon vuot xa nguong nay; no o day de chan truong hop suy
// bien (level it mau, khay ngan) ma ban xao tinh co gan trung ban cu.
const MIN_CHANGED = 0.5;
// `--only 66,74,85` dung lai RIENG may level do va GHEP vao bo dang co, giu nguyen moi level khac.
const ONLY = arg("only", null) ? String(arg("only")).split(",").map(Number) : null;
const IDS = ONLY || Array.from({ length: TO }, (_, i) => i + 1);
// ⚠ Moi level di ra phai CO DUONG THANG da tim thay, khong chi "gan do kho ban goc". Bot la tat
// dinh, nen bot thua 0% khong noi duoc ban co con thang duoc hay khong - phai cho no choi lech
// ngau nhien (slip) nhieu van. Do tren bo 100 level dau tien: 3 level (66, 74, 85) khong tim
// duoc duong thang sau 30 van, trong do 85 BAN GOC thi co. Dua len cho nguoi choi mot ban co co
// the khong thang duoc la loi te nhat cua ca he thong nay - nguoi choi khong phan biet duoc voi
// loi cua chinh ho. Tat bang --no-winnable.
const WINNABLE = process.argv.indexOf("--no-winnable") < 0;
const WIN_TRIES = Number(arg("win-tries", 10));   // so van moi muc slip khi tim duong thang
function findWin(id) {
  for (const slip of [0, 0.15, 0.3, 0.5])
    for (let k = 0; k < (slip ? WIN_TRIES : 1); k++)
      if (playOnce(E, id, 5000 + id * 131 + k * 977 + Math.round(slip * 100), slip).win) return true;
  return false;
}

// ⚠ Nguong hinh hoc. Ban goc TU NO cung truot nhieu cho (do duoc fit 0.64 o level 104, tuc
// engine phai co ca dan xe con 64% cho khoi de nhau) - nen day la nguong de bo MOI sach hon
// ban goc, khong phai de bat chuoc no.
// ⚠ Co chuan cua khung ban, tinh bang don vi the gioi. Co khay tren man hinh = 1/khung ban,
// nen day CHINH LA nut chinh "khay to hay be" - va giu no co dinh la cach duy nhat de moi level
// nhin bang nhau. 42 la trung vi cua nhung hinh ray cua ho ma minh dung duoc.
// ⚠ 42 la so DAU TIEN thu, va no qua to: do lai 20 level cua ho thi span cua chinh ho nam
// 17,8-45,7, phan lon quanh 35-39. Dat 42 tuc la ban co RONG HON ban goc, ma co khay tren man
// hinh = 1/khung ban, nen khay cua minh be hon khay cua ho ~15% - nhin canh nhau thay ngay.
// Ha xuong thi khay to len, nhung level nhieu khay se khong con cho: do la tran duoi that su,
// khong phai so cam tinh, nen no la mot co de chinh chu khong phai hang so chet.
const TARGET_SPAN = Number(arg("span", 38.5));
const FRAME_AR = 0.72;      // be ngang / chieu cao cua khung choi (may dien thoai dung)

const MIN_FIT = 0.995;      // 1.0 = khong co cap xe nao de nhau
const MAX_SKEW = 12;        // do lech mieng ben so voi huong toi ray
const DIST = [1.5, 5.2];    // khoang cach tu diem do toi tim ray

const rnd = (s) => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;

// ⚠ Doc/ghi chuoi Spline o TOA DO THO, khong doi dau y. parseSpline cua engine doi dau khi
// dung; o day ta chi cat va dan lai nguyen van, nen vong doc-ghi la dong nhat tuyet doi.
function splitSpline(s) {
  const verts = [], docks = [], other = [];
  for (const raw of s.split(":")) {
    const p = raw.split(";");
    const head = p[0].split("\n");
    const name = head[0].trim();
    const rot = head.length > 1 ? head[1].trim() : null;
    const rec = { name, rot, x: +p[1], y: +p[2], raw };
    if (/^[0-9]/.test(name) && !/^[A-Z]/.test(name)) verts.push({ ...rec, idx: +name.match(/^([0-9]+)/)[1] });
    else if (/^[A-Z]$/.test(name) && name !== "Q" && name !== "Y" && name !== "Z") docks.push(rec);
    else other.push(raw);
  }
  verts.sort((a, b) => a.idx - b.idx);
  return { verts, docks, other };
}

function joinSpline(verts, docks, other) {
  const out = verts.map((v, i) => `${i + 1};${v.x};${v.y}`);
  for (const d of docks) out.push(`${d.name}${d.rot === null ? "" : "\n" + d.rot};${d.x};${d.y}`);
  return out.concat(other).join(":");
}

// Chon `need` ben TRAI DEU quanh vong, khong lay `need` cai dau tien: lay dau danh sach thi
// moi ben don ve mot goc va nua vong ray khong co gi ca.
function spread(docks, need, cx, cy) {
  const byAngle = docks.slice().sort((a, b) =>
    Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  if (need >= byAngle.length) return byAngle;
  const out = [];
  for (let i = 0; i < need; i++) out.push(byAngle[Math.round((i * byAngle.length) / need) % byAngle.length]);
  return out;
}

// Xao mau giua MOI o cua level. Tra ve lanes moi (cung dang voi lanesOf) va ti le o bi doi mau.
function shuffleLanes(lanes, rng) {
  const slots = [];
  lanes.forEach((l, li) => l.slice(1).forEach((tok, k) => {
    const [col, ...rest] = tok.split("_");
    slots.push({ li, k, col, rest });
  }));
  const cols = slots.map((x) => x.col);
  let best = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const c = cols.slice();
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    const changed = c.filter((v, i) => v !== cols[i]).length / c.length;
    if (!best || changed > best.changed) best = { c, changed };
    if (changed >= MIN_CHANGED) break;
  }
  const out = lanes.map((l) => [l[0], ...l.slice(1)]);
  slots.forEach((x, i) => {
    out[x.li][x.k + 1] = best.c[i] + (x.rest.length ? "_" + x.rest.join("_") : "");
  });
  return { lanes: out, changed: best.changed };
}

function lanesOf(colorData) {
  return colorData.split(":").map((s) => s.split(";").map((t) => t.trim()).filter(Boolean))
    .filter((p) => p.length > 1);
}

// ---------------------------------------------------------------- chay

await useData(ORIG);
const E = await import("./loopsort.js");
await E.loadData();

const rawLevels = JSON.parse(await readFile(path.join(ORIG, "Levels.json"), "utf8"));
const rawCarriers = JSON.parse(await readFile(path.join(ORIG, "Carriers.json"), "utf8"));
const rawSplines = JSON.parse(await readFile(path.join(ORIG, "Splines.json"), "utf8"));
const areas = JSON.parse(await readFile(path.join(ORIG, "Areas.json"), "utf8"));
const splineById = new Map(rawSplines.map((s) => [s.Id, s]));
const carrierById = new Map(rawCarriers.map((c) => [c.Id, c]));

// Kho hinh ray: moi spline kem so ben cua no, de biet cai nao du cho.
const donors = rawSplines.map((s) => ({ s, n: splitSpline(s.Spline).docks.length }))
  .filter((d) => d.n >= 2);
console.log(`kho hinh ray: ${donors.length} hinh, nhieu ben nhat ${Math.max(...donors.map((d) => d.n))}`);

// ⚠ DO DO KHO CUA BAN GOC TRUOC, khi chua dong vao gi. Ban dau cho ghep bang luat "bot phai
// thang" - va do la mot cai bay: no khong giu do kho, no LOC LAY RAY DE. Do duoc bo ghep thang
// 100% trong khi ban goc 55%, tuc la da lam de di ca mot bo level ma van tuong la giu nguyen.
// Dung luat moi: chon hinh ray nao cho ket qua GAN BAN GOC NHAT, khong phai hinh nao de nhat.
//
// ⚠ Phai do het truoc vong sua, vi nhieu level dung CHUNG carrier - sua ColorData cho level 5
// la sua luon so do cua level 9 neu hai cai chung carrier.
const SPANS = process.argv.indexOf("--spans") >= 0;
const RUNS = Number(arg("runs", 3));
const base = new Map();
if (!SPANS)
for (const id of IDS) {
  if (!E.LEVELS[id]) continue;
  seed(id * 31 + 7);
  const r = rate(E, id, RUNS);
  base.set(id, { win: r.win, taps: r.taps });
}
console.log(`do ban goc ${ONLY ? ONLY.join(",") : "1-" + TO}: thang trung binh ` +
  `${(100 * [...base.values()].reduce((a, b) => a + b.win, 0) / base.size).toFixed(0)}%`);

const PAL = Object.keys(E.PALETTE);
const outLevels = [], outCarriers = [], outSplines = [], manifest = [];
let nextId = 1;

for (const id of IDS) {
  const src = rawLevels.find((x) => x.Id === id);
  if (!src) { console.log(`lv ${id}: ban goc khong co`); continue; }
  const srcCarrier = carrierById.get(src.Carriers);
  const lanes = lanesOf(srcCarrier.ColorData);
  const need = lanes.length;
  const blocks = lanes.flatMap((l) => l.slice(1));
  const colors = [...new Set(blocks.map((b) => b.split("_")[0]))];

  // Doi bang mau: giu NGUYEN cach xep (khay nao, o thu may, cung mau voi o nao), chi thay
  // mau that. Do kho khong doi mot ti nao vi bai toan la quan he giua cac o, khong phai mau.
  const rng = rnd(id * 7919 + 13);
  let map = null;
  if (RECOLOR) {
    const pool = PAL.slice().filter((c) => c !== "GR");
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    map = Object.fromEntries(colors.map((c, i) => [c, pool[i % pool.length]]));
  }
  const toData = (ls) => ls.map((l) => [l[0], ...l.slice(1).map((tok) => {
    const [c, ...rest] = tok.split("_");
    return (map ? map[c] || c : c) + (rest.length ? "_" + rest.join("_") : "");
  })].join(";")).join(":");
  // Cac cach xao dem thu. Khong xao thi chi co mot "cach": thu tu goc.
  const shuffles = SHUFFLE
    ? Array.from({ length: SHUFFLES }, () => shuffleLanes(lanes, rng))
    : [{ lanes, changed: 0 }];
  for (const sh of shuffles) sh.colorData = toData(sh.lanes);
  // Hinh hoc khong phu thuoc mau (so khay va so khoi moi khay giu nguyen), nen kiem bang cach dau.
  const colorData = shuffles[0].colorData;

  // Thu cac hinh ray cho den khi mot cai qua duoc ca hinh hoc lan con bot.
  const order = donors.slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  // ⚠ HAI VONG, khong phai mot. Vong dau chi kiem HINH HOC (re) va GOM candidate; vong sau moi
  // cho bot choi (dat). Lay ngay cai dau tien qua duoc hinh hoc thi khung ban co nam dau cung
  // duoc - va do chinh la cai lam "khay be ti o level nay, to o level kia": co khay tren man
  // hinh la 1/khung ban, nen khung ban phai gan MOT co chuan thi moi level moi bang nhau.
  const cands = []; let lastWhy = "";
  for (const d of order.slice(0, TRIES)) {
    if (d.s.Id === src.Spline) continue;         // phai KHAC hinh cu, neu khong thi ghep lam gi
    if (d.n < need) continue;                    // it ben hon nhu cau -> bo, khong bia them cho
    const { verts, docks, other } = splitSpline(d.s.Spline);
    const cx = verts.reduce((a, v) => a + v.x, 0) / verts.length;
    const cy = verts.reduce((a, v) => a + v.y, 0) / verts.length;
    const chosen = spread(docks, need, cx, cy)
      .map((dk, k) => ({ ...dk, name: lanes[k][0] }));   // gan lai chu cai theo lane cua level

    const sid = 90000 + id;                       // id tam, chi song trong bo nho de kiem
    E.SPLINES[sid] = { ...d.s, Id: sid, Spline: joinSpline(verts, chosen, other) };
    E.CARRIERS[src.Carriers].ColorData = colorData;
    const keepSp = E.LEVELS[id].Spline;
    E.LEVELS[id].Spline = sid;

    let g = null, ok = true, why = "";
    try { g = new E.Game(id); } catch (err) { ok = false; why = "dung bàn hỏng: " + err.message; }
    if (ok && g.trucks.length !== need) { ok = false; why = "thiếu bến"; }
    if (ok && g.fit < MIN_FIT) { ok = false; why = `xe chồng (fit ${g.fit.toFixed(2)})`; }
    if (ok && g.railSlots < g.slotCount) { ok = false; why = "ray ngắn hơn số chỗ"; }
    if (ok) for (const t of g.trucks) {
      const vx = t.px - t.x, vy = t.py - t.y, L = Math.hypot(vx, vy) || 1;
      const ang = Math.acos(Math.max(-1, Math.min(1, (t.mx * vx + t.my * vy) / L))) * 180 / Math.PI;
      if (ang > MAX_SKEW) { ok = false; why = `bến lệch ${ang.toFixed(0)}°`; break; }
      if (L < DIST[0] || L > DIST[1]) { ok = false; why = `bến cách ray ${L.toFixed(1)}`; break; }
    }
    if (ok) {
      const b = g.bounds;
      // Canh nao rang buoc camera: be ngang chia ti le khung hinh, hay chieu cao.
      const span = Math.max((b.x1 - b.x0) / FRAME_AR, b.y1 - b.y0);
      cands.push({ spline: E.SPLINES[sid], donor: d.s.Id, bbox: b, fit: g.fit, span });
    } else lastWhy = why;
    E.LEVELS[id].Spline = keepSp;
    delete E.SPLINES[sid];
  }

  // ⚠ `--spans` chi BAO CAO khung ban nho nhat ma level nay dat duoc, roi di tiep. Dung de
  // chon `TARGET_SPAN` bang so do thay vi doan: co khay = 1/khung ban, nen tran duoi cua ca bo
  // la level CHAT NHAT (nhieu khay nhat) chu khong phai level trung binh. Khong chay bot o day
  // vi bot la phan dat nhat va cau hoi nay khong can toi no.
  if (SPANS) {
    const s = cands.map((c) => c.span).sort((a, b) => a - b);
    console.log(`lv ${String(id).padStart(2)}: ${need} khay · ${cands.length} ung vien · ` +
      `span nho nhat ${s[0]?.toFixed(1) ?? "-"} · trung vi ${s[s.length >> 1]?.toFixed(1) ?? "-"}`);
    continue;
  }

  // ⚠ Con bot chay SAU cung: no dat nhat, va mot ban co xe chong nhau van thang duoc nen bot
  // khong bao gio bao cho biet dieu do. Chi cho 8 ung vien SAT CO CHUAN nhat duoc choi.
  let won = null;
  const want = base.get(id) || { win: 1, taps: 30 };
  cands.sort((a, z) => Math.abs(a.span - TARGET_SPAN) - Math.abs(z.span - TARGET_SPAN));
  // ⚠ Thu TICH cach xao x hinh ray, khong thu rieng tung truc. Do kho la cua ca ban co, va mot
  // cach xao de tren ray nay co the kho tren ray kia. It ray hon truoc (RAILS thay vi 8) de
  // tong so van choi khong phinh qua.
  const scored = [];
  for (const c of cands.slice(0, SHUFFLE ? RAILS : 8))
    for (const sh of shuffles) {
      const sid = 90000 + id;
      E.SPLINES[sid] = c.spline;
      E.CARRIERS[src.Carriers].ColorData = sh.colorData;
      const keepSp = E.LEVELS[id].Spline;
      E.LEVELS[id].Spline = sid;
      seed(id * 31 + 7);
      const r = rate(E, id, RUNS);
      // Lech ti le thang la chinh; so cu cham la phu, no bat duoc "cung thang nhung mot ben phai
      // vat va gap ruoi" - thu ma mot con so thang/thua khong bao gio noi ra.
      const cost = Math.abs(r.win - want.win) * 2 + Math.abs(r.taps - want.taps) / Math.max(8, want.taps);
      scored.push({ ...c, sh, win: r.win, taps: r.taps, cost });
      E.LEVELS[id].Spline = keepSp;
      delete E.SPLINES[sid];
    }
  scored.sort((a, z) => a.cost - z.cost);
  won = scored[0] || null;
  // Lay to hop GAN BAN GOC NHAT trong so nhung to hop tim duoc duong thang.
  if (WINNABLE && won) {
    won = null;
    for (const c of scored) {
      const sid = 90000 + id;
      E.SPLINES[sid] = c.spline;
      E.CARRIERS[src.Carriers].ColorData = c.sh.colorData;
      const keepSp = E.LEVELS[id].Spline;
      E.LEVELS[id].Spline = sid;
      const ok = findWin(id);
      E.LEVELS[id].Spline = keepSp;
      delete E.SPLINES[sid];
      if (ok) { won = c; won.winnable = true; break; }
    }
    if (!won) {
      won = scored[0]; won.winnable = false;
      console.log(`lv ${id}: ⚠ KHONG to hop nao tim duoc duong thang - giu to hop gan goc nhat`);
    }
  }

  if (!won) {
    console.log(`lv ${id}: khong tim duoc hinh (${lastWhy || "het lua chon"})`);
    if (ONLY) throw new Error(`--only: level ${id} khong dung lai duoc, khong ghi gi`);
    continue;
  }

  const cid = nextId, spid = nextId; nextId++;
  outLevels.push({ ...src, Carriers: cid, Spline: spid });
  outCarriers.push({ ColorData: won.sh.colorData, Features: "-", Colors: null, Id: cid });
  outSplines.push({ ...won.spline, Id: spid });
  const b = won.bbox;
  // ⚠ "Cach sap xep moi mau trong khay" ghi thanh KHUON, khong ghi mau that: mau nao nam o
  // dau chi la ten goi, cai quyet dinh do kho la QUAN HE - o nao cung mau voi o nao, va cung
  // mau do con nam o khay nao nua. Ghi khuon thi so lieu nay van doc duoc sau khi doi bang mau,
  // va doi chieu duoc voi bat ky level nao khac.
  const seen = new Map();
  const shape = won.sh.lanes.map((l) => l.slice(1).map((tok) => {
    const c = tok.split("_")[0];
    if (!seen.has(c)) seen.set(c, String.fromCharCode(97 + seen.size));
    return seen.get(c) + (/_H/.test(tok) ? "?" : "");
  }).join(""));

  manifest.push({
    level: id, lanes: need, colors: colors.length, blocks: blocks.length,
    slot: src.SlotCount, shape, shuffled: SHUFFLE, changed: +won.sh.changed.toFixed(2),
    winnable: won.winnable ?? null,
    donorSpline: won.donor,
    recolor: map, bbox: [+(b.x1 - b.x0).toFixed(1), +(b.y1 - b.y0).toFixed(1)],
  });
  console.log(`lv ${id}: ${need} khay · ${colors.length} mau · ${blocks.length} khoi · ` +
    `ray ${won.donor} · khung ${(b.x1 - b.x0).toFixed(0)}x${(b.y1 - b.y0).toFixed(0)} · ` +
    `xao ${(100 * won.sh.changed).toFixed(0)}% o · ` +
    `bot ${(100 * won.win).toFixed(0)}% (gốc ${(100 * want.win).toFixed(0)}%) · ` +
    `chạm ${won.taps.toFixed(0)} (gốc ${want.taps.toFixed(0)})`);
}

// ⚠ `--dry` de do THU mot gia tri span xem co level nao khong dat, ma khong ghi de bo dang
// dung. Khong co no thi moi lan do la mot lan mat bo cu, va anh chup mau vua gui thanh sai.
// ⚠ `--spans` PHAI thoat o day cung voi `--dry`. Thieu no mot lan roi: che do bao cao chay
// xong, khong gom level nao, va van roi xuong buoc ghi - tuc la ghi de ca bo level bang bon
// file RONG. Mot che do "chi doc" ma van di qua duong ghi thi no khong con la chi doc.
if (SPANS || process.argv.indexOf("--dry") >= 0) {
  console.log(`\n[--dry] khong ghi gi. ${outLevels.length}/${IDS.length} level dat span ${TARGET_SPAN}.`);
  process.exit(outLevels.length === IDS.length ? 0 : 1);
}

await mkdir(OUT, { recursive: true });
// `--only`: GHEP vao bo dang co. Level dung lai giu nguyen so Id carrier/spline cua no, nen
// khong dong vao bat ky level nao khac.
if (ONLY) {
  const rd = async (f) => JSON.parse(await readFile(path.join(OUT, f), "utf8"));
  const [curL, curC, curS, curM] = await Promise.all(
    ["Levels.json", "Carriers.json", "Splines.json", "remap.json"].map(rd));
  outLevels.forEach((lv, i) => {
    const old = curL.find((x) => x.Id === lv.Id);
    if (!old) throw new Error(`--only: bo hien tai khong co level ${lv.Id}`);
    const ci = curC.findIndex((x) => x.Id === old.Carriers);
    const si = curS.findIndex((x) => x.Id === old.Spline);
    curC[ci] = { ...outCarriers[i], Id: old.Carriers };
    curS[si] = { ...outSplines[i], Id: old.Spline };
    const mi = curM.findIndex((x) => x.level === lv.Id);
    curM[mi] = manifest[i];
  });
  outLevels.length = 0; outLevels.push(...curL);
  outCarriers.length = 0; outCarriers.push(...curC);
  outSplines.length = 0; outSplines.push(...curS);
  manifest.length = 0; manifest.push(...curM);
}
await writeFile(path.join(OUT, "Levels.json"), JSON.stringify(outLevels));
await writeFile(path.join(OUT, "Carriers.json"), JSON.stringify(outCarriers));
await writeFile(path.join(OUT, "Splines.json"), JSON.stringify(outSplines));
await writeFile(path.join(OUT, "Areas.json"), JSON.stringify(areas));
await writeFile(path.join(OUT, "remap.json"), JSON.stringify(manifest, null, 1));
console.log(`\nda ghi ${outLevels.length} level vao ${OUT}` + (ONLY ? ` (dung lai ${ONLY.join(",")})` : ""));
