let cells = [];       // массив HTMLDivElement
let cards = [];       // массив 16 ссылок
let openedCards = []; // массив индексов
let foundCards = [];  // массив индексов
let board = null;
let moves = 0;
let movesCounter = null;
let pairsCounter = null;
let activeModal = null;
let flipBackTimeout = null;

const RESULTS_STORAGE_KEY = 'memory-game-results';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createButton(text, onClick) {
  const button = createElement('button', null, text);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

async function init() {
  const header = createElement('header');
  const main = createElement('main');
  const footer = createElement('footer');

  const newGameButton = createButton('New Game', startNewGame);
  const leaderboardButton = createButton('Leaderboard', openLeaderboardModal);

  movesCounter = createElement('span', 'moves');
  pairsCounter = createElement('span', 'pairs');

  header.append(newGameButton, leaderboardButton);
  footer.append(movesCounter, pairsCounter);
  document.body.append(header, main, footer);

  board = main;
  startNewGame();
}

function startNewGame() {
  clearTimeout(flipBackTimeout);
  closeModal();

  openedCards = [];
  foundCards = [];
  moves = 0;
  updateCounters();

  board.classList.remove('locked');
  board.replaceChildren();
  cells = createGrid(board);

  const images = getUniqueBirdImages(); // массив 8 ссылок
  cards = createMixedPairs(images);
  fillCells(cells, cards);
  addFlipListeners(cells);
}

function updateCounters() {
  movesCounter.textContent = `Moves: ${moves}`;
  pairsCounter.textContent = `Pairs: ${foundCards.length / 2}`;
}

function getUniqueBirdImages() {
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
    const cell = createElement('div', 'cell');
    container.append(cell);
    gridCells.push(cell);
  }

  return gridCells;
}

function fillCells(gridCells, cards) {
  gridCells.forEach((cell, index) => {
    const front = createElement('div', 'card-front');

    const img = createElement('img');
    img.src = cards[index];
    img.alt = 'Bird';
    front.append(img);

    const back = createElement('div', 'card-back');

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

  if (cards[firstIndex] === cards[secondIndex]) {
    foundCards.push(firstIndex, secondIndex);
    updateCounters();
    openedCards = [];
    board.classList.remove('locked');

    if (foundCards.length === cards.length) {
      finishGame();
    }
    return;
  }

  updateCounters();
  flipBackTimeout = setTimeout(() => {
    cells[firstIndex].classList.remove('flipped');
    cells[secondIndex].classList.remove('flipped');
    openedCards = [];
    board.classList.remove('locked');
  }, 1500);
}

function finishGame() {
  saveResult(moves);
  openWinModal(moves);
}

function loadResults() {
  try {
    const results = JSON.parse(localStorage.getItem(RESULTS_STORAGE_KEY));
    return Array.isArray(results) ? results : [];
  } catch {
    return [];
  }
}

function saveResult(movesCount) {
  const results = loadResults();
  results.push({ moves: movesCount, date: Date.now() });
  results.sort((first, second) => first.moves - second.moves || first.date - second.date);

  try {
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results.slice(0, 10)));
  } catch {
    return;
  }
}

function formatDate(timestamp) {
  return dateFormatter.format(timestamp);
}

function openModal(...content) {
  closeModal();

  const dialog = createElement('dialog', 'modal');
  const bodyModal = createElement('div', 'modal-body');
  bodyModal.append(...content);
  dialog.append(bodyModal);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeModal();
    }
  });

  dialog.addEventListener('close', () => {
    dialog.remove();
    if (activeModal === dialog) {
      activeModal = null;
      document.body.classList.remove('modal-open');
    }
  });

  document.body.append(dialog);
  document.body.classList.add('modal-open');
  dialog.showModal();
  activeModal = dialog;
}

function closeModal() {
  if (activeModal) {
    activeModal.close();
  }
}

function openWinModal(movesCount) {
  const title = createElement('h2', 'modal-title', 'You won!');
  const text = createElement('p', 'modal-text', `Moves: ${movesCount}`);

  const actions = createElement('div', 'modal-actions');
  actions.append(
    createButton('New Game', startNewGame),
    createButton('Close', closeModal),
  );

  openModal(title, text, actions);
}

function openLeaderboardModal() {
  const title = createElement('h2', 'modal-title', 'Leaderboard');
  const results = loadResults();

  const content = results.length === 0
    ? createElement('p', 'modal-text', 'No results yet')
    : createLeaderboardTable(results);

  const actions = createElement('div', 'modal-actions');
  actions.append(createButton('Close', closeModal));

  openModal(title, content, actions);
}

function createLeaderboardTable(results) {
  const table = createElement('table', 'leaderboard');

  const headRow = createElement('tr');
  headRow.append(
    createElement('th', null, 'Place'),
    createElement('th', null, 'Moves'),
    createElement('th', null, 'Date'),
  );
  const head = createElement('thead');
  head.append(headRow);

  const body = createElement('tbody');
  results.forEach((result, index) => {
    const row = createElement('tr');
    row.append(
      createElement('td', null, String(index + 1)),
      createElement('td', null, String(result.moves)),
      createElement('td', null, formatDate(result.date)),
    );
    body.append(row);
  });

  table.append(head, body);
  return table;
}

init();
