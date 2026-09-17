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
const BELT_CANDY_VISUAL_SCALE = 1.18; // visual only; boxed candy remains smaller
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
const BRIDGE_RETRACT_MS = 310;
const LID_SETTLE_MS = ATE_MS + 340;
const BOX_SEAL_MS = 460;
const STACK_HOLD_MS = 380;
const SOURCE_LID_MS = 330;
const BATCH_SPLIT_START = .58;
const BATCH_SPLIT_END = .73;
const PACK_HOLD_MS = 320;
const PACK_DISMISS_MS = 520;
const lidStart = (t) => Number.isFinite(t.arriveAt)
  ? t.arriveAt + LID_SETTLE_MS
  : t.drain + LID_DELAY_MS;
const lidEnd = (t) => lidStart(t) + LID_CLOSE_MS;
const exitStart = (t) => lidEnd(t) + PACK_HOLD_MS;
const exitEnd = (t) => exitStart(t) + PACK_DISMISS_MS;

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
  // ⚠ fov 20 va goc nhin 40 do (xem placeCamera), theo lua chon cua chu du an 2026-09-17 sau khi
  // so sau bien the tren cung level 5 va 30: "ban 40 do trong cung duoc day". Muc dich la thay
  // duoc THAN hop keo, ma o 64 do fov 7 gan nhu chi thay mat tren. Near = 10 van dung: o fov 20
  // camera van cach ban co vai chuc don vi.
  const camera = new THREE.PerspectiveCamera(20, 1, 10, 4000);

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
    // Goc nhin 40 do so voi mat ban. Khoang cach o day chi la diem xuat phat - fitCamera se
    // keo lai cho vua khung.
    const ELEV = 40 * Math.PI / 180, D = H * 1.25;
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
    for (let i = 0; i < 60; i++) {
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      let worst = 0, ylo = 1e9, yhi = -1e9;
      for (const p of ringPts.concat(truckPts)) {
        const v = p.clone().project(camera);
        ylo = Math.min(ylo, v.y); yhi = Math.max(yhi, v.y);
      }
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
      if (worst <= 1 && worst > 0.97) break;
      const off = camera.position.clone().sub(focus);
      off.multiplyScalar(Math.max(0.6, Math.min(1.6, worst / 0.985)));
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
    const col=cell%MINI_GRID,row=Math.floor(cell/MINI_GRID),pitch=sl*.155;
    const u=(col-1.5)*pitch,v=(row-1.5)*pitch;
    const height=Math.max(.12,sl*.064);
    return {
      x:c.x+t.mx*u-t.my*v,y:c.y+t.my*u+t.mx*v,
      bottom:BODY_H+.22+layer*height*.82,height,size:sl*.112,layer
    };
  }
  // Every pocket is one real candy. Flights reserve pockets in the model, but their
  // destination is kept empty until the moving candy actually arrives.
  function makeBox(game,t,slot,color,pieces=null,hidden=false,ghost=false,sealed=true,packedAt=0,sourceOpenAt=null){
    const SL=slotLen(game,t),p=game.slotPos(t,slot,.5),r=rotOf(t);
    pieces=pieces||Array.from({length:game.perBlock},(_,i)=>i);
    const hex=PALETTE[color]||"#ff79a6";
    const tag=m=>{m.userData.truck=t;m.userData.slot=slot;if(ghost)m.userData.drainTruck=t;return m;};
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
      const marks=[body,lid];
      for(const m of marks){
        m.userData.boxSealAt=packedAt||0;
        m.userData.boxSealBaseY=m.position.y;
      }
      return;
    }
    // The open carton packs a 4x4x4 stack. One large conveyor piece separates into
    // eight minis, so the eight gameplay pieces become 64 visible candies without
    // flooding the belt or changing its capacity.
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
    // slides back while the first batch leaves, giving the tap a physical cause instead
    // of replacing a closed box with an open cavity in one frame.
    if(sourceOpenAt!==null){
      const lid=tag(trayBox(cargo,p.x,p.y,closedLen+.05,closedWid+.05,.18,
        BODY_H+.77,hex,r,true,.12));
      lid.userData.sourceLidAt=sourceOpenAt;
      lid.userData.sourceLidTruck=t;
    }
    const present=new Set(pieces);
    for(let piece=0;piece<game.perBlock;piece++){
      if(!present.has(piece))continue;
      const pop=(t.miniPops||[]).find(o=>o.slot===slot&&o.piece===piece);
      for(let sub=0;sub<MINIS_PER_BELT_CANDY;sub++){
        const q=miniCandyPosition(game,t,slot,piece*MINIS_PER_BELT_CANDY+sub);
        const m=tag(candy(cargo,q.x,q.y,q.size,q.bottom,hex,r+(sub%2?-.045:.045),q.height));
        m.userData.candyPiece=piece;
        m.userData.miniCandy=true;
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
        if(game.now>=exitEnd(t))continue;
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
          !b.flying&&!stacking,stacking?0:(b.packedAt?b.packedAt+STACK_HOLD_MS:0));
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
      if(t.gone)s+=t.drain<0?"x":game.now<lidStart(t)?"s":game.now<lidEnd(t)?"c":game.now<exitEnd(t)?"e":"o";
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
  const paperGeo = keep(new THREE.PlaneGeometry(0.36, 0.14));
  const confettiPool = [];
  const fxMat = () => keep(new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, depthWrite: false, side: THREE.DoubleSide }));

  function paperMesh() {
    const m = new THREE.Mesh(paperGeo, fxMat());
    fx.add(m);
    return m;
  }
  function sealMesh(){
    const m=new THREE.Mesh(sealGeo,fxMat());m.rotation.x=-Math.PI/2;fx.add(m);return m;
  }

  function animateFx(game) {
    const now = game.now;
    const still = reducedMotion.matches;

    const seals=still?[]:game.trucks.flatMap(t=>t.blocks.map((b,slot)=>({t,b,slot})))
      .filter(o=>o.b.packedAt&&now-o.b.packedAt>=0&&now-o.b.packedAt<BOX_SEAL_MS+180);
    while(sealPool.length<seals.length)sealPool.push(sealMesh());
    for(let i=0;i<sealPool.length;i++){
      const m=sealPool[i],o=seals[i];
      if(!o){m.visible=false;continue;}
      const k=Math.min(1,(now-o.b.packedAt)/(BOX_SEAL_MS+180)),p=game.slotPos(o.t,o.slot,.5);
      m.visible=true;m.position.set(p.x,BODY_H+CARGO_H+.30,p.y);
      const s=.55+k*.95;m.scale.set(s,s,s);
      m.material.color.set(PALETTE[o.b.color]||"#ff7b9e");m.material.opacity=(1-k)*.72;
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
      const k=Math.max(0,Math.min(1,(game.now-at)/SOURCE_LID_MS));
      const eased=1-Math.pow(1-k,3),pop=Math.sin(k*Math.PI);
      const base=m.userData.baseScale,pos=m.userData.basePos,t=m.userData.sourceLidTruck;
      m.position.set(pos.x-t.mx*eased*.42,pos.y+pop*.46+eased*.12,pos.z-t.my*eased*.42);
      m.rotation.y=m.userData.baseRotY+Math.sin(k*Math.PI*.72)*.22;
      m.scale.set(base.x*(1-.18*eased),base.y*(1-.32*eased),base.z*(1-.18*eased));
      m.visible=k<.995;
    }
    for(const m of cargo.children){
      const at=m.userData.miniPopAt;
      if(!at)continue;
      if(game.now<at)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/210));
      const bounce=Math.sin(k*Math.PI);
      const base=m.userData.baseScale,pos=m.userData.basePos;
      // The split flight already carried this mini into place. The static mesh only
      // gives a small row-by-row settle pulse; scaling from zero here made landed
      // candies blink out for one frame before reappearing.
      m.scale.set(base.x*(1+.10*bounce),base.y*(1-.15*bounce),base.z*(1+.10*bounce));
      m.position.y=pos.y+bounce*.045;
    }
    for(const m of cargo.children){
      const at=m.userData.boxSealAt;
      if(!at)continue;
      const k=Math.max(0,Math.min(1,(game.now-at)/BOX_SEAL_MS));
      // Back-ease gives the little lid one soft overshoot instead of a mechanical drop.
      const c1=1.38,c3=c1+1;
      const eased=1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2);
      m.position.y=m.userData.boxSealBaseY+(1-eased)*.58;
      const pulse=Math.sin(k*Math.PI);
      const base=m.userData.baseScale;
      m.scale.set(base.x*(1+.06*pulse),base.y*(1-.10*pulse),base.z*(1+.06*pulse));
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
        }else if(game.now>=exitStart(t)){
          // Once sealed, the parcel simply settles into its own station. No second
          // destination competes with the playable board for attention.
          const k=Math.max(0,Math.min(1,(game.now-exitStart(t))/PACK_DISMISS_MS));
          const eased=k*k*(3-2*k),pulse=Math.sin(k*Math.PI);
          for(const m of cargo.children){
            if(m.userData.exitTruck!==t)continue;
            const base=m.userData.basePos,s=m.userData.baseScale;
            m.position.set(base.x,base.y+pulse*.12-eased*.48,base.z);
            m.scale.set(s.x*(1-.10*eased),s.y*Math.max(.02,1-eased),s.z*(1-.10*eased));
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
    const now=game.now;
    for(const group of statics.children){
      const t=group.userData.bridgeTruck;
      if(!t)continue;
      if(!t.gone){group.visible=true;group.scale.x=1;continue;}
      const k=reducedMotion.matches ? 1 : Math.max(0,Math.min(1,
        (now-exitStart(t))/BRIDGE_RETRACT_MS));
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
      if(t.gone&&game.now>=exitStart(t)){
        const k=Math.max(0,Math.min(1,(game.now-exitStart(t))/BRIDGE_RETRACT_MS));
        m.scale.y=Math.max(.02,1-k*k*(3-2*k));
        m.visible=k<.995;
      }else{
        m.scale.y=1;m.visible=true;
      }
    }
  }

  // ---------------------------------------------------------------- cube tren ray
  // ⚠ Pool: so cube doi tung khung. Tao/huy mesh moi khung la roi khung hinh, nen giu mot
  // ho va chi bat/tat .visible.
  const pool=[];
  function drawCubes(game){
    const boxedHeightFactor=.70/BELT_CANDY_VISUAL_SCALE;
    const boxedFootprint=(t)=>Math.max(.5,Math.min(.8,
      slotLen(game,t)*.20/(game.r*2*BELT_CANDY_VISUAL_SCALE)));
    const list=game.cubes.map(c=>{
      let bottom=RAIL_Y+.025;
      let hop=0,tilt=0,squash=0,sizeFactor=1,heightFactor=1;
      if(!c.landed&&c.src){
        const t=c.src,reach=Math.max(1,Math.hypot(t.x-t.px,t.y-t.py));
        const f=Math.min(1,Math.hypot(c.x-t.px,c.y-t.py)/reach);
        const k=1-f,e=k*k*(3-2*k);
        hop=Math.sin(k*Math.PI);
        bottom=(BODY_H+.14)*(1-e)+(RAIL_Y+.025)*e+hop*.36;
        tilt=hop*.18;
        const small=boxedFootprint(t);
        sizeFactor=small+(1-small)*e;
        heightFactor=boxedHeightFactor+(1-boxedHeightFactor)*e;
      }
      return {...c,bottom,hop,tilt,squash,sizeFactor,heightFactor};
    });
    for(const f of game.flying){
      const k=Math.max(0,Math.min(1,(game.now-f.at)/f.ms)),p=flyPos(f,k);
      const e=k*k*(3-2*k),hop=Math.sin(k*Math.PI);
      const landing=k>.82?Math.sin((k-.82)/.18*Math.PI):0;
      const small=boxedFootprint(f.truck);
      const split=Math.max(0,Math.min(1,(k-BATCH_SPLIT_START)/(BATCH_SPLIT_END-BATCH_SPLIT_START)));
      if(split<1){
        const vanish=1-split*split*(3-2*split);
        list.push({x:p.x,y:p.y,color:f.color,sz:1,rot:p.rot,
          bottom:(RAIL_Y+.025)*(1-e)+(BODY_H+.14)*e+hop*.72,
          hop,tilt:-hop*.22,squash:landing*.12,
          sizeFactor:(1-(1-small)*e)*(.24+.76*vanish),
          heightFactor:(1-(1-boxedHeightFactor)*e)*(.30+.70*vanish)});
      }
      if(k>=BATCH_SPLIT_START){
        const origin=flyPos(f,BATCH_SPLIT_START);
        const oe=BATCH_SPLIT_START*BATCH_SPLIT_START*(3-2*BATCH_SPLIT_START);
        const originBottom=(RAIL_Y+.025)*(1-oe)+(BODY_H+.14)*oe+
          Math.sin(BATCH_SPLIT_START*Math.PI)*.72;
        for(let sub=0;sub<MINIS_PER_BELT_CANDY;sub++){
          const start=BATCH_SPLIT_START+sub*.022;
          if(k<start)continue;
          const u=Math.max(0,Math.min(1,(k-start)/(1-start)));
          const q=miniCandyPosition(game,f.truck,f.slot,
            f.piece*MINIS_PER_BELT_CANDY+sub);
          const eased=1-Math.pow(1-u,3),arc=Math.sin(u*Math.PI);
          const side=(sub-3.5)*.035*arc;
          list.push({
            x:origin.x+(q.x-origin.x)*eased-f.truck.my*side,
            y:origin.y+(q.y-origin.y)*eased+f.truck.mx*side,
            color:f.color,rot:p.rot+((f.rot1??p.rot)-p.rot)*eased,
            bottom:originBottom+(q.bottom-originBottom)*eased+arc*(.18+(sub%3)*.035),
            worldSize:q.size*(.62+.38*eased),worldHeight:q.height*(.58+.42*eased),
            tilt:-arc*.12,squash:u>.86?Math.sin((u-.86)/.14*Math.PI)*.08:0,
          });
        }
      }
    }
    while(pool.length<list.length){
      const m=new THREE.Mesh(candyGeo,candyMat("#ff79ab"));m.castShadow=true;m.receiveShadow=true;
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
      m.rotation.set(c.tilt||0,c.rot||0,(c.tilt||0)*.55);
    }
  }

  // ---------------------------------------------------------------- vong lap
  let lastGame = null, lastSig = "", lastStatics = "", raf = 0, w = 0, h = 0;

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
      lastGame = game;
      lastStatics=staticKey;
      buildStatics(game);
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
        slot: Number.isInteger(h.object.userData.slot)
          ? h.object.userData.slot : t.blocks.length - 1,
      };
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
      document.body.classList.remove("has-side-scene");
      canvas.remove();
    },
  };
}
