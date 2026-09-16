// A quiet sugar-factory worktop. Vector paint stays crisp at any viewport size;
// all moving candy, trays and machinery are true 3D objects in three3d.js.
export function paintFactoryBackdrop(canvas, width, height) {
  canvas.width = Math.max(1, Math.round(Math.min(1800, width * 1.5)));
  canvas.height = Math.max(1, Math.round(Math.min(2000, height * 1.5)));
  const p = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  const floor = p.createLinearGradient(0, 0, w * .7, h);
  floor.addColorStop(0, '#c4f3e9'); floor.addColorStop(.45, '#f3f4dc'); floor.addColorStop(1, '#c8ece6');
  p.fillStyle = floor; p.fillRect(0, 0, w, h);
  const glow = p.createRadialGradient(w*.5,h*.45,0,w*.5,h*.5,h*.65);
  glow.addColorStop(0,'#fffbea99');glow.addColorStop(1,'#ffffff00');
  p.fillStyle=glow;p.fillRect(0,0,w,h);
  // Large subtle floor tiles: no dense marks behind the small candy pieces.
  p.lineWidth=Math.max(1,w/650);p.strokeStyle='#649f9b13';
  for(let y=h*.12;y<h;y+=h*.17){p.beginPath();p.moveTo(0,y);p.lineTo(w,y);p.stroke();}
  for(let k=-3;k<=3;k++){p.beginPath();p.moveTo(w*.5+k*w*.22,0);p.lineTo(w*.5+k*w*.35,h);p.stroke();}
  // The softly rounded factory wall sits at the very top, clear of the play area.
  p.fillStyle='#8dd8ca';p.beginPath();p.roundRect(-w*.03,-h*.1,w*1.06,h*.17,h*.03);p.fill();
  p.fillStyle='#d5fff3';p.fillRect(0,h*.062,w,h*.009);
  p.fillStyle='#5baaa020';p.fillRect(0,h*.071,w,h*.006);
}
