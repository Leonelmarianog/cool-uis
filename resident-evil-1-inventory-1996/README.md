# Resident Evil 1 Inventory (1996)

A standalone Vue project using JavaScript, Vite, and plain CSS.

## Development

```sh
npm install
npm run dev
```

`npm run build` creates the production bundle in `dist/`.
`npm run preview` serves that bundle locally after building.

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
design/             UI reference images
src/
  App.vue           Root UI and its scoped styles
  main.js           Vue entry point; imports shared CSS once
  styles/
    main.css        Shared stylesheet import order
    tokens.css      Global CSS variables on :root
    reset.css       Small browser reset
    base.css        Document defaults and shared focus styles
```

Keep values shared across components (colors, spacing, typography) in
`tokens.css`. Use semantic names such as `--color-text-muted` and reference
them with `var(--color-text-muted)`.

Keep component layout and appearance in each Vue file's `<style scoped>` block.
Global variables inherit into scoped styles. Variables used only by one component
can be declared on that component's root class instead of adding them to `:root`.

Use BEM for CSS classes: `block`, `block__element`, and
`block__element--modifier`. For example, `item-preview-panel`,
`item-preview-panel__fastener`, and `item-preview-panel__fastener--top-left`.
Keep the base class alongside modifier classes. Each component owns its block;
parent layout classes such as `project-shell__preview-panel` can be added to a
child component. CSS variables retain their semantic names.

Add reusable UI pieces under `src/components/` as needed. Put imported images and
fonts under `src/assets/`; use `public/` for files that need a fixed public URL.
Create these directories when there are assets or components to put in them.

The initial screen and token values are placeholders for the future recreation.

## Reference

[Game UI Database](https://www.gameuidatabase.com/gameData.php?id=2179)

## Menu panel

`MenuPanel` recreates the MAP / FILE / dash / EXIT housing with CSS gradients.
It uses locally hosted [Teko](https://fonts.google.com/specimen/Teko) at weight
400 as an approximation of the reference lettering; its SIL Open Font License
is included alongside the font. Geometry follows the shared `--ui-pixel` scale.
The three buttons emit `map`, `file`, and `exit` events for future navigation.
The dash is decorative. The development stack displays this component first.
