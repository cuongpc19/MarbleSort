// Vo game cho ban dung lai Loop Sort: man Home, luong level, the hoan thanh / that bai,
// vi coin, phan thuong. Cau truc hoc tu Ball Sort (du an nay): mot tien to khoa rieng cho
// localStorage, kinh te va moc thanh pho lay tu chinh du lieu cua ho.
//
// Giao dien bam theo Game/UI_UX_RULES.md; so trong ngoac o cac ghi chu duoi day la so
// hieu luat trong file do.

import * as E from "./loopsort.js";
import { sound } from "./audio.js";

// ⚠ Doc tu chinh du lieu chu khong ghi cung mot con so. Bo level la do tools/loopsort/
// levelgen.mjs sinh ra; sinh thu 40 level de xem hinh la chuyen binh thuong, va luc do mot
// hang so 1299 lam `buildDemoPool` doc LEVELS[41] = undefined roi nem loi ngay tren man
// Home - tuc ca game chet vi mot chuyen dang le chi la "it level hon".
let MAX_LEVEL = 1299;
// Constants.json cua chinh ho: WinReward 10, HardLevelReward 30, SuperHardLevelReward 50,
// Revive 900 roi SecondRevive 1900.
const REWARD = { Default: 10, Hard: 30, SuperHard: 50 };
const REVIVE = [900, 1900];
// (2.8) Nhan do kho: chi Hard/SuperHard moi co nhan. 1042/1299 level la Default va khong
// deo gi ca - nhan dan len moi man thi khong con la thong tin.
const TAG = { Hard: "KHÓ", SuperHard: "SIÊU KHÓ" };

// ⚠ Mot dinh nghia artwork cho ca hai noi dung no: thanh booster duoi man choi va bang
// "cach go" tren the RAY TAC (3.4 - panel phai tro vao dung nhung nut nguoi choi da
// quen). Hai ban sao icon la hai thu se troi khoi nhau.
const SVG = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'aria-hidden="true" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
const TOY = (d) => '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
const ICON = {
  home: SVG('<path d="M3 11l9-7 9 7"/><path d="M5.5 10.2V19h13v-8.8"/><path d="M10 19v-5h4v5"/>'),
  retry: SVG('<polyline points="21 4 21 9.5 15.5 9.5"/>' +
             '<path d="M19.1 14.5A7.6 7.6 0 1 1 17.3 6.6L21 9.5"/>'),
  Undo: TOY('<path d="M12 14a16 16 0 1 1-2 23" stroke="#78509d" stroke-width="8"/><path d="M12 12a16 16 0 1 1-2 23" stroke="#fff7db" stroke-width="7"/><path d="M5 7v14h14" fill="#fff7db" stroke="#fff7db" stroke-width="3"/><path d="m17 25-5-3v12l5-3m14-6 5-3v12l-5-3" fill="#ffadc3"/><rect x="16" y="22" width="16" height="12" rx="5" fill="#f76f98"/><path d="m22 24 4 8" stroke="#fff1d5" stroke-width="4"/>'),
  Shuffle: TOY('<path d="M5 12h6c10 0 12 24 22 24h8M33 28l8 8-8 7M5 36h6c10 0 12-24 22-24h8M33 5l8 7-8 7" stroke="#bc567a" stroke-width="7"/><path d="M5 10h6c10 0 12 24 22 24h8M33 26l8 8-8 7M5 34h6c10 0 12-24 22-24h8M33 3l8 7-8 7" stroke="#fff8dc" stroke-width="5"/><circle cx="13" cy="13" r="7" fill="#ffe073"/><circle cx="33" cy="32" r="7" fill="#a1e8ce"/><path d="m10 10 3-1m17 20 3-1" stroke="#fff" stroke-width="3"/>'),
  ConveyorCapacity: TOY('<rect x="3" y="25" width="42" height="17" rx="8" fill="#426f70"/><rect x="4" y="24" width="40" height="14" rx="7" stroke="#fff2cf" stroke-width="3"/><path d="M11 30h0m9 0h0m9 0h0m9 0h0" stroke="#d7d1c2" stroke-width="5"/><circle cx="13" cy="17" r="8" fill="#ff82a3"/><path d="M9 13h4" stroke="#ffd8de" stroke-width="3"/><path d="M33 7v14m-7-7h14" stroke="#2c9479" stroke-width="8"/><path d="M33 5v14m-7-7h14" stroke="#fff9d7" stroke-width="6"/>'),
  Capacity: TOY('<path d="m5 19 19-8 19 8v22H5Z" fill="#d18d46"/><path d="M6 20h36v20H6Z" fill="#fff0c5"/><path d="m5 19 19 8 19-8-19-8Z" fill="#ffe2a0"/><path d="M24 27v13" stroke="#e9bd78" stroke-width="2"/><circle cx="16" cy="18" r="6" fill="#ff82a3"/><circle cx="29" cy="19" r="6" fill="#a78bdd"/><path d="M35 5v14m-7-7h14" stroke="#d18d46" stroke-width="8"/><path d="M35 3v14m-7-7h14" stroke="#fffbea" stroke-width="6"/>'),

};
const SOUND_ON = SVG('<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12"/>');
const SOUND_OFF = SVG('<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m17 9 5 6m0-6-5 6"/>');

// Boosters.json cua ho, nguyen van. Con mot cai nua co ten trong Localization
// ("Magic Hand" / booster_select) nhung KHONG co trong Boosters.json cua ban 3.4.1,
// nen khong dung o day.
//
// ⚠ `can(g)` la cai quyet dinh nut sang hay mo (3.5): khong dung duoc thi mo di chu dung
// de bam roi bao loi. No phai hoi DONG MOT luat ma engine dung khi tu choi, khong duoc
// doan lai - vi the Undo hoi thang `g.canUndo()` chu khong chep lai dieu kien cua no.
const BOOSTERS = [
  { id: "Undo", l: "Hoàn tác", cost: 300, free: 3, name: "Hoàn tác",
    hint: "Đưa mẻ kẹo vừa thả trở lại hộp",
    can: (g) => g.canUndo() },
  { id: "Shuffle", l: "Trộn", cost: 300, free: 3, name: "Trộn kẹo", target: true,
    hint: "Chạm khay để trộn thứ tự các hộp kẹo",
    can: (g) => g.trucks.some((t) => !t.gone && t.blocks.length > 1) },
  { id: "ConveyorCapacity", l: "Ray +1", cost: 800, free: 3, name: "Thêm 1 chỗ hộp trên ray",
    hint: "Băng chuyền chứa thêm 1 hộp kẹo",
    // ⚠ Khi ban co da chet thi mot cho khong chac du. Hoi dung cau ma ban co se hoi:
    // them mot cho co lam noi mot vali nao cham duoc tro lai khong? Neu khong thi de nut
    // mo, dung de nguoi choi tra tien roi nhin the RAY TAC van con do.
    can: (g) => g.state !== "lose" ||
      g.trucks.some((t) => !t.gone && t.blocks.length && t.drain < 0 &&
        g.counter() + g.tapLoad(t) <= g.slotCount + 1) },
  { id: "Capacity", l: "Hộp +1", cost: 900, free: 3, name: "Mở rộng khay kẹo", target: true,
    hint: "Chạm khay để thêm chỗ cho một hộp kẹo",
    can: (g) => g.trucks.some((t) => !t.gone) },
];
const BST = Object.fromEntries(BOOSTERS.map((b) => [b.id, b]));
// Hai cai go duoc the RAY TAC - Tron va O xe khong lam giam tai tren ray nen khong co mat
// trong bang "cach go" (3.3: goi y phai la thu that su go duoc, khong phai danh sach cho du).
const WAYS = ["Undo", "ConveyorCapacity"];

let armed = null;
const DEMO_TAP_MS = 2100;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

import { mountThree } from "./three3d.js";

const $ = (id) => document.getElementById(id);

// ⚠ Khong de loi nao im lang. Man Home nam san trong HTML nen no hien ra ngay ca khi
// script chet - va luc do bam PLAY khong co gi xay ra, nhin y het "nut hong". Moi loi
// phai noi thanh loi tren man hinh.
function fatal(e) {
  console.error(e);
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99;" +
    "background:#4a1030;border:1px solid #ff7ba3;color:#ffd6e2;padding:12px 14px;" +
    "border-radius:12px;font:12px/1.5 system-ui;white-space:pre-wrap";
  box.textContent = "Lỗi: " + (e && e.message ? e.message : e);
  document.body.appendChild(box);
}
addEventListener("error", (e) => fatal(e.error || e.message));
addEventListener("unhandledrejection", (e) => fatal(e.reason));

// ---------------------------------------------------------------- luu tien do
// ⚠ Tien to "ls_" rieng cho ban nay. Ball Sort da tra gia cho bai hoc nay: hai game
// dung chung tien to la dung chung o luu, va doi ten tien to sau khi phat hanh la
// xoa sach tien do cua nguoi choi.
const K = "ls_";
const num = (k, d) => { const v = +localStorage.getItem(K + k); return isFinite(v) && v ? v : d; };
const save = {
  get level() { return Math.max(1, Math.min(MAX_LEVEL, num("level", 1))); },
  set level(v) { localStorage.setItem(K + "level", Math.max(1, Math.min(MAX_LEVEL, v))); },
  get coins() { return Math.max(0, num("coins", 0)); },
  set coins(v) { localStorage.setItem(K + "coins", Math.max(0, Math.round(v))); },
  stars() { try { return JSON.parse(localStorage.getItem(K + "stars") || "{}"); } catch { return {}; } },
  setStar(lv, n) {
    const s = this.stars();
    if ((s[lv] || 0) < n) { s[lv] = n; localStorage.setItem(K + "stars", JSON.stringify(s)); }
  },
  get eager() { return localStorage.getItem(K + "eager") !== "0"; },
  set eager(v) { localStorage.setItem(K + "eager", v ? "1" : "0"); },
  bst(id) {
    const v = localStorage.getItem(K + "b_" + id);
    return v === null ? BST[id].free : Math.max(0, +v);
  },
  setBst(id, n) { localStorage.setItem(K + "b_" + id, Math.max(0, n)); },
};

// Nen man Home: chon tu chinh du lieu chu khong theo so level.
// ⚠ Khong the loc bang "level < 20" cho khoi ?: Features.json ghi HiddenTruck mo o
// level 20, nhung 1299 level dung chung 800 bo carrier nen 13 level DUOI 20 van chua
// khoi _H. Moc mo khoa la gate giao dien, khong phai bao dam ve du lieu.
let demoPool = [3];
function buildDemoPool() {
  const out = [];
  for (let i = 2; i <= MAX_LEVEL; i++) {
    const lv = E.LEVELS[i];
    const cd = E.CARRIERS[lv.Carriers].ColorData;
    if (/_H|_K_/.test(cd)) continue;
    if (!E.SPLINES[lv.Spline].Closed) continue;
    const lanes = cd.split(":").map((x) => x.trim().split(";").filter(Boolean))
                    .filter((p) => p.length > 1).length;
    if (lanes >= 3 && lanes <= 5) out.push(i);
  }
  if (out.length) demoPool = out;
}

let demo = false, carded = false, revives = 0, demoNext = 0, last = performance.now();
// ⚠ (3.1) Mot trang thai chi bao MOT lan, va co da-bao luon phai co cho go: `jamTold` bat
// khi ban co khoa lai, va tat ngay khi co mot vali cham duoc tro lai. Thieu cho go thi
// hoac ban lai moi khung hinh, hoac im luon tu lan thu hai - hai cai deu doc ra "game hong".
// ⚠ Khong con hen gio doi rieng: cai cho chinh la MOT VONG RAY trong `jammed()`.
let jamTold = false, jamOpen = false;
let audioGame = null, audioGone = 0;

// ---------------------------------------------------------------- man hinh

function coins() {
  const t = save.coins.toLocaleString("vi-VN");
  $("homeCoins").textContent = t;
  $("gameCoins").textContent = t;
}

// ⚠ Dai HUD tren va hang booster duoi la DOM, con ban co la canvas - nen canvas phai
// duoc bao chinh xac hai dai do cao bao nhieu, do thang tu phan tu that. Buoc theo mot
// ti le co dinh thi dung o may nay va sai o may co safe-area (2.7): tai tho cua dien
// thoai an mat dai tren, va ban co chay xuong duoi gam hang booster.
function syncChrome(on) {
  $(on ? "gameSound" : "homeSound").appendChild($("btnSound"));
  if (!on) { E.setChrome(0, 0); return; }
  E.setChrome($("topbar").offsetHeight, $("toolDock").offsetHeight);
}

function goHome() {
  demo = true; carded = false;
  // Home co mot van dang tu choi chay lam nen - re hon mot anh bia va khong bao gio cu.
  syncChrome(false);
  E.setGame(new E.Game(demoPool[(Math.random() * demoPool.length) | 0]));
  $("home").classList.remove("hide");
  $("chrome").classList.add("hide");
  $("cards").classList.add("hide");
  // (1.2) Nut mang so level. (1.3) Duoi logo khong co dong mo ta the loai nao ca - ten
  // thanh pho di theo NUT, vi no noi ve level sap choi chu khong ve tro choi.
  const lv = save.level;
  $("homeLv").textContent = lv;
  $("homeArea").textContent = "";
  demoNext = performance.now() + 800;
  armed = null; hint(null);
  coins(); dev();
}

function startLevel(n) {
  demo = false; carded = false; revives = 0; armed = null; hint(null);
  jamTold = false; jamOpen = false;
  n = Math.max(1, Math.min(MAX_LEVEL, n));
  save.level = n;
  $("home").classList.add("hide");
  $("chrome").classList.remove("hide");
  $("cards").classList.add("hide");
  const theme = E.LEVELS[n].Theme;
  const pill = $("levelPill");
  $("hudLv").textContent = n;
  pill.classList.toggle("tagged", !!TAG[theme]);
  pill.classList.toggle("sh", theme === "SuperHard");
  const em = pill.querySelector("em");
  em.textContent = TAG[theme] || "";
  em.hidden = !TAG[theme];
  // ⚠ Thu tu: co van roi moi ve duoc hang nut (nut mo hay sang phu thuoc vao ban co), va
  // phai co hang nut roi moi do duoc chieu cao that de bao lai cho canvas.
  E.setGame(new E.Game(n));
  drawTools();
  syncChrome(true);
  coins(); dev();
  if (n === 1) hint("Chạm một hộp để thả 8 mẻ kẹo lên băng chuyền", 6500);
}

// ---------------------------------------------------------------- booster

// ⚠ (3.1) Mot trang thai chi bao mot lan, va co da-bao luon phai co cho go. O day cho go
// la chinh cai hen gio: bam cai thu hai thi loi cu bi doi ngay chu khong xep chong.
let hintT = 0;
function hint(txt, ms) {
  const h = $("hint");
  clearTimeout(hintT);
  if (!txt) { h.hidden = true; return; }
  h.innerHTML = "<span>" + txt + "</span>";
  h.hidden = false;
  if (ms) hintT = setTimeout(() => { $("hint").hidden = true; }, ms);
}

function stock(id) {
  const n = save.bst(id);
  return n > 0
    ? '<span class="n">' + n + "</span>"
    : '<span class="n buy">' + BST[id].cost + "</span>";
}

function drawTools() {
  const g = E.getGame();
  const bar = $("tools");
  bar.innerHTML = BOOSTERS.map((b) =>
    '<button class="tool' + (armed === b.id ? " on" : "") + '" data-b="' + b.id +
    '" aria-label="' + b.name + '" aria-pressed="' + (armed === b.id) + '" title="' + b.name + " — " + b.hint + '">' + ICON[b.id] +
    stock(b.id) + "</button>").join("");
  for (const el of bar.querySelectorAll(".tool")) {
    const b = BST[el.dataset.b];
    // (3.5) Mo di khi khong con tien de mua, hoac khi engine se tu choi.
    el.disabled = !g || demo ||
      (save.bst(b.id) <= 0 && save.coins < b.cost) ||
      (armed !== b.id && !b.can(g));
    el.onclick = () => onBooster(b.id);
  }
}

function onBooster(id) {
  const g = E.getGame();
  if (!g || demo) return;
  const b = BST[id];
  if (armed === id) { sound.play("ui"); armed = null; hint(null); drawTools(); return; }
  // ⚠ Het luot thi HOI truoc khi tru tien. Ban cu tru thang 300 xu ngay tren cu cham dau
  // tien, khong mot loi nao - dung cai mat niem tin nho ma luat 2.5 noi toi, chi la o
  // phia ben kia: gia co hien san that, nhung cham vao gia lai la dong y mua.
  if (save.bst(id) <= 0) { sound.play("ui"); return askBuy(b); }
  use(b);
}

function use(b) {
  const g = E.getGame();
  if (!b.can(g)) { sound.play("blocked"); hint("Không dùng được lúc này", 1600); return; }
  if (b.target) { sound.play("ui"); armed = b.id; hint(b.hint); drawTools(); return; }

  let ok = false;
  if (b.id === "Undo") ok = g.undo();
  if (b.id === "ConveyorCapacity") ok = g.addConveyorSlot();
  if (!ok) { sound.play("blocked"); hint("Không dùng được lúc này", 1600); return; }
  sound.play(b.id);
  save.setBst(b.id, save.bst(b.id) - 1);
  // Go duoc that thi the RAY TAC bien mat - no chi con dung khi van con tac.
  if (g.state === "play") { carded = false; $("cards").classList.add("hide"); }
  drawTools();
}

function applyArmed(t) {
  const g = E.getGame();
  const b = BST[armed];
  let ok = false;
  if (b.id === "Shuffle") ok = g.shuffle(t);
  if (b.id === "Capacity") ok = g.addBaySlot(t);
  if (!ok) { sound.play("blocked"); hint("Khay này không dùng được", 1400); return; }
  sound.play(b.id);
  save.setBst(b.id, save.bst(b.id) - 1);
  armed = null; hint(null); drawTools();
  E.layout();
}

// (3.10) Cau hoi mot dong thi panel hep hon. (3.11) Mot hanh dong chinh, (3.8) duong tu
// choi ngang hang - cung be ngang, chi khac mau.
function askBuy(b) {
  const back = !carded;
  card(`
    <h2>${b.name.toUpperCase()}</h2>
    <div class="sub">${b.hint}</div>
    <div class="reward"><span class="price"></span>${b.cost.toLocaleString("vi-VN")}</div>
    <div class="stat"><span>Ví của bạn</span><b>${save.coins.toLocaleString("vi-VN")}</b></div>
    <div class="stat"><span>Còn lại sau khi mua</span><b>${(save.coins - b.cost).toLocaleString("vi-VN")}</b></div>
    <button class="btn gold" id="aBuy">MUA VÀ DÙNG</button>
    <button class="btn ghost" id="aNo">Thôi</button>`, "ask");
  $("aNo").onclick = () => { sound.play("ui"); back ? $("cards").classList.add("hide") : onLose(); };
  $("aBuy").onclick = () => {
    if (save.coins < b.cost) return;
    sound.play("ui");
    save.coins = save.coins - b.cost;
    save.setBst(b.id, save.bst(b.id) + 1);
    coins();
    if (back) $("cards").classList.add("hide"); else onLose();
    use(b);
  };
}

function card(html, kind) {
  // ⚠ Moi the deu di qua day, nen day la cho duy nhat co the noi "cai the tac khong con
  // tren man nua". Dat co o tung noi goi thi se quen mot noi.
  if (kind !== "warn jam") jamOpen = false;
  const c = $("cards");
  c.innerHTML = '<div class="card' + (kind ? " " + kind : "") + '">' + html + "</div>";
  c.classList.remove("hide");
}

function starsFor(g) {
  const r = g.peak / g.slotCount;
  return r <= 0.5 ? 3 : r <= 0.75 ? 2 : 1;
}

function onWin() {
  sound.play("win");
  const g = E.getGame();
  const theme = g.lv.Theme;
  const st = starsFor(g);
  const gain = REWARD[theme] || REWARD.Default;
  save.coins = save.coins + gain;
  save.setStar(g.id, st);
  if (g.id + 1 > save.level) save.level = g.id + 1;
  const newArea = E.areaOf(g.id + 1) !== E.areaOf(g.id);

  card(`
    <h2>MẺ KẸO HOÀN TẤT!</h2>
    <div class="sub">Level ${g.id} · CANDY FACTORY</div>
    <div class="stars"><i>★</i><i>★</i><i>★</i></div>
    <div class="reward"><span class="coin"></span>+${gain}</div>
    ${TAG[theme] ? '<p class="rwhy' + (theme === "SuperHard" ? " sh" : "") + '">' +
        "THƯỞNG MÀN " + TAG[theme] + "</p>" : '<div style="height:10px"></div>'}
    <div class="stat"><span>Số lượt chạm</span><b>${g.taps}</b></div>
    <div class="stat"><span>Hộp trên băng chuyền</span><b>${g.counter()}/${g.slotCount}</b></div>
    ${newArea ? '<div class="banner">Mở khoá mẻ kẹo mới!</div>' : ""}
    <button class="btn" id="cNext">LEVEL ${Math.min(MAX_LEVEL, g.id + 1)}</button>
    <button class="btn ghost" id="cHome">Về nhà</button>`);

  const ic = $("cards").querySelectorAll(".stars i");
  for (let i = 0; i < st; i++) setTimeout(() => ic[i].classList.add("on"), 180 + i * 190);
  $("cNext").onclick = () => { sound.play("ui"); startLevel(g.id + 1); };
  $("cHome").onclick = () => { sound.play("ui"); goHome(); };
  coins();
}

function onLose() {
  sound.play("lose");
  const g = E.getGame();
  const price = REVIVE[Math.min(revives, REVIVE.length - 1)];
  const can = save.coins >= price;
  // (3.3 + 3.4) Cach go ve bang icon cua chinh cac booster, va bam duoc lam luon viec no
  // noi. (3.5) Cai nao khong go duoc ban co nay thi mo san tu dau.
  const ways = WAYS.map((id) => {
    const b = BST[id];
    const dead = !b.can(g) || (save.bst(id) <= 0 && save.coins < b.cost);
    // ⚠ Nhan ngan giong HET thanh booster, khong phai ten day du: panel nay tro vao nhung
    // nut nguoi choi da quen o duoi man hinh, nen icon va chu phai la mot cap voi chung.
    return '<button class="way" data-b="' + id + '"' + (dead ? " disabled" : "") +
      ' title="' + b.name + " — " + b.hint + '">' +
      ICON[id] + '<span class="l">' + b.l + "</span>" + stock(id) + "</button>";
  }).join("");

  card(`
    <h2>KẸO KẸT RỒI!</h2>
    <div class="sub">Level ${g.id} · Không còn khay nhận được kẹo</div>
    <div class="stat"><span>Số lượt chạm</span><b>${g.taps}</b></div>
    <div class="stat"><span>Hộp trên băng chuyền</span><b>${g.counter()}/${g.slotCount}</b></div>
    <p class="waysLbl">Cách gỡ</p>
    <div class="ways">${ways}</div>
    <button class="btn gold" id="cRev" ${can ? "" : "disabled"}>
      <span class="price"></span> HỒI SINH ${price.toLocaleString("vi-VN")}</button>
    <div class="row2">
      <button class="btn ${can ? "ghost" : ""}" id="cRetry">CHƠI LẠI</button>
      <button class="btn ghost" id="cHome">VỀ NHÀ</button>
    </div>`, "warn");

  for (const el of $("cards").querySelectorAll(".way"))
    el.onclick = () => onBooster(el.dataset.b);
  $("cRetry").onclick = () => { sound.play("ui"); startLevel(g.id); };
  $("cHome").onclick = () => { sound.play("ui"); goHome(); };
  $("cRev").onclick = () => {
    if (save.coins < price) return;
    const cleared = g.revive();
    if (!cleared) return;
    sound.play("revive");
    save.coins = save.coins - price;
    revives++;
    carded = false;
    $("cards").classList.add("hide");
    coins(); drawTools();
  };
}

// Ban co dang khoa: con vali co hang, ma khong vali nao cham duoc. ⚠ Khong hoi
// "counter >= slotCount": mot vali do ra nhieu khoi cung mau mot luc, nen no co the bi khoa
// trong khi ray van con mot cho trong - va luc do nguoi choi cham vao no cung khong co gi
// xay ra. Hoi dung cau ma nguoi choi dang hoi: "sao cham khong duoc?"
function jammed(g) {
  if (g.state !== "play") return false;
  if (!g.trucks.some((t) => !t.gone && t.blocks.length)) return false;
  if (g.trucks.some((t) => g.canTapAny(t))) return false;
  // ⚠ Hang dang tuon ra hoac dang bay vao xe thi chua duoc tinh: no chua co co hoi nao ca.
  if (g.pending.length || g.flying.length) return false;
  // ⚠ Dieu kien that su cua "tac", va no KHONG phai "ray day": moi mieng hang tren ray phai
  // di tron MOT VONG (`c.lap >= g.len`) ma van khong ben nao nhan. Ray day chi la mot khoanh
  // khac - hang con dang chay toi bien cua no, va bao "tac" luc do la bao mot chuyen chua
  // xay ra. Mot vong ray het vai giay, nen cai vong nay cung chinh la khoang cho: khong can
  // hen gio rieng nao nua.
  return g.cubes.length > 0 && g.cubes.every((c) => (c.lap || 0) >= g.len);
}

// (3.7) Ve BAN CO THAT: mau tren dai la mau dang nam tren ray luc nay, gom theo khoi. Mot
// hinh minh hoa chung chung thi khong noi duoc "cho cua ban het roi".
function jamStrip(g) {
  const out = [];
  for (let i = 0; i < g.cubes.length && out.length < 8; i++)
    out.push(E.PALETTE[g.cubes[i].color] || "#8590a6");
  return out.map((c, i) =>
    '<i style="background:' + c + ';animation-delay:' + (-i * 90) + 'ms"></i>').join("");
}

function showJam(g) {
  const b = BST.ConveyorCapacity;
  const dead = !b.can(g) || (save.bst(b.id) <= 0 && save.coins < b.cost);
  jamOpen = true;
  card(`
    <h2>KẸO KẸT RỒI!</h2>
    <div class="sub">Chưa đủ chỗ để thả mẻ kẹo tiếp theo</div>
    <div class="stat"><span>Hộp trên băng chuyền</span><b>${g.counter()}/${g.slotCount}</b></div>
    <div class="jamRail"><div class="jamRun">${jamStrip(g)}</div><span class="jamStop"></span></div>
    <p class="waysLbl">Cách gỡ</p>
    <div class="ways">
      <button class="way" data-b="ConveyorCapacity"${dead ? " disabled" : ""}
        title="${b.name} — ${b.hint}">${ICON.ConveyorCapacity}<span class="l">${b.l}</span>${stock(b.id)}</button>
    </div>
    <button class="btn" id="jWait">ĐỂ TÔI ĐỢI</button>`, "warn jam");
  for (const el of $("cards").querySelectorAll(".way"))
    el.onclick = () => onBooster(el.dataset.b);
  $("jWait").onclick = closeJam;
}

// ⚠ Dong the khi ray da voi di, khong bat nguoi choi tu dong: cai the nay bao mot trang
// thai, va trang thai het thi the phai het theo. De no nam lai la che mat dung cai ban co
// ma no vua bao nguoi choi phai nhin.
function closeJam() {
  jamOpen = false;
  $("cards").classList.add("hide");
}

// ---------------------------------------------------------------- vong lap

function frame(now) {
  const dt = Math.min(0.04, (now - last) / 1000);
  last = now;
  const g = E.getGame();
  if (g) {
    if (g !== audioGame) {
      audioGame = g;
      audioGone = g.trucks.filter((t) => t.gone).length;
    }
    const cargoBefore = g.pending.length + g.cubes.length;
    const pendingBefore = g.pending.length;
    if (!demo || !reducedMotion.matches) g.step(dt, now);
    if (!demo) {
      const released = Math.max(0, pendingBefore - g.pending.length);
      const absorbed = Math.max(0, cargoBefore - g.pending.length - g.cubes.length);
      if (released) sound.play("belt", released);
      if (absorbed) sound.play("catch", absorbed);
      const gone = g.trucks.filter((t) => t.gone).length;
      if (gone > audioGone) sound.play("deliver", gone - audioGone);
      audioGone = gone;
    }
    const gauge = $("levelPill");
    // ⚠ O dem la SO HOP tren ray / suc chua (chu du an 2026-09-17: "o dem o tren cung, la dem so
    // hop, k phai dem limit so keo"). counter() lam tron LEN theo hop, dung cai canTap() hoi.
    $("hudBags").textContent = g.counter() + " / " + g.slotCount;
    // ⚠ Nguong canh bao la VUOT QUA 2/3 suc chua ray — con so chu du an chot. Truoc day no la
    // `slotCount - 2`, tuc mot khoang cach CO DINH tinh tu tran: tren ray 7 cho thi la 71%,
    // tren ray 12 cho thi la 83%. Cung mot cai nhan lai co nghia khac nhau tuy level, va tren
    // ban co lon no chi sang khi da gan het duong lui. 2/3 la mot TI LE nen no noi cung mot
    // dieu o moi co ray.
    // ⚠ Mot bien dung chung cho ca mau lan nhan aria, khong viet dieu kien hai lan: hai ban sao
    // cua mot luat se troi khoi nhau, va luc do o dem doi mau mot dang con trinh doc man hinh
    // doc mot dang khac.
    const tran = g.counter() > g.slotCount * 2 / 3;
    gauge.classList.toggle("warning", tran);
    gauge.setAttribute("aria-label", "Level " + g.id + ", hộp trên ray: " + g.counter() + "/" + g.slotCount + (tran ? ", sắp tràn" : ""));
    // ⚠ Khong goi E.draw: bo 3D tu chay vong lap rieng cua no.
    if (demo) {
      // van nen tu choi: cham mot ben con hang, mien la ray con cho
      if (!reducedMotion.matches && now > demoNext) {
        demoNext = now + DEMO_TAP_MS;
        const live = g.trucks.filter((t) => !t.gone && t.blocks.length);
        if (!live.length || g.state !== "play") goHome();
        else {
          const ok = live.filter((t) => g.canTap(t) && g.counter() < g.slotCount - 1);
          if (ok.length) g.tap(ok[(Math.random() * ok.length) | 0]);
        }
      }
    } else if (!carded && g.state !== "play") {
      carded = true;
      // Let the final tray close and settle into its station before the result card.
      const winDelay = reducedMotion.matches ? 700 : 2300;
      setTimeout(g.state === "win" ? onWin : onLose, g.state === "win" ? winDelay : 450);
    } else if (!carded) {
      if (!jammed(g)) {
        if (jamTold) { jamTold = false; if (jamOpen) closeJam(); }
      } else if (!jamTold) { jamTold = true; showJam(g); }
    }
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- bang dev

function dev() {
  const g = E.getGame();
  if (!g || $("dev").classList.contains("hide")) return;
  const lv = g.lv;
  const cols = new Set();
  for (const t of g.trucks) for (const b of t.blocks) cols.add(b.color);
  $("dev").innerHTML = `
    <h3>Level ${g.id} · ${lv.Theme} · Candy Factory</h3>
    <div class="kv">
      <b>Khay</b><span>${g.trucks.length}</span>
      <b>Màu</b><span>${cols.size}</span>
      <b>Sức chứa ray</b><span>${g.slotCount} hộp = ${g.capCubes} viên kẹo</span>
      <b>Ray</b><span>${g.closed ? "vòng kín" : "hở — Portal"} · ${g.len.toFixed(1)} đv</span>
      <b>Kẹo/hộp</b><span>${g.perBlock}</span>
    </div>
    <h3 style="margin-top:10px">Carriers #${lv.Carriers}</h3>
    <code>${E.CARRIERS[lv.Carriers].ColorData}</code>
    <h3>Splines #${lv.Spline}</h3>
    <code>${E.SPLINES[lv.Spline].Spline.replace(/\n/g, "⏎")}</code>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button id="dLv">Nhảy level…</button>
      <button id="dCoin">+1000 xu</button>
      <button id="dWin">Thắng ngay</button>
      <button id="dReset">Xoá tiến độ</button>
      <button id="dBst">+9 booster</button>
      <label style="display:flex;gap:5px;align-items:center">
        <input type="checkbox" id="eager"> Hút thoáng</label>
    </div>`;
  $("dLv").onclick = () => {
    const n = prompt("Level (1-1299)", g.id);
    if (n) startLevel(+n);
  };
  $("dCoin").onclick = () => { save.coins = save.coins + 1000; coins(); drawTools(); };
  $("dWin").onclick = () => { g.state = "win"; };
  $("dBst").onclick = () => {
    for (const b of BOOSTERS) save.setBst(b.id, save.bst(b.id) + 9);
    drawTools();
  };
  $("eager").checked = save.eager;
  $("eager").onchange = (e) => { save.eager = e.target.checked; E.setEager(e.target.checked); };
  // (1.4) Nut xoa tien do chi ton tai o day, sau mot lan xac nhan - khong bao gio nam
  // tren Home noi ngon tay quet qua.
  $("dReset").onclick = () => {
    if (confirm("Xoá toàn bộ tiến độ?")) {
      for (const k of ["level", "coins", "stars", "eager"]) localStorage.removeItem(K + k);
      for (const b of BOOSTERS) localStorage.removeItem(K + "b_" + b.id);
      goHome();
    }
  };
}

// ---------------------------------------------------------------- khoi dong

const cv = $("stage");
E.initCanvas(cv);

// ⚠ Bo ve 3D thay han bo ve 2D. Canvas #stage van phai TON TAI va van phai duoc
// initCanvas: layout() cua loopsort.js doc kich thuoc cua no, va no la thu nhan su kien
// pointer (lop 3D nam duoi, pointer-events cua no khong duoc bat). Chi an di bang opacity
// chu khong display:none — display:none cho getBoundingClientRect() tra ve 0 va layout()
// se chia cho 0.
cv.style.opacity = "0";
const three = mountThree($("frame"), () => E.getGame());
window.__ls3 = three;   // ⚠ cua de do: giu lai, moi phep kiem bo ve 3D deu di qua day

cv.addEventListener("pointerdown", (e) => {
  if (demo || carded) return;
  sound.unlock();
  // ⚠ Raycast cua bo 3D, KHONG phai E.pick: duoi camera phoi canh mot diem man hinh ung
  // voi mot tia, con E.pick nghich dao mot phep bien doi affine cua ban 2D. Dung E.pick o
  // day thi cham vao dau cung ra sai ben.
  const hit = three.pick(e.clientX, e.clientY);
  if (!hit) return;
  const t = hit.truck;
  if (armed) return applyArmed(t);
  const g = E.getGame();
  const load = Math.max(1, g.tapLoad(t)) * g.perBlock;
  if (g.tap(t)) { sound.play("pour", load); return; }
  sound.play("blocked");
  // ⚠ Het cho tren ray khong phai thua, chi la khoa tam: vali da mo san (drawBlocked),
  // day chi la cau tra loi cho nguoi van cham vao. Noi cai DIEU KIEN go khoa - "cho ben
  // nuot bot" - chu khong phai "khong bam duoc", vi cai sau khong cho ho viec gi de lam.
  if (g.state === "play" && !t.gone && t.blocks.length && t.drain < 0)
    hint("Chưa đủ chỗ — chờ khay đóng gói bớt kẹo", 1600);
});

// ⚠ Chi doi nhan ben trong <b id="homeLv"> va <small id="homeArea">, khong ghi de
// innerHTML cua nut: lam the la xoa luon chinh hai the do, va goHome() sau nay se nem
// loi vi null.
$("btnPlay").disabled = true;
$("homeArea").textContent = "đang tải dữ liệu…";
$("btnPlay").onclick = () => { sound.unlock(); sound.play("ui"); startLevel(save.level); };
$("btnHome").innerHTML = ICON.home;
$("btnRetry").innerHTML = ICON.retry;
$("btnHome").onclick = () => { sound.play("ui"); goHome(); };
$("btnRetry").onclick = () => { sound.play("ui"); startLevel(E.getGame().id); };
function syncSoundButton() {
  const button = $("btnSound");
  const on = sound.isEnabled();
  button.innerHTML = on ? SOUND_ON : SOUND_OFF;
  button.setAttribute("aria-label", on ? "Tắt âm thanh" : "Bật âm thanh");
  button.setAttribute("aria-pressed", String(on));
}
$("btnSound").onclick = () => { sound.toggle(); syncSoundButton(); };
syncSoundButton();
$("homeSound").appendChild($("btnSound"));
$("devBtn").onclick = () => { $("dev").classList.toggle("hide"); dev(); };
addEventListener("resize", () => syncChrome(!demo));
addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.key === "r" && !demo) startLevel(E.getGame().id);
  if (e.key === "Escape") goHome();
});

// Cua cho script lai (shot.mjs --then), giu nguyen ten cu.
window.__ls = {
  show: startLevel,
  home: goHome,
  game: () => E.getGame(),
  save,
  eager: (v) => { E.setEager(v); const el = $("eager"); if (el) el.checked = v; },
  booster: (id) => onBooster(id),
  arm: () => armed,
  pick: (x, y) => E.pick(x, y),
  bst: (id) => save.bst(id),
  lose: () => { carded = true; onLose(); },
  // Cua do cho phep kiem tra dieu kien "tac": tac hay chua, va moi mieng hang da di duoc
  // may phan cua mot vong ray.
  jam: () => jammed(E.getGame()),
  laps: () => {
    const g = E.getGame();
    return g.cubes.map((c) => +((c.lap || 0) / g.len).toFixed(2));
  },
  win: () => { carded = true; onWin(); },
  tapLane: (lane) => {
    const g = E.getGame();
    const t = g.trucks.find((x) => x.lane === lane && !x.gone);
    return t ? g.tap(t) : false;
  },
  fast: (secs) => {
    const g = E.getGame();
    let now = performance.now();
    for (let i = 0; i < secs * 60 && g.state === "play"; i++) { now += 1000 / 60; g.step(1 / 60, now); }
    return g.state;
  },
  state: () => {
    const g = E.getGame();
    return {
      level: g.id, state: g.state, counter: g.counter(), cap: g.slotCount,
      taps: g.taps, peak: g.peak, cubes: g.cubes.length, pending: g.pending.length,
      perBlock: g.perBlock, coins: save.coins,
      trucks: g.trucks.map((t) => ({
        lane: t.lane, gone: t.gone, fill: t.fill,
        blocks: t.blocks.map((b) => b.color + (b.hidden && !b.seen ? "?" : "")),
        wants: g.wants(t),
      })),
    };
  },
};

// ⚠ Boc trong mot ham async chu khong dung `await` o muc cao nhat cua module. Dev server thi
// chay duoc ca hai, nhung ban BUILD nham muc tieu chrome87/es2020 va esbuild tu choi
// top-level await - tuc trang nay khong the dong goi de dua len web duoc, ma loi chi lo ra
// luc build chu khong phai luc chay thu.
(async () => {
  try {
    await E.loadData();
  } catch (e) {
    fatal(new Error("không tải được dữ liệu level (" + (e.message || e) + ")"));
    throw e;
  }
  MAX_LEVEL = Math.max(1, Object.keys(E.LEVELS).length);
  buildDemoPool();
  $("btnPlay").disabled = false;
  E.setEager(save.eager);
  const q = new URLSearchParams(location.search);
  if (q.get("dev")) $("dev").classList.remove("hide");

  // ⚠ Tu kiem RAYCAST. Bo ve 3D thay E.pick bang mot phep ban tia, va mot ban co 3D khong bam
  // duoc thi vo dung — nen phai kiem duoc bang may chu khong phai bam tay roi doan. Chieu tam
  // moi xe ra man hinh roi ban tia nguoc lai: phai nhan dung chinh xe do.
  // Chay bang: npm run shot -- --page "tools/loopsort/index.html?level=N&picktest=1"
  if (q.get("picktest")) {
    setTimeout(() => {
      const g = E.getGame();
      if (!g) { console.log("PICKTEST: FAIL - khong co game"); return; }
      // ⚠ pick() tra ve { truck, slot } tu khi cham duoc TUNG HOP, khong con tra ve xe tron.
      // So `hit === t` thi phep kiem nay truot 100% bat ke camera dung hay sai - da gap dung the.
      // Kiem TUNG HOP: cham vao tam hop thu i phai ra dung xe va dung o i.
      let ok = 0, bad = 0;
      for (const t of g.trucks)
        for (let slot = 0; slot < t.blocks.length; slot++) {
          const c = g.slotPos(t, slot, 0.5);
          const s = three.project(c.x, c.y);
          const hit = three.pick(s.x, s.y);
          if (hit && hit.truck === t && hit.slot === slot) ok++;
          else {
            bad++;
            console.log("PICKTEST: truot xe lane=" + t.lane + " o " + slot + " tai " +
              Math.round(s.x) + "," + Math.round(s.y) + " -> " +
              (hit ? "lane=" + hit.truck.lane + " o " + hit.slot : "khong trung gi"));
          }
        }
      console.log("PICKTEST: " + ok + "/" + (ok + bad) + (bad ? " FAIL" : " PASS"));
    }, 900);
  }
  if (q.get("level")) startLevel(+q.get("level"));
  else goHome();
  requestAnimationFrame(frame);
})();
