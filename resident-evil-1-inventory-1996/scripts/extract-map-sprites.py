"""Cut the map's sprites out of the map sheet.

Run with Python 3 and ffmpeg installed. Each sprite becomes its own PNG in
src/assets/map/, one source pixel per image pixel; the source under design/
remains untouched. The sheet's black background becomes transparent in every
sprite except the aerial view, which is a full picture.

The sheet is Badassbill's rip of the Resident Evil DX map; the README credits it.
"""

from pathlib import Path
import struct
import subprocess
import zlib

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT / 'design/map-sprites.png'
OUTPUT = PROJECT / 'src/assets/map'
WIDTH, HEIGHT = 292, 663
BLACK = (0, 0, 0)

# Sprite name -> (x, y, width, height) on the sheet.
SPRITES = {
    'aerial': (125, 125, 160, 66),
    'mansion': (169, 5, 50, 61),
    'arrow-up-grey': (169, 73, 5, 3),
    'arrow-up-green': (177, 73, 5, 3),
    'arrow-down-grey': (185, 68, 5, 3),
    'arrow-down-green': (193, 68, 5, 3),
    'floor-1f': (7, 175, 159, 94),
    'floor-2f': (8, 277, 154, 76),
}

# Sprites whose black stays opaque.
OPAQUE = {'aerial'}

# Sheet rectangles (x, y, width, height) cleared inside a sprite: the red
# position dots and the aerial view's corner both fall inside the 1F map's
# rectangle.
CLEARED = {
    'floor-1f': [(14, 181, 44, 6), (125, 175, 41, 16)],
}


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


def is_cleared(name, x, y):
    return any(
        left <= x < left + width and top <= y < top + height
        for left, top, width, height in CLEARED.get(name, [])
    )


def cut_sprite(sheet, name, rectangle):
    left, top, width, height = rectangle
    pixels = bytearray()
    for y in range(top, top + height):
        for x in range(left, left + width):
            offset = (y * WIDTH + x) * 4
            red, green, blue = sheet[offset:offset + 3]
            transparent = is_cleared(name, x, y) or (
                name not in OPAQUE and (red, green, blue) == BLACK
            )
            pixels += bytes((red, green, blue, 0 if transparent else 255))
    return pixels


def main():
    source = SOURCE.read_bytes()
    assert struct.unpack('>II', source[16:24]) == (WIDTH, HEIGHT)
    sheet = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(SOURCE),
        '-f', 'rawvideo', '-pix_fmt', 'rgba', '-',
    ])
    assert len(sheet) == WIDTH * HEIGHT * 4

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, rectangle in SPRITES.items():
        _, _, width, height = rectangle
        write_png(OUTPUT / f'{name}.png', width, height, cut_sprite(sheet, name, rectangle))
        print(f'{name}.png: {width}x{height} from {rectangle[:2]}.')


if __name__ == '__main__':
    main()
