import url from '../assets/item-sprites.png'

// Measured in source pixels; one source pixel is one art pixel on screen.
// Each cell is framed by a 1px divider, so the artwork starts 2px into it.
export const itemSpriteSheet = {
  url,
  size: { width: 216, height: 496 },
  cell: { width: 43, height: 33 },
  frame: { x: 2, y: 2, width: 40, height: 30 },
}
