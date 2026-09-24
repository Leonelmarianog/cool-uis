"""Remove this reference atlas's backdrop without resampling its artwork.

Run with Python 3 and ffmpeg installed. Only alpha values change; the source
under design/ remains untouched. The narrow color key matches the reference's
dark-blue background, including the small color variations in that background.
It deliberately excludes black/grays and the blue items' brighter colors.
"""

from pathlib import Path
import struct
import subprocess
import zlib

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT / 'design/item-sprites.png'
OUTPUT = PROJECT / 'src/assets/item-sprites.png'
WIDTH, HEIGHT = 216, 496


def chunk(kind, data):
    return (struct.pack('>I', len(data)) + kind + data
            + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff))


def main():
    source = SOURCE.read_bytes()
    assert struct.unpack('>II', source[16:24]) == (WIDTH, HEIGHT)
    original = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(SOURCE),
        '-f', 'rawvideo', '-pix_fmt', 'rgba', '-',
    ])
    assert len(original) == WIDTH * HEIGHT * 4
    pixels = bytearray(original)
    removed = 0
    for y in range(HEIGHT):
        for x in range(WIDTH):
            offset = (y * WIDTH + x) * 4
            red, green, blue, _ = original[offset:offset + 4]
            divider = x % 43 in (0, 1, 42) or y % 33 in (0, 1, 32)
            backdrop = red in (8, 9) and green == 0 and blue in (74, 75, 82, 83, 90, 91)
            if divider or backdrop:
                pixels[offset + 3] = 0
                removed += 1
            assert pixels[offset:offset + 3] == original[offset:offset + 3]

    scanlines = b''.join(
        b'\0' + pixels[y * WIDTH * 4:(y + 1) * WIDTH * 4]
        for y in range(HEIGHT)
    )
    OUTPUT.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', WIDTH, HEIGHT, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(scanlines, 9))
        + chunk(b'IEND', b'')
    )
    print(f'{OUTPUT.name}: {WIDTH}x{HEIGHT}; {removed} transparent pixels; all RGB values preserved.')


if __name__ == '__main__':
    main()
