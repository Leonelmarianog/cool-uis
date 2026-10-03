# Inventory actions: reference findings

What the reference recordings in `design/animations/` show about each
inventory action, to build the actions from. For what the UI does today, see
[UI_FEATURES.md](UI_FEATURES.md). Questions still open about the data model are
in [docs/data-model/open-questions.md](docs/data-model/open-questions.md).

Only rules backed by a recording or stated by the user belong here. The item
descriptions and the weapons' capacities were given by the user.

## Action menu

- `item-options-menu.gif`: weapons offer EQUIP / CHECK / COMBN. Other items
  offer USE / CHECK / COMBN.
- The buttons grow from their top-left corners in 8 steps at 60 fps. Each step
  adds 1/8 of the width and 3 pixels of height to the red frame's 43 × 24 area,
  which starts 2 pixels above the button. The red frame appears on the first
  option once the menu is fully open. Closing hides the frame first and reverses
  the steps. (The recording's 70 ms frames skip most steps.)

## EQUIP

- `equip-item.gif`: with nothing equipped, EQUIP on the Beretta shows it in the
  equipped weapon panel at once, in the frame the menu starts closing. The menu
  closes by itself and the item is released (the slot's frame blinks again).
  The slot itself shows no "equipped" marker.
- Stated by the user: EQUIP on the equipped weapon unequips it; EQUIP on
  another weapon swaps to it (only one weapon is equipped).

## USE

- `use-item-2.gif`: MIXED HERBS (G+G) used at Danger. The menu closes and the
  herbs leave their slot; the name panel goes blank. On the ECG screen the
  trace and label vanish, a green band sweeps up from the bottom (about 5
  frames, ~350 ms), the screen stays empty for ~0.3 s, then the label returns
  as Fine and the trace restarts as yellow Fine.
- `use-item-1.gif`: USE on a CLIP types "You can't use this alone." into the
  description panel, one letter at a time; it stays about a second, then the
  panel shows "CLIP" again. The menu stays open.

Health rules (stated by the user). There are no health points, only the five
ECG statuses, in order: Poison < Danger < Caution < Fine (yellow) < Fine
(green). A status never goes past Fine (green).

| Item | From Poison | From any other status |
| --- | --- | --- |
| Green herb | nothing | +1 |
| Mixed herbs G+G | nothing | +2 |
| Mixed herbs G+R | nothing | +3 |
| Blue herb, serum | → Danger | nothing |
| Mixed herbs G+B | → Caution | +1 |
| Mixed herbs G+R+B, F.-aid spray | → Fine (green) | → Fine (green) |

- A consumable is always used up, even when it has no effect, with no message.
- USE on a red herb shows "You can't use this alone.": its only effect is to
  strengthen a green herb in a mix. A blue herb can be used alone (it cures
  poison).
- USE on ammunition shows "You can't use this alone."
- USE on a key item shows "You can't use it here." Key items only work where
  the character stands in the game world, so none can be used here.
- When an item is used up, the items after it move up to fill its slot at
  once, with no animation (checked by the user in the game).

## COMBN

The source is the item COMBN was chosen on; the target is the second item.

- `combine-cursor.gif`: after COMBN the menu stays on screen with COMBN framed,
  and the source keeps its steady dark frame. A target cursor of four small
  green triangles, pointing inward at the slot's top, bottom, left and right
  (the green arrows in `design/ui-sprites.png`), follows the pointer. The name
  panel shows the name of the item under it.
- `combine-item-1.gif`: Beretta 14 (source) + clip 15 (target) becomes Beretta
  15 + clip 14; the equipped weapon panel updates too. The Beretta holds **15**
  rounds. The menu closes and the item is released.
- `combine-item-2.gif`: clip 15 (source) + clip 14 (target) gives a clip of 29
  in the source; the target is removed and the items after it move up. Then 15
  and 29 make 44. A clip stack holds at most **255** rounds (stated by the user).
- `combine-item-3.gif`: green herb + green herb types "Will you mix the herbs?"
  into the description panel, then shows "▸Yes  No" on a second line at the
  right, with the ▸ blinking. After Yes, MIXED HERBS (no amount) takes the
  source's place and the target is removed.

Rules stated by the user:

- A while choosing a target goes back to the menu, COMBN still framed.
- Choosing the source itself or an unrelated item does nothing: no message, and
  the target cursor stays.
- Reloading works both ways: a weapon and its ammunition, in either order, move
  rounds from the ammunition into the weapon, up to its capacity.
- Stacking moves rounds from the target into the source, up to 255; any
  leftover stays in the target. A stack that reaches 0 is removed.
- A full weapon or a full stack still combines as usual (the menu closes), but
  no rounds move. For stacking, this holds when either stack is full, source
  or target.
- Herb mixes: G+G, G+R, G+B, then (G+R)+B and (G+B)+R, both making G+R+B. Red
  and blue cannot be mixed with each other; every mix needs a green. Herbs
  that do not mix show "Mixing these does not seem to work."
- "Will you mix the herbs?": Yes mixes; No or A returns to choosing a target.
  The choices appear as soon as the question is typed out; the user dropped
  the recording's 0.85 s wait.
- V-JOLT chemicals (stated by the user): WATER + UMB No. 2 → NP-003; UMB No. 2
  + UMB No. 4 → Yellow-6; NP-003 + UMB No. 4 → UMB No. 7; Yellow-6 + UMB No. 7
  → UMB No. 13; NP-003 + UMB No. 13 → V-JOLT. One V-JOLT takes 2 WATER, 3 UMB
  No. 2 and 2 UMB No. 4; the item box starts with exactly those, plus one EMPTY
  BOTTLE that nothing uses yet.
- Chemicals mix at once, with no question, like herbs after Yes: the result
  takes the first item's slot, the second item goes away and the items after
  it move up. Chemicals that do not mix do nothing; COMBN keeps waiting for a
  second item.
- The BAZOOKA (stated by the user) holds up to 6 rounds of one kind:
  EXPLOSIVE, FLAME or ACID ROUNDS. The same kind, or any kind into an empty
  BAZOOKA, reloads like any weapon. Another kind swaps: the BAZOOKA loads up
  to 6 of it, and its old rounds take the used-up stack's slot, or go after
  the last item when new rounds are left. They never join another stack.
  When they need a slot and the inventory is full, nothing happens. Its
  description follows the loaded rounds: "E.Rounds Loaded", "F.Rounds
  Loaded", "A.Rounds Loaded".
- After a successful combine, the menu closes and the item is released.
- The recipes are in `src/data/recipes.json`; capacities and stack limits are in
  `src/data/items.json`.

## CHECK

CHECK shows the item as a 3D model in the preview area, built with Three.js.

- `check-item.gif`: after CHECK the menu closes and the preview area turns dark
  navy. The model appears small and spinning in the middle, then grows to full
  size in about 0.3–0.4 s. Four small dark red triangles sit at the top,
  bottom, left and right edges of the area (they do not blink); while the model
  turns toward one of them, that one lights bright red. The model turns on both axes and zooms in
  until it fills the area and back out. The name panel keeps the item's name.
- `check-item-in-out.gif`: the description types into the description panel
  in mixed case, wrapping onto a second line ("Beretta M92FS. Automatic loaded
  with 9mm bullets.", "Clip for Beretta."). On leaving, the model spins and
  shrinks back to a point, the area goes dark, and the menu opens again with
  CHECK framed and the item still selected.

Controls (stated by the user). The inventory uses only the keyboard; the keys
follow a PS1 pad laid on the keyboard.

- The arrow keys rotate the model up, down, left and right; the red arrow of
  that direction lights up.
- Z rotates it clockwise and C counter-clockwise.
- X zooms in and V zooms out.
- Holding a key keeps the model moving until it is released.
- S types the description into the description panel. While the description
  is shown, the model is frozen in its current position and the controls do
  nothing. The description stays until S or A.
- A with the description shown removes it and gives the model's controls
  back. A without it leaves CHECK and returns to the menu.

Each item types its own description, as the game shows it (given by the
user). A description that fits on one line (32 characters) stays on one line;
a longer one breaks at the space closest to its middle, which matches the
Beretta's break in `check-item-in-out.gif`. Placeholder (stated by the user):
until real models exist, every item uses the same very low-poly model.

## Amounts

- A weapon's loaded rounds are drawn on the left of its slot (from column 6);
  other stackable items show their amount on the right (ending at column 35).
  The user checked this in the game.
- Items without an amount (the combat knife, herbs, spray, keys) show no number,
  not a hidden 1.
- The FLAMETHROWER's fuel shows like rounds, as a plain number with no "%":
  it starts at 100 (stated by the user; corrected on 2026-10-03, it was "100%"
  before).
- The BAZOOKA's counter takes the colour of its loaded rounds, also at 0:
  explosive green, flame red, acid yellow (stated by the user). This shows in
  the slot, the box row and square, and the equipped weapon panel. Every other
  counter is green. The red and yellow shades are placeholders for the user
  to adjust.

## COMBAT KNIFE

- Stated by the user: the COMBAT KNIFE is a weapon with no ammunition and no
  rounds. Its menu is EQUIP / CHECK / COMBN, like any weapon.
- Its slot, its box row and the box square show no number; equipped, the
  equipped weapon panel shows only its sprite.
- COMBN of the knife and ammunition does nothing and shows nothing, like any
  other pair that is not herbs (stated by the user).
- It starts in slot 2 (stated by the user).

## FLAMETHROWER and ROCKET LAUNCHER

- Stated by the user: no ammunition item exists for the FLAMETHROWER. It
  starts at 100 (full), and once its fuel is used up it is spent. Nothing uses fuel
  yet.
- The ROCKET LAUNCHER holds 4 rounds and has no ammunition item.
- COMBN of either with ammunition does nothing and shows nothing, like the
  combat knife.

## Item box

- `item-box.gif`: the dash button opens the item box (the clone labels it BOX,
  stated by the user). The main cursor goes to slot 1 and the list shows row 1
  in its band, dimmed. The BOX button stays lit; MAP, FILE and EXIT are dimmed.
  While the box is open the cursor cannot leave the grid.
- A yellow line marks where the loop starts again: it is always the top border
  of row 1 and does not move with the band (stated by the user).
- Empty rows read "-Nothing-", greyed out (`item-box.gif`).
- The box has 80 rows, the same for every character (stated by the user; it
  grew from 64 for the BAZOOKA). The list loops: ↑ on row 1 goes to row 80, ↓
  on row 80 goes to row 1. It always
  opens on row 1.
- S on a slot, empty or not, turns the list on. ↑ ↓ scroll it. S exchanges the
  slot with the row in the band:

| Slot | Row | Result |
| --- | --- | --- |
| item | item | the two items swap |
| empty | item | the item goes after the last inventory item |
| item | empty | the item is stored; the items after it move up |
| empty | empty | nothing; the list stays on |

- After the exchange the cursor stays on the chosen slot and the list dims.
- A weapon that leaves the inventory is unequipped; one that comes in is not
  equipped.
- Items never stack in the box, and items never move inside the box. To
  reorder the box, items go through the inventory (stated by the user).
- The description panel shows only grid items, never the row in the band.
- A with the list on goes back to the grid. A in the grid closes the box, with
  the cursor on the BOX button.

## Scope

This is a clone of the inventory UI, not a game. The screens in scope are the
inventory, the map, the files, and the item box (opened from the BOX button).
There is no game world, so items are never picked up, key items are never used
on anything, and spent keys are never discarded. Key items can still be shown
and checked. Do not invent a general drop, sort, or move command without
reference support.
