function init() {
  const header = document.createElement('header');
  const main = document.createElement('main');
  const footer = document.createElement('footer');

  const newGameButton = document.createElement('button');
  newGameButton.textContent = 'New Game';

  const leaderboardButton = document.createElement('button');
  leaderboardButton.textContent = 'Leaderboard';

  header.append(newGameButton, leaderboardButton);
  document.body.append(header, main, footer);
}

init();
