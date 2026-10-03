"""Cut each item out of the reference atlas and remove its backdrop.

Run with Python 3 and ffmpeg installed. Each item becomes its own PNG in
src/assets/items/, one source pixel per image pixel. Only alpha values change;
the source under design/ remains untouched. The narrow color key matches the
reference's dark-blue background, including the small color variations in that
background. It deliberately excludes black/grays and the blue items' brighter
colors.
"""

from pathlib import Path
import struct
import subprocess
import zlib

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT / 'design/item-sprites.png'
OUTPUT = PROJECT / 'src/assets/items'
WIDTH, HEIGHT = 216, 496

# Cells are 43 x 33 including the divider lines; the artwork inside each cell is
# 40 x 30, two pixels in from the cell's top-left corner.
CELL_WIDTH, CELL_HEIGHT = 43, 33
FRAME_X, FRAME_Y = 2, 2
FRAME_WIDTH, FRAME_HEIGHT = 40, 30

# Path under src/assets/items/, ending in the item's ID -> (column, row) on the
# atlas, zero-based.
ITEMS = {
    'weapon/combat-knife': (0, 0),
    'weapon/beretta': (1, 0),
    'weapon/shotgun': (2, 0),
    'weapon/colt-python': (3, 0),
    'weapon/bazooka': (4, 0),
    'weapon/rocket-launcher': (0, 1),
    'ammo/clip': (1, 1),
    'ammo/shells': (2, 1),
    'ammo/magnum-rounds': (4, 1),
    'ammo/explosive-rounds': (1, 2),
    'ammo/acid-rounds': (2, 2),
    'ammo/flame-rounds': (3, 2),
    'key-items/v-jolt': (4, 2),
    'key-items/broken-shotgun': (0, 3),
    'key-items/square-crank': (1, 3),
    'key-items/hex-crank': (2, 3),
    'key-items/emblem': (3, 3),
    'key-items/gold-emblem': (4, 3),
    'key-items/blue-jewel': (0, 4),
    'key-items/red-jewel': (1, 4),
    'key-items/music-notes': (2, 4),
    'key-items/wolf-medal': (3, 4),
    'key-items/eagle-medal': (4, 4),
    'key-items/herbicide': (0, 5),
    'key-items/battery': (1, 5),
    'key-items/mo-disk': (2, 5),
    'key-items/wind-crest': (3, 5),
    'key-items/flare': (4, 5),
    'key-items/slides': (0, 6),
    'key-items/moon-crest': (1, 6),
    'key-items/star-crest': (2, 6),
    'key-items/sun-crest': (3, 6),
    'key-items/ink-ribbon': (4, 6),
    'key-items/lighter': (0, 7),
    'key-items/moon-crest-left-piece': (1, 7),
    'key-items/moon-crest-right-piece': (2, 7),
    'key-items/sword-key': (3, 7),
    'key-items/armor-key': (4, 7),
    'key-items/shield-key': (0, 8),
    'key-items/helmet-key': (1, 8),
    'key-items/master-key': (2, 8),
    'key-items/closet-key': (3, 8),
    'key-items/002-key': (4, 8),
    'key-items/003-key': (0, 9),
    'key-items/control-room-key': (1, 9),
    'key-items/power-room-key': (2, 9),
    'key-items/desk-key': (3, 9),
    'key-items/blank-book': (4, 9),
    'key-items/doom-book-1': (0, 10),
    'key-items/doom-book-2': (1, 10),
    'recovery-items/serum': (2, 10),
    'recovery-items/first-aid-spray': (3, 10),
    'weapon/flamethrower': (4, 10),
    'recovery-items/green-herb': (0, 11),
    'recovery-items/red-herb': (1, 11),
    'recovery-items/blue-herb': (2, 11),
    'recovery-items/mixed-herbs-g-r': (3, 11),
    'recovery-items/mixed-herbs-g-g': (4, 11),
    'recovery-items/mixed-herbs-g-b': (0, 12),
    'recovery-items/mixed-herbs-g-r-b': (1, 12),
    'key-items/empty-bottle': (4, 12),
    'key-items/water': (0, 13),
    'key-items/umb-no-2': (1, 13),
    'key-items/umb-no-4': (2, 13),
    'key-items/umb-no-7': (3, 13),
    'key-items/umb-no-13': (4, 13),
    'key-items/yellow-6': (0, 14),
    'key-items/np-003': (1, 14),
}

# Blue items whose own blue the tint removal would destroy; they keep the plain cut.
KEEP_BLUE = {'blue-jewel', 'doom-book-2', 'blue-herb'}


def chunk(kind, data):
    return (struct.pack('>I', len(data)) + kind + data
            + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff))


def write_png(path, width, height, pixels):
    scanlines = b''.join(
        b'\0' + pixels[y * width * 4:(y + 1) * width * 4]
        for y in range(height)
    )
    path.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(scanlines, 9))
        + chunk(b'IEND', b'')
    )


def is_backdrop(red, green, blue):
    return red in (8, 9) and green == 0 and blue in (74, 75, 82, 83, 90, 91)


def is_blue_tinted(red, green, blue):
    return blue - max(red, green) >= 15


def is_edge(pixels, x, y):
    """Whether the pixel touches transparency or the image border."""
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if not (0 <= nx < FRAME_WIDTH and 0 <= ny < FRAME_HEIGHT):
            return True
        if pixels[(ny * FRAME_WIDTH + nx) * 4 + 3] == 0:
            return True
    return False


def remove_blue_tint(pixels):
    """Remove the blue the reference's backdrop blended into the artwork.

    Dark blue pixels anywhere (outlines, shadows, thin parts like a trigger
    guard) and blue-tinted pixels on the item's edge get their blue lowered to
    match their red and green. No pixel is deleted, so thin parts keep their
    shape. Brighter pixels inside the item keep their color, which protects
    blue items and blue details.
    """
    for y in range(FRAME_HEIGHT):
        for x in range(FRAME_WIDTH):
            offset = (y * FRAME_WIDTH + x) * 4
            red, green, blue, alpha = pixels[offset:offset + 4]
            # No brighter than the backdrop's lightest blue, so vivid blue details stay.
            dark = max(red, green) <= 42 and blue <= 91
            if alpha and is_blue_tinted(red, green, blue) and (dark or is_edge(pixels, x, y)):
                pixels[offset + 2] = max(red, green)


def cut_item(atlas, column, row, keep_blue):
    left = column * CELL_WIDTH + FRAME_X
    top = row * CELL_HEIGHT + FRAME_Y
    pixels = bytearray()
    for y in range(top, top + FRAME_HEIGHT):
        for x in range(left, left + FRAME_WIDTH):
            offset = (y * WIDTH + x) * 4
            red, green, blue, alpha = atlas[offset:offset + 4]
            if is_backdrop(red, green, blue):
                alpha = 0
            pixels += bytes((red, green, blue, alpha))
    if not keep_blue:
        remove_blue_tint(pixels)
    return pixels


def main():
    source = SOURCE.read_bytes()
    assert struct.unpack('>II', source[16:24]) == (WIDTH, HEIGHT)
    atlas = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(SOURCE),
        '-f', 'rawvideo', '-pix_fmt', 'rgba', '-',
    ])
    assert len(atlas) == WIDTH * HEIGHT * 4

    for name, (column, row) in ITEMS.items():
        path = OUTPUT / f'{name}.png'
        path.parent.mkdir(parents=True, exist_ok=True)
        keep_blue = path.stem in KEEP_BLUE
        write_png(path, FRAME_WIDTH, FRAME_HEIGHT, cut_item(atlas, column, row, keep_blue))
        print(f'{name}.png: {FRAME_WIDTH}x{FRAME_HEIGHT} from column {column}, row {row}.')


if __name__ == '__main__':
    main()
