// Responsive candy-factory room shared by mobile and desktop. The scene is painted
// directly into Three.js' background, so the board never sits in a separate portrait
// strip on wide screens. Playable candy, trays and the conveyor remain real 3D meshes.
export function paintFactoryBackdrop(canvas, width, height) {
  // CSS can widen #frame after the first renderer tick. Read the viewport too, so a
  // desktop never gets a portrait texture stretched across the finished full-width canvas.
  width = Math.max(width, globalThis.innerWidth || 0);
  height = Math.max(height, globalThis.innerHeight || 0);
  const scale = Math.min(1.6, Math.max(1, globalThis.devicePixelRatio || 1));
  canvas.width = Math.max(1, Math.round(Math.min(2400, width * scale)));
  canvas.height = Math.max(1, Math.round(Math.min(1800, height * scale)));
  const p = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  const wide = w / h > 1.15;
  const horizon = h * (wide ? .29 : .18);

  const wall = p.createLinearGradient(0, 0, 0, horizon);
  wall.addColorStop(0, '#70e2dc');
  wall.addColorStop(.55, '#a8f1df');
  wall.addColorStop(1, '#ddffe9');
  p.fillStyle = wall;
  p.fillRect(0, 0, w, horizon);

  const floor = p.createLinearGradient(0, horizon, 0, h);
  floor.addColorStop(0, '#fff7c9');
  floor.addColorStop(.48, '#ffedc8');
  floor.addColorStop(1, '#ffd8c2');
  p.fillStyle = floor;
  p.fillRect(0, horizon, w, h - horizon);

  const glow = p.createRadialGradient(w * .5, h * .42, 0, w * .5, h * .42, h * .72);
  glow.addColorStop(0, '#ffffffd9');
  glow.addColorStop(.42, '#fffbe676');
  glow.addColorStop(1, '#ffbfa900');
  p.fillStyle = glow;
  p.fillRect(0, 0, w, h);

  p.lineWidth = Math.max(2, w / 900);
  p.strokeStyle = '#238f8b22';
  for (let x = 0; x <= w; x += w / 9) {
    p.beginPath(); p.moveTo(x, 0); p.lineTo(x, horizon); p.stroke();
  }
  const trim = p.createLinearGradient(0, horizon - h * .018, 0, horizon + h * .025);
  trim.addColorStop(0, '#fffce8'); trim.addColorStop(.38, '#fff0a8');
  trim.addColorStop(.42, '#ff7f9c'); trim.addColorStop(1, '#d85378');
  p.fillStyle = trim; p.fillRect(0, horizon - h * .018, w, h * .043);
  p.fillStyle = '#8f3f6726'; p.fillRect(0, horizon + h * .025, w, h * .012);

  p.strokeStyle = '#d68d7b24';
  p.lineWidth = Math.max(1.5, w / 1100);
  for (let i = 1; i < 7; i++) {
    const k = i / 7;
    const y = horizon + (h - horizon) * k * k;
    p.beginPath(); p.moveTo(0, y); p.lineTo(w, y); p.stroke();
  }
  for (let i = -6; i <= 6; i++) {
    p.beginPath();
    p.moveTo(w * .5 + i * w * .035, horizon);
    p.lineTo(w * .5 + i * w * .16, h);
    p.stroke();
  }

  if (wide) {
    drawSideMachine(p, w * .035, h * .10, w * .19, h * .55, false);
    drawSideMachine(p, w * .965, h * .10, w * .19, h * .55, true);
    drawCandyPipe(p, w, h, false);
    drawCandyPipe(p, w, h, true);
  } else {
    p.fillStyle = '#ff8aa7aa';
    p.beginPath(); p.arc(w * .06, horizon * .48, w * .025, 0, Math.PI * 2); p.fill();
    p.beginPath(); p.arc(w * .94, horizon * .48, w * .025, 0, Math.PI * 2); p.fill();
  }
}

function drawSideMachine(p, x, y, width, height, mirror) {
  p.save();
  p.translate(x, y);
  if (mirror) p.scale(-1, 1);
  p.fillStyle = '#357a7750';
  p.beginPath(); p.ellipse(width * .48, height * 1.01, width * .60, height * .09, 0, 0, Math.PI * 2); p.fill();

  const cabinet = p.createLinearGradient(0, 0, width, height);
  cabinet.addColorStop(0, '#59e0c4'); cabinet.addColorStop(.5, '#27b9a7'); cabinet.addColorStop(1, '#137d82');
  p.fillStyle = cabinet;
  p.beginPath(); p.roundRect(0, height * .18, width, height * .77, width * .14); p.fill();
  p.fillStyle = '#d8fff0';
  p.beginPath(); p.roundRect(width * .07, height * .23, width * .13, height * .62, width * .06); p.fill();

  const tank = p.createLinearGradient(0, 0, width, height);
  tank.addColorStop(0, '#ffb06f'); tank.addColorStop(.45, '#ff7c91'); tank.addColorStop(1, '#dc426f');
  p.fillStyle = tank;
  p.beginPath(); p.roundRect(width * .24, height * .34, width * .64, height * .43, width * .21); p.fill();
  p.fillStyle = '#fff5c9b8';
  p.beginPath(); p.roundRect(width * .32, height * .39, width * .45, height * .055, 999); p.fill();
  p.fillStyle = '#bd315b36';
  p.beginPath(); p.roundRect(width * .65, height * .35, width * .20, height * .39, width * .10); p.fill();

  p.fillStyle = '#fff9d8'; p.beginPath(); p.arc(width * .76, height * .28, width * .13, 0, Math.PI * 2); p.fill();
  p.strokeStyle = '#ffc85f'; p.lineWidth = width * .035; p.stroke();
  p.strokeStyle = '#71415f'; p.lineWidth = width * .018; p.beginPath();
  p.moveTo(width * .76, height * .28); p.lineTo(width * .82, height * .22); p.stroke();
  for (const [cx, color] of [[.22, '#ffe25d'], [.38, '#b276ff'], [.54, '#55df79']]) {
    p.fillStyle = color; p.beginPath(); p.arc(width * cx, height * .88, width * .055, 0, Math.PI * 2); p.fill();
    p.fillStyle = '#ffffff99'; p.beginPath(); p.arc(width * cx - width * .018, height * .865, width * .014, 0, Math.PI * 2); p.fill();
  }
  p.restore();
}

function drawCandyPipe(p, w, h, mirror) {
  p.save();
  if (mirror) { p.translate(w, 0); p.scale(-1, 1); }
  p.lineCap = 'round'; p.lineJoin = 'round';
  p.strokeStyle = '#178d91'; p.lineWidth = Math.max(16, w * .016);
  p.beginPath(); p.moveTo(0, h * .08); p.lineTo(w * .12, h * .08); p.lineTo(w * .12, h * .23); p.stroke();
  p.strokeStyle = '#6be2ca'; p.lineWidth = Math.max(10, w * .010);
  p.stroke();
  p.fillStyle = '#fff6ce'; p.beginPath(); p.arc(w * .12, h * .23, w * .017, 0, Math.PI * 2); p.fill();
  p.strokeStyle = '#ff6f96'; p.lineWidth = Math.max(5, w * .004); p.stroke();
  p.restore();
}
