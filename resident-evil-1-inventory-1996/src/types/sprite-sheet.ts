// All measurements are in source pixels; one source pixel is one art pixel on screen.
export interface SpriteSheet {
  id: string;
  /** Image file name in `src/assets`. */
  file: string;

  /** Size of the whole image. */
  width: number;
  height: number;

  /** Distance from one cell to the next, including any divider. */
  cellWidth: number;
  cellHeight: number;

  /** Artwork area inside each cell, offset from the cell's top-left corner. */
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
