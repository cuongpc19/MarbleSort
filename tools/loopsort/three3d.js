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
import { DELIVER, flyPos, SCALE, WIDE, PALETTE } from "./loopsort.js";
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
const TRUCK_W = 2.2;

// Cao do vali khi nam tren ray. Hang trong khay nam cao hon, o BODY_H - chenh lech giua hai
// so nay chinh la quang duong vali phai len khi no vao khay.
const RAIL_Y = 0.38;
const BODY_H = 0.6;    // cao than xe
const CARGO_H = 0.45;   // cao mieng hang
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
const BOX_SEAL_MS = 460;
const PACK_HOLD_MS = 260;
const EXIT_TRAVEL_MS = 1450;
const lidStart = (t) => Number.isFinite(t.arriveAt)
  ? t.arriveAt + LID_SETTLE_MS
  : t.drain + LID_DELAY_MS;
const lidEnd = (t) => lidStart(t) + LID_CLOSE_MS;
const exitStart = (t) => lidEnd(t) + PACK_HOLD_MS;
const exitEnd = (t) => exitStart(t) + EXIT_TRAVEL_MS;

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

  function buildDeco(game) {
    const b=game.bounds;
    const candidates=[
      [b.x0+2,b.y0+2],[b.x1-2,b.y0+2],
      [b.x0+2,b.y1-2],[b.x1-2,b.y1-2]
    ];
    const clearAt=(x,z)=>!game.ring.some(p=>Math.hypot(p.x-x,p.y-z)<3.4)
      && !game.trucks.some(t=>{
        for(let s=0;s<t.cap;s++){const p=game.slotPos(t,s,.5);if(Math.hypot(p.x-x,p.y-z)<3.2)return true;}
        return false;
      });
    let count=0;
    for(const [x,z] of candidates){
      if(!clearAt(x,z)||count>=2)continue;
      const g=new THREE.Group();g.position.set(x,0,z);
      // A rounded mixing kettle with a copper cap and simple pressure gauge.
      box(g,0,0,2.1,1.9,.25,0,"#269f9d",0,true);
      const drum=new THREE.Mesh(new THREE.CylinderGeometry(.73,.8,1.15,24),mat("#ffb448",true));
      drum.position.y=.85;drum.castShadow=true;g.add(drum);
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.77,24,12,0,Math.PI*2,0,Math.PI/2),mat("#fff5df",true));
      cap.position.y=1.4;cap.scale.y=.45;cap.castShadow=true;g.add(cap);
      const gauge=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.10,20),mat("#fff7e7",true));
      gauge.rotation.x=Math.PI/2;gauge.position.set(0,1.04,.76);g.add(gauge);
      box(g,0,.83,.06,.04,.24,.89,"#684268",0,true);
      for(const s of [-1,1]) box(g,s*.8,0,.21,.32,.72,.25,"#fa799b",0,true);
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.48,12),mat("#3fc7b1",true));
      stem.position.set(.3,1.8,0);g.add(stem);
      const bubble=new THREE.Mesh(new THREE.SphereGeometry(.21,14,10),mat("#ff7198",true));
      bubble.position.set(.3,2.16,0);bubble.userData.factoryBubble=true;
      bubble.userData.factoryBaseY=2.16;bubble.userData.factoryPhase=count*Math.PI;g.add(bubble);
      statics.add(g);count++;
    }
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
  scene.add(new THREE.AmbientLight(0xffffff, 0.82));
  scene.add(new THREE.HemisphereLight(0xfff8dc, 0x48a89d, 0.68));
  const sun = new THREE.DirectionalLight(0xfff8e8, 1.02);
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
      const o = { color: col(hex), roughness: 0.34, metalness: 0,
        clearcoat: 0.48, clearcoatRoughness: 0.28 };
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

  function roundedSlab(group, wx, wy, len, wid, hei, yBase, hex, radius) {
    const x0=-len/2,z0=-wid/2,x1=len/2,z1=wid/2;
    const r=Math.min(radius,len/2-.05,wid/2-.05);
    const shape=new THREE.Shape();
    shape.moveTo(x0+r,z0);
    shape.lineTo(x1-r,z0);shape.quadraticCurveTo(x1,z0,x1,z0+r);
    shape.lineTo(x1,z1-r);shape.quadraticCurveTo(x1,z1,x1-r,z1);
    shape.lineTo(x0+r,z1);shape.quadraticCurveTo(x0,z1,x0,z1-r);
    shape.lineTo(x0,z0+r);shape.quadraticCurveTo(x0,z0,x0+r,z0);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:hei,steps:1,curveSegments:12,
      bevelEnabled:true,bevelSegments:3,bevelSize:Math.min(.10,hei*.35),bevelThickness:Math.min(.06,hei*.25)});
    geo.rotateX(-Math.PI/2);
    const mesh=new THREE.Mesh(geo,mat(hex,true));
    mesh.position.set(wx,yBase,wy);mesh.castShadow=true;mesh.receiveShadow=true;
    group.add(mesh);return mesh;
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

  // One reusable texture: delivery progress belongs to the board, never a fake target.
  const progressCanvas = document.createElement("canvas");
  progressCanvas.width = 512; progressCanvas.height = 256;
  const progressTexture = keep(new THREE.CanvasTexture(progressCanvas));
  progressTexture.colorSpace = THREE.SRGBColorSpace;
  const progressMaterial = keep(new THREE.MeshBasicMaterial({map:progressTexture,transparent:true,depthWrite:false}));
  let progressKey = "";
  const shopCanvas=document.createElement("canvas");shopCanvas.width=384;shopCanvas.height=144;
  const shopPaint=shopCanvas.getContext("2d");
  shopPaint.fillStyle="#c84272";shopPaint.beginPath();shopPaint.roundRect(8,8,368,128,46);shopPaint.fill();
  shopPaint.strokeStyle="#fff5be";shopPaint.lineWidth=12;shopPaint.stroke();
  shopPaint.textAlign="center";shopPaint.textBaseline="middle";shopPaint.font="900 62px system-ui";
  shopPaint.fillStyle="#fffbea";shopPaint.fillText("SHOP",192,73);
  const shopTexture=keep(new THREE.CanvasTexture(shopCanvas));shopTexture.colorSpace=THREE.SRGBColorSpace;
  const shopMaterial=keep(new THREE.SpriteMaterial({map:shopTexture,transparent:true,depthWrite:false}));

  function dispatchPoint(game){
    let index=0;
    for(let i=1;i<game.ring.length;i++)if(game.ring[i].y<game.ring[index].y)index=i;
    const n=game.ring.length,p=game.ring[index];
    const a=game.ring[(index-1+n)%n],b=game.ring[(index+1)%n];
    return {x:p.x,y:p.y,angle:Math.atan2(-(b.y-a.y),b.x-a.x)};
  }

  function buildDispatch(game){
    if(!game.closed||game.ring.length<3)return;
    const d=dispatchPoint(game),g=new THREE.Group();g.position.set(d.x,0,d.y);g.rotation.y=d.angle;
    const side=BELT_W/2+.34;
    box(g,-side,0,.44,.44,1.75,.30,"#ff7297",0,true);
    box(g,side,0,.44,.44,1.75,.30,"#ff7297",0,true);
    box(g,-side,0,.52,.52,.16,1.18,"#fff0a7",0,true);
    box(g,side,0,.52,.52,.16,1.18,"#fff0a7",0,true);
    box(g,0,0,BELT_W+1.20,.52,.42,1.88,"#33cbb2",0,true);
    box(g,0,0,BELT_W+.72,.58,.15,2.21,"#fff0a7",0,true);
    const sign=new THREE.Sprite(shopMaterial);sign.position.set(0,2.82,0);sign.scale.set(2.75,1.02,1);g.add(sign);
    const glow=new THREE.Mesh(new THREE.CircleGeometry(1.02,32),keep(new THREE.MeshBasicMaterial({
      color:0xffef96,transparent:true,opacity:.32,depthWrite:false})));
    glow.rotation.x=-Math.PI/2;glow.position.y=.47;glow.scale.set(1,1.55,1);g.add(glow);
    statics.add(g);
  }
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
    p.fillStyle="#ee8b58";p.font="900 29px system-ui";p.fillText("SWEET ORDERS",256,178);
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
    // A transparent real shadow receiver ties the machines to the soft painted floor.
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(250,250),
      keep(new THREE.ShadowMaterial({color:0x345d64,opacity:.22})));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=-.03;shadow.receiveShadow=true;
    statics.add(shadow);
    // A real raised workbench under the whole puzzle. Its cool mint top separates the
    // board from the warm factory floor, and the three exposed layers provide depth on
    // both portrait and wide desktop views.
    const bb=game.bounds,cx=(bb.x0+bb.x1)/2,cz=(bb.y0+bb.y1)/2;
    const pw=bb.x1-bb.x0-.15,pd=bb.y1-bb.y0-.15;
    roundedSlab(statics,cx,cz,pw,pd,.28,-.34,"#237d83",2.1);
    roundedSlab(statics,cx,cz,pw-.20,pd-.20,.15,-.15,"#45cfb4",2.0);
    roundedSlab(statics,cx,cz,pw-.46,pd-.46,.055,-.025,"#d9ffec",1.85);
    if(game.closed)stamp(game);
    if(game.ring?.length>1){
      const path=beltFrame(game);
      beltSolid(path,2.98,.02,.17,"#168d91");
      beltSolid(path,2.83,.14,.20,"#43d7b7");
      beltSolid(path,2.55,.28,.10,"#fff0a8");
      beltSolid(path,2.25,.32,.075,"#4b2f86");
      beltStrip(path,2.12,.397,"#704fc0");
      for(const side of [-1,1]){
        beltTube(path,side*1.32,.125,.34,"#1cb69f");
        beltTube(path,side*1.30,.078,.445,"#c8ffea");
        beltTube(path,side*1.12,.027,.418,"#fff3b8");
      }
    }
    buildDispatch(game);
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
      tag(trayBox(statics,c.x,c.y,len+.5,TW+.26,.18,.03,"#c94678",rotation,true,.12),true);
      tag(trayBox(statics,c.x,c.y,len+.4,TW+.16,.40,.18,"#ff7f9f",rotation,true,.18),true);
      tag(trayBox(statics,c.x,c.y,len+.24,TW,.12,.53,"#fff1bd",rotation,true,.055));
      // Open paper cavities, with real depth and no fake colored contents.
      for(let i=0;i<t.cap;i++){
        const p=game.slotPos(t,i,.5);
        tag(trayBox(statics,p.x,p.y,SL-.12,TW-.22,.045,.648,"#e0ad8e",rotation,true,.022));
        tag(trayBox(statics,p.x,p.y,SL-.20,TW-.31,.035,.687,"#fff3ca",rotation,true,.016));
      }
      // Low rounded lips keep the silhouette a shallow confectionery tray.
      for(const side of [-1,1]){
        const x=c.x-t.my*side*(TW/2-.025),z=c.y+t.mx*side*(TW/2-.025);
        tag(trayBox(statics,x,z,len+.23,.12,.14,.60,"#fff8e3",rotation,true,.052));
      }
      const back={x:c.x-t.mx*len/2,z:c.y-t.my*len/2};
      tag(trayBox(statics,back.x,back.z,.13,TW,.14,.6,"#fff8e3",rotation,true,.055));
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

  const smallLidMats=new Map();
  function smallLidMat(hex){
    if(!smallLidMats.has(hex))smallLidMats.set(hex,keep(new THREE.MeshPhysicalMaterial({
      color:"#ffffff",emissive:hex,emissiveIntensity:.025,transparent:true,opacity:.18,
      roughness:.08,metalness:0,clearcoat:1,clearcoatRoughness:.05,depthWrite:false
    })));
    return smallLidMats.get(hex);
  }

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
      color:hex,emissive:hex,emissiveIntensity:.18,roughness:.24,
      metalness:0,clearcoat:.8,clearcoatRoughness:.2
    })));
    return candyMats.get(hex);
  }
  function candy(group,x,z,size,bottom,hex,rotation=0){
    const m=new THREE.Mesh(candyGeo,candyMat(hex));
    const height=CARGO_H*.70;
    m.position.set(x,bottom+height/2,z);m.scale.set(size,height,size);
    m.rotation.y=rotation;m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
  }
  function candyPosition(game,t,slot,piece){
    if(game.candyPos)return game.candyPos(t,slot,piece);
    const c=game.slotPos(t,slot,.5),sl=slotLen(game,t);
    const u=(piece%4-1.5)*sl*.20,v=(Math.floor(piece/4)-.5)*sl*.36;
    return {x:c.x+t.mx*u-t.my*v,y:c.y+t.my*u+t.mx*v};
  }
  // Every pocket is one real candy. Flights reserve pockets in the model, but their
  // destination is kept empty until the moving candy actually arrives.
  function makeBox(game,t,slot,color,pieces=null,hidden=false,ghost=false,sealed=true,packedAt=0){
    const SL=slotLen(game,t),p=game.slotPos(t,slot,.5),r=rotOf(t);
    pieces=pieces||Array.from({length:game.perBlock},(_,i)=>i);
    const hex=PALETTE[color]||"#ff79a6";
    const tag=m=>{m.userData.truck=t;m.userData.slot=slot;if(ghost)m.userData.drainTruck=t;return m;};
    tag(trayBox(cargo,p.x,p.y,SL-.16,SL-.16,.11,BODY_H+.045,"#fff9e9",r,true,.05));
    if(hidden){
      tag(box(cargo,p.x,p.y,SL-.24,SL-.24,.43,BODY_H+.16,HIDDEN_FILL,r,true));
      addCargoMark(cargo,p.x,p.y,BODY_H+.60,questionMaterial,t,ghost,slot);
      return;
    }
    const size=SL*.17;
    for(let piece=0;piece<game.perBlock;piece++){
      const q=candyPosition(game,t,slot,piece);
      tag(box(cargo,q.x,q.y,size+.05,size+.05,.035,BODY_H+.135,"#e4c9b1",r,true));
      if(pieces.includes(piece)){
        const m=tag(candy(cargo,q.x,q.y,size,BODY_H+.14,hex,r));
        m.userData.candyPiece=piece;
      }
    }
    if(sealed){
      // A clear clamshell keeps all eight candies readable while making the completed
      // box visibly different from the open paper cavity that is still being filled.
      const lid=new THREE.Mesh(new RoundedBoxGeometry(SL-.12,.075,SL-.12,4,.035),smallLidMat(hex));
      lid.position.set(p.x,BODY_H+.61,p.y);lid.rotation.y=r;lid.castShadow=true;lid.receiveShadow=true;
      tag(lid);cargo.add(lid);
      const band=tag(trayBox(cargo,p.x,p.y,SL*.22,SL-.17,.055,BODY_H+.65,hex,r,true,.02));
      for(const m of [lid,band]){
        m.userData.boxSealAt=packedAt||0;
        m.userData.boxSealBaseY=m.position.y;
      }
    }
  }

  function buildDrainGhost(game,t){
    const snapshot=lastCargo.get(t)||[];
    const color=t.claim||snapshot.find(b=>b?.color)?.color;
    if(!color)return false;
    const pieces=Array.from({length:game.perBlock},(_,i)=>i);
    for(let slot=0;slot<Math.min(DELIVER,t.cap);slot++)makeBox(game,t,slot,color,pieces,false,true,true,0);
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
    tag(trayBox(cargo,c.x,c.y,len,wid,.18,BODY_H+.47+lift,hex,r,true,.075));
    tag(trayBox(cargo,c.x,c.y,len-.12,wid-.12,.10,BODY_H+.65+lift,hex,r,true,.045));
    const bandWidth=Math.min(1.7,len*.26);
    tag(trayBox(cargo,c.x,c.y,bandWidth,wid-.08,.034,BODY_H+.755+lift,"#fff6dd",r,true,.014));
    // Raised wrapped-candy emblem and a clear completion seal.
    tag(box(cargo,c.x,c.y,.58,.47,.105,BODY_H+.80+lift,hex,r,true));
    for(const side of [-1,1]){
      const x=c.x+t.mx*side*.46,z=c.y+t.my*side*.46;
      const wrapper=tag(box(cargo,x,z,.27,.31,.065,BODY_H+.81+lift,hex,r+.35*side,true));
    }
    const x=c.x-t.mx*len*.32,z=c.y-t.my*len*.32;
    const seal=new THREE.Mesh(new THREE.CircleGeometry(.37,28),mat("#ffefad",true));
    seal.rotation.x=-Math.PI/2;seal.position.set(x,BODY_H+.79+lift,z);cargo.add(tag(seal));
    const check=new THREE.Shape();
    check.moveTo(-.20,0);check.lineTo(-.055,-.14);check.lineTo(.25,.18);
    check.lineTo(.15,.27);check.lineTo(-.055,.04);check.lineTo(-.12,.10);check.closePath();
    const tick=new THREE.Mesh(new THREE.ShapeGeometry(check),mat("#248d78",true));
    tick.rotation.x=-Math.PI/2;tick.position.set(x,BODY_H+.80+lift,z);cargo.add(tag(tick));
  }

  function buildCargo(game){
    clear(cargo);
    for(const t of game.trucks){
      if(t.gone){
        if(game.now>=exitEnd(t))continue;
        const sequencing=!reducedMotion.matches&&t.drain>=0&&game.now<lidEnd(t);
        if(sequencing&&buildDrainGhost(game,t)){
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
        makeBox(game,t,displaySlot,b.color,pieces,b.hidden&&!b.seen,false,!b.flying,b.packedAt||0);
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
        makeBox(game,t,slot,group[0].color,group.map((p,i)=>p.piece??i),false,false,false,0);
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
      else s+=t.blocks.map(b=>(b.hidden&&!b.seen?"?":b.color)+(b.flying?"~":"")).join("");
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
  const rippleGeo = keep(new THREE.RingGeometry(0.72, 1.0, 40));
  const ripplePool = [];
  const sealGeo = keep(new THREE.RingGeometry(.62,.78,32));
  const sealPool = [];
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
  function sealMesh(){
    const m=new THREE.Mesh(sealGeo,fxMat());m.rotation.x=-Math.PI/2;fx.add(m);return m;
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
          const k=Math.max(0,Math.min(1,(game.now-exitStart(t))/EXIT_TRAVEL_MS));
          const eased=k*k*(3-2*k),start=game.slotPos(t,(t.cap-1)/2,.5),door=dispatchPoint(game);
          let x,z,lift;
          if(k<.28){
            const u=k/.28,q=u*u*(3-2*u);
            x=start.x+(t.px-start.x)*q;z=start.y+(t.py-start.y)*q;
            lift=.55*Math.sin(u*Math.PI*.75);
          }else{
            const u=(k-.28)/.72,q=u*u*(3-2*u);
            const cx=(t.px+door.x)/2,cz=(t.py+door.y)/2;
            x=(1-q)*(1-q)*t.px+2*(1-q)*q*cx+q*q*door.x;
            z=(1-q)*(1-q)*t.py+2*(1-q)*q*cz+q*q*door.y;
            lift=.42+1.55*Math.sin(q*Math.PI)+q*.35;
          }
          // The completed tray is wider than the transport lane.  Let the transfer
          // collar squeeze it into a compact shipping pack as it reaches the rail,
          // then keep reducing it while the factory carries it to the SHOP hatch.
          // Without this first-stage squeeze the long carton clips the screen edge
          // and reads as a loose panel sliding over the machine.
          let shrink;
          if(k<.28){
            const u=k/.28,q=u*u*(3-2*u);
            shrink=1-.46*q;
          }else{
            const u=(k-.28)/.72,q=u*u*(3-2*u);
            shrink=.54-.24*q;
          }
          for(const m of cargo.children){
            if(m.userData.exitTruck!==t)continue;
            const base=m.userData.basePos;
            m.position.set(base.x+x-start.x,base.y+lift,base.z+z-start.y);
            const s=m.userData.baseScale;m.scale.set(s.x*shrink,s.y*shrink,s.z*shrink);
            m.rotation.y=m.userData.baseRotY+Math.sin(k*Math.PI*2)*.08;
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
        sizeFactor=.84+.16*e;heightFactor=.70+.30*e;
      }
      return {...c,bottom,hop,tilt,squash,sizeFactor,heightFactor};
    });
    for(const f of game.flying){
      const k=Math.max(0,Math.min(1,(game.now-f.at)/f.ms)),p=flyPos(f,k);
      const e=k*k*(3-2*k),hop=Math.sin(k*Math.PI);
      const landing=k>.82?Math.sin((k-.82)/.18*Math.PI):0;
      list.push({x:p.x,y:p.y,color:f.color,sz:1,rot:p.rot,
        bottom:(RAIL_Y+.025)*(1-e)+(BODY_H+.14)*e+hop*.72,
        hop,tilt:-hop*.22,squash:landing*.12,
        sizeFactor:1-.16*e,heightFactor:1-.30*e});
    }
    while(pool.length<list.length){
      const m=new THREE.Mesh(candyGeo,candyMat("#ff79ab"));m.castShadow=true;m.receiveShadow=true;
      cubes.add(m);pool.push(m);
    }
    for(let i=0;i<pool.length;i++){
      const m=pool[i],c=list[i];m.visible=!!c;if(!c)continue;
      const d=game.r*2*(c.sz??1);
      m.material=candyMat(PALETTE[c.color]||"#ff79ab");
      const sf=c.sizeFactor??1,hf=c.heightFactor??1;
      const mh=CARGO_H*hf*(1-(c.squash||0));
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
    if(!reducedMotion.matches)statics.traverse((m)=>{
      if(!m.userData.factoryBubble)return;
      m.position.y=m.userData.factoryBaseY+.16*Math.sin(game.now*.002+m.userData.factoryPhase);
      const s=.92+.10*Math.sin(game.now*.002+m.userData.factoryPhase);
      m.scale.setScalar(s);
    });

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
