const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const nRounds = 5
let actualRound = 1
const player1 = document.querySelector('.player1')
const player2 = document.querySelector('.player2')
const p1score = document.querySelector('.p1score')
const p2score = document.querySelector('.p2score')
const htmlRound = document.querySelector('.nRound')
htmlRound.textContent = 'Round: ' + actualRound + '/' + nRounds

const cells = document.querySelectorAll('.cell');


class Cell{
    cellNumber;
    state;
    constructor(cellNumber) {
        this.cellNumber = cellNumber;
        this.state = ""
    }

    setState(state){
        this.state = state;
    }
}

class Board{
    cells = []; // 0,1,2,3,4,5,6,7,8
    availableCells = [];
    constructor(){
        this.cells = [];
        for(let i = 0; i < 9; i++){
            this.cells.push(new Cell(i));
        }
        this.cells.forEach((cell) => {
            this.availableCells.push(cell.cellNumber);
        })
    }
}

class Player{
    score;
    constructor(){
        this.score = 0;
    }
}

function highlightPlayer(player,state){

    if(state === 'turn'){
        if(player===1){
            // Highlight player 1 - // Restore player 2
            player1.style.border = '4px solid red';
            player2.style.border = '';
        } else if(player===2){
            // Highlight player 2 - // Restore player 1
            player2.style.border = '4px solid blue';
            player1.style.border = '';
        }
    } else if(state === 'victory'){
        if(player===1){
            // Highlight player 1 - // Restore player 2
            player1.style.border = '5px solid red';
            player2.style.border = '';
        } else if(player===2){
            // Highlight player 2 - // Restore player 1
            player2.style.border = '5px solid blue';
            player1.style.border = '';
        }
    }

}

async function cellSelection() {
    // Restituiamo una Promise che si risolve solo quando una cella viene cliccata
    return new Promise((resolve) => {
        const cells = document.querySelectorAll('.cell');

        // Funzione interna per gestire il click
        const handleClick = (event) => {
            // 1. Rimuoviamo l'ascoltatore da tutte le celle (per terminare l'ascolto)
            cells.forEach(cell => cell.removeEventListener('click', handleClick));

            // 2. Risolviamo la Promise passando la cella cliccata
            resolve(event.target.id);
        };

        // Aggiungiamo l'ascoltatore a ogni cella
        cells.forEach(cell => cell.addEventListener('click', handleClick));
    });
}

function refreshBoard(boardCells){

    boardCells.forEach(cell => {
        const htmlCell = document.querySelector('#c'+ cell.cellNumber);
        if(cell.state === 'O'){
            htmlCell.style.color = 'red'
            htmlCell.innerText = 'O';
        } else if(cell.state === 'X'){
            htmlCell.style.color = 'blue'
            htmlCell.innerText = 'X';
        }
    });


}

async function round(player1, player2, i){
    const board = new Board();
    let roundOver = false;
    console.log(`---`)
    console.log(`Round ${i+1} START`)

    console.log("Who starts?");
    let player;

    if (Math.random() < 0.5){
        console.log(`Player 1 starts`);
        player = 1;
    } else {
        console.log(`Player 2 starts`);
        player = 2;
    }

    while(!roundOver){
        highlightPlayer(player,'turn')
        let move = false;
        while(!move){
            // Mostro la Board
            console.log(`Board:`);

            console.log(`|${board.cells[0].state}|${board.cells[1].state}|${board.cells[2].state}|`);
            console.log(`|${board.cells[3].state}|${board.cells[4].state}|${board.cells[5].state}|`);
            console.log(`|${board.cells[6].state}|${board.cells[7].state}|${board.cells[8].state}|`);

            let cellSelected = await cellSelection()
            cell = parseInt(cellSelected.slice(1))
            if(board.availableCells.includes(cell)){
                // Rimuovo la cella da quelle disponibili
                board.availableCells = board.availableCells.filter(cellNumber => cellNumber !== cell);
                // Imposto lo stato della cella
                if(player === 1){
                    board.cells[cell].state = "O"
                } else {
                    board.cells[cell].state = "X"
                }
                refreshBoard(board.cells)
                move = true;
            } else {
                console.log(`Cell can not be played!`);
            }
        }

        // Terminata la mossa verifico il punteggio
        roundOver = checkWinner(board,player1,player2);

        // Se nessuno ha ancora vinto switcho palayer e parte nuova mossa
        if(player === 1){
            player = 2;
        } else {
            player = 1;
        }
    }

    console.log(`Player 1 score: ${player1.score}`);
    console.log(`Player 2 score: ${player2.score}`);

    console.log(`Round ${i+1} END`)
    console.log(`---`)
}

function updateScore(player){

    if(player === 1){
        let currentText = p1score.textContent;
        let currentScore = parseInt(currentText.at(-1));
        let newScore = currentScore +=1;
        p1score.textContent = currentText.slice(0, -1) + newScore.toString();
    } else if(player === 2){
        let currentText = p2score.textContent;
        let currentScore = parseInt(currentText.at(-1));
        let newScore = currentScore +=1;
        p2score.textContent = currentText.slice(0, -1) + newScore.toString();
    }

    // Update Round
    if (actualRound <nRounds){
        actualRound += 1

    }
    htmlRound.textContent = 'Round: ' + actualRound + '/' + nRounds

}

function clearBoard(){
    cells.forEach(cell => {
        cell.textContent = '';
    });

}

async function victory(player){
    highlightPlayer(player,'victory')
    updateScore(player)
    await wait(1000);
    clearBoard()
}

function checkWinner(board,player1,player2){

    // Linee orizzontali
    if(board.cells[0].state === "O" && board.cells[1].state === "O" && board.cells[2].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[0].state === "X" && board.cells[1].state === "X" && board.cells[2].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }
    if(board.cells[3].state === "O" && board.cells[4].state === "O" && board.cells[5].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[3].state === "X" && board.cells[4].state === "X" && board.cells[5].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }
    if(board.cells[6].state === "O" && board.cells[7].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[6].state === "X" && board.cells[7].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }

    // Linee verticali
    if(board.cells[0].state === "O" && board.cells[3].state === "O" && board.cells[6].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[0].state === "X" && board.cells[3].state === "X" && board.cells[6].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }
    if(board.cells[1].state === "O" && board.cells[4].state === "O" && board.cells[7].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[1].state === "X" && board.cells[4].state === "X" && board.cells[7].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }
    if(board.cells[2].state === "O" && board.cells[5].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[2].state === "X" && board.cells[5].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }

    // Diagonali
    if(board.cells[0].state === "O" && board.cells[4].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[0].state === "X" && board.cells[4].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }
    if(board.cells[2].state === "O" && board.cells[4].state === "O" && board.cells[6].state === "O"){
        player1.score += 1;
        console.log(`Player 1 won!`);
        victory(1)
        return true;
    } else if(board.cells[2].state === "X" && board.cells[4].state === "X" && board.cells[6].state === "X"){
        player2.score += 1;
        console.log(`Player 2 won!`);
        victory(2)
        return true;
    }

    return false;
}

async function game() {
    console.log("Game Start");
    const player1 = new Player();
    const player2 = new Player();

    for (let i = 0; i < nRounds; i++) {
        await round(player1, player2, i);
        if(player1.score > nRounds/2){
            console.log(`Player 1 WON THE GAME!`);
            return
        } else if(player2.score > nRounds/2){
            console.log(`Player 2 WON THE GAME!`);
            return
        }
    }
}


game();