const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

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
    name;
    score;
    constructor(name){
        this.name = name;
        this.score = 0;
    }
}

async function round(player1, player2, i, rl){
    const board = new Board();
    let roundOver = false;
    console.log(`---`)
    console.log(`Round ${i+1} START`)

    console.log("Who starts?");
    let player;

    if (Math.random() < 0.5){
        console.log(`Player 1 : ${player1.name} starts`);
        player = 1;
    } else {
        console.log(`Player 2 : ${player2.name} starts`);
        player = 2;
    }

    while(!roundOver){
        let move = false;
        while(!move){
            // Mostro la Board
            console.log(`Board:`);

            console.log(`|${board.cells[0].state}|${board.cells[1].state}|${board.cells[2].state}|`);
            console.log(`|${board.cells[3].state}|${board.cells[4].state}|${board.cells[5].state}|`);
            console.log(`|${board.cells[6].state}|${board.cells[7].state}|${board.cells[8].state}|`);

            let cell = await rl.question(`Player ${player} choose a cell: `);
            cell = parseInt(cell)
            if(board.availableCells.includes(cell)){
                // Rimuovo la cella da quelle disponibili
                board.availableCells = board.availableCells.filter(cellNumber => cellNumber !== cell);
                // Imposto lo stato della cella
                if(player === 1){
                    board.cells[cell].state = "O"
                } else {
                    board.cells[cell].state = "X"
                }
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

    console.log(`Player 1 ${player1.name} score: ${player1.score}`);
    console.log(`Player 2 ${player2.name} score: ${player2.score}`);

    console.log(`Round ${i+1} END`)
    console.log(`---`)
}

function checkWinner(board,player1,player2){

    // Linee orizzontali
    if(board.cells[0].state === "O" && board.cells[1].state === "O" && board.cells[2].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[0].state === "X" && board.cells[1].state === "X" && board.cells[2].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }
    if(board.cells[3].state === "O" && board.cells[4].state === "O" && board.cells[5].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[3].state === "X" && board.cells[4].state === "X" && board.cells[5].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }
    if(board.cells[6].state === "O" && board.cells[7].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[6].state === "X" && board.cells[7].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }

    // Linee verticali
    if(board.cells[0].state === "O" && board.cells[3].state === "O" && board.cells[6].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[0].state === "X" && board.cells[3].state === "X" && board.cells[6].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }
    if(board.cells[1].state === "O" && board.cells[4].state === "O" && board.cells[7].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[1].state === "X" && board.cells[4].state === "X" && board.cells[7].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }
    if(board.cells[2].state === "O" && board.cells[5].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[2].state === "X" && board.cells[5].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }

    // Diagonali
    if(board.cells[0].state === "O" && board.cells[4].state === "O" && board.cells[8].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[0].state === "X" && board.cells[4].state === "X" && board.cells[8].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }
    if(board.cells[2].state === "O" && board.cells[4].state === "O" && board.cells[6].state === "O"){
        player1.score += 1;
        console.log(`Player 1 : ${player1.name} won!`);
        return true;
    } else if(board.cells[2].state === "X" && board.cells[4].state === "X" && board.cells[6].state === "X"){
        player2.score += 1;
        console.log(`Player 2 : ${player2.name} won!`);
        return true;
    }

    return false;
}

async function game() {
    console.log("Game Start");
    const rl = readline.createInterface({ input, output });
    const nRounds = 3
    const player1 = new Player();
    const player2 = new Player();
    //player1.name = prompt("Insert Player 1 (O) Name:");
    player1.name = "Mario";
    console.log(player1.name);
    // player2.name = prompt("Insert Player 2 (X) Name:");
    player2.name = "Luigi";
    console.log(player2.name);

    for (let i = 0; i < nRounds; i++) {
        await round(player1, player2, i, rl);
        if(player1.score > nRounds/2){
            console.log(`Player 1 : ${player1.name} WON THE GAME!`);
            rl.close();
            return
        } else if(player2.score > nRounds/2){
            console.log(`Player 2 : ${player2.name} WON THE GAME!`);
            rl.close();
            return
        }
    }
}


game();