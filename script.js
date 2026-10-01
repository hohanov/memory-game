let cells = [];       // массив HTMLDivElement
let cards = [];       // массив 16 ссылок
let openedCards = []; // массив индексов
let foundCards = [];  // массив индексов
let board = null;
let moves = 0;
let movesCounter = null;
let pairsCounter = null;

async function init() {
  const header = document.createElement('header');
  const main = document.createElement('main');
  const footer = document.createElement('footer');

  const newGameButton = document.createElement('button');
  newGameButton.textContent = 'New Game';

  const leaderboardButton = document.createElement('button');
  leaderboardButton.textContent = 'Leaderboard';

  movesCounter = document.createElement('span');
  movesCounter.classList.add('moves');
  movesCounter.textContent = `Moves: ${moves}`;

  pairsCounter = document.createElement('span');
  pairsCounter.classList.add('pairs');
  pairsCounter.textContent = `Pairs: ${foundCards.length / 2}`;

  header.append(newGameButton, leaderboardButton);
  footer.append(movesCounter, pairsCounter);
  document.body.append(header, main, footer);

  board = main;
  cells = createGrid(main);

  const images = await getUniqueBirdImages(); // массив 8 ссылок
  cards = createMixedPairs(images);
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
  gridCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      openCard(index);
    });
  });
}

function openCard(index) {
  console.log(index)
  if (
    openedCards.length === 2
    || openedCards.includes(index)
    || foundCards.includes(index)
  ) {
    return;
  }

  cells[index].classList.add('flipped');
  openedCards.push(index);

  if (openedCards.length === 2) {
    board.classList.add('locked');
    checkOpenedCards();
  }
}

function checkOpenedCards() {
  const [firstIndex, secondIndex] = openedCards;

  moves++;
  movesCounter.textContent = `Moves: ${moves}`;

  if (cards[firstIndex] === cards[secondIndex]) {
    foundCards.push(firstIndex, secondIndex);
    pairsCounter.textContent = `Pairs: ${foundCards.length / 2}`;
    openedCards = [];
    board.classList.remove('locked');
    return;
  }

  setTimeout(() => {
    cells[firstIndex].classList.remove('flipped');
    cells[secondIndex].classList.remove('flipped');
    openedCards = [];
    board.classList.remove('locked');
  }, 1500);
}

init();
