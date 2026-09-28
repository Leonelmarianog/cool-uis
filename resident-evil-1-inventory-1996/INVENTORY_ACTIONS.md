# Inventory actions: reference findings

What the reference recordings in `design/animations/` show about each
inventory action, to build the actions from. For what the UI does today, see
[UI_FEATURES.md](UI_FEATURES.md). Questions still open about the data model are
in [docs/data-model/open-questions.md](docs/data-model/open-questions.md).

Only rules backed by a recording or stated by the user belong here. Item
descriptions and other weapons' capacities still need reference material
before they are coded.

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

- Escape while choosing a target goes back to the menu, COMBN still framed.
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
- "Will you mix the herbs?": Yes mixes; No or Escape returns to choosing a
  target.
- After a successful combine, the menu closes and the item is released.
- The recipes are in `src/data/recipes.json`; capacities and stack limits are in
  `src/data/items.json`.

## CHECK

- The user wants CHECK to show the item as a 3D model that can be rotated,
  built with Three.js. `check-item.gif` and `check-item-in-out.gif` are not
  reviewed yet.

## Amounts

- A weapon's loaded rounds are drawn on the left of its slot (from column 6);
  other stackable items show their amount on the right (ending at column 35).
  The user checked this in the game.
- Items without an amount (herbs, spray, keys) show no number, not a hidden 1.

## Scope

This is a clone of the inventory UI, not a game. The screens in scope are the
inventory, the map, the files, and the item box (opened from the dash button;
`item-box.gif` is not reviewed yet). There is no game world, so items are never
picked up, key items are never used on anything, and spent keys are never
discarded. Key items can still be shown and checked. Do not invent a general
drop, sort, or move command without reference support.
