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

// ⚠ TRO THANG VAO BO LEVEL GOC trong Manythings/LoopSort-teardown/data, theo lenh chu du an
// ngay 2026-09-13: "b de lai bo level nhu game goc di, roi t se sua tu do". Bo tu sinh van con
// nguyen trong tools/loopsort/data/ va van sinh lai duoc bang levelgen.mjs - no chi khong con
// la bo dang duoc choi. Xem lai no bang `?data=./data/`.
// ⚠ VA VI THE DAY LA BAN CHAY TAI CHO, KHONG PHAI BAN DEM DI DEPLOY. Bo level goc co ban quyen
// (Garawell/Voodoo), `.gitignore` da loai no ra, nen mot ban build dua len GitHub se KHONG mang
// theo no: trang se fetch 404 roi dung hinh. Truoc khi deploy phai tra DATA ve "./data/".
// ⚠ Cua DEV de doi thu muc du lieu: `?data=/duong/dan/`. Dung de doi chieu hai bo level ma
// KHONG phai chep file nao vao du an - chep vao day la dua no vao ban build.
// ⚠ Phai chan `location`: file nay chay ca trong trinh duyet LAN trong Node (levelgen.mjs,
// levelbot.mjs, headless.mjs deu import no). Thieu cai chan thi moi cong cu do dac chet ngay
// o dong import voi mot loi khong lien quan gi toi viec chung dang lam.
// ⚠ BAN BUILD doc `./data/` (bo cua minh, co trong repo); may DEV van doc bo goc de doi chieu.
// Bo goc nam trong `Manythings/` - bi .gitignore loai ra - nen ban build ma tro vao do la fetch
// 404 roi dung hinh ngay man dau, dung kieu hong im lang. `import.meta.env` chi co khi chay qua
// Vite; trong Node (headless, levelbot, remap) no la undefined nen roi xuong nhanh DEV.
const DATA = (typeof location !== "undefined"
  && new URLSearchParams(location.search).get("data"))
  || (import.meta.env && import.meta.env.PROD
    ? "./data/"
    : "../../Manythings/LoopSort-teardown/data/");

// Shared candy-factory palette: engine, fallback and 3D artwork import the same colours.
const PALETTE = {
  R: "#ff4265", O: "#ff8a27", Y: "#ffd332", G: "#52d94c", B: "#36a9ff",
  P: "#ad62ff", PNK: "#ff65b2", GR: "#8590a6", BR: "#96592c", LB: "#21d8d0",
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
// ⚠ 64 VIEN THAT MOT HOP, moi vien la mot manh vat ly rieng tren ray - dung nhu dong "cat" cua
// ban goc Loop Sort. Chu du an 2026-09-17: "1 hop keo co 64 vien", vien tren ray nho va chay
// thanh dong dac. Truoc day la 8 me vat ly, moi me ve thanh 8 vien nho (64 vien chi la HINH), nen
// keo nho li ti va khong bao gio thay chung chen nhau.
// Ban goc dat cube cach nhau `Spacing` 0.58 tren cung don vi ray, ray mot hang chua ~15 cube cho
// moi o dem, long ray chua 3-4 hang -> ~60 cube moi o dem: tuc dung khoang 64 cube mot khoi, va
// o dem day nghia la ray dac kin, co cho con tran. Nen ray "thieu cho" khi o dem day la DUNG
// voi ban goc, khong phai loi.
const CANDIES_PER_BOX = 64;
const MINIS_PER_BELT_CANDY = 1; // moi manh ve dung mot vien
const MINI_CANDIES_PER_BOX = CANDIES_PER_BOX * MINIS_PER_BELT_CANDY; // 4 x 4 x 4 = 64.
// ⚠ MOT he so kich thuoc cho ca xe, hang va be rong ray - SCALE. Con so 1.5 la yeu cau cua
// chu du an ("tang kich thuoc ray va vali len 1.5 lan"), va no chi co nghia khi duong ray
// GIU NGUYEN kich thuoc: camera khop khung bao, nen phong to ca the gioi thi tren man hinh
// khong doi mot pixel. Cai to len o day la xe/hang/be rong ray SO VOI vong ray, tuc khoang
// trong trong long ray nho lai - do moi la thu doc ra "to hon".
// ⚠ Doi SCALE thi PHAI doi theo o ba cho: khoang cach dat ben trong levelgen.mjs, be rong
// cac dai ray trong three3d.js, va chinh no o day. Lech mot cho la xe chong nhau hoac ray
// khong con phu kin hang.
// ⚠ BA he so, vi ba thu bi ba thu khac chan:
//   SCALE      - chieu DAI khay (4 o hang noi tiep). Dai qua thi khay dai hon ca vong ray.
//   WIDE       - be NGANG khay. Do tren anh ban goc: khay cua ho ty le ngang:dai ~ 1:2.1,
//                con cua minh luc dau la 1:3.8 - thuon dai nhu que, nen trong be du dien tich
//                tuong duong. Phong to be ngang la cach lam khay "to" ma khong lam no dai ra.
//   CUBE_SCALE - mieng hang chay tren ray, bi BE RONG RAY chan (ray 2.82, khong doi).
// ⚠ 2.4: chieu DAI khay. Do tren anh chup that: ban co chiem 94% be ngang man hinh nhung chi
// 55% chieu cao - tuc be ngang la cai chan, con chieu cao dang bo khong 45%. Keo dai khay thi
// khung bao cao them, ma cao them KHONG lam camera lui ra (be ngang van chan), nen xe to len
// that su. Day la don bay duy nhat con lai sau khi da ep ray hep bang be ngang hang xe.
// ⚠ Ca ba he so ve 1 = kich thuoc goc. Lui theo lenh chu du an ("de design lai nhu ban dau
// truoc"), KHONG phai vi chung sai. So do noi ro benh "ray to vali be" nam o cho khac: vong
// ray bo sinh tao ra dai 29-77 don vi trong khi bo tham chieu chi 14-19, ma camera khop ca
// khung bao nen ray dai gap ba bon lan thi moi thu ve nho di tuong ung. Phong to vali 1.5 lan
// chi keo ti le vali/ray tu 2.9% len 4.3%, van chua bang mot nua muc 9.4% cua ban goc.
// Giu nguyen ba hang so nay de bat lai bang mot dong khi quay lai viec do.
export const SCALE = 1.40;
export const WIDE = 1.38;
// ⚠ Hai he so, khong phai mot. SCALE phong to KHAY (o hang, than xe) - cai nay tu do lon bao
// nhieu cung duoc vi camera se khop lai. Con mieng hang CHAY TREN RAY thi bi be rong ray chan:
// ray rong 2.82 va khong doi, nen cube ban kinh qua 1.1 la no tran ra ngoai hai mep ray.
// Ban kinh 0.20 (chu du an 2026-09-17: "doi thanh 64 vien thi cac vien tren ray be thoi"):
// long ray 1.84 chua 4 vien mot hang ngang, nen ray dac nhu dong cat cua ban goc va du cho hon.
export const CUBE_SCALE = 0.93;
const SLOT_LEN = 1.68 * SCALE;    // Full carton pitch; loose candy size must not change this.
const TRUCK_W = 2.6 * WIDE;   // rong than xe, cung do tu clip
const SPEED = 9.0;        // Whole candies travel slowly enough to follow by eye.
// Give the carton lid one readable beat before the first batch leaves. The renderer now keeps
// the selected carton and all pending candies visible in their real pocket during this delay,
// so this no longer creates the old empty-frame blink described by the previous zero value.
// ⚠ 0 (chu du an 2026-09-17): "khi click vao hop, thi no nhay keo ra luon, de trong truong hop
// user thich click vao hop ngay sau do thi k bi delay". Nhip mo nap chi con la HINH (bo ve doc
// `tapAt`); keo roi o ngay tu khung dau, va POUR_STAGGER van trai 64 vien ra thanh dong.
const CRUMBLE_MS = 0;
// ⚠ Ghi chep cu (thoi moi hop mot me, CRUMBLE_MS la khoang cach giua cac VALI) - con giu de
// biet vi sao khong duoc tha ca hang cung luc; nay khoang cach giua cac vien la POUR_STAGGER.
// Tu khi moi vali ra tu DUNG O CUA NO (xem tap()), khoang cach giua cac vali tren cau la
// (gian cach + mot o duong trong long xe), tuc DEU NHAU voi bat ky gian cach co dinh nao - nen
// cai "luc nhanh luc cham" chu du an bao khong den tu con so nay.
// Da thu 0 (tha ca hang cung luc) theo yeu cau "cho 2-3 vali di ra don gian" va NO PHA LUAT:
// bot tren 20 level dau cua ban goc tut tu 60% xuong 25%. Quet ca dai:
//     0 -> 25%     60 -> 30%     120 -> 55%     160 -> 65%     210 -> 60%
// (bot tat dinh, nen 3 hay 6 van moi level cho dung mot ket qua - chenh lech la that). Duoi
// ~100ms la vung hong; 160 ra gan nhau hon ban cu 210 ma van cach xa vung do.
// 64 vien mot hop: 14ms moi vien -> ca hop tuon ra trong ~0.9s, dung nhip "vo ra" cua ban goc.
const POUR_STAGGER = 14;
const EAT_MS = 30;        // nhip hut mot cube (~850ms/khoi, khop clip)
const POUR_GUARD = 900;   // ben khong hut lai cat cua chinh no trong ngan nay - xem absorb()
const ABSORB_MS = 190;    // thoi gian bay tu ray len khoang hang (chi con lam tran duoi)
// ⚠ Ba hang so duoi day ghim TOC DO, khong ghim THOI GIAN. Do tren 6 level: cu bay vao xe
// truoc day deu dai dung ABSORB_MS du quang duong chay tu 2.69 den 8.49 don vi, nen toc do
// tra ve tu 14.2 den 44.7 dv/giay - gap 1.6 den 5 lan bang chuyen (9). Vali dang troi thong
// tha tren ray bong vot di gap nam lan: dung cai "giat giat" chu du an bao. Ghim toc do thi
// cu xa bay lau hon cu gan, va do moi la chuyen dong binh thuong.
const FLY_SPEED = 18;     // toc do nhap vali vao khoang hang (dv/giay), gap doi bang chuyen
// ⚠ Tran phai du rong de KHONG cham toi trong choi binh thuong. Chang duong vao gio di vong
// theo cau (ray -> dau cau -> mieng khay -> o dich) nen dai 8-12 don vi chu khong con la doan
// thang 2.7-8.5; de tran 420ms thi cu dai bi kep, va kep thoi gian chinh la ghim thoi gian -
// dung cai benh vua chua. Do duoc: toc do vot len 35.8 dv/giay. 560ms phu toi 10 don vi.
const FLY_MIN = 200, FLY_MAX = 650;
// ⚠ Con cach ray bao xa thi vali bat dau be lai cho xuoi chieu ray. Phai NHO hon cau nhieu:
// cau chi dai 2.0 den 4.7 don vi, nen dat 2.2 thi vali roi cau tu giua duong roi truot cheo -
// do duoc lech toi 2.3 don vi khoi cai cau ma bo ve dang ve, va chu du an goi dung ten la
// "vali di duong rieng". 1.0 thi no bam cau gan het roi moi luon vao, va ban kinh luon van
// con lon hon than vali (1.22) nen khong thanh goc nhon.
const MERGE_LEAD = 1.0;
const DRAIN_MS = 830;     // hang rut khoi ben khi day
const CHECK_MS = 1500;    // dau tick con nam lai
const RIPPLE_MS = 360;

// --- physics ---
// Ray la mot MANG CO BE RONG, khong phai hang doi mot chieu: trong ban goc cube don
// thanh dong 2 hat ngang va xo nhau. Bang chuyen keo cube toi SPEED, va cham giu chung
// lai - nen he qua la "thay cho trong phia truoc thi troi vao", khong can luat rieng.
// ⚠ Long ray GIU NGUYEN (khong nhan SCALE): day la be rong duong ray, ma chu du an muon giu
// nhu cu. Hang to len 1.5 lan chay tren mot long ray khong doi, tuc hang lap day ray hon
// truoc - dung y do.
const CHANNEL = 0.92;     // Clearance for whole square candies.
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

// Do cong cua mot cu bay tu ray vao khoang hang. MOT dinh nghia, ca ban ve 3D lan ban 2D
// deu goi - chep thanh hai ban thi hai ban se troi khoi nhau.
//
// ⚠ Dieu kien la VAN TOC LUC ROI RAY PHAI BANG TOC DO BANG CHUYEN, roi giam dan ve 0 khi
// nhap o. Ease-out cu (1-(1-k)^2) xuat phat bang 2 lan toc do trung binh, tuc ~72 dv/giay
// so voi bang chuyen 9 - vali bi giat mot cai ngay luc roi ray. Da thuc bac ba duoi day co
// e(0)=0, e(1)=1, e'(1)=0 va e'(0)=s, nen dat s = SPEED*ms/quang_duong la van toc luc xuat
// phat khop dung bang chuyen. s nam trong [0,3] thi e van tang don dieu (e' = (3k+1)(1-k)
// khi s=1), khong bao gio lui.
export function flyEase(f, k) {
  const s = f.s === undefined ? 1 : f.s;
  return ((s - 2) * k + (3 - 2 * s)) * k * k + s * k;
}

// Vi tri va goc quay cua mot cu bay, tai thoi diem k trong [0,1]. MOT dinh nghia cho ca ban
// ve 3D lan 2D.
//
// ⚠ Di doc CHANG DUONG chu khong bay thang tu ray vao o. Duong thang tu diem tren ray toi o
// dich cat cheo qua thanh xe va khong dinh dang gi toi cai cau ma bo ve dang ve - nhin ra la
// vali nhay coc. Chang duong la: diem tren ray -> dau cau -> mieng ben -> o dich, tuc dung
// nguoc lai chang duong luc no di ra.
// ⚠ Chia theo DO DAI CUNG (f.plen), khong chia deu cho so doan: cac doan dai ngan rat khac
// nhau, chia deu thi vali luot cham o doan ngan va vut qua o doan dai - lai giat.
// Cat goc Chaikin: moi doan trong duoc thay bang hai diem o 1/4 va 3/4, giu nguyen hai dau.
// ⚠ Chang duong vao co goc gap thuc su o dau cau va o mieng khay. Di dung goc gap voi toc do
// khong doi la do cong vo han - mat nhin ra ngay la mot cai be gap, va huong quay cua vali
// nhay mot phat: do duoc p99 91.5 do va co cu 175 do trong MOT khung. Hai luot cat goc lam
// ban kinh luon con khoang 1/4 doan ngan nhat, du de mat doc ra la "di vong qua goc".
function chaikin(P, passes) {
  for (let n = 0; n < passes; n++) {
    if (P.length < 3) return P;
    const out = [P[0]];
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1];
      if (i > 0) out.push({ x: a.x + (b.x - a.x) * 0.25, y: a.y + (b.y - a.y) * 0.25 });
      if (i < P.length - 2) out.push({ x: a.x + (b.x - a.x) * 0.75, y: a.y + (b.y - a.y) * 0.75 });
    }
    out.push(P[P.length - 1]);
    P = out;
  }
  return P;
}

export function flyPos(f, k) {
  const e = flyEase(f, k);
  const P = f.path;
  if (!P || P.length < 2)
    return { x: f.fx + (f.tx - f.fx) * e, y: f.fy + (f.ty - f.fy) * e, rot: f.rot };
  const here = walk(P, e * f.plen);
  // ⚠ Goc quay NOI SUY tu goc luc roi ray sang goc truc khay, khong doc dao ham cua duong di.
  // Doc dao ham thi moi cho duong be goc la mot cu quay - do duoc p99 43 do, co cu 180 do
  // trong mot khung, ke ca khi da lam tron goc va lay cua so nhin truoc. Noi suy thi tron theo
  // dinh nghia, va no dung y nghia hon: vali dang xoay cho khop voi o no sap nam vao.
  let d = (f.rot1 === undefined ? f.rot : f.rot1) - f.rot;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return { x: here.x, y: here.y, rot: f.rot + d * e };
}

// Diem tren duong gap khuc P o do dai cung s.
function walk(P, s) {
  for (let i = 0; i < P.length - 1; i++) {
    const dx = P[i + 1].x - P[i].x, dy = P[i + 1].y - P[i].y;
    const d = Math.hypot(dx, dy);
    if (s <= d || i === P.length - 2) {
      const u = d > 1e-6 ? Math.max(0, Math.min(1, s / d)) : 1;
      return { x: P[i].x + dx * u, y: P[i].y + dy * u };
    }
    s -= d;
  }
  return P[P.length - 1];
}

export function areaOf(id) {
  let a = null;
  for (const x of AREAS) if (x.UnlockLevel <= id) a = x;
  return a ? a.Type : "";
}

// Thanh pho thu may - de bo ve chon anh nen. ⚠ Tra ve CHI SO chu khong phai ten: bo ve chi
// can biet "doi sang khu khac", con ten thanh pho la viec cua giao dien.
export function areaIndexOf(id) {
  let i = 0;
  for (let k = 0; k < AREAS.length; k++) if (AREAS[k].UnlockLevel <= id) i = k;
  return i;
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

function curvePath(pts, closed) {
  const n = pts.length, out = [];
  const get = (i) => {
    if (closed) return pts[(i + n) % n];
    if (i < 0) return { x: 2 * pts[0].x - pts[1].x, y: 2 * pts[0].y - pts[1].y };
    if (i >= n) return { x: 2 * pts[n - 1].x - pts[n - 2].x, y: 2 * pts[n - 1].y - pts[n - 2].y };
    return pts[i];
  };
  const blend = (a, b, ta, tb, t) => {
    const d = Math.max(tb - ta, 1e-6), wa = (tb - t) / d, wb = (t - ta) / d;
    return { x: wa * a.x + wb * b.x, y: wa * a.y + wb * b.y };
  };
  const first = closed ? 0 : 0, segments = closed ? n : n - 1;
  for (let i = first; i < segments; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const spacing = (a, b) => Math.max(Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)), 1e-3);
    const t0 = 0, t1 = t0 + spacing(p0, p1), t2 = t1 + spacing(p1, p2), t3 = t2 + spacing(p2, p3);
    const steps = Math.max(8, Math.ceil((t2 - t1) * 8));
    for (let k = 0; k < steps; k++) {
      const t = t1 + (t2 - t1) * (k / steps);
      const a1 = blend(p0, p1, t0, t1, t), a2 = blend(p1, p2, t1, t2, t);
      const a3 = blend(p2, p3, t2, t3, t);
      const b1 = blend(a1, a2, t0, t2, t), b2 = blend(a2, a3, t1, t3, t);
      out.push(blend(b1, b2, t1, t2, t));
    }
  }
  if (!closed) out.push(pts[n - 1]);
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
// ⚠ Export vi EDITOR phai suy nguoc: keo mot ben toi cho moi thi `rot` cua no phai tinh lai.
// Editor tu viet lai phep nay la ban sao thu hai cua mot luat hinh hoc - hai ban se troi khoi
// nhau va luc do ben ve mot huong con hang bay ve mot huong khac. Editor chi duoc chon `rot`
// bang cach THU ca bon goc qua chinh ham nay.
export function mouthFromRot(deg) {
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

    // Use one continuous centripetal spline through the authored route points. Some
    // curves are encoded as short successive segments, so rounding each point separately
    // left visible kinks on the finished belt. Art and movement share this same smooth path.
    this.ring = densify(curvePath(sp.path, sp.closed), sp.closed, 0.18);
    this.len = totalLen(this.ring, sp.closed);

    this.r = 0.215 * CUBE_SCALE;               // Reference-like large candies; two can sit abreast on the belt.
    const d = this.r * 2;
    this.abreast = Math.max(1, Math.floor((2 * (CHANNEL - this.r)) / d) + 1);
    this.railSlots = Math.floor((this.len / d) * this.abreast * 0.8);
    this.slotCount = lv.SlotCount;
    // Eight conveyor batches pack one box. The renderer splits each batch into eight
    // minis, so a completed box visibly contains a 4 x 4 x 4 stack (64 candies).
    this.perBlock = CANDIES_PER_BOX;
    this.capCubes = this.slotCount * this.perBlock;

    this.trucks = parseCarrier(CARRIERS[lv.Carriers]).map((t) => {
      const dk = sp.docks[t.lane];
      const d = mouthFromRot(dk.rot);
      const near = this.railToward(dk.x, dk.y, d.x, d.y);
      return {
        lane: t.lane, blocks: t.blocks, x: dk.x, y: dk.y, mx: d.x, my: d.y,
        px: near.px, py: near.py,
        cap: CAP, fill: 0, claim: null, lastDump: null, gone: false, ate: 0, ripple: -1, drain: -1, check: -1,
        confetti: [], miniPops: [],
      };
    });
    for (const t of this.trucks) this.reveal(t);

    // ⚠ CO THAN XE THEO TUNG LEVEL. SLOT_LEN do tu clip level 1-5 - nhung ban co THUA. Du lieu
    // cua ho dat cac ben sat nhau hon nhieu o ban dong xe, nen xe dung kich thuoc co dinh se
    // PHINH RA DE LEN NHAU: quet 1299 level thi 263 level (20.2%) co it nhat mot cap chong,
    // tong 2844 cap, nang nhat la level 60 voi 29 cap. Xe bi de khong con mot diem nao de cham
    // - picktest level 1299 ra 4/12.
    // ⚠ KHONG phai loi camera: da do fov 32/12/7 va do doc 56/72/83 do, TAT CA deu ra 4/12.
    // ⚠ KHONG duoc chua bang cach giam t.cap - so o hang la LUAT choi, khong phai hinh hoc.
    this.fit = 1;                       // he so co than xe cua rieng level nay, luon <= 1
    if (this.trucks.length > 1) {
      // ⚠ Phai co CA HAI CHIEU. Rut ngan thoi thi khong du: hai xe SONG SONG nam sat canh nhau
      // chong theo chieu RONG, ngan bao nhieu cung khong roi nhau. Do duoc: chi co chieu dai thi
      // level 60 tu 29 cap chi xuong 8, level 52 va 333 khong nhuc nhich.
      const hits = (f) => {
        const bs = this.trucks.map((t) => {
          const L = t.cap * SLOT_LEN * f, h = TRUCK_W * f / 2;
          const nx = -t.my, ny = t.mx, pts = [];
          for (const k of [0, L]) for (const sg of [-1, 1])
            pts.push({ x: t.x - t.mx * k + nx * sg * h, y: t.y - t.my * k + ny * sg * h });
          return { x0: Math.min(...pts.map((p) => p.x)), x1: Math.max(...pts.map((p) => p.x)),
                   y0: Math.min(...pts.map((p) => p.y)), y1: Math.max(...pts.map((p) => p.y)) };
        });
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], b = bs[j];
          if (Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) &&
              Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0)) return true;
        }
        return false;
      };
      // Chi co lai, khong bao gio phong to: ban thua giu nguyen kich thuoc do tu clip.
      if (hits(1)) {
        let lo = 0.10, hi = 1;
        for (let i = 0; i < 24; i++) {
          const mid = (lo + hi) / 2;
          if (hits(mid)) hi = mid; else lo = mid;
        }
        this.fit = lo;
      }
    }
    this.slotLen = SLOT_LEN * this.fit;
    this.truckW = TRUCK_W * this.fit;

    this.cubes = [];   // {x,y,vx,vy,rot,vrot,color,sz,seg}
    this.pending = []; // {color, truck, at}
    this.flying = [];  // hieu ung: cube dang bay tu ray vao khoang hang
    this.state = "play";
    this.taps = 0;
    this.peak = 0;
    this.history = [];
    this.pourSeq = 0;
    // Candy units, by colour. Removed stock remains accountable after delivery/revive.
    this.delivered = {};
    this.revived = {};
    this.now = performance.now();
    this.bounds = this.computeBounds();
  }

  // Diem ray gan nhat NAM VE PHIA mieng ben dang quay toi.
  //
  // ⚠ Da thu thay bang "ban mot tia thang tu mieng khay ra, lay cho tia cat vong ray" - de dot
  // noi thang hang voi khay. Ve so do thi dep hon that: 14708/14779 dot thang tap 0 do, thay vi
  // lech toi 38.5 do tren spline hinh so 8. NHUNG NHIN THI XAU: o level 9 hai ben giua nam ngay
  // tren cho hai vong giao nhau, ray o do chay gan nhu song song voi tia, nen cho cat dau tien
  // o tan vong duoi - cai dot dai ngoang cat ngang ca ban co. Chu du an xem anh va chot bo.
  // Giu cach cu; phan lech thi da duoc xu ly o chO KHAC roi: duong di cua vali bam theo HUONG
  // CAU CO DINH (xem nhanh nhap ray trong physics), nen dot ve xien thi vali cung di xien dung
  // y nhu the - hai duong trung nhau, do duoc lech toi da 0.69 don vi.
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
      const L = t.cap * this.slotLen + 0.5, w = this.truckW / 2 + 0.3;
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
    const along = t.cap * this.slotLen - (i + (frac === undefined ? 0.5 : frac)) * this.slotLen;
    return { x: t.x - t.mx * along, y: t.y - t.my * along };
  }

  // Public packing coordinates, shared by flights and renderers. Local +u follows
  // (mx,my), +v follows (-my,mx), exactly the full box's coordinate system.
  candyPos(t, slot, piece) {
    const p = this.slotPos(t, slot);
    // 64 o = luoi 4x4 x 4 tang. Cac tang chung mot toa do mat san; do cao la viec cua bo ve.
    const cell = piece % 16;
    const u = (cell % 4 - 1.5) * this.slotLen * 0.235;
    const v = (Math.floor(cell / 4) - 1.5) * this.slotLen * 0.235;
    return { x: p.x + t.mx * u - t.my * v, y: p.y + t.my * u + t.mx * v };
  }

  packing(t) { return t.fill > 0 || this.flying.some((f) => f.truck === t); }

  // Khay nay co duoc BAT DAU mot hop mau `color` khong. Luat: MOI MAU CHI MOT HOP DANG DO.
  //
  // ⚠ Thieu luat nay thi ban co chet ma nguoi choi khong co loi gi. Keo ra theo hop 8 vien,
  // nhung moi vien bi hut rieng le boi khay nao no di ngang truoc - nen 8 vien cua mot hop co
  // the bi CHIA cho hai khay. Hai hop do khong bao gio du 8, ca hai khay ket o trang
  // thai dang dong hop: khong cham duoc (packing), chi nhan dung mau do, ma mau do da het. Do
  // tren 20 level dau cua ban goc: 79 trong 95 van bot thua co dung canh nay.
  //
  // Vi sao mot hop dang do la du: keo luon vao/ra theo boi cua 8 (do ra 8 vien mot hop, giao
  // xong rut 8 vien mot hop), nen tong vien X (dang do + tren ray + cho do) chia het cho 8. Chi
  // mot hop X dang do voi f vien thi so X con lai >= 8 - f, tuc hop do LUON dong duoc.
  canStart(t, color) {
    if (t.fill > 0) return true;           // dang do chinh hop cua no - accepts() da kiem mau
    return !this.trucks.some((o) => o !== t && !o.gone && o.fill > 0 && o.claim === color);
  }

  // Ben nay co nhan mau nay khong.
  //  - da giao xong / day cho   -> khong nhan gi
  //  - dang gom do mot khoi roi -> chi nhan dung mau do
  //  - con khoi o mieng         -> chi nhan dung mau khoi o mieng
  //  - RONG HAN (het khoi)      -> nhan MOI mau, khong giu mau nao lam cua chan
  //
  // ⚠ Luat do chu du an chot: "Xe rong CO THE nhan duoc hang. Chi co xe da du mau, da
  // dong nap lai, thi khong nhan duoc hang."
  // ⚠ Bao cao nguoi choi "xe trong, khay van co cat, ma no khong chay vao" chinh la mot
  // ben RONG dang tu choi hang. Nen dong duoi day tra ve true: ben rong nhan het moi mau.
  // ⚠ `if (color === t.lastDump) return false` truoc day la mot co TU CHE: no lam mot ben
  // rong tu choi VINH VIEN dung mot mau, va chinh no sinh ra dau gach cheo 'not allowed'
  // ve tu `t.lastDump`. Da bo.
  // ⚠ Chuyen ben hut lai dong cat minh vua do ra gio duoc chan trong absorb() bang NGUON
  // GOC (c.src) va THOI GIAN (t.pourUntil) - xem chu thich o absorb(), khong can `lastDump`.
  accepts(t, color) {
    if (t.gone) return false;
    if (t.blocks.length >= t.cap) return false;
    if (t.fill > 0) return color === t.claim;
    if (!t.blocks.length) return true;
    return color === t.blocks[t.blocks.length - 1].color;
  }

  // Mau dai dien cho HUD/bot. "*" nghia la ben rong, dang cho mau dau tien toi. Phai
  // noi cung mot thu voi accepts(): ben rong tra "*", ben co hang tra mau khoi o mieng.
  wants(t) {
    if (t.gone || t.blocks.length >= t.cap) return null;
    if (t.fill > 0) return t.claim;
    if (!t.blocks.length) return "*";
    return t.blocks[t.blocks.length - 1].color;
  }

  // Belt stock includes candies still waiting to leave their original cartons.
  loose() { return this.cubes.length + this.pending.length; }
  // Preserve box-equivalent gating: partial packing still occupies loose capacity.
  // Flights already belong to fill or a reserved block, so never add flying.length.
  candyCount() {
    let grains = this.loose();
    for (const t of this.trucks) grains += t.fill;
    // A fully reserved box owns all eight candies, including its outstanding flights.
    // A partial box owns fill reservations (arrived + incoming), counted exactly once.
    return grains;
  }
  counter() { return Math.ceil(this.candyCount() / this.perBlock); }

  // One click opens exactly one candy box. `slot` is optional so bots and old tools
  // keep selecting the front box, while the 3D picker can address the box the player
  // actually touched.
  tapSlot(t, slot) {
    if (!t || !t.blocks.length) return -1;
    return Number.isInteger(slot) && slot >= 0 && slot < t.blocks.length
      ? slot : t.blocks.length - 1;
  }

  tapLoad(t, slot) {
    const i = this.tapSlot(t, slot);
    if (i < 0) return 0;
    const b = t.blocks[i];
    return b.hidden && !b.seen ? 0 : 1;
  }

  // ⚠ HET CHO TREN RAY KHONG PHAI LA THUA - chi la khong cham duoc vali nua, cho toi khi
  // cac ben nuot bot hang. Truoc day tran ray la `state = "lose"` ngay lap tuc, va no sai
  // ca ve luat lan ve cam giac: ray day la mot trang thai TAM THOI, no tu go khi hang chay
  // vao ben, con thua thi khong go duoc. Thua chi con dung mot nghia: ban co chet han
  // (isStuck).
  canTap(t, slot) {
    if (this.state !== "play" || t.gone || !t.blocks.length || t.drain >= 0) return false;
    // ⚠ Khay dang co vali BAY VAO thi khong cham duoc. Giao hang bi hoan toi luc vali cuoi
    // ha canh (xem vong deliver trong step), nen trong ~0.4-0.65 giay do mot khay da du bo van
    // nam do voi day hang - va ray thi trong tron vi moi vali dang tren khong. Cho cham luc do
    // thi khay bi do nguoc ra truoc khi kip giao, va khong bao gio giao duoc: do tren level 1
    // cua ban goc, bot do qua do lai 49 lan trong 240 giay ma khong thang, va ca bo 20 level
    // tut tu 55% xuong 20%. Nguoi choi cung lam duoc dieu do, va no doc ra la vo ly: cham
    // vao mot khay sap dong nap thi hang tuon ra.
    if (this.packing(t)) return false;
    // ⚠ Hop truoc con dang tuon keo KHONG chan cu cham tiep: tap() tha not ngay phan keo con
    // lai cua hop do (releaseDue) truoc khi rut hop moi ra, nen so o cua khay khong bi xo lech.
    const load = this.tapLoad(t, slot);
    return load === 1 && this.counter() + load <= this.slotCount;
  }

  canTapAny(t) {
    if (!t || !t.blocks.length) return false;
    for (let slot = 0; slot < t.blocks.length; slot++)
      if (this.canTap(t, slot)) return true;
    return false;
  }

  // Ban co chet han: khong cham duoc vali nao, va khong mieng hang nao dang tren ray co
  // ben nhan. ⚠ Chi hoi khi moi thu da DUNG YEN - con hang dang tuon ra, dang bay vao ben
  // hay mot ben dang rut hang thi ban co van dang chay, va tra loi luc do la doan mo.
  isStuck() {
    if (this.state !== "play") return false;
    if (this.pending.length || this.flying.length) return false;
    for (const t of this.trucks) if (!t.gone && t.drain >= 0) return false;
    for (const c of this.cubes)
      for (const t of this.trucks) if (this.accepts(t, c.color)) return false;
    for (const t of this.trucks) if (this.canTapAny(t)) return false;
    return true;
  }

  tap(t, slot) {
    if (!this.canTap(t, slot)) return false;
    const now = this.now;
    t.ripple = now;
    // Hop truoc cua khay nay con keo cho tuon: tha het ngay bay gio, tu DUNG o cu cua no,
    // truoc khi splice lam lech chi so o.
    if (this.pending.some((p) => p.truck === t)) {
      for (const p of this.pending) if (p.truck === t) p.at = now;
      this.releaseDue(now, t);
    }
    const selected = this.tapSlot(t, slot);
    t.rippleSlot = selected;
    const [box] = t.blocks.splice(selected, 1);
    const c = box.color;
    const n = 1;
    t.fill = 0;
    t.claim = null;
    // ⚠ KHONG con gan t.lastDump nua - xem chu thich o accepts(). Truong nay de nguyen
    // null mai mai: phan VE con doc no de ve dau gach cheo, de null thi dau do tu bien
    // mat ma khong phai dung vao ham ve (mot phien khac dang sua phan ve).
    this.reveal(t);
    this.taps++;
    const pour = ++this.pourSeq;
    this.history.push({ truck: t, color: c, n, slot: selected, box, pour });
    // All eight pieces retain the selected box's pocket. The renderer leaves a
    // temporary gap there until the last piece starts moving, then compacts the row.
    for (let piece = 0; piece < this.perBlock; piece++)
      this.pending.push({ color: c, truck: t, slot: selected, piece, pour,
                          tapAt: now,
                          at: now + CRUMBLE_MS + piece * POUR_STAGGER });
    this.peak = Math.max(this.peak, this.counter());
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
      // ⚠ Vali con TRONG LONG XE khong chiu mot ti vat ly nao cua ray. No di thang theo truc
      // than xe ra mieng, het. Truoc day no van qua cac phep kep cua ray, va vach `maxOff`
      // (cach tim mang 3.81) keo no ngang ve phia ray - do duoc: mot vali bi ghim cung o
      // x=4.88 trong khi mieng khay o x=6.00, roi no bay nguoc lai mieng khay ma khong bao gio
      // toi, dung im |v|=9 suot 68 giay. Ray o ngoai, san xe o trong; hai thu khong dinh gi
      // den nhau. `way` co han muc quang duong nen doan nay khong the keo dai mai.
      if (c.way && c.way.length) {
        const g = c.way[0];
        let ax = g.x - c.x, ay = g.y - c.y;
        const d = Math.hypot(ax, ay);
        if ((c.x - g.x) * g.nx + (c.y - g.y) * g.ny >= -0.02 ||
            d <= SPEED * dt * 1.2 || (c.lap || 0) > g.budget) c.way.shift();
        ax /= (d || 1); ay /= (d || 1);
        c.vx = ax * SPEED; c.vy = ay * SPEED;
        c.x += c.vx * dt; c.y += c.vy * dt;
        continue;
      }
      const p = this.probe(c);
      // ⚠ Giu TIEP TUYEN LIEN TUC cho vali chua nhap ray. O cho hai nhanh cua spline hinh so 8
      // giao nhau (level 9), diem ray gan nhat nhay qua lai giua hai nhanh CHAY NGUOC CHIEU, nen
      // tiep tuyen doi dau moi nua buoc - va huong nham doi dau theo. Do duoc: van toc lat tu
      // (-8.91,-1.30) sang (+8.91,+1.30) va nguoc lai, vali dung y mot cho, |v|=9 ma khong nhuc
      // nhich, khong bao gio nhap ray. Chi ap cho vali CHUA nhap ray: vali dang chay tren ray
      // van dung tiep tuyen goc, de khong dong vao hanh vi bang chuyen ma thuoc do dang bao dat.
      if (!c.landed) {
        if (c.mtx !== undefined && p.tx * c.mtx + p.ty * c.mty < 0) { p.tx = -p.tx; p.ty = -p.ty; }
        c.mtx = p.tx; c.mty = p.ty;
      }
      const nx = -p.ty, ny = p.tx;
      const off = (c.x - p.px) * nx + (c.y - p.py) * ny;
      let vt = c.vx * p.tx + c.vy * p.ty;
      let vn = c.vx * nx + c.vy * ny;

      // ⚠ KHONG duoc chan `landed` cho toi khi di het chang duong. Da thu va no KET: vong go
      // chong lan cuoi moi buoc day vali dang ra khoi khay lech sang ben, do duoc toi 1.12 don
      // vi, nen no khong bao gio qua duoc mat phang miengm khay - ma chan lai thi no cung khong
      // bao gio nhap ray, dung im mot cho voi |v|=9. Level 1 tu intake 98.6% tut ve 0%.
      // Chang duong chi de LAI HUONG. Cham tim mang la nhap ray, dung nhu truoc gio. Khong sinh
      // ra nhap ray som duoc: mieng ben cach ray 2.0 den 4.7 don vi, con lim chi 0.31.
      if (!c.landed && Math.abs(off) <= lim) { c.landed = true; c.way = null; }
      if (c.landed) {
        vt += (SPEED - vt) * Math.min(1, DRIVE * dt);  // bang chuyen keo phuong DOC
        vn *= Math.exp(-NDAMP * dt);                   // ma sat ngang, cho cube lang xuong
        c.vx = p.tx * vt + nx * vn;
        c.vy = p.ty * vt + ny * vn;
      } else {
        // ⚠ RA KHOI KHAY: giu nguyen TOC DO, chi doi HUONG. Truoc day khuc nay la mot luc keo
        // PULL=34 va de vali tu do tang toc - do duoc no vot tu 7.1 len 16.7 dv/giay (gan gap
        // doi bang chuyen 9), roi dung khung cham mang thi vach cung an sach thanh phan ngang
        // va toc do sup con 3.9 trong MOT khung: buoc nhay 9.6 dv/giay, chinh la cu giat.
        // Gio do dai van toc luon bang SPEED tu luc roi mieng khay toi luc nhap ray, nen khong
        // con buoc nhay nao - vali chi BE HUONG chu khong doi toc.
        // Huong mong muon: con xa ray thi di dung theo huong mieng khay (t.mx, t.my) - "di tu
        // khay ra" - toi gan thi xoay dan cho xuoi chieu ray de nhap lan. Khong nhay thang vao
        // diem bat ray: tren spline hinh so 8 (level 9) mieng ben lech toi 36 do so voi phap
        // tuyen ray, va nhay thang se cat cheo qua mat mang.
        let ax, ay;
        {
          // Ba cach nham, hai cach dau da thu va deu hong - ghi lai de khoi thu lai:
          //
          //  1. Theo HUONG THAN XE (t.mx,t.my). Khi ben dat lech so voi ray - tren spline hinh
          //     so 8 level 9 lech toi 38.5 do - huong nay gan nhu song song voi ray, khong co
          //     thanh phan nao cat vao. Do duoc: 90 khung van chua cham ray, vali bay mat.
          //  2. Nham vao DAU CAU (t.px,t.py) tinh lai moi khung. Dung cho toi khi vali di QUA
          //     dau cau; qua roi thi vector quay nguoc lai, keo vali lui, va no lai khong bao
          //     gio cham ray. Do duoc tren level 3 lane A: bam cau den khung 18 roi lech ra mai.
          //  3. Cach dung: HUONG CAU CO DINH, do mot lan tu (t.x,t.y) den (t.px,t.py). Vector
          //     co dinh thi khong bao gio quay nguoc, va no luon co thanh phan cat vao ray (goc
          //     lech lon nhat do duoc la 36 do, tuc con 0.81 thanh phan huong vao).
          //
          // ⚠ Va KHONG duoc tru `lim` truoc khi chia. Tru xong thi w ve dung 0 tai dung nguong
          // `landed`, tuc thanh phan cat vao tat han dung luc con thieu mot chut nua moi cham -
          // vali tiem can mai khong cat qua. Giu |off|/MERGE_LEAD thi tai nguong van con
          // w = 0.14, du de cat. Ban giao cung khong giat: luc cham ray van toc da 86% tiep
          // tuyen nen nhanh `landed` chi lam vn tat dan.
          const src = c.src;
          let ox = 0, oy = 0, od = 0;
          if (src) { ox = src.px - src.x; oy = src.py - src.y; od = Math.hypot(ox, oy); }
          // ⚠ Chi bam huong cau KHI CON TREN CAU. Qua khoi dau cau roi ma van bam huong cu thi
          // gap doan ray uon di, vali cu the chay thang mai - do duoc lech toi 17.7 don vi tren
          // level 61 lane A, tuc bay vong qua ca ban co. Ra khoi cau roi thi cat thang vao tim
          // mang: huong do luon hoi tu, khong bao gio dan vali di lac.
          //
          // ⚠ Va phai CHOT MOT CHIEU (c.offRamp), khong duoc hoi lai moi buoc. Hai huong nay
          // lech nhau toi 120 do, nen ngay tai nguong cai test rung: nua buoc bao con tren cau,
          // nua buoc sau bao het, van toc lat tu (-8.91,-1.30) sang (+8.91,+1.30) roi lat lai -
          // vali dung y mot cho voi |v|=9 va khong bao gio nhap ray. Do duoc tren level 9 lane E,
          // ket 43 giay. Chot roi thi ra khoi cau la ra han.
          if (!c.offRamp && (od <= 0.4 || ((c.x - src.x) * ox + (c.y - src.y) * oy) / od >= od)) {
            c.offRamp = true; c.offAt = c.lap || 0;
          }
          // Huong cau, va huong cat thang vao tim mang.
          let rx, ry;
          if (od > 0.4) { rx = ox / od; ry = oy / od; }
          else { rx = -Math.sign(off) * nx; ry = -Math.sign(off) * ny; }
          const qx = -Math.sign(off) * nx, qy = -Math.sign(off) * ny;
          if (!c.offRamp) { ox = rx; oy = ry; }
          else {
            // ⚠ Doi huong DAN trong 0.8 don vi duong di, khong doi mot phat. Hai huong lech nhau
            // toi 120 do nen doi ngay la mot cu lat thay ro: do duoc 98 do trong mot khung.
            // 1.6 don vi ~ 0.18 giay o toc do bang chuyen.
            const k = Math.min(1, ((c.lap || 0) - (c.offAt || 0)) / 1.6);
            ox = rx * (1 - k) + qx * k; oy = ry * (1 - k) + qy * k;
          }
          const w = Math.min(1, Math.abs(off) / MERGE_LEAD);
          ax = ox * w + p.tx * (1 - w); ay = oy * w + p.ty * (1 - w);
        }
        let m = Math.hypot(ax, ay);
        // Hai huong triet tieu nhau (dau cau nam nguoc chieu ray): quay ve huong cat vao mang.
        if (m < 1e-3) { ax = -Math.sign(off) * nx; ay = -Math.sign(off) * ny; m = 1; }
        c.vx = (ax / m) * SPEED; c.vy = (ay / m) * SPEED;
      }
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
      } else if (!c.src && Math.abs(off) > maxOff) {
        // ⚠ `!c.src`: vach nay de keo lai vali di lac, KHONG duoc dong vao vali dang tren duong
        // ra khoi khay. Mieng ben cach tim ray toi 4.71 don vi (level 9 lane E) trong khi vach
        // o 3.81, nen vali vua roi long xe la bi giat ngang 0.9 don vi - no van di song song
        // voi cau nhung lech han 0.83, truot qua dau cau va khong bao gio nhap duoc ray. Duong
        // ra da co lai huong rieng va chac chan hoi tu, khong can vach nay giup.
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
    //
    // ⚠ Vali CHUA NHAP RAY thi khong tham gia go chong lan. No dang nam trong long xe hoac
    // dang truot tren cai cau noi xuong - ca hai deu o mat phang khac voi bang chuyen, nen cho
    // no day nhau voi vali dang chay tren ray la sai ve vat ly. Hau qua do duoc, hai kieu:
    //   - vali trong long xe bi day dat sang ben 1.12 don vi roi nham nguoc lai mieng khay ma
    //     vat nhau voi bang chuyen, dung im |v|=9 suot 68 giay.
    //   - vali xuong toi noi thi bi ket NGAY CANH doan dang xep hang, cach tim mang 0.61 (chi
    //     can 0.31 la nhap duoc), huc mai khong lot ma cung khong troi di: treo 34 giay.
    // Nhap ray roi thi no tham gia binh thuong, ke ca khi phai chen vao cho chat - vong go
    // chong lan giai quyet trong vai khung, va do dung la hinh anh "ray dang dong".
    const cell = r * 2.2;
    const inTruck = (c) => !c.landed;
    // Khoa o luoi la SO, khong phai chuoi "x,y": 64 vien mot hop dua ray len toi vai tram manh,
    // va noi chuoi trong vong lap nay chiem phan lon thoi gian mot buoc vat ly. Cung o, cung thu
    // tu nen ket qua khong doi mot bit.
    const key = (gx, gy) => (gx + 32768) * 65536 + (gy + 32768);
    for (let pass = 0; pass < RELAX; pass++) {
      const grid = new Map();
      for (let i = 0; i < n; i++) {
        const c = cubes[i];
        if (inTruck(c)) continue;
        const k = key((c.x / cell) | 0, (c.y / cell) | 0);
        let a = grid.get(k);
        if (!a) grid.set(k, (a = []));
        a.push(i);
      }
      for (let i = 0; i < n; i++) {
        const a = cubes[i];
        if (inTruck(a)) continue;
        const cx = (a.x / cell) | 0, cy = (a.y / cell) | 0;
        for (let gx = cx - 1; gx <= cx + 1; gx++)
          for (let gy = cy - 1; gy <= cy + 1; gy++) {
            const arr = grid.get(key(gx, gy));
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

  // Tha cac vien da toi gio (`only`: chi cua mot khay) tu o cua chung ra mieng khay.
  releaseDue(now, only = null) {
    // nha cube dang cho ra khoi mieng ben. Khong can cho ray trong: cube ra la roi
    // vao mang, ray tac thi chung don ngay o mieng - dung nhu ban goc.
    for (let i = 0; i < this.pending.length; i++) {
      const p = this.pending[i];
      if (p.at > now || (only && p.truck !== only)) continue;
      const t = p.truck;
      const from = this.candyPos(t, p.slot, p.piece);
      // Each candy leaves its own pocket, not the centre of a vanished carton.
      // ⚠ Ra khoi mieng khay DUNG BANG toc do bang chuyen, khong cham hon. 6.5 cu roi de vat ly
      // tu tang toc len 16.7 truoc khi dam vao mang: toan bo cu giat nam o day.
      const sp = SPEED;
      // ⚠ CHANG DUONG, khong phai mot huong. Vali phai di DUNG cai cau ma bo ve dang ve: tu o
      // cua no ra mieng ben (t.x,t.y), roi doc cau sang dau ray (t.px,t.py). Truoc day no chi
      // di theo huong than xe (t.mx,t.my) roi be dan sang tiep tuyen ray - tren ray thang thi
      // hai duong trung nhau, nhung tren spline hinh so 8 (level 9) mieng ben lech toi 38.5 do
      // so voi huong cau, nen vali di mot duong con cau ve mot neo. Do duoc: lech toi 12-13 don
      // vi, va co vali khong bao gio nhap duoc ray vi huong di gan nhu song song voi ray.
      // ⚠ Moc mang theo MOT MAT PHANG (nx,ny), khong phai mot vong tron ban kinh nho. Ban dau
      // moc la diem va coi nhu toi noi khi vao trong ban kinh mot buoc di - vali chi can bi day
      // lech mot chut (va cham voi vali khac, hoac vong go chong lan cuoi moi buoc) la truot
      // qua ben canh, roi quay dau lai, roi lai truot qua: no luon vong quanh cai moc MAI MAI.
      // Do duoc tren level 1: vali co lap = 4.8 (da di gan het cau) ma van con nguyen moc, va
      // vi `landed` bi chan khi con moc nen no khong bao gio nhap ray - level 1 tu intake 98.6%
      // tut xuong 0%. Mat phang thi khong the truot qua: di qua roi la qua han.
      const wx0 = t.x - from.x, wy0 = t.y - from.y, wd = Math.hypot(wx0, wy0) || 1;
      // ⚠ Moc phai co HAN MUC QUANG DUONG, neu khong no ket vinh vien. Vong go chong lan day
      // vali dat sang ben; dat roi thi no cu nham nguoc ve mieng khay ma vat nhau voi bang
      // chuyen, khong bao gio qua duoc moc va cung khong bao gio nhap ray - do duoc tren
      // level 8: vali dung im |v|=9 suot 68 giay. Het han thi bo moc, va doan sau (bam huong
      // cau roi luon vao ray) luon co thanh phan cat vao nen chac chan nhap duoc.
      const way = [{ x: t.x, y: t.y, nx: t.mx, ny: t.my, budget: wd * 2 + 0.6 }];
      const wx = wx0, wy = wy0;
      this.cubes.push({
        x: from.x, y: from.y,
        vx: (wx / wd) * sp, vy: (wy / wd) * sp,
        rot: Math.atan2(wy, wx), vrot: 0,
        way,
        sz: 1, color: p.color, piece: p.piece, slot: p.slot, seg: undefined,
        // ⚠ Nho ben nao vua tuon hat nay ra, va tuon luc nao. absorb() dung hai truong
        // nay de mot ben khong hut lai chinh dong cat dang ra khoi mieng no.
        src: t, born: now,
      });
      // ⚠ Moc tinh tu hat CUOI CUNG tuon ra, khong phai tung hat: mot luot do keo dai
      // hon mot giay, nen neu tinh theo tuoi tung hat thi hat dau tien da het han trong
      // khi ben van dang tuon hat cuoi ngay tai mieng - va no hut lai luon.
      t.pourUntil = now + POUR_GUARD;
      this.pending.splice(i, 1);
      i--;
    }
  }

  step(dt, now) {
    this.now = now;
    for (const t of this.trucks) {
      // Cosmetic packing milestones: one large conveyor piece becomes eight small
      // candies in the 4x4x4 carton. They do not participate in game accounting.
      t.miniPops = (t.miniPops || []).filter((p) => now - p.at < 700);
      for (const p of t.confetti) {
        p.life += dt; p.vy += 9 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      }
      t.confetti = t.confetti.filter((p) => p.life < 1.3);
    }
    // A reserved box becomes visible only after ALL its flights land. The eighth
    // reservation can arrive first; it must not materialize the other three candies.
    const landedFlights = this.flying.filter((f) => now - f.at >= f.ms);
    for (const f of landedFlights)
      (f.truck.miniPops || (f.truck.miniPops = [])).push({ slot: f.slot, piece: f.piece, at: now });
    this.flying = this.flying.filter((f) => {
      if (now - f.at < f.ms) return true;
      return false;
    });
    for (const t of this.trucks)
      for (let slot = 0; slot < t.blocks.length; slot++)
        if (t.blocks[slot].flying) {
          const moving = this.flying.some((f) => f.truck === t && f.slot === slot);
          t.blocks[slot].flying = moving;
          // Cosmetic milestone consumed by the renderer. It is written only after
          // the eighth candy really lands, never when its destination is reserved.
          if (!moving) t.blocks[slot].packedAt = now;
        }
    // peak theo tung khung hinh chu khong chi ngay luc cham: o dem con leo len trong luc
    // hang dang chay tren ray. ⚠ Khong con phan xu thua o day - xem canTap().
    if (this.state === "play") this.peak = Math.max(this.peak, this.counter());
    if (this.state !== "play") return;

    this.releaseDue(now);

    // ⚠ Do QUANG DUONG hat da di tren ray, khong do khoang cach toi mieng va cung khong
    // do bang dong ho. Khoang cach hut lai: hat vua tuon ra da nam ngoai ban kinh hut roi
    // nen dau `src` bi xoa ngay, chan duoc gi dau. Dong ho hut lai: luc ray tac, cat nam
    // li o mieng hang giay, hen gio nao roi cung het han trong khi dong cat van y nguyen.
    // Quang duong thi khong noi doi: chua di du xa thi van la cat cua ben do.
    const h = dt / SUBSTEPS;
    for (const c of this.cubes) { c._x = c.x; c._y = c.y; }
    for (let k = 0; k < SUBSTEPS; k++) this.physics(h);
    // Mat vali luon nhin ve phia dang di - MOI vali, ca dang ra khay lan dang chay tren ray,
    // va deu qua cung mot cai kep toc do quay.
    //
    // ⚠ Hai bay o day, ca hai deu da dinh:
    //  - Bam THANG van toc: trong dam dong van toc giat lung tung, do duoc co cu doi huong 161
    //    do trong MOT khung o toc do 1.4 dv/giay. Nen bo qua khi gan dung yen, va kep toc do.
    //  - De vali da nhap ray giu nguyen goc luc sinh: mot vali vao ray o canh tren se quay mat
    //    ve huong do suot ca vong, toi canh duoi thi no di lui.
    const TURN = 6.5 * dt;                       // radian moi giay, du de om het goc ray
    for (const c of this.cubes) {
      if (Math.hypot(c.vx, c.vy) < 3) continue;  // gan dung yen thi huong khong con y nghia
      let d = Math.atan2(c.vy, c.vx) - c.rot;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      c.rot += Math.max(-TURN, Math.min(TURN, d));
    }
    const FREE_RUN = this.len * 0.34;   // hon mot phan ba vong ray
    // ⚠ MOT bo dem quang duong cho ca hai viec, khong phai hai. `c.lap` dem tu luc mieng
    // hang roi mieng ben: duoi FREE_RUN thi no van la hang cua ben do (chan tu nuot), va
    // qua `this.len` thi no da di tron MOT VONG ray. Cai vong do la thuoc do duy nhat noi
    // duoc "hang nay da chao het moi ben roi ma khong ai nhan" - the RAY TAC doi dung no.
    for (const c of this.cubes) {
      c.lap = (c.lap || 0) + Math.hypot(c.x - c._x, c.y - c._y);
      if (c.src && c.lap > FREE_RUN) c.src = null;
    }
    this.absorb(now);
    // Khay day thi giao hang - nhung chi tinh khi vali cuoi DA VAO DEN O. Mot ben con cu bay
    // nao huong ve no thi coi nhu chua xong. deliver() tra false khi chua du bo, nen goi moi
    // khung khong ton gi va khong lam gi thua.
    for (const t of this.trucks)
      if (!t.gone && t.blocks.length && !this.flying.some((f) => f.truck === t)) this.deliver(t);

    // Ben rong van song (van nhan hang), nen dieu kien thang la: khong con gi tren
    // ray, va moi ben hoac da giao xong hoac dang rong.
    if (!this.cubes.length && !this.pending.length && !this.flying.length &&
        this.trucks.every((t) => t.gone || (!t.blocks.length && !t.fill)))
      this.state = "win";
    // ⚠ Hoi SAU cau thang, va chi sau no: mot ban co vua don xong cung khong cham duoc
    // vali nao va khong con hang cho ben nao nhan - dung y het mot ban co chet.
    else if (this.isStuck()) this.state = "lose";
  }

  // ⚠ Ben vua do hang thi dong cat con nam ngay o mieng no. Khong chan thi no hut lai
  // ngay lap tuc - do duoc: level 1 tu 1 lan cham nhay len 8 lan cham, 8 lan tu nuot.
  // Chan bang THOI GIAN va NGUON GOC, khong bang mau: cat cua chinh ben do, tuon ra
  // chua duoc POUR_GUARD, thi ben do khong hut. Mot vong ray mat hon 2 giay nen cat di
  // het mot vong quay lai van vao binh thuong - dung luat "ben rong nhan moi mau".
  absorb(now) {
    // ⚠ Bo vung hut ra bang BAN KINH r*2.6: hat chay SPEED 19 nen chi nam trong tam
    // voi vai phan tram giay, va truoc day chi mot hat moi ben moi khung hinh duoc hut
    // (break), cong them chan nhip EAT_MS 30ms chi cho ~33 hat/giay - phan lon hat luot
    // qua mieng roi troi tiep. Nay hat nao trong vung va duoc nhan thi vao ngay.
    // ⚠ Vung hut phai PHU HET LONG RAY, khong duoc chi tinh theo co keo. Truoc day R = r*2.6,
    // dung khi mot mieng hang to gan bang long ray. Tu khi mot hop la 8 vien nho (r = 0.23) thi
    // R con 0.59, trong khi long ray van rong nhu cu va keo nho chay 4 hang song song, trai ra
    // toi +-0.69 khoi tim ray - vien nao chay mep ngoai la di ngang khay dang can ma khong bao
    // gio vao. Do duoc: intake gan 0% tren 7/10 level (hang tram luot bo lo), va bot thua
    // 180/180 van tren 20 level dau. Phu ca long ray thi 10/10, bot thang 100%.
    // Van nho hon R cu cua mieng hang to (1.90), nen khong voi sang doan ray ben canh.
    const R = Math.max(this.r * 2.6, CHANNEL + this.r), R2 = R * R;
    for (const t of this.trucks) {
      if (t.gone) continue;   // ben da giao xong thi khong con nhan (accepts cung chan)
      if (now < (t.pourUntil || 0)) continue;   // dang tuon hang ra - chua hut lai
      // ⚠ Cau dang co hang DI RA thi khong nhan hang DI VAO. Hai chieu dung chung mot cay cau
      // (xem flyPos), nen bo cai chan nay thi mot vali bay len trong luc mot vali dang di
      // xuong, va hai cai di xuyen qua nhau ngay giua cau. `pourUntil` khong du: no la dong
      // ho 900ms, con vali cuoi cua mot luot do bon o thi roi mieng o giay thu 0.74 va con
      // phai di het chieu dai cau nua. Dieu kien dung la CAU CON BAN HAY KHONG.
      if (this.cubes.some((c) => c.src === t && !c.landed)) continue;
      // ⚠ Duyet nguoc + KHONG break: splice khong bo sot hat phia sau, va mot ben phai
      // hut HET moi hat du dieu kien dang nam trong vung trong CUNG mot khung hinh.
      // accepts() da tu chan khi ben day (blocks >= cap) hoac gone, nen vong lap an toan.
      for (let i = this.cubes.length - 1; i >= 0; i--) {
        const c = this.cubes[i];
        if (c.src === t) continue;          // cat cua chinh ben nay, chua roi mieng
        if (!this.accepts(t, c.color)) continue;
        if (!this.canStart(t, c.color)) continue;   // mau nay dang co hop do o khay khac
        const dx = c.x - t.px, dy = c.y - t.py;
        if (dx * dx + dy * dy > R2) continue;
        this.cubes.splice(i, 1);
        if (!t.fill) { t.claim = c.color; t.lastDump = null; }
        this.history = this.history.filter((h) => h.color !== c.color);
        const slot = t.blocks.length, piece = t.fill;
        const to = this.candyPos(t, slot, piece);
        // Chang duong vao: diem tren ray -> dau cau -> mieng ben -> o dich. Dung nguoc lai
        // chang duong luc vali di ra, nen hai chieu trung khop nhau va trung voi cai cau ve.
        // ⚠ KHONG them doan dan nhap theo huong vali dang chay. Da thu va no lam TE HON: vung
        // hut rong 1.59 don vi nen vali thuong bi hut khi DA DI QUA dau cau, keo dai them theo
        // huong cu la day no di xa hon nua roi phai quay dau - do duoc p99 tu 29 len 43 do.
        const path = [{ x: c.x, y: c.y }];
        if (Math.hypot(t.px - t.x, t.py - t.y) > 0.4) path.push({ x: t.px, y: t.py });
        path.push({ x: t.x, y: t.y }, { x: to.x, y: to.y });
        // Bo cac moc trung nhau: doan dai 0 khong them gi ma lam roi phep chia do dai cung.
        for (let k = path.length - 1; k > 0; k--)
          if (Math.hypot(path[k].x - path[k - 1].x, path[k].y - path[k - 1].y) < 1e-3) path.splice(k, 1);
        const smooth = chaikin(path, 2);
        let plen = 0;
        for (let k = 0; k < smooth.length - 1; k++)
          plen += Math.hypot(smooth[k + 1].x - smooth[k].x, smooth[k + 1].y - smooth[k].y);
        // ⚠ Ghim TOC DO chu khong ghim thoi gian - xem chu thich o FLY_SPEED. Va s dat sao cho
        // van toc luc roi ray dung bang bang chuyen, xem flyEase().
        const ms = Math.max(FLY_MIN, Math.min(FLY_MAX, (plen / FLY_SPEED) * 1000));
        const s = Math.max(0, Math.min(3, (SPEED * ms) / 1000 / (plen || 1)));
        // Logic reserves the slot immediately, but the artwork has not arrived there yet.
        // Give clusters a short cadence into the carton. A queued flight remains drawn at
        // its belt position until `flightAt`, so the candy never blinks out while waiting.
        const flightAt = Math.max(now, t.nextFlyAt || 0);
        t.nextFlyAt = flightAt + 10;   // 64 vien: 10ms moi vien, ca hop ~0.65s
        t.arriveAt = Math.max(t.arriveAt || 0, flightAt + ms);
        t.ate = t.arriveAt;
        const cuBay = {
          at: flightAt, ms, s, truck: t, slot, piece, color: c.color, rot: c.rot, rot1: Math.atan2(t.my, t.mx), sz: c.sz,
          path: smooth, plen,
          fx: c.x, fy: c.y, tx: to.x, ty: to.y,
        };
        this.flying.push(cuBay);
        t.fill++;
        if (t.fill >= this.perBlock) {
          t.fill = 0;
          // Reserve the full box now for accepts/capacity. Its paper packing may
          // appear only after all eight candies land; until then render the arrived
          // pockets individually, subtracting this slot's active flights.
          const khoi = { color: t.claim, hidden: false, key: null, seen: true, flying: true };
          t.blocks.push(khoi);
          for (const f of this.flying)
            if (f.truck === t && f.slot === slot) f.block = khoi;
          t.claim = null;
          // ⚠ KHONG goi deliver() o day. Day la luc vali vua bi NHAT KHOI RAY, no con bay them
          // toi 650ms nua moi vao den o. Goi ngay thi khay dong nap va giao hang trong khi vali
          // cuoi van dang lo lung giua khong trung - chu du an bao dung y: "logic full khay dang
          // duoc ghi nhan som qua, som hon ca khi vali cuoi chua vao vi tri".
          // Phep kiem chuyen sang step(), va chi chay khi khong con cu bay nao ve ben nay.
        }
      }
    }
  }

  // Du DELIVER khoi cung mau thi chuyen hang do duoc giao. Voi cap = 4 (mac dinh) day
  // dung bang luat cu "day va thuan mot mau"; chi khi booster Extra Slot noi them o thi
  // moi co phan du o lai trong ben.
  deliver(t) {
    if (t.gone || this.packing(t) || t.blocks.some((b) => b.flying)) return false;
    const cnt = {};
    for (const b of t.blocks) cnt[b.color] = (cnt[b.color] || 0) + 1;
    let X = null;
    for (const k in cnt) if (cnt[k] >= DELIVER) X = k;
    if (!X) return false;
    this.delivered[X] = (this.delivered[X] || 0) + DELIVER * this.perBlock;
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
  // ⚠ Mot dinh nghia cho "co hoan tac duoc khong". Nut booster phai mo san khi khong hoan
  // tac duoc (luat 3.5: dung de bam roi bao loi), va neu no chep lai dieu kien nay thanh
  // ban thu hai thi hai ban se troi khoi nhau - nut sang trong khi engine tu choi.
  canUndo() {
    const last = this.history[this.history.length - 1];
    if (!last) return null;
    if (last.truck.gone || this.packing(last.truck)) return null;
    const have = this.cubes.filter((c) => c.color === last.color).length +
                 this.pending.filter((p) => p.color === last.color).length;
    if (have < last.n * this.perBlock) return null;
    if (last.truck.blocks.length + last.n > last.truck.cap) return null;
    return last;
  }

  undo() {
    const last = this.canUndo();
    if (!last) return false;
    const need = last.n * this.perBlock;
    let k = need;
    this.pending = this.pending.filter((p) => {
      if (p.pour !== last.pour) return true;
      k--;
      return false;
    });
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
    const box = last.box || { color: last.color, hidden: false, key: null, seen: true };
    last.truck.blocks.splice(Math.min(last.slot ?? last.truck.blocks.length,
      last.truck.blocks.length), 0, box);
    last.truck.lastDump = null;
    this.reveal(last.truck);
    this.history.pop();
    this.state = "play";
    return true;
  }

  // "Tap the truck to shuffle" - dao thu tu hang trong mot ben.
  shuffle(t) {
    if (t.gone || t.blocks.length < 2 || this.packing(t)) return false;
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
    // Them mot cho tren ray go duoc ban co chet khi no lam it nhat mot vali cham duoc tro
    // lai; hoi lai bang chinh isStuck() chu khong so sanh o dem voi suc chua nua.
    if (this.state === "lose") { this.state = "play"; if (this.isStuck()) this.state = "lose"; }
    return true;
  }

  // "Extra Slot" / "Add extra slot" - noi them mot o hang cho MOT ben.
  // ⚠ Day la suy dien: du lieu chi cho ten va mot dong mo ta, clip khong co canh dung
  // booster nao. Ben dai them mot o, con dieu kien giao hang van la DELIVER khoi cung mau.
  addBaySlot(t) {
    if (t.gone || this.packing(t) || this.pending.some((p) => p.truck === t)) return false;
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
    for (const t of this.trucks) if (t.fill) cnt[t.claim] = (cnt[t.claim] || 0) + t.fill;
    for (const f of this.flying) if (f.block) cnt[f.color] = (cnt[f.color] || 0) + 1;
    let X = null, best = -1;
    for (const k in cnt) if (cnt[k] > best) { best = cnt[k]; X = k; }
    if (!X) return null;
    let removed = this.cubes.filter((c) => c.color === X).length +
                  this.pending.filter((p) => p.color === X).length;
    this.cubes = this.cubes.filter((c) => c.color !== X);
    this.pending = this.pending.filter((p) => p.color !== X);
    // Flights belong to reserved blocks/fill already: never count them a second time.
    this.flying = this.flying.filter((f) => f.color !== X);
    for (const t of this.trucks) {
      removed += t.blocks.filter((b) => b.color === X).length * this.perBlock;
      t.blocks = t.blocks.filter((b) => b.color !== X);
      if (t.claim === X) { removed += t.fill; t.claim = null; t.fill = 0; }
      if (t.lastDump === X) t.lastDump = null;
      // Removing lower boxes shifts surviving pockets. Continue each surviving flight
      // from its current visible position to the new pocket, without ghosts or jumps.
      for (const f of this.flying.filter((f) => f.truck === t)) {
        const slot = f.block ? t.blocks.indexOf(f.block) : t.blocks.length;
        if (slot === f.slot) continue;
        const from = flyPos(f, Math.max(0, Math.min(1, (this.now - f.at) / f.ms)));
        const to = this.candyPos(t, slot, f.piece);
        f.slot = slot;
        f.path = [{ x: from.x, y: from.y }, to];
        f.plen = Math.hypot(to.x - from.x, to.y - from.y);
        f.fx = from.x; f.fy = from.y; f.tx = to.x; f.ty = to.y; f.rot = from.rot;
        f.at = this.now;
        f.ms = Math.max(FLY_MIN, Math.min(FLY_MAX, f.plen / FLY_SPEED * 1000));
        f.s = Math.min(3, SPEED * f.ms / 1000 / (f.plen || 1));
      }
      t.arriveAt = Math.max(this.now, ...this.flying.filter((f) => f.truck === t).map((f) => f.at + f.ms));
      t.ate = t.arriveAt;
      this.reveal(t);
    }
    this.revived[X] = (this.revived[X] || 0) + removed;
    this.history = [];
    this.state = "play";
    return X;
  }

  hitTest(wx, wy) {
    for (const t of this.trucks) {
      if (t.gone) continue;
      const dx = wx - t.x, dy = wy - t.y;
      const along = -(dx * t.mx + dy * t.my); // doc than ben, tinh tu mieng
      const across = dx * -t.my + dy * t.mx;
      if (along >= -0.6 && along <= t.cap * this.slotLen + 0.6 && Math.abs(across) <= this.truckW / 2 + 0.4)
        return t;
    }
    return null;
  }
}

// ------------------------------------------------------------------ ve

let cv = null, ctx = null;
let game = null, view = null;
let EAGER = true;
// Chieu cao THAT (px CSS) cua hai dai HUD bang DOM - app.js do bang offsetHeight roi bao
// sang. ⚠ Truoc day day la mot co bool va layout() doan 9.2%/8.8% chieu cao canvas: dung
// o may nay, sai o may co safe-area (tai tho), va sai them lan nua moi lan doi kich thuoc
// nut. Ban co khong duoc phep chay xuong duoi gam hai dai do.
let HEAD = 0, FOOT = 0;

export function initCanvas(el) { cv = el; ctx = el.getContext("2d"); }
export function setGame(g) { game = g; layout(); }
export function getGame() { return game; }
export function setEager(v) { EAGER = v; }
export function setChrome(headCss, footCss) { HEAD = headCss || 0; FOOT = footCss || 0; layout(); }
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
  // O dem cube ve trong canvas (drawHud), ngay duoi dai DOM, nen chieu cao cua no cung
  // phai tru vao cho ban co.
  const bar = Math.round(HEAD * dpr);
  const gauge = HEAD ? Math.round(Math.min(cv.width * 0.082, cv.height * 0.046)) : 0;
  const head = bar + Math.round(gauge * 1.35);
  // ⚠ Phai chua cho CA hang booster duoi, khong chi dai HUD tren. Truoc day khung ghim
  // 480px nen ban co luon bi be RONG chan lai va khong bao gio voi toi hang nut; tu khi
  // khung noi rong theo vh thi chieu CAO moi la cai chan, va thieu `foot` la ban co
  // chay thang xuong duoi gam cac nut.
  const foot = Math.round(FOOT * dpr);
  const sc = Math.min(cv.width / (b.x1 - b.x0),
                      (cv.height - head - foot) / (b.y1 - b.y0));
  view = {
    sc, head, bar, gauge,
    ox: (cv.width - (b.x1 - b.x0) * sc) / 2 - b.x0 * sc,
    oy: head + (cv.height - head - foot - (b.y1 - b.y0) * sc) / 2 - b.y0 * sc,
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

// Ty le chieu cao cac vung cua khoi, doi tuoc mot cot pixel tren anh game goc:
// mat tren phang den 80%, lip sang den 91%, phan con lai 9% la mep toi mong.
const FACE_H = 0.80;
const LIP_H = 0.91;

// Hinh chu nhat bo tron HAI GOC TREN, hai goc duoi vuong. Dung cho mat tren: mat phai
// phang, va cho giap voi thanh khoi phai la mot duong thang de con doc ra BUOC GIA TRI.
function topRoundRect(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h)));
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

// Cong thuc khoi dung CHUNG cho cube tren ray lan khoi hang trong o - hai thu nam canh
// nhau tren man hinh nen phai doc ra cung mot chat lieu.
// Cong so sau day la DO DAC tu anh chup game goc: doc mot cot pixel xuyen doc qua khoi,
// tren ba khoi khac mau (xanh la, hai khoi xanh duong o hai xe khac nhau), ca ba ra cung
// mot so do. Khoi xanh duong cao 24px: 20px mat phang 54,146,233 gan nhu khong doi mot
// don vi, 3px lip sang 54,146,233 -> 79,172,239, roi 2px mep toi 21,49,88 -> 29,0,25.
// Khoi xanh la cao 28px: 22px phang 68,255,32 (kenh luc ghim dung 255 suot), 3px sang len
// 92,255,56 -> 105,255,72, roi mep toi. Day la so do, khong phai so uoc chung.
// ⚠ KHONG CO thanh khoi toi: ban goc khong he co dai toi 22% duoi chan nhu spec cu - phan
// toi cua ca khoi chi la mot MEP mong 9% sat day, con 11% ngay tren no la LIP SANG. Dai
// toi duoi chan van lam moi khoi mang mot cai bong do va ca man hinh trong "nang ne".
// ⚠ Lip o DAY KHOI SANG LEN chu khong toi di: do duoc 54,146,233 -> 79,172,239, tuc keo
// ve trang khoang 11%. Do la anh doi tu san hoc hat len - cung ly le voi cac hoc lom
// da co trong file.
// ⚠ Mat tren to PHANG bang dung `col`: mau bao hoa nguyen ven, khong shade, khong
// gradient, khong vet loe trang - kenh luc do duoc ghim 255 suot ca 22px. Vet loe la
// phan pha dau them vao nen bo di.
// ⚠ Khong ve hinh thang cho mat tren: cac o xep theo buoc co dinh, hinh thang lam hai goc
// tren ho ra mot cai nem trong nhu loi ve.
// ⚠ Chuyen tiep giua ba vung la CANH THANG: ban goc doi mau trong vong ~1px. Khong lam
// mo, khong gradient bac cau.
function drawBlock3D(x, y, w, h, r, col, lw) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  const fh = h * FACE_H;
  const lh = h * LIP_H;
  // nen la mep toi mong: phan toi duy nhat cua khoi, chi 9% sat day
  roundRect(x, y, w, h, r);
  ctx.fillStyle = shade(col, -0.55);
  ctx.fill();
  // lip sang: dai mong ngay tren mep, cat theo net bo de khong tran ra ngoai goc
  ctx.save();
  roundRect(x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = shade(col, 0.12);
  ctx.fillRect(x, y + fh, w, lh - fh);
  ctx.restore();
  // mat tren: mau nguyen ven, hai goc tren bo tron, day thang de giap lip la mot buoc gia tri
  topRoundRect(x, y, w, fh, r);
  ctx.fillStyle = col;
  ctx.fill();
  // vien ngoai mong: co vien thi thanh khoi doc ra mot CANH, khong co thi la KHOI LUONG
  roundRect(x, y, w, h, r);
  ctx.strokeStyle = "rgba(12,8,28,.55)";
  ctx.lineWidth = lw;
  ctx.stroke();
}

// Cube: mat tren sang, canh duoi toi - de doc ra mot khoi dac chu khong phai o mau.
// Xoay tu do, vi trong ban goc chung la manh vun khong deu.
function drawCube(wx, wy, color, rot, sz) {
  const S = view.sc;
  const d = game.r * 2 * sz * S;
  ctx.save();
  ctx.translate(SX(wx), SY(wy));
  ctx.rotate(rot);
  drawCandy(0, 0, d, color);
  ctx.restore();
}

function drawCandy(x, y, d, color) {
  drawBlock3D(x - d / 2, y - d / 2, d, d, d * 0.34, color, Math.max(0.6, d * 0.04));
  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.beginPath(); ctx.ellipse(x - d * .16, y - d * .2, d * .17, d * .07, -.5, 0, Math.PI * 2); ctx.fill();
}

function ringPath() {
  const ring = game.ring;
  ctx.beginPath();
  ctx.moveTo(SX(ring[0].x), SY(ring[0].y));
  for (let i = 1; i < ring.length; i++) ctx.lineTo(SX(ring[i].x), SY(ring[i].y));
  if (game.closed) ctx.closePath();
}

function strokeRing(w, style) {
  // style la mot chuoi mau, hoac {top, mid, bot} de tao gradient DOC: go noi sang o phia
  // tren va toi o phia duoi, nen no doc ra mot thanh ray NOI CAO chu khong phai mot net ve.
  if (typeof style === "string") {
    ctx.strokeStyle = style;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, cv.height);
    g.addColorStop(0, style.top);
    g.addColorStop(0.5, style.mid);
    g.addColorStop(1, style.bot);
    ctx.strokeStyle = g;
  }
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
  // go noi: bong do -> vien sang -> than go -> mat go sang hon -> mep ranh -> long ranh.
  // ⚠ Vien ngoai va than go dung GRADIENT doc, khong to mot mau phang: go NOI phai sang o
  // phia tren, toi o phia duoi, neu khong no chi la mot net ve dan tren nen.
  ctx.save();
  ctx.translate(0, 0.22 * view.sc);
  strokeRing(W + 0.5, "rgba(9,5,26,.42)");
  ctx.restore();
  strokeRing(W + 0.18, { top: UI.rimEdge, mid: shade(UI.rim, 0.1), bot: "#372c68" });
  strokeRing(W, { top: UI.rimLit, mid: UI.rim, bot: shade(UI.rim, -0.45) });
  strokeRing(W - 0.5, { top: "rgba(220,212,246,.9)", mid: "rgba(150,132,204,.25)",
                        bot: "rgba(20,12,42,.4)" });
  strokeRing(GW + 0.34, { top: UI.grooveEdge, mid: UI.groove, bot: "rgba(210,200,240,.28)" });
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
  // Queued pieces still exist in their original pockets until their pour begins.
  for (const p of game.pending) {
    const q = game.candyPos(p.truck, p.slot, p.piece);
    drawCube(q.x, q.y, PALETTE[p.color] || "#888", Math.atan2(p.truck.my, p.truck.mx), 1);
  }
  for (const c of game.cubes) drawCube(c.x, c.y, PALETTE[c.color] || "#888", c.rot, c.sz * 1.18);
  for (const f of game.flying) {
    const k = Math.min(1, (now - f.at) / f.ms), q = flyPos(f, k);
    const e = k * k * (3 - 2 * k);
    const boxed = Math.max(.5, Math.min(.8, game.slotLen * .20 / (game.r * 2)));
    drawCube(q.x, q.y, PALETTE[f.color] || "#888", q.rot,
      f.sz * (1.18 + (boxed - 1.18) * e));
  }
  for (const t of game.trucks) drawTrim(t, now);
  for (const t of game.trucks) drawBlocked(t);
  if (HEAD) drawHud();
}

// O dem cube tren ray - do lai khi sap tran, dung nhu ban goc (level 3 chuyen do o 6/8).
//
// ⚠ Chi con moi o dem o day; so level da chuyen han sang the level bang DOM tren dai HUD,
// vi nhan do kho (luat 2.8) va vung cham 44px (2.6) deu la viec cua DOM. Nhung o dem thi
// o lai canvas co chu dich: no la dong ho cua CHINH BAN CO - no doi mau theo ray, phong
// to nho theo ban co, va o giua ngay duoi dai HUD thay vi tranh cho voi bon vat the tren
// do (2.1: toi da 4). Dat no vao dai HUD la vat the thu nam, va o 360px thi khong con cho.
// ⚠ Vali khong cham duoc phai NHIN RA la khong cham duoc, khong de nguoi choi cham roi
// moi bao (luat 3.5). Ve thanh mot ham rieng, sau drawBay/drawTrim, chu khong nhuom mau
// ben trong drawBay: phan ve than xe dang duoc mot phien khac sua, va mot lop phu chong
// len tren la thu de go ra nhat neu sau nay muon doi cach the hien.
function drawBlocked(t) {
  if (game.state !== "play") return;
  if (t.gone || !t.blocks.length || t.drain >= 0 || game.canTapAny(t)) return;
  const S = view.sc, w = TRUCK_W * S, bodyL = t.cap * SLOT_LEN;
  ctx.save();
  ctx.translate(SX(t.x), SY(t.y));
  ctx.rotate(Math.atan2(-t.my, -t.mx));
  roundRect(-0.35 * S, -w / 2, bodyL * S + 0.5 * S, w, 0.5 * S);
  ctx.fillStyle = "rgba(11,9,32,.5)";
  ctx.fill();
  ctx.restore();
}

function drawHud() {
  const hh = view.gauge, u = hh * 0.5;
  const cy = view.bar + hh * 0.68;
  // ⚠ (3.2) Hai muc do khac nhau thi phai nhin ra duoc: "sap day" (con 1-2 cho) khac han
  // "DAY" (khong cham duoc vali nao nua). Mot mau cho ca hai thi luc ban co khoa lai
  // nguoi choi khong co gi bao, va se ngoi cham vao vali mai.
  const full = game.counter() >= game.slotCount;
  const warn = full || game.counter() >= game.slotCount - 2;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "bold " + u * 1.12 + "px system-ui";

  const txt = game.counter() + "/" + game.slotCount;
  const cw = ctx.measureText(txt).width + u * 4.4;
  const cx = cv.width / 2;
  roundRect(cx - cw / 2, cy - hh / 2, cw, hh, hh / 2);
  ctx.fillStyle = full ? "rgba(176,20,62,.97)"
                : warn ? "rgba(150,84,20,.95)" : "rgba(46,36,96,.92)";
  ctx.fill();
  ctx.strokeStyle = full ? "#ff7ba3" : warn ? "#ff9d3c" : "#6e5db4";
  ctx.lineWidth = Math.max(1, u * 0.16);
  ctx.stroke();
  ctx.fillStyle = full ? "#ffd6e2" : warn ? "#ffe2c2" : "#e9e4ff";
  ctx.fillText(txt, cx + u * 0.7, cy);
  // bieu tuong cube
  ctx.save();
  ctx.translate(cx - cw / 2 + u * 1.45, cy);
  ctx.rotate(0.18);
  ctx.fillStyle = full ? "#ffb8cc" : warn ? "#ffcf9a" : "#c9c0f0";
  roundRect(-u * 0.6, -u * 0.6, u * 1.2, u * 1.2, u * 0.28);
  ctx.fill();
  ctx.restore();
}

function drawBay(t, now) {
  const S = view.sc * game.fit;
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

  // than xe: mep tren sang hon than, mep duoi toi han lai, nen doc ra mot khoi co be day
  const grd = ctx.createLinearGradient(0, -w / 2, 0, w / 2);
  grd.addColorStop(0, done ? shade(UI.bayDone, 0.16) : shade(UI.bay, 0.16));
  grd.addColorStop(1, done ? shade(UI.bayDoneDark, -0.24) : shade(UI.bayDark, -0.24));
  roundRect(-0.35 * S, -w / 2, bodyL * S + 0.5 * S, w, 0.5 * S);
  ctx.fillStyle = grd;
  ctx.fill();
  // vien ngoai mong, dam: thieu no thi than xe doc ra mot mieng giay
  ctx.strokeStyle = done ? "rgba(10,6,26,.5)" : "rgba(14,8,34,.5)";
  ctx.lineWidth = Math.max(1, 0.1 * S);
  ctx.stroke();
  // vet loe mong sat mep tren - noi ro thanh xe la mot go noi cao
  ctx.save();
  ctx.beginPath();
  ctx.rect(-0.35 * S, -w / 2, bodyL * S + 0.5 * S, w * 0.32);
  ctx.clip();
  const liftG = ctx.createLinearGradient(0, -w / 2, 0, -w / 2 + w * 0.32);
  liftG.addColorStop(0, "rgba(255,255,255,.18)");
  liftG.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = liftG;
  ctx.fillRect(-0.35 * S, -w / 2, bodyL * S + 0.5 * S, w * 0.32);
  ctx.restore();

  // o hang rong: hoc LOM xuong - toi o phia TREN (bong do vao trong hoc) va sang dan ve
  // phia DAY hoc (anh doi vao roi bat ra). Mot vet mau dam phang se doc ra cai dan.
  if (!done) {
    for (let i = 0; i < t.cap; i++) {
      const far = bodyL - (i + 1) * SLOT_LEN;
      const sx = far * S + 0.08 * S, sw = SLOT_LEN * S - 0.16 * S;
      const sy = -w / 2 + 0.16 * S, sh = w - 0.32 * S;
      const sg = ctx.createLinearGradient(0, sy, 0, sy + sh);
      sg.addColorStop(0, shade(UI.baySocket, -0.4));
      sg.addColorStop(1, shade(UI.baySocket, 0.12));
      roundRect(sx, sy, sw, sh, 0.26 * S);
      ctx.fillStyle = sg;
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
      // A sealed carton appears only when every reserved candy has landed.
      // Until then draw only arrived pockets, never a duplicate of an incoming flight.
      if (b.flying) {
        drawBlock3D(x, y0, len, h, 0.26 * S, "#fff3d6", Math.max(1, 0.1 * S));
        drawPockets(i, game.perBlock, col);
        continue;
      }
      // Full boxes are opaque colour-coded cartons. Their contents appear only after
      // opening or while a destination carton is being filled.
      const closedSide = Math.min(len, h);
      const closedY = y0 + (h - closedSide) / 2;
      drawBlock3D(x, closedY, closedSide, closedSide, 0.22 * S,
        show ? col : HIDDEN_FILL, Math.max(1, 0.1 * S));
      // khoi o mieng co vien dam - no la khoi se roi ra neu cham
      if (i === t.blocks.length - 1 && !t.gone) {
        ctx.strokeStyle = "rgba(10,6,26,.62)";
        ctx.lineWidth = Math.max(1, 0.12 * S);
        roundRect(x, closedY, closedSide, closedSide, 0.22 * S);
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

  function drawPockets(slot, count, col) {
    const cx = (bodyL - (slot + .5) * SLOT_LEN) * S;
    for (let piece = 0; piece < count; piece++) {
      if (game.flying.some((f) => f.truck === t && f.slot === slot && f.piece === piece)) continue;
      // Canvas +x points away from the belt, opposite candyPos's +u.
      const u = (piece % 4 - 1.5) * SLOT_LEN * .20 * S;
      const v = (Math.floor(piece / 4) - .5) * SLOT_LEN * .36 * S;
      drawCandy(cx - u, -v, SLOT_LEN * .20 * S, col);
    }
  }

  // fill is reservations, including incoming flights; the mask keeps only arrivals.
  if (t.fill && t.claim && t.blocks.length < t.cap && !t.gone) {
    drawPockets(t.blocks.length, t.fill, PALETTE[t.claim] || "#888");
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


// ⚠ CHANNEL/RIM di kem nhau: editor ve mat ray theo dung be rong engine dung de tinh
// `bounds`, nen ve ra bang chinh hai so nay chu khong uoc luong. Uoc luong thi hinh trong
// editor rong hep khac hinh trong game, va nguoi ve se can bang theo mot cai ray khong co that.
export {
  LEVELS, CARRIERS, SPLINES, AREAS, PALETTE, UI, CAP, DELIVER,
  CANDIES_PER_BOX, MINIS_PER_BELT_CANDY, MINI_CANDIES_PER_BOX, CHANNEL, RIM,
};
