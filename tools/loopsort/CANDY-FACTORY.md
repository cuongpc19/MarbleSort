# Candy factory engine / renderer contract

Shipped level files and their box counts remain unchanged. Each standard tray holds
four boxes. Each box pours four real candies, radius `game.r = 0.36`. A tap still
pours the contiguous run of matching boxes at the tray mouth.

- `slotCount`, `counter()` and `tapLoad()` use **box equivalents**.
- `capCubes = slotCount * 4` uses candies.
- `candyCount()` is `cubes.length + pending.length + sum(truck.fill)`. A fully
  reserved box belongs to `blocks`, even while its flights are arriving. Do not add
  `flying.length` to material counts: every flight already belongs to fill or a box.
- `delivered[color]` and `revived[color]` retain consumed candy totals. For each
  colour, initial stock equals four times current boxes, plus partial fills, loose
  and pending candies, plus both ledgers.

`Game.candyPos(truck, slot, piece)` is the shared world-space pocket position.
`slot` is the zero-based box index, with zero furthest from the belt. The four
`piece` indices use local `(u,v)` signs `(-,-), (+,-), (-,+), (+,+)`, at
`game.slotLen * .19` from the box centre. The u axis is `(mx,my)` and v is `(-my,mx)`.
Carton pitch and tray dimensions are preserved, including the existing level fit.

Both `pending` and `flying` records expose `slot` and `piece`. Pending candies
remain in their source pockets until spawning at `candyPos`. Draw only those
pending pieces in the source paper liner; do not leave an extra full box there.

`truck.fill` is the partial box's reservation count, including incoming candies.
Its slot is `truck.blocks.length`. For each reserved piece, draw it at rest only
when no active flight matches the truck, slot and piece. On the fourth reservation,
the logical block is added with `flying: true` and fill resets to zero. That block
keeps its flag until **all** flights to its slot land. While flagged, render only
its arrived pockets. Build the complete packed box after the flag clears.

**One partial box per colour.** `Game.canStart(t, color)` refuses to start a box of a
colour that another tray is already packing, and `absorb()` asks it before every pickup.
Without it the four candies of one box are picked up by whichever tray each one passes
first, so a box can be split 3/1 or 2/2 across two trays; neither ever reaches four, and
both trays freeze (packing locks taps, and they accept only a colour that has run out).
Measured before the rule: 79 of 95 lost bot games on the first 20 original levels ended
that way. Candy moves in multiples of four, so with a single partial box of `f` candies at
least `4 - f` more always exist and the box can always close.

`arriveAt` is the latest flight arrival for a tray. Delivery waits for every flight
and partial box, including when `deliver()` is called directly. Partial packing
locks taps and shuffle. Adding a tray slot waits for packing and pending pours;
revive cancels the removed colour's flights and retargets survivors after reindexing.

The shared `PALETTE` export supplies the bright candy colours. Renderer dimensions:
paper at `BODY_H=.6`, candy bottom `.74` over the liner; loose candy bottom `.40`;
candy height `.45`. Packed candy width is `slotLen * .32`, loose diameter is
`game.r * 2`. Flight height interpolates from the loose to the packed bottom.
Height is renderer-owned; engine flight coordinates are planar.

Run `node tools/loopsort/factory-check.mjs` for conservation, pocket/arrival,
acceptance, undo/revive/booster, draw-command and shipped-level play checks. The
fixed bot wins levels 1, 3, 4 and 5; level 2's tested winning run uses seed 32 with
15% exploratory choices. These are reproducible sample solutions, not a difficulty
or win-rate claim.
