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
import {
  DELIVER, flyPos, SCALE, WIDE, PALETTE,
  MINIS_PER_BELT_CANDY, MINI_CANDIES_PER_BOX,
} from "./loopsort.js";
import { paintFactoryBackdrop } from "./factory-art.js";

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
const TRUCK_W = 2.65;

// Cao do vali khi nam tren ray. Hang trong khay nam cao hon, o BODY_H - chenh lech giua hai
// so nay chinh la quang duong vali phai len khi no vao khay.
const RAIL_Y = 0.38;
const BODY_H = 0.74;    // raised tray deck; enough side face remains visible under cargo
const CARGO_H = 0.50;   // chunkier candy/box silhouettes at phone size
const BELT_CANDY_VISUAL_SCALE = 1.28; // visual only; boxed candy remains smaller
const MINI_GRID = 4;
const MINI_LAYER_SIZE = MINI_GRID * MINI_GRID;
if (MINI_CANDIES_PER_BOX !== MINI_GRID ** 3)
  throw new Error("Packed candy grid must remain 4 x 4 x 4");

// DRAIN_MS follows the engine cadence; ATE_MS is renderer timing. Both affect only
// presentation and never the packing rules.
const DRAIN_MS = 830;  // hang rut khoi xe khi giao xong
const ATE_MS = 180;    // cua so "nhun nhe" khi xe vua nuot duoc mot mieng hang
// Fallback for old/synthetic states without an exact visual-arrival timestamp.
const LID_DELAY_MS = 910;
const LID_CLOSE_MS = 520;
const LID_LIFT = 1.15;
const LID_SETTLE_MS = ATE_MS + 340;
const BOX_SEAL_MS = 460;
const STACK_HOLD_MS = 380;
const SOURCE_LID_OPEN_MS = 300;
const SOURCE_PULSE_MS = 380;
const lidStart = (t) => Number.isFinite(t.arriveAt)
  ? t.arriveAt + LID_SETTLE_MS
  : t.drain + LID_DELAY_MS;
const lidEnd = (t) => lidStart(t) + LID_CLOSE_MS;

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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  // ⚠ PCFSoftShadowMap da bi go khoi three 0.186 (no canh bao roi tu lui ve PCF). Goi
  // thang PCFShadowMap de khong co dong canh bao trong console moi lan chay.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  // One quiet factory floor, painted to the viewport rather than stretching an airport
  // photo. Actual factory equipment, cartons and candy are lit 3D meshes.
  const backdrop = document.createElement("canvas");
  function applyBackdrop() {
    paintFactoryBackdrop(backdrop, frameEl.clientWidth, frameEl.clientHeight);
    // The WebGL canvas is transparent and the same generated room sits behind the
    // whole page. This removes the visible portrait seam that a scene-only texture
    // created on desktop while keeping every 3D shadow/object in one canvas above it.
    document.body.style.backgroundImage = `url(${backdrop.toDataURL("image/webp",.92)})`;
    document.body.style.backgroundSize = "100% 100%";
    document.body.style.backgroundRepeat = "no-repeat";
    scene.background = null;
    document.body.classList.remove("has-side-scene");
    document.body.style.removeProperty("--ls-side-image");
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
  // ⚠ fov 20 va goc nhin nghieng (xem placeCamera), theo lua chon cua chu du an 2026-09-17 sau khi
  // so sau bien the tren cung level 5 va 30. Muc dich la thay
  // duoc THAN hop keo, ma o 64 do fov 7 gan nhu chi thay mat tren. Near = 10 van dung: o fov 20
  // camera van cach ban co vai chuc don vi.
  // `?fov=` de so thu tren may dev.
  const qFov = typeof location !== "undefined" && +new URLSearchParams(location.search).get("fov");
  const camera = new THREE.PerspectiveCamera(qFov || 20, 1, 4, 4000);

  // Keep enough fill for the bright candy palette, then let one warm key light establish
  // the bevels and cast shadows. The previous broad fill lit every face almost equally,
  // which made real 3D geometry read like flat coloured cards on a phone.
  scene.add(new THREE.AmbientLight(0xffffff, 0.58));
  scene.add(new THREE.HemisphereLight(0xfff8dc, 0x348c83, 0.46));
  const sun = new THREE.DirectionalLight(0xfff3dc, 1.34);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias=-0.0003;
  sun.shadow.normalBias=0.035;
  sun.shadow.radius=2;
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
  const boxGeo = keep(new RoundedBoxGeometry(1, 1, 1, 4, 0.18));
  const candyGeo = keep(new RoundedBoxGeometry(1, 1, 1, 4, 0.23));

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
      const o = { color: col(hex), roughness: 0.28, metalness: 0,
        clearcoat: 0.62, clearcoatRoughness: 0.22 };
      if (glow) { o.emissive = col(hex); o.emissiveIntensity = 0.3; }
      matCache.set(key, keep(new THREE.MeshPhysicalMaterial(o)));
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
    group.traverse(c=>{
      if(c.geometry && !scrap.includes(c.geometry)) c.geometry.dispose();
    });
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

  // ---------------------------------------------------------------- camera
  function placeCamera(b) {
    const cx = (b.x0 + b.x1) / 2, cz = (b.y0 + b.y1) / 2;
    const H = Math.max(b.x1 - b.x0, b.y1 - b.y0);

    // The reference reads almost top-down: objects keep their size and shape across the
    // board, while their thick front faces still remain visible. A roughly 64° elevation
    // gives that clarity without flattening the real geometry into a 2D drawing.
    // Goc nhin so voi mat ban. 40 do (2026-09-17 sang) duoc chon de thay than hop, roi chu du an
    // choi thu va bao "bi nghieng qua, cho len chut nua" - thu 48, roi chot 54 sau khi xem ba
    // muc 40/48/54 tren level 30. Khoang cach o day chi la diem xuat phat, fitCamera se keo lai
    // cho vua khung. `?elev=` de so thu tren may dev.
    const ELEV = (portrait() ? MOBILE_ELEV : DESK_ELEV) * Math.PI / 180, D = H * 1.25;
    camera.position.set(cx, D * Math.sin(ELEV), cz + D * Math.cos(ELEV));
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
  // ⚠ MOBILE va DESKTOP khop khac nhau (chu du an 2026-09-17: "lam sao de toi uu duoc nhin duong
  // ray duoc rong nhat co the, sat nhat co the so voi 2 bien" va "toi uu view cho mobile va
  // desktop rieng").
  //   - Man hinh DOC (mobile): be ngang ban co la cai chan tren moi level (ban co rong/cao ~0.75,
  //     man hinh can ~0.45). Mep ngoai ray khop SAT hai canh (1.00) - khong con le, khong cat.
  //   - Man hinh NGANG (desktop): chieu cao la cai chan. Camera nghieng thap hon mot chut
  //     (DESK_ELEV) de chieu sau ban co bi nen lai, nen ban co ve to hon trong cung chieu cao.
  // `?ringfit=` / `?elev=` / `?delev=` de so thu tren may dev.
  const qp = (k) => typeof location !== "undefined" && +new URLSearchParams(location.search).get(k);
  const RING_FIT = qp("ringfit") || 1.00;
  const MOBILE_ELEV = qp("elev") || 54, DESK_ELEV = qp("delev") || 42;
  const portrait = () => h >= w;
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
          for (const y of [0, BODY_H + 1.15])
            truckPts.push(new THREE.Vector3(end.x - t.my * sgn * w, y, end.y + t.mx * sgn * w));
    }
    const playing=!document.getElementById("chrome").classList.contains("hide");
    const top=playing?document.getElementById("topbar").offsetHeight+12:0;
    const bottom=playing?document.getElementById("tools").offsetHeight+18:0;
    const upper=Math.max(.2,1-2*top/h), lower=Math.max(.2,1-2*bottom/h);
    const focus = new THREE.Vector3(cx, 0, cz);
    for (let i = 0; i < 120; i++) {
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      let worst = 0, ylo = 1e9, yhi = -1e9;
      for (const p of ringPts.concat(truckPts)) {
        const v = p.clone().project(camera);
        ylo = Math.min(ylo, v.y); yhi = Math.max(yhi, v.y);
      }
      for (const p of ringPts) {
        const v = p.clone().project(camera);
        // RING_FIT: xem tren. Chieu doc thi dich 1.00, tuc ray duoc cham day dai an toan
        // nhung khong bao gio chui qua no.
        worst = Math.max(worst, Math.abs(v.x) / RING_FIT, (v.y / upper) / 1.00, (-v.y / lower) / 1.00);
      }
      for (const p of truckPts) {
        const v = p.clone().project(camera);
        worst = Math.max(worst, Math.abs(v.x) / 0.99, (v.y / upper) / 1.00, (-v.y / lower) / 1.00);
      }
      // ⚠ Chi duoc dung o PHIA AN TOAN. Truoc day dieu kien la |worst - 1| < 0.01, tuc worst =
      // 1.008 cung duoc coi la xong - va 0.8% do la ray bi cat that: do duoc 10px o level 100.
      // Khi ngoai mep ban co la mang mau phang thi khong ai thay; tu khi la anh san nha ga co
      // hoa van thi thay ngay. Nen: qua 1 la luon phai lui them, chi duoc dung trong dai
      // [0.97, 1.00].
      // ⚠ CAN GIUA theo chieu doc trong dai an toan truoc khi khop co. Camera nhin vao TAM MAT
      // SAN, nen o goc nhin nghieng, noc cac khay bi day len phia HUD: phan tren cham tran truoc,
      // phan duoi con trong, va ban co nho di vo ich. Dich ca camera lan diem nhin doc truc z cho
      // noi dung nam giua dai [ -lower, upper ].
      const want = (upper - lower) / 2, have = (ylo + yhi) / 2;
      const y0 = focus.clone().project(camera).y;
      const y1 = focus.clone().add(new THREE.Vector3(0, 0, -1)).project(camera).y;
      if (Math.abs(have - want) > 0.004 && Math.abs(y1 - y0) > 1e-6) {
        const m = (want - have) / (y1 - y0);
        focus.z += m; camera.position.z += m; camera.lookAt(focus);
        continue;
      }
      // Dung khi rang buoc chat nhat nam trong [0.99, 1.00]: ray/khay sat bien toi 1%.
      if (worst <= 1 && worst > 0.99) break;
      const off = camera.position.clone().sub(focus);
      off.multiplyScalar(Math.max(0.6, Math.min(1.6, worst / 0.995)));
      camera.position.copy(focus).add(off);
      camera.lookAt(focus);
    }
  }

  // ---------------------------------------------------------------- dung canh tinh
  function buildStatics(game) {
    clear(statics); clear(tread);
    const count=Math.max(3,Math.floor(game.len/2.5));
    for(let i=0;i<count;i++){
      const group=new THREE.Group();group.position.y=.397;
      const seam=new THREE.Mesh(boxGeo,mat("#8a68cf"));
      seam.scale.set(.065,.02,1.82);seam.position.y=.012;group.add(seam);
      if(i%4===0){
        const face=new THREE.Mesh(beltArrowGeo,beltArrowMat);
        face.rotation.x=-Math.PI/2;face.position.y=.034;face.scale.set(.8,.8,.8);group.add(face);
      }
      tread.add(group);
    }
    // One invisible receiver is enough to anchor the playable objects to the room.
    // The old three-layer rounded board duplicated the belt silhouette and formed a
    // large decorative ring around the whole puzzle.
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(250,250),
      keep(new THREE.ShadowMaterial({color:0x294f59,opacity:.24})));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=-.03;shadow.receiveShadow=true;
    statics.add(shadow);
    if(game.ring?.length>1){
      const path=beltFrame(game);
      // Three readable parts only: dark support, mint casing and moving purple belt.
      // The previous ten concentric strips competed with candies and looked like a
      // second ornamental loop around the board.
      beltSolid(path,2.88,.03,.18,"#176f78");
      beltSolid(path,2.64,.16,.16,"#36bba8");
      beltSolid(path,2.36,.28,.10,"#38256d");
      beltStrip(path,2.18,.397,"#6849ad");
      for(const side of [-1,1]){
        beltTube(path,side*1.25,.065,.405,"#d6fff0");
      }
    }
    if(!game.closed){
      const R=game.ring,n=R.length;
      for(const [pe,p1] of [[R[0],R[1]],[R[n-1],R[n-2]]]){
        const ang=Math.atan2(p1.y-pe.y,p1.x-pe.x),q={x:pe.x+Math.cos(ang)*.4,y:pe.y+Math.sin(ang)*.4};
        box(statics,q.x,q.y,.9,BELT_W+.04,1.22,.02,"#ff93a6",-ang,true);
        box(statics,q.x-Math.cos(ang)*.18,q.y-Math.sin(ang)*.18,.6,BELT_W-.4,.86,.18,"#534361",-ang);
        box(statics,q.x+Math.cos(ang)*.4,q.y+Math.sin(ang)*.4,.18,BELT_W,.18,1.25,"#fff2d7",-ang,true);
      }
    }
    for(const t of game.trucks){
      const SL=slotLen(game,t),len=t.cap*SL,TW=TRUCK_W*(game.fit??1);
      const c=game.slotPos(t,(t.cap-1)/2,.5),rotation=rotOf(t);
      const tag=(m,packed=false)=>{m.userData.truck=t;m.userData.tintWhenPacked=packed;return m;};
      tag(trayBox(statics,c.x,c.y,len+.56,TW+.34,.22,.03,"#b93468",rotation,true,.13),true);
      tag(trayBox(statics,c.x,c.y,len+.46,TW+.24,.50,.20,"#ff6f98",rotation,true,.18),true);
      tag(trayBox(statics,c.x,c.y,len+.28,TW+.04,.14,.67,"#fff0bd",rotation,true,.06));
      // Open paper cavities, with real depth and no fake colored contents.
      for(let i=0;i<t.cap;i++){
        const p=game.slotPos(t,i,.5);
        tag(trayBox(statics,p.x,p.y,SL-.12,TW-.20,.055,.755,"#d39b7b",rotation,true,.025));
        tag(trayBox(statics,p.x,p.y,SL-.20,TW-.30,.040,.805,"#fff1c5",rotation,true,.018));
      }
      // Low rounded lips keep the silhouette a shallow confectionery tray.
      for(const side of [-1,1]){
        const x=c.x-t.my*side*(TW/2-.025),z=c.y+t.mx*side*(TW/2-.025);
        tag(trayBox(statics,x,z,len+.27,.14,.18,.69,"#fff8df",rotation,true,.058));
      }
      const back={x:c.x-t.mx*len/2,z:c.y-t.my*len/2};
      tag(trayBox(statics,back.x,back.z,.15,TW+.02,.18,.69,"#fff8df",rotation,true,.06));
      const reach=Math.hypot(t.px-t.x,t.py-t.y);
      if(reach>.4){
        const group=new THREE.Group();
        group.position.set(t.px,0,t.py);
        group.rotation.y=-Math.atan2(t.py-t.y,t.px-t.x);
        group.userData.bridgeTruck=t;
        const deck=box(group,-reach/2,0,reach+.10,1.35,.13,.43,"#fff1d5",0,true);
        deck.userData.truck=t;
        for(const side of [-1,1]){
          const rail=box(group,-reach/2,side*.69,reach+.08,.17,.22,.45,"#4bd1b3",0,true);
          rail.userData.truck=t;
        }
        for(const u of [.27,.55,.8]){
          const roller=box(group,-reach*u,0,.12,1.16,.035,.575,"#eac6a5",0,true);
          roller.userData.truck=t;
        }
        const cap=box(group,-.13,0,.40,1.62,.18,.34,"#ff93a6",0,true);
        cap.userData.truck=t;
        statics.add(group);
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

  function addCargoMark(group,x,z,y,material,t,draining=false,slot){
    const mark=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.18),material);
    mark.rotation.x=-Math.PI/2;mark.position.set(x,y,z);
    mark.userData.truck=t;
    if(Number.isInteger(slot))mark.userData.slot=slot;
    if(draining)mark.userData.drainTruck=t;
    group.add(mark);
  }

  const candyMats=new Map();
  function candyMat(hex){
    if(!candyMats.has(hex))candyMats.set(hex,keep(new THREE.MeshPhysicalMaterial({
      color:hex,emissive:hex,emissiveIntensity:.18,roughness:.20,
      metalness:0,clearcoat:.92,clearcoatRoughness:.16
    })));
    return candyMats.get(hex);
  }
  function candy(group,x,z,size,bottom,hex,rotation=0,height=CARGO_H*.70){
    const m=new THREE.Mesh(candyGeo,candyMat(hex));
    m.position.set(x,bottom+height/2,z);m.scale.set(size,height,size);
    m.rotation.y=rotation;m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
  }
  function candyPosition(game,t,slot,piece){
    if(game.candyPos)return game.candyPos(t,slot,piece);
    const c=game.slotPos(t,slot,.5),sl=slotLen(game,t);
    const u=(piece%4-1.5)*sl*.20,v=(Math.floor(piece/4)-.5)*sl*.36;
    return {x:c.x+t.mx*u-t.my*v,y:c.y+t.my*u+t.mx*v};
  }
  function miniCandyPosition(game,t,slot,index){
    const c=game.slotPos(t,slot,.5),sl=slotLen(game,t);
    const layer=Math.floor(index/MINI_LAYER_SIZE),cell=index%MINI_LAYER_SIZE;
    // Keo trong hop LAP GAN KIN long hop (chu du an: "keo o hop cung can to hon"). Luoi 4x4
    // trai 3*pitch+size = 0.93 chieu dai o, 4 tang cao 0.15 o moi tang.
    const col=cell%MINI_GRID,row=Math.floor(cell/MINI_GRID),pitch=sl*.235;
    const u=(col-1.5)*pitch,v=(row-1.5)*pitch;
    const height=sl*.15;
    return {
      x:c.x+t.mx*u-t.my*v,y:c.y+t.my*u+t.mx*v,
      bottom:BODY_H+.2+layer*height*.92,height,size:sl*.222,layer
    };
  }
  // ⚠ Hop NGUON rot tu TANG TREN xuong: vien thu 0 roi di dau tien, nen no phai la vien tren
  // cung - rot tu tang day thi cac tang tren lo lung giua khong trung. Hop DICH van xep tu day len.
  function sourceIndex(game,piece,sub,source){
    return source?(game.perBlock-1-piece)*MINIS_PER_BELT_CANDY+(MINIS_PER_BELT_CANDY-1-sub)
                 :piece*MINIS_PER_BELT_CANDY+sub;
  }
  // Every pocket is one real candy. Flights reserve pockets in the model, but their
  // destination is kept empty until the moving candy actually arrives.
  function makeBox(game,t,slot,color,pieces=null,hidden=false,ghost=false,sealed=true,
                   packedAt=0,sourceOpenAt=null,stackAt=0){
    const SL=slotLen(game,t),p=game.slotPos(t,slot,.5),r=rotOf(t);
    pieces=pieces||Array.from({length:game.perBlock},(_,i)=>i);
    const hex=PALETTE[color]||"#ff79a6";
    const tag=m=>{
      m.userData.truck=t;m.userData.slot=slot;
      if(ghost)m.userData.drainTruck=t;
      if(sourceOpenAt!==null){
        m.userData.sourcePulseAt=sourceOpenAt;
        m.userData.sourcePulseTruck=t;
      }
      if(stackAt)m.userData.stackPackAt=stackAt;
      return m;
    };
    // Preserve a square silhouette on screen for any tray direction. The camera projects
    // world X and Z at different scales, so one hard-coded depth can only look square on
    // horizontal OR vertical trays. Fit the largest projected square inside this slot.
    const fit=game.fit??1;
    const viewDir=new THREE.Vector3();camera.getWorldDirection(viewDir);
    const projected=(x,z)=>Math.sqrt(Math.max(.08,1-Math.pow(x*viewDir.x+z*viewDir.z,2)));
    const alongP=projected(t.mx,t.my),acrossP=projected(-t.my,t.mx);
    const maxLen=SL-.08,maxWid=TRUCK_W*fit-.06;
    // ⚠ Hop PHU GAN KIN O, khong ep thanh hinh vuong tren man hinh nua. Chu du an 2026-09-17:
    // "cho hop keo chiem gan kin khay de tiet kiem dien tich" va "lam hop keo lon nhat co the de
    // user trong duoc ro". Ban cu lay canh NGAN hon giua chieu dai o va be ngang khay (sau khi
    // chieu), nen tren khay dai hop chi chiem mot phan be ngang. `projectedSide` van giu lai vi
    // cac cho khac con doc toi no.
    const projectedSide=Math.min(maxLen*alongP,maxWid*acrossP);
    const closedLen=maxLen,closedWid=maxWid;
    if(hidden){
      tag(trayBox(cargo,p.x,p.y,closedLen+.02,closedWid+.02,.18,BODY_H+.025,"#fff9e9",r,true,.07));
      tag(trayBox(cargo,p.x,p.y,closedLen,closedWid,.72,BODY_H+.16,HIDDEN_FILL,r,true,.16));
      addCargoMark(cargo,p.x,p.y,BODY_H+.92,questionMaterial,t,ghost,slot);
      return;
    }
    if(sealed){
      // A completed carton is opaque and closed, like the bold colour blocks in the
      // reference. The player reads colour and state at a glance; candies are exposed
      // only while this carton is being opened or filled. The camera foreshortens the
      // board's depth, so the direction-aware footprint above preserves the square.
      const body=tag(trayBox(cargo,p.x,p.y,closedLen,closedWid,.72,BODY_H+.05,hex,r,true,.16));
      const lid=tag(trayBox(cargo,p.x,p.y,closedLen+.05,closedWid+.05,.18,BODY_H+.77,hex,r,true,.12));
      // Keep the closed face as one uninterrupted colour plane. A cream ribbon used
      // to break into two white patches under this camera and made the carton read as
      // two slots instead of one finished box.
      body.userData.boxSealAt=packedAt||0;
      body.userData.boxSealBaseY=body.position.y;
      body.userData.boxSealRole="body";
      body.userData.boxSealHeight=.72;
      lid.userData.boxSealAt=packedAt||0;
      lid.userData.boxSealBaseY=lid.position.y;
      lid.userData.boxSealRole="lid";
      return;
    }
    // The open carton packs a 4x4x4 stack. Every logical conveyor batch stays visible
    // as eight minis, so the eight gameplay pieces remain 64 candies end to end.
    tag(trayBox(cargo,p.x,p.y,closedLen+.06,closedWid+.06,.18,BODY_H+.025,"#e4ad68",r,true,.08));
    tag(trayBox(cargo,p.x,p.y,closedLen-.10,closedWid-.10,.055,BODY_H+.20,"#fff0bd",r,true,.025));
    const wallH=.30,wallBase=BODY_H+.17;
    for(const side of [-1,1]){
      const across=side*(closedWid/2-.055);
      tag(trayBox(cargo,p.x-t.my*across,p.y+t.mx*across,
        closedLen,.11,wallH,wallBase,"#ffd28a",r,true,.045));
      const along=side*(closedLen/2-.055);
      tag(trayBox(cargo,p.x+t.mx*along,p.y+t.my*along,
        .11,closedWid-.16,wallH,wallBase,"#ffd28a",r,true,.045));
    }
    // A selected source carton keeps its real lid for one beat. It pops upward and
    // opens as two paper flaps, leaving the centre clear for the candy stream.
    if(sourceOpenAt!==null){
      const fullWid=closedWid+.05,flapWid=fullWid/2-.035;
      for(const side of [-1,1]){
        const across=side*(flapWid/2+.018);
        const lid=tag(trayBox(cargo,p.x-t.my*across,p.y+t.mx*across,
          closedLen+.05,flapWid,.16,BODY_H+.78,hex,r,true,.10));
        delete lid.userData.sourcePulseAt;
        delete lid.userData.sourcePulseTruck;
        lid.userData.sourceLidAt=sourceOpenAt;
        lid.userData.sourceLidTruck=t;
        lid.userData.sourceLidSide=side;
        lid.userData.sourceLidHalf=flapWid/2;
      }
    }
    const present=new Set(pieces);
    const source=sourceOpenAt!==null;
    for(let piece=0;piece<game.perBlock;piece++){
      if(!present.has(piece))continue;
      const pop=(t.miniPops||[]).find(o=>o.slot===slot&&o.piece===piece);
      for(let sub=0;sub<MINIS_PER_BELT_CANDY;sub++){
        const q=miniCandyPosition(game,t,slot,sourceIndex(game,piece,sub,source));
        const m=tag(candy(cargo,q.x,q.y,q.size,q.bottom,hex,r+(sub%2?-.045:.045),q.height));
        // Keo dang cho den luot trong hop vua mo: nhun nhay tai cho, nhu dang nong long lao ra.
        if(source){m.userData.jiggleAt=sourceOpenAt;m.userData.jiggleSeed=piece*.618+sub*.31;}
        m.userData.candyPiece=piece;
        m.userData.miniCandy=true;
        m.userData.miniIndex=piece*MINIS_PER_BELT_CANDY+sub;
        m.userData.miniLayer=q.layer;
        if(pop)m.userData.miniPopAt=pop.at+sub*22;
      }
    }
  }

  function buildDrainGhost(game,t,sealed=true){
    const snapshot=lastCargo.get(t)||[];
    const color=t.claim||snapshot.find(b=>b?.color)?.color;
    if(!color)return false;
    const pieces=Array.from({length:game.perBlock},(_,i)=>i);
    for(let slot=0;slot<Math.min(DELIVER,t.cap);slot++)makeBox(game,t,slot,color,pieces,false,true,sealed,0);
    return true;
  }

  function buildLid(game,t,closing=false){
    const c=game.slotPos(t,(t.cap-1)/2,.5),r=rotOf(t);
    const len=t.cap*slotLen(game,t)+.42,wid=TRUCK_W*(game.fit??1)+.15;
    const color=t.claim||lastCargo.get(t)?.find(b=>b?.color)?.color;
    const hex=PALETTE[color]||"#fb7bab";
    const lift=closing?LID_LIFT:0;
    const tag=m=>{
      m.userData.truck=t;
      if(closing){m.userData.closeTruck=t;m.userData.closeBaseY=m.position.y;}
      m.userData.exitTruck=t;
      m.userData.exitCenterX=c.x;m.userData.exitCenterZ=c.y;
      return m;
    };
    // A shallow candy gift carton: same footprint as the tray, wrapped with a cream
    // paper belly-band. No luggage wheels, handles, zippers, or tapered ends.
    tag(trayBox(cargo,c.x,c.y,len,wid,.20,BODY_H+.79+lift,hex,r,true,.085));
    tag(trayBox(cargo,c.x,c.y,len-.12,wid-.12,.11,BODY_H+.99+lift,hex,r,true,.05));
    const bandWidth=Math.min(1.7,len*.26);
    tag(trayBox(cargo,c.x,c.y,bandWidth,wid-.08,.038,BODY_H+1.105+lift,"#fff6dd",r,true,.016));
    // Raised wrapped-candy emblem and a clear completion seal.
    tag(box(cargo,c.x,c.y,.58,.47,.105,BODY_H+1.15+lift,hex,r,true));
    for(const side of [-1,1]){
      const x=c.x+t.mx*side*.46,z=c.y+t.my*side*.46;
      const wrapper=tag(box(cargo,x,z,.27,.31,.065,BODY_H+1.16+lift,hex,r+.35*side,true));
    }
    const x=c.x-t.mx*len*.32,z=c.y-t.my*len*.32;
    const seal=new THREE.Mesh(new THREE.CircleGeometry(.37,28),mat("#ffefad",true));
    seal.rotation.x=-Math.PI/2;seal.position.set(x,BODY_H+1.14+lift,z);cargo.add(tag(seal));
    const check=new THREE.Shape();
    check.moveTo(-.20,0);check.lineTo(-.055,-.14);check.lineTo(.25,.18);
    check.lineTo(.15,.27);check.lineTo(-.055,.04);check.lineTo(-.12,.10);check.closePath();
    const tick=new THREE.Mesh(new THREE.ShapeGeometry(check),mat("#248d78",true));
    tick.rotation.x=-Math.PI/2;tick.position.set(x,BODY_H+1.15+lift,z);cargo.add(tag(tick));
  }

  function buildCargo(game){
    clear(cargo);
    for(const t of game.trucks){
      if(t.gone){
        // ⚠ Khay da du 4 hop thi DE NGUYEN hop da dong nap tai cho, khong co hoat anh bien mat
        // (chu du an 2026-09-17: "khi ca khay hoan thanh 4 hop, thi k can animation bien mat").
        const sequencing=!reducedMotion.matches&&t.drain>=0&&game.now<lidEnd(t);
        const showStack=game.now<lidStart(t);
        if(sequencing&&buildDrainGhost(game,t,!showStack)){
          if(game.now>=lidStart(t))buildLid(game,t,true);
        }else buildLid(game,t);
        continue;
      }
      const incoming=game.flying.filter(f=>f.truck===t);
      const waiting=game.pending.filter(p=>p.truck===t);
      const sourceGap=waiting.length?waiting[0].slot:null;
      for(let slot=0;slot<t.blocks.length;slot++){
        const b=t.blocks[slot];
        const moving=new Set(incoming.filter(f=>f.slot===slot).map(f=>f.piece));
        const pieces=Array.from({length:game.perBlock},(_,n)=>n).filter(n=>!moving.has(n));
        const displaySlot=sourceGap!==null&&slot>=sourceGap?slot+1:slot;
        const stacking=b.packedAt&&game.now<b.packedAt+STACK_HOLD_MS;
        makeBox(game,t,displaySlot,b.color,pieces,b.hidden&&!b.seen,false,
          !b.flying&&!stacking,stacking?0:(b.packedAt?b.packedAt+STACK_HOLD_MS:0),
          null,stacking?b.packedAt:0);
      }
      if(t.fill>0&&t.claim){
        const slot=t.blocks.length;
        const moving=new Set(incoming.filter(f=>f.slot===slot).map(f=>f.piece));
        const pieces=Array.from({length:Math.min(game.perBlock,t.fill)},(_,i)=>i).filter(n=>!moving.has(n));
        makeBox(game,t,slot,t.claim,pieces,false,false,false,0);
      }
      // Candy still waiting for its staggered release stays visible in the source box.
      for(const slot of new Set(waiting.map(p=>p.slot))){
        const group=waiting.filter(p=>p.slot===slot);
        makeBox(game,t,slot,group[0].color,group.map((p,i)=>p.piece??i),
          false,false,false,0,group[0].tapAt??group[0].at);
      }
      lastCargo.set(t,t.blocks.map(b=>({...b})));
    }
    for(const m of cargo.children){
      m.userData.basePos=m.position.clone();m.userData.baseScale=m.scale.clone();
      m.userData.baseRotY=m.rotation.y;
    }
  }

  // Chu ky cua hang: chi dung lai canh khi thu nay doi, chu khong phai moi khung.
  // ⚠ Xe da giao xong ma con dang rut hang phai la mot chu ky KHAC luc rut xong, de buildCargo
  // biet thoi diem doi sang nap + dau tick. No chi doi MOT lan, khong doi theo tung khung.
  function cargoSig(game){
    let s="";
    for(const t of game.trucks){
      if(t.gone)s+=t.drain<0?"x":game.now<lidStart(t)?"s":game.now<lidEnd(t)?"c":"o";
      else s+=t.blocks.map(b=>(b.hidden&&!b.seen?"?":b.color)+
        (b.flying?"~":b.packedAt&&game.now<b.packedAt+STACK_HOLD_MS?"^":"")).join("");
      s+="|"+t.cap+":"+(t.claim||"")+":"+t.fill+";";
    }
    // Pending and in-flight counts change when an individual candy leaves or lands.
    s+=game.pending.map(p=>p.truck.lane+":"+p.slot+":"+p.piece).join("/");
    s+=game.flying.map(f=>f.truck.lane+":"+f.slot+":"+f.piece).join("/");
    return s;
  }

  // ---------------------------------------------------------------- hieu ung
  // Vong sang khi cham + confetti khi giao hang. Ca hai la hieu ung THEM, khong nam trong state
  // cua game: engine chi phat moc thoi gian, con vi tri confetti do chinh engine cap nhat moi
  // khung. Nen chung phai ve lai moi khung, khong the di qua buildCargo.
  const sealGeo = keep(new THREE.RingGeometry(.62,.78,32));
  const sealPool = [];
  const tapRingGeo = keep(new THREE.RingGeometry(.90,1.08,32));
  const tapRingPool = [];
  const tapCrumbPool = [];
  const packCrumbPool = [];
  const paperGeo = keep(new THREE.PlaneGeometry(0.36, 0.14));
  const confettiPool = [];
  const fxMat = () => keep(new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, depthWrite: false, depthTest:false,
    side: THREE.DoubleSide }));

  function paperMesh() {
    const m = new THREE.Mesh(paperGeo, fxMat());
    fx.add(m);
    return m;
  }
  function sealMesh(){
    const m=new THREE.Mesh(sealGeo,fxMat());m.rotation.x=-Math.PI/2;m.renderOrder=10;fx.add(m);return m;
  }
  function tapRingMesh(){
    const m=new THREE.Mesh(tapRingGeo,fxMat());m.rotation.x=-Math.PI/2;m.renderOrder=10;fx.add(m);return m;
  }
  function crumbMesh(){
    const m=new THREE.Mesh(boxGeo,fxMat());m.renderOrder=11;fx.add(m);return m;
  }

  function animateFx(game) {
    const now = game.now;
    const still = reducedMotion.matches;

    const seals=still?[]:game.trucks.flatMap(t=>t.blocks.map((b,slot)=>({t,b,slot,
      at:(b.packedAt||0)+STACK_HOLD_MS})))
      .filter(o=>o.b.packedAt&&now-o.at>=0&&now-o.at<BOX_SEAL_MS+180);
    while(sealPool.length<seals.length)sealPool.push(sealMesh());
    for(let i=0;i<sealPool.length;i++){
      const m=sealPool[i],o=seals[i];
      if(!o){m.visible=false;continue;}
      const k=Math.min(1,(now-o.at)/(BOX_SEAL_MS+180)),p=game.slotPos(o.t,o.slot,.5);
      m.visible=true;m.position.set(p.x,BODY_H+CARGO_H+.30,p.y);
      const s=.48+k*1.48;m.scale.set(s,s,s);
      m.material.color.set("#fff0a6");m.material.opacity=(1-k)*.92;
    }

    // A quick cream halo makes the selected carton answer the finger before its lid moves.
    // It stays on the touched slot instead of flashing the whole tray.
    const taps=still?[]:game.trucks.filter(t=>Number.isFinite(t.ripple)&&t.ripple>=0&&
      now-t.ripple>=0&&now-t.ripple<430);
    while(tapRingPool.length<taps.length)tapRingPool.push(tapRingMesh());
    for(let i=0;i<tapRingPool.length;i++){
      const m=tapRingPool[i],t=taps[i];
      if(!t){m.visible=false;continue;}
      const k=Math.min(1,(now-t.ripple)/430);
      const p=game.slotPos(t,Number.isInteger(t.rippleSlot)?t.rippleSlot:Math.max(0,t.blocks.length-1),.5);
      const eased=1-Math.pow(1-k,3),s=.72+eased*.82;
      m.visible=true;m.position.set(p.x,BODY_H+1.03+k*.10,p.y);m.scale.set(s,s,s);
      m.material.color.set("#ff5f91");m.material.opacity=(1-k)*.82;
    }

    // Sugar crumbs turn the click into a small physical burst without adding iconography.
    const tapCrumbs=still?[]:taps.flatMap(t=>Array.from({length:10},(_,n)=>({t,n})));
    while(tapCrumbPool.length<tapCrumbs.length)tapCrumbPool.push(crumbMesh());
    for(let i=0;i<tapCrumbPool.length;i++){
      const m=tapCrumbPool[i],o=tapCrumbs[i];
      if(!o){m.visible=false;continue;}
      const k=Math.min(1,(now-o.t.ripple)/430),e=1-Math.pow(1-k,3);
      const p=game.slotPos(o.t,Number.isInteger(o.t.rippleSlot)?o.t.rippleSlot:
        Math.max(0,o.t.blocks.length-1),.5);
      const a=o.n*2.399+.35,r=.20+e*(.78+(o.n%3)*.12),s=.17*(1-k);
      m.visible=true;m.position.set(p.x+Math.cos(a)*r,
        BODY_H+.94+Math.sin(k*Math.PI)*(.34+(o.n%2)*.10),p.y+Math.sin(a)*r);
      m.scale.set(s,s*.72,s);m.rotation.set(k*3+o.n,0,k*4-o.n);
      m.material.color.set(o.n%3===0?"#fff4b0":"#ff72a0");m.material.opacity=1-k;
    }

    // The packed carton answers with a wider colour burst exactly when its walls rise.
    const packCrumbs=still?[]:seals.flatMap(o=>Array.from({length:14},(_,n)=>({...o,n})));
    while(packCrumbPool.length<packCrumbs.length)packCrumbPool.push(crumbMesh());
    for(let i=0;i<packCrumbPool.length;i++){
      const m=packCrumbPool[i],o=packCrumbs[i];
      if(!o){m.visible=false;continue;}
      const k=Math.min(1,(now-o.at)/(BOX_SEAL_MS+180)),e=1-Math.pow(1-k,3);
      const p=game.slotPos(o.t,o.slot,.5),a=o.n*2.399+.8;
      const r=.24+e*(1.10+(o.n%4)*.11),s=.19*(1-k);
      m.visible=true;m.position.set(p.x+Math.cos(a)*r,
        BODY_H+1.02+Math.sin(k*Math.PI)*(.52+(o.n%3)*.07),p.y+Math.sin(a)*r);
      m.scale.set(s,s*.78,s);m.rotation.set(k*4+o.n,0,-k*5+o.n*.2);
      m.material.color.set(o.n%4===0?"#fff1a5":(PALETTE[o.b.color]||"#ff7b9e"));
      m.material.opacity=1-k;
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
  function animateCargo(game){
    if(reducedMotion.matches)return;
    for(const m of cargo.children){
      const at=m.userData.sourceLidAt;
      if(at===undefined)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/SOURCE_LID_OPEN_MS));
      const eased=1-Math.pow(1-k,3),angle=eased*1.02+Math.sin(k*Math.PI)*.08;
      const base=m.userData.baseScale,pos=m.userData.basePos,t=m.userData.sourceLidTruck;
      // Each half rotates around its outside long edge, opening away from the candy path.
      const half=m.userData.sourceLidHalf||1;
      const side=m.userData.sourceLidSide||1;
      const out=side*half*(1-Math.cos(angle)),lift=half*Math.sin(angle);
      m.position.set(pos.x-t.my*out,pos.y+lift,pos.z+t.mx*out);
      m.rotation.x=side*angle;
      m.rotation.y=m.userData.baseRotY;
      m.rotation.z=0;
      m.scale.set(base.x,base.y,base.z);
      m.visible=true;
    }
    for(const m of cargo.children){
      const at=m.userData.sourcePulseAt;
      if(at===undefined)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/SOURCE_PULSE_MS));
      const press=Math.sin(Math.min(1,k/.42)*Math.PI);
      const release=Math.sin(Math.max(0,(k-.18)/.82)*Math.PI);
      const base=m.userData.baseScale,pos=m.userData.basePos;
      m.position.y=pos.y-press*.045+release*.075;
      m.scale.set(base.x*(1+release*.035),base.y*(1-press*.12+release*.05),base.z*(1+release*.035));
    }
    for(const m of cargo.children){
      const at=m.userData.jiggleAt;
      if(at===undefined)continue;
      // Nhun nhay: bien do lon dan trong 150ms dau, moi vien mot nhip rieng.
      const age=Math.max(0,game.now-at),amp=Math.min(1,age/150),sd=m.userData.jiggleSeed||0;
      const hop=Math.abs(Math.sin(age*.028+sd*6.1))*amp;
      const base=m.userData.baseScale,pos=m.userData.basePos;
      m.position.y=pos.y+hop*.16;
      m.scale.set(base.x*(1+.10*(1-hop)*amp),base.y*(1-.16*(1-hop)*amp+.08*hop),base.z*(1+.10*(1-hop)*amp));
      m.rotation.y=m.userData.baseRotY+Math.sin(age*.021+sd*4.3)*.28*amp;
      m.rotation.z=Math.sin(age*.017+sd*2.9)*.16*amp;
    }
    for(const m of cargo.children){
      const at=m.userData.miniPopAt;
      if(!at)continue;
      if(game.now<at)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/300));
      // Hai nhip nay: nay cao roi nay thap, tat dan - vien keo "rot bich" vao hop.
      const bounce=Math.abs(Math.sin(k*Math.PI*2))*(1-k)*(k<.5?1:.45);
      const squash=Math.sin(Math.min(1,k/.18)*Math.PI)*(1-k);
      const base=m.userData.baseScale,pos=m.userData.basePos;
      // The flight already carried this mini into place. The static mesh only
      // gives a settle bounce; scaling from zero here made landed candies blink out
      // for one frame before reappearing.
      m.scale.set(base.x*(1+.30*squash),base.y*(1-.34*squash+.10*bounce),base.z*(1+.30*squash));
      m.position.y=pos.y+bounce*.30;
      m.rotation.y=m.userData.baseRotY+(m.userData.miniIndex%2?-.22:.22)*bounce;
    }
    for(const m of cargo.children){
      const at=m.userData.stackPackAt;
      if(!at)continue;
      const age=game.now-at,base=m.userData.baseScale,pos=m.userData.basePos;
      if(m.userData.miniCandy){
        const delay=(m.userData.miniLayer||0)*42+(m.userData.miniIndex%16)*5;
        const k=Math.max(0,Math.min(1,(age-delay)/245));
        const wave=Math.sin(k*Math.PI)*(1-k*.35);
        m.position.y=pos.y+wave*.28;
        m.scale.set(base.x*(1+.22*wave),base.y*(1-.24*wave),base.z*(1+.22*wave));
        m.rotation.y=m.userData.baseRotY+(m.userData.miniIndex%2?-.13:.13)*wave;
      }else{
        const k=Math.max(0,Math.min(1,age/STACK_HOLD_MS)),pulse=Math.sin(k*Math.PI);
        m.position.y=pos.y+pulse*.025;
        m.scale.set(base.x*(1+.035*pulse),base.y*(1-.07*pulse),base.z*(1+.035*pulse));
      }
    }
    for(const m of cargo.children){
      const at=m.userData.boxSealAt;
      if(!at)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/BOX_SEAL_MS));
      const base=m.userData.baseScale;
      if(m.userData.boxSealRole==="body"){
        const eased=1-Math.pow(1-k,3),pulse=Math.sin(k*Math.PI);
        const hei=m.userData.boxSealHeight||.72;
        const bottom=m.userData.boxSealBaseY-hei/2;
        m.position.y=bottom+hei*Math.max(.025,eased)/2;
        m.scale.set(base.x*(1+.07*pulse),base.y*Math.max(.025,eased),base.z*(1+.07*pulse));
      }else{
        const lk=Math.max(0,Math.min(1,(k-.16)/.84));
        const c1=1.5,c3=c1+1;
        const eased=1+c3*Math.pow(lk-1,3)+c1*Math.pow(lk-1,2),pulse=Math.sin(lk*Math.PI);
        m.position.y=m.userData.boxSealBaseY+(1-eased)*.72;
        m.rotation.z=(1-eased)*.16;
        m.scale.set(base.x*(1+.08*pulse),base.y*(1-.12*pulse),base.z*(1+.08*pulse));
      }
    }
    for(const t of game.trucks){
      if(t.gone&&t.drain>=0){
        if(game.now<lidEnd(t)){
          const k=Math.max(0,Math.min(1,(game.now-lidStart(t))/LID_CLOSE_MS));
          const eased=k*k*(3-2*k);
          for(const m of cargo.children){
            if(m.userData.closeTruck===t){
              // Raised -> seated. Subtract progress, not remaining lift.
              m.position.y=m.userData.closeBaseY-LID_LIFT*eased;
            }
          }
        }
      }else if(t.ate>0){
        const k=Math.max(0,Math.min(1,(game.now-t.ate)/ATE_MS)),pulse=Math.sin(k*Math.PI);
        for(const m of cargo.children){
          if(m.userData.truck!==t||m.userData.slot!==t.blocks.length-1||m.userData.candyPiece===undefined)continue;
          const base=m.userData.baseScale;
          m.scale.set(base.x*(1+.045*pulse),base.y*(1-.08*pulse),base.z*(1+.045*pulse));
        }
      }
    }
  }

  function animateBridges(game) {
    for(const group of statics.children){
      const t=group.userData.bridgeTruck;
      if(!t)continue;
      // Cau o lai ca khi khay da giao xong - khong con hoat anh thu cau.
      group.visible=true;group.scale.x=1;
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
      d.color.multiplyScalar(0.46);
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
      // ⚠ Khay dang nhan vali cung bi canTap tu choi, nhung chi trong vai tram mili giay -
      // lam toi no la chop tat moi lan co vali bay vao. Khong phai trang thai khoa.
      const locked = !t.gone && t.blocks.length > 0 && t.drain < 0 &&
                     !game.flying.some((f) => f.truck === t) &&
                     game.state === "play" && !game.canTapAny(t);
      const packed=m.userData.tintWhenPacked&&t.gone&&game.now>=lidEnd(t);
      const color=t.claim||lastCargo.get(t)?.find(b=>b?.color)?.color;
      m.material=packed?mat(PALETTE[color]||"#ff83aa",true):locked?dimOf(m.userData.litMat):m.userData.litMat;
      m.scale.y=1;m.visible=true;
    }
  }

  // ---------------------------------------------------------------- cube tren ray
  // ⚠ Pool: so cube doi tung khung. Tao/huy mesh moi khung la roi khung hinh, nen giu mot
  // ho va chi bat/tat .visible.
  const pool=[];
  // A compact almost-3x3 grid makes all eight squares readable without the hollow centre
  // that made the earlier arrangement resemble a flower.
  const MINI_CLUSTER=[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1]];
  function clusterPoint(x,y,rot,pitch,sub){
    const [gx,gy]=MINI_CLUSTER[sub],u=gx*pitch,v=gy*pitch;
    const co=Math.cos(rot||0),si=Math.sin(rot||0);
    return {x:x+co*u-si*v,y:y+si*u+co*v};
  }
  // Trang thai HINH rieng cua tung vien (goc lan, luc cham ray) - khong nam trong engine.
  const candyVis=new WeakMap();
  let visNow=null;
  const QUARTER=Math.PI/2;
  function drawCubes(game){
    const list=[];
    const dtv=visNow===null?0:Math.max(0,Math.min(50,game.now-visNow));visNow=game.now;
    const lively=!reducedMotion.matches;
    // ⚠ 64 VIEN mot hop, va moi vien la mot manh vat ly (MINIS_PER_BELT_CANDY = 1): cac vien
    // xep sat nhau thanh MOT DONG DAC giong dong "cat" cua ban goc Loop Sort. Nhanh `single=false`
    // (moi manh ve thanh cum 8 vien) chi con cho truong hop doi lai hop 8 me.
    const batchSize=game.r*2*BELT_CANDY_VISUAL_SCALE;
    // Mot manh = mot vien: vien bang co va cham, nhinh hon mot chut de dong keo dac kin.
    const single=MINIS_PER_BELT_CANDY===1;
    const miniSize=single?game.r*2*1.08:batchSize*.36;
    const miniHeight=single?miniSize*.72:CARGO_H*BELT_CANDY_VISUAL_SCALE*.50;
    const pitch=single?0:batchSize*.35;
    // One belt reservation is rendered as MINIS_PER_BELT_CANDY candies, so every one of the
    // carton's 64 candies stays visible from source to target.
    // DONG KEO CHEN CHUC: vien nao bi nhieu vien khac ep quanh thi troi len thanh dong, nhu
    // cube cua ban goc chat chong len nhau. Engine chi co vat ly 2D, nen do cao nay la HINH:
    // dem hang xom trong ban kinh ~1.15 co vien, dong cang day thi vien (ngau nhien theo hat
    // giong) cang nam cao. Luoi o vuong de dem, khong phai O(n^2).
    const crowd=new Map();
    if(lively){
      const cell=game.r*2.3,key=(x,y)=>((x/cell)|0)*65536+((y/cell)|0);
      const grid=new Map();
      for(const c of game.cubes){
        if(!c.landed)continue;
        const k=key(c.x+5000,c.y+5000);let a=grid.get(k);if(!a)grid.set(k,a=[]);a.push(c);
      }
      const near2=(game.r*2*1.15)**2;
      for(const c of game.cubes){
        if(!c.landed)continue;
        const gx=((c.x+5000)/cell)|0,gy=((c.y+5000)/cell)|0;let n=0;
        for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){
          const a=grid.get((gx+i)*65536+gy+j);if(!a)continue;
          for(const o of a)if(o!==c&&(o.x-c.x)**2+(o.y-c.y)**2<near2)n++;
        }
        crowd.set(c,n);
      }
    }
    for(const c of game.cubes){
      let cx=c.x,cy=c.y,bottom=RAIL_Y+.025,tilt=0;
      let st=candyVis.get(c);
      if(!st){st={roll:0,seed:((c.piece??0)*.6180339+(c.born||0)*.0137)%1,landAt:0};candyVis.set(c,st);}
      let grow=1,squash=0;
      if(lively){
        if(!c.landed){
          // LAN ra: lat ve phia truoc ~2 vong/giay trong luc roi hop va chay tren cau.
          st.roll+=dtv*(.011+.005*st.seed);
        }else{
          if(!st.landAt)st.landAt=game.now;
          // Cham ray thi "ngã" ve mat gan nhat (keo vuong doi xung 90 do), co nay nhe.
          const target=Math.round(st.roll/QUARTER)*QUARTER;
          st.roll+=(target-st.roll)*Math.min(1,dtv*.012);
          const lk=(game.now-st.landAt)/220;
          if(lk<1)squash=Math.sin(lk*Math.PI)*.22*(1-lk*.5);
          // Dong day: vien co hat giong cao thi leo len tren (mot tang), vien khac nghieng de.
          const n=crowd.get(c)||0;
          const heap=Math.max(0,Math.min(1,(n-3)/3))*(st.seed>.45?1:.25);
          st.pile=(st.pile||0)+(heap-(st.pile||0))*Math.min(1,dtv*.01);
          bottom+=st.pile*miniHeight*1.05;
          tilt+=st.pile*(st.seed-.5)*1.1;
          // Tren ray: xoc nay theo nhip rieng tung vien, manh hon khi dang bi xo (vrot tu va cham).
          const jolt=Math.min(1,Math.abs(c.vrot||0)/5);
          bottom+=Math.abs(Math.sin(game.now*.016+st.seed*40))*(.03+.07*jolt);
          tilt+=Math.sin(game.now*.013+st.seed*30)*(.08+.22*jolt);
        }
      }
      if(!c.landed&&c.src){
        const t=c.src,reach=Math.max(1,Math.hypot(t.x-t.px,t.y-t.py));
        const f=Math.min(1,Math.hypot(c.x-t.px,c.y-t.py)/reach);
        const k=1-f,e=k*k*(3-2*k),hop=Math.sin(k*Math.PI);
        const launch=Math.max(0,Math.min(1,(game.now-c.born)/620));
        const fan=Math.sin(launch*Math.PI),lane=((c.piece??0)%4-1.5)*.22;
        cx-=t.my*lane*fan;cy+=t.mx*lane*fan;
        bottom=(BODY_H+.14)*(1-e)+(RAIL_Y+.025)*e+hop*.58;
        tilt=hop*.22+lane*fan*.18;
        if(lively){
          // BAT ra khoi hop: nhay vot len (moi vien cao mot kieu) va phong to nhe roi thu lai.
          const pk=Math.max(0,Math.min(1,((game.now-c.born)||0)/340));
          const pop=Math.sin(pk*Math.PI);
          bottom+=pop*(.55+.55*st.seed);
          grow=1+.28*pop;
        }
      }
      for(let sub=0;sub<MINIS_PER_BELT_CANDY;sub++){
        const cp=clusterPoint(cx,cy,c.rot,pitch,sub);
        let x=cp.x,y=cp.y,b=bottom,size=miniSize,height=miniHeight;
        if(!c.landed&&c.src&&Number.isInteger(c.slot)&&Number.isInteger(c.piece)){
          const q=miniCandyPosition(game,c.src,c.slot,sourceIndex(game,c.piece,sub,true));
          const gather=Math.max(0,Math.min(1,((game.now-c.born)-sub*14)/360));
          const eased=gather*gather*(3-2*gather),arc=Math.sin(gather*Math.PI);
          const swirl=arc*(.13+(sub%3)*.025),a=sub*2.399+gather*2.2;
          x=q.x+(cp.x-q.x)*eased;y=q.y+(cp.y-q.y)*eased;
          x+=Math.cos(a)*swirl;y+=Math.sin(a)*swirl;
          b=q.bottom+(bottom-q.bottom)*eased+arc*(.16+(sub%3)*.025);
          size=q.size+(miniSize-q.size)*eased;height=q.height+(miniHeight-q.height)*eased;
        }
        list.push({x,y,bottom:b,color:c.color,rot:(c.rot||0)+(sub-3.5)*.018,
          tilt:tilt+(sub%2?-.035:.035),worldSize:size*grow,worldHeight:height*grow,
          roll:st.roll,squash});
      }
    }
    for(const f of game.flying){
      const k=Math.max(0,Math.min(1,(game.now-f.at)/f.ms)),p=flyPos(f,k);
      for(let sub=0;sub<MINIS_PER_BELT_CANDY;sub++){
        const start=sub*.014,u=Math.max(0,Math.min(1,(k-start)/(1-start)));
        const eased=u*u*(3-2*u),arc=Math.sin(u*Math.PI);
        const cp=clusterPoint(p.x,p.y,p.rot,pitch,sub);
        const q=miniCandyPosition(game,f.truck,f.slot,f.piece*MINIS_PER_BELT_CANDY+sub);
        const swirl=arc*(.08+(sub%3)*.018),a=sub*2.399+u*2.6;
        const seed=((f.piece??0)*.6180339)%1;
        const air=lively?arc*(.38+.30*seed):0,pop=lively?1+.30*arc:1;
        list.push({
          x:cp.x+(q.x-cp.x)*eased-f.truck.my*(sub-3.5)*.018*arc+Math.cos(a)*swirl,
          y:cp.y+(q.y-cp.y)*eased+f.truck.mx*(sub-3.5)*.018*arc+Math.sin(a)*swirl,
          color:f.color,rot:p.rot+((f.rot1??p.rot)-p.rot)*eased,
          bottom:(RAIL_Y+.025)+(q.bottom-(RAIL_Y+.025))*eased+arc*(.24+(sub%3)*.035)+air,
          worldSize:(miniSize+(q.size-miniSize)*eased)*pop,
          worldHeight:(miniHeight+(q.height-miniHeight)*eased)*pop,
          // Lon nhao mot vong tron truoc khi roi vao hop (2*PI = het vong, mat keo thang lai).
          roll:lively?(seed<.5?1:-1)*eased*Math.PI*2:0,
          tilt:-arc*.12,squash:u>.86?Math.sin((u-.86)/.14*Math.PI)*.08:0,
        });
      }
    }
    while(pool.length<list.length){
      // A full belt can show hundreds of minis. Their own bevel lighting supplies depth;
      // omitting one shadow-map draw per mini keeps the 64-candy treatment viable on phones.
      const m=new THREE.Mesh(candyGeo,candyMat("#ff79ab"));m.castShadow=false;m.receiveShadow=true;
      cubes.add(m);pool.push(m);
    }
    for(let i=0;i<pool.length;i++){
      const m=pool[i],c=list[i];m.visible=!!c;if(!c)continue;
      const d=c.worldSize??game.r*2*BELT_CANDY_VISUAL_SCALE*(c.sz??1);
      m.material=candyMat(PALETTE[c.color]||"#ff79ab");
      const sf=c.sizeFactor??1,hf=c.heightFactor??1;
      const mh=(c.worldHeight??CARGO_H*BELT_CANDY_VISUAL_SCALE*hf)*(1-(c.squash||0));
      m.scale.set(d*sf*(1+(c.squash||0)*.45),mh,d*sf*(1+(c.squash||0)*.45));
      m.position.set(c.x,c.bottom+mh/2,c.y);
      m.rotation.set(c.tilt||0,c.rot||0,(c.tilt||0)*.55+(c.roll||0),"YXZ");
    }
  }

  // ---------------------------------------------------------------- vong lap
  let lastGame = null, lastSig = "", lastStatics = "", raf = 0, w = 0, h = 0, glide = null;

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

    const staticKey=game.trucks.map(t=>t.cap).join(",");
    if (game !== lastGame || staticKey !== lastStatics) {
      // Cung mot van ma ban co doi (vua them khay): camera TRUOT sang khung moi thay vi nhay.
      const sameGame = game === lastGame && !reducedMotion.matches;
      const fromPos = camera.position.clone(), fromQuat = camera.quaternion.clone();
      lastGame = game;
      lastStatics=staticKey;
      buildStatics(game);
      applyBackdrop(game);
      lastSig = "";
      w = h = 0;                     // ep tinh lai camera cho ban co moi
      resize();
      placeCamera(game.bounds);
      fitCamera(game);
      glide = sameGame ? { fromPos, fromQuat, toPos: camera.position.clone(),
                           toQuat: camera.quaternion.clone(), t0: performance.now() } : null;
      if (glide) { camera.position.copy(fromPos); camera.quaternion.copy(fromQuat); }
    }
    resize();
    if (glide) {
      const k = Math.min(1, (performance.now() - glide.t0) / 520), e = k * k * (3 - 2 * k);
      camera.position.lerpVectors(glide.fromPos, glide.toPos, e);
      camera.quaternion.slerpQuaternions(glide.fromQuat, glide.toQuat, e);
      if (k >= 1) glide = null;
    }
    // Khay vua them bang booster: nay len tu mat san.
    for (const m of statics.children) {
      const t = m.userData.truck || m.userData.bridgeTruck;
      if (!t || !t.extra) continue;
      if (!m.userData.popBase) m.userData.popBase = m.scale.clone();
      const k = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (game.now - t.addedAt) / 420));
      const c1 = 1.7, c3 = c1 + 1, e = k >= 1 ? 1 : 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
      const b = m.userData.popBase;
      if (!m.userData.bridgeTruck) m.scale.set(b.x * Math.max(.01, e), b.y * Math.max(.01, e), b.z * Math.max(.01, e));
    }

    const sig = cargoSig(game);
    if (sig !== lastSig) { lastSig = sig; buildCargo(game); }
    animateCargo(game);
    animateBridges(game);
    animateFx(game);
    animateLocked(game);
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
    const hits = ray.intersectObjects([...cargo.children, ...statics.children], true);
    for (const h of hits) {
      const t = h.object.userData && h.object.userData.truck;
      if (t) return {
        truck: t,
        // Cham vao THAN khay (khong trung hop nao) = cham hop NGOAI CUNG: hop dang do do neu
        // co, khong thi hop day cuoi. Tra ve hop day cuoi khi dang co hop do do thi luat
        // "hop phia trong bi chan" se chan nham.
        slot: Number.isInteger(h.object.userData.slot)
          ? h.object.userData.slot : t.blocks.length - (t.fill > 0 ? 0 : 1),
      };
    }
    return null;
  }

  // Chieu mot diem THE GIOI cua game ra toa do man hinh (client px). Chi dung de tu kiem:
  // co no thi kiem duoc "chieu ra roi ban tia nguoc lai co ve dung xe khong" bang may, thay
  // vi bam tay roi doan.
  function project(wx, wy, wh) {
    const r = canvas.getBoundingClientRect();
    // Aim the round-trip pick check at the visible centre of a closed lid. At the
    // 40-degree camera, projecting the old mid-body height sends the ray through the
    // front face of the next carton first, which made every slot appear one position
    // out even though its lid was individually clickable.
    const v = new THREE.Vector3(wx, wh === undefined ? BODY_H + .92 : wh, wy);
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
      document.body.classList.remove("has-side-scene");
      canvas.remove();
    },
  };
}
