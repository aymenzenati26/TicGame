const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.querySelector('.restart-button');
const startAIButton = document.querySelector('.start-ai-button');
const twoPlayerButton = document.querySelector('.two-player-button');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let playAgainstAI = false; // Flag to check if AI mode is enabled

// Winning conditions
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

// Cell click handling
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Button click handling
restartButton.addEventListener('click', restartGame);
startAIButton.addEventListener('click', startAIGame);
twoPlayerButton.addEventListener('click', startTwoPlayerGame);

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || (playAgainstAI && currentPlayer === 'O')) {
        return; // Ignore invalid clicks
    }

    // Player's move
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkForWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Au tour du joueur ${currentPlayer}`;

        // AI's move if playing against AI
        if (playAgainstAI && currentPlayer === 'O') {
            setTimeout(handleComputerMove, 500); // Slight delay for AI's move
        }
    }
}

function handleComputerMove() {
    const bestMove = minimax(gameState, 'O').index;
    gameState[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;

    checkForWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Au tour du joueur ${currentPlayer}`;
    }
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
            winCondition.forEach(index => {
                cells[index].classList.add('win'); // Highlight the winning cells
            });
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
}

function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Au tour du joueur ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win'); // Remove the winning highlight
    });
}

function startAIGame() {
    restartGame(); // Restart the game
    playAgainstAI = true; // Enable AI mode
    statusText.textContent = "You are playing against the AI";
}

function startTwoPlayerGame() {
    restartGame(); // Restart the game
    playAgainstAI = false; // Disable AI mode
    statusText.textContent = "Two players mode: Au tour du joueur X";
}

// Minimax algorithm for hard AI
function minimax(newGameState, player) {
    const availableCells = newGameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWinner(newGameState, 'O')) return { score: 10 };
    if (checkWinner(newGameState, 'X')) return { score: -10 };
    if (availableCells.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableCells.length; i++) {
        let move = {};
        move.index = availableCells[i];

        // Make the move
        newGameState[move.index] = player;

        // Evaluate the move using recursion with minimax
        if (player === 'O') {
            const result = minimax(newGameState, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newGameState, 'O');
            move.score = result.score;
        }

        // Undo the move
        newGameState[move.index] = '';

        // Add the evaluated move to the list of moves
        moves.push(move);
    }

    // Choose the best move
    let bestMove;
    if (player === 'O') {
        // Maximizing for 'O'
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        // Minimizing for 'X'
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

// Check winner utility function for the minimax algorithm
function checkWinner(state, player) {
    return winningConditions.some(condition => {
        return condition.every(index => state[index] === player);
    });
}
