# Resident Evil 1 Inventory (1996)

A standalone Vue project using TypeScript, Vite, and plain CSS.

## Development

```sh
npm install
npm run dev
```

`npm run typecheck` checks types with `vue-tsc`; Vite itself only strips them.
`npm run build` type-checks, then creates the production bundle in `dist/`.
`npm run preview` serves that bundle locally after building.
`npm test` runs Vitest; it passes while there are no test files yet.

## Docker

From this directory, build and start the production app:

```sh
docker compose up --build -d --wait
```

Open http://localhost:8080.

The image builds with Node and serves the generated static files with Nginx.
Compose inherits the image's healthcheck, which requests `/` every 30 seconds
and marks the container unhealthy after three consecutive failures. The startup
grace period is five seconds, and each check has a three-second timeout.
Docker does not automatically restart a container solely because it is unhealthy.

```sh
docker compose ps
docker compose logs -f web
docker compose down
```

Rebuild after source changes; this setup serves a production build without hot reload.

## Structure

```text
design/               Reference screenshots, sprite sheets and recordings
docs/data-model/      Data model diagram and open questions
scripts/              extract-item-sprites.py: cuts item images from the sheet
src/
  App.vue             Layout of the 320 × 240 inventory screen
  main.ts             Vue entry point; imports shared CSS once
  components/         One component per panel
  data/               Static game data (items, recipes, characters) as JSON
  stores/             Pinia stores: player data and inventory UI state
  types/              TypeScript types for the data
  assets/
    characters/       One 30 × 30 portrait per character
    fonts/            Bundled fonts and their licenses
    items/            One 40 × 30 image per item
    ui/               Panel artwork, one image pixel per game pixel
  styles/
    main.css          Shared stylesheet import order
    tokens.css        Global CSS variables on :root
    reset.css         Small browser reset
    base.css          Document defaults and shared focus styles
UI_FEATURES.md        What the UI does today and what is planned
INVENTORY_ACTIONS.md  What the reference recordings show about each action
```

Keep values shared across components in `tokens.css`, such as
`--game-pixel` (one pixel of the game's screen), and reference them with
`var(--game-pixel)`.

Keep component layout and appearance in each Vue file's `<style scoped>` block.
Global variables inherit into scoped styles. Variables used only by one component
can be declared on that component's root class instead of adding them to `:root`.

Use BEM for CSS classes: `block`, `block__element`, and
`block__element--modifier`. For example, `item-preview-panel`,
`item-preview-panel__fastener`, and `item-preview-panel__fastener--top-left`.
Keep the base class alongside modifier classes. Each component owns its block;
parent layout classes such as `project-shell__preview-panel` can be added to a
child component. CSS variables retain their semantic names.

Put imported images and fonts under `src/assets/`; use `public/` for files
that need a fixed public URL.

## Reference

[Game UI Database](https://www.gameuidatabase.com/gameData.php?id=2179)

## Credits

Item and UI sprites ripped by Badassbill, from
[The Spriters Resource](https://www.spriters-resource.com/playstation/residentevildirectorscut/).

## Menu panel

`MenuPanel` draws the MAP / FILE / dash / EXIT housing from pixel-art PNGs in
`src/assets/ui/`. It uses locally hosted [Teko](https://fonts.google.com/specimen/Teko)
at weight 400 as an approximation of the reference lettering; its SIL Open Font
License is included alongside the font. Geometry follows the shared
`--game-pixel` scale. The MAP, FILE, and EXIT buttons emit `map`, `file`, and
`exit` events for future navigation. The dash button does nothing yet; it will
open the item box.
