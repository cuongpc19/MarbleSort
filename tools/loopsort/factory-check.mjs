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
    for (const b of t.blocks) add(m, b.color, g.perBlock);
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
  assert.equal(g.counter(), Math.ceil(loose / g.perBlock));
  assert.equal(g.capCubes, g.slotCount * g.perBlock);
  assert.ok(loose <= g.capCubes, 'candy capacity');
  const pockets = new Set();
  for (const f of g.flying) {
    assert.ok(!f.truck.gone, 'no flight to a delivered tray');
    assert.ok(Number.isInteger(f.piece) && f.piece >= 0 && f.piece < g.perBlock);
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
    assert.ok(t.fill >= 0 && t.fill < g.perBlock && Number.isInteger(t.fill));
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

function pourTo(g, source, target, count, color) {
  while (count > 0) {
    const waiting = g.pending.filter(p => !color || p.color === color).length;
    if (!waiting) {
      const slot = color
        ? source.blocks.findIndex(b => b.color === color && (!b.hidden || b.seen))
        : source.blocks.findLastIndex(b => !b.hidden || b.seen);
      assert.ok(slot >= 0, 'source has a selectable box of the requested colour');
      assert.ok(g.tap(source, slot), 'one source box opens');
    }
    const take = Math.min(count, g.pending.filter(p => !color || p.color === color).length);
    feed(g, target, take, color);
    count -= take;
  }
}

// Tua toi luc vien cuoi DA ha canh. Tu khi keo xep hang vao o lan luot (moi vien cach nhau
// vai chuc ms), moc gio cung nhu 2000ms co the con SOM hon vien cuoi: bai kiem truot trong khi
// engine khong sai gi - do duoc vien cuoi ha canh luc 2378ms. Chi dung cho nhung cho doi trang
// thai CUOI (thang, giao xong, ve het); cac moc gio trung gian co y nghia rieng thi giu nguyen.
const settle = (g, min = 0) => g.step(0, Math.max(min, g.now, ...g.flying.map((f) => f.at + f.ms)) + 1);

// So vien mot hop, doc tu engine. Moi con so trong cac bai duoi deu viet theo B de bai kiem
// khong phai sua lai khi doi co hop (8 -> 64).
const B = E.CANDIES_PER_BOX;
let tests = 0;
function test(name, fn) { fn(); tests++; console.log(`PASS ${name}`); }

test('64 real candies per box; palette and pocket coordinates', () => {
  assert.equal(E.PALETTE.R, '#ff4265'); assert.equal(E.PALETTE.LB, '#21d8d0');
  assert.equal(B, 64); assert.equal(E.MINIS_PER_BELT_CANDY, 1);
  assert.equal(E.MINI_CANDIES_PER_BOX, 64);
  for (const id of Object.keys(E.LEVELS)) {
    const { g, check } = fixture(id);
    assert.equal(g.perBlock, B); assert.ok(g.r >= .18 && g.r <= .22);
    assert.equal(g.perBlock * E.MINIS_PER_BELT_CANDY, E.MINI_CANDIES_PER_BOX);
    assert.equal(g.slotCount, E.LEVELS[id].SlotCount);
    assert.equal(g.slotLen, 1.68 * E.SCALE * g.fit);
    for (const t of g.trucks) {
      assert.equal(t.cap, 4);
      for (let slot = 0; slot < t.cap; slot++) for (let piece = 0; piece < g.perBlock; piece++) {
        const p = g.candyPos(t, slot, piece), c = g.slotPos(t, slot);
        const dx = p.x - c.x, dy = p.y - c.y;
        const cell = piece % 16;
        assert.ok(Math.abs(dx * t.mx + dy * t.my - (cell % 4 - 1.5) * g.slotLen * .235) < 1e-9);
        assert.ok(Math.abs(-dx * t.my + dy * t.mx - (Math.floor(cell / 4) - 1.5) * g.slotLen * .235) < 1e-9);
      }
    }
    check();
  }
});

test('clicking one selected box pours exactly its B real candies', () => {
  const { g, check } = fixture(2);
  const t = g.trucks.find(t => new Set(t.blocks.map(b => b.color)).size > 1);
  const before = [...t.blocks], slot = 1, selected = before[slot];
  before[0].hidden = true; before[0].seen = false;
  assert.equal(g.canTap(t, 0), false, 'a hidden box is not selectable');
  before[0].hidden = false; before[0].seen = true;
  assert.equal(g.tapLoad(t, slot), 1); assert.ok(g.tap(t, slot));
  assert.equal(t.blocks.length, before.length - 1);
  assert.equal(t.blocks.includes(selected), false);
  assert.equal(g.pending.length, B); assert.equal(g.counter(), 1);
  assert.deepEqual(g.pending.map(p => p.slot), Array(B).fill(slot));
  assert.deepEqual(g.pending.map(p => p.piece), [...Array(B).keys()]);
  assert.ok(g.pending.every(p => p.color === selected.color));
  assert.equal(g.canTap(t), false, 'tray waits until all pieces leave the opened box');
  const first = g.pending[0], origin = g.candyPos(first.truck, first.slot, first.piece);
  g.step(0, first.at - 1);
  assert.equal(g.cubes.length, 0, 'the lid gets its opening beat before candy exits');
  g.step(0, first.at);
  assert.equal(g.cubes[0].x, origin.x); assert.equal(g.cubes[0].y, origin.y);
  assert.ok(g.undo());
  assert.deepEqual(t.blocks, before, 'undo restores the selected box to its exact slot');
  check();
});

test('empty / partial / full / closed acceptance; partial arrival and tap lock', () => {
  const { g, check } = fixture();
  const [source, target] = g.trucks;
  assert.ok(g.tap(source));
  const remaining = source.blocks;
  source.blocks = [];
  assert.ok(g.accepts(source, 'R')); assert.ok(g.accepts(source, 'LB'));
  source.blocks = remaining;
  feed(g, target, 3); check();
  assert.equal(target.fill, 3); assert.equal(target.blocks.length, 1);
  assert.ok(g.accepts(target, 'LB')); assert.equal(g.accepts(target, 'R'), false);
  assert.equal(g.shuffle(target), false); assert.equal(g.addBaySlot(target), false);
  g.step(0, 1000); check();
  assert.equal(g.flying.length, 0); assert.equal(target.fill, 3);
  assert.equal(g.canTap(target), false); assert.equal(g.tap(target), false);
  pourTo(g, source, target, 3 * B - 3); check();
  assert.equal(target.blocks.length, 4); assert.equal(target.fill, 0);
  assert.equal(g.accepts(target, 'LB'), false);
  assert.equal(g.deliver(target), false, 'public deliver must also wait');
  settle(g, 2000); check();
  assert.ok(target.gone); assert.equal(g.accepts(target, 'LB'), false);
  assert.equal(g.delivered.LB, 4 * B); assert.equal(g.state, 'win');
});

test('last reservation landing first never finishes a box or delivers early', () => {
  const { g, check } = fixture();
  const [target, source] = g.trucks;
  assert.ok(g.tap(source)); feed(g, target, B); check();
  const block = target.blocks.at(-1);
  assert.ok(block.flying); assert.equal(target.fill, 0);
  assert.deepEqual(g.flying.map(f => f.piece), [...Array(B).keys()]);
  // Adversarial arrival order, as can happen with unequal path lengths or frame timing:
  // the last piece lands first (200ms), the first piece last (800ms).
  for (const f of g.flying) { f.at = 0; f.ms = f.piece ? 200 + (B - 1 - f.piece) * 500 / (B - 1) : 800; }
  target.arriveAt = 800;
  g.step(0, 201); check();
  assert.ok(block.flying); assert.equal(block.packedAt, undefined);
  assert.equal(g.flying.length, B - 1); assert.equal(target.gone, false);
  g.step(0, 701); check();
  assert.ok(block.flying); assert.equal(g.flying.length, 1); assert.equal(g.deliver(target), false);
  g.step(0, 800); check();
  assert.equal(block.flying, false); assert.equal(block.packedAt, 800);
  assert.ok(target.gone); assert.equal(target.drain, 800);
  assert.equal(g.state, 'win'); assert.equal(g.delivered.LB, 4 * B);
});

test('undo restores boxes from pending and physical candies; packing invalidates undo', () => {
  const { g, check } = fixture();
  const t = g.trucks[1], n = t.blocks.length;
  assert.ok(g.tap(t)); check(); assert.ok(g.undo()); check();
  assert.equal(t.blocks.length, n); assert.equal(g.candyCount(), 0);
  assert.ok(g.tap(t)); g.step(1 / 60, g.pending[0].at); check();
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
  assert.equal(target.blocks[0].color, 'PNK'); assert.equal(g.delivered.W, 4 * B);
  pourTo(g, source, target, 3 * B, 'PNK'); check();
  settle(g, 1000); check(); assert.equal(g.state, 'win');
});

test('revive clears pending, partial, reserved and airborne candies without ghosts', () => {
  for (const count of [0, 2, B, B + 1]) {
    const { g, check, initial } = fixture();
    assert.ok(g.tap(g.trucks[0]));
    if (count) pourTo(g, g.trucks[0], g.trucks[1], count, 'LB');
    if (count === B + 1) assert.equal(g.shuffle(g.trucks[1]), false, 'packing blocks cannot be reordered');
    check(); const color = g.revive(); check();
    assert.equal(color, 'LB'); assert.equal(g.revived.LB, initial.LB);
    assert.equal(g.flying.length, 0); assert.equal(g.candyCount(), 0);
    assert.equal(g.history.length, 0); assert.equal(g.undo(), false);
    settle(g, 2000); check(); assert.equal(g.state, 'win');
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
  check(); assert.ok(g.tap(source));
  for (const p of g.pending) p.at = 0;
  g.step(0, 1);
  assert.ok(g.tap(source)); assert.ok(g.tap(other));
  pourTo(g, other, target, B + 1, 'W'); check();
  const before = new Map(g.flying.map(f => [f, E.flyPos(f, 0)]));
  assert.equal(g.revive(), 'PNK'); check();
  assert.equal(g.revived.PNK, initial.PNK);
  for (const f of g.flying) {
    const p = E.flyPos(f, 0), old = before.get(f);
    assert.ok(Math.hypot(p.x - old.x, p.y - old.y) < 1e-9, 'retarget does not teleport');
    assert.ok(f.slot === 1 || f.slot === 2);
  }
  pourTo(g, other, target, 2 * B - 1, 'W'); check();
  settle(g, 2000); check(); assert.equal(g.state, 'win'); assert.equal(g.delivered.W, 4 * B);
});

test('a full conveyor with accepting trays drains instead of losing', () => {
  const { g, check } = fixture(2);
  let now = 0;
  for (const t of g.trucks) while (t.blocks.length) {
    assert.ok(g.tap(t));
    for (const p of g.pending) p.at = now;
    g.step(0, ++now);
  }
  check(); assert.equal(g.counter(), g.slotCount); assert.equal(g.candyCount(), g.capCubes);
  assert.equal(g.isStuck(), false);
  // Put the actual poured stock on the rail: pending/flying must not be the reason
  // isStuck returns false. The full belt has open destinations and should drain.
  g.cubes = g.cubes.map((p, i, all) => {
    const q = g.ring[Math.floor(i * g.ring.length / all.length)];
    return { x: q.x, y: q.y, vx: 0, vy: 0, color: p.color, rot: 0, sz: 1, landed: true };
  });
  g.pending = []; check();
  for (const t of g.trucks) t.pourUntil = 0;
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
  // Closed cartons deliberately hide their contents. Each exposed candy paints one
  // highlight ellipse, so count pending, loose, flying and arrived partial pieces only.
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
    const visible = () => g.pending.length + g.cubes.length + g.flying.length +
      g.trucks.reduce((n, t) => {
        for (let slot = 0; slot < t.blocks.length; slot++) if (t.blocks[slot].flying)
          n += g.perBlock - g.flying.filter(f => f.truck === t && f.slot === slot).length;
        if (t.fill) n += t.fill - g.flying.filter(f => f.truck === t && f.slot === t.blocks.length).length;
        return n;
      }, 0);
    const rendered = () => { candies = 0; E.draw(g.now); assert.equal(candies, visible()); check(); };
    rendered();
    assert.ok(g.tap(g.trucks[0])); rendered();
    feed(g, g.trucks[1], 3); rendered();
    g.step(0, 1000); rendered();
    pourTo(g, g.trucks[0], g.trucks[1], 3 * B - 3, 'LB'); rendered();
    settle(g, 2000); rendered(); assert.equal(candies, 0);
  } finally {
    if (savedWindow === undefined) delete globalThis.window; else globalThis.window = savedWindow;
  }
});

console.log(`${tests} tests passed; ${audits} conservation/state audits. Data: ${data}`);
