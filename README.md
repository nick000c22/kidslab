# Kids Lab

Home-screen learning games for the family iPads. Hosted on Netlify, deployed from this GitHub repo: every push goes live automatically.

## Files

- `config.js`: players, lessons, leaderboard switch. The only file you normally edit.
- `index.html`: home screen (who's playing, lesson tiles, leaderboard, grown-ups panel).
- `kit.js`: shared helpers every lesson uses (speech, stars, celebrations, score syncing).
- `lessons/`: one self-contained HTML file per lesson. `_template.html` is a starting point.
- `netlify/functions/scores.mjs`: the family leaderboard API at `/api/scores` (scores stored in Netlify Blobs).
- `adventure.js`, `adventure.css`: Teddy Adventure, the world map (the 🗺️ Explore button on each teddy). Five lands, monsters and bosses; fights use Attack / Block / Super and gym stats (no sums). Boss stats and rewards are at the top of `adventure.js`.
- `sw.js`, `manifest.webmanifest`, `icons/`: make it installable and work offline.

## Putting it on an iPad (once per iPad)

1. Open the site in **Safari**.
2. Share → **Add to Home Screen**.
3. Optional: Settings → Accessibility → **Guided Access** to lock the iPad to the app.

## Updates

Push to `main` and Netlify redeploys in about a minute. iPads pick it up next time the app opens online. To force it: on the lesson screen, hold ⚙️ for 1.5 s → Check for updates.

## Adding a player

Add a line to `players` in `config.js`. The `id` must be lowercase, unique, and never changed later, because stars are saved against it.

## Leaderboard

Each star is queued on the iPad and sent to `/api/scores` when online (works offline, sends later). "This week" resets on Monday, NZ time.
