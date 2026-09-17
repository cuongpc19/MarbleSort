# Candy factory engine / renderer contract

Shipped level files and their box counts remain unchanged. Each standard tray holds
four boxes. A box pours eight large conveyor batches in a 2 x 4 source layout,
radius `game.r = 0.312`. A tap still pours exactly one selected box. The 3D picker
returns its `slot`; callers that omit the slot keep selecting the front box for
compatibility with bots and old tools.

Each conveyor batch separates into eight mini candies when it reaches an open box.
The box therefore fills as a 4 x 4 x 4 stack: two arriving batches complete one
16-candy layer, and all eight complete the visible 64-candy carton. This expansion
is presentation only. The engine still accounts for eight batches, preserving belt
capacity, puzzle timing and all shipped level arithmetic. The final layer remains
visible briefly before the taller coloured carton seals.

- `slotCount`, `counter()` and `tapLoad()` use **box equivalents**.
- `capCubes = slotCount * 8` uses candies.
- `candyCount()` is `cubes.length + pending.length + sum(truck.fill)`. A fully
  reserved box belongs to `blocks`, even while its flights are arriving. Do not add
  `flying.length` to material counts: every flight already belongs to fill or a box.
- `delivered[color]` and `revived[color]` retain consumed candy totals. For each
  colour, initial stock equals eight times current boxes, plus partial fills, loose
  and pending candies, plus both ledgers.

`Game.candyPos(truck, slot, piece)` is the shared world-space pocket position.
`slot` is the zero-based box index, with zero furthest from the belt. The eight
`piece` indices form four columns and two rows. Their local coordinates are
`u = (piece % 4 - 1.5) * slotLen * .20` and
`v = (floor(piece / 4) - .5) * slotLen * .36`. The u axis is `(mx,my)` and v is `(-my,mx)`.
Carton pitch and tray dimensions are preserved, including the existing level fit.

Both `pending` and `flying` records expose `slot` and `piece`. Pending candies
remain in their source pockets until spawning at `candyPos`. Draw only those
pending pieces in the source paper liner; do not leave an extra full box there.
While a selected box is opening, the row keeps a temporary gap at that slot so the
remaining boxes do not overlap it. The row compacts after the eighth candy leaves.

`truck.fill` is the partial box's reservation count, including incoming candies.
Its slot is `truck.blocks.length`. For each reserved piece, draw it at rest only
when no active flight matches the truck, slot and piece. On the eighth reservation,
the logical block is added with `flying: true` and fill resets to zero. That block
keeps its flag until **all** flights to its slot land. While flagged, render only
its arrived pockets. Build the complete packed box after the flag clears.

**One partial box per colour.** `Game.canStart(t, color)` refuses to start a box of a
colour that another tray is already packing, and `absorb()` asks it before every pickup.
Without it the eight candies of one box are picked up by whichever tray each one passes
first, so a box can be split across two trays; neither ever reaches eight, and
both trays freeze (packing locks taps, and they accept only a colour that has run out).
Measured before the rule: 79 of 95 lost bot games on the first 20 original levels ended
that way. Candy moves in multiples of eight, so with a single partial box of `f` candies at
least `8 - f` more always exist and the box can always close.

`arriveAt` is the latest flight arrival for a tray. Delivery waits for every flight
and partial box, including when `deliver()` is called directly. Partial packing
locks taps and shuffle. Adding a tray slot waits for packing and pending pours;
revive cancels the removed colour's flights and retargets survivors after reindexing.

The shared `PALETTE` export supplies the bright candy colours. Renderer dimensions:
the raised tray deck is `BODY_H=.74`; loose conveyor candy uses a 1.18 visual scale;
and open-carton minis are laid out at `slotLen * .155` pitch. Their four layers rise
inside real side walls, while a completed carton has a `.72`-high body and an opaque
colour lid. Only opening and partial cartons expose their stacked minis. Source
transfers use a small bridge hop; incoming flights use a higher arc and landing
squash. Near the carton mouth each large batch contracts and separates into eight
minis; they follow a staggered curved stream into their exact row positions. A
selected source carton briefly retains its lid, which springs up and slides back
before the outgoing batches clear. The landed minis settle row by row, then the lid
closes.

The play scene deliberately contains only the conveyor, trays, cartons and candies.
There is no surrounding workbench slab, decorative corner machinery, sales hatch or
delivery route. The conveyor uses one support, one casing and one moving belt surface;
a completed tray closes, settles into its own station and disappears after 520 ms.
Height is renderer-owned; engine flight coordinates are planar.

Run `node tools/loopsort/factory-check.mjs` for conservation, pocket/arrival,
acceptance, undo/revive/booster, draw-command and shipped-level play checks. The
fixed bot wins levels 1–5 with the same individual-box selection rule. These are
reproducible sample solutions, not a difficulty or win-rate claim.
