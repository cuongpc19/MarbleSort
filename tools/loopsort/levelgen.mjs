// Sinh TOAN BO bo level cua ban minh: 1299 level, ray rieng, bo cuc rieng, mau rieng.
//
// Vi sao khong dung bo level trong Manythings/LoopSort-teardown: do la level co ban quyen
// cua Loop Sort (Garawell/Voodoo). README cua ban mo da ghi ro - hoc cach ho dung do kho,
// khong ship level cua ho. File nay la phan "hoc": moi con so muc tieu duoi day deu do tu
// 1299 level cua ho, con hinh ray va bo cuc thi tu dung.
//
//   node tools/loopsort/levelgen.mjs            -> sinh + nghiem thu, ghi vao data/
//   node tools/loopsort/levelgen.mjs --to 50    -> chi sinh 50 level dau (chay thu)
//   node tools/loopsort/levelgen.mjs --noverify -> bo qua buoc cho bot choi (nhanh, de xem hinh)
//
// ⚠ Nghiem thu bang CHINH engine that (loopsort.js) chu khong bang mot ban mo phong rut gon.
// Mot ban mo phong rut gon la ban sao thu hai cua luat choi, va hai ban luat se troi khoi
// nhau - luc do "da kiem tra" khong con nghia gi. Cai gia phai tra la thoi gian: moi level
// phai duoc bot choi that mot van.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "data");

// ------------------------------------------------------------------ so do tu ban goc
//
// Do tren ca 1299 level cua ho (tools/loopsort + scratchpad/an.mjs). Cot trai la so level,
// cot phai la gia tri trung binh cua dai do. Giua hai moc thi noi suy tuyen tinh.
//
//   level      1    25    55   105   155   255   405   805  1299
//   lane     5.5   8.1   9.5   9.9  10.5  12.0  11.6  12.1  11.9
//   mau      5.4   7.8   9.0   9.8  10.1  11.3  11.3  11.7  11.5
//   xe        22    31    36    39    40    45    45    47    46      (= 4 x so mau)
//   slot     8.5   7.2   6.2   6.7   6.4   5.9   6.2   6.0   5.5
//
// ⚠ "xe = 4 x so mau" khong phai trung hop: DELIVER = 4, nen moi mau phai chia het cho 4
// hoac ban co khong bao gio thang duoc. Da kiem tra 1299/1299 level cua ho deu chia het.
// Day la rang buoc SO HOC cua tro choi, khong phai mot lua chon thiet ke.
const CURVE = [
  //  id  lanes  colors  slot
  // ⚠ Doan dau ladder da bi do QUA NHE o ban truoc: do lai bo minh sinh ra thi dai 1-15 chi
  // co 4.2 mau / 17 mieng, trong khi ban goc o dung dai do la 5.4 mau / 22 mieng - va bot
  // thang 87% cua minh so voi 73% cua ho. Keo doan dau len sat ho, chi giu level 1-3 that
  // nhe vi do la cho nguoi choi hoc luat.
  [    1,  2.0,   2.0,  7.0],
  [    3,  3.5,   3.0,  8.0],
  [    8,  6.0,   5.5,  8.2],
  [   15,  7.5,   7.0,  7.6],
  [   25,  8.1,   7.8,  7.2],
  [   55,  9.5,   9.0,  6.2],
  [  105,  9.9,   9.8,  6.7],
  [  155, 10.5,  10.1,  6.4],
  [  255, 12.0,  11.3,  5.9],
  [  405, 11.6,  11.3,  6.2],
  [  805, 12.1,  11.7,  6.0],
  [ 1299, 11.9,  11.5,  5.5],
];

function curveAt(id) {
  let a = CURVE[0], b = CURVE[CURVE.length - 1];
  for (let i = 0; i < CURVE.length - 1; i++)
    if (id >= CURVE[i][0] && id <= CURVE[i + 1][0]) { a = CURVE[i]; b = CURVE[i + 1]; }
  const t = b[0] === a[0] ? 0 : (id - a[0]) / (b[0] - a[0]);
  return {
    lanes: a[1] + (b[1] - a[1]) * t,
    colors: a[2] + (b[2] - a[2]) * t,
    slot: a[3] + (b[3] - a[3]) * t,
  };
}

// Bang mau cua RIENG ban minh. ⚠ Khong chep bang mau cua ho: cung ma mau trong engine
// (PALETTE trong loopsort.js) nhung THU TU VAO GAME khac han - mau nao xuat hien o level
// nao la mot lua chon thiet ke, va do la thu de nhan ra nhat neu chep.
// Thu tu duoi day di tu cap mau tuong phan manh nhat ra dan: nguoi moi choi phan biet
// duoc ngay, ve sau moi phai nhin ky.
const COLORS = ["R", "Y", "B", "G", "O", "P", "LB", "PNK", "BR", "GR", "DG", "W", "DPNK", "LPNK"];

// Moc mo co che, lay y tu ho nhung dat lai cho ban minh:
//   Portal (ray ho) tu level 4  · hang up (_H) tu level 12
// ⚠ Ho mo hidden o level 20 nhung do la hidden CUA XE trong hang doi; ban minh chi co mot
// tang hang nen no toi som hon moi du vi.
const PORTAL_FROM = 4, HIDDEN_FROM = 12;

// ------------------------------------------------------------------ so ngau nhien
// Gieo theo so level: cung mot level thi bao gio cung ra dung mot ban co, tren may nao cung
// the. Level ma doi moi lan mo la level khong do duoc, khong sua duoc, va khong ta duoc.
function rngFor(id, att = 0) {
  let s = ((id * 2654435761) ^ 0x9e3779b9 ^ (att * 0x85ebca6b)) >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1e6) / 1e6;
  };
}
const pick = (r, a) => a[Math.min(a.length - 1, Math.floor(r() * a.length))];
const irnd = (r, a, b) => a + Math.floor(r() * (b - a + 1));

// ------------------------------------------------------------------ hinh ray
//
// Hoc tu ho: da giac tren LUOI SO NGUYEN, chi co canh ngang va canh doc, goc duoc bo tron
// ban kinh 2.2 luc chay. Ben do dat cach canh ray 3 o, quay mat vao ray.
// ⚠ Canh nao co ben do thi phai dai >= 6: goc bo tron an mat 2.2 o moi dau, canh ngan hon
// thi ben do ngoi ngay tren khuc cong va mieng ben khong con vuong goc voi ray.
//
// Bay ho hinh, tat ca deu la da giac vuong goc. Ho dung chu yeu hinh chu nhat va chu nhat
// long nhau; sau day la ho hang cua ban minh - cung luat dung, hinh khac.
// ⚠ Hinh ray phai co HAI DOAN THANG tren va duoi (cho de xep hang ben do) va HAI DAU CONG
// that. Ban dau toan da giac vuong goc va no doc ra vua be vua go ghe - "ray bé tý, làm xấu".
// Ban goc cua ho ve ray bang duong cong lien: xem level 9 cua ho la mot hinh so 8.
// ⚠ Cung tron phai bam nho THANH NHIEU DIEM (12 diem mot dau): engine chi bo goc ban kinh
// 2.2, nen hai diem cach nhau 10 dv thi van la mot goc vuong bi vat, khong phai mot duong
// cong.
const ARC = 12;
const arcPts = (cx, cy, rx, ry, a0, a1) => {
  const out = [];
  for (let i = 0; i <= ARC; i++) {
    const a = a0 + (a1 - a0) * (i / ARC);
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
};
const SHAPES = {
  // vien thuoc: hai canh thang, hai dau nua duong tron
  stadium: (w, h) => {
    const r = Math.min(w, h) / 2;
    return [[r, 0], [w - r, 0],
      ...arcPts(w - r, r, r, r, -Math.PI / 2, Math.PI / 2),
      [w - r, h], [r, h],
      ...arcPts(r, r, r, r, Math.PI / 2, Math.PI * 1.5)].map(([x, y]) => [x, y * (h / (2 * r) || 1)]);
  },
  // hai dau tron, hai suon that eo vao
  bone: (w, h) => {
    const r = h / 2;
    return [[r, 0], [w * 0.38, 0], [w * 0.5, h * 0.16], [w * 0.62, 0], [w - r, 0],
      ...arcPts(w - r, r, r, r, -Math.PI / 2, Math.PI / 2),
      [w - r, h], [w * 0.62, h], [w * 0.5, h * 0.84], [w * 0.38, h], [r, h],
      ...arcPts(r, r, r, r, Math.PI / 2, Math.PI * 1.5)];
  },
  // mot dau tron mot dau vuong
  arch: (w, h) => {
    const r = Math.min(w, h) / 2;
    return [[0, 0], [w - r, 0],
      ...arcPts(w - r, r, r, r, -Math.PI / 2, Math.PI / 2),
      [w - r, h], [0, h]];
  },
  // chu nhat bo goc lon
  rounded: (w, h) => {
    const r = Math.min(w, h) * 0.34;
    return [[r, 0], [w - r, 0],
      ...arcPts(w - r, r, r, r, -Math.PI / 2, 0),
      [w, h - r],
      ...arcPts(w - r, h - r, r, r, 0, Math.PI / 2),
      [r, h],
      ...arcPts(r, h - r, r, r, Math.PI / 2, Math.PI),
      [0, r],
      ...arcPts(r, r, r, r, Math.PI, Math.PI * 1.5)];
  },
  // hai buong noi nhau - hoc tu hinh so 8 cua ho nhung khong cat cheo
  peanut: (w, h) => {
    const r = h / 2, k = w * 0.5;
    return [[r, 0], [k - r * 0.5, 0], [k, h * 0.28], [k + r * 0.5, 0], [w - r, 0],
      ...arcPts(w - r, r, r, r, -Math.PI / 2, Math.PI / 2),
      [w - r, h], [k + r * 0.5, h], [k, h * 0.72], [k - r * 0.5, h], [r, h],
      ...arcPts(r, r, r, r, Math.PI / 2, Math.PI * 1.5)];
  },
};

// Ray HO (Portal): mot duong tu dau nay sang dau kia chu khong khep kin.
const OPEN_SHAPES = {
  ushape: (w, h) => {
    const r = Math.min(w, h) / 2.2;
    return [[0, h], [0, r], ...arcPts(r, r, r, r, Math.PI, Math.PI * 1.5),
            [w - r, 0], ...arcPts(w - r, r, r, r, -Math.PI / 2, 0), [w, h]];
  },
  sshape: (w, h) => [[0, h], [0, h * 0.55], [w * 0.25, h * 0.5], [w * 0.75, h * 0.5], [w, h * 0.45], [w, 0]],
  cshape: (w, h) => {
    const r = Math.min(w, h) / 2.2;
    return [[w, 0], [r, 0], ...arcPts(r, r, r, r, -Math.PI / 2, Math.PI),
            [0, h - r], ...arcPts(r, h - r, r, r, Math.PI, Math.PI / 2), [w, h]];
  },
};

// Nan mot da giac ve luoi so nguyen va bo canh qua ngan.
function snap(pts) {
  const out = [];
  for (const [x, y] of pts) {
    const p = { x: Math.round(x), y: Math.round(y) };
    const q = out[out.length - 1];
    if (!q || q.x !== p.x || q.y !== p.y) out.push(p);
  }
  return out;
}

// Doan thang cua da giac (chi lay canh du dai de dat ben do).
function edgesOf(pts, closed) {
  const segs = [];
  const n = pts.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 6) continue;
    // phap tuyen cua doan (chi co canh ngang/doc)
    const nx = a.x === b.x ? 1 : 0, ny = a.x === b.x ? 0 : 1;
    segs.push({ a, b, len, nx, ny });
  }
  return segs;
}

// Dien tich da giac (cong thuc day giay), lay tri tuyet doi.
const polyArea = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++)
    a += (pts[j].x + pts[i].x) * (pts[j].y - pts[i].y);
  return Math.abs(a / 2);
};

const inPoly = (p, pts) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const yi = pts[i].y, yj = pts[j].y;
    if ((yi > p.y) !== (yj > p.y) &&
        p.x < ((pts[j].x - pts[i].x) * (p.y - yi)) / (yj - yi) + pts[i].x) c = !c;
  }
  return c;
};

// Khoang cach tu mot diem toi mot doan thang.
function distSeg(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L)) : 0;
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

// ⚠ rot theo DU LIEU (y huong len), doi chieu tu chinh du lieu cua ho:
//   0 = ray o phia y NHO hon · 180 = y LON hon · 90 = x NHO hon · 270 = x LON hon
// Da kiem lai tren spline 1/3/5 cua ho va khop ca ba.
function rotToward(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 90 : 270;
  return dy < 0 ? 0 : 180;
}

// Dat n ben do doc theo cac canh dai nhat.
//
// ⚠ Ba rang buoc, va ca ba deu la loi da bat duoc chu khong phai phong xa:
// 1. BEN NGOAI vong ray. Dat ben trong thi than xe (4 o hang) tho vao long vong, va o
//    nhung hinh hep no dam sang canh ray doi dien.
// 2. Cach MOI ben khac >= 5.5 o - tinh tren TAT CA cac cap, khong phai chi hai ben cung
//    mot canh. Hai ben o hai canh ke nhau, moi cai cach goc 3 o, thi cach nhau co 1.4 o:
//    engine phat hien chong va co ca dan xe lai con 12% (`fit 0.12` o level 28 luc dau) -
//    ban co van chay, chi la be ti hon va khong ai hieu tai sao.
// 3. Cach moi canh ray KHAC >= 4 o, de xe khong ngoi de len mot khuc ray khac.
// Kich thuoc THAN XE, lay dung tu engine: 4 o hang x SLOT_LEN 1.68 = 6.7 dv dai, rong
// TRUCK_W 2.6. Ben do nam cach ray 3 dv va than keo dai RA XA ray, nen mot ben chiem mot
// hop 6.7 x 2.6 o phia ngoai vong ray.
// ⚠ Cac khoang cach nay phai nhan cung SCALE voi engine (loopsort.js), neu khong ben do se
// chong nhau hoac dam vao ray. Dung import truc tiep de khong bao gio co hai con so.
// ⚠ Phai bang SCALE/WIDE trong loopsort.js. Bo level trong data/ da duoc SINH RA voi
// SCALE 1.5 / WIDE 2.3 va khoang cach dat ben da nuong theo do - no van chay dung o kich
// thuoc 1 (ben chi thua cho chu khong chong nhau). Nhung neu SINH LAI thi bo level se khac
// bo dang co: do la mot quyet dinh, khong phai mot buoc vo tinh.
const SCALE = 1.2, WIDE = 1.2;
// ⚠ DOCK_GAP co y KHONG nhan SCALE. No la chieu dai doan noi tu khay xuong ray - mot cai
// gach noi, khong phai mot bo phan cua xe: xe to len thi doan noi khong viec gi phai dai
// theo, va dai ra thi ban co bi keo gian ra vo ich. Chu du an yeu cau rut ngan, nen no o
// 3.2 chu khong phai 3 x 1.5 = 4.5.
// ⚠ Khoang cach giua hai ben phai theo BE NGANG khay (WIDE), khong theo chieu dai: hai
// khay dung canh nhau thi cai cham nhau la be ngang.
const DOCK_GAP = 3, DOCK_PITCH_LEN = 3.4 * WIDE;
const BODY_LEN = (4 * 1.68 + 0.6) * SCALE, BODY_W = 2.6 * WIDE;
const MOUTH = { 0: [0, -1], 90: [-1, 0], 180: [0, 1], 270: [1, 0] };
const RAIL_CLEAR = 1.3 * SCALE, BAY_CLEAR = 2.0 * SCALE;

// Cac diem phu kin than xe, de do va cham.
function bodyPoints(d) {
  const m = MOUTH[d.rot];
  const ax = -m[0], ay = -m[1];          // than keo dai nguoc huong mieng
  const px = -ay, py = ax;
  const out = [];
  for (let t = 0; t <= BODY_LEN; t += 1.1)
    for (const u of [-BODY_W / 2, 0, BODY_W / 2])
      out.push({ x: d.x + ax * t + px * u, y: d.y + ay * t + py * u });
  return out;
}

// Dat n ben do doc theo cac canh dai nhat cua hinh.
//
// ⚠ Phep do phai lam tren CA THAN XE, khong phai tren mot diem. Than dai 6.7 dv: mot ben
// dat dung khoang cach van co the cham than sang mot khuc ray KHAC nam phia sau no, va
// tren man hinh no doc ra la cai xe nam de len duong ray - da nhin thay dung canh do o
// level 20 ban dau. Hai ben o hai canh KE NHAU cung vay: moi cai cach goc 3 dv thi hai
// diem do cach nhau 4.2 dv (du thoang), nhung hai cai than thi cat nhau.
// ⚠ Va ben do phai nam NGOAI vong ray. Dat ben trong thi than tho vao long vong; o nhung
// hinh hep no dam sang canh doi dien, va engine chi con cach co ca dan xe lai (`fit`), tuc
// ban co van chay nhung be ti hon ma khong ai hieu tai sao.
// ⚠ Xep ben do thanh HANG TREN va HANG DUOI, khong rai quanh chu vi. Do la cach ban goc lam
// (spline 9 cua ho: A/B/C o y=26, D/E/F o y=11, deu nhau theo x), va ly do khong phai tham my
// ma la KICH THUOC: rai quanh bon canh thi khung bao phinh ra CA HAI chieu, camera phai lui
// ra, va vali voi khay deu nho lai - dung cai da bi bao. Xep hai hang thi khung bao chi cao
// them, tuc an vao dung chieu ma man hinh doc dang thua.
function placeDocks(pts, closed, n, r) {
  const segs = edgesOf(pts, closed);
  const lastI = closed ? pts.length : pts.length - 1;
  const out = [];
  const owns = (d, seg) => {
    const p = { x: d.x, y: d.y };
    const mine = distSeg(p, seg.a, seg.b);
    for (let i = 0; i < lastI; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (a === seg.a && b === seg.b) continue;
      if (distSeg(p, a, b) < mine + 1.0) return false;
    }
    return true;
  };
  const ok = (d) => {
    const body = bodyPoints(d);
    for (const q of body)
      for (let i = 0; i < lastI; i++)
        if (distSeg(q, pts[i], pts[(i + 1) % pts.length]) < RAIL_CLEAR) return false;
    for (const o of out)
      for (const q of o.body)
        for (const b of body)
          if (Math.hypot(q.x - b.x, q.y - b.y) < BAY_CLEAR) return false;
    return true;
  };
  const put = (x, y, seg, inRow) => {
    const d = { x: Math.round(x), y: Math.round(y), rot: 0, row: !!inRow };
    d.rot = rotToward(seg.a.x === seg.b.x ? seg.a.x - d.x : 0,
                      seg.a.y === seg.b.y ? seg.a.y - d.y : 0);
    if (!owns(d, seg) || !ok(d)) return false;
    d.body = bodyPoints(d);
    out.push(d);
    return true;
  };

  const horiz = segs.filter((g) => g.a.y === g.b.y).sort((a, b) => b.a.y - a.a.y);
  const vert = segs.filter((g) => g.a.x === g.b.x).sort((a, b) => b.len - a.len);
  // ⚠ LUON hai hang (tren + duoi) khi co tu 3 xe tro len. Truoc day dồn ≤4 xe vào MỘT hàng
  // cho "tiet kiem dien tich" - va do la mot phep tinh sai huong tren man hinh DOC:
  //   4 xe mot hang  -> khung bao 30 rong x 23 cao, man 500x900 => be ngang chan, ti le 16.7
  //   4 xe hai hang  -> khung bao 15 rong x 34 cao                => chieu cao chan, ti le 26
  // Cung mot cai xe, hai hang ve ra to hon 55%. Man hinh doc thi CHIEU CAO la thu re, be ngang
  // moi la thu dat - nen phai xep hep va cao, chu khong phai rong va thap.
  const rows = [];
  const top = { seg: horiz[0], dir: +1 };
  const bot = { seg: horiz[horiz.length - 1], dir: -1 };
  if (horiz.length) {
    if (n <= 2) rows.push(r() < 0.5 ? top : bot);
    else { rows.push(top); if (horiz.length > 1) rows.push(bot); }
  }
  rows.forEach((row, ri) => {
    if (out.length >= n) return;
    const seg = row.seg;
    const x0 = Math.min(seg.a.x, seg.b.x), x1 = Math.max(seg.a.x, seg.b.x);
    const room = Math.max(1, Math.floor((x1 - x0 - 2) / DOCK_PITCH_LEN));
    const want = Math.min(room, Math.ceil((n - out.length) / (rows.length - ri)));
    for (let k = 0; k < want && out.length < n; k++) {
      const t = want === 1 ? 0.5 : (k + 0.5) / want;
      put(x0 + 1 + (x1 - x0 - 2) * t, seg.a.y + row.dir * DOCK_GAP, seg, true);
    }
  });
  // Con thieu thi bu vao hai suon - chi la duong lui, khong phai bo cuc chinh.
  const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
  for (const seg of vert) {
    if (out.length >= n) break;
    const y0 = Math.min(seg.a.y, seg.b.y), y1 = Math.max(seg.a.y, seg.b.y);
    const room = Math.max(1, Math.floor((y1 - y0 - 2) / DOCK_PITCH_LEN));
    for (let k = 0; k < room && out.length < n; k++) {
      const t = room === 1 ? 0.5 : (k + 0.5) / room;
      put(seg.a.x + (seg.a.x > cx ? DOCK_GAP : -DOCK_GAP), y0 + 1 + (y1 - y0 - 2) * t, seg);
    }
  }
  return out.map(({ body, ...d }) => d);
}

const LANE_NAMES = "ABCDEFHIJKLMNOP".split("");   // nhay G, dung quy uoc cua ho de khoi lan voi mau Green

// ⚠ TI LE KHUNG BAO, do tren man hinh that: 0.71 (rong/cao, trong toa do the gioi). Man
// hinh la 500 tren dai an toan 563 = 0.89, nhung camera nghieng nen chieu doc bi NEN ~1.25
// lan, nen the gioi phai cao hon rong mot chut moi lap day duoc man hinh doc. Day la cho
// de nhan nham nhat: nhin man hinh doc roi ve ban co vuong la da qua be ngang roi.
// ⚠ Va khung bao la RAY CONG THAN XE, khong phai rieng ray: ben do luon nam ngoai vong nen
// ben nam dau thi khung phinh ra do. Do tren ban dau: 683/1299 level (53%) qua be ngang,
// trung binh bo phi 24% mot chieu - tuc cung ban co do dang le ve to hon gap ruoi.
const TARGET_ASPECT = 0.71;

function layoutBox(pts, docks) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const add = (p) => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); };
  for (const p of pts) add(p);
  for (const d of docks) for (const q of bodyPoints(d)) add(q);
  return { w: x1 - x0, h: y1 - y0 };
}

function makeSpline(id, lanes, r) {
  const open = id >= PORTAL_FROM && r() < 0.36;     // ho: 38% level ray ho
  const fam = open ? OPEN_SHAPES : SHAPES;
  // ⚠ Level it ben thi chon hinh DON: long ray phai la mot buong lien thi moi dat duoc ben
  // ben trong. Hinh chu L hay chu thap co long ray bi chia thanh nhung ngach hep, va moi cai
  // ngach deu khong du cho mot than xe.
  const simple = !open && lanes <= 7;
  const names = simple ? ["stadium", "rounded", "arch"] : Object.keys(fam);
  const name = names[(id + Math.floor(r() * names.length)) % names.length];
  // ⚠ Co ray phai tinh tu SO BEN DO, khong duoc dat mot khoang toi thieu. Ban dau ghi
  // `w >= 14, h >= 16` va o level it ben (4 ben) no de ra mot vong ray dai 60 dv cho 4 cai
  // xe - ban co gan nhu trong, va bo vẽ (fit theo ben, cho phep ray tran) cat mat hai dau
  // ray. Chu vi can = so ben x khoang cach dat ben + cho cho bon goc bo tron.
  // ⚠ Chu vi ray phai du CA HAI viec: xep het ben do doc canh, VA chua duoc mot long ray
  // rong it nhat ~13x13 de dat duoc ben ben trong. San 52 la cho viec thu hai - thieu no thi
  // o level it ben, ray nho xiu nam giua mot san trong huenh hoang, va moi ben deu phai ra
  // ngoai vi long ray khong du cho mot than xe (dai 6.7 + 3 khoang ho).
  // ⚠ Con so 68 la tinh nguoc tu THAN XE, khong phai uoc luong: than dai 6.7 + khoang ho 3
  // toi mep ray = 9.7, cong khoang cach toi thanh doi dien nen long ray phai rong >= 14, tuc
  // vong ngoai >= 17 moi chieu, tuc chu vi >= 68. Dat san 52 (long ~10) thi moi ben van bi
  // day ra ngoai - da thu va do dung canh do: ray to hon that nhung khong ben nao vao duoc.
  // ⚠ Ray GON lai, khong con san 82. San do dat de long ray du rong ma nhet ben vao trong -
  // nhung bo cuc hai hang (tren/duoi) khong dat ben ben trong nua, va mot vong ray to bo
  // trong o giua chinh la thu an mat cho cua vali: camera khop khung bao, ray cang to thi xe
  // cang phai nho. Chu vi chi con du de xep ben doc hai canh ngang.
  // ⚠ CO RAY TINH TU HANG BEN, VA CHI TU DO. Day la con so da di lac ca buoi chieu, nen ghi
  // ro cach ra no:
  //   be ngang ray = (so ben mot hang) x (khoang cach dat ben 3.4) + 4 cho hai dau bo tron
  // Voi 3 ben mot hang: 3 x 3.4 + 4 = 14.2 - dung bang canh dai vong ray cua ban goc (14-19),
  // va do khong phai trung hop: ho cung dat ben sat nhau quanh mot vong ray vua khit.
  // ⚠ Do la thu quyet dinh KICH THUOC MOI VAT tren man hinh, vi camera khop ca khung bao:
  // ray dai gap ba thi vali ve nho di gap ba. Bo sinh truoc do tinh chu vi tu tong so ben roi
  // cong them san toi thieu, va moi lan co ly do (dat ben trong long ray, tranh ray be xau)
  // lai nang san len - ray phinh tu 14 len 29-77 va vali teo theo. Khong co san toi thieu nua.
  const perRow = Math.max(2, Math.ceil(lanes / 2));
  // ⚠ Doan THANG moi dat duoc ben, ma hai dau bo tron an mat cua no dung bang chieu cao ray
  // (hai nua duong tron ban kinh h/2). Nen be ngang phai la: hang ben + chieu cao + le. Bo
  // quen so hang nay thi doan thang ngan hon hang ben, dat khong du cho, va moi level roi
  // xuong duong lui - do la ly do mot nua so level vua roi ra ray 40x24 thay vi 17x9.
  const rowW = perRow * DOCK_PITCH_LEN;
  const base = rowW;    // be ngang toi thieu cua doan thang                              // = w + h cua hinh chu nhat tuong duong
  // ⚠ Thieu cho thi NOI RONG hinh ra da, lui ve chu nhat la buoc cuoi cung. Ban dau lui ngay
  // lap tuc va 65% ban co ra hinh chu nhat - hinh phuc tap (khuyet, chu thap, that eo) luon
  // co it canh du dai hon, nen chung hong truoc va bi thay bang chu nhat gan het. Bo hinh co
  // day du ho hang ma nguoi choi chi thay mot hinh thi coi nhu khong co ho hang nao.
  // Thu nhieu ti le khung ray va ca hai thu tu uu tien canh, giu bo cuc nao co khung bao
  // gan TARGET_ASPECT nhat ma van du cho cho tat ca cac ben.
  // ⚠ Ti le khung bao la mot RANG BUOC CUNG, khong phai mot muc tieu de co gang. Chi cham
  // diem roi lay "cai gan nhat" thi van lot nhung ban co lech han - do tren 100 level dau:
  // 29 cai nam ngoai dai 0.55-0.95, te nhat la 2.30 (rong gap hon hai lan cao). Bo ve fit
  // theo ben va cho phep ray tran, nen mot ban co qua be ngang bi CAT MAT hai dau ray, va
  // nhung ben o do khong cham toi duoc nua - do la loi choi duoc hay khong, khong phai loi
  // tham my.
  const LO = 0.58, HI = 0.92;
  // ⚠ Mot phan ba so ben, toi da 4, uu tien dat trong long ray - dung theo y chu du an: o
  // nhung level it ben thi long ray la mot khoang trong to bang ca ban co. Ban goc cung lam
  // the ngay tu level 1 (spline 1: hai ben A/B nam trong long hinh chu nhat).
  let pts = null, docks = null, bestCost = 1e9;
  // ⚠ Co ca nhung ti le ray BET (rong gap 3-4 lan cao). Voi bo cuc hai hang thi khung bao =
  // be ngang ray x (cao ray + hai than xe), nen ray cang bet thi phan cua VALI trong khung
  // cang lon - tuc vali ve to len. Ban dau chi co toi 1.6 va long ray luon con mot khoang
  // trong to bang ca ban co.
  const shapes = [[1, 1], [1.25, 0.85], [0.85, 1.25], [1.45, 0.8], [0.8, 1.45],
                  [0.7, 1.6], [0.6, 1.8], [1.6, 0.7], [2.2, 0.6], [2.8, 0.5], [3.4, 0.45]];
  // Be ngang giu co dinh bang hang ben; chi quet CHIEU CAO ray. Truoc day quet ca hai chieu
  // nen ray beo ra theo be ngang - ma be ngang moi la cai chan tren man hinh doc.
  for (const grow of [0, 3, 7, 12]) {
    for (const railH of [8, 10, 13, 16, 20, 25]) {
      {
        const w = base + railH + 4 + grow;   // hang ben + phan bi hai dau bo tron an + le
        const P = snap(fam[name](w, railH));
        // ⚠ Chan ti le cua CHINH VONG RAY, khong chi ti le khung bao. Khung bao gom ca xe nen
        // mot cai ray det nhu cai que van co the cho ra khung bao dep - va tren man hinh no
        // doc ra la mot soi day chu khong phai mot vong bang chuyen.
        const rw = Math.max(...P.map((q) => q.x)) - Math.min(...P.map((q) => q.x));
        const rh = Math.max(...P.map((q) => q.y)) - Math.min(...P.map((q) => q.y));
        if (rw / rh < 0.5 || rw / rh > 2.3) continue;
        // ⚠ KHONG chan be ngang ray o day. Da thu va no danh nhau voi vong noi rong: chan be
        // ngang thi hang xe khong du cho, ma khong du cho thi phai noi rong - hai luat keo
        // nguoc chieu nhau, va ket qua la nhung ban co chi dat duoc 2 trong 5 xe.
        const D = placeDocks(P, !open, lanes, r);
        if (D.length < lanes) continue;
        const b = layoutBox(P, D);
        const a = b.w / b.h;
        // ⚠ Phat nhung ben KHONG nam trong hang. Thieu cai phat nay thi bo sinh van chon mot
        // hinh ray cao va hep, hang ngang chi chua noi mot xe, con lai roi xuong hai suon -
        // dung cai bo cuc vua bi bao la ton dien tich. Phat du nang de mot hinh bet hon, xep
        // duoc ca hang, luon thang mot hinh dep ti le nhung phai rai xe ra suon.
        // ⚠ MOT xe bi day ra suon la du lam hong ca ban co: no keo khung bao rong them gan
        // nguyen mot than xe (14 dv), va vi be ngang la cai chan tren man hinh doc nen moi thu
        // con lai bi thu nho theo. Truoc day day chi la mot diem phat va no khong du - bo sinh
        // van chon nhung bo cuc co mot xe o suon. Gio la tu choi thang; thieu cho thi noi rong
        // ray ra (vong grow) chu khong duoc de xe ra suon.
        const side = D.filter((d) => !d.row).length;
        if (side > 0) continue;
        // ⚠ Ti le khung bao la mot DAI chu khong phai mot diem. Ep dung 0.71 thi bo sinh luon
        // chon ray cao, va vi be ngang moi la cai chan tren man hinh doc nen phan cao them ay
        // KHONG lam xe to hon mot pixel nao - no chi de ra mot cai lo rong giua ban co. Trong
        // dai thi khong phat; ra ngoai dai moi phat.
        // ⚠ Ep ve DUNG ti le khung man hinh (0.72 = 670/930), khong phai mot dai rong. Da thu
        // dai [0.55, 1.05] va no cho qua ca nhung ban co gan VUONG (lv1 27x26, lv7 48x48) -
        // ban vuong thi vua theo be ngang va BO PHI 30% chieu cao, tuc no ve nho hon muc co
        // the ma khong con so nao trong bang bao cho biet. Ti le vali/khung bao van dep (6-11%)
        // trong khi tren man hinh no van be: do la vi phep do bo qua phan khung bi bo phi.
        const band = Math.abs(Math.log(a / 0.72)) * 1.6;
        // ⚠ Phat khoang trong trong long ray: dien tich long / dien tich khung bao. Day la
        // thu bien mot vong ray dep thanh mot cai khung rong - va no khong mua duoc gi ca.
        const hole = polyArea(P) / (b.w * b.h);
        const cost = band + side * 0.30 + hole * 0.55;
        if (cost < bestCost) { bestCost = cost; pts = P; docks = D; }
      }
    }
    if (docks && bestCost < Math.abs(Math.log(LO / TARGET_ASPECT))) break;
  }
  // Van ngoai dai thi quet thang ti le hai canh cua hinh chu nhat cho toi khi loc vao trong.
  if (!docks || bestCost > Math.abs(Math.log(LO / TARGET_ASPECT))) {
    for (let k = 0.55; k <= 2.6 && (!docks || bestCost > 0.001); k += 0.12) {
      const sum = base + 10;
      const P = snap(SHAPES.stadium(sum / (1 + k), (sum * k) / (1 + k)));
      const D = placeDocks(P, !open, lanes, r);
      if (D.length < lanes) continue;
      const b = layoutBox(P, D);
      const a = b.w / b.h;
      if (a >= LO && a <= HI) { pts = P; docks = D; bestCost = 0; break; }
    }
  }
  // ⚠ Duong lui phai NOI RONG cho toi khi du cho, khong duoc tra ve it ben hon so yeu cau.
  // `makeCarrier` chia hang theo so ben THUC TE nhan duoc, nen tra ve thieu la level tu dong
  // it xe di ma khong ai bao - da gap dung canh do: mot level dang le 5 xe chi con 2, va no
  // trong nhu ban co bi hong chu khong phai mot level de.
  // ⚠ Duong lui phai dung CUNG cong thuc be ngang, chi noi chieu cao ray - truoc day no phong
  // to ca hinh len (+20 roi +10 moi vong) va de ra nhung vong ray 44x27 giua mot bo toan 21x10.
  if (!docks || docks.length < lanes) {
    for (const railH of [10, 13, 16, 20, 25, 30]) {
      for (const extra of [0, 4, 9, 16]) {
        const w = rowW + railH + 4 + extra;
        const P2 = snap(SHAPES.stadium(w, railH));
        const D2 = placeDocks(P2, !open, lanes, r);
        if (D2.length >= lanes) { pts = P2; docks = D2; break; }
        if (!docks || D2.length > docks.length) { pts = P2; docks = D2; }
      }
      if (docks && docks.length >= lanes) break;
    }
  }
  const nodes = pts.map((p, i) => `${i + 1};${p.x};${p.y}`);
  const dk = docks.map((d, i) => `${LANE_NAMES[i]}\n${d.rot};${d.x};${d.y}`);
  return {
    Id: id, Closed: !open, Spacing: 0.58, Subdivide: 1,
    CameraOffset: { x: 0, y: 0, z: 0 }, CameraRotation: 0,
    Spline: [...nodes, ...dk].join(":"),
    lanes: docks.length, shape: name,
  };
}

// ------------------------------------------------------------------ bo cuc hang
//
// 4 mieng moi mau (DELIVER = 4), roi trai deu vao cac ben. ⚠ Khong duoc de mot ben chi
// toan mot mau ngay tu dau: ben do khong con gi de lam, va no lam ban co nho di mot bac ma
// nguoi choi khong duoc tra cong gi.
function makeCarrier(id, lanes, colors, r) {
  // ⚠ Chan o day chu khong de no no ra thanh mot loi kho hieu sau ba lop ham: neu dat ben do
  // that bai het thi `lanes` ve 0 va vong chia hang nem "cannot read properties of undefined".
  // Loi that nam o hinh hoc, nhung cho no lo ra la o day.
  if (!(lanes >= 2)) throw new Error(`lv ${id}: chi dat duoc ${lanes} ben do - hinh ray khong du cho`);
  const bag = [];
  for (let i = 0; i < colors; i++) for (let k = 0; k < 4; k++) bag.push(COLORS[i]);
  // xao
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  // chia vao lane: phan lon lane 4 mieng, mot vai lane 3 hoac 5 cho do deu tam tap
  const stacks = Array.from({ length: lanes }, () => []);
  let i = 0;
  for (const c of bag) { stacks[i % lanes].push(c); i++; }
  // Doi cheo de khong lane nao thuan mot mau
  for (let pass = 0; pass < 3; pass++) {
    for (const s of stacks) {
      if (s.length < 2 || !s.every((c) => c === s[0])) continue;
      const other = stacks[Math.floor(r() * stacks.length)];
      if (other === s || !other.length) continue;
      const a = Math.floor(r() * s.length), b = Math.floor(r() * other.length);
      [s[a], other[b]] = [other[b], s[a]];
    }
  }
  // Hang up: che mieng nam SAU trong dong (nguoi choi thay mieng ngoai cung, khong thay
  // cai phia sau). ⚠ Khong bao gio che mieng tren cung - do la mieng quyet dinh nuoc di,
  // che no la bat doan mo chu khong phai bat nho.
  const hid = id < HIDDEN_FROM ? 0 : Math.min(0.45, 0.08 + id / 900);
  const txt = stacks.map((s, k) => {
    const parts = s.map((c, j) => (j < s.length - 1 && r() < hid ? c + "_H" : c));
    return [LANE_NAMES[k], ...parts].join(";");
  });
  return { Id: id, ColorData: txt.filter((t) => t.includes(";")).join(":"), Features: "" };
}

// Ty le bot thang muc tieu theo so level, do tu ban goc bang chinh con bot nay (73% o 1-15,
// 60% o 16-30, 67% o 51-65, 13% o 101-115 - da lam muot vi moi dai chi 15 level nen sai so
// khoang +-12%).
// ⚠ Ha xuong ~15 diem so voi ban truoc. Do that te: bo sinh ra thang 73/80/80/60 trong khi
// ban goc la 73/60/67/13-33 - tuc muc tieu cu bi vuot deu mot khoang. Tieu chi nhan la mot
// dong xu gieo theo muc tieu, ma vong cuoi lai ha chuan cho nhung level khong dat, nen ket qua
// luon lech ve phia DE. Ha muc tieu la cach bu lai ma khong pha cai co che do.
const WINCURVE = [[1, 0.95], [3, 0.80], [20, 0.58], [50, 0.52], [75, 0.42], [100, 0.28]];
function targetWin(id) {
  let a = WINCURVE[0], b = WINCURVE[WINCURVE.length - 1];
  for (let i = 0; i < WINCURVE.length - 1; i++)
    if (id >= WINCURVE[i][0] && id <= WINCURVE[i + 1][0]) { a = WINCURVE[i]; b = WINCURVE[i + 1]; }
  const t = b[0] === a[0] ? 0 : (id - a[0]) / (b[0] - a[0]);
  return a[1] + (b[1] - a[1]) * t;
}
// Ket qua mong muon cua rieng level nay: gieo co dinh theo so level nen khong doi giua hai
// lan chay, va khong lech ty le tren mot dai.
function wantWin(id) {
  const h = Math.sin(id * 12.9898) * 43758.5453;
  return (h - Math.floor(h)) < targetWin(id);
}

// ------------------------------------------------------------------ sinh mot level
// ⚠ Level 1-2 la man DAY, khong phai man de. Ban goc: level 1 la `A;R;R;R : B;R` - bon mieng
// cung mot mau do, hai ben. Nguoi choi chi phai hoc dung mot thu: cham vao khay thi hang do ra
// ray, va ben kia hut. Mot mau thi khong the cham sai, nen bai hoc di qua sach.
const TUTORIAL = {
  1: { colors: 1, lanes: 2, slot: 7 },
  2: { colors: 2, lanes: 3, slot: 8 },
};

function makeLevel(id, att = 0) {
  const r = rngFor(id, att);
  const c = curveAt(id);
  // ⚠ Gieo lai mai mot ban co khong chung minh duoc la thang duoc thi co the gieo mai khong
  // ra: voi mot bo tham so nao do, phan lon bo cuc ngau nhien deu chet. Tu lan gieo thu 6 tro
  // di thi HA DO KHO cua rieng level do - bot mot mau, them mot lane, tuc them cho trong.
  // Mot level de hon muc tieu mot chut van la mot level; mot level khong thang duoc thi khong.
  const ease = Math.max(0, att - 5);
  const colors = TUTORIAL[id] ? TUTORIAL[id].colors : Math.max(2, Math.min(COLORS.length,
    Math.round(c.colors + (r() < 0.5 ? 0 : 1) - 0.5) - ease));
  // ⚠ So lane phai bam theo SO MAU chu khong noi suy doc lap. Ban goc luon co lane nhieu
  // hon mau mot chut (11.9 lane / 11.5 mau), tuc moi lane ~4 mieng = vua mot khoang xe.
  // Noi suy hai duong rieng thi co luc lane < mau, moi lane hon 4 mieng, va ben nao cung
  // day cung tu choi nhan - ban co chet cung ngay tu dau (level 30 hong ca 6 lan gieo lai).
  // ⚠ Xac suat 0.55 nay chinh la CHO TRONG cua ban co, va no la don bay do kho manh nhat con
  // lai. Moi lane du 4 mieng nen moi lane thua la 4 o trong de xoay so. Do lai: dai 16-30 cua
  // minh co 8.3 lane cho 30 mieng (thua 3.2 o) trong khi ban goc 8.1 lane cho 31 mieng (thua
  // 1.4 o) - va do la ly do bot thang 80% cua minh so voi 60% cua ho, du so mau va so mieng
  // gan nhu y het. Ha xuong 0.3 de thua ~1.2 o, dung bang ho.
  let lanes = Math.max(2, Math.min(15, colors + (r() < 0.3 ? 1 : 0) + (ease ? 1 : 0)));
  if (TUTORIAL[id]) lanes = TUTORIAL[id].lanes;
  const slot = TUTORIAL[id] ? TUTORIAL[id].slot : Math.max(4, Math.round(c.slot + irnd(r, -1, 1)));
  // Nhan do kho: cu 5 level co mot cai deo nhan, xen ke Hard/SuperHard - dung ty le cua ho
  // (129 + 128 tren 1299).
  const theme = id % 10 === 5 ? "Hard" : id % 10 === 0 ? "SuperHard" : "Default";
  const sp = makeSpline(id, lanes, r);
  const ca = makeCarrier(id, sp.lanes, colors, r);
  return {
    level: { Map: 0, Carriers: id, Spline: id, Theme: theme, SlotCount: slot,
             CameraRotation: 0, ColorMix: 0, Id: id },
    spline: sp, carrier: ca, colors, lanes: sp.lanes,
  };
}

export { makeLevel, curveAt, COLORS };

// ------------------------------------------------------------------ chay
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i < 0 ? d : process.argv[i + 1]; };
  const TO = Number(arg("to", 1299));
  const verify = !process.argv.includes("--noverify");

  const att = new Array(TO + 1).fill(0);
  let levels = [], carriers = [], splines = [];
  const build = () => {
    levels = []; carriers = []; splines = [];
    for (let id = 1; id <= TO; id++) {
      const m = makeLevel(id, att[id]);
      levels.push(m.level); carriers.push(m.carrier);
      splines.push((({ lanes, shape, ...rest }) => rest)(m.spline));
    }
  };
  build();
  const areas = [
    { Type: "Harbor", UnlockLevel: 1 }, { Type: "Bazaar", UnlockLevel: 60 },
    { Type: "Alpine", UnlockLevel: 130 }, { Type: "Savanna", UnlockLevel: 210 },
    { Type: "Fjord", UnlockLevel: 300 }, { Type: "Canyon", UnlockLevel: 400 },
    { Type: "Lagoon", UnlockLevel: 520 }, { Type: "Tundra", UnlockLevel: 650 },
    { Type: "Oasis", UnlockLevel: 790 }, { Type: "Reef", UnlockLevel: 940 },
    { Type: "Volcano", UnlockLevel: 1100 }, { Type: "Aurora", UnlockLevel: 1250 },
  ];
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, "Levels.json"), JSON.stringify(levels));
  writeFileSync(path.join(OUT, "Carriers.json"), JSON.stringify(carriers));
  writeFileSync(path.join(OUT, "Splines.json"), JSON.stringify(splines));
  writeFileSync(path.join(OUT, "Areas.json"), JSON.stringify(areas));
  console.log(`da ghi ${levels.length} level vao ${OUT}`);

  if (verify) {
    // ⚠ Gieo lai level nao bot khong thang, KHONG phai noi long luat. Mot ban co bot khong
    // thang noi duoc mot trong hai dieu: hoac no khong the thang (khong duoc ship), hoac no
    // qua kho so voi cho dung cua no. Ca hai deu tra loi bang mot ban co khac o cung cho.
    // Gioi han 6 lan gieo: qua do ma van hong thi tham so cua dai level do sai, khong phai
    // xui - va luc do phai bao ra chu khong im lang ship.
    const { useData, rate, playOnce } = await import("./levelbot.mjs");
    const E = await import("./loopsort.js");
    let todo = [];
    for (let id = 1; id <= TO; id++) todo.push(id);
    for (let round = 0; round < 9 && todo.length; round++) {
      await useData(OUT);
      await E.loadData();
      const fail = [], geoFail = [], loose = [];
      for (const id of todo) {
        // ⚠ Hinh hoc truoc, bot sau: mot ban co ma xe chong nhau van co the thang duoc, nen
        // bot khong bao gio bao cho biet. Ba phep do, tat ca deu la loi da gap:
        //   fit   - engine tu co xe lai khi chung chong nhau. 1.0 la khong phai co.
        //   lech  - mieng ben so voi phap tuyen ray. Level 9 cua HO lech toi 36 do va doc
        //           ra "dốc nối xiên xẹo"; ban minh dung tu dau thi khong bao gio gap.
        //   cach  - ben cach ray bao nhieu. Xa qua thi hang bay long tong mot doan moi toi.
        const g = new E.Game(id);
        let geo = g.fit >= 0.85 ? "" : `fit ${g.fit.toFixed(2)}`;
        for (const t of g.trucks) {
          // ⚠ Do theo diem ray MA ENGINE NHAM TOI (`t.px,t.py`, do railToward ban theo huong
          // mieng ben), khong phai diem ray gan nhat. Ban dau do theo diem gan nhat va no bao
          // "lech 90 do" cho hang loat ben hoan toan binh thuong: o goc lom, mot khuc ray khac
          // co the gan hon chinh cai canh ma ben dang quay mat vao, va luc do phep do noi ve
          // mot khuc ray ma ben khong he lien quan.
          let bd = 1e9, bi = 0;
          for (let i = 0; i < g.ring.length; i++) {
            const d = (g.ring[i].x - t.px) ** 2 + (g.ring[i].y - t.py) ** 2;
            if (d < bd) { bd = d; bi = i; }
          }
          const n = g.ring.length;
          const a = g.ring[(bi - 2 + n) % n], b = g.ring[(bi + 2) % n];
          const tang = Math.atan2(b.y - a.y, b.x - a.x);
          let dd = (Math.atan2(t.my, t.mx) - (tang + Math.PI / 2)) * 180 / Math.PI;
          while (dd > 180) dd -= 360; while (dd < -180) dd += 360;
          const off = Math.min(Math.abs(dd), Math.abs(Math.abs(dd) - 180));
          const dist = Math.hypot(t.px - t.x, t.py - t.y);
          if (off > 12) geo = geo || `lane ${t.lane} lech ${off.toFixed(0)}do`;
          if (dist < 2.0 || dist > 4.2) geo = geo || `lane ${t.lane} cach ray ${dist.toFixed(1)}`;
        }
        if (geo) { fail.push(id); geoFail.push(id + ":" + geo); continue; }
        // ⚠ Tieu chi nhan la KHOP DUONG CONG, khong phai "bot thang thi nhan". Do ban goc
        // bang chinh con bot nay: no thang 73% o level 1-15, 60% o 16-30, 67% o 51-65 va tut
        // xuong 13% o 101-115. Tuc phan lon level cua ho o nua sau, bot KHONG thang. Doi bot
        // thang moi nhan la tu ep bo level cua minh de hon han ban goc - da do duoc dung dieu
        // do: sau mot vong gieo lai theo tieu chi cu, dai 60-75 cua minh thang 69% con ban goc
        // 31%.
        // Cach lam: moi level duoc gan truoc mot KET QUA MONG MUON theo ty le cua dai do
        // (gieo theo so level nen co dinh), roi gieo lai cho toi khi ban co cho ra dung ket
        // qua ay. Tong tren mot dai se bam sat ty le cua ban goc.
        // ⚠ Level "dang le bot thua" van phai CHUNG MINH duoc la co duong thang, neu khong thi
        // khong phan biet duoc "kho" voi "khong the thang". Bang chung: cho bot di chech
        // (slip) vai lan; chech duoc mot van thang la du.
        const want = wantWin(id);
        // ⚠ `rate().win` la TY LE (0..1), khong phai boolean. Viet `careful === want` voi
        // careful = 1 va want = true thi luon sai, va moi level deu rot - 0/20 dat o ca sau
        // vong ma khong mot dong loi nao.
        const careful = rate(E, id, 1).win > 0.5;
        let ok = careful === want;
        if (ok && !want) {
          ok = false;
          for (let k = 0; k < 6 && !ok; k++)
            if (playOnce(E, id, 77003 + id * 131 + k * 977, 0.12 + (k % 3) * 0.11).win) ok = true;
        }
        // ⚠ Vong cuoi thi ha tieu chi xuong con "chung minh duoc la thang duoc". Ep dung ket
        // qua mong muon la thu chinh duoc tren SO DONG level chu khong phai tren tung cai:
        // vai ban co cung ngoi nao cung cho ra mot ket qua, va giu chung lai lam ladder thung
        // mot lo - mot lo con te hon mot level lech ty le.
        if (!ok && round >= 7) {
          for (let k = 0; k < 8 && !ok; k++)
            if (playOnce(E, id, 5171 + id * 97 + k * 613, k % 2 ? 0.18 : 0).win) ok = true;
          if (ok) loose.push(id);
        }
        if (!ok) fail.push(id);
      }
      console.log(`  vong ${round}: ${todo.length - fail.length}/${todo.length} dat, gieo lai ${fail.length}` +
        (geoFail.length ? `  (hinh hoc: ${geoFail.length} - ${geoFail.slice(0, 3).join(", ")})` : "") +
        (loose.length ? `  (nhan theo tieu chi noi: ${loose.join(",")})` : ""));
      todo = fail;
      if (!todo.length) break;
      for (const id of todo) att[id]++;
      build();
      writeFileSync(path.join(OUT, "Levels.json"), JSON.stringify(levels));
      writeFileSync(path.join(OUT, "Carriers.json"), JSON.stringify(carriers));
      writeFileSync(path.join(OUT, "Splines.json"), JSON.stringify(splines));
    }
    if (todo.length) console.log("⚠ VAN HONG:", todo.join(","));
    else console.log(`bot thang ${TO}/${TO}`);
  }
}
