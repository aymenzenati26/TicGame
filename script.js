const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.querySelector('.restart-button');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

// Combinaisons gagnantes
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Gestion des clics sur les cellules
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Gestion du clic sur le bouton de redémarrage
restartButton.addEventListener('click', restartGame);

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkForWinner();
}

function checkForWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Le joueur ${currentPlayer} a gagné !`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = "Match nul !";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Au tour du joueur ${currentPlayer}`;
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Au tour du joueur ${currentPlayer}`;
    cells.forEach(cell => cell.textContent = '');
}