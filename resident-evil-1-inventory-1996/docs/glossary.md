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
- **Element**: an interactive part of the screen that has its own state: the
  grid, the top menu, the action menu, the prompt, the description and the
  model viewer.
  Code: `src/elements/` holds the action menu, the prompt, the description and
  the cursors. The grid's state is its cursors. The model viewer's state is
  the CHECK modes, so it has no composable.
- **Grid**: the item slots.
  Code: `InventoryGrid`.
- **Top menu**: the buttons above the grid.
  RE1: MAP, FILE, the box and EXIT.
  Code: `MenuPanel`. Not interactive yet.
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
  RE1: the red frame on a slot. It blinks, and stays dark while an item is
  selected.
  Code: `useMainCursor()`; areas are `CursorArea.Grid` and
  `CursorArea.TopMenu` (the top menu area is not built yet).
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

- The text is typed out. While it types, K speeds it up (**hurry**): one
  character per frame instead of one every 4 frames. Escape and the mouse do
  nothing.
- Nothing goes away by itself. Once a description is complete, K or Escape
  closes it. Once a prompt's choices show, No or Escape closes it, and Yes
  runs the prompt's effect.
- **Return mode**: the mode that was active when a description or prompt
  opened. Closing it goes back to that mode: to the model after an item
  description, to the action menu after "You can't use this alone." (the menu
  stays open), to picking a target after a COMBN description or prompt.
  Code: `returnMode` in `stores/inventory.ts`.

## Intents

An intent is what the user wants, on any device. Components and stores work
only with intents.

| Intent            | Mouse (now) | Keyboard             | Touch (later) |
| ----------------- | ----------- | -------------------- | ------------- |
| `point(index)`    | hover       | —                    | —             |
| `move(direction)` | —           | arrow keys (later)   | —             |
| `choose()`        | click       | K (now), Enter later | tap           |
| `back()`          | —           | Escape               | a back button |

- `choose()` has no index: it confirms the active cursor's position. A click
  or a tap is `point(index)`, then `choose()`.
- Only the element with input emits intents.
- `src/input/keyboard.ts` turns Escape into `back()` and K into `choose()`.
  The model viewer keeps its rotate and zoom keys for now.

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
| `typing-text`         | Waiting while a description or a prompt's question types; K hurries it | Description panel    |
| `reading-description` | Reading a complete description                                         | Description          |
| `answering-prompt`    | Answering a question, such as "Will you mix the herbs?"                | Prompt               |
| `opening-model`       | Waiting while the model tumbles in; no input                           | —                    |
| `viewing-model`       | Turning and zooming the item's 3D model                                | Model viewer         |
| `closing-model`       | Waiting while the model spins out; no input                            | —                    |

## Where to look

| Question                          | File                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------- |
| What does a word mean?            | `docs/glossary.md`                                                            |
| How do cursors work?              | `elements/use-cursor.ts`; this glossary lists each cursor and its owner       |
| How does the action menu work?    | `elements/use-action-menu.ts`, and `choosing-action` in `stores/inventory.ts` |
| Which options does an item get?   | `actions/available-actions.ts`                                                |
| What happens after USE?           | `actions/use.ts`                                                              |
| What does Escape do in each step? | the `back` handlers in the handler table in `stores/inventory.ts`             |
| What are the game's rules?        | `stores/player.ts`                                                            |
