// Run: node tools/loopsort/factory-check.mjs
// Defaults to the actual shipped data. Optional --data <directory> checks another set.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playOnce, seed } from './levelbot.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = process.argv.indexOf('--data');
const data = arg < 0 ? path.join(here, 'data') : path.resolve(process.argv[arg + 1]);
globalThis.fetch = async (url) => ({ json: async () => JSON.parse(await readFile(path.join(data, path.basename(url)), 'utf8')) });
const E = await import('./loopsort.js');
await E.loadData();
const { Game } = E;
const add = (m, c, n = 1) => { m[c] = (m[c] || 0) + n; };
const sorted = (m) => Object.fromEntries(Object.entries(m).filter(([, n]) => n).sort(([a], [b]) => a.localeCompare(b)));

// Independent material accounting: flights are already owned by fill or a reserved
// block. Counting flights as new stock would hide a double-render/double-count bug.
function stock(g) {
  const m = {};
  for (const t of g.trucks) {
    for (const b of t.blocks) add(m, b.color, 4);
    if (t.fill) add(m, t.claim, t.fill);
  }
  for (const c of [...g.cubes, ...g.pending]) add(m, c.color);
  for (const ledger of [g.delivered, g.revived]) for (const [c, n] of Object.entries(ledger)) add(m, c, n);
  return sorted(m);
}

let audits = 0;
function audit(g, expected) {
  audits++;
  assert.deepEqual(stock(g), expected, `per-colour conservation, level ${g.id}`);
  const loose = g.cubes.length + g.pending.length + g.trucks.reduce((n, t) => n + t.fill, 0);
  assert.equal(g.candyCount(), loose);
  assert.equal(g.counter(), Math.ceil(loose / 4));
  assert.equal(g.capCubes, g.slotCount * 4);
  assert.ok(loose <= g.capCubes, 'candy capacity');
  const pockets = new Set();
  for (const f of g.flying) {
    assert.ok(!f.truck.gone, 'no flight to a delivered tray');
    assert.ok(Number.isInteger(f.piece) && f.piece >= 0 && f.piece < 4);
    const key = `${g.trucks.indexOf(f.truck)}:${f.slot}:${f.piece}`;
    assert.ok(!pockets.has(key), 'no two flights reserve the same pocket');
    pockets.add(key);
    const p = g.candyPos(f.truck, f.slot, f.piece);
    assert.ok(Math.hypot(f.tx - p.x, f.ty - p.y) < 1e-8, 'flight ends at its own pocket');
    const end = E.flyPos(f, 1);
    assert.ok(Math.hypot(end.x - p.x, end.y - p.y) < 1e-8);
    if (f.block) {
      assert.equal(f.truck.blocks[f.slot], f.block);
      assert.equal(f.block.flying, true, 'box hidden until every flight arrives');
    } else {
      assert.equal(f.slot, f.truck.blocks.length);
      assert.ok(f.piece < f.truck.fill, 'partial reservations persist');
    }
  }
  for (const t of g.trucks) {
    assert.ok(t.fill >= 0 && t.fill < 4 && Number.isInteger(t.fill));
    assert.ok(t.blocks.length <= t.cap);
    if (t.fill || g.flying.some(f => f.truck === t)) assert.equal(g.canTap(t), false);
    if (t.gone) assert.ok(!g.flying.some(f => f.truck === t));
  }
  if (g.state === 'win') {
    assert.equal(g.candyCount(), 0);
    assert.equal(g.flying.length, 0);
    assert.equal(g.trucks.reduce((n, t) => n + t.blocks.length, 0), 0);
  }
}

function fixture(id = 1) {
  seed(id);
  const g = new Game(id); g.now = 0;
  const initial = stock(g);
  return { g, initial, check: () => audit(g, initial) };
}

// Move real poured candies to a mouth to isolate packing from travel time. No
// candy is fabricated or deleted; all end-to-end runs below use ordinary physics.
function feed(g, t, count, color) {
  for (let n = 0; n < count; n++) {
    const i = g.pending.findIndex(p => !color || p.color === color);
    assert.ok(i >= 0, 'fixture has a real poured candy');
    const [p] = g.pending.splice(i, 1);
    g.cubes.push({ x: t.px, y: t.py, vx: 0, vy: 0, rot: 0, sz: 1, color: p.color, landed: true });
  }
  for (const p of g.pending) p.at = 1e9;
  t.pourUntil = 0;
  g.absorb(g.now);
}

let tests = 0;
function test(name, fn) { fn(); tests++; console.log(`PASS ${name}`); }

test('shipped boxes, palette, candy scale and all four rotated pocket coordinates', () => {
  assert.equal(E.PALETTE.R, '#ff4265'); assert.equal(E.PALETTE.LB, '#21d8d0');
  for (const id of Object.keys(E.LEVELS)) {
    const { g, check } = fixture(id);
    assert.equal(g.perBlock, 4); assert.ok(g.r >= .3 && g.r <= .4);
    assert.equal(g.slotCount, E.LEVELS[id].SlotCount);
    assert.equal(g.slotLen, 1.68 * E.SCALE * g.fit);
    for (const t of g.trucks) {
      assert.equal(t.cap, 4);
      for (let slot = 0; slot < t.cap; slot++) for (let piece = 0; piece < 4; piece++) {
        const p = g.candyPos(t, slot, piece), c = g.slotPos(t, slot);
        const dx = p.x - c.x, dy = p.y - c.y;
        assert.ok(Math.abs(dx * t.mx + dy * t.my - (piece % 2 ? 1 : -1) * g.slotLen * .19) < 1e-9);
        assert.ok(Math.abs(-dx * t.my + dy * t.mx - (piece < 2 ? -1 : 1) * g.slotLen * .19) < 1e-9);
      }
    }
    check();
  }
});

test('contiguous colour batches pour four real candies from every box', () => {
  const { g, check } = fixture(2);
  const t = g.trucks.find(t => new Set(t.blocks.map(b => b.color)).size > 1);
  const before = [...t.blocks], color = before.at(-1).color;
  let batch = 0; for (let i = before.length - 1; i >= 0 && before[i].color === color; i--) batch++;
  assert.ok(g.tap(t)); assert.equal(g.tapLoad(t) >= 0, true);
  assert.equal(t.blocks.length, before.length - batch);
  assert.equal(g.pending.length, batch * 4); assert.equal(g.counter(), batch);
  for (const slot of new Set(g.pending.map(p => p.slot)))
    assert.deepEqual(g.pending.filter(p => p.slot === slot).map(p => p.piece).sort(), [0, 1, 2, 3]);
  const first = g.pending[0], origin = g.candyPos(first.truck, first.slot, first.piece);
  g.step(0, 0);
  assert.equal(g.cubes[0].x, origin.x); assert.equal(g.cubes[0].y, origin.y);
  check();
});

test('empty / partial / full / closed acceptance; partial arrival and tap lock', () => {
  const { g, check } = fixture();
  const [source, target] = g.trucks;
  assert.ok(g.tap(source));
  assert.ok(g.accepts(source, 'R')); assert.ok(g.accepts(source, 'LB'));
  feed(g, target, 3); check();
  assert.equal(target.fill, 3); assert.equal(target.blocks.length, 1);
  assert.ok(g.accepts(target, 'LB')); assert.equal(g.accepts(target, 'R'), false);
  assert.equal(g.shuffle(target), false); assert.equal(g.addBaySlot(target), false);
  g.step(0, 1000); check();
  assert.equal(g.flying.length, 0); assert.equal(target.fill, 3);
  assert.equal(g.canTap(target), false); assert.equal(g.tap(target), false);
  feed(g, target, 9); check();
  assert.equal(target.blocks.length, 4); assert.equal(target.fill, 0);
  assert.equal(g.accepts(target, 'LB'), false);
  assert.equal(g.deliver(target), false, 'public deliver must also wait');
  g.step(0, 2000); check();
  assert.ok(target.gone); assert.equal(g.accepts(target, 'LB'), false);
  assert.equal(g.delivered.LB, 16); assert.equal(g.state, 'win');
});

test('fourth reservation landing first never finishes a box or delivers early', () => {
  const { g, check } = fixture();
  const [target, source] = g.trucks;
  assert.ok(g.tap(source)); feed(g, target, 4); check();
  const block = target.blocks.at(-1);
  assert.ok(block.flying); assert.equal(target.fill, 0);
  assert.deepEqual(g.flying.map(f => f.piece), [0, 1, 2, 3]);
  // Adversarial arrival order, as can happen with unequal path lengths or frame timing.
  for (const f of g.flying) f.ms = [600, 500, 400, 200][f.piece];
  target.arriveAt = 600;
  g.step(0, 201); check();
  assert.ok(block.flying); assert.equal(g.flying.length, 3); assert.equal(target.gone, false);
  g.step(0, 501); check();
  assert.ok(block.flying); assert.equal(g.flying.length, 1); assert.equal(g.deliver(target), false);
  g.step(0, 600); check();
  assert.equal(block.flying, false); assert.ok(target.gone); assert.equal(target.drain, 600);
  assert.equal(g.state, 'win'); assert.equal(g.delivered.LB, 16);
});

test('undo restores boxes from pending and physical candies; packing invalidates undo', () => {
  const { g, check } = fixture();
  const t = g.trucks[1], n = t.blocks.length;
  assert.ok(g.tap(t)); check(); assert.ok(g.undo()); check();
  assert.equal(t.blocks.length, n); assert.equal(g.candyCount(), 0);
  assert.ok(g.tap(t)); g.step(1 / 60, 17); check();
  assert.ok(g.cubes.length); assert.ok(g.pending.length); assert.ok(g.undo()); check();
  assert.equal(g.cubes.length + g.pending.length, 0);
  assert.ok(g.tap(t)); feed(g, g.trucks[0], 1); check();
  assert.equal(g.canUndo(), null); assert.equal(g.undo(), false); check();
});

test('shuffle and capacity boosters conserve every colour and maintain box units', () => {
  const { g, check } = fixture(2), t = g.trucks[1];
  const cap = g.slotCount;
  assert.ok(g.shuffle(t)); check();
  assert.ok(g.addConveyorSlot()); assert.equal(g.slotCount, cap + 1); check();
  assert.ok(g.addBaySlot(t)); assert.equal(t.cap, 5); check();
  assert.ok(g.tap(t)); check();
  assert.equal(g.addBaySlot(t), false, 'do not move pockets under a pending pour');
  assert.ok(g.undo()); check();
});

test('expanded tray delivers four boxes and preserves the remaining colour', () => {
  const { g, check } = fixture(2);
  const boxes = g.trucks.flatMap(t => t.blocks);
  const pink = boxes.filter(b => b.color === 'PNK'), white = boxes.filter(b => b.color === 'W');
  const [target, source, other] = g.trucks;
  assert.ok(g.addBaySlot(target));
  target.blocks = [pink.pop(), ...white]; source.blocks = pink; other.blocks = [];
  check(); assert.ok(g.deliver(target)); check();
  assert.equal(target.gone, false); assert.equal(target.blocks.length, 1);
  assert.equal(target.blocks[0].color, 'PNK'); assert.equal(g.delivered.W, 16);
  assert.ok(g.tap(source)); feed(g, target, 12); check();
  g.step(0, 1000); check(); assert.equal(g.state, 'win');
});

test('revive clears pending, partial, reserved and airborne candies without ghosts', () => {
  for (const count of [0, 2, 4, 5]) {
    const { g, check, initial } = fixture();
    assert.ok(g.tap(g.trucks[0]));
    if (count) feed(g, g.trucks[1], count);
    if (count === 5) assert.equal(g.shuffle(g.trucks[1]), false, 'packing blocks cannot be reordered');
    check(); const color = g.revive(); check();
    assert.equal(color, 'LB'); assert.equal(g.revived.LB, initial.LB);
    assert.equal(g.flying.length, 0); assert.equal(g.candyCount(), 0);
    assert.equal(g.history.length, 0); assert.equal(g.undo(), false);
    g.step(0, 2000); check(); assert.equal(g.state, 'win');
    assert.equal(g.revive(), null);
  }
});

test('revive reindexes surviving flights above removed boxes, preserving position', () => {
  const { g, initial, check } = fixture(2);
  // Redistribute the real level's eight boxes into a reachable packing shape.
  const stock = g.trucks.flatMap(t => t.blocks);
  const pink = stock.filter(b => b.color === 'PNK'), white = stock.filter(b => b.color === 'W');
  assert.equal(pink.length, 4); assert.equal(white.length, 4);
  const [target, source, other] = g.trucks;
  target.blocks = [pink.pop(), white.pop()]; source.blocks = pink; other.blocks = white;
  check(); assert.ok(g.tap(source)); assert.ok(g.tap(other));
  feed(g, target, 5, 'W'); check();
  const before = new Map(g.flying.map(f => [f, E.flyPos(f, 0)]));
  assert.equal(g.revive(), 'PNK'); check();
  assert.equal(g.revived.PNK, initial.PNK);
  for (const f of g.flying) {
    const p = E.flyPos(f, 0), old = before.get(f);
    assert.ok(Math.hypot(p.x - old.x, p.y - old.y) < 1e-9, 'retarget does not teleport');
    assert.ok(f.slot === 1 || f.slot === 2);
  }
  feed(g, target, 7, 'W'); check();
  g.step(0, 2000); check(); assert.equal(g.state, 'win'); assert.equal(g.delivered.W, 16);
});

test('a full conveyor with accepting trays drains instead of losing', () => {
  const { g, check } = fixture(2);
  for (const t of g.trucks) while (t.blocks.length) assert.ok(g.tap(t));
  check(); assert.equal(g.counter(), g.slotCount); assert.equal(g.candyCount(), g.capCubes);
  assert.equal(g.isStuck(), false);
  // Put the actual poured stock on the rail: pending/flying must not be the reason
  // isStuck returns false. The full belt has open destinations and should drain.
  g.cubes = g.pending.map((p, i, all) => {
    const q = g.ring[Math.floor(i * g.ring.length / all.length)];
    return { x: q.x, y: q.y, vx: 0, vy: 0, color: p.color, rot: 0, sz: 1, landed: true };
  });
  g.pending = []; check();
  assert.equal(g.flying.length, 0); assert.equal(g.isStuck(), false);
  for (let frame = 1; frame <= 180 && g.counter() === g.slotCount; frame++) {
    g.step(1 / 60, frame * 1000 / 60); check();
    assert.equal(g.state, 'play');
  }
  assert.ok(g.counter() < g.slotCount, 'full physical belt drains without a tap');
});

// Audit the production bot's actual physics runs on every frame and mutation.
class AuditedGame extends Game {
  constructor(id) { super(id); this.expected = stock(this); }
  step(...args) { const r = super.step(...args); audit(this, this.expected); return r; }
  tap(...args) { const r = super.tap(...args); audit(this, this.expected); return r; }
}
test('real shipped levels complete with ordinary belt physics and audited conservation', () => {
  for (const id of [1, 2, 3, 4, 5]) {
    // The fixed policy jams on level 2. A deterministic exploratory policy proves
    // a winning line without changing either the board or the production bot.
    const result = playOnce({ ...E, Game: AuditedGame }, id, id === 2 ? 32 : 1, id === 2 ? .15 : 0);
    assert.equal(result.win, true, `level ${id}: ${JSON.stringify(result)}`);
    console.log(`  level ${id}: ${result.taps} taps, ${result.secs.toFixed(1)} seconds, peak ${result.peak}/${result.cap}`);
  }
  const result = playOnce({ ...E, Game: AuditedGame }, 2, 1);
  console.log(`  level 2 fixed bot: ${result.state} (conservation audited through the entire run)`);
});

test('2D draw commands contain exactly the real candies through pending and partial packing', () => {
  // Each candy paints one highlight ellipse. Spy on the real fallback's drawing
  // commands to catch missing pending pieces or simultaneous box/flight copies.
  let candies = 0;
  const ctx = new Proxy({}, { get(target, key) {
    if (key in target) return target[key];
    if (key === 'ellipse') return () => { candies++; };
    if (String(key).startsWith('create')) return () => ({ addColorStop() {} });
    return () => {};
  } });
  const savedWindow = globalThis.window;
  try {
    globalThis.window = { devicePixelRatio: 1 };
    E.initCanvas({ getContext: () => ctx, getBoundingClientRect: () => ({ width: 600, height: 800 }) });
    const { g, check } = fixture(); E.setGame(g);
    const rendered = (n) => { candies = 0; E.draw(g.now); assert.equal(candies, n); check(); };
    rendered(16);
    assert.ok(g.tap(g.trucks[0])); rendered(16);
    feed(g, g.trucks[1], 3); rendered(16);
    g.step(0, 1000); rendered(16);
    feed(g, g.trucks[1], 9); rendered(16);
    g.step(0, 2000); rendered(0);
  } finally {
    if (savedWindow === undefined) delete globalThis.window; else globalThis.window = savedWindow;
  }
});

console.log(`${tests} tests passed; ${audits} conservation/state audits. Data: ${data}`);
