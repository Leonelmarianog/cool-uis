# Inventory interaction plan

Build and visually review one branch at a time. Branch names below share the
`resident-evil-1-inventory-1996/feat/` prefix. Later branches start from the
approved preceding work; do not open all branches or merge automatically.

The supplied sprite sheet documents artwork, not item rules. The GIF confirms
weapon options EQUIP / CHECK / COMBN. The following is an implementation
checklist; exact recipes, item descriptions, healing amounts, weapon capacities,
and context-dependent uses still need rules/reference material before coding.

| Branch | Actions and outcomes |
| --- | --- |
| `item-actions-menu` | Select an occupied slot; show its name; confirm to open its menu; navigate options; cancel to close and restore slot focus. Weapons show EQUIP, other items USE; both show CHECK and COMBN. Empty slots do not open menus. Menu selection stays locked to its source item. |
| `item-action-feedback` | Dispatch a selected action; show bottom-panel feedback; confirm/cancel dismisses feedback and restores the appropriate selection. Block accidental activation of the inventory underneath. |
| `equip-item` | Equip a weapon, replace the previously equipped weapon, synchronize artwork/ammo and equipped indication, and handle selecting an already equipped weapon. Decide unequip behavior from reference. |
| `use-item` | Consume a usable healing/curing item, update health and quantity, clear an exhausted slot, and preserve selection. Reject unnecessary or standalone-invalid use with bottom-panel feedback and no mutation. Context items require an explicit world-use context. |
| `check-item` | Enter examination, show description/preview, navigate available examination views, return to the source item. Any rotation, reveal, or item transformation requires item-specific assets/rules. |
| `combine-item` | Keep the source selected, choose a second occupied slot, cancel target selection, reject self/incompatible targets without consuming items, apply a valid recipe atomically, update quantities/results/empty slots and equipped ammo. Cover herbs, weapon/ammo loading and ammo stacks only with verified rules. |
| `inventory-edge-cases` | Handle last-item removal, empty inventory, quantity limits, partial combinations, full inventory, input focus, repeated inputs, and selection after mutations. |

Related actions requiring another screen/world integration: picking up an item
(including full-inventory feedback), transferring items into/out of an item box,
using keys/puzzle items in context, and prompting to discard a spent key. Do not
invent a general drop, sort, or move command without reference support.

## First branch scope

Use a small explicitly temporary sample inventory to review selection and menu
behavior. Do not infer a complete item catalog from unlabeled sprites. Implement
opening, menu navigation, and cancellation first; action execution belongs to the
subsequent branches above. Preserve the approved panel artwork and dimensions.

## Progress

- `item-actions-menu`: implemented and saved as `7fb102d`. Confirm uses click or
  Enter/Space; Escape cancels. Menu navigation supports arrows, Home/End and Tab.
- `item-action-feedback`: adds the handgun CLIP sprite (column 2, row 2),
  standalone-invalid USE feedback, and EQUIP toggling. Equipping the active
  weapon unequips it, clearing its artwork/ammo from the equipped panel;
  equipping it again restores both. Click/Enter/Space/Escape
  dismiss messages and return focus to the menu; a second Escape returns to
  the inventory. Other controls are inert during menu/message interaction.
  CHECK/COMBN are marked unavailable until their dedicated branches. No item
  quantities or health mutate in this step. Message wording is provisional.
- Browser checks cover message dismissal, focus restoration, background locking,
  unavailable actions, empty slots, runtime errors, and 1440/800px layouts.
- Runtime sprite sheet is extracted with `python3 scripts/extract-item-sprites.py`
  (requires ffmpeg). It preserves the original 216 × 496 dimensions and all RGB
  values, clearing alpha for the atlas dividers and its specific background
  palette. The original design sheet remains untouched. Generated-image output
  was rejected because it changed the sprite pixels and atlas dimensions.
