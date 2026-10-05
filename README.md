# Memory Game

A browser memory game with bird photos: find all matching pairs of cards in as few moves as possible.

## How to play

- The 4×4 board holds 16 face-down cards — 8 pairs of identical birds.
- Click a card to flip it, then flip a second one.
- If the pictures match, the pair stays open. If not, both cards flip back after 1.5 seconds.
- Each pair of flipped cards counts as one move.
- The game ends when all 8 pairs are found.

## Sound

The game has sound effects for flipping a card, a match, a mismatch and a win. They are generated in the browser with the built-in Web Audio API — no audio files and no third-party libraries.

Sound is off by default. Turn it on with the **Sound** button at the bottom of the screen.

## Running locally

All you need is a modern browser.

1. Clone the repository:

   ```bash
   git clone git@github.com:hohanov/memory-game.git
   cd memory-game
   ```

2. Open `index.html` in your browser — double-click it.
