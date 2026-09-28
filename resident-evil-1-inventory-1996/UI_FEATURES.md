# Inventory UI features and actions

Feature catalog for this project. **Implemented** means available in the
current UI; **Partial** means the control exists but its intended behavior is
incomplete; **Planned** means the feature is not available yet. **Demo**
identifies a review control rather than gameplay behavior.

For reference findings about item rules, see [INVENTORY_ACTIONS.md](INVENTORY_ACTIONS.md).

## Controls

For now, the inventory uses two inputs: a left mouse click enters or confirms,
and Escape backs out or cancels. This keeps the controls simple while the
features are built; more controls may be added later.

## Inventory and item menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| View inventory | Implemented | The character's slots (8 for Jill) in two columns, with item images and empty slots. |
| Move the cursor | Implemented | Hovering a slot moves the blinking selection frame to it. |
| View item name | Implemented | The bottom panel shows the name of the item under the cursor; empty slots show no name. |
| View item amounts | Implemented | Weapons show loaded rounds on the left; ammunition shows its stack amount on the right. Other items have no amount. |
| Open item actions | Implemented | Clicking an occupied slot selects the item: the cursor locks on it, the frame stops blinking, and the action menu grows open in the preview panel. Empty slots do nothing. |
| Choose an item action | Implemented | Weapons offer EQUIP / CHECK / COMBN; other items offer USE / CHECK / COMBN. The red frame starts on the first option and follows the hovered one. |
| Close item actions | Implemented | Escape shrinks the menu closed and unlocks the cursor. |
| Equip a weapon — EQUIP | Planned | Clicking the option only logs it. Should equip the weapon and update the equipped weapon panel. |
| Use an item — USE | Planned | Clicking the option only logs it. Should heal or cure with recovery items and consume them; on other items it does nothing. |
| Examine an item — CHECK | Planned | Clicking the option only logs it. Should show the item as a 3D model that can be rotated. |
| Combine items — COMBN | Planned | Clicking the option only logs it. Should pick a second item, then reload a weapon, merge ammunition stacks, or mix herbs from `recipes.json`. |

## Main menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Open map — MAP | Partial | The button has its hover styling and emits `map`; no map screen is connected. |
| Open files — FILE | Partial | The button has its hover styling and emits `file`; no file browser is connected. |
| Leave inventory — EXIT | Partial | The button has its hover styling and emits `exit`; nothing leaves the inventory. |
| Open the item box — dash button | Planned | The button does nothing yet; it will open the item box. |

## Display and review features

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Character portrait | Implemented | Shows Jill's portrait in its housing. No character switch is connected. |
| Equipped weapon display | Implemented | Shows the equipped weapon's image and loaded rounds. |
| Item preview area | Partial | Hosts the item action menu. It does not yet show an examined item. |
| Animated health display | Implemented | The ECG sweep supports Fine (green), Fine (yellow), Caution, Danger!, and Poison!; the last three labels blink. |
| Cycle health appearance | Demo | Clicking the ECG cycles through the five states. It is not connected to a health value. |
| Pixel-exact layout | Implemented | The 320 × 240 layout scales by the largest whole number of screen pixels per game pixel that fits the viewport. |
| Sample inventory | Demo | Every page load starts with Beretta 10 (equipped), clips 15 and 250, green herb, red herb, and first aid spray. Nothing is saved. |

## Planned screens and characters

| Feature | Status | Remaining scope |
| --- | --- | --- |
| Map screen | Planned | Opened by MAP. |
| Files screen | Planned | Opened by FILE; lists and shows the documents. |
| Item box | Planned | Opened by the dash button; moves items into and out of the inventory. |
| Other characters | Planned | Add Chris (6 slots) with his portrait and a shorter inventory grid. |

This is a clone of the inventory UI, not a game: there is no game world, so
items are never picked up and key items are never used on anything. General
drop, manual move, and sort commands are not established features of this
recreation; they require reference support before being added to scope.
