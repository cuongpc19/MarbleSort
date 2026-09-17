// Win celebration: fireworks and candy confetti on a canvas behind the result card.
//
// Asked for on 2026-09-17: "xong level thi an mung cho ruc ro nhe, candy factory san xuat
// keo vui tuoi ruc ro tuoi cuoi" and "phao hoa ban am am". So: an opening volley of bursts,
// a steady barrage for a few seconds, wrapped candies raining through it, and a slow
// trickle afterwards while the card stays open.
//
// The canvas lives INSIDE #cards, so it goes away with the card: the loop stops by itself as
// soon as the canvas is no longer in the document.

// Fallback only: the game passes its own candy-box palette (chu du an: "dung bo mau sac cua
// cac hop keo cho sac so").
let COLORS = ["#ff4265", "#ff8a27", "#ffd332", "#52d94c", "#36a9ff", "#ad62ff",
              "#ff65b2", "#21d8d0", "#fff4b0"];
const pick = (a) => a[(Math.random() * a.length) | 0];

// Like Tube Tangle: ONE show - a volley of SHELLS rockets over ~2.2s - then quiet. It used to
// keep firing (with sound) for as long as the card stayed open, and kept going after the card
// was hidden, so the fireworks were still audible on the next level.
const SHELLS = 11;

export function celebrate(host, { sound, reduced = false, palette = null } = {}) {
  if (palette) COLORS = palette.filter((c) => !/^#(3|2|1)/.test(c));   // skip the near-black ones
  const cv = document.createElement("canvas");
  cv.className = "fireworks";
  host.prepend(cv);
  const ctx = cv.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  const size = () => {
    const r = host.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();

  const rockets = [], sparks = [], candies = [];
  const t0 = performance.now();
  let last = t0, nextVolley = t0 + 350, nextRain = t0, fired = 3;

  function launch(x, delay = 0) {
    rockets.push({
      x, y: H + 10, vx: (Math.random() - 0.5) * 60,
      vy: -(H * (0.95 + Math.random() * 0.35)),
      at: performance.now() + delay, color: pick(COLORS),
      top: H * (0.14 + Math.random() * 0.3), trail: [], sounded: false,
    });
  }

  function burst(x, y, color) {
    const kind = Math.random();
    const n = reduced ? 30 : 70 + ((Math.random() * 40) | 0);
    const second = pick(COLORS), speed = 260 + Math.random() * 200;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.08;
      // ring bursts keep one speed; peonies scatter
      const v = kind < 0.35 ? speed : speed * (0.35 + Math.random() * 0.75);
      sparks.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0,
        max: 1.1 + Math.random() * 0.9, color: i % 3 ? color : second,
        size: 3.2 + Math.random() * 3, glitter: Math.random() < 0.3,
      });
    }
    // a bright flash at the centre
    sparks.push({ x, y, vx: 0, vy: 0, life: 0, max: 0.26, color: "#fff", size: 46, flash: true });
    sound?.play("boom", 0.7 + Math.random() * 0.6);
  }

  function rain(n) {
    for (let i = 0; i < n; i++)
      candies.push({
        x: Math.random() * W, y: -30 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 50, vy: 120 + Math.random() * 140,
        rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 7,
        color: pick(COLORS), s: 9 + Math.random() * 7, sway: Math.random() * 6.3,
      });
  }

  // Opening: three bursts at once, candy pouring down.
  for (const f of [0.22, 0.5, 0.78]) launch(W * f, f === 0.5 ? 120 : 0);
  rain(reduced ? 14 : 46);
  sound?.play("launch", 1);

  function drawCandy(c) {
    ctx.save();
    ctx.translate(c.x, c.y); ctx.rotate(c.rot);
    const s = c.s;
    ctx.fillStyle = c.color;
    // wrapper ends
    ctx.beginPath();
    ctx.moveTo(-s * 0.9, 0); ctx.lineTo(-s * 1.6, -s * 0.55); ctx.lineTo(-s * 1.6, s * 0.55); ctx.closePath();
    ctx.moveTo(s * 0.9, 0); ctx.lineTo(s * 1.6, -s * 0.55); ctx.lineTo(s * 1.6, s * 0.55); ctx.closePath();
    ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
    // body
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.beginPath(); ctx.ellipse(-s * 0.3, -s * 0.28, s * 0.35, s * 0.18, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function frame(now) {
    // The card was closed or replaced (next level, retry, home): stop, silently.
    if (!cv.isConnected || host.classList.contains("hide")) { cv.remove(); return; }
    requestAnimationFrame(frame);
    const r = host.getBoundingClientRect();
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) size();
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const age = now - t0;

    if (now >= nextVolley && fired < (reduced ? 4 : SHELLS)) {
      launch(W * (0.1 + Math.random() * 0.8));
      fired++;
      sound?.play("launch");
      nextVolley = now + (reduced ? 600 : 190);
    }
    if (!reduced && now >= nextRain && age < 3000) { rain(age < 1200 ? 5 : 2); nextRain = now + 160; }

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (let i = rockets.length - 1; i >= 0; i--) {
      const k = rockets[i];
      if (now < k.at) continue;
      k.vy += 520 * dt;
      k.x += k.vx * dt; k.y += k.vy * dt;
      k.trail.push({ x: k.x, y: k.y });
      if (k.trail.length > 10) k.trail.shift();
      for (let j = 0; j < k.trail.length; j++) {
        const p = k.trail[j];
        ctx.fillStyle = `rgba(255,236,170,${(j / k.trail.length) * 0.8})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2 + j * 0.22, 0, Math.PI * 2); ctx.fill();
      }
      if (k.y <= k.top || k.vy >= -20) { burst(k.x, k.y, k.color); rockets.splice(i, 1); }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life += dt;
      if (s.life >= s.max) { sparks.splice(i, 1); continue; }
      const f = 1 - s.life / s.max;
      if (s.flash) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.2);
        g.addColorStop(0, `rgba(255,255,255,${f})`); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2); ctx.fill();
        continue;
      }
      s.vx *= 1 - 1.6 * dt; s.vy *= 1 - 1.6 * dt; s.vy += 110 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.glitter && Math.random() < 0.35) continue;
      ctx.globalAlpha = Math.min(1, f * 1.6);
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (0.5 + f * 0.5), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    for (let i = candies.length - 1; i >= 0; i--) {
      const c = candies[i];
      c.sway += dt * 3;
      c.x += (c.vx + Math.sin(c.sway) * 30) * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      if (c.y > H + 40) { candies.splice(i, 1); continue; }
      drawCandy(c);
    }
  }
  requestAnimationFrame(frame);
}

// A smiling wrapped candy, used on the result cards. `mood` is "happy" or "sad".
export function mascot(mood = "happy") {
  const mouth = mood === "happy"
    ? '<path d="M50 60q10 11 20 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="41" cy="58" rx="6" ry="3.5" fill="#ff8fb3" opacity=".8"/><ellipse cx="79" cy="58" rx="6" ry="3.5" fill="#ff8fb3" opacity=".8"/>'
    : '<path d="M51 66q9 -8 18 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M79 44q2 7 -2 9" fill="none" stroke="#7fd4ff" stroke-width="4" stroke-linecap="round"/>';
  const eyes = mood === "happy"
    ? '<path d="M44 48q4 -6 8 0M68 48q4 -6 8 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/>'
    : '<circle cx="48" cy="48" r="4" fill="#5a2340"/><circle cx="72" cy="48" r="4" fill="#5a2340"/>';
  return `<svg class="mascot ${mood}" viewBox="0 0 120 96" aria-hidden="true">
    <path d="M22 48 2 30v36Z" fill="#ffb2c9" stroke="#e8628c" stroke-width="3" stroke-linejoin="round"/>
    <path d="M98 48 118 30v36Z" fill="#ffb2c9" stroke="#e8628c" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="60" cy="52" rx="40" ry="34" fill="#ff6f98" stroke="#e8628c" stroke-width="3"/>
    <path d="M34 30q12 44 44 50" fill="none" stroke="#fff3c4" stroke-width="7" opacity=".85"/>
    <ellipse cx="42" cy="32" rx="10" ry="5" fill="#fff" opacity=".6" transform="rotate(-25 42 32)"/>
    ${eyes}${mouth}
  </svg>`;
}
