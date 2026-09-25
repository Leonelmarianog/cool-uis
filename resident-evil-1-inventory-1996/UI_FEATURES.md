# Inventory UI features and actions

Current feature catalog for this project. **Implemented** means available in
the current UI; **Partial** means the control exists but its intended behavior
is incomplete; **Planned** means the feature is not available yet. **Demo**
identifies a review control rather than gameplay behavior.

For implementation history and item rules, see [INVENTORY_ACTIONS.md](INVENTORY_ACTIONS.md).

## Inventory selection and item menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| View inventory | Implemented | Eight slots arranged in two columns and four rows, with item artwork and empty slots. |
| Select a slot | Implemented | Hover or keyboard focus selects a slot; arrow keys move between adjacent slots. A pulsing red outline marks selection. |
| View item name | Implemented | The bottom panel follows the selected item; empty slots have no item name. |
| View item amounts | Implemented | Weapons show loaded rounds and ammunition shows stack amounts. Herbs and sprays have no quantity label. |
| Open item actions | Implemented | Click or press Enter/Space on an occupied slot to open its menu in the preview panel. Empty slots do not open a menu. |
| Navigate item actions | Implemented | Hover, Up/Down, Home/End, or Tab/Shift+Tab selects an option. Weapons offer EQUIP / CHECK / COMBN; other items offer USE / CHECK / COMBN. |
| Close item actions | Implemented | Escape closes the menu and returns focus to the source slot. |
| Equip a weapon — EQUIP | Implemented | Sets the selected weapon as equipped and updates the equipped weapon panel. Only one weapon can be equipped at a time. |
| Unequip a weapon — EQUIP again | Implemented | Selecting EQUIP on the equipped weapon clears its artwork and ammo from the equipped panel. |
| Use an item — USE | Partial | Currently displays “This item cannot be used by itself.” No item is consumed and health does not change. Healing, curing, and contextual use remain pending. |
| Examine an item — CHECK | Planned | The option is visible but unavailable. Intended examination requires a 3D item model with rotation about all axes; models, rendering, and controls remain to be implemented. |

## Combine items — COMBN

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Start combining | Implemented | COMBN keeps the red source outline and the visible, inactive action menu. Green inward arrows mark the target slot. |
| Select a combination target | Implemented | Hover, arrows, or Tab/Shift+Tab changes the target and its displayed name. Click or Enter/Space attempts the combination. |
| Cancel target selection | Implemented | Escape returns to COMBN in the source menu. A second Escape closes that menu. |
| Reload the handgun | Implemented | Combine handgun and clip in either order. Transfers available rounds up to the handgun's 15-round capacity. |
| Synchronize equipped ammunition | Implemented | Reloading the equipped handgun also updates the ammo shown in the equipped weapon panel. |
| Merge ammunition stacks | Implemented | Combine two clips to fill the larger stack, up to 255 rounds. Overflow stays in the other slot; a full receiving stack rejects the action. |
| Mix green + green herbs | Implemented | Produces a G+G mixture after confirmation. |
| Mix green + red herbs | Implemented | Produces a G+R mixture after confirmation, in either selection order. |
| Confirm herb mixing | Implemented | “Will you mix these herbs?” offers Yes/No. Yes applies the recipe; No or Escape returns to target selection without consuming anything. |
| Reject an invalid combination | Implemented | Self-selection, empty targets, unsupported pairs, and full reload/stack destinations show feedback without changing items. |
| Remove consumed items | Implemented | Exhausted clips and consumed recipe ingredients leave empty slots. A mixed herb replaces the source item. |
| Restore selection after combining | Implemented | Success closes the menu and focuses the source result, or the surviving target if the source was consumed. |
| Compact inventory after consumption | Planned | Empty slots currently remain in place; items do not automatically shift to fill gaps. |
| Additional recipes and ammunition families | Planned | Only handgun/clip reloads, clip stacking, G+G, and G+R combinations are currently supported. |

## Feedback and controls

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Display action feedback | Implemented | Messages and herb confirmation temporarily replace the item name in the bottom panel. |
| Dismiss feedback | Implemented | Click, Enter, Space, or Escape dismisses an informational message and returns to the action menu or combination target selection. |
| Keep interaction focused | Implemented | Unrelated inventory, status, and main-menu controls are blocked while an item action or message is active. Tab stays within the active menu, target selection, or dialog. |
| Keyboard access | Implemented | Buttons support Enter/Space activation and visible focus. Slot labels include item names and amounts; menus and dialogs have accessible labels. |

## Main menu

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Open map — MAP | Partial | Button and hover/focus styling exist, but no map screen is connected. |
| Open files — FILE | Partial | Button and hover/focus styling exist, but no file browser or document reader is connected. |
| Leave inventory — EXIT | Partial | Button and hover/focus styling exist, but closing the inventory or returning to gameplay is not connected. |
| Blank dash panel | Implemented | Decorative only; it has no action. |

## Display and review features

| Feature / action | Status | Behavior |
| --- | --- | --- |
| Character portrait | Implemented | Displays Jill's portrait in its decorative housing. No character-switch action is connected. |
| Equipped weapon display | Implemented | Shows the equipped weapon's artwork and current ammo; remains empty when unequipped. |
| Item preview area | Partial | The framed area hosts the item action menu. It does not yet render an examined item or 3D model. |
| Animated health display | Implemented | ECG sweep supports Fine (green), Fine (yellow), Caution, Danger!, and Poison!; the last three labels blink. |
| Cycle health appearance | Demo | Clicking the ECG, or activating it with Enter/Space, cycles through the five states. This is independent of item use and actual health values. |
| Responsive inventory layout | Implemented | Panels, artwork, and text scale together to fit the viewport, with scrolling available below the minimum layout size. |
| Reset sample inventory | Demo | Reloading the page restores handgun 10, clips 15/250, green/red/green herbs, and two empty slots. There is no dedicated reset button or saved inventory state. |

## Related actions requiring future integration

These actions are not available in the current UI. Their detailed behavior
requires the corresponding item rules, assets, or game context.

| Feature / action | Status | Remaining scope |
| --- | --- | --- |
| Heal or cure with USE | Planned | Define effects, connect actual health/poison state, consume the item, and handle unnecessary use. |
| Use keys or puzzle items | Planned | Supply a world-use context and item-specific rules. |
| Pick up an item | Planned | Add pickup confirmation, inventory insertion, and full-inventory feedback. |
| Transfer items through an item box | Planned | Add storage UI and transfers into and out of the inventory. |
| Discard a spent key | Planned | Add the contextual prompt and rules for a key that is no longer needed. |
| Persist inventory state | Planned | Save and restore items, counts, and equipped state instead of resetting on page reload. |

General drop, manual move, and sort commands are not established features of
this recreation; they require reference support before being added to scope.
