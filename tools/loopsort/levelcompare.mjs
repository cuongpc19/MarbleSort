// Doi chieu do kho: bo level cua MINH so voi bo level goc, tren cung mot thuoc do.
//
// ⚠ Day la phep nghiem thu cua ca viec thiet ke lai level. "Kho y nhu ban cu" chi co nghia
// khi hai bo cung di qua mot con bot, cung so van, cung cach gieo. Doc mot bang so cua bo
// nay roi nho lai bang so cua bo kia la cach chac chan nhat de tu lua minh.
//
//   node tools/loopsort/levelcompare.mjs
//   node tools/loopsort/levelcompare.mjs --runs 2
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i < 0 ? d : process.argv[i + 1]; };
const RUNS = Number(arg("runs", 1));

// Lay mau tung dai 15 level, trai deu ca ladder.
const BANDS = [[1, 15], [16, 30], [51, 65], [101, 115], [151, 165], [251, 265],
               [401, 415], [601, 615], [801, 815], [1001, 1015], [1201, 1215], [1285, 1299]];

const lanesOf = (cd) => cd.split(":").map((s) => s.trim().split(";").map((t) => t.trim()).filter(Boolean))
                          .filter((p) => p.length > 1);

async function measure(dir) {
  // ⚠ Moi bo phai duoc do trong MOT TIEN TRINH RIENG: loopsort.js giu LEVELS/CARRIERS/SPLINES
  // o pham vi module, nen goi loadData lan hai trong cung tien trinh chi ghi de - nhung cac
  // Game da dung roi thi khong. An toan hon la chay rieng, va no cung nhanh ngang nhau.
  const { useData, rate } = await import("./levelbot.mjs");
  await useData(dir);
  const E = await import("./loopsort.js");
  await E.loadData();
  const out = [];
  for (const [a, b] of BANDS) {
    let win = 0, peak = 0, taps = 0, lanes = 0, trucks = 0, colors = 0, slot = 0, n = 0;
    for (let id = a; id <= b; id++) {
      if (!E.LEVELS[id]) continue;
      const r = rate(E, id, RUNS);
      const lv = E.LEVELS[id];
      const ls = lanesOf(E.CARRIERS[lv.Carriers].ColorData);
      const blocks = ls.flatMap((x) => x.slice(1));
      win += r.win; peak += r.peak; taps += r.taps; n++;
      lanes += ls.length; trucks += blocks.length; slot += lv.SlotCount;
      colors += new Set(blocks.map((x) => x.split("_")[0])).size;
    }
    out.push({ a, b, win: win / n, peak: peak / n, taps: taps / n,
               lanes: lanes / n, trucks: trucks / n, colors: colors / n, slot: slot / n });
  }
  return out;
}

const dir = process.argv[2];
const rows = await measure(dir === "orig" ? path.resolve(HERE, "../../Manythings/LoopSort-teardown/data") : path.join(HERE, "data"));
console.log(JSON.stringify(rows));
