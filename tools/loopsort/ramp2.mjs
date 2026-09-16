// Vali di ra co bam dung CAI CAU MA BO VE DANG VE khong, va no di co nhip nhang khong.
//
// ⚠ Hai thu nay phai do RIENG voi luat. headless.mjs bao 10/10 trong suot ca quang thoi gian
// vali bay xien khoi cau toi 24 don vi va co vali treo hang chuc giay - luat khong he sai, chi
// co duong di la sai. Muon thay thi phai do duong di.
//
// ⚠ Chi tinh nhung khung vali DA RA KHOI LONG XE (`c.way` het moc) va CHUA nhap ray. Tinh ca
// luc con trong long xe thi con so vo nghia: luc do vali dang di doc truc than xe, no cach cai
// cau bao nhieu la chuyen binh thuong.
//
//   node ramp2.mjs                 # do tren data/ , tuc bo level dang ship
//   LS_DATA=<duong dan> node ramp2.mjs
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(HERE, process.env.LS_DATA || "./data/");
globalThis.fetch = async (u) => ({
  json: async () => JSON.parse((await readFile(path.join(DATA, path.basename(String(u))))).toString()),
});
const E = await import("./loopsort.js");
await E.loadData();
let sd = 1;
Math.random = () => (sd = (sd * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const LEVELS = process.env.LS_LEVELS
  ? process.env.LS_LEVELS.split(",").map(Number)
  : [1, 2, 3, 4, 5, 8, 9, 10, 11, 25, 26, 52, 59, 60, 61, 80, 120, 333, 400, 1299].filter((n) => E.LEVELS[n]);

const lech = [], dToc = [], dHuong = [], flyToc = [], flyHuong = [];
let worst = 0, worstAt = "";
for (const lv of LEVELS) {
  const g = new E.Game(lv);
  let now = 0;
  const truoc = new Map(), truocBay = new Map();
  for (let i = 0; i < 60 * 30 && g.state === "play"; i++) {
    if (i % 50 === 0) {
      const t = g.trucks.find((x) => !x.gone && x.blocks.length && g.canTap(x));
      if (t) g.tap(t);
    }
    now += 1000 / 60;
    g.step(1 / 60, now);

    for (const c of g.cubes) {
      const p = truoc.get(c);
      const v = Math.hypot(c.vx, c.vy);
      if (p) {
        dToc.push(Math.abs(v - p.v));
        let d = Math.abs(c.rot - p.rot);
        if (d > Math.PI) d = 2 * Math.PI - d;
        dHuong.push((d * 180) / Math.PI);
      }
      truoc.set(c, { v, rot: c.rot });
      if (c.landed || !c.src || (c.way && c.way.length)) continue;
      const t = c.src, ax = t.px - t.x, ay = t.py - t.y, L2 = ax * ax + ay * ay || 1;
      let u = ((c.x - t.x) * ax + (c.y - t.y) * ay) / L2;
      u = Math.max(0, Math.min(1, u));
      const d = Math.hypot(c.x - (t.x + ax * u), c.y - (t.y + ay * u));
      lech.push(d);
      if (d > worst) { worst = d; worstAt = "lv" + lv + " lane" + t.lane; }
    }
    // Cu bay vao xe: do qua chinh flyPos() ma hai bo ve deu goi.
    for (const f of g.flying) {
      const k = Math.max(0, Math.min(1, (g.now - f.at) / f.ms));
      const cur = E.flyPos(f, k);
      const p = truocBay.get(f);
      if (p) {
        flyToc.push(Math.hypot(cur.x - p.x, cur.y - p.y) * 60);
        let d = Math.abs(cur.rot - p.rot);
        if (d > Math.PI) d = 2 * Math.PI - d;
        flyHuong.push((d * 180) / Math.PI);
      }
      truocBay.set(f, cur);
    }
  }
}
const q = (a, p) => (a.length ? a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))] : 0);
const row = (ten, a, dv) =>
  console.log("  " + ten.padEnd(34) + "p50 " + q(a, 0.5).toFixed(2).padStart(7) +
              "   p99 " + q(a, 0.99).toFixed(2).padStart(7) +
              "   max " + q(a, 1).toFixed(2).padStart(7) + "  " + dv);

console.log("QUET " + LEVELS.length + " LEVEL   (" + DATA + ")");
console.log("VALI DANG RA KHAY / TREN RAY  (" + dToc.length + " mau)");
row("doi toc do moi khung", dToc, "dv/giay");
row("doi huong moi khung", dHuong, "do");
console.log("  so cu quay > 45 do: " + dHuong.filter((x) => x > 45).length);
console.log("VALI DANG TREN CAU  (" + lech.length + " mau)");
row("lech khoi cau duoc ve", lech, "dv   (than vali rong 1.22)");
console.log("  lech nhat o " + worstAt);
console.log("VALI DANG BAY VAO XE  (" + flyToc.length + " mau)");
row("toc do", flyToc, "dv/giay");
row("doi huong moi khung", flyHuong, "do");
