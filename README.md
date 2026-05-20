# The Hunger Games

A browser-based Hunger Games themed web game — quiz, favorite-scene reader, plot summaries, and a 2D arena game.

## Features

- **Quiz** — 10 questions about the first Hunger Games book/movie in DE, EN, FR, ES
- **Favorite Scene** — loads text per language from `assets/page_*.txt`
- **Summary** — plot summaries in all 4 languages from `assets/summary_*.txt`
- **Arena Game** — top-down 2D canvas game with:
  - Player movement (WASD / Arrow keys) with arm animation
  - Items: Sword, Axe, Bow, Heal, Knife — each with unique controls
  - Melee combat (left-click) and ranged attacks (right-click)
  - Dummy bot for testing
  - Obstacle rocks that block projectiles
  - Inventory system (3 slots, scroll with mouse wheel or 1/2/3)

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open `http://localhost:80` in your browser.

## Controls (Arena Game)

| Key | Action |
|---|---|
| WASD / Arrow Keys | Move |
| Left-click | Attack with Sword / Axe / Knife |
| Right-click | Use Heal / Charge Bow / Throw Knife |
| E / Space | Pick up item |
| Q | Drop selected item |
| 1 / 2 / 3 | Select inventory slot |
| Mouse wheel | Cycle inventory |
| G | Take damage (testing) |

## Project Structure

```
├── assets/          # Text files for favspot & summary per language
├── public/          # Static files (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   │   ├── game/    # Game engine modules
│   │   ├── game.js  # Arena game entry point
│   │   └── quiz.js  # Quiz logic
│   └── index.html
├── server.js        # Express server (port 80)
└── package.json
```
