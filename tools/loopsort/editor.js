// Editor level cho ban dung lai Loop Sort.
//
// ⚠ NGUYEN TAC: editor KHONG co ban sao nao cua luat choi. Moi thu no ve len man hinh deu di
// qua `new Game(id)` cua chinh engine - duong ray la `game.ring`, o hang la `game.slotPos`,
// khung bao la `game.bounds`, va he so co xe la `game.fit`. Du an nay da tra gia mot lan cho
// bai hoc do o editor cua Marble Sort: mot editor ve theo ban ve thay vi theo trang thai da
// settle thi no noi doi ve chinh cai level minh dang sua, va nguoi thiet ke chi phat hien khi
// vao choi that.
//
// ⚠ Vi the vong doi la: sua `st` -> SINH LAI chuoi du lieu -> gan vao SPLINES/CARRIERS/LEVELS
// -> `new Game` -> ve. Khong co duong tat nao tu `st` ra man hinh.
import * as E from "./loopsort.js";
import { mountThree } from "./three3d.js";

const $ = (id) => document.getElementById(id);
const cv = $("cv"), ctx = cv.getContext("2d");
const r2 = (v) => Math.round(v * 100) / 100;

let lvId = 1;
let st = null;          // trang thai dang sua (nguon su that DUY NHAT cua editor)
let game = null;        // Game dung lai tu st - chi de VE va KIEM, khong bao gio de sua
let sel = null;         // {kind:"v"|"dock", i|lane}
let drag = null;
let tool = "dock";
let brush = "R";
let view = { s: 18, ox: 0, oy: 0 };
let dirty = false;

// ---------------------------------------------------------------- doc / ghi du lieu

// ⚠ Doc qua Game chu khong tu parse lai chuoi. parseSpline/parseCarrier la luat rieng cua
// engine (ke ca phep DOI DAU truc y); mot ban doc thu hai o day se troi khoi no.
function load(id) {
  if (!E.LEVELS[id]) { flash(`Không có level ${id}`); return; }
  lvId = id;
  const g = new E.Game(id);
  st = {
    slot: g.slotCount,
    closed: g.geo.closed,
    path: g.geo.path.map((p) => ({ x: p.x, y: p.y })),
    // Giu CA nhung ben khong lane nao dung (Y/Z - mieng cong cua ray ho). Chung vo hai voi
    // engine nhung la mot phan cua ban goc, nen editor tra lai nguyen ven thay vi lam mat.
    docks: Object.fromEntries(Object.entries(g.geo.docks)
      .map(([k, d]) => [k, { x: d.x, y: d.y, rot: d.rot }])),
    lanes: g.trucks.map((t) => ({
      lane: t.lane,
      blocks: t.blocks.map((b) => ({ color: b.color, hidden: !!b.hidden, key: b.key || null })),
    })),
  };
  dirty = false;
  $("lvNum").value = id;
  apply(true);
}

function serSpline() {
  const out = [];
  st.path.forEach((p, i) => out.push(`${i + 1};${r2(p.x)};${r2(-p.y)}`));
  for (const [k, d] of Object.entries(st.docks))
    out.push(`${k}\n${d.rot};${r2(d.x)};${r2(-d.y)}`);
  return out.join(":");
}

function serCarrier() {
  return st.lanes.map((l) => [l.lane, ...l.blocks.map((b) =>
    b.color + (b.hidden ? "_H" : "") + (b.key ? "_K_" + b.key : ""))].join(";")).join(":");
}

// ⚠ Ghi de TRONG BO NHO thoi. Nhieu level dung chung mot Carrier/Spline (800 cho 1299 level),
// nen ghi xuong dia phai NHAN BAN truoc - viec do o phia may chu, xem vite.config.ts.
function apply(refit) {
  const lv = E.LEVELS[lvId];
  E.SPLINES[lv.Spline].Spline = serSpline();
  E.SPLINES[lv.Spline].Closed = st.closed;
  E.CARRIERS[lv.Carriers].ColorData = serCarrier();
  lv.SlotCount = st.slot;
  try {
    game = new E.Game(lvId);
  } catch (err) {
    game = null;
    flash("Không dựng được bàn: " + err.message);
  }
  if (refit) fitView();
  resize();
  renderLanes();
  validate();
}

// ---------------------------------------------------------------- hinh hoc phu tro

function nearestRing(x, y) {
  let best = null, bd = Infinity;
  if (!game) return { x, y };
  for (const p of game.ring) {
    const d = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (d < bd) { bd = d; best = p; }
  }
  return best;
}

// ⚠ Chon `rot` bang cach THU ca bon goc qua chinh `mouthFromRot` cua engine, roi lay goc nao
// huong mieng ben ve phia ray nhat. Viet thang cong thuc nguoc (atan2) thi nhanh hon va no la
// ban sao thu hai cua luat - dung cai ngay hom nay, sai vao ngay engine doi quy uoc goc.
function autoRot(d) {
  const n = nearestRing(d.x, d.y);
  const vx = n.x - d.x, vy = n.y - d.y, L = Math.hypot(vx, vy) || 1;
  let best = d.rot, bs = -Infinity;
  for (const r of [0, 90, 180, 270]) {
    const m = E.mouthFromRot(r);
    const s = (m.x * vx + m.y * vy) / L;
    if (s > bs) { bs = s; best = r; }
  }
  return best;
}

// ---------------------------------------------------------------- khung nhin

function resize() {
  const r = cv.parentElement.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, Math.round(r.width * dpr));
  cv.height = Math.max(1, Math.round(r.height * dpr));
  view.dpr = dpr;
  draw();
}

function fitView() {
  if (!game) return;
  const b = game.bounds;
  const r = cv.parentElement.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = (b.x1 - b.x0) || 1, h = (b.y1 - b.y0) || 1;
  view.s = Math.min((r.width * dpr * 0.88) / w, (r.height * dpr * 0.88) / h);
  view.ox = (b.x0 + b.x1) / 2;
  view.oy = (b.y0 + b.y1) / 2;
}

const X = (x) => (x - view.ox) * view.s + cv.width / 2;
const Y = (y) => (y - view.oy) * view.s + cv.height / 2;
const wx = (px) => (px - cv.width / 2) / view.s + view.ox;
const wy = (py) => (py - cv.height / 2) / view.s + view.oy;

function evPt(e) {
  const r = cv.getBoundingClientRect();
  const dpr = view.dpr || 1;
  return { x: wx((e.clientX - r.left) * dpr), y: wy((e.clientY - r.top) * dpr) };
}

// ---------------------------------------------------------------- ve

function draw() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "#13112a";
  ctx.fillRect(0, 0, cv.width, cv.height);
  if (!game) return;

  const b = game.bounds;
  // luoi so nguyen - don vi cua du lieu goc la o luoi, nen ve dung no
  ctx.strokeStyle = "#221e45"; ctx.lineWidth = 1;
  for (let x = Math.floor(b.x0) - 2; x <= b.x1 + 2; x++) {
    ctx.beginPath(); ctx.moveTo(X(x), Y(b.y0 - 2)); ctx.lineTo(X(x), Y(b.y1 + 2)); ctx.stroke();
  }
  for (let y = Math.floor(b.y0) - 2; y <= b.y1 + 2; y++) {
    ctx.beginPath(); ctx.moveTo(X(b.x0 - 2), Y(y)); ctx.lineTo(X(b.x1 + 2), Y(y)); ctx.stroke();
  }

  // mat ray, ve theo dung be rong engine dung
  const ring = game.ring;
  const lay = (w, col) => {
    ctx.strokeStyle = col; ctx.lineWidth = w * view.s; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath();
    ring.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
    if (game.closed) ctx.closePath();
    ctx.stroke();
  };
  lay(2 * (E.CHANNEL + E.RIM), "#4a4180");
  lay(2 * E.CHANNEL, "#241f45");

  // ben do: ve bang chinh slotPos cua engine
  for (const t of game.trucks) {
    const a = game.slotPos(t, 0, 0), z = game.slotPos(t, t.cap - 1, 1);
    const hw = game.truckW / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(X(a.x - t.my * hw), Y(a.y + t.mx * hw));
    ctx.lineTo(X(z.x - t.my * hw), Y(z.y + t.mx * hw));
    ctx.lineTo(X(z.x + t.my * hw), Y(z.y - t.mx * hw));
    ctx.lineTo(X(a.x + t.my * hw), Y(a.y - t.mx * hw));
    ctx.closePath();
    ctx.fillStyle = "#8fb8cc"; ctx.fill();
    ctx.lineWidth = sel && sel.kind === "dock" && sel.lane === t.lane ? 3 : 1.5;
    ctx.strokeStyle = sel && sel.kind === "dock" && sel.lane === t.lane ? "#fff" : "#2b3550";
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < t.blocks.length; i++) {
      const c = game.slotPos(t, i, 0.5);
      const s = game.slotLen * 0.78 * view.s;
      ctx.fillStyle = t.blocks[i].hidden ? "#5b5480" : (E.PALETTE[t.blocks[i].color] || "#888");
      ctx.beginPath();
      ctx.roundRect(X(c.x) - s / 2, Y(c.y) - s / 2, s, s, s * 0.25);
      ctx.fill();
    }
    // chu cai lane, dat o day ben
    const tag = game.slotPos(t, 0, -0.7);
    ctx.fillStyle = "#e9e6ff"; ctx.font = `700 ${Math.max(10, view.s * 0.9)}px system-ui`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(t.lane, X(tag.x), Y(tag.y));
  }

  // dinh ray - chi hien o che do Ray, de khong tranh cham voi viec keo ben
  if (tool === "rail") {
    st.path.forEach((p, i) => {
      const on = sel && sel.kind === "v" && sel.i === i;
      ctx.fillStyle = on ? "#fff" : "#ffd05a";
      ctx.strokeStyle = "#1a1630"; ctx.lineWidth = 2;
      const s = on ? 11 : 8;
      ctx.beginPath(); ctx.rect(X(p.x) - s / 2, Y(p.y) - s / 2, s, s);
      ctx.fill(); ctx.stroke();
    });
  }
}

// ---------------------------------------------------------------- tuong tac tren ban ve

function hit(pt) {
  const R = 14 / view.s;
  if (tool === "rail") {
    for (let i = 0; i < st.path.length; i++)
      if (Math.hypot(st.path[i].x - pt.x, st.path[i].y - pt.y) < R) return { kind: "v", i };
  }
  if (game) {
    for (const t of game.trucks) {
      // cham vao BAT KY cho nao cua than xe, khong chi diem neo - than xe la thu nhin thay
      const a = game.slotPos(t, 0, 0), z = game.slotPos(t, t.cap - 1, 1);
      const dx = z.x - a.x, dy = z.y - a.y, L2 = dx * dx + dy * dy || 1;
      let u = ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / L2;
      u = Math.max(0, Math.min(1, u));
      const cxp = a.x + dx * u, cyp = a.y + dy * u;
      if (Math.hypot(cxp - pt.x, cyp - pt.y) < game.truckW / 2 + 0.2)
        return { kind: "dock", lane: t.lane };
    }
  }
  return null;
}

cv.addEventListener("pointerdown", (e) => {
  if (!st) return;
  const pt = evPt(e);
  const h = hit(pt);
  if (h) {
    sel = h;
    const at = h.kind === "v" ? st.path[h.i] : st.docks[h.lane];
    drag = { off: { x: at.x - pt.x, y: at.y - pt.y } };
    cv.setPointerCapture(e.pointerId);
  } else if (tool === "rail") {
    insertVertex(pt);
  } else {
    sel = null;
  }
  draw(); renderLanes();
});

cv.addEventListener("pointermove", (e) => {
  if (!drag || !sel) return;
  const pt = evPt(e);
  const snap = e.altKey ? (v) => r2(v) : (v) => Math.round(v * 2) / 2;
  const nx = snap(pt.x + drag.off.x), ny = snap(pt.y + drag.off.y);
  const at = sel.kind === "v" ? st.path[sel.i] : st.docks[sel.lane];
  if (at.x === nx && at.y === ny) return;
  at.x = nx; at.y = ny;
  if (sel.kind === "dock") at.rot = autoRot(at);
  dirty = true;
  apply(false);
});

cv.addEventListener("pointerup", () => { drag = null; });

cv.addEventListener("wheel", (e) => {
  e.preventDefault();
  const k = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  view.s = Math.max(4, Math.min(90, view.s * k));
  draw();
}, { passive: false });

window.addEventListener("keydown", (e) => {
  if (e.key !== "Delete" && e.key !== "Backspace") return;
  if (document.activeElement && /INPUT|SELECT/.test(document.activeElement.tagName)) return;
  if (!sel) return;
  e.preventDefault();
  if (sel.kind === "v") {
    if (st.path.length <= 3) return flash("Ray phải còn ít nhất 3 đỉnh");
    st.path.splice(sel.i, 1);
  } else {
    removeLane(sel.lane);
  }
  sel = null; dirty = true; apply(false);
});

// Chen mot dinh vao DOAN GAN NHAT, khong phai noi vao cuoi: noi vao cuoi thi ray tu that nut
// moi lan them diem, va nguoi ve phai tu doan thu tu dinh.
function insertVertex(pt) {
  const n = st.path.length;
  let bi = 0, bd = Infinity;
  const segs = st.closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = st.path[i], b = st.path[(i + 1) % n];
    const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1;
    let u = ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / L2;
    u = Math.max(0, Math.min(1, u));
    const d = Math.hypot(a.x + dx * u - pt.x, a.y + dy * u - pt.y);
    if (d < bd) { bd = d; bi = i; }
  }
  st.path.splice(bi + 1, 0, { x: Math.round(pt.x * 2) / 2, y: Math.round(pt.y * 2) / 2 });
  sel = { kind: "v", i: bi + 1 };
  dirty = true;
  apply(false);
}

// ---------------------------------------------------------------- bang khay / mau

const LETTERS = "ABCDEFGHIJKLMNOP".split("");

function addLane() {
  const used = new Set(st.lanes.map((l) => l.lane));
  const key = LETTERS.find((k) => !used.has(k));
  if (!key) return flash("Hết chữ cái cho khay (tối đa 16)");
  // Dat ben canh ray, o cho thoang nhat co the tim nhanh: lui ra khoi diem ray xa cac ben khac
  // nhat mot khoang bang than xe.
  let best = game.ring[0], bd = -Infinity;
  for (const p of game.ring) {
    let d = Infinity;
    for (const t of game.trucks) d = Math.min(d, Math.hypot(t.x - p.x, t.y - p.y));
    if (d > bd) { bd = d; best = p; }
  }
  const c = { x: (game.bounds.x0 + game.bounds.x1) / 2, y: (game.bounds.y0 + game.bounds.y1) / 2 };
  const ux = best.x - c.x, uy = best.y - c.y, L = Math.hypot(ux, uy) || 1;
  const d = { x: Math.round((best.x + (ux / L) * 4) * 2) / 2, y: Math.round((best.y + (uy / L) * 4) * 2) / 2, rot: 0 };
  d.rot = autoRot(d);
  st.docks[key] = d;
  st.lanes.push({ lane: key, blocks: [{ color: brush, hidden: false, key: null }] });
  sel = { kind: "dock", lane: key };
  dirty = true;
  apply(false);
}

function removeLane(lane) {
  st.lanes = st.lanes.filter((l) => l.lane !== lane);
  delete st.docks[lane];
  if (!st.lanes.length) { st.lanes.push({ lane: "A", blocks: [{ color: brush, hidden: false, key: null }] }); st.docks.A = { x: 0, y: 0, rot: 0 }; }
}

function renderLanes() {
  const box = $("laneList");
  box.replaceChildren();
  for (const l of st.lanes) {
    const el = document.createElement("div");
    el.className = "lane" + (sel && sel.kind === "dock" && sel.lane === l.lane ? " sel" : "");
    const hd = document.createElement("div");
    hd.className = "hd";
    const b = document.createElement("b"); b.textContent = l.lane; hd.appendChild(b);
    const del = document.createElement("button");
    del.textContent = "Xoá khay"; del.onclick = () => { removeLane(l.lane); dirty = true; apply(false); };
    hd.appendChild(del);
    el.appendChild(hd);

    const chips = document.createElement("div");
    chips.className = "chips";
    l.blocks.forEach((blk, i) => {
      const c = document.createElement("div");
      c.className = "chip" + (blk.hidden ? " hid" : "");
      c.style.background = E.PALETTE[blk.color] || "#888";
      c.title = "Nhấp: tô màu đang chọn · Shift: ẩn/hiện · Chuột phải: xoá";
      c.onclick = (ev) => {
        if (ev.shiftKey) blk.hidden = !blk.hidden; else blk.color = brush;
        dirty = true; apply(false);
      };
      c.oncontextmenu = (ev) => {
        ev.preventDefault();
        l.blocks.splice(i, 1);
        if (!l.blocks.length) removeLane(l.lane);
        dirty = true; apply(false);
      };
      chips.appendChild(c);
    });
    const add = document.createElement("div");
    add.className = "chip add"; add.textContent = "+";
    add.onclick = () => { l.blocks.push({ color: brush, hidden: false, key: null }); dirty = true; apply(false); };
    chips.appendChild(add);
    el.appendChild(chips);

    el.addEventListener("pointerdown", () => { sel = { kind: "dock", lane: l.lane }; draw(); renderLanes(); });
    box.appendChild(el);
  }
  drawPalette();
  draw();
}

function drawPalette() {
  let p = $("palette");
  if (!p) {
    p = document.createElement("div");
    p.id = "palette"; p.className = "row";
    p.style.marginTop = "8px";
    $("lanes").insertBefore(p, $("addLane").parentElement);
  }
  p.replaceChildren();
  for (const k of Object.keys(E.PALETTE)) {
    const s = document.createElement("div");
    s.className = "sw" + (k === brush ? " on" : "");
    s.style.background = E.PALETTE[k];
    s.title = k;
    s.onclick = () => { brush = k; drawPalette(); };
    p.appendChild(s);
  }
}

// ---------------------------------------------------------------- kiem tra

function validate() {
  const box = $("msgs");
  box.replaceChildren();
  const add = (cls, txt) => {
    const d = document.createElement("div"); d.className = cls; d.textContent = txt; box.appendChild(d);
  };
  if (!game) return add("bad", "Không dựng được bàn cờ.");

  // ⚠ Phep kiem quan trong nhat cua ca tro choi: DELIVER = 4, nen mot mau khong chia het cho 4
  // la mot mau khong bao giờ giao xong - ban co KHONG THE THANG, va khong co gi tren man hinh
  // noi dieu do ra. Kiem nay dung truoc moi kiem khac.
  const cnt = {};
  for (const l of st.lanes) for (const b of l.blocks) cnt[b.color] = (cnt[b.color] || 0) + 1;
  const bad = Object.entries(cnt).filter(([, n]) => n % E.DELIVER !== 0);
  if (bad.length) add("bad", "Không chia hết cho " + E.DELIVER + ": " +
    bad.map(([c, n]) => `${c}=${n}`).join(", ") + " → bàn không thể thắng");
  else add("ok", `Màu: ${Object.keys(cnt).length} · khối: ${Object.values(cnt).reduce((a, b) => a + b, 0)} · chia hết ✓`);

  const over = st.lanes.filter((l) => l.blocks.length > E.CAP);
  if (over.length) add("warn2", `Khay quá ${E.CAP} khối: ${over.map((l) => l.lane).join(", ")}`);

  // `fit` < 1 nghia la engine da phai CO NHO ca dan xe de chung khong de len nhau. Day chinh la
  // cai lam "vali va khay be ti" - nen no phai hien ra o day thay vi chi thay khi nhin man hinh.
  if (game.fit < 0.999)
    add("bad", `Bến chồng nhau: engine co xe còn ${(game.fit * 100).toFixed(0)}% → hàng sẽ nhỏ đi`);
  else add("ok", "Bến không chồng nhau ✓");

  let worst = 0, far = 0;
  for (const t of game.trucks) {
    const vx = t.px - t.x, vy = t.py - t.y, L = Math.hypot(vx, vy) || 1;
    const dot = Math.max(-1, Math.min(1, (t.mx * vx + t.my * vy) / L));
    worst = Math.max(worst, Math.acos(dot) * 180 / Math.PI);
    far = Math.max(far, L);
  }
  if (worst > 12) add("warn2", `Có bến lệch ${worst.toFixed(0)}° so với hướng ray (nên ≤ 12°)`);
  if (far > 4.6) add("warn2", `Bến xa ray nhất ${far.toFixed(1)} đv (nên 1,8–4,6)`);

  const b = game.bounds;
  add("", `Khung bàn ${(b.x1 - b.x0).toFixed(1)} × ${(b.y1 - b.y0).toFixed(1)} · ` +
    `ray dài ${game.len.toFixed(1)} · ${st.lanes.length} khay · ${st.slot} chỗ`);
  if (st.lanes.length < 2) add("bad", "Cần ít nhất 2 khay");
}

function flash(t) {
  const d = document.createElement("div");
  d.className = "warn2"; d.textContent = t;
  $("msgs").prepend(d);
}

// ---------------------------------------------------------------- luu / xuat

async function save() {
  const body = {
    id: lvId, slot: st.slot, closed: st.closed,
    spline: serSpline(), colorData: serCarrier(),
  };
  try {
    const r = await fetch("/__loopsort/save", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.status);
    dirty = false;
    $("saveInfo").textContent =
      `Đã lưu level ${lvId} → carrier ${j.carrier}, spline ${j.spline} (${j.cloned ? "nhân bản mới" : "sửa tại chỗ"})`;
  } catch (err) {
    $("saveInfo").textContent = "Lưu hỏng: " + err.message + " — dùng Xuất JSON.";
  }
}

function exportJson() {
  const lv = E.LEVELS[lvId];
  const blob = new Blob([JSON.stringify({
    Level: { ...lv, SlotCount: st.slot },
    Carrier: { Id: lv.Carriers, ColorData: serCarrier(), Features: "-", Colors: null },
    Spline: { ...E.SPLINES[lv.Spline], Spline: serSpline(), Closed: st.closed },
  }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `loopsort-level-${lvId}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------------------------------------------------------------- noi day

$("open").onclick = () => load(+$("lvNum").value || 1);
$("lvNum").onchange = () => load(+$("lvNum").value || 1);
$("slot").onchange = () => { st.slot = Math.max(1, +$("slot").value || 1); dirty = true; apply(false); };
$("closed").onchange = () => { st.closed = $("closed").checked; dirty = true; apply(false); };
$("tool").onchange = () => { tool = $("tool").value; sel = null; draw(); };
$("fit").onclick = () => { fitView(); draw(); };
$("addLane").onclick = addLane;
$("save").onclick = save;
$("export").onclick = exportJson;
$("revert").onclick = () => {
  // ⚠ Tai lai ca trang: `apply` da ghi de SPLINES/CARRIERS trong bo nho, nen "bo sua" chi that
  // su bo khi du lieu duoc doc lai tu dia.
  if (!dirty || confirm("Bỏ mọi sửa chưa lưu?")) location.reload();
};
window.addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
window.addEventListener("resize", resize);

$("play").onclick = () => {
  window.open(`./index.html?level=${lvId}`, "_blank");
  if (dirty) flash("Chơi thử mở BẢN ĐÃ LƯU — sửa chưa lưu không có trong đó.");
};

// Xem truoc bang chinh bo ve 3D cua game: mot editor ve bang bo ve rieng la mot cai nhin thu
// hai ve cung mot bàn cờ, va hai cai nhin do se troi khoi nhau.
await E.loadData();
const params = new URLSearchParams(location.search);
load(+params.get("level") || 1);
$("slot").value = st.slot;
$("closed").checked = st.closed;
mountThree($("frame"), () => game);

// ⚠ Cua do, cung ly do `window.__ls` ton tai ben app.js: khong co no thi khong mot phep kiem
// nao cham duoc vao editor, va "da thu roi" chi con la mot cau noi. `st` tra ve BAN THAT chu
// khong phai ban sao - phep kiem phai sua duoc dung cai trang thai ma man hinh dang ve.
window.__ed = {
  st: () => st,
  game: () => game,
  load,
  apply,
  sel: (s) => { sel = s; draw(); renderLanes(); },
  ser: () => ({ spline: serSpline(), colorData: serCarrier() }),
};
new ResizeObserver(resize).observe(cv.parentElement);
resize();
