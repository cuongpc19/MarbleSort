// Loop Sort - ban dung lai tu du lieu mo APK (Manythings/LoopSort-teardown).
// Cong cu noi bo de choi thu level design cua ho. KHONG dung art cua ho, KHONG ship.
//
// Luat va nhip animation deu DO tu clip gameplay lv1-5, khong doan:
//   - do hang  : cham -> gon song trang -> khoi vo vun tai cho (~110ms)
//                -> cube tuon thanh day roi xuong ray (~390ms/khoi)
//   - hut vao  : cube roi ray, LEO NGUOC len trong long ben, nhap vao khoi dang lon
//                dan tu day ben. Mot khoi mat ~850ms.
//   - ben day  : confetti + dau tick tim, HANG rut dan het (~830ms), THAN BEN O LAI rong.
//                Cai roi di la hang, khong phai xe - khoang xe la ben co dinh.
//   - toc do   : ~20 don vi/giay, do theo dau dong cube o level 5 (t=74.5 -> 76.0).

const DATA = "../../Manythings/LoopSort-teardown/data/";

// Do tu clip: hang do #ce1528, xanh duong #4191ec, vang #f6c12b - dam va bao hoa hon
// bang mau dau tien minh dat theo cam tinh. Nhung mau khong do duoc thi keo theo cung
// muc bao hoa do.
const PALETTE = {
  R: "#ce1528", O: "#ef7d13", Y: "#f6c12b", G: "#35b23f", B: "#4191ec",
  P: "#8a3fd0", PNK: "#ef4f9c", GR: "#8590a6", BR: "#96592c", LB: "#4fc8e8",
  DG: "#177038", BL: "#31363f", W: "#eef1f6", LPNK: "#f79ac0", DPNK: "#c31f6e",
};
const HIDDEN_FILL = "#5b5480";

// Mau san, do tung diem tren khung hinh t=41.5 cua clip.
const UI = {
  bgTop: "#241d52", bgBot: "#1b1644",
  rim: "#5f4f9e", rimLit: "#8574c4", rimEdge: "#cfc4ee",
  groove: "#332c67", grooveEdge: "#241f52",
  inner: "#2a2464",
  bay: "#6e51af", bayDark: "#43317a", baySocket: "#4a3780",
  bayDone: "#3f3768", bayDoneDark: "#2e2851",
  wheel: "#343732",
  mark: "rgba(255,255,255,.055)",
};
const RIM = 0.85;   // be rong mot go noi, moi ben
const CONFETTI = ["#f5c518", "#3fbf4f", "#2f8fe0", "#ef5fa7", "#f2892a", "#5fd0e8", "#e8442e"];

const CAP = 4;            // suc chua mot ben khi bat dau = 4 khoi
const DELIVER = 4;        // so khoi cung mau de mot chuyen hang duoc giao
                          // (moi mau xuat hien dung 4 lan tren toan bo 800 bo carrier)
const SLOT_LEN = 1.5;     // dai mot o hang - do tren clip: xe dai ~6.2 dv cho 4 o
const TRUCK_W = 2.6;   // rong than xe, cung do tu clip
const SPEED = 19.0;       // don vi luoi / giay - do tu clip
const CRUMBLE_MS = 110;   // khoi vo vun tai cho truoc khi tuon ra
const POUR_STAGGER = 14;  // khoang cach giua hai cube roi khoi mieng ben (~390ms/khoi)
const EAT_MS = 30;        // nhip hut mot cube (~850ms/khoi, khop clip)
const ABSORB_MS = 190;    // thoi gian bay tu ray len khoang hang
const DRAIN_MS = 830;     // hang rut khoi ben khi day
const CHECK_MS = 1500;    // dau tick con nam lai
const RIPPLE_MS = 360;

// --- physics ---
// Ray la mot MANG CO BE RONG, khong phai hang doi mot chieu: trong ban goc cube don
// thanh dong 2 hat ngang va xo nhau. Bang chuyen keo cube toi SPEED, va cham giu chung
// lai - nen he qua la "thay cho trong phia truoc thi troi vao", khong can luat rieng.
const CHANNEL = 0.62;     // nua be rong mang, tinh tu tim ray
const DRIVE = 11;         // do bam cua bang chuyen (1/giay)
const PULL = 34;          // luc keo ve tim mang khi cube lech ra ngoai
const NDAMP = 7;          // ma sat theo phuong NGANG (1/giay)
const BOUNCE = 0.05;      // cube la khoi dac, gan nhu khong nay
const SUBSTEPS = 2;
const RELAX = 3;          // so lan go chong lan moi buoc

// ------------------------------------------------------------------ du lieu

let LEVELS, CARRIERS, SPLINES, AREAS;

export async function loadData() {
  const get = async (f) => (await fetch(DATA + f)).json();
  const files = ["Levels.json", "Carriers.json", "Splines.json", "Areas.json"];
  const [lv, ca, sp, ar] = await Promise.all(files.map(get));
  LEVELS = Object.fromEntries(lv.map((x) => [x.Id, x]));
  CARRIERS = Object.fromEntries(ca.map((x) => [x.Id, x]));
  SPLINES = Object.fromEntries(sp.map((x) => [x.Id, x]));
  AREAS = ar.slice().sort((a, b) => a.UnlockLevel - b.UnlockLevel);
}

export function areaOf(id) {
  let a = null;
  for (const x of AREAS) if (x.UnlockLevel <= id) a = x;
  return a ? a.Type : "";
}

// "A\n90\n0,0.25;6;8" -> {idx:null, mk:"A", rot:90, x:6, y:8}
function parseNode(raw) {
  const p = raw.split(";");
  const lines = p[0].split("\n");
  const head = lines[0].trim();
  const digit = head.match(/^([0-9]+)/);
  const letter = head.match(/^([A-Z])/);
  const rot = lines.length > 1 ? parseFloat(lines[1]) : NaN;
  return {
    idx: digit && !letter ? +digit[1] : null,
    mk: letter ? letter[1] : null,
    rot: isNaN(rot) ? 0 : rot,
    x: +p[1], y: +p[2],
  };
}

// ⚠ Truc y trong du lieu huong LEN, nguoc man hinh, nen doi dau ngay tu day.
// Bang chung: level 1, ben do hang thi cube chay xuong duoi => ray nam duoi ben, chi dung
// neu y tang len tren. Level 5 cung khop: khay "G B R Y" trong clip la lan C, nam o TREN.
function parseSpline(s) {
  const path = [], docks = {};
  for (const raw of s.Spline.split(":")) {
    const n = parseNode(raw);
    if (n.idx !== null) path.push({ idx: n.idx, x: n.x, y: -n.y });
    else if (n.mk && n.mk !== "Q") docks[n.mk] = { x: n.x, y: -n.y, rot: n.rot };
  }
  path.sort((a, b) => a.idx - b.idx);
  return { closed: !!s.Closed, spacing: s.Spacing || 0.58, path, docks };
}

// "A;R;GR_H;B_K_Y" -> [{lane:"A", blocks:[{color,hidden,key,seen}]}]
function parseCarrier(c) {
  const out = [];
  for (const seg of c.ColorData.split(":")) {
    const p = seg.split(";").map((t) => t.trim()).filter(Boolean);
    if (p.length < 2) continue;
    const blocks = p.slice(1).map((tok) => {
      const m = tok.match(/^([A-Z]+?)(_H)?(?:_K_([A-Z]+))?$/);
      return m
        ? { color: m[1], hidden: !!m[2], key: m[3] || null, seen: false }
        : { color: tok.split("_")[0], hidden: false, key: null, seen: false };
    });
    out.push({ lane: p[0], blocks });
  }
  return out;
}

// ------------------------------------------------------------------ hinh hoc

function roundedPath(pts, closed, r) {
  const n = pts.length, out = [];
  const seg = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  const first = closed ? 0 : 1;
  const last = closed ? n : n - 1;
  if (!closed) out.push({ x: pts[0].x, y: pts[0].y });
  for (let i = first; i < last; i++) {
    const p = pts[i % n], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const rr = Math.min(r, seg(a, p) / 2, seg(p, b) / 2);
    const s = lerp(p, a, rr / Math.max(seg(a, p), 1e-6));
    const e = lerp(p, b, rr / Math.max(seg(p, b), 1e-6));
    const STEPS = 10;
    for (let k = 0; k <= STEPS; k++) {
      const t = k / STEPS, u = 1 - t;
      out.push({
        x: u * u * s.x + 2 * u * t * p.x + t * t * e.x,
        y: u * u * s.y + 2 * u * t * p.y + t * t * e.y,
      });
    }
  }
  if (!closed) out.push({ x: pts[n - 1].x, y: pts[n - 1].y });
  return out;
}

// Bam nho moi doan dai. roundedPath chi tra ve diem cua cung bo goc, nen doan thang
// giua hai goc khong co dinh nao o giua - va phep tim diem ray gan nhat (tim theo dinh)
// se nhay ra tan goc, dat mieng ben quay sai huong. Bam nho la cach re nhat.
function densify(pts, closed, maxLen) {
  const out = [];
  const n = pts.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const k = Math.max(1, Math.ceil(d / maxLen));
    for (let j = 0; j < k; j++)
      out.push({ x: a.x + (b.x - a.x) * (j / k), y: a.y + (b.y - a.y) * (j / k) });
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

function totalLen(pts, closed) {
  let L = 0;
  const n = pts.length, last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    L += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return L;
}

const easeOut = (t) => 1 - (1 - t) * (1 - t);

// Huong mieng ben, suy tu goc quay trong du lieu. Quy uoc doi chieu tren 4 level dau:
//   0 -> xuong, 90 -> trai, 180 -> len, 270 -> phai  (toa do MAN HINH, y huong xuong)
// ⚠ Phai dung goc nay chu khong phai "diem ray gan nhat": o level 4 ba ben cach canh
// tren va canh phai BANG NHAU, phep tim gan nhat hoa nhau va quay ngang ba cai xe,
// lam chung chong len nhau.
function mouthFromRot(deg) {
  const a = (deg || 0) * Math.PI / 180;
  return { x: -Math.sin(a), y: Math.cos(a) };
}

// ------------------------------------------------------------------ game

export class Game {
  constructor(id) {
    const lv = LEVELS[id];
    this.id = id;
    this.lv = lv;
    const sp = parseSpline(SPLINES[lv.Spline]);
    this.geo = sp;
    this.closed = sp.closed;

    this.ring = densify(roundedPath(sp.path, sp.closed, 2.2), sp.closed, 0.25);
    this.len = totalLen(this.ring, sp.closed);

    this.r = sp.spacing * 0.42;                 // ban kinh cube
    const d = this.r * 2;
    this.abreast = Math.max(1, Math.floor((2 * (CHANNEL - this.r)) / d) + 1);
    this.railSlots = Math.floor((this.len / d) * this.abreast * 0.8);
    this.slotCount = lv.SlotCount;
    this.perBlock = Math.max(6, Math.min(40, Math.round(this.railSlots / this.slotCount)));
    this.capCubes = this.slotCount * this.perBlock;

    this.trucks = parseCarrier(CARRIERS[lv.Carriers]).map((t) => {
      const dk = sp.docks[t.lane];
      const d = mouthFromRot(dk.rot);
      const near = this.railToward(dk.x, dk.y, d.x, d.y);
      return {
        lane: t.lane, blocks: t.blocks, x: dk.x, y: dk.y, mx: d.x, my: d.y,
        px: near.px, py: near.py,
        cap: CAP, fill: 0, claim: null, lastDump: null, gone: false, ate: 0, ripple: -1, drain: -1, check: -1, confetti: [],
      };
    });
    for (const t of this.trucks) this.reveal(t);

    this.cubes = [];   // {x,y,vx,vy,rot,vrot,color,sz,seg}
    this.pending = []; // {color, truck, at}
    this.flying = [];  // hieu ung: cube dang bay tu ray vao khoang hang
    this.state = "play";
    this.taps = 0;
    this.peak = 0;
    this.history = [];
    this.now = performance.now();
    this.bounds = this.computeBounds();
  }

  // Diem ray gan nhat NAM VE PHIA mieng ben dang quay toi.
  railToward(x, y, dx, dy) {
    let best = null, bd = Infinity;
    for (const p of this.ring) {
      const vx = p.x - x, vy = p.y - y;
      if (vx * dx + vy * dy <= 0) continue;
      const d = vx * vx + vy * vy;
      if (d < bd) { bd = d; best = p; }
    }
    return best ? { px: best.x, py: best.y } : this.nearestPoint(x, y);
  }

  nearestPoint(x, y) {
    let bi = 0, bd = Infinity;
    for (let i = 0; i < this.ring.length; i++) {
      const dx = this.ring[i].x - x, dy = this.ring[i].y - y;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; bi = i; }
    }
    return { i: bi, px: this.ring[bi].x, py: this.ring[bi].y };
  }

  computeBounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (x, y) => {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    };
    for (const p of this.ring) add(p.x, p.y);
    for (const t of this.trucks) {
      const L = t.cap * SLOT_LEN + 0.5, w = TRUCK_W / 2 + 0.3;
      for (const k of [0, L])
        for (const sgn of [-1, 1])
          add(t.x - t.mx * k - t.my * sgn * w, t.y - t.my * k + t.mx * sgn * w);
    }
    const pad = CHANNEL + RIM + 0.5;   // vong ray rong ra hai ben tim duong
    return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  }

  reveal(t) {
    if (t.blocks.length) t.blocks[t.blocks.length - 1].seen = true;
  }

  // Diem giua o hang thu i. i=0 la day ben (xa mieng nhat).
  slotPos(t, i, frac) {
    const along = t.cap * SLOT_LEN - (i + (frac === undefined ? 0.5 : frac)) * SLOT_LEN;
    return { x: t.x - t.mx * along, y: t.y - t.my * along };
  }

  // Ben nay co nhan mau nay khong.
  //  - dang gom do mot khoi roi -> chi nhan dung mau do
  //  - ben RONG                 -> nhan bat ky mau nao, mau dau tien toi chiem ben
  //  - con lai                  -> "Hut thoang" (mac dinh): khop mau khoi o mieng;
  //                                tat di: ca ben phai dang thuan mot mau
  //
  // ⚠ Co cho phep mot mau bi CHIA giua hai ben, va do khong phai loi. Truoc day o day
  // co mot rang buoc cam chia, dat tren ket luan sai rang chia la chet: level 1 chia
  // 4 khoi do thanh A:1 / B:2 + 1 con lan, va trong do van thang duoc - chi ton them
  // mot lan cham vao A de don not sang B. Chia lam ban dai ra, khong lam ban hong.
  accepts(t, color) {
    if (t.gone || t.blocks.length >= t.cap) return false;
    // ⚠ Khong bao gio hut lai mau minh vua do ra. Thieu dieu nay thi mot ben do het
    // hang xong se rong, va hut nguoc chinh dong cube vua tuon ra khoi mieng no - cube
    // chui ra roi quay dau chui vao lai. Day moi la ly do that su ban goc de ben rong
    // tro; cam chia mau (cach cu cua minh) la chua dung benh.
    if (color === t.lastDump) return false;
    if (t.fill > 0) return color === t.claim;
    if (!t.blocks.length) return true;
    if (EAGER) return color === t.blocks[t.blocks.length - 1].color;
    const c = t.blocks[0].color;
    return color === c && t.blocks.every((b) => b.color === c);
  }

  // Mau dai dien cho HUD/bot. "*" nghia la ben rong, dang cho mau dau tien toi.
  wants(t) {
    if (t.gone || t.blocks.length >= t.cap) return null;
    if (t.fill > 0) return t.claim;
    if (!t.blocks.length) return t.lastDump ? "*" : "*";
    if (!t.blocks.length) return "*";
    if (EAGER) return t.blocks[t.blocks.length - 1].color;
    const c = t.blocks[0].color;
    return t.blocks.every((b) => b.color === c) ? c : null;
  }

  loose() { return this.cubes.length + this.pending.length; }
  counter() { return Math.ceil(this.loose() / this.perBlock); }

  tap(t) {
    if (this.state !== "play" || t.gone || !t.blocks.length || t.drain >= 0) return false;
    const now = this.now;
    t.ripple = now;
    const c = t.blocks[t.blocks.length - 1].color;
    let n = 0;
    while (t.blocks.length && t.blocks[t.blocks.length - 1].color === c) {
      t.blocks.pop();
      n++;
    }
    t.fill = 0;
    t.claim = null;
    t.lastDump = c;
    this.reveal(t);
    this.taps++;
    this.history.push({ truck: t, color: c, n });
    for (let i = 0; i < n * this.perBlock; i++)
      this.pending.push({ color: c, truck: t, at: now + CRUMBLE_MS + i * POUR_STAGGER });
    this.peak = Math.max(this.peak, this.counter());
    if (this.counter() > this.slotCount) this.state = "lose";
    return true;
  }

  // Hang roi ben. Than ben o lai (ben co dinh), chi hang rut di.
  finish(t, full) {
    const now = this.now;
    t.gone = true;
    if (full) {
      t.drain = now;
      t.check = now;
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2, sp = 1.6 + Math.random() * 4.4;
        t.confetti.push({
          x: t.x, y: t.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
          rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 14,
          col: CONFETTI[(Math.random() * CONFETTI.length) | 0], life: 0,
        });
      }
    }
  }

  // ---------------------------------------------------------------- physics

  // Diem ray gan nhat + tiep tuyen, tim quanh vi tri lan truoc nen ton O(1).
  probe(c) {
    const pts = this.ring, n = pts.length;
    let best = -1, bd = Infinity;
    const look = (i) => {
      const j = this.closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i));
      const dx = pts[j].x - c.x, dy = pts[j].y - c.y;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = j; }
    };
    if (c.seg === undefined) for (let i = 0; i < n; i++) look(i);
    else for (let k = -14; k <= 14; k++) look(c.seg + k);
    c.seg = best;
    const ia = this.closed ? (best - 1 + n) % n : Math.max(0, best - 1);
    const ib = this.closed ? (best + 1) % n : Math.min(n - 1, best + 1);
    let tx = pts[ib].x - pts[ia].x, ty = pts[ib].y - pts[ia].y;
    const m = Math.hypot(tx, ty) || 1;
    return { px: pts[best].x, py: pts[best].y, tx: tx / m, ty: ty / m };
  }

  physics(dt) {
    const cubes = this.cubes;
    const n = cubes.length;
    if (!n) return;
    const r = this.r, dd2 = (r * 2) * (r * 2);
    const lim = CHANNEL - r, maxOff = lim + 3.5;
    const endI = this.ring.length - 1;

    for (const c of cubes) {
      const p = this.probe(c);
      const nx = -p.ty, ny = p.tx;
      const off = (c.x - p.px) * nx + (c.y - p.py) * ny;
      let vt = c.vx * p.tx + c.vy * p.ty;
      let vn = c.vx * nx + c.vy * ny;

      if (!c.landed && Math.abs(off) <= lim) c.landed = true;
      if (c.landed) {
        vt += (SPEED - vt) * Math.min(1, DRIVE * dt);  // bang chuyen keo phuong DOC
        vn *= Math.exp(-NDAMP * dt);                   // ma sat ngang, cho cube lang xuong
      } else {
        vn -= Math.sign(off) * PULL * dt;              // dang roi tu mieng ben xuong mang
      }
      c.vx = p.tx * vt + nx * vn;
      c.vy = p.ty * vt + ny * vn;
      c.x += c.vx * dt; c.y += c.vy * dt;

      if (c.landed) {
        // ⚠ Thanh mang la VACH CUNG, khong phai lo xo. O 19 dv/giay, om goc bo ban kinh
        // 2.2 can gia toc huong tam 86 dv/giay2 - lo xo 34 khong giu noi, nen cube van ra
        // ngoai o moi goc va ca dong treo cach ray 2 don vi, khong ben nao hut duoc.
        const o2 = (c.x - p.px) * nx + (c.y - p.py) * ny;
        if (Math.abs(o2) > lim) {
          const sg = Math.sign(o2), over = Math.abs(o2) - lim;
          c.x -= nx * over * sg; c.y -= ny * over * sg;
          const v2 = c.vx * nx + c.vy * ny;
          if (v2 * sg > 0) { c.vx -= nx * v2; c.vy -= ny * v2; }
        }
      } else if (Math.abs(off) > maxOff) {
        const sg = Math.sign(off), over = Math.abs(off) - maxOff;
        c.x -= nx * over * sg; c.y -= ny * over * sg;
      }

      c.vrot *= 0.93;
      c.rot += c.vrot * dt;

      // ray ho: ra khoi dau nay thi vao lai dau kia (Portal)
      if (!this.closed && c.seg >= endI - 1) {
        const e = this.ring[endI];
        if ((c.x - e.x) * p.tx + (c.y - e.y) * p.ty > 0) {
          c.x = this.ring[0].x; c.y = this.ring[0].y;
          c.seg = 0;
        }
      }
    }

    // go chong lan: luoi khong gian, vai lan lap cho dong on dinh
    const cell = r * 2.2;
    for (let pass = 0; pass < RELAX; pass++) {
      const grid = new Map();
      for (let i = 0; i < n; i++) {
        const c = cubes[i];
        const key = ((c.x / cell) | 0) + "," + ((c.y / cell) | 0);
        let a = grid.get(key);
        if (!a) grid.set(key, (a = []));
        a.push(i);
      }
      for (let i = 0; i < n; i++) {
        const a = cubes[i];
        const cx = (a.x / cell) | 0, cy = (a.y / cell) | 0;
        for (let gx = cx - 1; gx <= cx + 1; gx++)
          for (let gy = cy - 1; gy <= cy + 1; gy++) {
            const arr = grid.get(gx + "," + gy);
            if (!arr) continue;
            for (const j of arr) {
              if (j <= i) continue;
              const b = cubes[j];
              let dx = b.x - a.x, dy = b.y - a.y;
              const dd = dx * dx + dy * dy;
              if (dd >= dd2 || dd === 0) continue;
              const dist = Math.sqrt(dd);
              dx /= dist; dy /= dist;
              const over = r * 2 - dist;
              a.x -= dx * over * 0.5; a.y -= dy * over * 0.5;
              b.x += dx * over * 0.5; b.y += dy * over * 0.5;
              if (pass === 0) {
                const rv = (b.vx - a.vx) * dx + (b.vy - a.vy) * dy;
                if (rv < 0) {
                  const imp = -(1 + BOUNCE) * rv * 0.5;
                  a.vx -= dx * imp; a.vy -= dy * imp;
                  b.vx += dx * imp; b.vy += dy * imp;
                  const kick = Math.min(6, Math.abs(imp) * 5);
                  a.vrot += (Math.random() - 0.5) * kick;
                  b.vrot += (Math.random() - 0.5) * kick;
                }
              }
            }
          }
      }
    }
  }

  step(dt, now) {
    this.now = now;
    for (const t of this.trucks) {
      for (const p of t.confetti) {
        p.life += dt; p.vy += 9 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      }
      t.confetti = t.confetti.filter((p) => p.life < 1.3);
    }
    this.flying = this.flying.filter((f) => now - f.at < f.ms);
    if (this.state !== "play") return;

    // nha cube dang cho ra khoi mieng ben. Khong can cho ray trong: cube ra la roi
    // vao mang, ray tac thi chung don ngay o mieng - dung nhu ban goc.
    for (let i = 0; i < this.pending.length; i++) {
      const p = this.pending[i];
      if (p.at > now) continue;
      const t = p.truck;
      const from = this.slotPos(t, CAP - 1, 0.5);
      const j = (Math.random() - 0.5) * 0.7;
      const sp = 5 + Math.random() * 3;
      this.cubes.push({
        x: from.x - t.my * j, y: from.y + t.mx * j,
        vx: t.mx * sp + (Math.random() - 0.5) * 2,
        vy: t.my * sp + (Math.random() - 0.5) * 2,
        rot: Math.random() * 6.3, vrot: (Math.random() - 0.5) * 8,
        sz: 0.9 + Math.random() * 0.2, color: p.color, seg: undefined,
      });
      this.pending.splice(i, 1);
      i--;
    }

    const h = dt / SUBSTEPS;
    for (let k = 0; k < SUBSTEPS; k++) this.physics(h);
    this.absorb(now);

    // Ben rong van song (van nhan hang), nen dieu kien thang la: khong con gi tren
    // ray, va moi ben hoac da giao xong hoac dang rong.
    if (!this.cubes.length && !this.pending.length &&
        this.trucks.every((t) => t.gone || !t.blocks.length))
      this.state = "win";
  }

  absorb(now) {
    const R = this.r * 2.6, R2 = R * R;
    for (const t of this.trucks) {
      if (t.gone || now - t.ate < EAT_MS) continue;
      for (let i = 0; i < this.cubes.length; i++) {
        const c = this.cubes[i];
        if (!this.accepts(t, c.color)) continue;
        const dx = c.x - t.px, dy = c.y - t.py;
        if (dx * dx + dy * dy > R2) continue;
        this.cubes.splice(i, 1);
        t.ate = now;
        if (!t.fill) { t.claim = c.color; t.lastDump = null; }
        this.history = this.history.filter((h) => h.color !== c.color);
        const to = this.slotPos(t, t.blocks.length, 1 - t.fill / this.perBlock);
        this.flying.push({
          at: now, ms: ABSORB_MS, color: c.color, rot: c.rot, sz: c.sz,
          fx: c.x, fy: c.y, tx: to.x, ty: to.y,
        });
        t.fill++;
        if (t.fill >= this.perBlock) {
          t.fill = 0;
          t.blocks.push({ color: t.claim, hidden: false, key: null, seen: true });
          t.claim = null;
          this.deliver(t);
        }
        break;
      }
    }
  }

  // Du DELIVER khoi cung mau thi chuyen hang do duoc giao. Voi cap = 4 (mac dinh) day
  // dung bang luat cu "day va thuan mot mau"; chi khi booster Extra Slot noi them o thi
  // moi co phan du o lai trong ben.
  deliver(t) {
    const cnt = {};
    for (const b of t.blocks) cnt[b.color] = (cnt[b.color] || 0) + 1;
    let X = null;
    for (const k in cnt) if (cnt[k] >= DELIVER) X = k;
    if (!X) return false;
    let left = DELIVER;
    t.blocks = t.blocks.filter((b) => (b.color === X && left-- > 0) ? false : true);
    if (!t.blocks.length) this.finish(t, true);
    else { t.flashDeliver = this.now; this.reveal(t); }
    return true;
  }

  // ---------------------------------------------------------------- booster
  // Bon cai, dung theo Boosters.json cua ban goc (Undo 300 / Shuffle 300 /
  // ConveyorCapacity 800 / Capacity 900, moi loai tang san 3).

  // "Undo the last block" - tra lai chuyen do vua roi vao ben cu.
  // ⚠ Chi lam duoc khi so cube cua mau do con lang thang du mot khoi tro len; neu chung
  // da bi hut mat thi khong the tra lai ma khong pha vo so hoc "moi mau dung 4 khoi".
  undo() {
    const last = this.history[this.history.length - 1];
    if (!last) return false;
    const have = this.cubes.filter((c) => c.color === last.color).length +
                 this.pending.filter((p) => p.color === last.color).length;
    const need = last.n * this.perBlock;
    if (have < need) return false;
    if (last.truck.blocks.length + last.n > last.truck.cap) return false;
    let k = need;
    this.pending = this.pending.filter((p) => !(p.color === last.color && k-- > 0));
    if (k > 0) {
      // bo cube xa mieng ben cu nhat truoc, cho gon mat
      const same = this.cubes
        .map((c, i) => ({ i, d: (c.x - last.truck.px) ** 2 + (c.y - last.truck.py) ** 2, c }))
        .filter((o) => o.c.color === last.color)
        .sort((a, b) => b.d - a.d)
        .slice(0, k)
        .map((o) => o.c);
      const drop = new Set(same);
      this.cubes = this.cubes.filter((c) => !drop.has(c));
    }
    for (let i = 0; i < last.n; i++)
      last.truck.blocks.push({ color: last.color, hidden: false, key: null, seen: true });
    last.truck.lastDump = null;
    this.reveal(last.truck);
    this.history.pop();
    this.state = "play";
    return true;
  }

  // "Tap the truck to shuffle" - dao thu tu hang trong mot ben.
  shuffle(t) {
    if (t.gone || t.blocks.length < 2) return false;
    for (let i = t.blocks.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [t.blocks[i], t.blocks[j]] = [t.blocks[j], t.blocks[i]];
    }
    for (const b of t.blocks) b.seen = b.seen || !b.hidden;
    this.reveal(t);
    t.lastDump = null;
    return true;
  }

  // "Extra Conveyor Slot" - noi them mot cho tren bang chuyen.
  addConveyorSlot() {
    this.slotCount++;
    this.capCubes = this.slotCount * this.perBlock;
    if (this.state === "lose" && this.counter() <= this.slotCount) this.state = "play";
    return true;
  }

  // "Extra Slot" / "Add extra slot" - noi them mot o hang cho MOT ben.
  // ⚠ Day la suy dien: du lieu chi cho ten va mot dong mo ta, clip khong co canh dung
  // booster nao. Ben dai them mot o, con dieu kien giao hang van la DELIVER khoi cung mau.
  addBaySlot(t) {
    if (t.gone) return false;
    t.cap++;
    this.bounds = this.computeBounds();
    return true;
  }

  // Hoi sinh: go TRON MOT MAU khoi ban - ca cube tren ray lan khoi trong moi ben.
  //
  // ⚠ Khong duoc chi xoa cube tren ray. Moi mau co dung 4 khoi va mot ben chua dung 4;
  // xoa cube ma de lai cho cho chung trong ben la ban co dat thanh khong the thang, va
  // nguoi choi se tuong do minh danh do. Day dung la bai hoc CLAUDE.md cua Ball Sort ghi
  // cho revive cua no: "mot thung va so bi cua no roi di cung nhau, luon luon".
  // Chon mau dang lang thang nhieu nhat - do la mau gay tac.
  revive() {
    const cnt = {};
    for (const c of this.cubes) cnt[c.color] = (cnt[c.color] || 0) + 1;
    for (const p of this.pending) cnt[p.color] = (cnt[p.color] || 0) + 1;
    let X = null, best = -1;
    for (const k in cnt) if (cnt[k] > best) { best = cnt[k]; X = k; }
    if (!X) return null;
    this.cubes = this.cubes.filter((c) => c.color !== X);
    this.pending = this.pending.filter((p) => p.color !== X);
    for (const t of this.trucks) {
      t.blocks = t.blocks.filter((b) => b.color !== X);
      if (t.claim === X) { t.claim = null; t.fill = 0; }
      if (t.lastDump === X) t.lastDump = null;
      this.reveal(t);
    }
    this.state = "play";
    return X;
  }

  hitTest(wx, wy) {
    for (const t of this.trucks) {
      if (t.gone) continue;
      const dx = wx - t.x, dy = wy - t.y;
      const along = -(dx * t.mx + dy * t.my); // doc than ben, tinh tu mieng
      const across = dx * -t.my + dy * t.mx;
      if (along >= -0.6 && along <= t.cap * SLOT_LEN + 0.6 && Math.abs(across) <= TRUCK_W / 2 + 0.4)
        return t;
    }
    return null;
  }
}

// ------------------------------------------------------------------ ve

let cv = null, ctx = null;
let game = null, view = null;
let EAGER = true;
let CHROME = true;   // dai HUD trong canvas - tat khi lam nen man Home

export function initCanvas(el) { cv = el; ctx = el.getContext("2d"); }
export function setGame(g) { game = g; layout(); }
export function getGame() { return game; }
export function setEager(v) { EAGER = v; }
export function setChrome(v) { CHROME = v; layout(); }
export function getEager() { return EAGER; }

// Doi toa do con tro sang toa do the gioi roi hoi xem trung ben nao.
export function pick(clientX, clientY) {
  if (!game || !view) return null;
  const r = cv.getBoundingClientRect();
  const dpr = cv.width / r.width;
  return game.hitTest(((clientX - r.left) * dpr - view.ox) / view.sc,
                      ((clientY - r.top) * dpr - view.oy) / view.sc);
}

export function layout() {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, Math.round(r.width * dpr));
  cv.height = Math.max(1, Math.round(r.height * dpr));
  if (!game) return;
  const b = game.bounds;
  const head = CHROME ? Math.round(cv.height * 0.092) : 0;
  const sc = Math.min(cv.width / (b.x1 - b.x0), (cv.height - head) / (b.y1 - b.y0));
  view = {
    sc, head,
    ox: (cv.width - (b.x1 - b.x0) * sc) / 2 - b.x0 * sc,
    oy: head + (cv.height - head - (b.y1 - b.y0) * sc) / 2 - b.y0 * sc,
  };
}

const SX = (x) => x * view.sc + view.ox;
const SY = (y) => y * view.sc + view.oy;

function roundRect(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Lam sang / toi mot mau hex. k > 0 keo ve trang, k < 0 keo ve den.
export function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255,
    Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return "rgb(" + f((n >> 16) & 255) + "," + f((n >> 8) & 255) + "," + f(n & 255) + ")";
}

// Cube: mat tren sang, canh duoi toi - de doc ra mot khoi dac chu khong phai o mau.
// Xoay tu do, vi trong ban goc chung la manh vun khong deu.
function drawCube(wx, wy, color, rot, sz) {
  const S = view.sc;
  const d = game.r * 2 * sz * S;
  ctx.save();
  ctx.translate(SX(wx), SY(wy));
  ctx.rotate(rot);
  ctx.fillStyle = shade(color, -0.3);
  roundRect(-d / 2, -d / 2, d, d, d * 0.24);
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(-d / 2, -d / 2, d, d * 0.76, d * 0.24);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.3)";
  roundRect(-d / 2 + d * 0.15, -d / 2 + d * 0.1, d * 0.7, d * 0.25, d * 0.12);
  ctx.fill();
  ctx.restore();
}

function ringPath() {
  const ring = game.ring;
  ctx.beginPath();
  ctx.moveTo(SX(ring[0].x), SY(ring[0].y));
  for (let i = 1; i < ring.length; i++) ctx.lineTo(SX(ring[i].x), SY(ring[i].y));
  if (game.closed) ctx.closePath();
}

function strokeRing(w, style) {
  ctx.strokeStyle = style;
  ctx.lineWidth = w * view.sc;
  ringPath();
  ctx.stroke();
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, cv.height);
  g.addColorStop(0, UI.bgTop);
  g.addColorStop(1, UI.bgBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
  const r = Math.max(cv.width, cv.height) * 0.8;
  const v = ctx.createRadialGradient(cv.width / 2, cv.height * 0.45, r * 0.2,
                                     cv.width / 2, cv.height * 0.45, r);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,3,22,.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, cv.width, cv.height);
}

// Tam giac mo rai doc long ranh. Ban goc co san hoa tiet nay tren mat nen; o day no
// kiem them mot viec: chi ro chieu chay cua ray.
function drawMarks() {
  const S = view.sc, ring = game.ring;
  const step = Math.max(6, Math.round(2.6 / 0.25));
  ctx.fillStyle = UI.mark;
  for (let i = 0; i < ring.length - 2; i += step) {
    const a = ring[i], b = ring[i + 2];
    ctx.save();
    ctx.translate(SX(a.x), SY(a.y));
    ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
    const t = 0.3 * S;
    ctx.beginPath();
    ctx.moveTo(t, 0);
    ctx.lineTo(-t * 0.72, t * 0.74);
    ctx.lineTo(-t * 0.72, -t * 0.74);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export function draw(now) {
  if (!game || !view) return;
  drawBackground();
  const W = CHANNEL * 2 + RIM * 2, GW = CHANNEL * 2;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // san ben trong vong ray
  if (game.closed) { ctx.fillStyle = UI.inner; ringPath(); ctx.fill(); }
  // go noi: bong do -> vien sang -> than go -> mat go sang hon -> mep ranh -> long ranh
  ctx.save();
  ctx.translate(0, 0.22 * view.sc);
  strokeRing(W + 0.5, "rgba(9,5,26,.42)");
  ctx.restore();
  strokeRing(W + 0.2, UI.rimEdge);
  strokeRing(W, UI.rim);
  strokeRing(W - 0.55, UI.rimLit);
  strokeRing(GW + 0.34, UI.grooveEdge);
  strokeRing(GW, UI.groove);
  drawMarks();

  if (!game.closed) {
    for (const p of [game.ring[0], game.ring[game.ring.length - 1]]) {
      const S = view.sc;
      ctx.fillStyle = "#a690ff";
      ctx.beginPath(); ctx.arc(SX(p.x), SY(p.y), 0.62 * S, 0, 7); ctx.fill();
      ctx.fillStyle = "#2a1f5e";
      ctx.beginPath(); ctx.arc(SX(p.x), SY(p.y), 0.4 * S, 0, 7); ctx.fill();
    }
  }

  for (const t of game.trucks) drawBay(t, now);
  for (const c of game.cubes) drawCube(c.x, c.y, PALETTE[c.color] || "#888", c.rot, c.sz);
  for (const f of game.flying) {
    const k = Math.min(1, (now - f.at) / f.ms), e = easeOut(k);
    drawCube(f.fx + (f.tx - f.fx) * e, f.fy + (f.ty - f.fy) * e,
             PALETTE[f.color] || "#888", f.rot + k * 2, f.sz);
  }
  for (const t of game.trucks) drawTrim(t, now);
  if (CHROME) drawHud();
}

// Dai dau man hinh: "Level N" ben trai, o dem hinh cube o giua - do lai khi sap tran,
// dung nhu ban goc (level 3 chuyen do o 6/8).
function drawHud() {
  const h = view.head, u = h * 0.5;
  const warn = game.counter() >= game.slotCount - 2;
  ctx.textBaseline = "middle";

  const pill = (cx, cy, w, hh, fill, stroke) => {
    roundRect(cx - w / 2, cy - hh / 2, w, hh, hh / 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = Math.max(1, u * 0.09); ctx.stroke();
  };

  ctx.font = "bold " + u * 0.62 + "px system-ui";
  const lw = ctx.measureText("Level " + game.id).width + u * 1.1;
  pill(u * 0.35 + lw / 2, h * 0.55, lw, u * 1.1, "rgba(46,36,96,.92)", "#6e5db4");
  ctx.fillStyle = "#e9e4ff"; ctx.textAlign = "center";
  ctx.fillText("Level " + game.id, u * 0.35 + lw / 2, h * 0.55);

  const txt = game.counter() + "/" + game.slotCount;
  const cw = ctx.measureText(txt).width + u * 2.5;
  const cx = cv.width / 2;
  pill(cx, h * 0.55, cw, u * 1.1, warn ? "rgba(150,26,66,.95)" : "rgba(46,36,96,.92)",
       warn ? "#ff7ba3" : "#6e5db4");
  ctx.fillStyle = warn ? "#ffd6e2" : "#e9e4ff";
  ctx.fillText(txt, cx + u * 0.4, h * 0.55);
  // bieu tuong cube
  ctx.save();
  ctx.translate(cx - cw / 2 + u * 0.78, h * 0.55);
  ctx.rotate(0.18);
  ctx.fillStyle = warn ? "#ffb8cc" : "#c9c0f0";
  roundRect(-u * 0.34, -u * 0.34, u * 0.68, u * 0.68, u * 0.16);
  ctx.fill();
  ctx.restore();
}

function drawBay(t, now) {
  const S = view.sc;
  const bodyL = t.cap * SLOT_LEN;
  const ang = Math.atan2(-t.my, -t.mx); // +x cuc bo = huong ra xa ray
  const w = TRUCK_W * S;
  const done = t.gone;
  const idle = !done && !t.blocks.length && !t.fill;

  let drain = 1;
  if (t.drain >= 0) drain = Math.max(0, 1 - (now - t.drain) / DRAIN_MS);

  // Banh xe, ve trong toa do THE GIOI va luon dat ve phia duoi man hinh, de ben nao
  // cung trong nhu dang dung tren banh du no quay huong nao.
  // ⚠ Chi xe NAM NGANG moi co banh. Ban goc ve xe ngang la nhin nghieng nen thay banh,
  // con xe doc la nhin tu tren xuong - dinh banh vao no thi thanh mot cai vay ben suon.
  const ux = -t.mx, uy = -t.my;
  let px = -uy, py = ux;
  if (py < 0) { px = -px; py = -py; }
  ctx.fillStyle = done ? shade(UI.wheel, 0.12) : UI.wheel;
  for (const f of (Math.abs(uy) < 0.4 ? [0.3, 0.74] : [])) {
    const cx = t.x + ux * bodyL * f + px * (TRUCK_W / 2 - 0.08);
    const cy = t.y + uy * bodyL * f + py * (TRUCK_W / 2 - 0.08);
    ctx.save();
    ctx.translate(SX(cx), SY(cy));
    ctx.rotate(ang);
    roundRect(-0.4 * S, -0.28 * S, 0.8 * S, 0.56 * S, 0.26 * S);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(SX(t.x), SY(t.y));
  ctx.rotate(ang);

  // than xe
  const grd = ctx.createLinearGradient(0, -w / 2, 0, w / 2);
  grd.addColorStop(0, done ? UI.bayDone : shade(UI.bay, 0.14));
  grd.addColorStop(1, done ? UI.bayDoneDark : UI.bayDark);
  roundRect(-0.35 * S, -w / 2, bodyL * S + 0.5 * S, w, 0.5 * S);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.strokeStyle = done ? "#241f45" : "#2a2158";
  ctx.lineWidth = Math.max(1, 0.12 * S);
  ctx.stroke();

  // o hang rong: hoc lom
  if (!done) {
    ctx.fillStyle = UI.baySocket;
    for (let i = 0; i < t.cap; i++) {
      const far = bodyL - (i + 1) * SLOT_LEN;
      roundRect(far * S + 0.08 * S, -w / 2 + 0.16 * S,
                SLOT_LEN * S - 0.16 * S, w - 0.32 * S, 0.26 * S);
      ctx.fill();
    }
  }

  if (drain > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-0.5 * S, -w, bodyL * S * drain + 0.5 * S, w * 2);
    ctx.clip();
    for (let i = 0; i < t.blocks.length; i++) {
      const b = t.blocks[i];
      const far = bodyL - (i + 1) * SLOT_LEN;
      const x = far * S + 0.08 * S, len = SLOT_LEN * S - 0.16 * S;
      const show = b.seen || !b.hidden;
      const col = show ? PALETTE[b.color] || "#888" : HIDDEN_FILL;
      const y0 = -w / 2 + 0.16 * S, h = w - 0.32 * S;
      ctx.fillStyle = shade(col, -0.28);
      roundRect(x, y0, len, h, 0.26 * S);
      ctx.fill();
      ctx.fillStyle = col;
      roundRect(x, y0, len, h * 0.76, 0.26 * S);
      ctx.fill();
      // khoi o mieng co vien dam - no la khoi se roi ra neu cham
      if (i === t.blocks.length - 1 && !t.gone) {
        ctx.strokeStyle = "rgba(0,0,0,.4)";
        ctx.lineWidth = Math.max(1, 0.1 * S);
        roundRect(x, y0, len, h, 0.26 * S);
        ctx.stroke();
      }
      if (!show) {
        ctx.save();
        ctx.translate(x + len / 2, 0);
        ctx.rotate(-ang);
        ctx.fillStyle = "#cfc9ee";
        ctx.font = "bold " + 0.9 * S + "px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", 0, 0);
        ctx.restore();
      }
      if (b.key) {
        ctx.fillStyle = "rgba(0,0,0,.45)";
        ctx.beginPath(); ctx.arc(x + len / 2, 0, 0.34 * S, 0, 7); ctx.fill();
        ctx.fillStyle = PALETTE[b.key] || "#fff";
        ctx.beginPath(); ctx.arc(x + len / 2, 0, 0.2 * S, 0, 7); ctx.fill();
      }
    }
    ctx.restore();
  }

  // phan o ke tiep dang gom do, lon dan tu phia day ben
  if (t.fill && t.claim && t.blocks.length < t.cap && !t.gone) {
    const far = bodyL - (t.blocks.length + 1) * SLOT_LEN;
    const frac = t.fill / game.perBlock;
    const col = PALETTE[t.claim] || "#888";
    const y0 = -w / 2 + 0.16 * S, h = w - 0.32 * S;
    ctx.fillStyle = shade(col, -0.2);
    roundRect(far * S + SLOT_LEN * S * (1 - frac) + 0.08 * S, y0,
              SLOT_LEN * S * frac - 0.16 * S, h, 0.22 * S);
    ctx.fill();
  }

  // ⚠ Hai kieu "rong" phai nhin ra duoc ngay: ben DA GIAO XONG thi tro vinh vien, ben
  // BI DO RONG thi van nhan hang. Ve giong nhau la nguoi choi thay cube chay qua mot
  // khoang trong ma khong vao, va tuong game hong.
  if (idle) {
    ctx.save();
    ctx.setLineDash([0.34 * S, 0.26 * S]);
    ctx.strokeStyle = "rgba(255,255,255,.36)";
    ctx.lineWidth = Math.max(1, 0.1 * S);
    roundRect(0.05 * S, -w / 2 + 0.3 * S, (bodyL - 0.5) * S, w - 0.6 * S, 0.34 * S);
    ctx.stroke();
    ctx.restore();
    // mau vua do ra thi chua nhan lai duoc - noi ro bang cham mau gach cheo
    if (t.lastDump) {
      const cx = bodyL * 0.5 * S, rr = 0.36 * S;
      ctx.fillStyle = PALETTE[t.lastDump] || "#888";
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(cx, 0, rr, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(18,14,42,.92)";
      ctx.lineWidth = Math.max(1, 0.11 * S);
      ctx.beginPath();
      ctx.moveTo(cx - rr * 0.78, rr * 0.78);
      ctx.lineTo(cx + rr * 0.78, -rr * 0.78);
      ctx.stroke();
    }
  }

  if (t.ripple >= 0) {
    const k = (now - t.ripple) / RIPPLE_MS;
    if (k >= 0 && k < 1) {
      ctx.globalAlpha = (1 - k) * 0.55;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(SLOT_LEN * 0.5 * S, 0, (0.25 + k * 0.9) * S, 0, 7);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// Confetti va dau tick ve sau cung, khong xoay theo than ben.
function drawTrim(t, now) {
  const S = view.sc;
  for (const p of t.confetti) {
    ctx.save();
    ctx.translate(SX(p.x), SY(p.y));
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, 1 - p.life / 1.3);
    ctx.fillStyle = p.col;
    ctx.fillRect(-0.18 * S, -0.07 * S, 0.36 * S, 0.14 * S);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  if (t.check >= 0) {
    const k = (now - t.check) / CHECK_MS;
    if (k >= 0 && k < 1) {
      const pop = k < 0.15 ? easeOut(k / 0.15) : 1;
      const mid = { x: t.x - t.mx * (t.cap * SLOT_LEN) / 2,
                    y: t.y - t.my * (t.cap * SLOT_LEN) / 2 };
      ctx.save();
      ctx.translate(SX(mid.x), SY(mid.y));
      ctx.scale(pop, pop);
      ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
      ctx.strokeStyle = "#3b2a6b";
      ctx.lineWidth = 0.34 * S;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(-0.62 * S, 0.02 * S);
      ctx.lineTo(-0.2 * S, 0.46 * S);
      ctx.lineTo(0.66 * S, -0.5 * S);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }
}


export { LEVELS, CARRIERS, SPLINES, AREAS, PALETTE, UI, CAP, DELIVER };
