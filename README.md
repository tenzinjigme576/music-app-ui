# Aether Music App UI

Mobile music streaming concept — dark mode, glassmorphism, neon accents.

## Links

| Resource | Link |
|----------|------|
| **Figma (design)** | [Aether Music App UI](https://www.figma.com/design/vwYzAz8AjBmz9okh2rLEyM/Aether-Music-App-UI?node-id=5-7) |
| **Figma (prototype)** | [Click-through prototype](https://www.figma.com/proto/vwYzAz8AjBmz9okh2rLEyM/Aether-Music-App-UI?node-id=5-7) |
| **HTML prototype** | [`prototype/index.html`](./prototype/index.html) |
| **Project hub** | [`index.html`](./index.html) |

## Interactive prototype

Click-through demo with 5 screens and wired navigation:

- **Home** — trending playlists, recently played, mini player
- **Search** — search field, tags, genre grid
- **Library** — playlist detail + track list
- **Profile** — stats and settings menu
- **Now Playing** — full player (open via cards, tracks, or mini player)

```bash
npx --yes serve prototype
# Open http://localhost:3000
```

**Flows:** Tab bar switches main screens · Cards / tracks / mini player → Now Playing · Back chevron returns to previous screen.

## Design system

- **Font:** Plus Jakarta Sans (400 / 600 / 700 / 800)
- **Colors:** Purple `#8B5CF6` · Pink `#EC4899` · Cyan `#06B6D4` · BG `#09090E` · Surface `#161621`
- **Frame:** 390 × 844 (iPhone 14)

## Repo structure

```
index.html     Project hub (links to prototype + Figma)
prototype/     Interactive HTML prototype
```

## Status

Work in progress — Figma screens and HTML prototype are in place; Behance case study and full Figma prototype wiring are still pending.
