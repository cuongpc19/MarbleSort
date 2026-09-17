// Quiet responsive factory room shared by mobile and desktop. The background only
// establishes wall, floor and depth; all visual emphasis belongs to playable objects.
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

}
