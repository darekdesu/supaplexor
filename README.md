# Supaplexor

Browser-based [Supaplex](https://en.wikipedia.org/wiki/Supaplex) clone built with [Impact.js](https://impactjs.com/). Collect Infotrons, avoid hazards, reach the Exit.

## Run

Serve over HTTP — `file://` will not work.

```bash
python3 -m http.server 8080
```

- **Game:** http://localhost:8080/index.html
- **Level editor:** http://localhost:8080/weltmeister.html (save requires PHP)

## Controls

- **Arrow keys** — move (grid-based)
- **Enter** — continue after level complete

Three levels loop: `supaplex1` → `supaplex2` → `supaplex3`.

## Layout

```
index.html          game entry point
lib/game/main.js    game logic
lib/game/entities/  Murphy, Zonk, Infotron, etc.
lib/game/levels/    level data
media/              sprites
weltmeister.html    map editor
```

Optional minified build: `cd tools && ./bake.sh` (PHP).

## License

MIT — see [LICENSE](LICENSE).
