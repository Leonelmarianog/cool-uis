# Inventory UI features and actions

Feature catalog for this project. **Implemented** means available in the
current UI; **Partial** means the control exists but its intended behavior is
incomplete; **Planned** means the feature is not available yet. **Demo**
identifies a review control rather than gameplay behavior.

For reference findings about item rules, see [INVENTORY_ACTIONS.md](INVENTORY_ACTIONS.md).

## Controls

For now, the inventory uses the mouse and two keys. Hovering moves the cursor
of the part that has input, and a left click chooses. K also chooses, like the
game's action button: it hurries typing text and closes a complete
description. Escape backs out or cancels. CHECK adds keys to turn the model.
Arrow-key navigation is planned.

## Inventory and item menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| View inventory | Implemented | The character's slots (8 for Jill) in two columns, with item images and empty slots. |
| Move the cursor | Implemented | There is one cursor. Hovering a slot moves the blinking selection frame to it; hovering a top menu button moves the cursor there instead, the grid loses its frame and the bottom panel shows no name. The top menu takes the cursor only while no item is selected. |
| View item name | Implemented | The bottom panel shows the name of the item under the cursor; empty slots show no name. |
| View item amounts | Implemented | Weapons show loaded rounds on the left; ammunition shows its stack amount on the right. Other items have no amount. |
| Open item actions | Implemented | Clicking an occupied slot selects the item: the cursor locks on it, the frame stops blinking, and the action menu grows open in the preview panel. Empty slots do nothing. |
| Choose an item action | Implemented | Weapons offer EQUIP / CHECK / COMBN; other items offer USE / CHECK / COMBN. The red frame starts on the first option and follows the hovered one. |
| Close item actions | Implemented | Escape shrinks the menu closed and unlocks the cursor. |
| Read a description | Implemented | Text in the description panel, such as "You can't use this alone.", types out. While it types, K speeds it up and Escape does nothing. Once it is complete, it stays until K or Escape closes it; then the screen returns to where the text was opened from (the action menu, the model, or picking a second item). |
| Equip a weapon — EQUIP | Implemented | Equips the weapon, replacing the equipped one, and the equipped weapon panel shows it. Choosing EQUIP on the equipped weapon unequips it. The menu then closes and the item is released. |
| Use an item — USE | Implemented | Herbs, mixed herbs, the spray and the serum raise the health status (rules in INVENTORY_ACTIONS.md) and are used up, even when they have no effect; the items after them move up. The ECG plays its heal animation and the menu closes. Ammunition and the red herb type "You can't use this alone." and key items "You can't use it here." into the description panel; the menu stays open under the text and takes input again once the text is closed. |
| Examine an item — CHECK | Implemented | The menu hides and the item's 3D model (Three.js) tumbles into the preview area; K and Escape do nothing until it has tumbled in. W/A/S/D or the red arrows rotate it, Q/E roll it, Z/C zoom; holding keeps it moving. K types the description and freezes the model. K or Escape removes the complete description; Escape then tumbles the model out and returns to the menu with CHECK framed. Every item uses one low-poly placeholder model and the Beretta's description for now (rules in INVENTORY_ACTIONS.md). |
| Combine items — COMBN | Implemented | A green target cursor picks a second item. A weapon and its ammunition reload in either order; two stacks of the same ammunition stack up to 255. Herbs with a recipe ask "Will you mix the herbs?"; the Yes/No choices show once the question is typed, and No or Escape goes back to picking a second item. Herbs without one type "Mixing these does not seem to work."; closing it also goes back to picking a second item. After a combination the menu closes and the cursor stays on the first item's slot. Other pairs do nothing. The V-JOLT bottles are not mixed yet (rules in INVENTORY_ACTIONS.md). |

## Main menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Open map — MAP | Partial | The cursor highlights the button; choosing it (click or K) logs that the map screen is not built yet. |
| Open files — FILE | Partial | The cursor highlights the button; choosing it logs that the files screen is not built yet. |
| Leave inventory — EXIT | Partial | The cursor highlights the button; choosing it logs that there is no game to go back to yet. |
| Open the item box — dash button | Partial | The cursor highlights the button; choosing it logs that the item box is not built yet. |

## Display and review features

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Character portrait | Implemented | Shows Jill's portrait in its housing. No character switch is connected. |
| Equipped weapon display | Implemented | Shows the equipped weapon's image and loaded rounds; empty when nothing is equipped. |
| Item preview area | Implemented | Hosts the item action menu and CHECK's 3D model. |
| Animated health display | Implemented | The ECG shows the player's health status: Fine (green), Fine (yellow), Caution, Danger!, or Poison!; the last three labels blink. |
| Cycle health status | Demo | Clicking the ECG sets the next worse status, wrapping from Poison! to Fine, so healing can be tried. |
| Pixel-exact layout | Implemented | The 320 × 240 layout scales by the largest whole number of screen pixels per game pixel that fits the viewport. |
| Sample inventory | Demo | Every page load starts with Beretta 10 (equipped), clips 15 and 250, green herb, red herb, first aid spray, and blue herb. Nothing is saved. |

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
