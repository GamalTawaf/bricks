# Bricks

A browser Breakout game built with Svelte + Vite.

## Run

```
pnpm install
pnpm run dev
```

Open the printed localhost URL. `pnpm run build` produces a production build in `dist/`.

## Modes

- **Classic** — break a fixed wall of bricks; clearing it starts a new wave with a faster ball and tougher bricks.
- **Endless** — rows of bricks keep spawning from the top and drifting down, picking up speed over time. Game over if a row reaches your paddle.

Both modes: 3 lives, lose one when the ball falls past your paddle.

## Controls

- Move the paddle with your mouse, finger, or the arrow keys.
- Click, tap, or press Space to launch the ball.
- Escape to pause/resume, or use the on-screen Exit button to return to the menu.

High scores are saved per mode in your browser's `localStorage`.

## Deploy

Pushing to `main` builds the app and deploys it to GitHub Pages at https://gamaltawaf.github.io/bricks/ via `.github/workflows/deploy.yml`.

## Code layout

- `src/App.svelte` — menu / game / game-over screens
- `src/Game.svelte` — canvas rendering, game loop, input handling
- `src/lib/game/entities.js` — paddle, ball, brick objects and collision math
- `src/lib/game/classic.js`, `src/lib/game/endless.js` — per-mode logic
