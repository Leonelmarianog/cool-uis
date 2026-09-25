# Sprite sheets

A **sprite sheet** is one image that holds many small pictures in a grid.
We describe each sheet once as data, then point at single pictures in it.

| Type          | Meaning                                                    |
| ------------- | ---------------------------------------------------------- |
| `SpriteSheet` | The image file and the measurements of its grid.           |
| `Sprite`      | One picture: `{ sheet, column, row }`, zero-based indices. |
| `SpriteFrame` | Vue component that crops and displays one `Sprite`.       |

Types live in `spriteSheet.ts`. Each concrete sheet (for example
`itemSpriteSheet.ts`) is a `SpriteSheet` object.

## Measurements

All numbers are in **source pixels**, measured on the original PNG. On screen,
one source pixel is one art pixel (`--ui-pixel`), so the UI scale never changes
the data.

| Field   | What to measure                                                         |
| ------- | ----------------------------------------------------------------------- |
| `url`   | The imported image (`import url from '…png'`). Vite returns its path.   |
| `size`  | Width and height of the whole image.                                    |
| `cell`  | Distance from one cell to the next one, including any divider line.     |
| `frame` | The artwork area inside a cell: its offset (`x`, `y`) and its size.     |

![Measurements of item-sprites.png: whole sheet with its size, and the first
two cells enlarged with cell, frame and divider measurements](sprite-sheet-measurements.png)

```ts
export const itemSpriteSheet: SpriteSheet = {
  url,
  size: { width: 216, height: 496 },
  cell: { width: 43, height: 33 },
  frame: { x: 2, y: 2, width: 40, height: 30 },
}
```

## How to measure a new sheet

1. **Divide.** For an evenly spaced grid, `image width ÷ columns` and
   `image height ÷ rows` give the cell size. A leftover pixel or two is usually
   an outer border.
2. **Confirm in an image editor.** Zoom in and read the cursor coordinates:
   where the first divider is, where the next cell's divider is (the `cell`
   size), and where the artwork starts and ends (the `frame`).
3. **No dividers?** For a tightly packed sheet, `frame` equals `cell` and its
   offset is `0, 0`.

Sheets where every frame has a different size need a list of frames instead of
a grid. Add that shape when a real sheet needs it.

## How a sprite is displayed

`SpriteFrame` shows the whole sheet as a CSS background and moves it so that
only one frame is visible through a frame-sized box:

```text
frame left edge  = column × cell.width  + frame.x
frame top edge   = row    × cell.height + frame.y
```

Handgun `{ column: 1, row: 0 }`: left = `1 × 43 + 2 = 45`, top = `0 × 33 + 2 = 2`.

The component passes the numbers as CSS variables. The CSS multiplies every
value by `--ui-pixel`:

| CSS property          | Value (× `--ui-pixel`)             |
| --------------------- | ---------------------------------- |
| `width`, `height`     | `frame.width`, `frame.height`      |
| `background-size`     | `size.width`, `size.height`        |
| `background-position` | `-(frame left edge)`, `-(frame top edge)` |

The position is negative because the sheet moves up and left behind the box.

## Usage

```vue
<SpriteFrame :sprite="{ sheet: itemSpriteSheet, column: 1, row: 0 }" label="Handgun" />
```

Without `label`, the sprite is decorative and hidden from assistive technology.
