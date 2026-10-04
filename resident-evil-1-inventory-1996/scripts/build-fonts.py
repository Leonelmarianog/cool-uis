"""Build the inventory's two colour fonts from the game's sprite sheets.

Run with Python 3, ffmpeg and fontTools installed (pip install --user fonttools):

    python3 scripts/build-fonts.py

re1-text is the serif font of design/font-sprites.png; re1-digits is the green
set of counter digits of design/ui-sprites.png. Each sheet pixel becomes a
100-unit square, and each glyph is a COLRv0 glyph with one layer per sheet
colour, so outlines and shading keep their exact colours. The sheets stay
untouched; the fonts are written to src/assets/fonts/. Black is background.
"""

from pathlib import Path
import subprocess

from fontTools.colorLib.builder import buildCOLR, buildCPAL
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'src' / 'assets' / 'fonts'
PIXEL = 100
BACKGROUND = (0, 0, 0)
SKIP = '\0'

# Serif cells are 8 x 14 pixels; row r starts at y = 28 + 14r. Each entry is
# (sheet row, first cell, characters); SKIP leaves a cell out. The cell after
# "," holds the game's closing quote, used for '"'.
TEXT_ROWS = [
    (0, 12, '012345'),
    (1, 0, '6789:;,"!?' + SKIP + 'ABCDEFG'),
    (2, 0, 'HIJKLMNOPQRSTUVWXY'),
    (3, 0, "Z(/)'-" + SKIP + 'abcdefghijk'),
    (4, 0, 'lmnopqrstuvwxyz'),
    (6, 13, '.'),
]


def read_sheet(path):
    """Decodes a PNG into rows of (r, g, b) tuples with ffmpeg."""
    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', str(path)],
        capture_output=True, text=True, check=True,
    )
    width, height = map(int, probe.stdout.strip().split(','))
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
        capture_output=True, check=True,
    ).stdout
    return [[tuple(raw[(y * width + x) * 3:(y * width + x) * 3 + 3]) for x in range(width)] for y in range(height)]


def cut(sheet, left, top, width, height):
    """Groups a cell's pixels by colour: {colour: {(column, row), ...}}."""
    layers = {}
    for row in range(height):
        for column in range(width):
            colour = sheet[top + row][left + column]
            if colour != BACKGROUND:
                layers.setdefault(colour, set()).add((column, row))
    return layers


def outline(pixels, ascent_rows):
    """Draws pixels as one glyph: the outside of each connected area, clockwise."""
    edges = set()
    for column, row in pixels:
        x, y = column * PIXEL, (ascent_rows - row) * PIXEL
        corners = [(x, y), (x + PIXEL, y), (x + PIXEL, y - PIXEL), (x, y - PIXEL)]
        for start, end in zip(corners, corners[1:] + corners[:1]):
            if (end, start) in edges:
                edges.remove((end, start))
            else:
                edges.add((start, end))
    ends_by_start = {}
    for start, end in edges:
        ends_by_start.setdefault(start, []).append(end)
    pen = TTGlyphPen(None)
    while ends_by_start:
        first = next(iter(ends_by_start))
        point = first
        pen.moveTo(point)
        while True:
            ends = ends_by_start[point]
            end = ends.pop()
            if not ends:
                del ends_by_start[point]
            if end == first:
                break
            pen.lineTo(end)
            point = end
        pen.closePath()
    return pen.glyph()


def palette_of(glyphs):
    """Every colour the glyphs use, lightest first; a colour's index is its palette entry."""
    return sorted({colour for layers in glyphs.values() for colour in layers}, key=sum, reverse=True)


def build_font(name, glyphs, units_per_em, ascent_rows, advance):
    """Writes one COLRv0 WOFF font; glyphs maps each character to its colour layers."""
    palette = palette_of(glyphs)
    empty = TTGlyphPen(None).glyph()
    order = ['.notdef', 'space']
    outlines = {'.notdef': empty, 'space': TTGlyphPen(None).glyph()}
    left_sides = {'.notdef': 0, 'space': 0}
    cmap = {ord(' '): 'space'}
    colr = {}
    for character, layers in glyphs.items():
        base = f'uni{ord(character):04X}'
        pixels = set().union(*layers.values())
        order.append(base)
        cmap[ord(character)] = base
        outlines[base] = outline(pixels, ascent_rows)
        left_sides[base] = min(column for column, _ in pixels) * PIXEL
        colr[base] = []
        for colour in sorted(layers, key=palette.index):
            index = palette.index(colour)
            layer = f'{base}.layer{index}'
            order.append(layer)
            outlines[layer] = outline(layers[colour], ascent_rows)
            left_sides[layer] = min(column for column, _ in layers[colour]) * PIXEL
            colr[base].append((layer, index))

    ascent = ascent_rows * PIXEL
    descent = units_per_em - ascent
    builder = FontBuilder(units_per_em, isTTF=True)
    builder.setupGlyphOrder(order)
    builder.setupCharacterMap(cmap)
    builder.setupGlyf(outlines)
    builder.setupHorizontalMetrics({glyph: (advance, left_sides[glyph]) for glyph in order})
    builder.setupHorizontalHeader(ascent=ascent, descent=-descent)
    builder.setupNameTable({'familyName': name, 'styleName': 'Regular'})
    builder.setupOS2(
        sTypoAscender=ascent, sTypoDescender=-descent, sTypoLineGap=0, usWinAscent=ascent, usWinDescent=descent,
    )
    builder.setupPost()
    builder.font['COLR'] = buildCOLR(colr, version=0)
    builder.font['CPAL'] = buildCPAL([[(r / 255, g / 255, b / 255, 1.0) for r, g, b in palette]])
    # A fixed timestamp keeps the output the same from one build to the next.
    builder.font['head'].created = builder.font['head'].modified = 0
    builder.font.recalcTimestamp = False
    builder.font.flavor = 'woff'
    builder.save(FONTS / f'{name}.woff')
    print(f'{name}: {len(glyphs)} glyphs; palette', ', '.join('%d #%02x%02x%02x' % ((i,) + c) for i, c in enumerate(palette)))


def main():
    text_sheet = read_sheet(ROOT / 'design' / 'font-sprites.png')
    text = {}
    for sheet_row, first_cell, characters in TEXT_ROWS:
        for offset, character in enumerate(characters):
            if character != SKIP:
                text[character] = cut(text_sheet, 8 * (first_cell + offset), 28 + 14 * sheet_row, 8, 14)
    build_font('re1-text', text, units_per_em=1400, ascent_rows=12, advance=800)

    digit_sheet = read_sheet(ROOT / 'design' / 'ui-sprites.png')
    digits = {str(n): cut(digit_sheet, 101, 3 + 8 * n, 6, 8) for n in range(10)}
    build_font('re1-digits', digits, units_per_em=800, ascent_rows=8, advance=700)


if __name__ == '__main__':
    main()
