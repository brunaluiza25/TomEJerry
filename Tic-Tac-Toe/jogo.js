const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector("[data-board]");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessage = document.querySelector("[data-winning-message]");
const restartButton = document.querySelector("[data-restart-button]");
const scoreTomElement = document.querySelector(".score-tom");
const scoreJerryElement = document.querySelector(".score-jerry");
const scoreRoundElement = document.querySelector(".score-round");
const currentTurnElement = document.querySelector(".current-player-name");

let isJerryTurn;
let round = 0;
let scoreTom = 0;
let scoreJerry = 0;

const totalRounds = 5; // Número total de rodadas

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const startGame = () => {
  isJerryTurn = false;
  round++;

  scoreRoundElement.innerText = `Rodada: ${round}`;

  for (const cell of cellElements) {
    cell.classList.remove("jerry");
    cell.classList.remove("tom");
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
    cell.innerHTML = "";
    cell.style.backgroundImage = "";
    cell.classList.remove("winner"); // Remova a classe "winner" das células
  }

  setBoardHoverClass();
  winningMessage.classList.remove("show-winning-message");
};

const endGame = () => {
  if (scoreTom > scoreJerry) {
    winningMessageTextElement.innerText = "Tom Venceu o Jogo!";
  } else if (scoreJerry > scoreTom) {
    winningMessageTextElement.innerText = "Jerry Venceu o Jogo!";
  } else {
    winningMessageTextElement.innerText = "Jogo empatado!";
  }

  winningMessage.classList.add("show-winning-message");

  if (round >= totalRounds) {
    round = 0;
    scoreTom = 0;
    scoreJerry = 0;
    updateScore();
  } else {
    // Inicie a próxima rodada após algum atraso (por exemplo, 2 segundos)
    setTimeout(() => {
      startGame();
    }, 2000); // Atraso de 2 segundos
  }
};

const updateScore = () => {
  scoreTomElement.innerText = `Tom: ${scoreTom}`;
  scoreJerryElement.innerText = `Jerry: ${scoreJerry}`;
};

const checkForWin = (currentPlayer) => {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentPlayer);
    });
  });
};

const checkForDraw = () => {
  return [...cellElements].every((cell) => {
    return cell.classList.contains("tom") || cell.classList.contains("jerry");
  });
};

const placeMark = (cell, classToAdd) => {
  cell.classList.add(classToAdd);
};

const setBoardHoverClass = () => {
  board.classList.remove("jerry");
  board.classList.remove("tom");

  if (isJerryTurn) {
    board.classList.add("jerry");
  } else {
    board.classList.add("tom");
  }

  currentTurnElement.innerText = isJerryTurn ? "Jerry" : "Tom";
};

const swapTurns = () => {
  isJerryTurn = !isJerryTurn;
  setBoardHoverClass();
};

const handleClick = (e) => {
  const cell = e.target;
  const classToAdd = isJerryTurn ? "jerry" : "tom";

  placeMark(cell, classToAdd);

  const isWin = checkForWin(classToAdd);
  const isDraw = checkForDraw();

  if (isWin) {
    if (isJerryTurn) {
      scoreJerry++;
    } else {
      scoreTom++;
    }
    updateScore();

    // Adicione a classe "winner" às células vencedoras
    const winningCells = winningCombinations
      .filter((combination) => combination.every((index) => cellElements[index].classList.contains(classToAdd)))
      .flat();

    winningCells.forEach((index) => {
      cellElements[index].classList.add("winner");
    });

    // Inicie a próxima rodada após algum atraso (por exemplo, 2 segundos)
    setTimeout(() => {
      if (round <= totalRounds) {
        startGame();
      } else {
        endGame();
      }
    }, 2000); // Atraso de 2 segundos
  } else if (isDraw) {
    // Inicie a próxima rodada após algum atraso (por exemplo, 2 segundos)
    setTimeout(() => {
      if (round <= totalRounds) {
        startGame();
      } else {
        endGame();
      }
    }, 2000); // Atraso de 2 segundos
  } else {
    swapTurns();
  }
};

startGame();

restartButton.addEventListener("click", startGame);
