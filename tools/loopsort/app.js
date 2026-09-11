// Vo game cho ban dung lai Loop Sort: man Home, luong level, the hoan thanh / that bai,
// vi coin, phan thuong. Cau truc hoc tu Ball Sort (du an nay): mot tien to khoa rieng cho
// localStorage, kinh te va moc thanh pho lay tu chinh du lieu cua ho.

import * as E from "./loopsort.js";

const MAX_LEVEL = 1299;
// Constants.json cua chinh ho: WinReward 10, HardLevelReward 30, SuperHardLevelReward 50,
// Revive 900 roi SecondRevive 1900.
const REWARD = { Default: 10, Hard: 30, SuperHard: 50 };
const REVIVE = [900, 1900];
// Boosters.json cua ho, nguyen van. Con mot cai nua co ten trong Localization
// ("Magic Hand" / booster_select) nhung KHONG co trong Boosters.json cua ban 3.4.1,
// nen khong dung o day.
const BOOSTERS = [
  { id: "Undo",             g: "↶", l: "Undo",  cost: 300, free: 3,
    name: "Undo",                hint: "Trả lại chuyến hàng vừa đổ" },
  { id: "Shuffle",          g: "⇄", l: "Trộn",  cost: 300, free: 3,
    name: "Shuffle",             hint: "Chạm vào một bến để trộn thứ tự hàng" },
  { id: "ConveyorCapacity", g: "+1",      l: "Ray",   cost: 800, free: 3,
    name: "Extra Conveyor Slot", hint: "Nối thêm một chỗ trên băng chuyền" },
  { id: "Capacity",         g: "+1",      l: "Ô xe",  cost: 900, free: 3,
    name: "Extra Slot",          hint: "Chạm vào một bến để nối thêm một ô hàng" },
];
const NEEDS_TARGET = { Shuffle: 1, Capacity: 1 };
let armed = null;
const DEMO_TAP_MS = 2100;

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
    return v === null ? (BOOSTERS.find((b) => b.id === id).free) : Math.max(0, +v);
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

// ---------------------------------------------------------------- man hinh

function coins() {
  const t = save.coins.toLocaleString("vi-VN");
  $("homeCoins").textContent = t;
  $("gameCoins").textContent = t;
}

function goHome() {
  demo = true; carded = false;
  // Home co mot van dang tu choi chay lam nen - re hon mot anh bia va khong bao gio cu.
  E.setChrome(false);
  E.setGame(new E.Game(demoPool[(Math.random() * demoPool.length) | 0]));
  $("home").classList.remove("hide");
  $("chrome").classList.add("hide");
  $("cards").classList.add("hide");
  const lv = save.level;
  $("homeLv").textContent = "Level " + lv + " · " + E.areaOf(lv);
  const st = save.stars(), done = Object.keys(st).length;
  $("homeArea").textContent = done
    ? "Đã qua " + done + " level · " + Object.values(st).reduce((a, b) => a + b, 0) + " sao"
    : "Dồn cube vào đúng xe trước khi ray tắc";
  demoNext = performance.now() + 800;
  armed = null; hint(null);
  coins(); dev();
}

function startLevel(n) {
  demo = false; carded = false; revives = 0; armed = null; hint(null);
  n = Math.max(1, Math.min(MAX_LEVEL, n));
  save.level = n;
  E.setChrome(true);
  E.setGame(new E.Game(n));
  $("home").classList.add("hide");
  $("chrome").classList.remove("hide");
  $("cards").classList.add("hide");
  coins(); drawBoosters(); dev();
}

// ---------------------------------------------------------------- booster

function hint(txt) {
  const h = $("hint");
  if (!txt) { h.classList.add("hide"); return; }
  h.innerHTML = "<span>" + txt + "</span>";
  h.classList.remove("hide");
}

function drawBoosters() {
  const bar = $("boosters");
  bar.innerHTML = BOOSTERS.map((b) => {
    const n = save.bst(b.id);
    const badge = n > 0 ? '<span class="n">' + n + "</span>"
                        : '<span class="n buy">' + b.cost + "</span>";
    return '<button class="bst' + (armed === b.id ? " on" : "") + '" data-b="' + b.id +
           '" title="' + b.name + " — " + b.hint + '">' +
           '<span class="g">' + b.g + '</span><span class="l">' + b.l + "</span>" + badge +
           "</button>";
  }).join("");
  for (const el of bar.querySelectorAll(".bst"))
    el.onclick = () => onBooster(el.dataset.b);
}

function onBooster(id) {
  const g = E.getGame();
  if (!g || demo) return;
  const b = BOOSTERS.find((x) => x.id === id);
  if (armed === id) { armed = null; hint(null); drawBoosters(); return; }

  if (save.bst(id) <= 0) {                       // het thi mua, dung gia trong Boosters.json
    if (save.coins < b.cost) { hint("Không đủ xu — cần " + b.cost); setTimeout(() => hint(null), 1400); return; }
    save.coins = save.coins - b.cost;
    save.setBst(id, save.bst(id) + 1);
    coins(); drawBoosters();
    return;
  }
  if (NEEDS_TARGET[id]) { armed = id; hint(b.hint); drawBoosters(); return; }

  let ok = false;
  if (id === "Undo") ok = g.undo();
  if (id === "ConveyorCapacity") ok = g.addConveyorSlot();
  if (!ok) {
    hint(id === "Undo" ? "Không hoàn lại được — hàng đã có bến nhận" : "Không dùng được lúc này");
    setTimeout(() => hint(null), 1600);
    return;
  }
  save.setBst(id, save.bst(id) - 1);
  if (g.state === "play") { carded = false; $("cards").classList.add("hide"); }
  drawBoosters();
}

function applyArmed(t) {
  const g = E.getGame();
  const id = armed;
  let ok = false;
  if (id === "Shuffle") ok = g.shuffle(t);
  if (id === "Capacity") ok = g.addBaySlot(t);
  if (!ok) { hint("Bến này không dùng được"); setTimeout(() => hint(null), 1400); return; }
  save.setBst(id, save.bst(id) - 1);
  armed = null; hint(null); drawBoosters();
  E.layout();
}

function card(html) {
  const c = $("cards");
  c.innerHTML = '<div class="card">' + html + "</div>";
  c.classList.remove("hide");
}

function starsFor(g) {
  const r = g.peak / g.slotCount;
  return r <= 0.5 ? 3 : r <= 0.75 ? 2 : 1;
}

function onWin() {
  const g = E.getGame();
  const theme = g.lv.Theme;
  const st = starsFor(g);
  const gain = REWARD[theme] || REWARD.Default;
  save.coins = save.coins + gain;
  save.setStar(g.id, st);
  if (g.id + 1 > save.level) save.level = g.id + 1;
  const newArea = E.areaOf(g.id + 1) !== E.areaOf(g.id);

  card(`
    <h2>HOÀN THÀNH</h2>
    <div class="sub">Level ${g.id}${theme === "Default" ? "" : " · " + theme}</div>
    <div class="stars"><i>★</i><i>★</i><i>★</i></div>
    <div class="reward"><span class="coin"></span>+${gain}</div>
    ${newArea ? '<div class="banner">Mở khoá thành phố mới · ' + E.areaOf(g.id + 1) + "</div>" : ""}
    <div class="stat"><span>Số lượt chạm</span><b>${g.taps}</b></div>
    <div class="stat"><span>Cao nhất trên ray</span><b>${g.peak}/${g.slotCount}</b></div>
    <button class="btn" id="cNext">LEVEL TIẾP</button>
    <button class="btn ghost" id="cHome">Về nhà</button>`);

  const ic = $("cards").querySelectorAll(".stars i");
  for (let i = 0; i < st; i++) setTimeout(() => ic[i].classList.add("on"), 180 + i * 190);
  $("cNext").onclick = () => startLevel(g.id + 1);
  $("cHome").onclick = goHome;
  coins();
}

function onLose() {
  const g = E.getGame();
  const price = REVIVE[Math.min(revives, REVIVE.length - 1)];
  const can = save.coins >= price;
  card(`
    <h2>RAY TẮC</h2>
    <div class="sub">Level ${g.id} · không còn chỗ trên ray</div>
    <div class="stat"><span>Số lượt chạm</span><b>${g.taps}</b></div>
    <div class="stat"><span>Trên ray</span><b>${g.counter()}/${g.slotCount}</b></div>
    <button class="btn gold" id="cRev" ${can ? "" : "disabled"}>
      HỒI SINH · ${price.toLocaleString("vi-VN")}</button>
    <div class="row2">
      <button class="btn" id="cRetry">CHƠI LẠI</button>
      <button class="btn ghost" id="cHome">Về nhà</button>
    </div>`);
  $("cRetry").onclick = () => startLevel(g.id);
  $("cHome").onclick = goHome;
  $("cRev").onclick = () => {
    if (save.coins < price) return;
    const cleared = g.revive();
    if (!cleared) return;
    save.coins = save.coins - price;
    revives++;
    carded = false;
    $("cards").classList.add("hide");
    coins();
  };
}

// ---------------------------------------------------------------- vong lap

function frame(now) {
  const dt = Math.min(0.04, (now - last) / 1000);
  last = now;
  const g = E.getGame();
  if (g) {
    g.step(dt, now);
    E.draw(now);
    if (demo) {
      // van nen tu choi: cham mot ben con hang, mien la ray con cho
      if (now > demoNext) {
        demoNext = now + DEMO_TAP_MS;
        const live = g.trucks.filter((t) => !t.gone && t.blocks.length);
        if (!live.length || g.state !== "play") goHome();
        else {
          const ok = live.filter(() => g.counter() < g.slotCount - 1);
          if (ok.length) g.tap(ok[(Math.random() * ok.length) | 0]);
        }
      }
    } else if (!carded && g.state !== "play") {
      carded = true;
      setTimeout(g.state === "win" ? onWin : onLose, g.state === "win" ? 700 : 450);
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
    <h3>Level ${g.id} · ${lv.Theme} · ${E.areaOf(g.id)}</h3>
    <div class="kv">
      <b>Bến</b><span>${g.trucks.length}</span>
      <b>Màu</b><span>${cols.size}</span>
      <b>Sức chứa ray</b><span>${g.slotCount} khối = ${g.capCubes} cube</span>
      <b>Ray</b><span>${g.closed ? "vòng kín" : "hở — Portal"} · ${g.len.toFixed(1)} đv</span>
      <b>Cube/khối</b><span>${g.perBlock}</span>
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
  $("dCoin").onclick = () => { save.coins = save.coins + 1000; coins(); };
  $("dWin").onclick = () => { g.state = "win"; };
  $("dBst").onclick = () => {
    for (const b of BOOSTERS) save.setBst(b.id, save.bst(b.id) + 9);
    drawBoosters();
  };
  $("eager").checked = save.eager;
  $("eager").onchange = (e) => { save.eager = e.target.checked; E.setEager(e.target.checked); };
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

cv.addEventListener("pointerdown", (e) => {
  if (demo || carded) return;
  const t = E.pick(e.clientX, e.clientY);
  if (!t) return;
  if (armed) applyArmed(t);
  else E.getGame().tap(t);
});

// ⚠ Chi doi nhan ben trong <small id="homeLv">, khong ghi de innerHTML cua nut:
// lam the la xoa luon chinh cai <small> do, va goHome() sau nay se ném lỗi vì null.
$("btnPlay").disabled = true;
$("homeLv").textContent = "đang tải dữ liệu…";
$("btnPlay").onclick = () => startLevel(save.level);
$("btnHome").onclick = goHome;
$("btnRetry").onclick = () => startLevel(E.getGame().id);
$("devBtn").onclick = () => { $("dev").classList.toggle("hide"); dev(); };
addEventListener("resize", () => E.layout());
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

try {
  await E.loadData();
} catch (e) {
  fatal(new Error("không tải được dữ liệu level (" + (e.message || e) + ")"));
  throw e;
}
buildDemoPool();
$("btnPlay").disabled = false;
E.setEager(save.eager);
const q = new URLSearchParams(location.search);
if (q.get("dev")) $("dev").classList.remove("hide");
if (q.get("level")) startLevel(+q.get("level"));
else goHome();
requestAnimationFrame(frame);
