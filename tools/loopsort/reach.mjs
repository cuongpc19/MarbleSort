// Moi vali roi khay PHAI nhap duoc ray. Day la phep nghiem thu hinh hoc, khong phai phep do luat.
//
// ⚠ Vi sao no phai la phep nghiem thu BAT BUOC chu khong phai mot lan kiem: duong di tu khay ra
// ray la mot bo lai (xem khuc `!c.landed` trong physics), va mot bo lai thi co the KHONG HOI TU
// tren mot hinh ray la. Da gap du nam kieu treo vinh vien, moi kieu deu chi lo ra tren dung mot
// hinh: vali bi day dat roi vat nhau voi bang chuyen (68 giay), vali bi vach chan keo ngang o
// ben nam xa ray, va nang nhat la cai test "con tren cau chua" rung ngay tai nguong lam van toc
// lat qua lat lai moi nua buoc (43 giay). Khong cai nao lam sai LUAT ca - headless.mjs van bao
// 10/10 - nen chi co phep do nay moi thay.
//
//   node reach.mjs                 # do tren data/ , tuc bo level dang ship
//   LS_DATA=<duong dan> node reach.mjs
//   LS_LEVELS=1,2,9,60 node reach.mjs
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

// ⚠ Gieo lai Math.random: engine dung no o vai cho (confetti), va mot phep do khong lap lai duoc
// thi khong dung de so sanh truoc/sau.
let sd = 1;
Math.random = () => (sd = (sd * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const LEVELS = process.env.LS_LEVELS
  ? process.env.LS_LEVELS.split(",").map(Number)
  : [1, 2, 3, 4, 5, 8, 9, 10, 11, 25, 26, 52, 59, 60, 61, 80, 120, 333, 400, 1299].filter((n) => E.LEVELS[n]);

const SLOW = 90;        // 1.5 giay - qua nguong nay thi dang le the, chua chac la loi
const STUCK = 60 * 8;   // 8 giay - qua nguong nay thi coi nhu treo han

let tot = 0, slow = 0, stuck = 0, worst = 0, worstAt = "";
const hong = [];
for (const lv of LEVELS) {
  const g = new E.Game(lv);
  const age = new Map();
  let now = 0;
  for (let i = 0; i < 60 * 60 && g.state === "play"; i++) {
    // Cham mot vali bat ky moi 50 khung: can HANG CHAY RA, khong can choi gioi.
    if (i % 50 === 0) {
      const t = g.trucks.find((x) => !x.gone && x.blocks.length && g.canTap(x));
      if (t) g.tap(t);
    }
    now += 1000 / 60;
    g.step(1 / 60, now);
    for (const c of g.cubes) {
      if (c.landed) {
        if (age.has(c)) {
          const a = age.get(c);
          tot++;
          if (a > SLOW) slow++;
          if (a > worst) { worst = a; worstAt = "lv" + lv + " lane" + (c.src ? c.src.lane : "?"); }
          age.delete(c);
        }
        continue;
      }
      age.set(c, (age.get(c) || 0) + 1);
    }
    for (const [c] of age) if (!g.cubes.includes(c)) age.delete(c);
  }
  // Con sot lai luc het gio.
  // ⚠ KHONG duoc tinh tat ca nhung cai con sot la "treo". Vong lap dung ngay khi van ket thuc
  // (thang/thua), nen mot vali VUA SINH RA truoc do mot khung cung nam trong danh sach nay -
  // ban dau phep do nay bao 14 cho treo tren 13 level, va phan lon la nhung vali moi ra doi
  // duoc vai khung. Phai xet TUOI THAT: chi qua nguong moi tinh.
  for (const [c, a] of age) {
    tot++;
    if (a > SLOW) slow++;
    if (a > STUCK) {
      stuck++;
      const at = "lv" + lv + " lane" + (c.src ? c.src.lane : "?");
      if (!hong.includes(at)) hong.push(at);
      if (a > worst) { worst = a; worstAt = at + " KHONG BAO GIO NHAP"; }
    } else if (a > worst) { worst = a; worstAt = "lv" + lv + " (van ket thuc luc no dang bay)"; }
  }
}

console.log("QUET " + LEVELS.length + " LEVEL, " + tot + " luot vali roi khay   (" + DATA + ")");
console.log("  lau nhat: " + worst + " khung (" + (worst / 60).toFixed(2) + "s) o " + worstAt);
console.log("  qua 1.5 giay: " + slow + "      TREO HAN (qua 8 giay): " + stuck);
for (const h of hong) console.log("    treo o " + h);
if (stuck) { console.log("\nCHUA DAT - co vali khong nhap duoc ray."); process.exit(1); }
console.log("\nDat - moi vali deu nhap duoc ray.");
