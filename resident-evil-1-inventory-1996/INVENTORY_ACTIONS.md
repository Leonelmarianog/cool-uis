# Inventory actions: reference findings

What the reference recordings in `design/animations/` show about each
inventory action, to build the actions from. For what the UI does today, see
[UI_FEATURES.md](UI_FEATURES.md). Questions still open about the data model are
in [docs/data-model/open-questions.md](docs/data-model/open-questions.md).

Only rules backed by a recording or stated by the user belong here. Exact
healing amounts, item descriptions, other weapons' capacities, and other
recipes still need reference material before they are coded.

## Action menu

- `item-options-menu.gif`: weapons offer EQUIP / CHECK / COMBN. Other items
  offer USE / CHECK / COMBN.
- The buttons grow from their top-left corners in 8 steps at 60 fps. Each step
  adds 1/8 of the width and 3 pixels of height to the red frame's 43 × 24 area,
  which starts 2 pixels above the button. The red frame appears on the first
  option once the menu is fully open. Closing hides the frame first and reverses
  the steps. (The recording's 70 ms frames skip most steps.)

## EQUIP

- `equip-item.gif`: not reviewed yet. Check it before building EQUIP,
  including what choosing EQUIP on the equipped weapon does.

## USE

- `use-item-2.gif`: a mixed herb disappears after use and health changes.
  Healing amounts are not known; item data does not invent them.
- `use-item-1.gif`: not reviewed yet. Check it before building USE.
- USE on an item that is not consumable (ammunition, key items) does nothing
  and shows no message (stated by the user).

## COMBN

- `combine-cursor.gif`: while choosing the second item, the first item keeps
  its red frame and the action menu stays visible. Green inward arrows mark the
  target slot.
- `combine-item-1.gif`: Beretta 14 + clip 15 becomes Beretta 15 + clip 14, and
  the equipped weapon panel updates too. The Beretta holds **15** rounds.
- `combine-item-2.gif`: clips of 14 and 15 become 29; then 29 and 15 become 44.
  A clip stack holds at most **255** rounds (stated by the user, not shown).
- `combine-item-3.gif`: two green herbs become MIXED HERBS, which has no amount.
  Green + red is also a recipe (user's request); no recording shows it.
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
