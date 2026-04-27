const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const nRounds = 5;
let actualRound = 1;
const player1El  = document.querySelector('.player1');
const player2El  = document.querySelector('.player2');
const p1scoreEl  = document.querySelector('.p1score .score-value');
const p2scoreEl  = document.querySelector('.p2score .score-value');
const htmlRound  = document.querySelector('.nRound');
const cells      = document.querySelectorAll('.cell');
const gameModal  = document.getElementById('game-modal');
const modalCard  = document.getElementById('modal-card');
const modalTitle = document.getElementById('modal-title');
const modalBtn   = document.getElementById('modal-btn');
const drawBanner = document.getElementById('draw-banner');

htmlRound.textContent = 'Round ' + actualRound + ' / ' + nRounds;

const P1_COLOR = '#C2185B';
const P2_COLOR = '#1565C0';

class Cell {
    constructor(cellNumber) { this.cellNumber = cellNumber; this.state = ''; }
}

class Board {
    constructor() {
        this.cells = Array.from({length: 9}, (_, i) => new Cell(i));
        this.availableCells = this.cells.map(c => c.cellNumber);
    }
}

class Player { constructor() { this.score = 0; } }

/* Riferimenti globali per il reset */
let gameP1, gameP2;

function highlightPlayer(player, state) {
    player1El.classList.remove('active', 'winner');
    player2El.classList.remove('active', 'winner');
    const cls = state === 'victory' ? 'winner' : 'active';
    if (player === 1) player1El.classList.add(cls);
    else              player2El.classList.add(cls);
}

async function cellSelection() {
    return new Promise(resolve => {
        const allCells = document.querySelectorAll('.cell');
        const handleClick = (e) => {
            allCells.forEach(c => c.removeEventListener('click', handleClick));
            resolve(e.target.id);
        };
        allCells.forEach(c => c.addEventListener('click', handleClick));
    });
}

function refreshBoard(boardCells) {
    boardCells.forEach(cell => {
        const el = document.querySelector('#c' + cell.cellNumber);
        if (cell.state === 'O') { el.style.color = P1_COLOR; el.innerText = 'O'; }
        else if (cell.state === 'X') { el.style.color = P2_COLOR; el.innerText = 'X'; }
    });
}

function advanceRound() {
    if (actualRound < nRounds) actualRound++;
    htmlRound.textContent = 'Round ' + actualRound + ' / ' + nRounds;
}

function clearBoard() {
    cells.forEach(c => { c.textContent = ''; c.style.color = ''; });
}

async function victory(player) {
    highlightPlayer(player, 'victory');
    /* aggiorna punteggio */
    if (player === 1) p1scoreEl.textContent = parseInt(p1scoreEl.textContent) + 1;
    else              p2scoreEl.textContent = parseInt(p2scoreEl.textContent) + 1;
    advanceRound();
    await wait(1200);
    clearBoard();
    player1El.classList.remove('active', 'winner');
    player2El.classList.remove('active', 'winner');
}

async function handleDraw() {
    /* Nessun punto: mostra banner e avanza il round */
    drawBanner.classList.add('show');
    advanceRound();
    await wait(1400);
    drawBanner.classList.remove('show');
    clearBoard();
    player1El.classList.remove('active', 'winner');
    player2El.classList.remove('active', 'winner');
}

function checkWinner(board, p1, p2) {
    const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    const s = board.cells;
    for (const [a,b,c] of lines) {
        if (s[a].state && s[a].state === s[b].state && s[a].state === s[c].state) {
            const winner = s[a].state === 'O' ? 1 : 2;
            if (winner === 1) p1.score++;
            else              p2.score++;
            victory(winner);
            return true;
        }
    }
    if (board.availableCells.length === 0) {
        handleDraw();   /* pareggio: nessun punto */
        return true;
    }
    return false;
}

async function round(p1, p2) {
    const board = new Board();
    let roundOver = false;
    let player = Math.random() < 0.5 ? 1 : 2;

    while (!roundOver) {
        highlightPlayer(player, 'turn');
        let move = false;
        while (!move) {
            const cellSelected = await cellSelection();
            const cell = parseInt(cellSelected.slice(1));
            if (board.availableCells.includes(cell)) {
                board.availableCells = board.availableCells.filter(n => n !== cell);
                board.cells[cell].state = player === 1 ? 'O' : 'X';
                refreshBoard(board.cells);
                move = true;
            }
        }
        roundOver = checkWinner(board, p1, p2);
        player = player === 1 ? 2 : 1;
    }
}

function showGameWinner(player) {
    const accent = player === 1 ? '#F48FB1' : '#90CAF9';
    const textCol = player === 1 ? '#C2185B' : '#1565C0';
    modalCard.style.borderColor = accent;
    modalTitle.style.color      = textCol;
    modalTitle.textContent      = `Player ${player} won the game!`;
    modalBtn.style.background   = accent;
    gameModal.classList.add('visible');
}

function resetGame() {
    /* Nascondi modale */
    gameModal.classList.remove('visible');

    /* Reset contatori */
    actualRound = 1;
    htmlRound.textContent = 'Round ' + actualRound + ' / ' + nRounds;
    p1scoreEl.textContent = '0';
    p2scoreEl.textContent = '0';

    /* Reset UI */
    clearBoard();
    player1El.classList.remove('active', 'winner');
    player2El.classList.remove('active', 'winner');

    /* Nuova partita */
    game();
}

async function game() {
    gameP1 = new Player();
    gameP2 = new Player();

    for (let i = 0; i < nRounds; i++) {
        await round(gameP1, gameP2);
        if (gameP1.score > nRounds / 2) { showGameWinner(1); return; }
        if (gameP2.score > nRounds / 2) { showGameWinner(2); return; }
    }
    /* Tutti i round esauriti: vince chi ha più punti */
    if (gameP1.score > gameP2.score)      showGameWinner(1);
    else if (gameP2.score > gameP1.score) showGameWinner(2);
    else { /* parità totale: modale neutrale */
        modalCard.style.borderColor = '#D8CCE8';
        modalTitle.style.color      = '#7B5EA7';
        modalTitle.textContent      = 'Game Draw!';
        modalBtn.style.background   = '#A084CA';
        gameModal.classList.add('visible');
    }
}

game();