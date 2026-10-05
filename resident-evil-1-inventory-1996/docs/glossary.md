# Glossary

The words the inventory screen's code uses. Each entry gives the meaning, the
look in Resident Evil 1 (RE1), and the name in code. Code uses generic UI
names, so the same code can be the base of other clones.

## Screen parts

- **Panel**: a framed piece of artwork that shows information.
  RE1: the health status panel, the description panel and others.
  Code: components named `…Panel`.
- **Description panel**: the panel under the grid. It shows the item name, a
  description or a prompt.
  Code: `ItemDescriptionPanel`.
- **Item preview panel**: the panel that shows the item under the cursor.
  CHECK's model viewer shows inside it.
  Code: `ItemPreviewPanel`; the model viewer is `ItemModelViewer`.
- **Map screen**: the map, shown in the item preview panel after MAP.
  RE1: the aerial view with the chosen area and floor, then that floor's map.
  Code: `MapScreen`; the floor cursor is `useMap` (`elements/use-map.ts`).
- **Floor selector**: the aerial view with the label ("Mansion 1F") and the
  floor arrows. ↑ and ↓ change the floor.
- **Floor map**: the chosen floor's rooms on a dark-blue grid, over the dimmed
  floor selector.
- **Element**: an interactive part of the screen that has its own state: the
  grid, the top menu, the action menu, the prompt, the description and the
  model viewer.
  Code: `src/elements/` holds the action menu, the prompt, the description and
  the cursors. The grid's state is its cursors. The model viewer's state is
  the CHECK modes, so it has no composable.
- **Grid**: the item slots.
  Code: `InventoryGrid`.
- **Top menu**: the buttons above the grid.
  RE1: MAP, FILE, the box (a dash) and EXIT.
  Code: `MenuPanel`; the buttons are `TopMenuOption`. MAP opens the map
  screen and BOX the item box; FILE and EXIT only log to the console until
  their screens exist.
- **Slot**: a position in the grid.
  Code: an index, from 0.
- **Item**: the contents of a slot. Slots stay in place; when an item goes
  away, the items after it move up.
  Code: `PlayerItem` for logic, `ItemView` for display.
- **Selected item**: the item whose action menu is open.
  Code: `selectedItem` in `stores/inventory.ts`.

## Cursors

- **Cursor**: marks one position and can be moved.
  Code: `useCursor()` in `elements/use-cursor.ts`; every cursor is one, or is
  built on one.
- **Main cursor**: the one cursor of the inventory screen. Its position is an
  **area** and an **index** in that area. It shows only in its current area.
  RE1: the red frame on a slot, or the red lettering on a top menu button. On
  a slot it blinks, and stays dark while an item is selected. While it is on
  the top menu, the grid has no frame and the description panel shows no item
  name.
  Code: `useMainCursor()`; areas are `CursorArea.Grid` and
  `CursorArea.TopMenu`. `move(direction, slotCount)` steps through the grid
  and the top menu: ↑ from the grid's top row goes to the top menu button in
  the same column, ↓ from the menu's bottom row comes back.
- **Target cursor**: points at the second item for COMBN. It stays inside the
  grid.
  RE1: the four green arrows.
  Code: `targetCursor` in `stores/inventory.ts`.
- **Option cursor**: points at an option of the action menu.
  RE1: the red frame on a menu button.
  Code: `cursor` of `useActionMenu()`.
- **Choice cursor**: points at a choice of the prompt.
  RE1: the blinking arrow next to Yes or No.
  Code: `cursor` of `usePrompt()`.

The target, option and choice cursors exist only while their element is open.

## Lists to choose from

- **Action menu**: the **options** for the selected item.
  RE1: the buttons that grow in the preview panel.
  Code: `useActionMenu()`, `ItemActionMenu`.
- **Action**: what an option does.
  RE1: EQUIP, USE, CHECK and COMBN.
  Code: `ItemAction`; `src/actions/` has `equip`, `use` and `combine`.
  CHECK has no action file: it is a sequence of modes.
- **Outcome**: what an action returns, so the store can decide what comes
  next: `done`, `description`, `prompt` or `nothing`.
  Code: `Outcome`, `OutcomeKind`.
- **Prompt**: a question with **choices**, shown in the description panel.
  The prompt decides what Yes does.
  RE1: "Will you mix the herbs?" with Yes and No; later also "Do you want to
  pick up X?".
  Code: `usePrompt()`, `PromptChoice`.

## Description panel content

The description panel shows one of three things:

- **Item name**: the name of the item under the cursor, while no description
  or prompt is open. It takes no input.
- **Description**: typed text that waits for input. An **item description**
  is the kind CHECK shows; other descriptions answer an action.
  RE1: CHECK's text, "You can't use this alone.", "Mixing these does not seem
  to work.".
  Code: `useDescription()`.
- **Prompt**: see above. Its question is typed like a description; the
  choices show once the question is complete.

Rules, the same for descriptions and prompts:

- The text is typed out. While it types, S speeds it up (**hurry**): one
  character per frame instead of one every 4 frames. A and the arrow keys do
  nothing.
- Nothing goes away by itself. Once a description is complete, S or A closes
  it. Once a prompt's choices show, ← and → move between them; No or A closes
  it, and Yes runs the prompt's effect.
- **Return mode**: the mode that was active when a description or prompt
  opened. Closing it goes back to that mode: to the model after an item
  description, to the action menu after "You can't use this alone." (the menu
  stays open), to picking a target after a COMBN description or prompt.
  Code: `returnMode` in `stores/inventory.ts`.

## Intents

An intent is what the user wants, on any device. Components and stores work
only with intents.

| Intent            | Keyboard   | Touch (later)              |
| ----------------- | ---------- | -------------------------- |
| `move(direction)` | arrow keys | —                          |
| `choose()`        | S          | tap (points, then chooses) |
| `back()`          | A          | a back button              |

- `choose()` has no index: it confirms the active cursor's position.
- Only the element with input takes an intent; the others ignore it.
- The desktop UI uses only the keyboard; the mouse does nothing.
- `src/input/keyboard.ts` turns the arrow keys into `move()`, S into
  `choose()` and A into `back()`, and D into the health status demo control.
  Keys with Ctrl, Alt or Meta are left to the browser. A held key sends once.
- The model viewer reads its own keys: the arrows rotate, Z and C roll, X and
  V zoom; holding keeps the model moving.
- At an edge a cursor stops (`elements/step.ts`). The real game wraps to the
  other side.

## Lifecycle verbs and presentation events

- Elements have only `open()` and `close()`.
- An action is a function with the action's name, such as `use(item)`, and
  returns an outcome.
- Components signal the end of a presentation with a past-tense event. The
  store's handlers name the part of the UI and what happened:
  - `onDescriptionTyped()`: the description panel finished typing a
    description.
  - `onPromptTyped()`: the description panel finished typing a prompt's
    question.
  - `onItemPreviewEntered()`: the model tumbled into the item preview panel.
  - `onItemPreviewExited()`: the model spun out of the item preview panel.
  - `onMapOpened()`: the floor map grew in and its rooms are bright.
  - `onMapClosed()`: the floor map shrank out; the floor selector is back.

## Modes

A mode is a step in the flow, named after what the player is doing. Exactly
one mode is active. Only `stores/inventory.ts` changes it. The store routes
each intent through a **handler table**: one entry per mode, with a handler
per intent. A missing handler means the intent does nothing in that mode.

| Mode                  | What the player is doing                                               | Element with input   |
| --------------------- | ---------------------------------------------------------------------- | -------------------- |
| `browsing`            | Moving the main cursor over the grid (later also the top menu)         | Grid                 |
| `choosing-action`     | Picking an option in the action menu                                   | Action menu          |
| `choosing-target`     | Picking the second item for COMBN with the target cursor               | Grid (target cursor) |
| `typing-text`         | Waiting while a description or a prompt's question types; S hurries it | Description panel    |
| `reading-description` | Reading a complete description                                         | Description          |
| `answering-prompt`    | Answering a question, such as "Will you mix the herbs?"                | Prompt               |
| `opening-model`       | Waiting while the model tumbles in; no input                           | —                    |
| `viewing-model`       | Turning and zooming the item's 3D model                                | Model viewer         |
| `closing-model`       | Waiting while the model spins out; no input                            | —                    |
| `choosing-map-floor`  | Picking a floor in the map's floor selector                            | Floor selector       |
| `opening-map`         | Waiting while the floor map grows in; no input                         | —                    |
| `viewing-map`         | Looking at the floor map; A goes back                                  | —                    |
| `closing-map`         | Waiting while the floor map shrinks out; no input                      | —                    |

## Where to look

| Question                          | File                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------- |
| What does a word mean?            | `docs/glossary.md`                                                            |
| How do cursors work?              | `elements/use-cursor.ts`; this glossary lists each cursor and its owner       |
| How does the action menu work?    | `elements/use-action-menu.ts`, and `choosing-action` in `stores/inventory.ts` |
| Which options does an item get?   | `actions/available-actions.ts`                                                |
| What happens after USE?           | `actions/use.ts`                                                              |
| What does A do in each step?      | the `back` handlers in the handler table in `stores/inventory.ts`             |
| What are the game's rules?        | `stores/player.ts`                                                            |
| How does the map work?            | `elements/use-map.ts`, `components/MapScreen.vue`, and the map modes in `stores/inventory.ts` |
