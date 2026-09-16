// Ve ban co Loop Sort bang Three.js, goc nhin nghieng.
//
// Vi sao khong lam bang Canvas 2D nua: da do tren anh chup that cua ban goc. Ti le ban co
// level 3 cua ban goc la 1.152 (cao/rong), ban dung lai la 1.17 — gan nhu bang nhau, tuc
// ban co goc KHONG he bi nen doc. Nghia la cam giac "nghieng nghieng" cua no khong den tu
// mot phep chieu 2D nao ca, ma tu vat the co be day that duoi mot camera phoi canh. Moi
// cach to bong trong 2D deu se hut o dung cho do.
//
// File nay CHI VE. Khong doc, khong sua mot luat game nao — state lay tu getGame() cua
// loopsort.js va chi duoc doc.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
// ⚠ DELIVER duoc export tu loopsort.js, nen import thay vi chep lai: so khoi cung mau de mot
// chuyen hang duoc giao. Ban ve can no de bu lai khoi cuoi cua doan hang dang rut di.
import { DELIVER, flyPos, areaIndexOf, SCALE, WIDE } from "./loopsort.js";

// ⚠ Chep tu loopsort.js chu khong import: no khong export bang mau. Neu bang ben do doi
// thi phai doi ca o day.
const PALETTE = {
  R: "#ff263d", O: "#ff741f", Y: "#ffcf16", G: "#31df24", B: "#168fff",
  P: "#a72cff", PNK: "#ff3e9b", GR: "#b7d9f5", BR: "#b95725", LB: "#00d9ee",
  DG: "#00b982", BL: "#465bff", W: "#fff7df", LPNK: "#ff91c6", DPNK: "#e92878",
};
// ⚠ Do duoc va KHONG sua o day: mau nay so voi long khay la 1.02:1 (cung mot do sang, mat
// gan het khi ra nang). Mau hang hoa va mau khay do mot dot chinh mau khac lam chu; ai doi
// cho nay thi do lai ty so do truoc.
const HIDDEN_FILL = "#31538e";

// ⚠ Day la be rong CO SO. Be rong THAT cua tung level la TRUCK_W * game.fit - engine thu than
// xe lai o nhung ban dong xe (xem chu thich trong buildStatics). Moi cho ve than xe hay hang
// deu phai nhan them game.fit, neu khong thi o level dong, hinh ve se de len nhau trong khi
// engine da tinh la khong.
// ⚠ Chu thich cu o day ghi "phai khop hang so cung ten trong loopsort.js (2.6)" trong khi gia
// tri lai la 2.2 - hai ban sao da troi khoi nhau tu luc nao khong ai biet. Dung tin con so
// trong chu thich, doc gia tri.
// khong co cach nao rang buoc bang may — doi mot ben thi phai doi ben kia.
const TRUCK_W = 2.2;

// Cao do vali khi nam tren ray. Hang trong khay nam cao hon, o BODY_H - chenh lech giua hai
// so nay chinh la quang duong vali phai len khi no vao khay.
const RAIL_Y = 0.38;
const BODY_H = 0.6;    // cao than xe
const CARGO_H = 0.7;   // cao mieng hang
const BOARD_H = 0.5;   // day tam nen

// ⚠ RIPPLE_MS va DRAIN_MS chep tu loopsort.js; ATE_MS do tu cam giac ban goc. Ca ba la thoi
// luong hoat hinh chu khong phai luat game, va file nay khong duoc sua ben do.
const RIPPLE_MS = 360; // vong sang lan ra khi nguoi choi cham vao xe
const DRAIN_MS = 830;  // hang rut khoi xe khi giao xong
const ATE_MS = 180;    // cua so "nhun nhe" khi xe vua nuot duoc mot mieng hang
// Fallback for old/synthetic states without an exact visual-arrival timestamp.
const LID_DELAY_MS = 910;
const LID_CLOSE_MS = 520;
const LID_LIFT = 1.15;
const BRIDGE_RETRACT_MS = 310;
const LID_SETTLE_MS = ATE_MS + 80;
const lidStart = (t) => Number.isFinite(t.arriveAt)
  ? t.arriveAt + LID_SETTLE_MS
  : t.drain + LID_DELAY_MS;
const lidEnd = (t) => lidStart(t) + LID_CLOSE_MS;

const UI = {
  bg: 0x21194f,
  board: 0x28235f,
  rail: 0x7650d4,
  truck: 0x6e51af,
  truckGone: 0x3f3768,
};

const col = (c) => new THREE.Color(c);

export function mountThree(frameEl, getGameFn) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  // Resource tracking must exist before any texture loader starts: a warm browser cache can
  // invoke its callback during startup, before later declarations have initialized.
  const scrap = [];
  const keep = (o) => (scrap.push(o), o);
  // ---------------------------------------------------------------- khung ve
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  // ⚠ Chen lam con DAU TIEN, khong phai appendChild. #frame chua ca canvas 2D lan cac lop
  // HUD (.layer, .topright, .bottom); them vao cuoi thi canvas 3D nam tren cung va nuot
  // sach HUD — man hinh mat het nut, diem so va o dem.
  frameEl.insertBefore(canvas, frameEl.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  // ⚠ PCFSoftShadowMap da bi go khoi three 0.186 (no canh bao roi tu lui ve PCF). Goi
  // thang PCFShadowMap de khong co dong canh bao trong console moi lan chay.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  // A quiet confectionery worktop: warm paper, a soft mint pool of light and fine dots.
  const backdrop = document.createElement("canvas");
  backdrop.width = 512; backdrop.height = 1024;
  const paint = backdrop.getContext("2d");
  // ⚠ LUI VE MOC CU theo lenh chu du an ("de design lai nhu ban dau truoc, truoc khi build
  // bo level ay"). Code moi KHONG XOA, chi tat duong goi, de bat lai bang mot dong.
  // Nen goc: dai mau xanh nhat cheo, rac cham trang mo.
  const wash = paint.createLinearGradient(0,0,512,1024);
  wash.addColorStop(0,"#b9efff"); wash.addColorStop(0.5,"#ddf8ff"); wash.addColorStop(1,"#94d8f1");
  paint.fillStyle=wash; paint.fillRect(0,0,512,1024);
  paint.fillStyle="rgba(255,255,255,.18)";
  for(let y=12;y<1024;y+=34) for(let x=12;x<512;x+=34){paint.beginPath();paint.arc(x,y,1.2,0,Math.PI*2);paint.fill();}
  const backgroundTexture = new THREE.CanvasTexture(backdrop);
  backgroundTexture.colorSpace=THREE.SRGBColorSpace;
  scene.background = backgroundTexture;

  // ⚠ Ba anh nen that (san nha ga: ban ngay / am / dem), doi theo THANH PHO chu khong theo
  // so level: moc thanh pho da co san trong Areas.json va no la cai nguoi choi cam nhan duoc
  // la "sang khu moi". Doi theo mot con so tron nao do thi nen doi giua chung mot thanh pho.
  // ⚠ Nen ve tay o tren van giu lam BAN DU PHONG: anh la file tai ve, tai cham hoac tai hong
  // thi canh van co nen tu te chu khong ra mot mang den.
  const BG_FILES = ["day", "warm", "night"];
  const BG_WIDE_FILES = ["day-wide", null, null];
  const bgTextures = [];
  const bgWideTextures = [];
  // Chi background 1 co ban ngang da duyet. Background 2/3 van giu anh doc cua chung,
  // khong tu y phan chieu hay keo anh de lap hai canh desktop.
  const bgLoader = new THREE.TextureLoader();
  BG_FILES.forEach((name, i) => {
    // ⚠ Duong dan tinh theo TRANG, khong theo `import.meta.url`. Lúc dev thi module nam o
    // /tools/loopsort/three3d.js nen hai cach ra cung mot ket qua; sau khi build thi module
    // bi gop vao /assets/loopsort-xxx.js, va "./bg/..." theo module thanh /assets/bg/... -
    // 404, anh khong bao gio ve, canh lang le roi ve nen ve tay. Kieu hong chi lo ra tren
    // ban da build, va chi khi nhin ky.
    bgLoader.load("./bg/" + name + ".webp", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      bgTextures[i] = keep(tex);
      if (lastGame) applyBackdrop(lastGame);
    });
    if (BG_WIDE_FILES[i]) {
      bgLoader.load("./bg/" + BG_WIDE_FILES[i] + ".webp", (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        bgWideTextures[i] = keep(tex);
        if (lastGame) applyBackdrop(lastGame);
      });
    }
  });
  // ---------------------------------------------------------------- do trang tri
  // Cay canh, bien bao, xe day hanh ly... dat quanh mep ban co cho canh do trong.
  // ⚠ Chi nap anh cua nhung mon THAT SU dung o level nay (4-6 mon), khong nap ca 24: ca bo
  // la 900KB, ma mot luot choi chi nhin thay vai mon.
  // ⚠ Dat NGOAI khung bao cua ban co, va khong bao gio o giua: bo ve fit camera theo ban co
  // nen vung ngoai do la mep man hinh - dung cho cua do trang tri, va no khong the che mat
  // mot cai ben nao.
  // ⚠ MAT BAN CO MANG ANH SAN, chu khong phai `scene.background`. Do duoc tren level 6: tam
  // nen phang trai rong hon khung bao 4,5 don vi moi ben, ma camera cho ban co chiem tron man
  // hinh - nen tam do phu KIN khung va `scene.background` khong bao gio lo ra mot pixel nao.
  // Anh van tai ve du (do duoc 7 request, deco-22 nang 55KB), chi la khong co cho hien.
  const DECO_N = 24;
  const decoCache = new Map();
  const decoLoader = new THREE.TextureLoader();
  function decoMat(i) {
    if (!decoCache.has(i)) {
      const tex = decoLoader.load("./bg/deco-" + i + ".png", (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
      });
      decoCache.set(i, keep(new THREE.MeshBasicMaterial({ map: keep(tex), transparent: true, depthWrite: false })));
    }
    return decoCache.get(i);
  }
  function buildDeco(game) {
    const b = game.bounds;
    let s = (game.id * 2654435761) >>> 0 || 7;
    const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e6) / 1e6; };
    // ⚠ DAT BEN TRONG khung bao. Truoc day chung nam NGOAI khung bao 3,4-4,2 don vi, va do la
    // ly do khong ai nhin thay chung: camera cho ban co chiem tron man hinh, nen do duoc tren
    // level 6 mep trai ban co da o x=-38px va cho dat icon o x=-95px - ca sau cho deu ngoai
    // man hinh.
    // ⚠ VA KHONG PHAI BON GOC CO DINH. Bon goc chi cho toi da 4 mon, va o nhung level ray an
    // sat goc thi phep kiem loai het, ra mot ban co tron tron. Quet CA MAT BAN roi giu moi cho
    // trong la cach duy nhat chiu duoc moi hinh ray - moi level mot hinh, khong doan truoc duoc
    // cho nao con trong.
    const INSET = 2.2;   // lui vao khoi mep khung bao: mep do nam ngay ria man hinh
    // ⚠ KIEM TRUOC KHI DAT, khong dat roi mong. Mot icon de len ray hay len khay la mot vat
    // the nguoi choi tuong cham duoc. Thieu mot mon con hon mot mon nam tren ray.
    const clearOf = (x, y, r) => {
      for (const p of game.ring) if (Math.hypot(p.x - x, p.y - y) < r + 1.6) return false;
      for (const t of game.trucks) {
        for (let i = 0; i <= t.cap; i++) {
          const q = game.slotPos(t, i, 0.5);
          if (Math.hypot(q.x - x, q.y - y) < r + 1.3) return false;
        }
      }
      return true;
    };

    // ⚠ Quet hai vong: vong dau doi cho rong rai, vong sau chi chay KHI KHONG TIM DUOC GI va
    // chap nhan mon nho hon. Khong co vong hai thi nhung ban chat - level 1 chi co hai khay
    // trong mot vong ray gan kin - ra mot ban co tron tron khong mot mon nao, canh cac level
    // khac day do. Do duoc: level 1 dat 0 mon o vong dau.
    let R = 1.7, cand = [];
    for (const r of [1.7, 1.05]) {
      R = r; cand = [];
      for (let x = b.x0 + INSET; x <= b.x1 - INSET; x += 1.6)
        for (let y = b.y0 + INSET; y <= b.y1 - INSET; y += 1.6)
          if (clearOf(x, y, R)) cand.push([x, y]);
      if (cand.length) break;
    }
    // Xao tron theo hat cua level: cung mot level luon ra cung mot bo tri, nhung hai level
    // khac nhau thi khong lap lai.
    for (let i = cand.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [cand[i], cand[j]] = [cand[j], cand[i]];
    }
    // ⚠ Giu khoang cach GIUA CAC MON voi nhau, neu khong thi luoi quet se cho ra mot dam icon
    // chen chuc o cung mot vung trong rong nhat, con phan con lai cua ban co thi trong tron.
    const placed = [];
    const MAX = 10;
    for (const [x, y] of cand) {
      if (placed.length >= MAX) break;
      if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 4.2)) continue;
      placed.push([x, y]);
      const size = Math.min(R * 2, 2.4 + rnd() * 1.4);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), decoMat(Math.floor(rnd() * DECO_N)));
      m.position.set(x, size * 0.42, y);
      // Dung thang va quay mat ve camera - icon ve theo goc nhin 3/4 nen de nam bet xuong san
      // thi no bien dang.
      m.rotation.x = -0.62;
      statics.add(m);
    }
  }

  function applyBackdrop(game) {
  // ⚠ DA BAT LAI 2026-09-13. No tung bi tat khi lui ve moc cu ("de design lai nhu ban dau
  // truoc, truoc khi build bo level ay"); ly do do het hieu luc khi bo level ghep moi duoc
  // duyet, va chu du an hoi "phan background va cac item trang tri bi mat roi a".
  // ⚠ Ve tay `backgroundTexture` van la BAN DU PHONG that su, khong phai code chet: anh la
  // file tai ve, tai cham hoac 404 thi `bgTextures[i]` con trong va canh van co nen tu te.
    // ⚠ Anh nen doi theo KHU (Areas.json), khong theo so level - va Areas mo khu moi o level
    // 1, 51, 76, 131... nen CA 50 LEVEL DAU chi thay dung mot anh `day`. Da bi hoi dung cho
    // nay ("t thay co khac nhau dau nhi"), va cau tra loi la: ba anh khac nhau that (RGB trung
    // binh 174,196,228 / 226,199,157 / 176,157,228), chi la hai anh kia chua toi luot.
    // ⚠ `?bg=0|1|2` la cua DEV de xem tung anh tren bat ky level nao. No khong doi luat choi -
    // luat van la theo khu - nen dung no de KIEM, dung dua no vao quyet dinh thiet ke.
    const forced = typeof location !== "undefined"
      && new URLSearchParams(location.search).get("bg");
    // ⚠ MOT ANH CHO MOI LEVEL, va anh do la `night` - lenh chu du an 2026-09-13 sau khi xem ca
    // ba: "chon background 3 lam default di". Khong con xoay theo khu nua.
    // ⚠ Muon xoay lai theo khu (mo khu moi o level 1, 51, 76, 131...) thi doi DEFAULT_BG thanh
    // `areaIndexOf(game.id) % BG_FILES.length` - dung mot dong, va day la cho duy nhat quyet
    // dinh no. Nhung nho: Areas chi doi o level 51 tro len, nen 50 level dau van chi mot anh.
    const DEFAULT_BG = 0;   // 0 day · 1 warm · 2 night - chu du an chon anh 1 (day)
    const i = forced !== null && forced !== "" && !isNaN(+forced)
      ? ((+forced % BG_FILES.length) + BG_FILES.length) % BG_FILES.length
      : DEFAULT_BG;
    const desktop = frameEl.clientWidth / Math.max(1, frameEl.clientHeight) > 1.08;
    scene.background = desktop
      ? (bgWideTextures[i] || bgTextures[i] || backgroundTexture)
      : (bgTextures[i] || backgroundTexture);
    // Tren trang desktop, #frame van la khung doc. Dua tranh ngang ra body de phan canh
    // baggage claim that su hien o hai ben, con crop doc nguyen ban van nam trong game.
    const side = BG_WIDE_FILES[i];
    document.body.style.setProperty("--ls-side-image", side ? `url(./bg/${side}.webp)` : "none");
    document.body.classList.toggle("has-side-scene", !!side);
  }

  // fov hep (32) chu khong rong: fov rong lam hai dau ban co bi keo doang ra hai ben, doc
  // ra nhu ong kinh goc rong chu khong phai nhin nghieng.
  // ⚠ ONG KINH RAT HEP, GAN NHU TRUC GIAO - do tu anh chup BAN GOC (level 8, co khoi "?"):
  // xe tren cung va xe duoi cung RONG BANG NHAU. Ban goc khong dung phoi canh; chieu sau cua
  // no den tu canh vat va bong do tren tung khoi, khong den tu goc camera.
  // O fov 32 hai xe duoi to hon han hai xe tren - nhin ra ngay khi doi chieu hai anh.
  //
  // ⚠ NEAR = 10, KHONG PHAI 0.1, va day moi la cho de sai. Voi near 0.1 / far 4000 thi ti le
  // dai do sau la 40000:1; bo dem do sau don gan het do chinh xac vao khoang 0.1-1 don vi
  // truoc ong kinh, cho chang co gi ca. Ong kinh cang hep thi fitCamera cang phai lui camera
  // ra xa, vat the cang don ve cuoi dai do sau, va khong con du do chinh xac de tach mat bang
  // chuyen khoi vien ban - man hinh noi day rac lam tam (z-fighting).
  // ⚠ Ban dau minh ket luan nham la "fov cang hep cang vo" va da ghi the vao day. SAI. Do bang
  // anh: fov 7 + near 0.1 vo nat; fov 7 + near 10 SACH HOAN TOAN; fov 5 + near 10 cung sach.
  // Khong co gi trong canh nay o gan camera hon vai chuc don vi, nen near 0.1 la lang phi thuan
  // tuy. Muon hep hon nua thi cu ha fov, dung dong vao near.
  const camera = new THREE.PerspectiveCamera(7, 1, 10, 4000);

  // Nen la mau tim toi, nen anh moi truong phai manh: o 0.55 thi mat ban gan nhu den va
  // ca ban co doc ra nhu mot lo thung chu khong phai mot cai ban.
  scene.add(new THREE.AmbientLight(0xffffff, 0.68));
  scene.add(new THREE.HemisphereLight(0xd9d1ff, 0x30215f, 0.28));
  const sun = new THREE.DirectionalLight(0xffffff, 0.82);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias=-0.0003;
  sun.shadow.normalBias=0.035;
  sun.shadow.radius=3;
  scene.add(sun);

  // ---------------------------------------------------------------- nhom doi tuong
  // Tach lam ba nhom theo TAN SUAT DOI, de moi khung chi dung lai thu that su doi:
  //   statics — nen, ray, than xe: chi doi khi sang level khac
  //   cargo   — hang tren xe: doi khi mot khoi bi an hoac t.fill nhich
  //   cubes   — chay lien tuc, dung pool
  const statics = new THREE.Group();
  const cargo = new THREE.Group();
  const cubes = new THREE.Group();
  const tread = new THREE.Group();
  const fx = new THREE.Group();      // vong sang khi cham + confetti khi giao hang
  scene.add(statics, cargo, cubes, tread, fx);

  // ⚠ Hang cua moi xe o lan dung hinh truoc. Luc finish() chay thi t.blocks da rong roi, nen
  // muon ve duoc doan hang dang rut di thi phai giu lai hinh dang cua no tu truoc do.
  const lastCargo = new WeakMap();

  // ⚠ DA THU DAN ANH NEN LEN MAT BAN CO VA NO HONG - ghi lai de khong ai thu lai. Ba buc nen
  // la CA MOT KHUNG CANH (cua so, may bay, cay canh), khong phai mot mang san lap lai duoc:
  // dan len mat ban thi dai cua so hien ra LAN THU HAI ngay giua ban co, canh buc anh that o
  // xung quanh. Chu du an xem xong noi dung mot cau: "anh background xau tum lum".
  // Ban thu hai - to mat ban bang mau trung binh vung san cua anh (day #aec4e4 · warm #e2c79d ·
  // night #b09de4) - het loi lap nhung van la mot mang phang to che gan kin buc anh.
  // Cach dung la KHONG VE TAM NAO CA, xem `buildStatics`.
  const boxGeo = keep(new RoundedBoxGeometry(1, 1, 1, 5, 0.34));

  const matCache = new Map();
  // ⚠ HANG dung vat lieu co `emissive`, than xe va nen thi khong. Ly do do duoc: duoi anh sang
  // cua canh (ambient .68 + hemi .28 + sun .82) mau hang ra man hinh chi con **56-96%** do sang
  // goc - do tren anh that: xanh nhat 56%, cam 78%, vang 79%, hong 81%. Nguoi choi bao "khong
  // sang hon may", va do la ly do: lam toi cai khay khong lam SANG duoc mieng hang.
  // ⚠ `emissive` chu khong phai nang den len: nang den thi khay sang theo, va tuong phan vua
  // an duoc lai mat. Va cung khong phai MeshBasicMaterial: bo mat phang lì thi mieng hang thanh
  // mieng dan, mat het khoi.
  function mat(hex, glow) {
    const key = glow ? hex + "!" : hex;
    if (!matCache.has(key)) {
      const o = { color: col(hex), roughness: 0.42, metalness: 0 };
      if (glow) { o.emissive = col(hex); o.emissiveIntensity = 0.3; }
      matCache.set(key, keep(new THREE.MeshStandardMaterial(o)));
    }
    return matCache.get(key);
  }
  const flatMatCache = new Map();
  function flatMat(hex) {
    if (!flatMatCache.has(hex)) flatMatCache.set(hex, keep(new THREE.MeshBasicMaterial({ color: col(hex) })));
    return flatMatCache.get(hex);
  }
  const beltArrowMat=keep(new THREE.MeshBasicMaterial({
    color:0x9aabe0,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide
  }));
  const beltArrowShadowMat=keep(new THREE.MeshBasicMaterial({
    color:0x17183f,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide
  }));
  const beltArrowShape=new THREE.Shape();
  beltArrowShape.moveTo(-.31,-.095);
  beltArrowShape.quadraticCurveTo(-.35,-.095,-.35,-.055);
  beltArrowShape.lineTo(-.35,.055);
  beltArrowShape.quadraticCurveTo(-.35,.095,-.31,.095);
  beltArrowShape.lineTo(.045,.095);
  beltArrowShape.lineTo(.045,.19);
  beltArrowShape.quadraticCurveTo(.045,.235,.085,.21);
  beltArrowShape.lineTo(.355,.025);
  beltArrowShape.quadraticCurveTo(.39,0,.355,-.025);
  beltArrowShape.lineTo(.085,-.21);
  beltArrowShape.quadraticCurveTo(.045,-.235,.045,-.19);
  beltArrowShape.lineTo(.045,-.095);
  beltArrowShape.closePath();
  const beltArrowGeo=keep(new THREE.ShapeGeometry(beltArrowShape,8));

  // Mot hop dat theo toa do THE GIOI cua game: (x, y) -> (x, ?, y), truc Y la chieu cao.
  function box(group, wx, wy, len, wid, hei, yBase, hex, rotY, glow) {
    const m = new THREE.Mesh(boxGeo, mat(hex, glow));
    m.scale.set(len, hei, wid);
    m.position.set(wx, yBase + hei / 2, wy);
    if (rotY !== undefined) m.rotation.y = rotY;
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  function trayBox(group, wx, wy, len, wid, hei, yBase, hex, rotY, glow, corner=.14) {
    // Bake dimensions into the geometry so the corner radius stays circular. Scaling a
    // unit rounded box by a long length turns each end into an ellipse — the boat shape.
    const radius=Math.max(.015,Math.min(corner,len/2-.01,wid/2-.01,hei/2-.01));
    const m = new THREE.Mesh(new RoundedBoxGeometry(len,hei,wid,5,radius), mat(hex, glow));
    m.position.set(wx, yBase + hei / 2, wy);
    if (rotY !== undefined) m.rotation.y = rotY;
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  function clear(group) {
    for (const c of group.children)
      if (c.geometry && c.geometry !== boxGeo) c.geometry.dispose();
    group.clear();
  }

  // Continuous swept strip. Shared edges eliminate the old segmented, jagged corners.
  // Be ngang cua lop ray RONG NHAT. fitCamera doc chinh hang so nay de biet ray ve ra toi dau -
  // chep so sang do la tao ban thu hai, va hai ban se troi khoi nhau.
  // ⚠ Be rong ray GIU NGUYEN, khong nhan SCALE. SCALE chi ap cho xe va hang (yeu cau cua
  // chu du an: "kich thuoc duong ray thi giu nhu cu"). Hang to len tren mot cai ray khong doi
  // thi hang lap day long ray nhieu hon - do la y do, khong phai loi.
  const BELT_W = 2.82;

  // Sample one smooth render path and reuse its normals for every belt layer. Previously
  // each strip and rail independently offset the polygonal simulation points, so tight
  // bends produced pinched inside edges and the coloured layers stopped lining up.
  function beltFrame(game) {
    const controls = game.ring.map((p) => new THREE.Vector3(p.x, 0, p.y));
    const curve = new THREE.CatmullRomCurve3(controls, game.closed, "centripetal");
    const count = Math.max(384, controls.length * 2);
    const points = curve.getPoints(count);
    if (game.closed) points.pop(); // getPoints repeats the first point at the end on a loop
    const normals = points.map((p, i) => {
      const a = points[game.closed ? (i - 1 + points.length) % points.length : Math.max(0, i - 1)];
      const b = points[game.closed ? (i + 1) % points.length : Math.min(points.length - 1, i + 1)];
      const d = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      return { x: -(b.z - a.z) / d, z: (b.x - a.x) / d };
    });
    return { points, normals, closed: game.closed };
  }

  function beltStrip(path, width, height, color, lateral=0) {
    const { points, normals, closed } = path;
    const n = points.length, verts = [], indices = [];
    for (let i = 0; i < n; i++) {
      const p = points[i], normal = normals[i];
      for (const side of [-1, 1]) {
        const offset = lateral + width * side / 2;
        verts.push(p.x + normal.x * offset, height, p.z + normal.z * offset);
      }
    }
    for (let i = 0; i < n - (closed ? 0 : 1); i++) {
      const j = (i + 1) % n;
      indices.push(i * 2, j * 2, i * 2 + 1, j * 2, j * 2 + 1, i * 2 + 1);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();
    const material=mat(color); material.side=THREE.DoubleSide;
    const mesh=new THREE.Mesh(geo,material);mesh.receiveShadow=true;statics.add(mesh);
  }

  function beltSolid(path,width,yBase,height,color){
    const {points,normals,closed}=path;
    const n=points.length,verts=[],indices=[];
    for(let i=0;i<n;i++){
      const p=points[i],normal=normals[i],half=width/2;
      verts.push(
        p.x-normal.x*half,yBase+height,p.z-normal.z*half,
        p.x+normal.x*half,yBase+height,p.z+normal.z*half,
        p.x-normal.x*half,yBase,p.z-normal.z*half,
        p.x+normal.x*half,yBase,p.z+normal.z*half,
      );
    }
    for(let i=0;i<n-(closed?0:1);i++){
      const j=(i+1)%n,a=i*4,b=j*4;
      indices.push(a,b,a+1,b,b+1,a+1);                 // top
      indices.push(a+2,a+3,b+2,a+3,b+3,b+2);         // underside
      indices.push(a,a+2,b,a+2,b+2,b);               // left wall
      indices.push(a+1,b+1,a+3,a+3,b+1,b+3);         // right wall
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));
    geo.setIndex(indices);geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,mat(color));
    mesh.castShadow=true;mesh.receiveShadow=true;statics.add(mesh);
    return mesh;
  }

  function beltTube(path,lateral,radius,height,color){
    const { points, normals, closed } = path;
    const railPoints = points.map((p, i) => new THREE.Vector3(
      p.x + normals[i].x * lateral, height, p.z + normals[i].z * lateral));
    const curve = new THREE.CatmullRomCurve3(railPoints, closed, "centripetal");
    const geo=new THREE.TubeGeometry(curve,points.length,radius,10,closed);
    const rail=new THREE.Mesh(geo,mat(color));rail.castShadow=true;rail.receiveShadow=true;statics.add(rail);
  }

  // One reusable texture: delivery progress belongs to the board, never a fake target.
  const progressCanvas = document.createElement("canvas");
  progressCanvas.width = 512; progressCanvas.height = 256;
  const progressTexture = keep(new THREE.CanvasTexture(progressCanvas));
  progressTexture.colorSpace = THREE.SRGBColorSpace;
  const progressMaterial = keep(new THREE.MeshBasicMaterial({map:progressTexture,transparent:true,depthWrite:false}));
  let progressKey = "";
  function stamp(game) {
    const xs=game.ring.map(p=>p.x), ys=game.ring.map(p=>p.y);
    const x=(Math.min(...xs)+Math.max(...xs))/2, y=(Math.min(...ys)+Math.max(...ys))/2;
    // Skip compact loops and layouts with a central truck; the label must not cover play.
    if(Math.max(...xs)-Math.min(...xs)<9 || Math.max(...ys)-Math.min(...ys)<7 ||
       game.trucks.some(t=>{const c=game.slotPos(t,(t.cap-1)/2,.5);return Math.hypot(c.x-x,c.y-y)<t.cap*slotLen(game,t)/2+4;})) return;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),progressMaterial);
    mesh.rotation.x=-Math.PI/2;mesh.position.set(x,0.105,y);statics.add(mesh);
  }
  function updateProgress(game) {
    const done=game.trucks.filter(t=>t.gone).length;
    const key=done+"/"+game.trucks.length;
    if(key===progressKey)return;
    progressKey=key;
    const p=progressCanvas.getContext("2d");p.clearRect(0,0,512,256);
    p.fillStyle="#fff4d4";p.beginPath();p.roundRect(26,18,460,220,74);p.fill();
    p.strokeStyle="#ffffff";p.lineWidth=10;p.stroke();
    p.textAlign="center";p.fillStyle="#267d98";p.font="900 80px system-ui";p.fillText(key,256,119);
    p.fillStyle="#ee8b58";p.font="900 29px system-ui";p.fillText("BAGS PACKED!",256,178);
    progressTexture.needsUpdate=true;
  }

  // ---------------------------------------------------------------- camera
  function placeCamera(b) {
    const cx = (b.x0 + b.x1) / 2, cz = (b.y0 + b.y1) / 2;
    const H = Math.max(b.x1 - b.x0, b.y1 - b.y0);

    // Camera dat TREN va PHIA TRUOC tam ban co. Ty le 0.92 / 0.62 cho ra goc cheo ~56 do
    // so voi mat ban: du de thay mat tren moi vat CONG mot phan mat truoc cua no — do
    // chinh la thu tao ra chieu sau. Dat thang dinh (0.62 -> 0) thi ket qua khong khac gi
    // ban 2D va ca file nay vo nghia.
    camera.position.set(cx, H * 0.92, cz + H * 0.62);
    camera.lookAt(cx, 0, cz);

    sun.position.set(cx - H * 0.5, H * 1.2, cz + H * 0.35);
    sun.target.position.set(cx, 0, cz);
    scene.add(sun.target);
    const s = sun.shadow.camera;
    s.left = -H; s.right = H; s.top = H; s.bottom = -H;
    s.near = 0.5; s.far = H * 3;
    s.updateProjectionMatrix();
  }

  // Lui camera cho den khi ca ban co lot khung hinh. Giai tich se phai giai ca fov doc lan
  // fov ngang qua aspect; chieu bon goc roi do la ngan hon va khong sai khi khung doi ti le.
  // Lui camera cho den khi ca ban co lot khung hinh. Giai tich se phai giai ca fov doc lan
  // fov ngang qua aspect; chieu cac diem that roi do la ngan hon va khong sai khi khung doi ti le.
  //
  // ⚠ Ba rang buoc, KHONG phai mot. Truoc day ham nay do MOT con so: goc xa nhat cua bounds
  // (da bao ca xe lan vanh ray) so voi khung, roi ep no bang 1.15 - ban co tran ra 15%. Hai
  // chieu bi cot vao nhau bang mot con so duy nhat, nen chieu nao chat hon thi chieu kia phai
  // chiu: ban co cao hon la rong thi chieu DOC an het, va ray khong bao gio cham duoc mep trai
  // phai. Do tren level 8 khung 500x805: ray chi rong 326/500 px, thua 87px moi ben.
  //
  // Gio moi rang buoc do dung thu can do va co dich rieng:
  //   1. RAY, lay MEP NGOAI, ca hai chieu -> be ngang dich 0.94 (chua le hai ben), chieu doc
  //      dich 1.00 trong dai an toan giua hai dai HUD. Ray khong bao gio bi cat, cung khong
  //      bao gio chui duoi HUD.
  //   2. XE theo be ngang -> dich 0.97: xe CHAM DUOC, cat mat mot dau xe la loi chuc nang.
  //   3. XE theo chieu doc -> dich 1.00 trong dai an toan giua hai dai HUD.
  // worst la ti le lon nhat trong ba, va vong lap keo no ve 1: ai cham dich truoc thi nguoi do
  // chan lai. Ban thua thi (1) chan - ray vua kin man hinh; ban dong xe thi (2) hoac (3) chan.
  //
  // ⚠ BAN CO NHO VA THUA CHO TREN/DUOI KHONG PHAI LOI CUA HAM NAY. Da do, dung dung vao camera:
  // tren moi level MOT TRONG BA rang buoc deu cham 96-98%, tuc khong con mot ti cho nao de phong
  // to them. Thua cho la vi TI LE BAN CO khong khop ti le man hinh.
  //   lv300  lap ngang 97%  lap doc 58%      lv25   lap ngang 68%  lap doc 97%
  //   lv60   lap ngang 97%  lap doc 59%      lv700  lap ngang 74%  lap doc 97%
  // Man hinh: 500 rong tren dai an toan 563 cao = 0.89. Camera nghieng nen chieu doc bi nen
  // khoang 1.25 lan (do tren lv300: ti le the gioi 1.18 hien ra thanh 1.48). Nen ti le the gioi
  // ly tuong la 0.89/1.25 = **0.71**, tuc ban co nen CAO hon RONG mot chut.
  // Quet ca 1299 level cua bo tu sinh: trung vi 0.89, 53% level be ngang qua, trung binh bo phi
  // 24% mot chieu. Do la don bay cua BO SINH LEVEL (dat bo do o canh tren/duoi thay vi don ca
  // sang trai/phai), khong phai cua camera.
  function fitCamera(game) {
    const b = game.bounds;
    const cx = (b.x0 + b.x1) / 2, cz = (b.y0 + b.y1) / 2;

    // ⚠ Khop MEP NGOAI cua ray, ca hai chieu, va chua le hai ben. Ba dieu chu du an yeu cau,
    // nguyen van: "duong ray qua lon, chiem het va vuot ca board", "dep nhat la tren mobile,
    // no cach 2 mep 2 ben mot chut it", "con o phia tren ca mobile lan desktop, khong vuot
    // duoc HUD".
    //
    // ⚠ Phai lay MEP NGOAI chu khong phai tim duong: ray ve ra toi BELT_W/2 moi ben, nen khop
    // theo tim duong la cho ray tran ra ngoai khung dung bang nua be ngang cua no.
    // ⚠ Va phai rang buoc CA CHIEU DOC, khong chi be ngang. Chi rang buoc be ngang thi tren
    // ban co cao hon rong, ray chui len duoi dai HUD.
    const R = game.ring, rn = R.length, half = BELT_W / 2;
    const ringPts = [];
    for (let i = 0; i < rn; i++) {
      const a2 = R[game.closed ? (i - 1 + rn) % rn : Math.max(0, i - 1)];
      const b2 = R[game.closed ? (i + 1) % rn : Math.min(rn - 1, i + 1)];
      const d = Math.hypot(b2.x - a2.x, b2.y - a2.y) || 1;
      const nx = -(b2.y - a2.y) / d, ny = (b2.x - a2.x) / d;
      for (const sg of [-1, 1])
        ringPts.push(new THREE.Vector3(R[i].x + nx * sg * half, 0, R[i].y + ny * sg * half));
    }
    const truckPts = [];
    for (const t of game.trucks) {
      const w = (TRUCK_W * (game.fit ?? 1)) / 2;
      for (const end of [game.slotPos(t, 0, 0), game.slotPos(t, t.cap - 1, 1)])
        for (const sgn of [-1, 1])
          for (const y of [0, CARGO_H + BODY_H])
            truckPts.push(new THREE.Vector3(end.x - t.my * sgn * w, y, end.y + t.mx * sgn * w));
    }
    const playing=!document.getElementById("chrome").classList.contains("hide");
    const top=playing?document.getElementById("topbar").offsetHeight+12:0;
    const bottom=playing?document.getElementById("tools").offsetHeight+18:0;
    const upper=Math.max(.2,1-2*top/h), lower=Math.max(.2,1-2*bottom/h);
    const focus = new THREE.Vector3(cx, 0, cz);
    for (let i = 0; i < 24; i++) {
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      let worst = 0;
      for (const p of ringPts) {
        const v = p.clone().project(camera);
        // 0.94 = chua khoang 3% be ngang man hinh lam le moi ben. Chieu doc thi dich 1.00,
        // tuc ray duoc cham day dai an toan nhung khong bao gio chui qua no.
        worst = Math.max(worst, Math.abs(v.x) / 0.94, (v.y / upper) / 1.00, (-v.y / lower) / 1.00);
      }
      for (const p of truckPts) {
        const v = p.clone().project(camera);
        worst = Math.max(worst, Math.abs(v.x) / 0.97, (v.y / upper) / 1.00, (-v.y / lower) / 1.00);
      }
      // ⚠ Chi duoc dung o PHIA AN TOAN. Truoc day dieu kien la |worst - 1| < 0.01, tuc worst =
      // 1.008 cung duoc coi la xong - va 0.8% do la ray bi cat that: do duoc 10px o level 100.
      // Khi ngoai mep ban co la mang mau phang thi khong ai thay; tu khi la anh san nha ga co
      // hoa van thi thay ngay. Nen: qua 1 la luon phai lui them, chi duoc dung trong dai
      // [0.97, 1.00].
      if (worst <= 1 && worst > 0.97) break;
      const off = camera.position.clone().sub(focus);
      off.multiplyScalar(Math.max(0.6, Math.min(1.6, worst / 0.985)));
      camera.position.copy(focus).add(off);
      camera.lookAt(focus);
    }
  }

  // ---------------------------------------------------------------- dung canh tinh
  function buildStatics(game) {
    clear(statics);
    clear(tread);
    const count = Math.max(3, Math.floor(game.len / 2.2));
    for (let i=0;i<count;i++) {
      const treadPiece=new THREE.Group();treadPiece.position.y=.397;
      const cleat=new THREE.Mesh(boxGeo,mat("#314878"));
      cleat.scale.set(.13,.055,1.72);cleat.position.y=.028;
      cleat.castShadow=true;cleat.receiveShadow=true;treadPiece.add(cleat);
      // Only every third cleat carries a direction mark: motion remains readable without
      // covering the belt in arrows.
      if(i%3===0){
        const shadow=new THREE.Mesh(beltArrowGeo,beltArrowShadowMat);
        shadow.rotation.x=-Math.PI/2;shadow.position.set(.015,.061,0);shadow.scale.set(1.035,1.035,1);
        const face=new THREE.Mesh(beltArrowGeo,beltArrowMat);
        face.rotation.x=-Math.PI/2;face.position.y=.069;
        treadPiece.add(shadow,face);
      }
      tread.add(treadPiece);
    }
    const b = game.bounds;
    // ⚠ Le phai du rong de MEP TAM NEN khong cat ngang duong ray. `game.bounds` om sat ray
    // (nhat la tu khi vong ray duoc thu lai cho vua hang ben), nen le 0.6 dat mep tam dung
    // tren mat ray - tren man hinh no doc ra la "ray bi mot cai vien che". Nua be rong ray la
    // 1.41, cong them cho tho.
    // ⚠ 4.5 chu khong phai 2.6: tam nen la mot hop BO GOC, nen o hai ben suon cai goc bo do
    // an vao trong them mot doan nua - le 2.6 van de mep tam cat ngang qua ray o hai canh trai
    // phai. Do la cai "ray bi vien che" con sot lai sau lan sua truoc.
    const pad = 4.5;

    // ⚠ KHONG VE TAM NEN NAO DUOI BAN CO NUA. Anh nen chinh la san; hai tam de duoi chi lam
    // mot viec la che no di. Lenh chu du an: "sao k de khay va duong ray nguyen con o duoi la
    // background thoi, can gi sua nhieu" - va do la cach dung nhat, vi camera cho ban co chiem
    // tron man hinh nen bat cu tam nao trai theo khung bao deu phu kin khung.
    // ⚠ KHONG MAT BONG DO. Ca hai tam dung `flatMat`, tuc `MeshBasicMaterial`, ma vat lieu do
    // KHONG NHAN BONG - `receiveShadow = true` tren no xua nay la mot dong khong lam gi. Da
    // kiem truoc khi go: khong co bong nao tren san de mat.
    // ⚠ Van tao va giu trong `statics` de bong cua chinh chung khong doi, va de mot ngay nao do
    // muon co san hung bong that thi chi viec doi sang `THREE.ShadowMaterial` va bat `visible`.
    const nen = new THREE.Mesh(boxGeo, flatMat("#286c9a"));
    nen.scale.set(b.x1 - b.x0 + pad * 2, BOARD_H, b.y1 - b.y0 + pad * 2);
    nen.position.set((b.x0 + b.x1) / 2, -BOARD_H / 2, (b.y0 + b.y1) / 2);
    nen.visible = false;
    statics.add(nen);
    const inset=box(statics,(b.x0+b.x1)/2,(b.y0+b.y1)/2,b.x1-b.x0+pad*2-0.5,b.y1-b.y0+pad*2-0.5,0.09,0,"#c8f4f8",0);
    inset.castShadow=false;
    inset.visible=false;
  // ⚠ LUI VE MOC CU theo lenh chu du an ("de design lai nhu ban dau truoc, truoc khi build
  // bo level ay"). Code moi KHONG XOA, chi tat duong goi, de bat lai bang mot dong.
    if(game.closed) stamp(game);

    // Ray: ong chay doc duong tim. Noi len khoi mat nen chu khong phai mot net ve — do la
    // ca ly do dung 3D.
    if (game.ring && game.ring.length > 1) {
      // Layered baggage conveyor: a real lower shell, raised cyan casing and a recessed
      // rubber lane. Solid side walls catch light at the curves instead of reading as flat lines.
      const path = beltFrame(game);
      beltSolid(path,3.12,.03,.18,"#102c52");
      beltSolid(path,2.92,.14,.17,"#238fbd");
      beltSolid(path,2.56,.25,.12,"#65d9ee");
      beltSolid(path,2.28,.30,.095,"#17264d");
      beltStrip(path,2.08,.397,"#202e59");
      // Dark lower bead supplies contact shadow; the bright upper bead is the polished casing.
      beltTube(path,-1.37,.15,.31,"#0b2345");
      beltTube(path,1.37,.15,.31,"#0b2345");
      beltTube(path,-1.35,.115,.40,"#69ddf3");
      beltTube(path,1.35,.115,.40,"#69ddf3");
      beltTube(path,-1.13,.045,.43,"#e6ffff");
      beltTube(path,1.13,.045,.43,"#e6ffff");
    }

    // ⚠ Ray HO thi hai dau phai co MIENG CONG. Engine co luat cong (`!closed` thi hang toi
    // cuoi ray nhay ve dau kia) nhung bo ve truoc day khong ve gi o do ca - ray cut giua
    // khong trung. Hoi nen la mot mang tim phang thi cut hay khong trong nhu nhau; tu khi
    // nen la anh san lat gach thi cho cut doc ra dung nhu ban co bi crop hong, va da bi bao
    // dung nhu the. Con hai dau ray o dau thi dung du lieu chu khong uoc luong: `ring[0]` va
    // `ring[n-1]`, huong lay tu chinh doan ke no.
    if (!game.closed) {
      const R = game.ring, n = R.length;
      for (const [pe, p1] of [[R[0], R[1]], [R[n - 1], R[n - 2]]]) {
        const ang = Math.atan2(p1.y - pe.y, p1.x - pe.x);
        // ⚠ Mieng cong phai nam TRONG long ray, khong duoc tho ra ngoai dau ray: khung bao
        // ma camera khop la `game.bounds` do ENGINE tinh, va engine khong biet gi ve mieng
        // cong - cai gi tho ra ngoai bounds thi bi cat, va khong ai sua duoc o phia camera.
        const p0 = { x: pe.x + Math.cos(ang) * 0.55, y: pe.y + Math.sin(ang) * 0.55 };
        // khung cong: mot khoi toi bac ngang ray, mat trong sang de doc ra la mot cai mieng
        const frame = box(statics, p0.x, p0.y, 1.0, BELT_W + 0.18, 1.35, 0.02, "#2b2d63", -ang);
        frame.castShadow = true;
        box(statics, p0.x - Math.cos(ang) * 0.16, p0.y - Math.sin(ang) * 0.16,
            0.44, BELT_W - 0.5, 1.05, 0.1, "#14173a", -ang);
        box(statics, p0.x + Math.cos(ang) * 0.5, p0.y + Math.sin(ang) * 0.5,
            0.2, BELT_W + 0.18, 0.26, 1.35, "#7fc4ff", -ang);
      }
    }

    for (const t of game.trucks) {
      const len = t.cap * slotLen(game, t);
      const c = game.slotPos(t, (t.cap - 1) / 2, 0.5);   // tam than xe
      // ⚠ Be rong phai CO theo game.fit, khong duoc dung hang so co dinh. Engine thu than xe
      // lai theo tung level vi o ban dong xe cac ben nam sat nhau va xe co dinh se de len nhau
      // - 263/1299 level, nang nhat lv60 voi 29 cap. Chieu dai da tu di theo (slotLen doc tu
      // slotPos), nhung be rong thi khong: hai xe SONG SONG sat canh chong theo chieu rong, va
      // rut ngan bao nhieu cung khong roi nhau.
      const TW = TRUCK_W * (game.fit ?? 1);
      // Bright pool-blue luggage cart: saturated enough to feel playful, with a pale
      // mint basin and white piping so it stays distinct from both board and belt.
      const shell="#35bfe6";
      const shellShadow="#1477ad";
      const shellRim="#efffff";
      const lining="#a9eee5";
      trayBox(statics,c.x,c.y,len+0.64,TW+0.3,0.18,0.06,shellShadow,rotOf(t));
      const m = trayBox(statics, c.x, c.y, len + 0.42, TW+0.12, BODY_H-0.08, 0.12,
                        shell, rotOf(t));
      m.userData.truck = t;
      // No raised long walls: luggage rests on a flat packing platform. Four small corner
      // guards give it suitcase construction without creating the silhouette of a hull.
      const basin=trayBox(statics,c.x,c.y,len+.12,TW-.24,.055,BODY_H+.025,lining,rotOf(t));
      basin.userData.truck=t;
      for(const end of [-1,1])for(const side of [-1,1]){
        const ex=c.x+t.mx*end*(len/2-.08)-t.my*side*(TW/2-.08);
        const ez=c.y+t.my*end*(len/2-.08)+t.mx*side*(TW/2-.08);
        const guard=trayBox(statics,ex,ez,.34,.34,.085,BODY_H+.055,shellRim,rotOf(t));
        guard.userData.truck=t;
      }
      let px=-t.my, pz=t.mx;
      if(pz<0){px=-px;pz=-pz;} // handles always face the camera side of the baggage belt
      // A suitcase grip belongs on the long side. Putting it on the short end created a
      // bow/stern silhouette, especially while the tray was empty.
      const handleY=BODY_H+.2, handleEdge=TW/2+.02;
      const handlePath=new THREE.CatmullRomCurve3([
        new THREE.Vector3(c.x-t.mx*.42+px*handleEdge,handleY,c.y-t.my*.42+pz*handleEdge),
        new THREE.Vector3(c.x-t.mx*.32+px*(handleEdge+.25),handleY,c.y-t.my*.32+pz*(handleEdge+.25)),
        new THREE.Vector3(c.x+t.mx*.32+px*(handleEdge+.25),handleY,c.y+t.my*.32+pz*(handleEdge+.25)),
        new THREE.Vector3(c.x+t.mx*.42+px*handleEdge,handleY,c.y+t.my*.42+pz*handleEdge),
      ]);
      const handle=new THREE.Mesh(new THREE.TubeGeometry(handlePath,20,.1,10,false),mat("#12658e",true));
      handle.userData.truck=t;statics.add(handle);
      // Two square clasps at the handle end read as suitcase hardware. Isolated dots in
      // the old recessed basin looked like boat fittings and had no clear purpose.
      for(const side of [-1,1]){
        const latchAlong=-len*.5+.24;
        const lx=c.x+t.mx*latchAlong-t.my*side*.42;
        const lz=c.y+t.my*latchAlong+t.mx*side*.42;
        const latch=trayBox(statics,lx,lz,.24,.2,.075,BODY_H+.055,"#ffc247",rotOf(t),true);
        latch.userData.truck=t;
      }
      const reach = Math.hypot(t.px-t.x,t.py-t.y);
      if (reach > 0.4) {
        // ⚠ Cai cau va HAI THANH CHAN cua no phai doc CUNG MOT TRUC: truc noi mieng xe (t.x,t.y)
        // voi diem bat ray (t.px,t.py). Truoc day mat ban ve theo truc cau con hai thanh chan ve
        // theo truc THAN XE (rotOf/t.mx,t.my) - tren ray thang hai truc nay trung nhau nen khong
        // ai thay, nhung tren ray hinh so 8 (level 9) ben bat ray lech han khoi huong xe, va hai
        // thanh chan quay xien cat ngang mat cau. Mot truc, tinh mot lan.
        const ux=(t.px-t.x)/reach, uy=(t.py-t.y)/reach;   // huong doc cau, da chuan hoa
        const rampRot=-Math.atan2(t.py-t.y,t.px-t.x);
        const deckW=1.48, steps=20, vertices=[], indices=[];
        // Build the bridge in a group anchored at the rail. Scaling its local X axis then
        // retracts the whole connector cleanly into the rail after the lid has shut.
        const bridgeGroup=new THREE.Group();
        bridgeGroup.position.set(t.px,0,t.py);
        bridgeGroup.rotation.y=rampRot;
        bridgeGroup.userData.bridgeTruck=t;
        statics.add(bridgeGroup);
        const tagBridge=(mesh)=>{mesh.userData.truck=t;return mesh;};
        const at = (u, side, lower=false) => {
          const x=-reach*(1-u);
          const z=side*deckW/2;
          const top=.52+.16*Math.sin(Math.PI*u);
          return [x, lower ? top-.18 : top, z];
        };
        for(let i=0;i<=steps;i++){
          const u=i/steps;
          vertices.push(...at(u,-1),...at(u,1),...at(u,-1,true),...at(u,1,true));
          if(i===steps)continue;
          const a=i*4,b=(i+1)*4;
          indices.push(a,a+1,b,a+1,b+1,b);
          indices.push(a+2,b+2,a+3,a+3,b+2,b+3);
          indices.push(a,b,a+2,a+2,b,b+2);
          indices.push(a+1,a+3,b+1,a+3,b+3,b+1);
        }
        const bridgeGeo=new THREE.BufferGeometry();
        bridgeGeo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
        bridgeGeo.setIndex(indices);bridgeGeo.computeVertexNormals();
        const bridge=new THREE.Mesh(bridgeGeo,mat(shell));bridge.castShadow=true;bridge.receiveShadow=true;
        tagBridge(bridge);bridgeGroup.add(bridge);
        // Rounded handrails follow the arch and two soft feet support it above the belt.
        for(const side of [-1,1]){
          const railPts=[];
          for(let i=0;i<=steps;i++){
            const u=i/steps,[x,y,z]=at(u,side);
            railPts.push(new THREE.Vector3(x,y+.11,z));
          }
          const rail=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts),steps*2,.12,10,false),mat(shellRim,true));
          tagBridge(rail);rail.castShadow=true;bridgeGroup.add(rail);
        }
        for(const u of [.32,.72]){
          const x=-reach*(1-u),z=0;
          const top=.52+.16*Math.sin(Math.PI*u)-.12;
          const height=Math.max(.02,top-.12-.26);
          const foot=new THREE.Mesh(new THREE.CapsuleGeometry(.13,height,6,12),mat(shellShadow));
          foot.position.set(x,(top-.12)/2+.12,z);
          tagBridge(foot);foot.castShadow=true;bridgeGroup.add(foot);
          tagBridge(box(bridgeGroup,x,z,.3,.3,.09,top-.13,"#ffc247",0));
        }
        // Plain coupling cap: no decorative symbol competing with the luggage state.
        const badge=new THREE.Mesh(new THREE.CircleGeometry(.27,24),mat("#f28eb7"));
        badge.rotation.x=-Math.PI/2;
        const holder=new THREE.Group();
        holder.position.set(-reach/2,0.73,0);badge.position.y=-.015;holder.add(badge);
        tagBridge(badge);bridgeGroup.add(holder);
      }
    }
  }

  // ⚠ SLOT_LEN khong duoc export tu loopsort.js. Do no tu hai tam o lien nhau thay vi chep
  // con so 1.5 sang day: chep la tao ban thu hai cua mot hang so, va hai ban se troi nhau.
  function slotLen(game, t) {
    const a = game.slotPos(t, 0, 0.5), b = game.slotPos(t, 1, 0.5);
    return Math.hypot(a.x - b.x, a.y - b.y) || 1.5;
  }

  // Truc dai cua xe nam theo (mx,my). Hop mac dinh dai theo truc X cuc bo, ma vector
  // (1,0,0) quay quanh Y mot goc θ thanh (cos θ, 0, -sin θ) — nen θ = atan2(-my, mx).
  const rotOf = (t) => Math.atan2(-t.my, t.mx);

  // Hidden luggage carries a bold question mark on its face, so the colour lock is
  // immediately readable without relying on a subtle tint.
  const questionCanvas=document.createElement("canvas");questionCanvas.width=128;questionCanvas.height=128;
  const questionPaint=questionCanvas.getContext("2d");
  questionPaint.textAlign="center";questionPaint.textBaseline="middle";questionPaint.lineJoin="round";
  questionPaint.globalAlpha=.3;questionPaint.font="900 30px Trebuchet MS, system-ui, sans-serif";
  questionPaint.fillStyle="#a8c9f2";
  for(const [x,y,r] of [[24,25,-.18],[103,27,.2],[26,104,.2],[102,102,-.2]]){
    questionPaint.save();questionPaint.translate(x,y);questionPaint.rotate(r);questionPaint.fillText("?",0,0);questionPaint.restore();
  }
  questionPaint.globalAlpha=1;questionPaint.font="900 82px Trebuchet MS, system-ui, sans-serif";
  questionPaint.lineWidth=10;questionPaint.strokeStyle="#263e76";
  questionPaint.strokeText("?",64,66);
  questionPaint.fillStyle="#b8d5f7";questionPaint.fillText("?",64,66);
  const questionTexture=keep(new THREE.CanvasTexture(questionCanvas));questionTexture.colorSpace=THREE.SRGBColorSpace;
  const questionMaterial=keep(new THREE.MeshBasicMaterial({map:questionTexture,transparent:true,depthWrite:false}));

  function addCargoMark(group,x,z,y,material,t,draining=false){
    const mark=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.18),material);
    mark.rotation.x=-Math.PI/2;mark.position.set(x,y,z);
    mark.userData.truck=t;if(draining)mark.userData.drainTruck=t;
    group.add(mark);
  }

  // Ve lai doan hang da giao xong, o dung cac o no tung nam, de animateCargo thu nho dan.
  // ⚠ finish() xoa sach t.blocks TRUOC khi buildCargo chay, nen phai doc snapshot lastCargo.
  // ⚠ Khung hinh chi thay trang thai TRUOC cu hut cuoi cung (deliver xoa ca DELIVER khoi trong
  // cung mot buoc), nen snapshot thuong chi co DELIVER-1 khoi. Ca chung cung mot mau, bu cho du.
  function buildDrainGhost(game, t) {
    const snap = lastCargo.get(t);
    if (!snap || !snap.length) return false;
    const last = snap[snap.length - 1];
    const SL = slotLen(game, t);
    // Before the final flight ends, draw only the pieces that were already resting in
    // the tray. The fourth piece is still represented by game.flying at that moment.
    const arrived=!Number.isFinite(t.arriveAt)||game.now>=t.arriveAt;
    const count=arrived?DELIVER:Math.min(snap.length,DELIVER-1);
    for (let i = 0; i < count; i++) {
      const b = snap[i] || last;
      const hex = b.hidden && !b.seen ? HIDDEN_FILL : (PALETTE[b.color] || "#888");
      const c = game.slotPos(t, i, 0.5);
      const m = box(cargo, c.x, c.y, SL - 0.22, SL - 0.22, CARGO_H, BODY_H, hex, rotOf(t));
      m.userData.truck = t; m.userData.drainTruck = t; m.userData.slot=i;
      if(b.hidden&&!b.seen)addCargoMark(cargo,c.x,c.y,BODY_H+CARGO_H+.025,questionMaterial,t,true);
    }
    return true;
  }

  // When the fourth piece fills a suitcase, close its lid during the delivery beat.
  // Keep this artwork shared with the settled state so the same four colour panels
  // remain visible after the closing animation.
  function buildLid(game, t, closing = false) {
    const centre = game.slotPos(t, (t.cap - 1) / 2, 0.5);
    const lift = closing ? LID_LIFT : 0;
    const tagClosing = (mesh) => {
      if (closing) {
        mesh.userData.closeTruck = t;
        mesh.userData.closeBaseY = mesh.position.y;
      }
      return mesh;
    };
    const delivered = lastCargo.get(t) || [];
    const colourKey = delivered.find((b) => b && b.color)?.color || t.claim;
    const lidHex = PALETTE[colourKey] || "#35bfe6";
    const edgeHex = "#" + new THREE.Color(lidHex).multiplyScalar(.52).getHexString();
    const strapHex = "#" + new THREE.Color(lidHex).lerp(new THREE.Color("#ffffff"),.2).getHexString();
    const outerLen=t.cap*slotLen(game,t)+.42;
    const outerWid=TRUCK_W*(game.fit??1)+.12;
    // This is a deep cap, not a floating plate: its lower edge overlaps the base by 6cm,
    // while the equal outer dimensions make all four sides close flush.
    tagClosing(trayBox(cargo,centre.x,centre.y,outerLen,outerWid,.76,
      BODY_H-.02+lift,edgeHex,rotOf(t),false,.28))
      .userData.truck=t;
    tagClosing(trayBox(cargo,centre.x,centre.y,outerLen-.1,outerWid-.1,.72,
      BODY_H+.01+lift,lidHex,rotOf(t),true,.25))
      .userData.truck=t;
    tagClosing(trayBox(cargo,centre.x,centre.y,outerLen-.2,outerWid-.2,.06,
      BODY_H+.73+lift,lidHex,rotOf(t),true))
      .userData.truck=t;
    // Tonal zipper and two cross straps turn the long cap into travel luggage. They stay
    // in the set colour family, avoiding the harsh white rails used by the old design.
    const detailBase=BODY_H+.795+lift;
    for(const side of [-1,1]){
      const x=centre.x-t.my*side*(outerWid/2-.16);
      const z=centre.y+t.mx*side*(outerWid/2-.16);
      tagClosing(trayBox(cargo,x,z,outerLen-.42,.065,.028,detailBase,edgeHex,rotOf(t)))
        .userData.truck=t;
    }
    for(const end of [-1,1]){
      const x=centre.x+t.mx*end*(outerLen/2-.16);
      const z=centre.y+t.my*end*(outerLen/2-.16);
      tagClosing(trayBox(cargo,x,z,.065,outerWid-.42,.028,detailBase,edgeHex,rotOf(t)))
        .userData.truck=t;
    }
    for(const along of [-.22,.22]){
      const x=centre.x+t.mx*outerLen*along,z=centre.y+t.my*outerLen*along;
      tagClosing(trayBox(cargo,x,z,.2,outerWid-.3,.04,detailBase+.018,strapHex,rotOf(t),true))
        .userData.truck=t;
    }
    // Four chunky protectors and two wheels are the strongest suitcase cues at game scale.
    for(const end of [-1,1])for(const side of [-1,1]){
      const x=centre.x+t.mx*end*(outerLen/2-.2)-t.my*side*(outerWid/2-.2);
      const z=centre.y+t.my*end*(outerLen/2-.2)+t.mx*side*(outerWid/2-.2);
      tagClosing(trayBox(cargo,x,z,.34,.34,.055,detailBase+.032,edgeHex,rotOf(t),true))
        .userData.truck=t;
    }
    for(const side of [-1,1]){
      const x=centre.x+t.mx*(outerLen/2+.06)-t.my*side*outerWid*.27;
      const z=centre.y+t.my*(outerLen/2+.06)+t.mx*side*outerWid*.27;
      const wheel=new THREE.Mesh(new THREE.SphereGeometry(.2,18,14),mat("#173b62"));
      wheel.scale.set(.72,.62,.72);wheel.position.set(x,BODY_H+.03+lift,z);
      wheel.castShadow=true;wheel.userData.truck=t;tagClosing(wheel,false);cargo.add(wheel);
    }
    const handleAlong=-outerLen/2-.12;
    for(const side of [-1,1]){
      const x=centre.x+t.mx*handleAlong-t.my*side*.34;
      const z=centre.y+t.my*handleAlong+t.mx*side*.34;
      tagClosing(trayBox(cargo,x,z,.42,.08,.07,BODY_H+.24+lift,"#173b62",rotOf(t),true))
        .userData.truck=t;
    }
    const gripX=centre.x+t.mx*(-outerLen/2-.34),gripZ=centre.y+t.my*(-outerLen/2-.34);
    tagClosing(trayBox(cargo,gripX,gripZ,.12,.8,.09,BODY_H+.24+lift,"#173b62",rotOf(t),true))
      .userData.truck=t;
    // A small baggage tag carries completion state; a large centred tick made the long
    // single-colour lid resemble a coffin lid.
    const bx=centre.x-t.mx*outerLen*.3,bz=centre.y-t.my*outerLen*.3;
    const badge=new THREE.Mesh(new THREE.CircleGeometry(.32,24),mat("#ffd447",true));
    badge.rotation.x=-Math.PI/2;badge.position.set(bx,BODY_H+.855+lift,bz);
    badge.userData.truck=t;tagClosing(badge,false);cargo.add(badge);
    const check = new THREE.Shape();
    check.moveTo(-.65, 0); check.lineTo(-.22, -.43); check.lineTo(.72, .55);
    check.lineTo(.49, .77); check.lineTo(-.22, -.05); check.lineTo(-.44, .22); check.closePath();
    const mark = new THREE.Mesh(new THREE.ShapeGeometry(check), mat("#ffffff"));
    mark.scale.set(.28,.28,.28);
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(bx, BODY_H + .865 + lift, bz);
    mark.userData.truck = t;
    tagClosing(mark,false);
    cargo.add(mark);
  }

  // ---------------------------------------------------------------- hang tren xe
  // ⚠ LUAT GOP: cac o lien tiep CUNG MAU phai thanh MOT khoi hinh hoc duy nhat. Do tren
  // clip goc (lv4 t=54.5-58.1): mot xe dang gom bon khoi do hien ra la MOT thanh do lien,
  // khong vach, khong khe; con lv5 t=76-91 voi [do,luc,lam,do] thi bon dai va ba ranh nhin
  // thay ro. Ve moi o thanh mot hop rieng se ra bon vach do va mat luon cam giac "dang day
  // dan len" — do la thu bay ra ngay khi nhin, nen no la luat chu khong phai tuy chon.
  function buildCargo(game) {
    clear(cargo);
    for (const t of game.trucks) {
      if (t.gone) {
        // ⚠ Giao hang khong duoc bien mat trong mot khung hinh. Trong DRAIN_MS, ve lai doan
        // hang da co o khung truoc (lastCargo) roi tick() thu nho dan; het quang do moi hien
        // nap + dau tick. Ban goc: confetti ban ra truoc, roi hang moi rut het.
        const sequencing = !reducedMotion.matches && t.drain >= 0 && game.now < lidEnd(t);
        if (sequencing && buildDrainGhost(game, t)) {
          // Do not even create the lid while the final suitcase is flying. With this
          // camera, a raised lid still overlaps the tray in screen space and looks closed.
          if(game.now>=lidStart(t))buildLid(game, t, true);
          continue;
        }
        buildLid(game, t);
        continue;
      }
      const SL = slotLen(game, t);
      const bl = t.blocks;

      // ⚠ Bo qua khoi DANG BAY: vali cua no con dang tren duong vao, drawCubes dang ve no roi.
      // Khoi dang bay luon la khoi CUOI CUNG nen cat bot o duoi nay khong lam xe dich chi so cua
      // nhung khoi khac.
      let len = bl.length;
      while (len > 0 && bl[len - 1].flying) len--;
      let i = 0;
      while (i < len) {
        let n = 1;
        // Four separate candies remain legible even when all four match.

        const hex = bl[i].hidden && !bl[i].seen ? HIDDEN_FILL : (PALETTE[bl[i].color] || "#888");
        // Tam cua mot doan n o bat dau tu i: slotPos tuyen tinh theo chi so nen lay tam
        // cua o giua la du.
        const c = game.slotPos(t, i + (n - 1) / 2, 0.5);
        const m = box(cargo, c.x, c.y, SL - 0.22, SL - 0.22, CARGO_H, BODY_H,
                      hex, rotOf(t));
        m.userData.truck = t;
        // ⚠ Nho vali nay nam o thu may. animateCargo can biet de chi lam vali VUA NHAP nhun,
        // chu khong lam ca khoang hang nhun theo - xem chu thich o do.
        m.userData.slot = i;
        if(bl[i].hidden&&!bl[i].seen) addCargoMark(cargo,c.x,c.y,BODY_H+CARGO_H+.025,questionMaterial,t);


        // ⚠ Chi khoi O MIENG co vien dam — do la khoi se roi ra neu cham (tap() lay
        // blocks[blocks.length-1]). Cac khoi khac khong co vien, neu khong thi vien lai
        // tro thanh cai vach ma luat GOP vua bo di.
        if (false) {
          // ⚠ Vien la mot VO LAT MAT (inverted hull), khong phai mot hop dac lon hon va
          // cung khong phai EdgesGeometry. Hai cach kia deu da thu va deu hong:
          //   - EdgesGeometry ve ca 12 canh ke ca canh khuat, o 1px ra net dut lom chom.
          //   - Hop dac lon hon thi MAT TRUOC toi cua no che mat mat truoc cua khoi mau;
          //     o goc camera nay mat truoc chiem dien tich lon nen no doc ra mot mang den.
          // Lat mat (BackSide) thi moi mat huong ve camera bi cull, chi con lai dung phan
          // thua o ria — tuc dung mot duong vien, khong bao gio che cai gi.
          const sh = new THREE.Mesh(boxGeo, keep(new THREE.MeshBasicMaterial({
            color: 0x140c22, side: THREE.BackSide })));
          sh.scale.set(m.scale.x + 0.14, m.scale.y + 0.14, m.scale.z + 0.14);
          sh.position.copy(m.position);
          sh.rotation.copy(m.rotation);
          sh.castShadow = false;
          sh.receiveShadow = false;
          sh.userData.truck = t;
          cargo.add(sh);
        }
        i += n;
      }

      // Phan dang gom noi tiep SAU khoi cuoi, tuc sat mieng hon ca no, va dai dan ve phia
      // mieng (loopsort.js:1117 dat no o chi so blocks.length).
      if (t.fill > 0 && t.claim) {
        const frac = Math.max(0.05, Math.min(1, t.fill / game.perBlock));
        const c = game.slotPos(t, bl.length, 1 - frac / 2);
        box(cargo, c.x, c.y, SL * frac, TRUCK_W * (game.fit ?? 1) - 0.5, CARGO_H, BODY_H,
            PALETTE[t.claim] || "#888", rotOf(t));
      }
      // Snapshot doan hang con nguyen, de luc giao xong con ve lai duoc.
      lastCargo.set(t, t.blocks.map((b) => ({ ...b })));
    }
    // ⚠ Chup scale/vi tri GOC cua moi manh hang. animateCargo nhan tu day moi khung chu khong
    // nhan don len nhau, va buildCargo chay lai thi moc duoc lam moi.
    for (const m of cargo.children) {
      m.userData.basePos = m.position.clone();
      m.userData.baseScale = m.scale.clone();
    }
  }

  // Chu ky cua hang: chi dung lai canh khi thu nay doi, chu khong phai moi khung.
  // ⚠ Xe da giao xong ma con dang rut hang phai la mot chu ky KHAC luc rut xong, de buildCargo
  // biet thoi diem doi sang nap + dau tick. No chi doi MOT lan, khong doi theo tung khung.
  function cargoSig(game) {
    let s = "";
    for (const t of game.trucks) {
      if (t.gone) {
        const phase=reducedMotion.matches||t.drain<0?"x"
          :game.now<(t.arriveAt??t.drain)?"f"
          :game.now<lidStart(t)?"s"
          :game.now<lidEnd(t)?"d":"x";
        s += phase;
      } else {
        // ⚠ Ky hieu phai doi khi mot khoi ha canh (b.flying: true -> false), neu khong chu ky
        // khong doi, buildCargo khong chay lai, va khoi vua den khong bao gio duoc ve ra.
        s += t.blocks.map((b) => (b.flying ? "~" : b.hidden && !b.seen ? "?" : b.color)).join("");
      }
      s += "|" + (t.claim || "") + Math.round(t.fill) + ";";
    }
    return s;
  }

  // ---------------------------------------------------------------- hieu ung
  // Vong sang khi cham + confetti khi giao hang. Ca hai la hieu ung THEM, khong nam trong state
  // cua game: engine chi phat moc thoi gian, con vi tri confetti do chinh engine cap nhat moi
  // khung. Nen chung phai ve lai moi khung, khong the di qua buildCargo.
  const rippleGeo = keep(new THREE.RingGeometry(0.72, 1.0, 40));
  const ripplePool = [];
  const paperGeo = keep(new THREE.PlaneGeometry(0.36, 0.14));
  const confettiPool = [];
  const fxMat = () => keep(new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide }));

  function rippleMesh() {
    const m = new THREE.Mesh(rippleGeo, fxMat());
    m.rotation.x = -Math.PI / 2;
    fx.add(m);
    return m;
  }
  function paperMesh() {
    const m = new THREE.Mesh(paperGeo, fxMat());
    fx.add(m);
    return m;
  }

  function animateFx(game) {
    const now = game.now;
    const still = reducedMotion.matches;

    // ⚠ TAT vong song sau cu cham, theo lenh chu du an: "khi click vao vali truoc thi vali sau
    // khong can animation co song tren than no dau".
    //
    // Va ho dung: `li` duoi day la `t.blocks.length - 1`, tuc khoi CON LAI o mieng khay sau khi
    // tap() da lay di may khoi vua do. Nen cai vong song khong bao gio no tren miếng vua bi cham
    // - no luon no tren than mieng DUNG SAU, la mieng dang dung yen va khong lam gi ca. Day la
    // lan thu hai chu du an chi vao cung mot luat: "vali con lai neu khong phai vali cham hoi va
    // khong di ra ray thi khong can animation gi them". Lan truoc la cu nhun khi xe nuot hang.
    //
    // Khong mat phan hoi cham nao: vali duoc cham la roi cho ngay lap tuc (CRUMBLE_MS = 0), va
    // cham vao xe dang bi khoa thi than xe da toi di san (xem animateLocked).
    // Giu nguyen ca khoi ve, bat lai bang cach doi RIPPLE_ON thanh true.
    const RIPPLE_ON = false;
    const ripples = (still || !RIPPLE_ON) ? [] : game.trucks.filter(
      (t) => t.ripple >= 0 && (now - t.ripple) >= 0 && (now - t.ripple) < RIPPLE_MS);
    while (ripplePool.length < ripples.length) ripplePool.push(rippleMesh());
    for (let i = 0; i < ripplePool.length; i++) {
      const m = ripplePool[i];
      if (i >= ripples.length) { m.visible = false; continue; }
      const t = ripples[i];
      const k = (now - t.ripple) / RIPPLE_MS;
      const li = t.blocks.length ? t.blocks.length - 1 : t.cap - 1;
      const c = game.slotPos(t, li, 0.5);
      m.visible = true;
      m.position.set(c.x, BODY_H + CARGO_H + 0.09, c.y);
      const s = 0.25 + k * 0.9;
      m.scale.set(s, s, s);
      m.material.opacity = (1 - k) * 0.55;
    }

    // Confetti: engine da tinh x,y moi khung, chi dat vao dung cho va mo dan theo p.life.
    const papers = still ? [] : game.trucks.flatMap((t) => t.confetti);
    while (confettiPool.length < papers.length) confettiPool.push(paperMesh());
    for (let i = 0; i < confettiPool.length; i++) {
      const m = confettiPool[i];
      if (i >= papers.length) { m.visible = false; continue; }
      const p = papers[i];
      m.visible = true;
      m.position.set(p.x, BODY_H + CARGO_H + 0.35, p.y);
      m.rotation.set(-Math.PI / 2, 0, p.rot);
      m.material.color.set(p.col);
      m.material.opacity = Math.max(0, 1 - p.life / 1.3);
    }
  }

  // ⚠ Hai thu buildCargo KHONG the lam vi no chi chay khi chu ky hang doi: hang rut dan khi
  // giao, va cu nhun khi xe nuot duoc hang. Ca hai deu cap nhat theo tung khung o day.
  function animateCargo(game) {
    const now = game.now;
    if (reducedMotion.matches) return;
    for (const t of game.trucks) {
      if (t.gone && t.drain >= 0) {
        const k = Math.max(0, Math.min(1, (now - lidStart(t)) / LID_CLOSE_MS));
        const eased = k * k * (3 - 2 * k);
        const lift = LID_LIFT * (1 - eased);
        for (const m of cargo.children) {
          if (m.userData.closeTruck === t)
            m.position.y = m.userData.closeBaseY - lift;
        }
      }
      if (t.gone && t.drain >= 0) {
        // Once the last flight has ended, let that piece settle in its real slot. The
        // luggage stays full-size until the lid covers it; shrinking it from drain time
        // made the completion happen before the visible arrival.
        if(Number.isFinite(t.arriveAt)&&now>=t.arriveAt&&now<lidStart(t)){
          const k=Math.max(0,Math.min(1,(now-t.arriveAt)/ATE_MS));
          const s=1+.07*Math.sin(k*Math.PI);
          for(const m of cargo.children){
            if(m.userData.drainTruck!==t||m.userData.slot!==DELIVER-1)continue;
            const b=m.userData.basePos,bs=m.userData.baseScale;
            if(!b||!bs)continue;
            m.position.copy(b);m.scale.set(bs.x*s,bs.y*s,bs.z*s);
          }
        }
      } else if (t.ate > 0) {
        // ⚠ CHI vali vua nhap o moi nhun, khong phai ca khoang hang. Truoc day vong nay quet
        // moi mesh cua xe, nen mot vali nhap o lam CA nhung vali dang dung yen phong to theo -
        // chu du an bao dung y: "vali con lai neu khong phai vali cham hoi va khong di ra ray
        // thi khong can animation gi them". Vali dung yen thi phai dung yen that.
        // ⚠ 1.06 la nguong "nhun nhe": hang chuc lan nuot moi man, lam to la met mat.
        const kk = Math.min(1, Math.max(0, (now - t.ate) / ATE_MS));
        const s = 1 + 0.06 * Math.sin(kk * Math.PI);
        const last = t.blocks.length - 1;
        for (const m of cargo.children) {
          if (m.userData.truck !== t || m.userData.drainTruck) continue;
          if (m.userData.slot !== last) continue;
          const b = m.userData.basePos, bs = m.userData.baseScale;
          if (!b || !bs) continue;
          // Nhun tai cho: tam phong to la tam CUA CHINH no, khong phai tam khoang hang - lay
          // tam khoang hang thi vali con bi day truot sang ngang mot chut moi lan nuot.
          m.position.set(b.x, b.y, b.z);
          m.scale.set(bs.x * s, bs.y * s, bs.z * s);
        }
      }
    }
  }

  function animateBridges(game) {
    const now=game.now;
    for(const group of statics.children){
      const t=group.userData.bridgeTruck;
      if(!t)continue;
      if(!t.gone){group.visible=true;group.scale.x=1;continue;}
      const k=reducedMotion.matches ? 1 : Math.max(0,Math.min(1,
        (now-lidEnd(t))/BRIDGE_RETRACT_MS));
      const eased=k*k*(3-2*k);
      // Local X runs from the rail (0) back to the tray (-reach), so this folds the
      // connector into its rail collar instead of shrinking around its centre.
      group.scale.x=Math.max(.015,1-eased);
      group.visible=k<.995;
    }
  }

  // Vali khong cham duoc thi phai NHIN RA la khong cham duoc - luat 3.5 cua UI_UX_RULES:
  // khong dung duoc thi mo di, dung de bam roi moi bao loi. `game.canTap(t)` la CHINH cai
  // dieu kien ma `tap()` dung, khong phai mot ban chep - nen than xe khong bao gio noi khac
  // engine. Chi lam toi THAN XE, khong dung toi mau hang: nguoi choi van phai doc duoc mau
  // de tinh nuoc di, ke ca khi luc nay chua do duoc.
  const dimCache = new Map();
  function dimOf(material) {
    if (!dimCache.has(material)) {
      const d = material.clone();
      // ⚠ 0.2 chu khong phai 0.5, va day khong phai chuyen thich hay khong thich. multiplyScalar
      // nhan trong khong gian TUYEN TINH, con man hinh hien ra o sRGB - xap xi can bac hai. Dat
      // 0.45 thi ra man hinh con ~67% do sang: do duoc chi lam mot hang xe toi di 5/78 diem, tuc
      // gan nhu khong thay gi. Muon nhin ra ~45% thi he so tuyen tinh phai la 0.45^2 ~ 0.2.
      d.color.multiplyScalar(0.2);
      dimCache.set(material, keep(d));
    }
    return dimCache.get(material);
  }
  function animateLocked(game) {
    for (const m of statics.children) {
      const t = m.userData.truck;
      if (!t) continue;
      if (!m.userData.litMat) m.userData.litMat = m.material;
      // ⚠ `gone` va `drain` KHONG phai trang thai khoa. canTap() tra false cho ca hai, nhung
      // xe da giao xong thi la xong chu khong phai bi cam, con xe dang rut hang chi false
      // trong DRAIN_MS - lam toi roi sang lai trong mot phan giay chi ra cai nhap nhay.
      const locked = !t.gone && t.blocks.length > 0 && t.drain < 0 &&
                     game.state === "play" && !game.canTap(t);
      m.material = locked ? dimOf(m.userData.litMat) : m.userData.litMat;
    }
  }

  // ---------------------------------------------------------------- cube tren ray
  // ⚠ Pool: so cube doi tung khung. Tao/huy mesh moi khung la roi khung hinh, nen giu mot
  // ho va chi bat/tat .visible.
  const pool = [];
  function drawCubes(game) {
    const list = [...game.cubes, ...game.flying.map(f => {
      const k=Math.max(0,Math.min(1,(game.now-f.at)/f.ms));
      // ⚠ Do cong lay tu engine (flyEase), KHONG viet lai o day: no phu thuoc f.s ma engine
      // tinh sao cho van toc luc vali roi ray dung bang toc do bang chuyen. Ease-out cu
      // 1-(1-k)^2 xuat phat bang 2 lan toc do trung binh nen giat mot cai ngay luc roi ray.
      const q=flyPos(f,k);
      // ⚠ KHONG nhay. Cu cao theo hinh sin cu (0.4 + sin(k*pi)*0.9) lam vali BOC len 0.4 ngay
      // lap tuc luc roi ray, vong len cao 1.3 roi ha xuong - va ca hai dau deu khong khop voi
      // cao do that: tren ray vali nam o RAIL_Y, trong khay hang nam o BODY_H. Nen no giat mot
      // cai luc roi ray, nhay mot vong, roi giat mot cai nua luc dat vao o.
      // Gio no chi DANG DAN tu cao do ray len cao do khay, dung bang chenh lech giua hai cai -
      // vali truot vao qua mieng khay (mieng la canh duy nhat khong co thanh chan) chu khong
      // bay qua dau thanh chan. Chu du an: "bo cai phan vali di tu ray vao khay ma nhay vao di,
      // cu di tu tu binh thuong vao roi den dung vi tri".
      return {x:q.x,y:q.y,color:f.color,sz:1,rot:q.rot,height:(BODY_H-RAIL_Y)*k};
    })];
    while (pool.length < list.length) {
      const m = new THREE.Mesh(boxGeo, mat("#888"));
      m.castShadow = true;
      cubes.add(m);
      pool.push(m);
    }
    for (let i = 0; i < pool.length; i++) {
      const m = pool[i];
      if (i >= list.length) { m.visible = false; continue; }
      const c = list[i];
      const d = game.r * 2 * (c.sz === undefined ? 1 : c.sz);
      m.visible = true;
      m.material = mat(PALETTE[c.color] || "#888");
      m.scale.set(d, CARGO_H, d);
      m.position.set(c.x, RAIL_Y+CARGO_H/2+(c.height||0), c.y);
      m.rotation.y = c.rot || 0;
    }
  }

  // ---------------------------------------------------------------- vong lap
  let lastGame = null, lastSig = "", raf = 0, w = 0, h = 0;

  function resize() {
    const r = frameEl.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return;
    w = r.width; h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (lastGame) {
      placeCamera(lastGame.bounds);
      fitCamera(lastGame);
      applyBackdrop(lastGame);
    }
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    // ⚠ getGame() tra ve null khi chua vao level. Phai chiu duoc, khong duoc nem.
    const game = getGameFn();
    if (!game) { resize(); renderer.render(scene, camera); return; }

    if (game !== lastGame) {
      lastGame = game;
      buildStatics(game);
      // ⚠ Goi SAU buildStatics: buildStatics() bat dau bang clear(statics), nen dat do trang
      // tri truoc no thi chung bi quet sach ngay trong cung mot khung hinh - va hong im lang,
      // nhin ra y het nhu chua bao gio bat.
      buildDeco(game);
      applyBackdrop(game);
      lastSig = "";
      w = h = 0;                     // ep tinh lai camera cho ban co moi
      resize();
      placeCamera(game.bounds);
      fitCamera(game);
    }
    resize();

    const sig = cargoSig(game);
    if (sig !== lastSig) { lastSig = sig; buildCargo(game); }
    animateCargo(game);
    animateBridges(game);
    animateFx(game);
    animateLocked(game);

    updateProgress(game);
    drawCubes(game);
    // Follow arc length so the sparse moving chevrons glide smoothly through rounded corners.
    const ring = game.ring;
    for (let i=0;i<tread.children.length;i++) {
      let s=(i*game.len/tread.children.length+(reducedMotion.matches?0:game.now*0.009))%game.len;
      for (let j=0;j<ring.length-(game.closed?0:1);j++) {
        const a=ring[j], b=ring[(j+1)%ring.length], d=Math.hypot(b.x-a.x,b.y-a.y);
        if (s<=d) {
          const m=tread.children[i], f=s/(d||1);
          m.position.x=a.x+(b.x-a.x)*f; m.position.z=a.y+(b.y-a.y)*f;
          m.rotation.y=-Math.atan2(b.y-a.y,b.x-a.x); break;
        }
        s-=d;
      }
    }
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  // ⚠ Duoi camera phoi canh, pick() cua ban 2D VO DUNG: no nghich dao mot phep bien doi
  // affine, con o day mot diem man hinh ung voi mot TIA. Phai ban tia that, va phai ban vao
  // ca than xe lan khoi hang — nguoi choi nham vao dong hang chu khong vao cai gam xe.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function pick(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    // cargo truoc statics: hang nam TREN than xe nen tia cham no truoc, va sap theo khoang
    // cach thi thu tu nay chi la goi y — intersectObjects da tra ve theo do sau.
    const hits = ray.intersectObjects([...cargo.children, ...statics.children], false);
    for (const h of hits) {
      const t = h.object.userData && h.object.userData.truck;
      if (t) return t;
    }
    return null;
  }

  // Chieu mot diem THE GIOI cua game ra toa do man hinh (client px). Chi dung de tu kiem:
  // co no thi kiem duoc "chieu ra roi ban tia nguoc lai co ve dung xe khong" bang may, thay
  // vi bam tay roi doan.
  function project(wx, wy, wh) {
    const r = canvas.getBoundingClientRect();
    const v = new THREE.Vector3(wx, wh === undefined ? BODY_H + CARGO_H / 2 : wh, wy);
    v.project(camera);
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
  }

  return {
    pick,
    project,
    dispose() {
      cancelAnimationFrame(raf);
      clear(statics); clear(cargo); clear(cubes); clear(fx);
      for (const o of scrap) if (o.dispose) o.dispose();
      renderer.dispose();
      backgroundTexture.dispose();
      canvas.remove();
    },
  };
}
