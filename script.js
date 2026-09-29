let cells = [];

async function init() {
  const header = document.createElement('header');
  const main = document.createElement('main');
  const footer = document.createElement('footer');

  const newGameButton = document.createElement('button');
  newGameButton.textContent = 'New Game';

  const leaderboardButton = document.createElement('button');
  leaderboardButton.textContent = 'Leaderboard';

  header.append(newGameButton, leaderboardButton);
  document.body.append(header, main, footer);

  cells = createGrid(main);

  const images = await getUniqueBirdImages();
  const cards = createMixedPairs(images);
  fillCells(cells, cards);
  addFlipListeners(cells);
}


async function getUniqueBirdImages() {
  const allImages = [];

  for (let currentIndex = 1; currentIndex <= 33; currentIndex++) {
    const fileName = String(currentIndex).padStart(2, '0');
    allImages.push(`images/${fileName}.webp`);
  }

  const images = [];

  while (images.length < 8) {
    const image = allImages[Math.floor(Math.random() * allImages.length)];
    if (!images.includes(image)) {
      images.push(image);
    }
  }

  return images;
}

function createMixedPairs(images) {
  const cards = [...images, ...images];

  // Метод тасования Фишера–Йетса
  for (let currentIndex = cards.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    const currentCard = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = currentCard;
  }

  return cards;
}

function createGrid(container) {
  const gridCells = [];

  for (let currentIndex = 0; currentIndex < 16; currentIndex++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    container.append(cell);
    gridCells.push(cell);
  }

  return gridCells;
}

function fillCells(gridCells, cards) {
  gridCells.forEach((cell, index) => {
    const front = document.createElement('div');
    front.classList.add('card-front');

    const img = document.createElement('img');
    img.src = cards[index];
    img.alt = 'Bird';
    front.append(img);

    const back = document.createElement('div');
    back.classList.add('card-back');

    cell.append(front, back);
  });
}

function addFlipListeners(gridCells) {
  gridCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      cell.classList.toggle('flipped');
    });
  });
}

init();
