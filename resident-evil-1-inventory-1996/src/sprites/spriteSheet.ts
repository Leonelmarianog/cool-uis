// All measurements are in source pixels; one source pixel is one art pixel on screen.
export interface Size {
  width: number
  height: number
}

export interface SpriteSheet {
  url: string
  /** Size of the whole image. */
  size: Size
  /** Distance from one cell to the next, including any divider. */
  cell: Size
  /** Artwork area inside each cell, offset from the cell's top-left corner. */
  frame: Size & { x: number; y: number }
}

/** One frame of a sheet, addressed by zero-based grid position. */
export interface Sprite {
  sheet: SpriteSheet
  column: number
  row: number
}
