# Focus Pomodoro

A calm, focused productivity screen built with React 19 and Vite. A large motivational quote sits above a Pomodoro countdown timer, and the whole canvas can be recoloured with curated background presets.

## Features

- Motivational quote with a "New Quote" button, plus on-demand fetch from a free public API.
- Pomodoro timer with full cycle: work → short break → long break. Auto-advances, plays a chime, fires a browser notification when a phase ends.
- Adjustable durations via a settings panel (gear icon).
- Six background presets, switchable from a chip row in the top bar.
- Background and timer settings persist across reloads via `localStorage`.
- Responsive layout down to mobile widths, and respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173/`).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Build for production into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run oxlint on the source tree. |

## Project layout

```
src/
  App.jsx                 # Composes the screen, owns top-level state
  App.css                 # Layout + glass-card styles
  index.css               # Base resets and CSS custom properties
  main.jsx                # React entry point
  components/
    BackgroundPicker.jsx  # Thumbnail row of background presets
    QuoteCard.jsx         # Quote display + New Quote + Fetch more
    Timer.jsx             # Pomodoro countdown engine
    TimerSettings.jsx     # Settings panel for durations
  data/
    backgrounds.js        # Curated gradient/colour presets
    quotes.js             # Local fallback quote list
  hooks/
    useLocalStorage.js    # Tiny persistence helper
```

No runtime dependencies beyond React.